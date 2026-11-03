import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase, supabaseConfigured, type Business, type RegionKey } from '../../../lib/supabase'
import AppUserMenu from '../../../components/app/AppUserMenu'
import { seedDemoData } from '../../../lib/seedDemoData'

type Kpis = {
  missedSaved: number
  bookings: number
  social: number
  minutes: number
  resolution: number
  transfer: number
  source: 'live' | 'demo'
}

const DEMO: Kpis = {
  missedSaved: 342,
  bookings: 128,
  social: 89,
  minutes: 1200,
  resolution: 94,
  transfer: 6,
  source: 'demo',
}

export default function DashboardPage() {
  const [params] = useSearchParams()
  const region = params.get('region') || 'africa'
  const [business, setBusiness] = useState<Business | null>(null)
  const [kpis, setKpis] = useState<Kpis>(DEMO)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [seedMsg, setSeedMsg] = useState<string | null>(null)
  const [seeding, setSeeding] = useState(false)

  useEffect(() => {
    let cancelled = false
    if (!supabaseConfigured || !supabase) {
      setKpis(DEMO)
      setLoading(false)
      return
    }
    // Imported binding isn't narrowed by control-flow — capture non-null client.
    const client = supabase!

    let channel: ReturnType<typeof client.channel> | null = null

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const { data: userData } = await client.auth.getUser()
        const uid = userData.user?.id
        if (!uid) {
          setKpis(DEMO)
          return
        }
        const { data: businesses, error: bErr } = await client
          .from('businesses')
          .select('*')
          .eq('user_id', uid)
          .order('created_at', { ascending: true })
          .limit(1)
        if (bErr) throw bErr
        const biz = (businesses?.[0] as Business | undefined) ?? null
        if (!cancelled) setBusiness(biz)
        if (!biz) {
          if (!cancelled) setKpis(DEMO)
          return
        }

        const bid = biz.id
        const [callsRes, bookingsRes, socialRes, analyticsRes] = await Promise.all([
          client.from('calls').select('id, missed, saved_from_missed, duration_sec').eq('business_id', bid),
          client.from('bookings').select('id').eq('business_id', bid),
          client.from('social_conversions').select('id, paid, booked').eq('business_id', bid),
          client
            .from('analytics_events')
            .select('event_type, value')
            .eq('business_id', bid)
            .in('event_type', ['resolution', 'transfer', 'minutes']),
        ])

        const calls = callsRes.data || []
        const bookings = bookingsRes.data || []
        const social = socialRes.data || []
        const events = analyticsRes.data || []

        const missedSaved =
          calls.filter((c) => c.saved_from_missed).length ||
          calls.filter((c) => c.missed === false).length
        const minutes =
          Math.round(calls.reduce((s, c) => s + (c.duration_sec || 0), 0) / 60) ||
          Number(events.find((e) => e.event_type === 'minutes')?.value || 0)
        const resolution = Number(events.find((e) => e.event_type === 'resolution')?.value || 94)
        const transfer = Number(events.find((e) => e.event_type === 'transfer')?.value || 6)

        const liveEmpty =
          calls.length === 0 && bookings.length === 0 && social.length === 0 && events.length === 0

        if (!cancelled) {
          setKpis(
            liveEmpty
              ? DEMO
              : {
                  missedSaved: missedSaved || DEMO.missedSaved,
                  bookings: bookings.length || DEMO.bookings,
                  social: social.length || DEMO.social,
                  minutes: minutes || DEMO.minutes,
                  resolution: resolution || DEMO.resolution,
                  transfer: transfer || DEMO.transfer,
                  source: 'live',
                },
          )
        }

        if (channel) client.removeChannel(channel)
        const filter = `business_id=eq.${bid}`
        channel = client
          .channel(`kpi-${bid}`)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'analytics_events', filter }, () => {
            void load()
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'calls', filter }, () => {
            void load()
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings', filter }, () => {
            void load()
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'social_conversions', filter }, () => {
            void load()
          })
          .subscribe()
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || String(e))
          setKpis(DEMO)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
      if (channel) client.removeChannel(channel)
    }
  }, [])

  const cards = useMemo(
    () => [
      { label: 'Missed calls saved', value: kpis.missedSaved.toLocaleString(), hint: 'calls.saved_from_missed' },
      { label: 'Bookings', value: kpis.bookings.toLocaleString(), hint: 'bookings' },
      { label: 'Social conversions', value: kpis.social.toLocaleString(), hint: 'social_conversions' },
      { label: 'Minutes', value: kpis.minutes >= 1000 ? `${(kpis.minutes / 1000).toFixed(1)}k` : String(kpis.minutes), hint: 'call duration' },
      { label: 'Resolution', value: `${kpis.resolution}%`, hint: 'analytics_events' },
      { label: 'Transfer', value: `${kpis.transfer}%`, hint: 'analytics_events' },
    ],
    [kpis],
  )

  return (
    <div className="min-h-screen bg-[#E6EBF4] text-[#0F172A]">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-3 px-4 py-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Gap 2 · KPI Dashboard</div>
            <h1 className="text-[20px] font-extrabold tracking-tight">Operations hub</h1>
          </div>
          <div className="flex items-center gap-2 text-[12px] font-semibold">
            <span className="rounded-lg border border-slate-200 bg-[#F8FAFC] px-2.5 py-1 text-slate-600">
              {business?.name || 'Demo business'} · {region}
            </span>
            <span
              className={`rounded-lg px-2.5 py-1 ${kpis.source === 'live' ? 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}
            >
              {loading ? 'Loading…' : kpis.source === 'live' ? 'Supabase live' : 'Demo seed'}
            </span>
            {business?.id && kpis.source === 'demo' ? (
              <button
                type="button"
                disabled={seeding}
                onClick={() => {
                  if (!supabase || !business.id) return
                  setSeeding(true)
                  setSeedMsg(null)
                  void seedDemoData(supabase, business.id, region as RegionKey)
                    .then((r) => {
                      setSeedMsg(r.seeded ? 'Demo pack seeded — refresh KPIs' : r.reason || 'Skipped')
                      window.location.reload()
                    })
                    .catch((e: unknown) => setSeedMsg(e instanceof Error ? e.message : String(e)))
                    .finally(() => setSeeding(false))
                }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 disabled:opacity-50"
              >
                {seeding ? 'Seeding…' : 'Seed demo'}
              </button>
            ) : null}
            <Link to={`/app/inbox?region=${region}`} className="rounded-xl bg-[#0F172A] px-3 py-1.5 text-white">
              Inbox →
            </Link>
            <AppUserMenu region={region} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-4 py-8">
        {!supabaseConfigured && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] text-amber-900">
            Supabase client not configured — showing demo KPI seed.
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700">
            {error}
          </div>
        )}
        {seedMsg && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[12px] text-emerald-800">
            {seedMsg}
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <div key={c.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{c.label}</div>
              <div className="mt-2 text-[32px] font-extrabold tracking-tight">{c.value}</div>
              <div className="mt-1 text-[11px] text-slate-500">{c.hint}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-[13px] font-bold">Realtime</div>
            <p className="mt-2 text-[12px] leading-5 text-slate-600">
              Subscribed to <code className="text-[11px]">analytics_events</code> for this business. New call/booking/social rows
              update cards after refresh channel events.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-[13px] font-bold">Adapters</div>
            <p className="mt-2 text-[12px] leading-5 text-slate-600">
              {business
                ? `${business.telephony_provider} · ${business.payment_provider} · ${business.compliance}`
                : "Africa's Talking · M-Pesa · NDPR (demo)"}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {['calls', 'calendar', 'knowledge', 'social', 'billing', 'settings'].map((m) => (
                <Link
                  key={m}
                  to={`/app/${m}?region=${region}`}
                  className="rounded-lg border border-slate-200 bg-[#F8FAFC] px-2.5 py-1 text-[11px] font-semibold capitalize text-slate-700"
                >
                  {m}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
