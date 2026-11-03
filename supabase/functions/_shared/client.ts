import { createClient, type SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

export function serviceClient(): SupabaseClient {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )
}

export function hasSecret(...keys: string[]) {
  return keys.every((k) => Boolean(Deno.env.get(k)))
}

export async function logEdge(
  supabase: SupabaseClient,
  fn: string,
  body: Record<string, unknown>,
  extra: Record<string, unknown> = {},
) {
  const businessId = (body.businessId || body.business_id) as string | undefined
  if (!businessId) return
  const { error } = await supabase.from('analytics_events').insert({
    business_id: businessId,
    event_type: `edge.${fn}`,
    channel: (body.channel as string) || fn,
    region: (body.region as string) || 'full',
    meta: { ...extra, schemaVersion: 1 },
    value: 1,
  })
  if (error) console.warn(`${fn} analytics soft-fail`, error.message)
}

export type EdgeOk = {
  ok: true
  fn: string
  mode: 'live' | 'demo'
  schemaVersion: 1
  degraded?: boolean
  [key: string]: unknown
}
