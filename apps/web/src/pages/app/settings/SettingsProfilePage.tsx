import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import type { User } from '@supabase/supabase-js'
import { supabase, type Business, type RegionKey } from '../../../lib/supabase'
import AppUserMenu from '../../../components/app/AppUserMenu'
import { seedDemoData } from '../../../lib/seedDemoData'

const GRADIENT = 'linear-gradient(90deg, #00E5FF 0%, #2962FF 52%, #76FF03 100%)'

export default function SettingsProfilePage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const regionQ = params.get('region') || 'eurozone'
  const [user, setUser] = useState<User | null>(null)
  const [business, setBusiness] = useState<Business | null>(null)
  const [fullName, setFullName] = useState('')
  const [bizName, setBizName] = useState('')
  const [bizRegion, setBizRegion] = useState<RegionKey>('eurozone')
  const [telephony, setTelephony] = useState('africas_talking')
  const [payment, setPayment] = useState('m_pesa')
  const [compliance, setCompliance] = useState('ndpr')
  const [website, setWebsite] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!supabase) {
      setError('Supabase not configured')
      return
    }
    setError(null)
    const { data: auth } = await supabase.auth.getUser()
    const u = auth.user
    setUser(u)
    if (!u) return
    setFullName(
      (u.user_metadata?.full_name as string | undefined) ||
        (u.user_metadata?.name as string | undefined) ||
        '',
    )
    const { data: biz, error: bErr } = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', u.id)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle()
    if (bErr) {
      setError(bErr.message)
      return
    }
    if (biz) {
      const b = biz as Business & { website_url?: string; telephony_provider?: string; payment_provider?: string; compliance?: string }
      setBusiness(b)
      setBizName(b.name || '')
      setBizRegion((b.region as RegionKey) || 'eurozone')
      setTelephony(b.telephony_provider || 'africas_talking')
      setPayment(b.payment_provider || 'm_pesa')
      setCompliance(b.compliance || 'ndpr')
      setWebsite(b.website_url || '')
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const save = async (e: FormEvent) => {
    e.preventDefault()
    if (!supabase || !user) return
    setBusy(true)
    setMsg(null)
    setError(null)
    try {
      const { error: metaErr } = await supabase.auth.updateUser({
        data: { full_name: fullName.trim() || user.email?.split('@')[0] },
      })
      if (metaErr) throw metaErr

      if (business?.id) {
        const { error: bErr } = await supabase
          .from('businesses')
          .update({
            name: bizName.trim() || 'My AiKOVA Business',
            region: bizRegion,
            telephony_provider: telephony,
            payment_provider: payment,
            compliance,
            website_url: website.trim() || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', business.id)
        if (bErr) throw bErr
      } else {
        const { error: iErr } = await supabase.from('businesses').insert({
          user_id: user.id,
          name: bizName.trim() || 'My AiKOVA Business',
          region: bizRegion,
          telephony_provider: telephony,
          payment_provider: payment,
          compliance,
          website_url: website.trim() || null,
          languages: bizRegion === 'africa' ? ['EN', 'YO', 'Pidgin'] : ['EN', 'FR', 'DE'],
        })
        if (iErr) throw iErr
      }
      setMsg('Profile saved')
      await load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  const signOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    navigate('/auth?mode=signin')
  }

  return (
    <div className="min-h-screen bg-[#E6EBF4] text-[#0F172A]">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-[800px] px-4 h-14 flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Account</div>
            <h1 className="text-[16px] font-extrabold tracking-tight">Settings & profile</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={`/app/inbox?region=${regionQ}`}
              className="h-9 px-3 rounded-full border border-slate-200 text-[12px] font-semibold inline-flex items-center bg-white"
            >
              ← Inbox
            </Link>
            <AppUserMenu region={regionQ} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[800px] px-4 py-8">
        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">{error}</div>
        )}
        {msg && (
          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-800">{msg}</div>
        )}

        <form onSubmit={save} className="space-y-6">
          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-[14px] font-bold">User profile</h2>
            <p className="mt-1 text-[12px] text-slate-500">Shown on welcome screens and the account menu.</p>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              <label className="text-[11px] font-bold text-slate-500 space-y-1 block">
                Display name
                <input
                  className="w-full h-11 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 text-[13px] font-normal text-slate-900"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                />
              </label>
              <label className="text-[11px] font-bold text-slate-500 space-y-1 block">
                Email
                <input
                  className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[13px] font-normal text-slate-600"
                  value={user?.email || ''}
                  disabled
                />
              </label>
            </div>
          </section>

          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-[14px] font-bold">Business</h2>
            <p className="mt-1 text-[12px] text-slate-500">Drives adapters, RLS rows, and inbox region defaults.</p>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              <label className="text-[11px] font-bold text-slate-500 space-y-1 block sm:col-span-2">
                Business name
                <input
                  className="w-full h-11 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 text-[13px] font-normal text-slate-900"
                  value={bizName}
                  onChange={(e) => setBizName(e.target.value)}
                  placeholder="Eko Bites / Garden Restaurant"
                />
              </label>
              <label className="text-[11px] font-bold text-slate-500 space-y-1 block sm:col-span-2">
                Website
                <input
                  className="w-full h-11 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 text-[13px] font-normal text-slate-900"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://"
                />
              </label>
              <label className="text-[11px] font-bold text-slate-500 space-y-1 block">
                Region
                <select
                  className="w-full h-11 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 text-[13px] font-normal text-slate-900"
                  value={bizRegion}
                  onChange={(e) => {
                    const r = e.target.value as RegionKey
                    setBizRegion(r)
                    if (r === 'africa') {
                      setTelephony('africas_talking')
                      setPayment('m_pesa')
                      setCompliance('ndpr')
                    } else {
                      setTelephony('twilio')
                      setPayment('stripe')
                      setCompliance(r === 'uk' ? 'uk_gdpr' : 'gdpr')
                    }
                  }}
                >
                  <option value="africa">🌍 Africa</option>
                  <option value="eurozone">🇪🇺 Eurozone</option>
                  <option value="uk">🇬🇧 UK</option>
                </select>
              </label>
              <label className="text-[11px] font-bold text-slate-500 space-y-1 block">
                Telephony
                <select
                  className="w-full h-11 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 text-[13px] font-normal text-slate-900"
                  value={telephony}
                  onChange={(e) => setTelephony(e.target.value)}
                >
                  <option value="africas_talking">Africa&apos;s Talking</option>
                  <option value="twilio">Twilio</option>
                  <option value="vonage">Vonage</option>
                </select>
              </label>
              <label className="text-[11px] font-bold text-slate-500 space-y-1 block">
                Payment
                <select
                  className="w-full h-11 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 text-[13px] font-normal text-slate-900"
                  value={payment}
                  onChange={(e) => setPayment(e.target.value)}
                >
                  <option value="m_pesa">M-Pesa</option>
                  <option value="flutterwave">Flutterwave</option>
                  <option value="paystack">Paystack</option>
                  <option value="stripe">Stripe</option>
                  <option value="stripe_sepa">Stripe SEPA</option>
                </select>
              </label>
              <label className="text-[11px] font-bold text-slate-500 space-y-1 block">
                Compliance
                <select
                  className="w-full h-11 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 text-[13px] font-normal text-slate-900"
                  value={compliance}
                  onChange={(e) => setCompliance(e.target.value)}
                >
                  <option value="ndpr">NDPR</option>
                  <option value="gdpr">GDPR</option>
                  <option value="ai_act">EU AI Act</option>
                  <option value="uk_gdpr">UK GDPR</option>
                </select>
              </label>
            </div>
          </section>

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={busy}
              className="h-11 px-5 rounded-full text-[13px] font-bold text-[#0F172A] disabled:opacity-50"
              style={{ background: GRADIENT }}
            >
              {busy ? 'Saving…' : 'Save changes'}
            </button>
            <Link
              to={`/app/billing?region=${bizRegion}`}
              className="h-11 px-4 rounded-full border border-slate-200 bg-white text-[13px] font-semibold inline-flex items-center"
            >
              AKC wallet
            </Link>
            <button
              type="button"
              disabled={busy || !business?.id}
              onClick={() => {
                if (!supabase || !business?.id) return
                setBusy(true)
                setMsg(null)
                setError(null)
                void seedDemoData(supabase, business.id, bizRegion)
                  .then((r) => setMsg(r.seeded ? `Demo pack seeded` : r.reason || 'Skipped'))
                  .catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)))
                  .finally(() => setBusy(false))
              }}
              className="h-11 px-4 rounded-full border border-slate-200 bg-white text-[13px] font-semibold disabled:opacity-50"
            >
              Seed demo pack
            </button>
            <button
              type="button"
              onClick={() => void signOut()}
              className="h-11 px-4 rounded-full border border-red-200 bg-red-50 text-[13px] font-bold text-red-700"
            >
              Sign out
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
