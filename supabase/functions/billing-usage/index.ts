import { corsHeaders, json } from '../_shared/cors.ts'
import { logEdge, serviceClient, type EdgeOk } from '../_shared/client.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const supabase = serviceClient()
    const body = req.method === 'GET' ? {} : await req.json().catch(() => ({}))
    const businessId = body.businessId as string | undefined
    const started = Date.now()
    if (!businessId) {
      return json({ ok: false, error: 'businessId required', schemaVersion: 1 }, 400)
    }
    await logEdge(supabase, 'billing-usage', body)

    const minutes = Number(body.minutes ?? 1)
    const conversations = Number(body.conversations ?? 0)
    const sms = Number(body.sms ?? 0)

    const { data: usage, error } = await supabase
      .from('billing_usage')
      .insert({
        business_id: businessId,
        plan: body.plan || 'starter',
        currency: body.currency || (body.region === 'eurozone' || body.region === 'uk' ? 'EUR' : 'USD'),
        minutes,
        conversations,
        sms,
        amount: body.amount ?? 0,
        period_start: body.period_start || new Date().toISOString().slice(0, 10),
        period_end: body.period_end || new Date().toISOString().slice(0, 10),
        payment_provider: body.payment_provider || null,
      })
      .select()
      .single()
    if (error) throw error

    let akc: unknown = null
    if (body.akcSpend && Number(body.akcSpend) > 0) {
      const { data } = await supabase.rpc('akc_spend', {
        p_amount: Number(body.akcSpend),
        p_service_id: body.serviceId || 'edge.billing-usage',
        p_meta: { minutes, conversations, sms },
      })
      akc = data
    }

    const payload: EdgeOk = {
      ok: true,
      fn: 'billing-usage',
      mode: 'demo',
      schemaVersion: 1,
      usage,
      akc,
      latency_ms: Date.now() - started,
      region: body.region ?? 'full',
    }
    return json(payload)
  } catch (e) {
    return json({ ok: false, error: e instanceof Error ? e.message : String(e) }, 500)
  }
})
