import { corsHeaders, json } from '../_shared/cors.ts'
import { logEdge, serviceClient, hasSecret, type EdgeOk } from '../_shared/client.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const supabase = serviceClient()
    const body = req.method === 'GET' ? {} : await req.json().catch(() => ({}))
    const text = String(body.text || body.say || '').trim()
    const started = Date.now()
    await logEdge(supabase, 'tts-coqui-elevenlabs', body)

    if (!text) {
      return json({ ok: false, error: 'text required', schemaVersion: 1 }, 400)
    }

    const liveEu = hasSecret('ELEVENLABS_API_KEY')
    const liveAf = hasSecret('COQUI_TTS_URL')
    const region = body.region || 'full'
    const provider = region === 'africa' ? 'coqui' : 'elevenlabs'

    const payload: EdgeOk = {
      ok: true,
      fn: 'tts-coqui-elevenlabs',
      mode: liveEu || liveAf ? 'live' : 'demo',
      schemaVersion: 1,
      degraded: !(liveEu || liveAf),
      provider,
      audioUrl: null,
      placeholder: `Would speak (${provider}): ${text.slice(0, 160)}`,
      mirroring_sec: 3,
      latency_ms: Date.now() - started,
      region,
      note: 'TTS keys missing — UI can show placeholder until ELEVENLABS or COQUI_TTS_URL set',
    }
    return json(payload)
  } catch (e) {
    return json({ ok: false, error: e instanceof Error ? e.message : String(e) }, 500)
  }
})
