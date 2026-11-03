import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom'
import { supabase } from '../../../lib/supabase'
import AppUserMenu from '../../../components/app/AppUserMenu'
import { seedDemoData } from '../../../lib/seedDemoData'
import type { RegionKey } from '../../../lib/supabase'

const MODULE_META: Record<
  string,
  { title: string; table: string; blurb: string; columns: string[]; form?: 'team' | 'booking' | 'knowledge' | 'integration' | 'analytics' | 'simulate-call' | 'social' }
> = {
  calls: {
    title: 'Call Logs',
    table: 'calls',
    blurb: 'S3 aikova-recordings · Whisper transcripts · sentiment',
    columns: ['phone_from', 'provider', 'region', 'status', 'duration_sec', 'sentiment'],
    form: 'simulate-call',
  },
  calendar: {
    title: 'Calendar',
    table: 'bookings',
    blurb: 'Internal bookings now · Google/Outlook when OAuth keys land',
    columns: ['contact_name', 'starts_at', 'ends_at', 'timezone', 'status', 'provider'],
    form: 'booking',
  },
  knowledge: {
    title: 'Knowledge Sources',
    table: 'knowledge_sources',
    blurb: 'Text sources now · embeddings when OPENAI_API_KEY set',
    columns: ['source_type', 'title', 'token_count'],
    form: 'knowledge',
  },
  voices: {
    title: 'Voice Mesh',
    table: 'voices',
    blurb: 'Coqui Africa vs ElevenLabs Eurozone · global library + yours',
    columns: ['name', 'accent', 'provider', 'language_code', 'accuracy'],
  },
  social: {
    title: 'Social-to-Sale',
    table: 'social_conversions',
    blurb: 'Comment → Auto-DM → Book — simulate without Meta tokens',
    columns: ['platform', 'trigger_text', 'auto_dm_sent', 'booked', 'paid', 'status'],
    form: 'social',
  },
  team: {
    title: 'Team',
    table: 'team_members',
    blurb: 'Waterfall routing · emergency contacts · handoff',
    columns: ['name', 'role', 'available', 'emergency', 'waterfall_order'],
    form: 'team',
  },
  analytics: {
    title: 'Analytics',
    table: 'analytics_events',
    blurb: 'Funnel + language breakdown events',
    columns: ['event_type', 'channel', 'region', 'language', 'value'],
    form: 'analytics',
  },
  integrations: {
    title: 'Integrations',
    table: 'integrations',
    blurb: "Toggle connection status — live OAuth needs provider keys",
    columns: ['provider', 'status', 'region'],
    form: 'integration',
  },
}

export default function ModulePage() {
  const { moduleId } = useParams()
  const location = useLocation()
  const [params] = useSearchParams()
  const region = (params.get('region') || 'africa') as RegionKey
  const id =
    moduleId ||
    location.pathname.replace(/^\/app\/?/, '').split('/')[0] ||
    'calls'
  const meta = MODULE_META[id] || {
    title: id,
    table: id,
    blurb: 'Supabase-wired module',
    columns: ['id'],
  }

  const [rows, setRows] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [businessId, setBusinessId] = useState<string | null>(null)

  // form fields
  const [fName, setFName] = useState('')
  const [fRole, setFRole] = useState('agent')
  const [fPhone, setFPhone] = useState('')
  const [fTitle, setFTitle] = useState('')
  const [fContent, setFContent] = useState('')
  const [fProvider, setFProvider] = useState(region === 'africa' ? 'africas_talking' : 'twilio')
  const [fEvent, setFEvent] = useState('custom')
  const [fContact, setFContact] = useState('')
  const [fStarts, setFStarts] = useState('')
  const [fPlatform, setFPlatform] = useState<'instagram' | 'facebook'>('instagram')
  const [fTrigger, setFTrigger] = useState('How much?')

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    if (!supabase) {
      setRows([])
      setLoading(false)
      return
    }
    try {
      const { data: userData } = await supabase.auth.getUser()
      const uid = userData.user?.id
      if (!uid) {
        setRows([])
        return
      }
      const { data: biz } = await supabase
        .from('businesses')
        .select('id')
        .eq('user_id', uid)
        .limit(1)
        .maybeSingle()
      if (!biz?.id) {
        setRows([])
        setBusinessId(null)
        return
      }
      setBusinessId(biz.id)

      let query = supabase.from(meta.table).select('*').limit(50)
      if (meta.table === 'voices') {
        query = query.or(`business_id.eq.${biz.id},business_id.is.null`)
      } else {
        query = query.eq('business_id', biz.id)
      }
      const { data, error: qErr } = await query.order('created_at', { ascending: false })
      if (qErr) throw qErr
      setRows((data as Record<string, unknown>[]) || [])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }, [meta.table])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (!supabase || !businessId) return
    const client = supabase
    const channel = client
      .channel(`module-${meta.table}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: meta.table }, () => {
        void load()
      })
      .subscribe()
    return () => {
      void client.removeChannel(channel)
    }
  }, [businessId, meta.table, load])

  const emptyHint = useMemo(
    () =>
      businessId
        ? 'No rows yet — use the form below or Seed demo data.'
        : 'Create a business via signup / settings to bind RLS rows.',
    [businessId],
  )

  const runSeed = async () => {
    if (!supabase || !businessId) return
    setBusy(true)
    setMsg(null)
    setError(null)
    try {
      const r = await seedDemoData(supabase, businessId, region)
      setMsg(r.seeded ? `Seeded demo pack` : r.reason || 'Skipped')
      await load()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!supabase || !businessId || !meta.form) return
    setBusy(true)
    setMsg(null)
    setError(null)
    try {
      if (meta.form === 'team') {
        if (!fName.trim()) throw new Error('Name required')
        const { error: err } = await supabase.from('team_members').insert({
          business_id: businessId,
          name: fName.trim(),
          role: fRole,
          phone: fPhone || null,
          available: true,
          emergency: fRole === 'owner',
          waterfall_order: fRole === 'owner' ? 90 : 20,
        })
        if (err) throw err
        setFName('')
        setMsg('Team member added')
      } else if (meta.form === 'booking') {
        if (!fContact.trim() || !fStarts) throw new Error('Contact + start time required')
        const start = new Date(fStarts)
        const end = new Date(start.getTime() + 60 * 60_000)
        const { error: err } = await supabase.from('bookings').insert({
          business_id: businessId,
          contact_name: fContact.trim(),
          contact_phone: fPhone || null,
          starts_at: start.toISOString(),
          ends_at: end.toISOString(),
          timezone: region === 'africa' ? 'Africa/Lagos' : 'Europe/Paris',
          provider: 'internal',
          status: 'confirmed',
          notes: 'Created in app calendar',
        })
        if (err) throw err
        setFContact('')
        setMsg('Booking created')
      } else if (meta.form === 'knowledge') {
        if (!fContent.trim()) throw new Error('Content required')
        const { error: err } = await supabase.from('knowledge_sources').insert({
          business_id: businessId,
          source_type: 'faq',
          title: fTitle.trim() || 'FAQ',
          content: fContent.trim(),
          token_count: Math.round(fContent.trim().split(/\s+/).length * 1.3),
        })
        if (err) throw err
        setFTitle('')
        setFContent('')
        setMsg('Knowledge source saved (text search ready)')
      } else if (meta.form === 'integration') {
        const { error: err } = await supabase.from('integrations').upsert(
          {
            business_id: businessId,
            provider: fProvider,
            status: 'connected',
            region,
            config: { toggled_at: new Date().toISOString() },
          },
          { onConflict: 'business_id,provider' },
        )
        if (err) throw err
        setMsg(`${fProvider} marked connected`)
      } else if (meta.form === 'analytics') {
        const { error: err } = await supabase.from('analytics_events').insert({
          business_id: businessId,
          event_type: fEvent || 'custom',
          channel: 'app',
          region,
          value: 1,
          meta: { source: 'module_ui' },
        })
        if (err) throw err
        setMsg('Event logged')
      } else if (meta.form === 'social') {
        const { error: err } = await supabase.from('social_conversions').insert({
          business_id: businessId,
          platform: fPlatform,
          trigger_type: 'comment',
          trigger_text: fTrigger || 'How much?',
          auto_dm_sent: false,
          status: 'open',
        })
        if (err) throw err
        setMsg('Social conversion logged')
      } else if (meta.form === 'simulate-call') {
        const phone = fPhone || (region === 'africa' ? '+2348012345678' : '+447700900123')
        const { data: call, error: cErr } = await supabase
          .from('calls')
          .insert({
            business_id: businessId,
            phone_from: phone,
            region,
            provider: region === 'africa' ? 'africas_talking' : 'twilio',
            status: 'completed',
            duration_sec: 20,
            missed: false,
            saved_from_missed: false,
            transcript: 'Simulated inbound call from module UI (no telco keys).',
            sentiment: 'neutral',
          })
          .select()
          .single()
        if (cErr) throw cErr
        const { data: conv, error: vErr } = await supabase
          .from('conversations')
          .insert({
            business_id: businessId,
            contact_name: fName.trim() || 'Simulated caller',
            contact_phone: phone,
            contact_channel: 'call',
            region,
            language: 'EN',
            intent: 'question',
            sentiment: 'neutral',
            ai_confidence: 0.9,
            status: 'new',
            preview: `Simulated call from ${phone}`,
            tags: ['simulate'],
          })
          .select()
          .single()
        if (vErr) throw vErr
        await supabase.from('calls').update({ conversation_id: conv.id }).eq('id', call.id)
        await supabase.from('messages').insert([
          {
            conversation_id: conv.id,
            business_id: businessId,
            from_role: 'user',
            body: `Simulated call from ${phone}`,
          },
          {
            conversation_id: conv.id,
            business_id: businessId,
            from_role: 'ai',
            body: 'Logged in Gift Inbox from Calls module simulate.',
            memory_note: 'simulate-call',
          },
        ])
        setMsg('Call + inbox thread created — open Gift Inbox')
      }
      await load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  const toggleIntegration = async (row: Record<string, unknown>) => {
    if (!supabase || !businessId || !row.id) return
    const next = row.status === 'connected' ? 'disconnected' : 'connected'
    const { error: err } = await supabase
      .from('integrations')
      .update({ status: next })
      .eq('id', row.id)
    if (err) setError(err.message)
    else await load()
  }

  const removeTeam = async (row: Record<string, unknown>) => {
    if (!supabase || !row.id) return
    const { error: err } = await supabase.from('team_members').delete().eq('id', row.id)
    if (err) setError(err.message)
    else await load()
  }

  return (
    <div className="min-h-screen bg-[#E6EBF4] text-[#0F172A]">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-3 px-4 py-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Phase 3 · {meta.table}
            </div>
            <h1 className="text-[20px] font-extrabold tracking-tight">{meta.title}</h1>
            <p className="text-[12px] text-slate-500">{meta.blurb}</p>
          </div>
          <div className="flex items-center gap-2 text-[12px] font-semibold">
            <button
              type="button"
              onClick={() => void load()}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5"
            >
              Refresh
            </button>
            <Link to={`/app/dashboard?region=${region}`} className="rounded-xl border border-slate-200 bg-white px-3 py-1.5">
              KPIs
            </Link>
            <Link to={`/app/inbox?region=${region}`} className="rounded-xl bg-[#0F172A] px-3 py-1.5 text-white">
              Inbox
            </Link>
            <AppUserMenu region={region} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-4 py-6 space-y-4">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700">{error}</div>
        )}
        {msg && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[12px] text-emerald-800">{msg}</div>
        )}

        {meta.form && businessId ? (
          <form
            onSubmit={onSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm grid gap-3 sm:grid-cols-2 lg:grid-cols-4 items-end"
          >
            {meta.form === 'team' && (
              <>
                <label className="text-[11px] font-bold text-slate-500 space-y-1 block">
                  Name
                  <input className="w-full h-10 rounded-xl border border-slate-200 px-3 text-[13px]" value={fName} onChange={(e) => setFName(e.target.value)} />
                </label>
                <label className="text-[11px] font-bold text-slate-500 space-y-1 block">
                  Role
                  <select className="w-full h-10 rounded-xl border border-slate-200 px-3 text-[13px]" value={fRole} onChange={(e) => setFRole(e.target.value)}>
                    <option value="agent">agent</option>
                    <option value="owner">owner</option>
                    <option value="manager">manager</option>
                  </select>
                </label>
                <label className="text-[11px] font-bold text-slate-500 space-y-1 block">
                  Phone
                  <input className="w-full h-10 rounded-xl border border-slate-200 px-3 text-[13px]" value={fPhone} onChange={(e) => setFPhone(e.target.value)} />
                </label>
              </>
            )}
            {meta.form === 'booking' && (
              <>
                <label className="text-[11px] font-bold text-slate-500 space-y-1 block">
                  Contact
                  <input className="w-full h-10 rounded-xl border border-slate-200 px-3 text-[13px]" value={fContact} onChange={(e) => setFContact(e.target.value)} />
                </label>
                <label className="text-[11px] font-bold text-slate-500 space-y-1 block">
                  Phone
                  <input className="w-full h-10 rounded-xl border border-slate-200 px-3 text-[13px]" value={fPhone} onChange={(e) => setFPhone(e.target.value)} />
                </label>
                <label className="text-[11px] font-bold text-slate-500 space-y-1 block sm:col-span-2">
                  Starts
                  <input type="datetime-local" className="w-full h-10 rounded-xl border border-slate-200 px-3 text-[13px]" value={fStarts} onChange={(e) => setFStarts(e.target.value)} />
                </label>
              </>
            )}
            {meta.form === 'knowledge' && (
              <>
                <label className="text-[11px] font-bold text-slate-500 space-y-1 block">
                  Title
                  <input className="w-full h-10 rounded-xl border border-slate-200 px-3 text-[13px]" value={fTitle} onChange={(e) => setFTitle(e.target.value)} />
                </label>
                <label className="text-[11px] font-bold text-slate-500 space-y-1 block sm:col-span-3">
                  Content
                  <input className="w-full h-10 rounded-xl border border-slate-200 px-3 text-[13px]" value={fContent} onChange={(e) => setFContent(e.target.value)} />
                </label>
              </>
            )}
            {meta.form === 'integration' && (
              <label className="text-[11px] font-bold text-slate-500 space-y-1 block sm:col-span-2">
                Provider
                <select className="w-full h-10 rounded-xl border border-slate-200 px-3 text-[13px]" value={fProvider} onChange={(e) => setFProvider(e.target.value)}>
                  <option value="africas_talking">Africa&apos;s Talking</option>
                  <option value="twilio">Twilio</option>
                  <option value="m_pesa">M-Pesa</option>
                  <option value="stripe">Stripe</option>
                  <option value="flutterwave">Flutterwave</option>
                  <option value="paystack">Paystack</option>
                  <option value="hubspot">HubSpot</option>
                </select>
              </label>
            )}
            {meta.form === 'analytics' && (
              <label className="text-[11px] font-bold text-slate-500 space-y-1 block sm:col-span-2">
                Event type
                <input className="w-full h-10 rounded-xl border border-slate-200 px-3 text-[13px]" value={fEvent} onChange={(e) => setFEvent(e.target.value)} />
              </label>
            )}
            {meta.form === 'social' && (
              <>
                <label className="text-[11px] font-bold text-slate-500 space-y-1 block">
                  Platform
                  <select className="w-full h-10 rounded-xl border border-slate-200 px-3 text-[13px]" value={fPlatform} onChange={(e) => setFPlatform(e.target.value as 'instagram' | 'facebook')}>
                    <option value="instagram">instagram</option>
                    <option value="facebook">facebook</option>
                  </select>
                </label>
                <label className="text-[11px] font-bold text-slate-500 space-y-1 block sm:col-span-2">
                  Trigger text
                  <input className="w-full h-10 rounded-xl border border-slate-200 px-3 text-[13px]" value={fTrigger} onChange={(e) => setFTrigger(e.target.value)} />
                </label>
              </>
            )}
            {meta.form === 'simulate-call' && (
              <>
                <label className="text-[11px] font-bold text-slate-500 space-y-1 block">
                  Caller name
                  <input className="w-full h-10 rounded-xl border border-slate-200 px-3 text-[13px]" value={fName} onChange={(e) => setFName(e.target.value)} placeholder="Aisha" />
                </label>
                <label className="text-[11px] font-bold text-slate-500 space-y-1 block">
                  Phone
                  <input className="w-full h-10 rounded-xl border border-slate-200 px-3 text-[13px]" value={fPhone} onChange={(e) => setFPhone(e.target.value)} placeholder={region === 'africa' ? '+234…' : '+44…'} />
                </label>
              </>
            )}
            <button
              type="submit"
              disabled={busy}
              className="h-10 rounded-xl bg-[#0F172A] text-white text-[12px] font-bold px-4 disabled:opacity-50"
            >
              {busy ? 'Working…' : meta.form === 'simulate-call' ? 'Simulate inbound call' : 'Add'}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void runSeed()}
              className="h-10 rounded-xl border border-slate-200 bg-[#F8FAFC] text-[12px] font-bold px-4 disabled:opacity-50"
            >
              Seed demo pack
            </button>
          </form>
        ) : null}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 text-[11px] font-semibold text-slate-500">
            <span>{loading ? 'Loading…' : `${rows.length} row${rows.length === 1 ? '' : 's'}`}</span>
            <span className="font-mono text-slate-400">{meta.table}</span>
          </div>
          {rows.length === 0 && !loading ? (
            <div className="px-6 py-16 text-center text-[13px] text-slate-500">{emptyHint}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-[12px]">
                <thead className="bg-[#F8FAFC] text-[10px] uppercase tracking-wider text-slate-400">
                  <tr>
                    {meta.columns.map((c) => (
                      <th key={c} className="px-4 py-2 font-bold">
                        {c}
                      </th>
                    ))}
                    {(meta.form === 'team' || meta.form === 'integration') && (
                      <th className="px-4 py-2 font-bold">actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={String(row.id)} className="border-t border-slate-100">
                      {meta.columns.map((c) => (
                        <td key={c} className="px-4 py-2.5 max-w-[220px] truncate">
                          {formatCell(row[c])}
                        </td>
                      ))}
                      {meta.form === 'team' && (
                        <td className="px-4 py-2.5">
                          <button type="button" className="text-red-600 font-bold" onClick={() => void removeTeam(row)}>
                            Remove
                          </button>
                        </td>
                      )}
                      {meta.form === 'integration' && (
                        <td className="px-4 py-2.5">
                          <button type="button" className="font-bold text-[#2962FF]" onClick={() => void toggleIntegration(row)}>
                            Toggle
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function formatCell(v: unknown) {
  if (v == null) return '—'
  if (typeof v === 'boolean') return v ? 'yes' : 'no'
  if (typeof v === 'object') return JSON.stringify(v)
  return String(v)
}
