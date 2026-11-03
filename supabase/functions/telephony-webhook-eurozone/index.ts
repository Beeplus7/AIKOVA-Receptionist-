import { corsHeaders, json } from '../_shared/cors.ts'
import { logEdge, serviceClient, hasSecret, type EdgeOk } from '../_shared/client.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const supabase = serviceClient()
    const body = await req.json().catch(() => ({}))
    const businessId = body.businessId as string | undefined
    const phone = body.phone ?? body.phone_from ?? '+447700900123'
    const region = body.region === 'uk' ? 'uk' : 'eurozone'
    const started = Date.now()

    if (!businessId) {
      return json({ ok: false, error: 'businessId required', schemaVersion: 1 }, 400)
    }

    await logEdge(supabase, 'telephony-webhook-eurozone', body)

    const { data: call, error: callErr } = await supabase
      .from('calls')
      .insert({
        business_id: businessId,
        phone_from: phone,
        region,
        provider: 'twilio',
        status: 'completed',
        duration_sec: body.duration_sec ?? 22,
        missed: Boolean(body.missed),
        saved_from_missed: Boolean(body.missed),
        transcript: body.transcript || 'Demo inbound call (Twilio keys not required for simulate).',
        sentiment: 'neutral',
      })
      .select()
      .single()
    if (callErr) throw callErr

    const { data: conv, error: convErr } = await supabase
      .from('conversations')
      .insert({
        business_id: businessId,
        contact_name: body.contactName || 'Inbound caller',
        contact_phone: phone,
        contact_channel: 'call',
        region,
        language: 'EN',
        intent: body.intent || 'question',
        sentiment: 'neutral',
        ai_confidence: 0.9,
        status: 'new',
        preview: body.preview || `Call from ${phone}`,
        tags: ['telephony', region, 'simulate'],
      })
      .select()
      .single()
    if (convErr) throw convErr

    await supabase.from('calls').update({ conversation_id: conv.id }).eq('id', call.id)

    await supabase.from('messages').insert([
      {
        conversation_id: conv.id,
        business_id: businessId,
        from_role: 'user',
        body: body.preview || `Inbound call from ${phone}`,
      },
      {
        conversation_id: conv.id,
        business_id: businessId,
        from_role: 'ai',
        body: 'Thanks for calling — logged in Gift Inbox. (Demo mode until Twilio keys are set.)',
        memory_note: 'telephony-webhook-eurozone demo',
      },
    ])

    const live = hasSecret('TWILIO_ACCOUNT_SID') && hasSecret('TWILIO_AUTH_TOKEN')
    const payload: EdgeOk = {
      ok: true,
      fn: 'telephony-webhook-eurozone',
      mode: live ? 'live' : 'demo',
      schemaVersion: 1,
      degraded: !live,
      region,
      codec: 'pcmu',
      call,
      conversation: conv,
      latency_ms: Date.now() - started,
    }
    return json(payload)
  } catch (e) {
    return json({ ok: false, error: e instanceof Error ? e.message : String(e) }, 500)
  }
})