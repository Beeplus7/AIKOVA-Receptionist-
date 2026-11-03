import { corsHeaders, json } from '../_shared/cors.ts'
import { logEdge, serviceClient, type EdgeOk } from '../_shared/client.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const supabase = serviceClient()
    const body = req.method === 'GET' ? {} : await req.json().catch(() => ({}))
    const businessId = body.businessId as string | undefined
    const socialId = body.socialId || body.social_conversion_id
    const started = Date.now()
    if (!businessId || !socialId) {
      return json({ ok: false, error: 'businessId and socialId required', schemaVersion: 1 }, 400)
    }
    await logEdge(supabase, 'social-auto-dm', body)

    const { data: social, error } = await supabase
      .from('social_conversions')
      .update({
        auto_dm_sent: true,
        auto_dm_at: new Date().toISOString(),
        booked: Boolean(body.booked),
        status: body.booked ? 'booked' : 'dm_sent',
      })
      .eq('id', socialId)
      .eq('business_id', businessId)
      .select()
      .single()
    if (error) throw error

    const payload: EdgeOk = {
      ok: true,
      fn: 'social-auto-dm',
      mode: 'demo',
      schemaVersion: 1,
      degraded: true,
      social,
      dmText: body.dmText || 'Thanks for your interest — reply BOOK to reserve.',
      latency_ms: Date.now() - started,
      note: 'Simulated auto-DM flag — Graph API needs Meta tokens',
    }
    return json(payload)
  } catch (e) {
    return json({ ok: false, error: e instanceof Error ? e.message : String(e) }, 500)
  }
})
