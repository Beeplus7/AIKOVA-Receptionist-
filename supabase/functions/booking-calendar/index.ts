import { corsHeaders, json } from '../_shared/cors.ts'
import { logEdge, serviceClient, type EdgeOk } from '../_shared/client.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const supabase = serviceClient()
    const body = req.method === 'GET' ? {} : await req.json().catch(() => ({}))
    const businessId = body.businessId as string | undefined
    const startsAt = body.startsAt || body.starts_at
    const endsAt = body.endsAt || body.ends_at
    const started = Date.now()

    if (!businessId) {
      return json({ ok: false, error: 'businessId required', schemaVersion: 1 }, 400)
    }
    if (!startsAt || !endsAt) {
      return json({ ok: false, error: 'startsAt and endsAt required', schemaVersion: 1 }, 400)
    }

    await logEdge(supabase, 'booking-calendar', body)

    const { data: conflicts } = await supabase
      .from('bookings')
      .select('id, contact_name, starts_at, ends_at')
      .eq('business_id', businessId)
      .neq('status', 'cancelled')
      .lt('starts_at', endsAt)
      .gt('ends_at', startsAt)
      .limit(5)

    if (conflicts?.length) {
      return json({
        ok: false,
        error: 'double_booking',
        conflicts,
        schemaVersion: 1,
        mode: 'demo',
      }, 409)
    }

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        business_id: businessId,
        conversation_id: body.conversationId || null,
        contact_name: body.contactName || body.contact_name || 'Guest',
        contact_phone: body.contactPhone || body.contact_phone || null,
        starts_at: startsAt,
        ends_at: endsAt,
        timezone: body.timezone || 'UTC',
        provider: 'internal',
        status: 'confirmed',
        notes: body.notes || 'Edge booking-calendar (internal, no Google OAuth)',
      })
      .select()
      .single()

    if (error) throw error

    const payload: EdgeOk = {
      ok: true,
      fn: 'booking-calendar',
      mode: 'demo',
      schemaVersion: 1,
      degraded: true,
      booking,
      latency_ms: Date.now() - started,
      region: body.region ?? 'full',
      note: 'Internal calendar — Google/Outlook OAuth still needs credentials',
    }
    return json(payload)
  } catch (e) {
    return json({ ok: false, error: e instanceof Error ? e.message : String(e) }, 500)
  }
})
