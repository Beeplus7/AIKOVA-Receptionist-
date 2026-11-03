import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { WELCOME_AKC, formatAkc } from '../../lib/akc/catalog'

const GRADIENT = 'linear-gradient(90deg, #00E5FF 0%, #2962FF 52%, #76FF03 100%)'

type Tab = 'trials' | 'gifts' | 'vouchers' | 'influencer' | 'sponsor'

type Voucher = {
  id: string
  code: string
  akc_amount: number
  issued_limit: number
  redeemed_count: number
  expires_at: string | null
  active: boolean
  note: string | null
  created_at: string
}

type Pool = {
  id: string
  handle: string
  pool_kind: string
  pool_akc: number
  distributed_akc: number
  link_clicks: number
  conversions: number
  commission_cents: number
  active: boolean
  note: string | null
}

type TrialRow = {
  id: string
  business_id: string
  akc_amount: number
  days: number
  note: string | null
  created_at: string
}

export default function AdminCreditsPage() {
  const [tab, setTab] = useState<Tab>('trials')
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [flash, setFlash] = useState<string | null>(null)

  const [trials, setTrials] = useState<TrialRow[]>([])
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [pools, setPools] = useState<Pool[]>([])
  const [wallets, setWallets] = useState<
    { business_id: string; balance: number; total_spent: number; welcome_claimed: boolean; total_gifted: number }[]
  >([])
  const [ledgerMix, setLedgerMix] = useState<Record<string, number>>({})

  const [giftForm, setGiftForm] = useState({
    email: '',
    amount: 20000,
    note: '',
    entry_type: 'gift' as 'gift' | 'sponsor' | 'influencer' | 'trial',
  })
  const [confirmGift, setConfirmGift] = useState(false)
  const [voucherForm, setVoucherForm] = useState({
    code: '',
    akc_amount: 10000,
    issued_limit: 100,
    expires_at: '',
    note: '',
  })
  const [poolForm, setPoolForm] = useState({
    handle: '',
    pool_akc: 500_000,
    pool_kind: 'influencer' as 'influencer' | 'sponsor' | 'partner',
    note: '',
  })

  const load = useCallback(async () => {
    if (!supabase) {
      setError('Supabase not configured')
      return
    }
    setError(null)

    const { data: adminFlag, error: aErr } = await supabase.rpc('is_akc_admin')
    if (aErr) {
      setError(aErr.message)
      setIsAdmin(false)
      return
    }
    if (!adminFlag) {
      setIsAdmin(false)
      return
    }
    setIsAdmin(true)

    const [
      { data: w },
      { data: t },
      { data: v },
      { data: p },
      { data: led },
    ] = await Promise.all([
      supabase.from('akc_wallets').select('business_id, balance, total_spent, welcome_claimed, total_gifted'),
      supabase.from('akc_trial_allocations').select('*').order('created_at', { ascending: false }).limit(50),
      supabase.from('akc_vouchers').select('*').order('created_at', { ascending: false }),
      supabase.from('akc_influencer_pools').select('*').order('created_at', { ascending: false }),
      supabase.from('akc_ledger').select('entry_type, amount'),
    ])

    setWallets(w || [])
    setTrials((t as TrialRow[]) || [])
    setVouchers((v as Voucher[]) || [])
    setPools((p as Pool[]) || [])

    const mix: Record<string, number> = {}
    for (const row of led || []) {
      const k = row.entry_type as string
      const amt = Number(row.amount) || 0
      if (amt > 0) mix[k] = (mix[k] || 0) + amt
    }
    setLedgerMix(mix)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const bootstrap = async () => {
    if (!supabase) return
    setBusy(true)
    const { data, error: e } = await supabase.rpc('akc_bootstrap_admin')
    setBusy(false)
    if (e) setFlash(e.message)
    else if (data?.ok) {
      setFlash('You are now an AKC admin')
      await load()
    } else setFlash(data?.error || 'Bootstrap failed')
  }

  const sendGift = async () => {
    if (!supabase) return
    setBusy(true)
    setFlash(null)
    const { data, error: e } = await supabase.rpc('akc_admin_gift', {
      p_amount: giftForm.amount,
      p_note: giftForm.note || null,
      p_email: giftForm.email || null,
      p_business_id: null,
      p_entry_type: giftForm.entry_type,
    })
    setBusy(false)
    setConfirmGift(false)
    if (e) setFlash(e.message)
    else if (!data?.ok) setFlash(data?.error || 'Gift failed')
    else {
      setFlash(
        `Credited ${formatAkc(giftForm.amount)} (${giftForm.entry_type}) → ${giftForm.email || data.business_id} · bal ${formatAkc(data.balance ?? 0)}`,
      )
      setGiftForm((f) => ({ ...f, note: '' }))
      await load()
    }
  }

  const createVoucher = async () => {
    if (!supabase) return
    setBusy(true)
    const code = voucherForm.code.trim().toUpperCase()
    const { error: e } = await supabase.from('akc_vouchers').insert({
      code,
      akc_amount: voucherForm.akc_amount,
      issued_limit: voucherForm.issued_limit,
      expires_at: voucherForm.expires_at ? new Date(voucherForm.expires_at).toISOString() : null,
      note: voucherForm.note || null,
    })
    setBusy(false)
    if (e) setFlash(e.message)
    else {
      setFlash(`Voucher ${code} created`)
      setVoucherForm({ code: '', akc_amount: 10000, issued_limit: 100, expires_at: '', note: '' })
      await load()
    }
  }

  const createPool = async () => {
    if (!supabase) return
    setBusy(true)
    const handle = poolForm.handle.trim().replace(/^@/, '')
    const { error: e } = await supabase.from('akc_influencer_pools').insert({
      handle: `@${handle}`,
      pool_akc: poolForm.pool_akc,
      pool_kind: poolForm.pool_kind,
      note: poolForm.note || null,
    })
    setBusy(false)
    if (e) setFlash(e.message)
    else {
      setFlash(`Pool @${handle} created`)
      setPoolForm({ handle: '', pool_akc: 500_000, pool_kind: poolForm.pool_kind, note: '' })
      await load()
    }
  }

  const mixTotal = useMemo(
    () => Object.values(ledgerMix).reduce((a, b) => a + b, 0) || 1,
    [ledgerMix],
  )

  const claimedTrials = wallets.filter((w) => w.welcome_claimed).length

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-[24px] border border-[#E2E8F0] bg-white p-6 space-y-4">
          <h1 className="text-[20px] font-bold">AKC Admin Credits</h1>
          <p className="text-[13px] text-[#64748B]">
            You’re signed in but not an AKC admin yet. If no admins exist, bootstrap yourself (first user only).
          </p>
          {flash && <p className="text-[12px] text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">{flash}</p>}
          {error && <p className="text-[12px] text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => void bootstrap()}
              className="h-10 px-4 rounded-full text-white text-[13px] font-semibold"
              style={{ background: GRADIENT }}
            >
              Bootstrap admin
            </button>
            <Link to="/app/billing" className="h-10 px-4 rounded-full border border-[#E2E8F0] inline-flex items-center text-[13px]">
              ← Wallet
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (isAdmin === null) {
    return <div className="min-h-screen grid place-items-center text-[13px] text-[#64748B]">Loading admin…</div>
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'trials', label: 'Free trials' },
    { id: 'gifts', label: 'Gifts' },
    { id: 'vouchers', label: 'Vouchers' },
    { id: 'influencer', label: 'Influencers' },
    { id: 'sponsor', label: 'Sponsors' },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <header className="sticky top-0 z-20 border-b border-[#E2E8F0] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link to="/app/billing" className="text-[13px] text-[#64748B] hover:text-[#0F172A]">
              ← Billing
            </Link>
            <h1 className="text-[15px] font-bold">Admin · System Credits</h1>
          </div>
          <button type="button" onClick={() => void load()} className="h-8 px-3 rounded-full border text-[12px] bg-white">
            Refresh
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-4 sm:px-6 py-8 space-y-6">
        {flash && (
          <div className="rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 text-[13px]">{flash}</div>
        )}

        {/* Always-visible allocate form */}
        <section className="rounded-[24px] border border-[#E2E8F0] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
            <div>
              <h2 className="text-[16px] font-bold">Allocate credits</h2>
              <p className="text-[12px] text-[#64748B]">Gift · trial · sponsor · influencer — by owner email</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <label className="text-[11px] font-bold text-[#64748B] space-y-1">
              Owner email
              <input
                className="w-full h-10 rounded-xl border border-[#E2E8F0] px-3 text-[13px] font-normal text-[#0F172A]"
                value={giftForm.email}
                onChange={(e) => setGiftForm({ ...giftForm, email: e.target.value })}
                placeholder="owner@business.com"
              />
            </label>
            <label className="text-[11px] font-bold text-[#64748B] space-y-1">
              Amount (AKC)
              <input
                type="number"
                className="w-full h-10 rounded-xl border border-[#E2E8F0] px-3 text-[13px] font-normal text-[#0F172A]"
                value={giftForm.amount}
                onChange={(e) => setGiftForm({ ...giftForm, amount: Number(e.target.value) })}
              />
            </label>
            <label className="text-[11px] font-bold text-[#64748B] space-y-1">
              Type
              <select
                className="w-full h-10 rounded-xl border border-[#E2E8F0] px-3 text-[13px] font-normal text-[#0F172A]"
                value={giftForm.entry_type}
                onChange={(e) =>
                  setGiftForm({ ...giftForm, entry_type: e.target.value as typeof giftForm.entry_type })
                }
              >
                <option value="gift">Gift</option>
                <option value="trial">Free trial</option>
                <option value="sponsor">Sponsor</option>
                <option value="influencer">Influencer</option>
              </select>
            </label>
            <label className="text-[11px] font-bold text-[#64748B] space-y-1 sm:col-span-2 lg:col-span-1">
              Note
              <input
                className="w-full h-10 rounded-xl border border-[#E2E8F0] px-3 text-[13px] font-normal text-[#0F172A]"
                value={giftForm.note}
                onChange={(e) => setGiftForm({ ...giftForm, note: e.target.value })}
                placeholder="Optional"
              />
            </label>
            <div className="flex items-end">
              <button
                type="button"
                disabled={busy || !giftForm.email}
                onClick={() => setConfirmGift(true)}
                className="h-10 w-full rounded-full text-white text-[13px] font-semibold disabled:opacity-40"
                style={{ background: GRADIENT }}
              >
                Review & send
              </button>
            </div>
          </div>
        </section>

        {/* Mix summary */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { k: 'welcome', l: 'Welcome trials' },
            { k: 'trial', l: 'Trial gifts' },
            { k: 'gift', l: 'Gifts' },
            { k: 'sponsor', l: 'Sponsors' },
            { k: 'influencer', l: 'Influencer' },
          ].map((x) => {
            const v = ledgerMix[x.k] || 0
            const pct = Math.round((v / mixTotal) * 100)
            return (
              <div key={x.k} className="rounded-2xl border border-[#E2E8F0] bg-white p-4">
                <div className="text-[11px] font-bold text-[#64748B]">{x.l}</div>
                <div className="mt-1 text-[16px] font-bold">{formatAkc(v)}</div>
                <div className="mt-2 h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: GRADIENT }} />
                </div>
                <div className="mt-1 text-[10px] text-[#94A3B8]">{pct}% of credited mix</div>
              </div>
            )
          })}
        </section>

        <div className="flex flex-wrap gap-2 border-b border-[#E2E8F0] pb-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`h-9 px-4 rounded-full text-[12px] font-semibold ${
                tab === t.id ? 'text-white' : 'bg-white border border-[#E2E8F0] text-[#475569]'
              }`}
              style={tab === t.id ? { background: GRADIENT } : undefined}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'trials' && (
          <section className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border bg-white p-4">
                <div className="text-[11px] text-[#64748B] font-bold">Claimed welcomes</div>
                <div className="text-[28px] font-[800]">{claimedTrials}</div>
                <div className="text-[11px] text-[#64748B]">× {formatAkc(WELCOME_AKC)} = {formatAkc(claimedTrials * WELCOME_AKC)}</div>
              </div>
              <div className="rounded-2xl border bg-white p-4">
                <div className="text-[11px] text-[#64748B] font-bold">Wallets</div>
                <div className="text-[28px] font-[800]">{wallets.length}</div>
              </div>
              <div className="rounded-2xl border bg-white p-4">
                <div className="text-[11px] text-[#64748B] font-bold">Trial allocations logged</div>
                <div className="text-[28px] font-[800]">{trials.length}</div>
              </div>
            </div>
            <div className="rounded-[20px] border bg-white overflow-hidden">
              <table className="w-full text-[12px] text-left">
                <thead className="bg-[#F8FAFC] text-[#64748B]">
                  <tr>
                    <th className="px-4 py-2">When</th>
                    <th className="px-4 py-2">Business</th>
                    <th className="px-4 py-2">AKC</th>
                    <th className="px-4 py-2">Days</th>
                    <th className="px-4 py-2">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {trials.map((t) => (
                    <tr key={t.id} className="border-t">
                      <td className="px-4 py-2 text-[#64748B]">{new Date(t.created_at).toLocaleString()}</td>
                      <td className="px-4 py-2 font-mono text-[11px]">{t.business_id.slice(0, 8)}…</td>
                      <td className="px-4 py-2 font-bold">{formatAkc(t.akc_amount)}</td>
                      <td className="px-4 py-2">{t.days}</td>
                      <td className="px-4 py-2">{t.note ?? '—'}</td>
                    </tr>
                  ))}
                  {trials.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-[#94A3B8]">
                        No trial allocations yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tab === 'gifts' && (
          <section className="rounded-[20px] border bg-white p-5 text-[13px] text-[#475569]">
            Use the allocate form above with type <strong>Gift</strong>. Receipts land in the ledger mix and each business wallet.
            Top gifted wallets:
            <div className="mt-4 space-y-2">
              {[...wallets]
                .sort((a, b) => b.total_gifted - a.total_gifted)
                .slice(0, 8)
                .map((w) => (
                  <div key={w.business_id} className="flex justify-between border-b border-[#E2E8F0] pb-2">
                    <span className="font-mono text-[11px]">{w.business_id.slice(0, 12)}…</span>
                    <span className="font-bold text-[#0F172A]">{formatAkc(w.total_gifted)} gifted · bal {formatAkc(w.balance)}</span>
                  </div>
                ))}
            </div>
          </section>
        )}

        {tab === 'vouchers' && (
          <section className="space-y-4">
            <div className="rounded-[20px] border bg-white p-5 grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <input
                className="h-10 rounded-xl border px-3 text-[13px]"
                placeholder="CODE"
                value={voucherForm.code}
                onChange={(e) => setVoucherForm({ ...voucherForm, code: e.target.value })}
              />
              <input
                type="number"
                className="h-10 rounded-xl border px-3 text-[13px]"
                placeholder="AKC"
                value={voucherForm.akc_amount}
                onChange={(e) => setVoucherForm({ ...voucherForm, akc_amount: Number(e.target.value) })}
              />
              <input
                type="number"
                className="h-10 rounded-xl border px-3 text-[13px]"
                placeholder="Issue limit"
                value={voucherForm.issued_limit}
                onChange={(e) => setVoucherForm({ ...voucherForm, issued_limit: Number(e.target.value) })}
              />
              <input
                type="date"
                className="h-10 rounded-xl border px-3 text-[13px]"
                value={voucherForm.expires_at}
                onChange={(e) => setVoucherForm({ ...voucherForm, expires_at: e.target.value })}
              />
              <button
                type="button"
                disabled={busy || !voucherForm.code}
                onClick={() => void createVoucher()}
                className="h-10 rounded-full text-white text-[13px] font-semibold"
                style={{ background: GRADIENT }}
              >
                Create voucher
              </button>
            </div>
            <div className="rounded-[20px] border bg-white overflow-hidden">
              <table className="w-full text-[12px] text-left">
                <thead className="bg-[#F8FAFC] text-[#64748B]">
                  <tr>
                    <th className="px-4 py-2">Code</th>
                    <th className="px-4 py-2">AKC</th>
                    <th className="px-4 py-2">Redeemed</th>
                    <th className="px-4 py-2">Expires</th>
                    <th className="px-4 py-2">Active</th>
                  </tr>
                </thead>
                <tbody>
                  {vouchers.map((v) => (
                    <tr key={v.id} className="border-t">
                      <td className="px-4 py-2 font-mono font-bold">{v.code}</td>
                      <td className="px-4 py-2">{formatAkc(v.akc_amount)}</td>
                      <td className="px-4 py-2">
                        {v.redeemed_count}/{v.issued_limit}
                      </td>
                      <td className="px-4 py-2">{v.expires_at ? new Date(v.expires_at).toLocaleDateString() : '—'}</td>
                      <td className="px-4 py-2">{v.active ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                  {vouchers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-[#94A3B8]">
                        No vouchers yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {(tab === 'influencer' || tab === 'sponsor') && (
          <section className="space-y-4">
            <div className="rounded-[20px] border bg-white p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <input
                className="h-10 rounded-xl border px-3 text-[13px]"
                placeholder="@handle"
                value={poolForm.handle}
                onChange={(e) => setPoolForm({ ...poolForm, handle: e.target.value })}
              />
              <input
                type="number"
                className="h-10 rounded-xl border px-3 text-[13px]"
                placeholder="Pool AKC"
                value={poolForm.pool_akc}
                onChange={(e) => setPoolForm({ ...poolForm, pool_akc: Number(e.target.value) })}
              />
              <select
                className="h-10 rounded-xl border px-3 text-[13px]"
                value={tab === 'sponsor' ? 'sponsor' : poolForm.pool_kind}
                onChange={(e) =>
                  setPoolForm({
                    ...poolForm,
                    pool_kind: e.target.value as typeof poolForm.pool_kind,
                  })
                }
              >
                <option value="influencer">Influencer</option>
                <option value="sponsor">Sponsor</option>
                <option value="partner">Partner</option>
              </select>
              <button
                type="button"
                disabled={busy || !poolForm.handle}
                onClick={() => {
                  if (tab === 'sponsor') setPoolForm((f) => ({ ...f, pool_kind: 'sponsor' }))
                  void createPool()
                }}
                className="h-10 rounded-full text-white text-[13px] font-semibold"
                style={{ background: GRADIENT }}
              >
                Add pool
              </button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {pools
                .filter((p) =>
                  tab === 'sponsor' ? p.pool_kind === 'sponsor' || p.pool_kind === 'partner' : p.pool_kind === 'influencer',
                )
                .map((p) => {
                  const pct = p.pool_akc ? Math.min(100, Math.round((p.distributed_akc / p.pool_akc) * 100)) : 0
                  return (
                    <div key={p.id} className="rounded-[20px] border bg-white p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{p.handle}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full border capitalize">{p.pool_kind}</span>
                      </div>
                      <div className="mt-2 text-[18px] font-[800]">{formatAkc(p.pool_akc)}</div>
                      <div className="mt-2 h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
                        <div className="h-full" style={{ width: `${pct}%`, background: GRADIENT }} />
                      </div>
                      <div className="mt-2 text-[11px] text-[#64748B] flex justify-between">
                        <span>Distributed {formatAkc(p.distributed_akc)}</span>
                        <span>
                          {p.conversions} conv · {p.link_clicks} clicks
                        </span>
                      </div>
                    </div>
                  )
                })}
            </div>
          </section>
        )}
      </main>

      {confirmGift && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-[24px] bg-white p-6 space-y-4">
            <h3 className="text-[16px] font-bold">Confirm allocation</h3>
            <p className="text-[13px] text-[#475569]">
              Credit <strong>{formatAkc(giftForm.amount)}</strong> as <strong>{giftForm.entry_type}</strong> to{' '}
              <strong>{giftForm.email}</strong>?
            </p>
            <div className="flex gap-2 justify-end">
              <button type="button" className="h-10 px-4 rounded-full border text-[13px]" onClick={() => setConfirmGift(false)}>
                Cancel
              </button>
              <button
                type="button"
                disabled={busy}
                className="h-10 px-4 rounded-full text-white text-[13px] font-semibold"
                style={{ background: GRADIENT }}
                onClick={() => void sendGift()}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
