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

    await logEdge(supabase, 'handoff-waterfall', body)

    const { data: team, error } = await supabase
      .from('team_members')
      .select('id, name, role, phone, available, emergency, waterfall_order, skills')
      .eq('business_id', businessId)
      .eq('available', true)
      .order('emergency', { ascending: false })
      .order('waterfall_order', { ascending: true })

    if (error) throw error

    const cascade = team || []
    const assigned = cascade[0] || null

    if (body.conversationId && assigned) {
      await supabase
        .from('conversations')
        .update({ status: 'open', updated_at: new Date().toISOString() })
        .eq('id', body.conversationId)
        .eq('business_id', businessId)
    }

    const payload: EdgeOk = {
      ok: true,
      fn: 'handoff-waterfall',
      mode: 'demo',
      schemaVersion: 1,
      assigned,
      cascade,
      latency_ms: Date.now() - started,
      region: body.region ?? 'full',
      note: assigned
        ? `Routed to ${assigned.name}`
        : 'No available team members — add staff in /app/team',
    }
    return json(payload)
  } catch (e) {
    return json({ ok: false, error: e instanceof Error ? e.message : String(e) }, 500)
  }
})
