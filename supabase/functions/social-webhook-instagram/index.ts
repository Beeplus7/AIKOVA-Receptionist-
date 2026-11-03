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
    await logEdge(supabase, 'social-webhook-instagram', body)

    const trigger = String(body.trigger_text || body.text || 'How much?')
    const { data: social, error } = await supabase
      .from('social_conversions')
      .insert({
        business_id: businessId,
        platform: 'instagram',
        trigger_type: body.trigger_type || 'comment',
        trigger_text: trigger,
        auto_dm_sent: false,
        status: 'open',
      })
      .select()
      .single()
    if (error) throw error

    const { data: conv } = await supabase
      .from('conversations')
      .insert({
        business_id: businessId,
        contact_name: body.contactName || 'IG commenter',
        contact_channel: 'instagram_comment',
        region: body.region || 'africa',
        intent: 'social_sale',
        sentiment: 'positive',
        ai_confidence: 0.9,
        status: 'new',
        preview: trigger,
        tags: ['instagram', 'simulate'],
      })
      .select()
      .single()

    const payload: EdgeOk = {
      ok: true,
      fn: 'social-webhook-instagram',
      mode: 'demo',
      schemaVersion: 1,
      degraded: true,
      social,
      conversation: conv,
      latency_ms: Date.now() - started,
      note: 'Meta tokens not required for simulate inserts',
    }
    return json(payload)
  } catch (e) {
    return json({ ok: false, error: e instanceof Error ? e.message : String(e) }, 500)
  }
})
