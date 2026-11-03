import { corsHeaders, json } from '../_shared/cors.ts'
import { logEdge, serviceClient, hasSecret, type EdgeOk } from '../_shared/client.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const supabase = serviceClient()
    const body = req.method === 'GET' ? {} : await req.json().catch(() => ({}))
    const businessId = body.businessId as string | undefined
    const content = String(body.content || body.text || '').trim()
    const title = String(body.title || 'Untitled source').slice(0, 200)
    const started = Date.now()

    if (!businessId) {
      return json({ ok: false, error: 'businessId required', schemaVersion: 1 }, 400)
    }
    if (!content) {
      return json({ ok: false, error: 'content required', schemaVersion: 1 }, 400)
    }

    await logEdge(supabase, 'knowledge-embed', body)

    const tokenCount = Math.max(1, Math.round(content.split(/\s+/).length * 1.3))
    const canEmbed = hasSecret('OPENAI_API_KEY')

    const { data: row, error } = await supabase
      .from('knowledge_sources')
      .insert({
        business_id: businessId,
        source_type: body.sourceType || body.source_type || 'docs',
        title,
        content,
        url: body.url || null,
        token_count: tokenCount,
        embedding: null,
      })
      .select('id, title, token_count')
      .single()

    if (error) throw error

    const payload: EdgeOk = {
      ok: true,
      fn: 'knowledge-embed',
      mode: canEmbed ? 'live' : 'demo',
      schemaVersion: 1,
      degraded: !canEmbed,
      id: row.id,
      token_count: tokenCount,
      embedded: false,
      note: canEmbed
        ? 'OPENAI present — wire embedding call next'
        : 'Stored without vectors (OPENAI_API_KEY missing). Text search still works.',
      latency_ms: Date.now() - started,
      region: body.region ?? 'full',
    }
    return json(payload)
  } catch (e) {
    return json({ ok: false, error: e instanceof Error ? e.message : String(e) }, 500)
  }
})
