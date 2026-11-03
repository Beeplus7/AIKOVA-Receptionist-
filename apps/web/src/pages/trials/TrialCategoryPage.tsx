import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getTrial } from '../../lib/trials/catalog'
import InstantTryCallPanel from '../../components/try/InstantTryCallPanel'

export default function TrialCategoryPage() {
  const { category } = useParams()
  const trial = useMemo(() => (category ? getTrial(category) : undefined), [category])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [business, setBusiness] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if (!trial) return
    document.title = trial.metaTitle
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    meta.content = trial.metaDescription
    const ensure = (property: string, content: string) => {
      let el = document.head.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute('property', property)
        document.head.appendChild(el)
      }
      el.content = content
    }
    ensure('og:title', trial.metaTitle)
    ensure('og:description', trial.metaDescription)
    ensure('og:url', `https://ai-receptionist.aikova.co.uk/trials/${trial.slug}`)
    ensure('og:image', 'https://ai-receptionist.aikova.co.uk/og-image.jpg')
  }, [trial])

  if (!trial) return <Navigate to="/trials" replace />

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setErr(null)
    setDone(null)
    try {
      const res = await fetch('/api/trial-request', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          business,
          category: trial.slug,
          message,
          linkedinTag: trial.linkedinTag,
        }),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || 'Request failed')
      setDone(j.next || 'Request received')
      setMessage('')
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : 'Request failed')
    }
    setBusy(false)
  }

  return (
    <div className="min-h-screen bg-[#E6EBF4] text-[#0F172A]">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto max-w-[1100px] px-4 h-14 flex items-center justify-between gap-3">
          <Link to="/trials" className="text-[12px] font-semibold text-slate-500 hover:text-slate-800">
            ← All trials
          </Link>
          <div className="font-extrabold tracking-tight truncate">
            {trial.icon} {trial.short}
          </div>
          <Link
            to="/auth?mode=signup&region=eurozone&next=%2Fonboarding%2Fentrance"
            className="h-9 px-3 rounded-full text-[12px] font-bold text-[#0F172A] inline-flex items-center shrink-0"
            style={{ background: 'linear-gradient(102deg,#00E5FF,#2962FF,#76FF03)' }}
          >
            Get Started
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1100px] px-4 py-8 grid lg:grid-cols-[1.15fr_0.85fr] gap-6">
        <section>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">AiKOVA · UK pilot</p>
          <h1 className="mt-2 text-[32px] sm:text-[44px] font-extrabold tracking-tight leading-[1.05]">
            AI Receptionist for {trial.short} — Never Miss a {trial.heroMiss}
          </h1>
          <p className="mt-4 text-[15px] text-slate-600 leading-6 max-w-[60ch]">{trial.blurb}</p>

          <div className="mt-6 grid sm:grid-cols-3 gap-3">
            {trial.pain.map((p) => (
              <div key={p} className="rounded-2xl border border-rose-100 bg-white p-4 text-[13px] leading-5 text-slate-700">
                <div className="text-[11px] font-bold uppercase tracking-widest text-rose-500 mb-1">Pain</div>
                {p}
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[24px] border border-slate-200 bg-white p-5">
            <h2 className="text-[16px] font-extrabold">Sample conversation</h2>
            <div className="mt-3 space-y-2">
              {trial.transcript.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-5 ${
                    m.from === 'ai' ? 'bg-[#F1F5F9] text-slate-800' : 'ml-auto bg-[#0F172A] text-white'
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-[24px] border border-slate-200 bg-white p-5">
            <h2 className="text-[16px] font-extrabold">Features</h2>
            <ul className="mt-3 grid sm:grid-cols-2 gap-2 text-[13px] text-slate-700">
              {trial.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-emerald-600 font-bold">✓</span> {f}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[12px] text-slate-500">Languages highlight: {trial.languages}</p>
          </div>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-20 self-start">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Live demo</div>
            <p className="mt-1 text-[13px] text-slate-600">Uses instant-try-call (same as /try). Enter your mobile to ring.</p>
            <div className="mt-3">
              <InstantTryCallPanel region="uk" lang="en" compact />
            </div>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Hi AiKOVA — I want a ${trial.short} pilot`)}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 h-10 w-full rounded-full border border-emerald-200 bg-emerald-50 text-emerald-900 text-[12px] font-bold inline-flex items-center justify-center"
            >
              WhatsApp enquire
            </a>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-[#0F172A] text-white p-5">
            <div className="text-[11px] font-bold uppercase tracking-widest text-white/50">Pricing</div>
            <div className="mt-1 text-[20px] font-extrabold">14-day free trial</div>
            <p className="text-[13px] text-white/70 mt-1">Then from £79/mo · live in 10 mins</p>
            <Link
              to="/eu/get-started"
              className="mt-4 h-11 w-full rounded-full text-[13px] font-bold text-[#0F172A] inline-flex items-center justify-center"
              style={{ background: 'linear-gradient(102deg,#00E5FF,#2962FF,#76FF03)' }}
            >
              Start free trial →
            </Link>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5">
            <h2 className="text-[15px] font-extrabold">Request this pilot</h2>
            <p className="mt-1 text-[12px] text-slate-500">
              CTA: DM <b>PILOT + {trial.linkedinTag}</b> on LinkedIn — or send the form.
            </p>
            <form className="mt-3 space-y-2" onSubmit={submit}>
              <input className="w-full h-10 rounded-xl border border-slate-200 px-3 text-[13px]" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
              <input className="w-full h-10 rounded-xl border border-slate-200 px-3 text-[13px]" placeholder="Work email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input className="w-full h-10 rounded-xl border border-slate-200 px-3 text-[13px]" placeholder="Mobile" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <input className="w-full h-10 rounded-xl border border-slate-200 px-3 text-[13px]" placeholder="Business name" value={business} onChange={(e) => setBusiness(e.target.value)} />
              <textarea className="w-full min-h-[72px] rounded-xl border border-slate-200 px-3 py-2 text-[13px]" placeholder="Anything we should know?" value={message} onChange={(e) => setMessage(e.target.value)} />
              {err ? <p className="text-[11px] text-rose-600">{err}</p> : null}
              {done ? <p className="text-[11px] text-emerald-700 font-semibold">{done}</p> : null}
              <button
                type="submit"
                disabled={busy}
                className="w-full h-11 rounded-full text-[13px] font-bold text-[#0F172A] disabled:opacity-50"
                style={{ background: 'linear-gradient(102deg,#00E5FF,#2962FF,#76FF03)' }}
              >
                {busy ? 'Sending…' : `Request pilot · PILOT + ${trial.linkedinTag}`}
              </button>
            </form>
          </div>
        </aside>
      </main>
    </div>
  )
}
