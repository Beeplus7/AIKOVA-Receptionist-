/**
 * Public readiness probe — reports which secrets exist (never returns values).
 */
import { corsHeaders, json } from '../_shared/cors.ts'
import { hasSecret } from '../_shared/client.ts'

const KEY_MISSING = 'API key not configured - check /readiness'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const openai = hasSecret('OPENAI_API_KEY')
    const anthropic = hasSecret('ANTHROPIC_API_KEY')
    const elevenlabs = hasSecret('ELEVENLABS_API_KEY')
    const coqui = hasSecret('COQUI_TTS_URL')
    const at =
      (hasSecret('AFRICAS_TALKING_API_KEY') || hasSecret('AFRICASTALKING_API_KEY')) &&
      (hasSecret('AFRICAS_TALKING_USERNAME') || hasSecret('AFRICASTALKING_USERNAME') || true)
    const atKey = hasSecret('AFRICAS_TALKING_API_KEY') || hasSecret('AFRICASTALKING_API_KEY')
    const twilio = hasSecret('TWILIO_ACCOUNT_SID') && hasSecret('TWILIO_AUTH_TOKEN')
    const twilioFrom = hasSecret('TWILIO_PHONE_NUMBER') || hasSecret('TWILIO_FROM')
    const stripe = hasSecret('STRIPE_SECRET_KEY') || hasSecret('STRIPE_SECRET')

    const tts = elevenlabs || coqui
    const voicePass = openai && twilio && tts

    return json({
      ok: true,
      fn: 'readiness-check',
      schemaVersion: 1,
      checkedAt: new Date().toISOString(),
      providers: {
        openai: openai ? 'ok' : 'missing',
        anthropic: anthropic ? 'ok' : 'missing',
        elevenlabs: elevenlabs ? 'ok' : 'missing',
        coqui: coqui ? 'ok' : 'missing',
        africas_talking: atKey ? 'ok' : 'missing',
        twilio: twilio ? 'ok' : 'missing',
        twilio_from: twilioFrom ? 'ok' : 'missing',
        stripe: stripe ? 'ok' : 'missing',
        supabase: 'ok',
      },
      voicePass,
      hint: voicePass ? null : KEY_MISSING,
    })
  } catch (e) {
    return json({ ok: false, error: e instanceof Error ? e.message : String(e), hint: KEY_MISSING }, 500)
  }
})
