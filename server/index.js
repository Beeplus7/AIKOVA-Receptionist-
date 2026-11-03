import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import {
  createRecord,
  deleteRecord,
  listRecords,
  replaceRecord,
} from './db.js'
import { exchangeGoogleIdToken } from './googleAuth.js'
import {
  claimAdmin,
  createAdminByAdmin,
  getAdminStatus,
  isAdminUser,
  listAdmins,
} from './adminUsers.js'
import {
  createAkcCheckout,
  stripeAkcWebhook,
  stripeConfigured,
} from './stripeAkc.js'

const PORT = Number(process.env.CRM_API_PORT || 3016)
const SUPABASE_URL = (process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').replace(/\/$/, '')
const SUPABASE_ANON = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''
const ALLOWED = (
  process.env.CRM_CORS_ORIGINS ||
  'https://ai-receptionist.aikova.co.uk,https://aikova.co.uk,http://localhost:5173,http://localhost:8081,http://127.0.0.1:8081'
)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const app = express()
app.use(
  cors({
    origin(origin, cb) {
      if (!origin || ALLOWED.includes(origin) || ALLOWED.includes('*')) {
        return cb(null, true)
      }
      return cb(null, false)
    },
    credentials: true,
  }),
)

// Stripe webhook MUST see raw body (before json parser)
app.post(
  '/api/stripe-akc-webhook',
  express.raw({ type: 'application/json' }),
  (req, res) => void stripeAkcWebhook(req, res),
)

app.use(express.json({ limit: '2mb' }))

async function verifySupabaseUser(token) {
  if (!SUPABASE_URL || !SUPABASE_ANON) return null
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      apikey: SUPABASE_ANON,
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) return null
  return res.json()
}

async function requireUser(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!token) {
    if (process.env.CRM_ALLOW_ANON === '1') {
      req.user = null
      return next()
    }
    return res.status(401).json({ error: 'missing bearer token' })
  }

  try {
    const user = await verifySupabaseUser(token)
    if (!user?.id) {
      return res.status(401).json({ error: 'invalid session' })
    }
    req.user = user
    return next()
  } catch {
    return res.status(401).json({ error: 'auth verify failed' })
  }
}

async function requireAdmin(req, res, next) {
  await requireUser(req, res, async () => {
    if (!isAdminUser(req.user)) {
      return res.status(403).json({ error: 'admin access required' })
    }
    return next()
  })
}

async function handleActions(req, res) {
  try {
    const { action, args = {} } = req.body || {}
    if (!action) return res.status(400).json({ error: 'action required' })

    if (action === 'records.list') {
      return res.json({
        data: listRecords(String(args.collection || ''), Number(args.limit || 100)),
      })
    }
    if (action === 'records.create') {
      return res.json({
        data: createRecord(
          String(args.collection || ''),
          args.value,
          args.idempotency_key,
          args.id,
        ),
      })
    }
    if (action === 'records.replace') {
      return res.json({
        data: replaceRecord(
          String(args.collection || ''),
          String(args.id || ''),
          args.value,
        ),
      })
    }
    if (action === 'records.delete') {
      return res.json({
        data: deleteRecord(String(args.collection || ''), String(args.id || '')),
      })
    }

    return res.status(400).json({ error: `unknown action: ${action}` })
  } catch (err) {
    const status = err.status || 500
    return res.status(status).json({ error: err.message || 'server error' })
  }
}

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'aikova-receptionist-api',
    supabaseUrl: Boolean(SUPABASE_URL),
    stripe: stripeConfigured(),
    google: Boolean(
      process.env.GOOGLE_CLIENT_ID || process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_OAUTH_CLIENT_ID,
    ),
    time: new Date().toISOString(),
  })
})

function envFlag(...keys) {
  return keys.some((k) => Boolean(String(process.env[k] || '').trim()))
}

function stripeMode() {
  const key = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET || ''
  if (!key) return 'missing'
  if (key.startsWith('sk_live')) return 'live'
  if (key.startsWith('sk_test')) return 'test'
  return 'ok'
}

/** Live readiness JSON for /readiness page + Meta/ops */
app.get('/api/readiness', async (_req, res) => {
  const openai = envFlag('OPENAI_API_KEY')
  const elevenlabs = envFlag('ELEVENLABS_API_KEY')
  const coqui = envFlag('COQUI_TTS_URL')
  const africasTalking = envFlag('AFRICAS_TALKING_API_KEY', 'AFRICASTALKING_API_KEY')
  const twilio = envFlag('TWILIO_ACCOUNT_SID') && envFlag('TWILIO_AUTH_TOKEN')
  const supabase = Boolean(SUPABASE_URL && SUPABASE_ANON)
  const stripe = stripeMode()

  let edge = null
  try {
    if (SUPABASE_URL && SUPABASE_ANON) {
      const r = await fetch(`${SUPABASE_URL}/functions/v1/readiness-check`, {
        headers: { Authorization: `Bearer ${SUPABASE_ANON}`, apikey: SUPABASE_ANON },
      })
      edge = await r.json().catch(() => null)
    }
  } catch {
    edge = { ok: false, error: 'edge probe failed' }
  }

  const merge = (serverVal, edgeKey) => {
    const e = edge?.providers?.[edgeKey]
    if (e === 'ok' || serverVal === 'ok' || serverVal === true) return 'ok'
    if (typeof serverVal === 'string' && serverVal !== 'missing') return serverVal
    return e || (serverVal ? 'ok' : 'missing')
  }

  const payload = {
    openai: merge(openai, 'openai'),
    elevenlabs: merge(elevenlabs, 'elevenlabs'),
    coqui: merge(coqui, 'coqui'),
    africas_talking: merge(africasTalking, 'africas_talking'),
    twilio: merge(twilio, 'twilio'),
    supabase: supabase ? 'ok' : 'missing',
    stripe,
    edge: edge?.providers || null,
    voicePass: Boolean(
      (openai || edge?.providers?.openai === 'ok') &&
        (twilio || edge?.providers?.twilio === 'ok') &&
        (elevenlabs || coqui || edge?.providers?.elevenlabs === 'ok' || edge?.providers?.coqui === 'ok'),
    ),
    hint: 'API key not configured - check /readiness',
    checkedAt: new Date().toISOString(),
    host: 'vps',
  }
  res.json(payload)
})

app.post('/api/trial-request', (req, res) => {
  try {
    const { name, email, phone, business, category, message, linkedinTag } = req.body || {}
    if (!email && !phone) {
      return res.status(400).json({ error: 'email or phone required' })
    }
    const row = createRecord('trial_requests', {
      name: name || '',
      email: email || '',
      phone: phone || '',
      business: business || '',
      category: category || '',
      message: message || '',
      linkedinTag: linkedinTag || '',
      created: new Date().toISOString(),
      source: 'trials',
    })
    return res.json({
      ok: true,
      id: row?.id,
      next: `DM PILOT + ${linkedinTag || category || 'AIKOVA'} on LinkedIn`,
    })
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message || 'trial request failed' })
  }
})

app.post('/api/create-akc-checkout', (req, res) => void createAkcCheckout(req, res))

app.post('/auth/google', async (req, res) => {
  try {
    const idToken = req.body?.id_token || req.body?.credential
    if (!idToken) {
      return res.status(400).json({ error: 'id_token required' })
    }
    const { session, profile } = await exchangeGoogleIdToken(idToken)
    return res.json({
      data: {
        email: profile.email,
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_in: session.expires_in,
        expires_at: session.expires_at,
        token_type: session.token_type || 'bearer',
        user: session.user,
      },
    })
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message || 'google auth failed' })
  }
})

app.get('/auth/admins/status', async (_req, res) => {
  try {
    const data = await getAdminStatus()
    return res.json({ data })
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message || 'status failed' })
  }
})

app.post('/auth/claim-admin', async (req, res) => {
  try {
    const { email, password, full_name, claim_secret } = req.body || {}
    const data = await claimAdmin({
      email,
      password,
      fullName: full_name,
      claimSecret: claim_secret,
    })
    return res.json({
      data: {
        created: data.created,
        email: data.user?.email || email,
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_in: data.session.expires_in,
        user: data.session.user,
        status: data.status,
      },
    })
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message || 'claim failed' })
  }
})

app.get('/auth/admins', requireAdmin, async (_req, res) => {
  try {
    const data = await listAdmins()
    return res.json({ data })
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message || 'list failed' })
  }
})

app.post('/auth/admins', requireAdmin, async (req, res) => {
  try {
    const { email, password, full_name } = req.body || {}
    const data = await createAdminByAdmin(req.user, {
      email,
      password,
      fullName: full_name,
    })
    return res.json({
      data: {
        created: data.created,
        email: data.user?.email || email,
        admins: data.admins,
      },
    })
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message || 'create failed' })
  }
})

app.post('/actions', requireUser, handleActions)
app.post('/api/actions', requireUser, handleActions)

app.listen(PORT, '127.0.0.1', () => {
  console.log(`AiKOVA CRM API on 127.0.0.1:${PORT} stripe=${stripeConfigured()}`)
})
