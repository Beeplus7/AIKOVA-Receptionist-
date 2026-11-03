/**
 * AiKOVA Instant Try — real outbound phone call (no signup).
 * Twilio primary (EU/UK/global). Africa's Talking when AFRICAS_TALKING_* set.
 *
 * Body actions:
 *  - call (default): place outbound call with <Say>
 *  - verify-start: Twilio verifies caller ID (rings phone with keypad code)
 *  - provision-from: buy a Twilio From number after verification (trial unlock)
 *  - status: poll Twilio call SID
 */
import { corsHeaders, json } from '../_shared/cors.ts'
import { logEdge, serviceClient, hasSecret } from '../_shared/client.ts'

type Body = {
  action?: 'call' | 'verify-start' | 'provision-from' | 'status'
  phone?: string
  region?: string
  lang?: string
  text?: string
  callSid?: string
  validationCode?: string
}

function twilioAuth(): string | null {
  const sid = Deno.env.get('TWILIO_ACCOUNT_SID')
  const token = Deno.env.get('TWILIO_AUTH_TOKEN')
  if (!sid || !token) return null
  return 'Basic ' + btoa(`${sid}:${token}`)
}

function twilioSid(): string | null {
  return Deno.env.get('TWILIO_ACCOUNT_SID') || null
}

function normalizeE164(raw: string): string | null {
  const cleaned = raw.replace(/[^\d+]/g, '').trim()
  if (!cleaned) return null
  let n = cleaned
  if (!n.startsWith('+')) {
    // naive: assume already country-coded digits
    if (n.length < 10) return null
    n = `+${n}`
  }
  if (!/^\+[1-9]\d{7,14}$/.test(n)) return null
  return n
}

function sayVoice(lang: string, region: string): { voice: string; language: string } {
  const l = (lang || 'en').toLowerCase()
  if (l === 'fr') return { voice: 'Polly.Lea', language: 'fr-FR' }
  if (l === 'de') return { voice: 'Polly.Vicki', language: 'de-DE' }
  if (l === 'es') return { voice: 'Polly.Lucia', language: 'es-ES' }
  if (l === 'pt') return { voice: 'Polly.Ines', language: 'pt-PT' }
  if (l === 'nl') return { voice: 'Polly.Lotte', language: 'nl-NL' }
  if (l === 'af') return { voice: 'Polly.Amy', language: 'en-ZA' }
  if (l === 'sw') return { voice: 'Polly.Amy', language: 'en-KE' }
  if (region === 'africa' || l === 'yo' || l === 'pcm' || l === 'ha' || l === 'ig' || l === 'zu') {
    return { voice: 'Polly.Amy', language: 'en-GB' }
  }
  if (region === 'uk') return { voice: 'Polly.Amy', language: 'en-GB' }
  return { voice: 'Polly.Amy', language: 'en-GB' }
}

function escapeXml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function buildTwiml(text: string, lang: string, region: string) {
  const { voice, language } = sayVoice(lang, region)
  // Short sentences already preferred by caller; Pause between for human pace
  const parts = text
    .split(/(?<=[.?!])\s+/)
    .map((p) => p.trim())
    .filter(Boolean)
  const says = parts
    .map(
      (p) =>
        `<Say voice="${voice}" language="${language}">${escapeXml(p)}</Say><Pause length="1"/>`,
    )
    .join('')
  return `<Response><Pause length="1"/>${says}<Hangup/></Response>`
}

async function getFromNumber(supabase: ReturnType<typeof serviceClient>): Promise<string | null> {
  const envFrom = Deno.env.get('TWILIO_PHONE_NUMBER') || Deno.env.get('TWILIO_FROM') || ''
  if (envFrom.trim()) return envFrom.trim()
  const { data } = await supabase.from('telephony_config').select('twilio_from').eq('id', 'default').maybeSingle()
  return (data?.twilio_from as string | undefined) || null
}

async function setFromNumber(supabase: ReturnType<typeof serviceClient>, from: string) {
  await supabase.from('telephony_config').upsert({
    id: 'default',
    twilio_from: from,
    provider: 'twilio',
    updated_at: new Date().toISOString(),
  })
}

async function rateLimited(supabase: ReturnType<typeof serviceClient>, phone: string) {
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { count } = await supabase
    .from('instant_try_calls')
    .select('id', { count: 'exact', head: true })
    .eq('phone', phone)
    .gte('created_at', since)
  return (count || 0) >= 5
}

async function placeTwilioCall(opts: {
  to: string
  from: string
  twiml: string
}) {
  const sid = twilioSid()
  const auth = twilioAuth()
  if (!sid || !auth) throw new Error('Twilio credentials missing')

  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Calls.json`, {
    method: 'POST',
    headers: {
      Authorization: auth,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      To: opts.to,
      From: opts.from,
      Twiml: opts.twiml,
    }),
  })
  const data = await res.json()
  if (!res.ok) {
    const msg = data.message || data.error_message || `Twilio HTTP ${res.status}`
    const err = new Error(msg) as Error & { code?: number; data?: unknown }
    err.code = data.code
    err.data = data
    throw err
  }
  return data as { sid: string; status: string; to: string; from: string }
}

async function placeAfricasTalkingCall(opts: { to: string; text: string }) {
  const apiKey = Deno.env.get('AFRICAS_TALKING_API_KEY') || Deno.env.get('AFRICASTALKING_API_KEY')
  const username = Deno.env.get('AFRICAS_TALKING_USERNAME') || Deno.env.get('AFRICASTALKING_USERNAME') || 'sandbox'
  const from = Deno.env.get('AFRICAS_TALKING_FROM') || Deno.env.get('AFRICASTALKING_FROM') || ''
  if (!apiKey) throw new Error('Africa’s Talking API key missing')

  // Voice: POST https://voice.africastalking.com/call
  const body: Record<string, string> = {
    username,
    to: opts.to,
  }
  if (from) body.from = from

  const res = await fetch('https://voice.africastalking.com/call', {
    method: 'POST',
    headers: {
      apiKey,
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: new URLSearchParams(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error((data as { message?: string }).message || `AT HTTP ${res.status}`)
  }
  return { ...data, note: 'AT call queued — configure voice callback to speak demo script', demoText: opts.text }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabase = serviceClient()
    const body = (await req.json().catch(() => ({}))) as Body
    const action = body.action || 'call'
    const region = body.region || 'eurozone'
    const lang = body.lang || 'en'
    const phone = body.phone ? normalizeE164(body.phone) : null

    await logEdge(supabase, 'instant-try-call', { ...body, businessId: 'instant_try_public' } as Record<string, unknown>)

    const twilioReady = hasSecret('TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN')
    const atReady = hasSecret('AFRICAS_TALKING_API_KEY') || hasSecret('AFRICASTALKING_API_KEY')

    if (action === 'status') {
      const callSid = body.callSid
      if (!callSid || !twilioReady) return json({ ok: false, error: 'callSid required' }, 400)
      const sid = twilioSid()!
      const auth = twilioAuth()!
      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Calls/${callSid}.json`, {
        headers: { Authorization: auth },
      })
      const data = await res.json()
      return json({
        ok: res.ok,
        status: data.status,
        duration: data.duration,
        answeredBy: data.answered_by,
        error: data.message,
        callSid,
      })
    }

    if (action === 'verify-start') {
      if (!twilioReady) {
        return json({
          ok: false,
          error: 'Twilio not configured',
          need: ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN'],
        }, 503)
      }
      if (!phone) return json({ ok: false, error: 'Valid E.164 phone required' }, 400)
      const sid = twilioSid()!
      const auth = twilioAuth()!
      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/OutgoingCallerIds.json`, {
        method: 'POST',
        headers: {
          Authorization: auth,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          PhoneNumber: phone,
          FriendlyName: 'AiKOVA Instant Try',
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        return json({
          ok: false,
          error: data.message || `Twilio verify failed (${res.status})`,
          code: data.code,
        }, 400)
      }
      return json({
        ok: true,
        action: 'verify-start',
        phone,
        validationCode: data.validation_code,
        callSid: data.call_sid,
        instruction:
          'Your phone will ring now. Enter this validation code on the keypad when asked, then tap Continue.',
      })
    }

    if (action === 'provision-from') {
      if (!twilioReady) return json({ ok: false, error: 'Twilio not configured' }, 503)
      const existing = await getFromNumber(supabase)
      if (existing) {
        return json({ ok: true, action: 'provision-from', from: existing, reused: true })
      }
      const sid = twilioSid()!
      const auth = twilioAuth()!
      // Prefer GB local voice number
      const avail = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${sid}/AvailablePhoneNumbers/GB/Local.json?VoiceEnabled=true&PageSize=1`,
        { headers: { Authorization: auth } },
      )
      const availData = await avail.json()
      const candidate = (availData.available_phone_numbers || [])[0]?.phone_number
      if (!candidate) {
        return json({ ok: false, error: 'No Twilio numbers available to purchase', detail: availData }, 400)
      }
      const buy = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/IncomingPhoneNumbers.json`, {
        method: 'POST',
        headers: {
          Authorization: auth,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          PhoneNumber: candidate,
          FriendlyName: 'AiKOVA Instant Try',
        }),
      })
      const bought = await buy.json()
      if (!buy.ok) {
        return json({
          ok: false,
          error: bought.message || 'Could not purchase Twilio number',
          code: bought.code,
          hint:
            bought.code === 21404
              ? 'Trial must verify a personal number first — use verify-start on your phone.'
              : 'Add Twilio billing credit or set TWILIO_PHONE_NUMBER manually.',
        }, 400)
      }
      const from = bought.phone_number as string
      await setFromNumber(supabase, from)
      return json({ ok: true, action: 'provision-from', from, sid: bought.sid })
    }

    // --- place real call ---
    if (!phone) return json({ ok: false, error: 'Valid E.164 phone required (+country…)' }, 400)

    if (await rateLimited(supabase, phone)) {
      return json({ ok: false, error: 'Rate limit: max 5 try-calls per hour for this number' }, 429)
    }

    const text =
      (body.text || '').trim() ||
      'Hello. This is AiKOVA calling about your booking. Your table for four at seven is confirmed. See you soon.'

    // Africa prefers AT when keys exist
    if (region === 'africa' && atReady) {
      try {
        const at = await placeAfricasTalkingCall({ to: phone, text })
        const { data: row } = await supabase
          .from('instant_try_calls')
          .insert({
            phone,
            region,
            lang,
            provider: 'africas_talking',
            provider_call_id: String((at as { entries?: { sessionId?: string }[] }).entries?.[0]?.sessionId || ''),
            status: 'queued',
            mode: 'live',
            meta: { at },
          })
          .select()
          .single()
        return json({
          ok: true,
          mode: 'live',
          provider: 'africas_talking',
          phone,
          callId: row?.id,
          status: 'queued',
          message: 'Africa’s Talking is dialing your phone now.',
        })
      } catch (e) {
        // fall through to Twilio
        console.warn('AT failed, trying Twilio', e)
      }
    }

    if (!twilioReady) {
      return json({
        ok: false,
        error: 'No live telephony keys',
        need: ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_PHONE_NUMBER'],
        hint: 'Add Twilio secrets, or run verify-start → provision-from first.',
      }, 503)
    }

    let from = await getFromNumber(supabase)
    if (!from) {
      return json({
        ok: false,
        error: 'Twilio From number missing',
        code: 'NEEDS_FROM',
        next: ['verify-start', 'provision-from'],
        hint: 'Verify your phone, then provision a Twilio number so we can dial you.',
      }, 409)
    }

    const twiml = buildTwiml(text, lang, region)
    try {
      const call = await placeTwilioCall({ to: phone, from, twiml })
      const { data: row } = await supabase
        .from('instant_try_calls')
        .insert({
          phone,
          region,
          lang,
          provider: 'twilio',
          provider_call_id: call.sid,
          status: call.status || 'queued',
          mode: 'live',
          meta: { from, to: phone },
        })
        .select()
        .single()

      return json({
        ok: true,
        mode: 'live',
        provider: 'twilio',
        phone,
        from,
        callSid: call.sid,
        callId: row?.id,
        status: call.status,
        message: 'Your phone should ring in a few seconds.',
      })
    } catch (e) {
      const err = e as Error & { code?: number }
      // Trial: destination must be verified
      if (err.code === 21219 || /unverified|verified/i.test(err.message)) {
        return json({
          ok: false,
          error: err.message,
          code: 'NEEDS_VERIFY_DEST',
          next: ['verify-start'],
          hint: 'Twilio trial can only call verified numbers. Start verification — your phone will ring with a code.',
        }, 409)
      }
      if (err.code === 21606 || /not a valid/i.test(err.message)) {
        return json({
          ok: false,
          error: err.message,
          code: 'NEEDS_FROM',
          next: ['provision-from'],
        }, 409)
      }
      await supabase.from('instant_try_calls').insert({
        phone,
        region,
        lang,
        provider: 'twilio',
        status: 'failed',
        mode: 'live',
        error: err.message,
      })
      return json({ ok: false, error: err.message, code: err.code }, 400)
    }
  } catch (e) {
    return json({ ok: false, error: e instanceof Error ? e.message : String(e) }, 500)
  }
})
