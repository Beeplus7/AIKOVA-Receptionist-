import { useEffect, useId, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'

type Props = {
  region?: string
}

function initials(name: string, email?: string | null) {
  const base = name || email || 'AK'
  const parts = base.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return base.slice(0, 2).toUpperCase()
}

export default function AppUserMenu({ region = 'eurozone' }: Props) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [busy, setBusy] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!supabase) return
    void supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ||
    (user?.user_metadata?.name as string | undefined) ||
    user?.email?.split('@')[0] ||
    'Account'
  const email = user?.email || ''

  const signOut = async () => {
    if (!supabase) {
      navigate('/auth')
      return
    }
    setBusy(true)
    await supabase.auth.signOut()
    setBusy(false)
    setOpen(false)
    navigate('/auth?mode=signin')
  }

  const q = `region=${encodeURIComponent(region)}`

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white pl-1 pr-2.5 py-1 hover:bg-[#F8FAFC] transition shadow-sm"
      >
        <span className="h-8 w-8 rounded-full bg-gradient-to-br from-[#0F172A] to-[#334155] text-white grid place-items-center font-bold text-[11px]">
          {initials(displayName, email)}
        </span>
        <span className="hidden sm:block text-left leading-tight max-w-[120px]">
          <span className="block text-[11px] font-bold text-[#0F172A] truncate">{displayName}</span>
          <span className="block text-[9px] text-[#64748B] truncate">{email || 'Signed in'}</span>
        </span>
        <span className="text-[10px] text-[#94A3B8]">▾</span>
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-[240px] rounded-2xl border border-[#E2E8F0] bg-white p-2 shadow-[0_20px_50px_rgba(15,23,42,0.16)]"
        >
          <div className="px-2.5 py-2 border-b border-[#F1F5F9] mb-1">
            <div className="text-[12px] font-bold text-[#0F172A] truncate">{displayName}</div>
            <div className="text-[11px] text-[#64748B] truncate">{email}</div>
          </div>
          <Link
            role="menuitem"
            to={`/app/settings?${q}`}
            className="block rounded-xl px-2.5 py-2 text-[12px] font-semibold text-[#334155] hover:bg-[#F8FAFC]"
            onClick={() => setOpen(false)}
          >
            ⚙️ Settings & profile
          </Link>
          <Link
            role="menuitem"
            to={`/app/dashboard?${q}`}
            className="block rounded-xl px-2.5 py-2 text-[12px] font-semibold text-[#334155] hover:bg-[#F8FAFC]"
            onClick={() => setOpen(false)}
          >
            📊 KPI dashboard
          </Link>
          <Link
            role="menuitem"
            to={`/app/billing?${q}`}
            className="block rounded-xl px-2.5 py-2 text-[12px] font-semibold text-[#334155] hover:bg-[#F8FAFC]"
            onClick={() => setOpen(false)}
          >
            💳 Billing · AKC wallet
          </Link>
          <Link
            role="menuitem"
            to={`/app/inbox?${q}`}
            className="block rounded-xl px-2.5 py-2 text-[12px] font-semibold text-[#334155] hover:bg-[#F8FAFC]"
            onClick={() => setOpen(false)}
          >
            🎁 Gift inbox
          </Link>
          <button
            type="button"
            role="menuitem"
            disabled={busy}
            onClick={() => void signOut()}
            className="mt-1 w-full text-left rounded-xl px-2.5 py-2 text-[12px] font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            {busy ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      ) : null}
    </div>
  )
}
