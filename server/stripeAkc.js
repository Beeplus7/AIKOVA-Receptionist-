import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const APP_URL = (process.env.VITE_APP_URL || process.env.EXPO_PUBLIC_APP_URL || 'https://ai-receptionist.aikova.co.uk').replace(/\/$/, '')
const SUPABASE_URL = (process.env.VITE_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '')
const SUPABASE_ANON = process.env.VITE_SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ''
const SUPABASE_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const sbOpts = {
  auth: { persistSession: false, autoRefreshToken: false },
  realtime: { transport: ws },
}

function stripeClient() {
  const key = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET || ''
  if (!key) return null
  return new Stripe(key, { apiVersion: '2024-11-20.acacia' })
}

function adminClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE) return null
  return createClient(SUPABASE_URL, SUPABASE_SERVICE, sbOpts)
}

function anonAuthClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON) return null
  return createClient(SUPABASE_URL, SUPABASE_ANON, sbOpts)
}

function currencyForRegion(region) {
  if (region === 'eurozone') return { currency: 'eur', centsField: 'eur_cents' }
  if (region === 'uk') return { currency: 'gbp', centsField: 'eur_cents' }
  return { currency: 'usd', centsField: 'usd_cents' }
}

export function stripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET)
}

/** POST /api/create-akc-checkout — Bearer Supabase JWT + { packKey, region? } */
export async function createAkcCheckout(req, res) {
  const stripe = stripeClient()
  const admin = adminClient()
  const authSb = anonAuthClient()
  if (!stripe || !admin || !authSb) {
    return res.status(503).json({ error: 'stripe_or_supabase_not_configured' })
  }

  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!token) return res.status(401).json({ error: 'missing session token' })

  const {
    data: { user },
    error: authError,
  } = await authSb.auth.getUser(token)
  if (authError || !user) return res.status(401).json({ error: 'invalid or expired session' })

  const packKey = req.body?.packKey
  const region = req.body?.region || 'eurozone'
  if (!packKey || typeof packKey !== 'string') {
    return res.status(400).json({ error: 'packKey required' })
  }

  const { data: pack, error: packErr } = await admin
    .from('akc_packs')
    .select('pack_key, akc_amount, usd_cents, eur_cents, label')
    .eq('pack_key', packKey)
    .eq('active', true)
    .maybeSingle()
  if (packErr || !pack) return res.status(400).json({ error: 'invalid pack' })

  const { data: biz } = await admin
    .from('businesses')
    .select('id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()
  if (!biz?.id) return res.status(400).json({ error: 'no_business' })

  const { currency, centsField } = currencyForRegion(region)
  const unitAmount = Number(pack[centsField] || pack.usd_cents)

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: user.email || undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: unitAmount,
            product_data: {
              name: pack.label,
              description: `${pack.akc_amount.toLocaleString()} AiKOVA Credits (AKC)`,
            },
          },
        },
      ],
      metadata: {
        type: 'akc_pack',
        userId: user.id,
        businessId: biz.id,
        packKey: pack.pack_key,
        akcAmount: String(pack.akc_amount),
        region: String(region),
      },
      success_url: `${APP_URL}/app/billing?region=${encodeURIComponent(region)}&akc_ok=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/app/billing?region=${encodeURIComponent(region)}&akc_cancel=1`,
      allow_promotion_codes: true,
    })
    return res.status(200).json({ url: session.url, sessionId: session.id })
  } catch (err) {
    console.error('[create-akc-checkout]', err.message)
    return res.status(500).json({ error: 'checkout session creation failed' })
  }
}

/** POST /api/stripe-akc-webhook — raw body required */
export async function stripeAkcWebhook(req, res) {
  const stripe = stripeClient()
  const admin = adminClient()
  if (!stripe || !admin) {
    return res.status(503).json({ error: 'stripe_or_supabase_not_configured' })
  }

  const sig = req.headers['stripe-signature']
  const secret = process.env.STRIPE_AKC_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET || ''
  if (!secret) {
    console.error('[stripe-akc-webhook] missing STRIPE_AKC_WEBHOOK_SECRET')
    return res.status(500).json({ error: 'webhook_secret_missing' })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, secret)
  } catch (err) {
    console.error('[stripe-akc-webhook] signature failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type !== 'checkout.session.completed') {
    return res.status(200).json({ received: true, ignored: event.type })
  }

  const session = event.data.object
  if (session.metadata?.type !== 'akc_pack') {
    return res.status(200).json({ received: true, skipped: 'not_akc_pack' })
  }

  const userId = session.metadata?.userId
  const packKey = session.metadata?.packKey
  if (!userId || !packKey) {
    console.error('[stripe-akc-webhook] missing metadata on', session.id)
    return res.status(200).json({ received: true, skipped: 'bad_metadata' })
  }

  if (session.payment_status !== 'paid' && session.status !== 'complete') {
    return res.status(200).json({ received: true, skipped: 'not_paid' })
  }

  const { data, error } = await admin.rpc('akc_credit_stripe_pack', {
    p_user_id: userId,
    p_pack_key: packKey,
    p_stripe_session_id: session.id,
  })
  if (error) {
    console.error('[stripe-akc-webhook] credit failed:', error.message)
    return res.status(500).json({ error: 'credit_failed' })
  }
  console.log('[stripe-akc-webhook] credited', packKey, 'for', userId, data)
  return res.status(200).json({ received: true, credited: data })
}
