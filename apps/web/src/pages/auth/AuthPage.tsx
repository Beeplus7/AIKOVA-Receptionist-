import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import type { User } from '@supabase/supabase-js'
import { supabase, supabaseConfigured, type RegionKey } from '../../lib/supabase'
import { ensureBusinessForUser } from '../../lib/ensureBusiness'
import { SETUP } from '../../lib/setupFlow'
import { useRegion } from '../../context/RegionContext'

export default function AuthPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { region: ctxRegion } = useRegion()
  const next = params.get('next') || SETUP.entrance
  const regionParam = (params.get('region') || ctxRegion || 'eurozone') as RegionKey
  const initialMode = params.get('mode') === 'signup' ? 'signup' : 'signin'
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  useEffect(() => {
    setMode(params.get('mode') === 'signup' ? 'signup' : 'signin')
  }, [params])

  const finishSession = async (user: User) => {
    if (!supabase) return
    await ensureBusinessForUser(supabase, user, regionParam)
    navigate(next, { replace: true })
  }

  // Already signed in → continue funnel (skip auth form)
  useEffect(() => {
    const client = supabase
    if (!client) return
    let alive = true
    void client.auth.getSession().then(async ({ data }) => {
      if (!alive || !data.session?.user) return
      const fromOAuth =
        window.location.hash.includes('access_token') ||
        params.get('code') != null ||
        sessionStorage.getItem('aikova_oauth_pending') === '1'
      if (fromOAuth) return
      try {
        await ensureBusinessForUser(client, data.session.user, regionParam)
        navigate(next, { replace: true })
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err))
      }
    })
    return () => {
      alive = false
    }
  }, [navigate, next, regionParam, params])

  // Finish Google / magic-link redirect
  useEffect(() => {
    const client = supabase
    if (!client) return
    let alive = true
    const finish = async () => {
      const { data } = await client.auth.getSession()
      if (!alive || !data.session?.user) return
      const fromOAuth =
        window.location.hash.includes('access_token') ||
        params.get('code') != null ||
        sessionStorage.getItem('aikova_oauth_pending') === '1'
      if (!fromOAuth) return
      try {
        await ensureBusinessForUser(client, data.session.user, regionParam)
        sessionStorage.removeItem('aikova_oauth_pending')
        navigate(next, { replace: true })
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err))
      }
    }
    void finish()
    const { data: sub } = client.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user && sessionStorage.getItem('aikova_oauth_pending') === '1') {
        void ensureBusinessForUser(client, session.user, regionParam)
          .then(() => {
            sessionStorage.removeItem('aikova_oauth_pending')
            navigate(next, { replace: true })
          })
          .catch((err: unknown) => {
            setError(err instanceof Error ? err.message : String(err))
          })
      }
    })
    return () => {
      alive = false
      sub.subscription.unsubscribe()
    }
  }, [navigate, next, params, regionParam])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!supabase) {
      setError('Supabase is not configured (missing VITE_SUPABASE_URL / ANON_KEY)')
      return
    }
    setBusy(true)
    setError(null)
    setInfo(null)
    try {
      if (mode === 'signin') {
        const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
        if (err) throw err
        if (data.user) await finishSession(data.user)
      } else {
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName.trim() || email.split('@')[0],
            },
          },
        })
        if (err) throw err
        if (data.session?.user) {
          await finishSession(data.session.user)
        } else {
          setInfo('Check your email to confirm, then sign in — you’ll continue to Entrance.')
          setMode('signin')
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  const signInWithGoogle = async () => {
    if (!supabase) {
      setError('Supabase is not configured')
      return
    }
    setBusy(true)
    setError(null)
    sessionStorage.setItem('aikova_oauth_pending', '1')
    const redirectTo = `${window.location.origin}/auth?next=${encodeURIComponent(next)}&region=${encodeURIComponent(regionParam)}`
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: { access_type: 'offline', prompt: 'select_account' },
      },
    })
    if (err) {
      sessionStorage.removeItem('aikova_oauth_pending')
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-[#E6EBF4] px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
        <div className="flex items-center gap-2.5">
          <div
            className="grid h-9 w-9 place-items-center rounded-xl text-[14px] font-black"
            style={{ background: 'linear-gradient(135deg,#00E5FF,#2962FF)' }}
          >
            A
          </div>
          <div>
            <div className="text-[15px] font-bold">AiKOVA · Create account</div>
            <div className="text-[11px] text-slate-500">Step 1 of 4 · then Entrance → Onboarding → Inbox</div>
          </div>
        </div>

        <ol className="mt-4 flex flex-wrap gap-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
          {['1 Sign up', '2 Entrance', '3 Onboarding', '4 Dashboard'].map((s, i) => (
            <li
              key={s}
              className={`rounded-full px-2.5 py-1 border ${i === 0 ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'bg-[#F8FAFC] border-slate-200'}`}
            >
              {s}
            </li>
          ))}
        </ol>

        {!supabaseConfigured && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] text-amber-900">
            Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in apps/web/.env
          </div>
        )}

        <button
          type="button"
          disabled={busy || !supabaseConfigured}
          onClick={() => void signInWithGoogle()}
          className="mt-5 w-full h-11 rounded-xl border border-slate-200 bg-white text-[13px] font-bold text-slate-800 hover:bg-slate-50 disabled:opacity-50 flex items-center justify-center gap-2.5 shadow-sm"
        >
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.2 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.5z" />
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.2 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.3 35.1 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.6 39.6 16.2 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.3 5.5-6 7.1l.1.1 6.3 5.3C37.5 39.2 44 34 44 24c0-1.3-.1-2.5-.4-3.5z" />
          </svg>
          Continue with Google
        </button>

        <div className="mt-4 flex items-center gap-3 text-[11px] text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          or email
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="mt-4 flex gap-1 rounded-xl bg-[#F1F5F9] p-1">
          {(['signup', 'signin'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`flex-1 rounded-lg py-2 text-[12px] font-bold ${mode === m ? 'bg-[#0F172A] text-white' : 'text-slate-600'}`}
            >
              {m === 'signup' ? 'Sign up' : 'Sign in'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-5 space-y-3">
          {mode === 'signup' && (
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name (for welcome)"
              className="w-full h-11 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 text-[13px] outline-none focus:border-[#2962FF]"
              autoComplete="name"
            />
          )}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@business.com"
            className="w-full h-11 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 text-[13px] outline-none focus:border-[#2962FF]"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full h-11 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 text-[13px] outline-none focus:border-[#2962FF]"
          />
          {error && <div className="text-[12px] text-red-600">{error}</div>}
          {info && <div className="text-[12px] text-blue-700">{info}</div>}
          <button
            type="submit"
            disabled={busy}
            className="w-full h-11 rounded-xl text-[13px] font-bold text-[#0F172A] disabled:opacity-50"
            style={{ background: 'linear-gradient(102deg,#00E5FF,#2962FF)' }}
          >
            {busy ? 'Working…' : mode === 'signup' ? 'Create account → Entrance' : 'Sign in → Continue'}
          </button>
        </form>

        <p className="mt-4 text-[11px] leading-4 text-slate-500">
          Region for this setup: <strong className="capitalize">{regionParam}</strong>. After auth you pick the door at Entrance, then complete onboarding, then open your Gift Dashboard.
        </p>

        <div className="mt-4 flex justify-between text-[11px] font-semibold text-slate-500">
          <Link to={regionParam === 'africa' ? '/' : '/eu'} className="hover:text-slate-800">
            ← Marketing
          </Link>
          <Link to={SETUP.entrance} className="hover:text-slate-800">
            Already signed in? Entrance →
          </Link>
        </div>
      </div>
    </div>
  )
}
