import { corsHeaders, json } from '../_shared/cors.ts'
import { logEdge, serviceClient, hasSecret, type EdgeOk } from '../_shared/client.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const supabase = serviceClient()
    const body = req.method === 'GET' ? {} : await req.json().catch(() => ({}))
    const businessId = body.businessId as string | undefined
    const query = String(body.query || body.q || '').trim()
    const started = Date.now()

    if (!businessId) {
      return json({ ok: false, error: 'businessId required', schemaVersion: 1 }, 400)
    }
    if (!query) {
      return json({ ok: false, error: 'query required', schemaVersion: 1 }, 400)
    }

    await logEdge(supabase, 'brain-rag', body, { latency_ms: 0 })

    const term = query.replace(/[%_]/g, '').slice(0, 120)
    const [{ data: ks }, { data: pb }] = await Promise.all([
      supabase
        .from('knowledge_sources')
        .select('id, title, content')
        .eq('business_id', businessId)
        .or(`title.ilike.%${term}%,content.ilike.%${term}%`)
        .limit(5),
      supabase
        .from('playbooks')
        .select('id, title, body')
        .eq('business_id', businessId)
        .or(`title.ilike.%${term}%,body.ilike.%${term}%`)
        .limit(3),
    ])

    const sources: { id: string; title: string; snippet: string }[] = []
    for (const row of ks || []) {
      sources.push({
        id: row.id,
        title: row.title || 'Knowledge',
        snippet: String(row.content || '').slice(0, 280),
      })
    }
    for (const row of pb || []) {
      sources.push({
        id: row.id,
        title: `Playbook: ${row.title || ''}`,
        snippet: String(row.body || '').slice(0, 280),
      })
    }

    const liveLlm = hasSecret('OPENAI_API_KEY') || hasSecret('ANTHROPIC_API_KEY')
    let answer: string
    if (sources.length) {
      answer = sources.map((s) => `• ${s.title}: ${s.snippet}`).join('\n')
      if (!liveLlm) {
        answer = `Demo RAG (pgvector/text search — LLM keys not set):\n${answer}`
      }
    } else {
      answer =
        'No matching knowledge yet. Add FAQ/docs in /app/knowledge or run Seed demo data from Settings.'
    }

    const payload: EdgeOk = {
      ok: true,
      fn: 'brain-rag',
      mode: liveLlm ? 'live' : 'demo',
      schemaVersion: 1,
      degraded: !liveLlm,
      answer,
      sources: sources.map((s) => s.title),
      latency_ms: Date.now() - started,
      region: body.region ?? 'full',
    }
    return json(payload)
  } catch (e) {
    return json({ ok: false, error: e instanceof Error ? e.message : String(e) }, 500)
  }
})
