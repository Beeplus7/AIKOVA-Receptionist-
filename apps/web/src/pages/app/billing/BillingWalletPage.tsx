import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../../../lib/supabase'
import AppUserMenu from '../../../components/app/AppUserMenu'
import {
  AKC_ANCHOR,
  PLAN_TIERS,
  RELOAD_PACKS,
  USAGE_RATES,
  WELCOME_AKC,
  WELCOME_DAYS,
  formatAkc,
} from '../../../lib/akc/catalog'

const GRADIENT = 'linear-gradient(90deg, #00E5FF 0%, #2962FF 52%, #76FF03 100%)'

type Wallet = {
  business_id: string
  balance: number
  total_earned: number
  total_spent: number
  total_gifted: number
  plan: string
  welcome_claimed: boolean
  trial_ends_at: string | null
}

type LedgerRow = {
  id: string
  entry_type: string
  amount: number
  balance_after: number
  service_id: string | null
  created_at: string
}

export default function BillingWalletPage() {
  const [params] = useSearchParams()
  const region = params.get('region') || 'africa'
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [ledger, setLedger] = useState<LedgerRow[]>([])
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [checkoutPack, setCheckoutPack] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!supabase) {
      setError('Supabase not configured')
      return
    }
    setError(null)
    const { data: welcome } = await supabase.rpc('akc_claim_welcome')
    if (welcome && welcome.ok === false && welcome.error !== 'no_business') {
      // soft
    }
    const { data, error: wErr } = await supabase.rpc('akc_get_wallet')
    if (wErr) {
      setError(wErr.message)
      return
    }
    const w = data as Wallet
    setWallet(w)
    if (w?.business_id) {
      const { data: rows } = await supabase
        .from('akc_ledger')
        .select('id, entry_type, amount, balance_after, service_id, created_at')
        .eq('business_id', w.business_id)
        .order('created_at', { ascending: false })
        .limit(40)
      setLedger((rows as LedgerRow[]) || [])
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (params.get('akc_ok') === '1') {
      setMsg('Stripe payment received — credits appear after webhook (refresh in a few seconds).')
      void load()
    } else if (params.get('akc_cancel') === '1') {
      setMsg('Checkout cancelled')
    }
  }, [params, load])

  const buyPack = async (packKey: string) => {
    if (!supabase) {
      setError('Supabase not configured')
      return
    }
    setCheckoutPack(packKey)
    setError(null)
    setMsg(null)
    try {
      const { data: sess } = await supabase.auth.getSession()
      const token = sess.session?.access_token
      if (!token) throw new Error('Sign in required')
      const res = await fetch('/api/create-akc-checkout', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ packKey, region }),
      })
      const json = await res.json()
      if (!res.ok || !json.url) throw new Error(json.error || 'Checkout failed')
      window.location.href = json.url as string
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
      setCheckoutPack(null)
    }
  }

  const claimTrial = async () => {
    if (!supabase) return
    setBusy(true)
    setMsg(null)
    const { data, error: e } = await supabase.rpc('akc_claim_welcome')
    setBusy(false)
    if (e) setMsg(e.message)
    else if (data?.already) setMsg(`Trial already claimed · balance ${formatAkc(data.balance ?? 0)}`)
    else setMsg(`+${formatAkc(WELCOME_AKC)} trial credited · ${WELCOME_DAYS} days`)
    await load()
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <header className="sticky top-0 z-20 border-b border-[#E2E8F0] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link to="/app/dashboard" className="text-[13px] font-medium text-[#64748B] hover:text-[#0F172A]">
              ← Dashboard
            </Link>
            <span className="h-4 w-px bg-[#E2E8F0]" />
            <h1 className="text-[15px] font-bold tracking-tight">Billing · AiKOVA Credits</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-[11px] px-2.5 py-1 rounded-full border border-[#E2E8F0] bg-[#F8FAFC]">
              {region === 'eurozone' ? '🇪🇺 Eurozone · Stripe SEPA' : '🌍 Africa · M-Pesa'}
            </span>
            <button
              type="button"
              onClick={() => void load()}
              className="h-8 px-3 rounded-full border border-[#E2E8F0] text-[12px] font-medium bg-white"
            >
              Refresh
            </button>
            <AppUserMenu region={region} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1100px] px-4 sm:px-6 py-8 space-y-8">
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
            {error}
            {error.includes('no_business') || error.includes('no_business') ? (
              <span>
                {' '}
                — <Link to="/auth" className="underline">sign in</Link> and create a business first.
              </span>
            ) : null}
          </div>
        )}
        {msg && (
          <div className="rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 text-[13px]">{msg}</div>
        )}

        <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-4">
          <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold tracking-wide text-[#64748B]">WALLET BALANCE</p>
                <p className="mt-2 text-[40px] font-[800] tracking-tight leading-none" style={{ background: GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {wallet ? formatAkc(wallet.balance) : '—'}
                </p>
                <p className="mt-2 text-[12px] text-[#64748B]">
                  Anchor {formatAkc(AKC_ANCHOR.akc)} ≈ ${AKC_ANCHOR.usd} / €{AKC_ANCHOR.eur}
                </p>
              </div>
              <div className="text-right text-[11px] space-y-1">
                <div className="px-2.5 py-1 rounded-full border bg-[#F8FAFC] capitalize">Plan · {wallet?.plan ?? '—'}</div>
                {wallet?.trial_ends_at && (
                  <div className="text-[#64748B]">Trial ends {new Date(wallet.trial_ends_at).toLocaleDateString()}</div>
                )}
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { l: 'Earned', v: wallet?.total_earned },
                { l: 'Spent', v: wallet?.total_spent },
                { l: 'Gifted', v: wallet?.total_gifted },
              ].map((x) => (
                <div key={x.l} className="rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-3">
                  <div className="text-[10px] font-bold text-[#64748B]">{x.l}</div>
                  <div className="text-[14px] font-bold mt-1">{x.v != null ? formatAkc(x.v) : '—'}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy || wallet?.welcome_claimed}
                onClick={() => void claimTrial()}
                className="h-10 px-4 rounded-full text-white text-[13px] font-semibold disabled:opacity-40"
                style={{ background: GRADIENT }}
              >
                {wallet?.welcome_claimed ? 'Trial claimed' : `Claim ${formatAkc(WELCOME_AKC)} free trial`}
              </button>
              <Link
                to="/pricing"
                className="h-10 px-4 rounded-full border border-[#E2E8F0] bg-white text-[13px] font-medium inline-flex items-center"
              >
                View plans
              </Link>
              <Link
                to="/admin/credits"
                className="h-10 px-4 rounded-full border border-[#E2E8F0] bg-white text-[13px] font-medium inline-flex items-center text-[#64748B]"
              >
                Admin credits →
              </Link>
            </div>
          </div>

          <div className="rounded-[24px] border border-[#E2E8F0] bg-[#0F172A] text-white p-6">
            <p className="text-[11px] font-bold tracking-wide text-white/60">USAGE RATES</p>
            <div className="mt-4 space-y-2">
              {USAGE_RATES.map((r) => (
                <div key={r.id} className="flex items-center justify-between text-[12px] border-b border-white/10 pb-2">
                  <span className="text-white/80">{r.label}</span>
                  <span className="font-mono font-bold">{r.akc} AKC / {r.unit}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[11px] text-white/50">
              Plans allot monthly AKC. Overage + add-ons settle from this wallet (VGC-style prepaid).
            </p>
          </div>
        </section>

        <section>
          <div className="flex items-end justify-between gap-3 mb-4">
            <div>
              <h2 className="text-[18px] font-bold tracking-tight">Reload packs</h2>
              <p className="text-[12px] text-[#64748B]">
                Stripe Checkout (VisaGuide OS test account) · M-Pesa later
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {RELOAD_PACKS.map((p) => (
              <div
                key={p.key}
                className={`rounded-[20px] border bg-white p-4 ${p.popular ? 'shadow-[0_8px_24px_rgba(41,98,255,0.12)]' : 'border-[#E2E8F0]'}`}
                style={p.popular ? { boxShadow: '0 0 0 1px #2962FF, 0 8px 24px rgba(41,98,255,0.12)' } : undefined}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold">{p.label}</span>
                  {p.popular && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-white" style={{ background: GRADIENT }}>
                      POPULAR
                    </span>
                  )}
                </div>
                <div className="mt-2 text-[22px] font-[800]">{formatAkc(p.akc)}</div>
                <div className="text-[12px] text-[#64748B]">
                  ${p.usd} · €{p.eur}
                </div>
                <button
                  type="button"
                  disabled={checkoutPack === p.key}
                  className="mt-4 h-9 w-full rounded-full text-white text-[12px] font-semibold disabled:opacity-50"
                  style={{ background: GRADIENT }}
                  onClick={() => void buyPack(p.key)}
                >
                  {checkoutPack === p.key ? 'Redirecting…' : 'Buy with Stripe'}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-[18px] font-bold tracking-tight mb-3">Plan allotments</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PLAN_TIERS.map((t) => (
              <div key={t.id} className={`rounded-[20px] border bg-white p-4 ${t.popular ? '' : 'border-[#E2E8F0]'}`} style={t.popular ? { boxShadow: '0 0 0 1px #2962FF' } : undefined}>
                <div className="text-[13px] font-bold">{t.name}</div>
                <div className="mt-1 text-[18px] font-[800]">
                  {t.usd == null ? 'Custom' : `$${t.usd} / €${t.eur}`}
                </div>
                <div className="mt-1 text-[11px] text-[#64748B]">
                  {typeof t.akcMonthly === 'number' ? `${formatAkc(t.akcMonthly)} / mo` : t.akcMonthly}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[24px] border border-[#E2E8F0] bg-white overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
            <h2 className="text-[15px] font-bold">Ledger</h2>
            <span className="text-[11px] text-[#64748B]">Last {ledger.length} entries</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px]">
              <thead className="bg-[#F8FAFC] text-[#64748B]">
                <tr>
                  <th className="px-4 py-2 font-medium">When</th>
                  <th className="px-4 py-2 font-medium">Type</th>
                  <th className="px-4 py-2 font-medium">Service</th>
                  <th className="px-4 py-2 font-medium text-right">Amount</th>
                  <th className="px-4 py-2 font-medium text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {ledger.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-[#94A3B8]">
                      No ledger yet — claim your free trial to start.
                    </td>
                  </tr>
                )}
                {ledger.map((row) => (
                  <tr key={row.id} className="border-t border-[#E2E8F0]">
                    <td className="px-4 py-2.5 whitespace-nowrap text-[#64748B]">
                      {new Date(row.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5 font-medium capitalize">{row.entry_type}</td>
                    <td className="px-4 py-2.5 font-mono text-[11px]">{row.service_id ?? '—'}</td>
                    <td className={`px-4 py-2.5 text-right font-bold ${row.amount < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                      {row.amount > 0 ? '+' : ''}
                      {row.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5 text-right">{row.balance_after.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}
