import type { SupabaseClient } from '@supabase/supabase-js'

export type CompanionResult = {
  answer: string
  mode: 'brain-rag' | 'knowledge' | 'local'
  sources?: string[]
}

/** Prefer edge brain-rag; else search knowledge/playbooks; else keyword local. */
export async function answerCompanion(
  client: SupabaseClient | null,
  opts: {
    businessId: string | null
    query: string
    region: string
    localFallback: (q: string) => string
  },
): Promise<CompanionResult> {
  const q = opts.query.trim()
  if (!q) return { answer: 'Ask me about inbox, bookings, or handoff.', mode: 'local' }

  if (client && opts.businessId) {
    try {
      const { data, error } = await client.functions.invoke('brain-rag', {
        body: { businessId: opts.businessId, query: q, region: opts.region },
      })
      if (!error && data?.answer) {
        return {
          answer: String(data.answer),
          mode: data.degraded ? 'knowledge' : 'brain-rag',
          sources: data.sources,
        }
      }
    } catch {
      /* edge not deployed — fall through */
    }

    try {
      const term = q.replace(/[%_]/g, '').slice(0, 80)
      const [{ data: ks }, { data: pb }] = await Promise.all([
        client
          .from('knowledge_sources')
          .select('title, content')
          .eq('business_id', opts.businessId)
          .or(`title.ilike.%${term}%,content.ilike.%${term}%`)
          .limit(3),
        client
          .from('playbooks')
          .select('title, body')
          .eq('business_id', opts.businessId)
          .or(`title.ilike.%${term}%,body.ilike.%${term}%`)
          .limit(2),
      ])
      const snippets: string[] = []
      for (const row of ks || []) {
        if (row.content) snippets.push(`${row.title || 'KB'}: ${String(row.content).slice(0, 220)}`)
      }
      for (const row of pb || []) {
        if (row.body) snippets.push(`Playbook ${row.title || ''}: ${String(row.body).slice(0, 220)}`)
      }
      if (snippets.length) {
        return {
          answer: `From your knowledge base (no live LLM keys yet):\n\n${snippets.join('\n\n')}`,
          mode: 'knowledge',
          sources: snippets.map((s) => s.slice(0, 40)),
        }
      }
    } catch {
      /* ignore */
    }
  }

  return { answer: opts.localFallback(q), mode: 'local' }
}
