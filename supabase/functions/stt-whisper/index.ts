import { corsHeaders, json } from '../_shared/cors.ts'
import { logEdge, serviceClient, hasSecret, type EdgeOk } from '../_shared/client.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const supabase = serviceClient()
    const body = req.method === 'GET' ? {} : await req.json().catch(() => ({}))
    const started = Date.now()
    await logEdge(supabase, 'stt-whisper', body)

    const live = hasSecret('OPENAI_API_KEY')
    const transcript =
      body.transcript ||
      (typeof body.audioUrl === 'string'
        ? '[Demo STT] Caller asked about booking and payment options.'
        : '[Demo STT] No audioUrl — return mock transcript until OPENAI_API_KEY is set.')

    if (body.callId && body.businessId) {
      await supabase
        .from('calls')
        .update({ transcript, status: 'completed' })
        .eq('id', body.callId)
        .eq('business_id', body.businessId)
    }

    const payload: EdgeOk = {
      ok: true,
      fn: 'stt-whisper',
      mode: live ? 'live' : 'demo',
      schemaVersion: 1,
      degraded: !live,
      transcript,
      latency_ms: Date.now() - started,
      region: body.region ?? 'full',
      note: live ? 'OPENAI present — wire Whisper multipart next' : 'Mock transcript (OPENAI_API_KEY missing)',
    }
    return json(payload)
  } catch (e) {
    return json({ ok: false, error: e instanceof Error ? e.message : String(e) }, 500)
  }
})
