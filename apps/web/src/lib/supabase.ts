import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabaseConfigured = Boolean(url && anon)

export const supabase: SupabaseClient | null = supabaseConfigured
  ? createClient(url!, anon!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

export type RegionKey = 'africa' | 'eurozone' | 'uk'

export type Business = {
  id: string
  user_id: string
  name: string
  region: RegionKey
  telephony_provider: string
  payment_provider: string
  compliance: string
  website_url?: string | null
}
