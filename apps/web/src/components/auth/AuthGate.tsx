import { useEffect, useState, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { supabase, supabaseConfigured } from '../../lib/supabase'

/**
 * Gap 1 — Supabase Auth gate for /app/*
 * When Supabase is configured, require a session.
 * When not configured, allow through (local preview) with a console warn.
 */
export default function AuthGate({ children }: { children: ReactNode }) {
  const location = useLocation()
  const [session, setSession] = useState<Session | null | undefined>(undefined)

  useEffect(() => {
    if (!supabase) {
      setSession(null)
      return
    }
    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSession(data.session)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
    })
    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  if (!supabaseConfigured) {
    return <>{children}</>
  }

  if (session === undefined) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#E6EBF4] text-[13px] text-slate-600">
        Checking session…
      </div>
    )
  }

  if (!session) {
    const next = encodeURIComponent(location.pathname + location.search)
    let region = 'eurozone'
    try {
      const raw = localStorage.getItem('aikova_region')
      if (raw === 'africa' || raw === 'eurozone' || raw === 'uk') region = raw
    } catch {
      /* ignore */
    }
    const mode = location.pathname.startsWith('/onboarding') ? 'signup' : 'signin'
    return <Navigate to={`/auth?mode=${mode}&region=${region}&next=${next}`} replace />
  }

  return <>{children}</>
}
