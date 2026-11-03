import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { RegionKey } from './supabase'

/** Ensure the signed-in user has a businesses row (email signup + Google OAuth). */
export async function ensureBusinessForUser(
  client: SupabaseClient,
  user: User,
  region: RegionKey = 'africa',
) {
  const { data: existing, error: readErr } = await client
    .from('businesses')
    .select('id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()

  if (readErr) throw readErr
  if (existing?.id) return existing.id

  const name =
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    user.email?.split('@')[0] ||
    'My AiKOVA Business'

  const isEu = region === 'eurozone' || region === 'uk'
  const { data, error } = await client
    .from('businesses')
    .insert({
      user_id: user.id,
      name,
      region,
      telephony_provider: isEu ? 'twilio' : 'africas_talking',
      payment_provider: isEu ? 'stripe' : 'm_pesa',
      compliance: isEu ? 'gdpr' : 'ndpr',
      languages: isEu ? ['EN', 'FR', 'DE'] : ['EN', 'YO', 'Pidgin'],
    })
    .select('id')
    .single()

  if (error) throw error
  return data.id as string
}
