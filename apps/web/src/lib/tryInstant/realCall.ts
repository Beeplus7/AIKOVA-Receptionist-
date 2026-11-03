import { supabase, supabaseConfigured } from '../supabase'

export type RealCallResult = {
  ok: boolean
  mode?: 'live' | 'demo'
  provider?: string
  phone?: string
  from?: string
  callSid?: string
  callId?: string
  status?: string
  message?: string
  error?: string
  code?: string | number
  next?: string[]
  hint?: string
  validationCode?: string
  instruction?: string
  need?: string[]
}

function functionsBase(): string | null {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
  if (!url) return null
  return `${url.replace(/\/$/, '')}/functions/v1`
}

async function invoke(path: string, body: Record<string, unknown>): Promise<RealCallResult> {
  const base = functionsBase()
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
  if (!base || !anon) {
    return { ok: false, error: 'Supabase not configured in web app' }
  }
  const res = await fetch(`${base}/${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${anon}`,
      apikey: anon,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  const data = (await res.json().catch(() => ({}))) as RealCallResult
  if (!res.ok && !data.error) {
    return { ...data, ok: false, error: data.error || `HTTP ${res.status}` }
  }
  return data
}

export function canUseRealCall() {
  return supabaseConfigured || Boolean(functionsBase())
}

export async function placeInstantTryCall(input: {
  phone: string
  region: string
  lang: string
  text: string
}): Promise<RealCallResult> {
  return invoke('instant-try-call', { action: 'call', ...input })
}

export async function startCallerVerify(phone: string): Promise<RealCallResult> {
  return invoke('instant-try-call', { action: 'verify-start', phone })
}

export async function provisionTwilioFrom(): Promise<RealCallResult> {
  return invoke('instant-try-call', { action: 'provision-from' })
}

export async function pollCallStatus(callSid: string): Promise<RealCallResult> {
  return invoke('instant-try-call', { action: 'status', callSid })
}

/** Soft check — unused client kept for future session gating */
export function supabaseOk() {
  return Boolean(supabase)
}
