import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { TRIAL_CATEGORIES } from '../../lib/trials/catalog'

export default function TrialsIndexPage() {
  useEffect(() => {
    document.title = 'AI Receptionist trial templates UK | Aikova'
    const desc =
      'Five low-complexity AiKOVA trial templates: estate agents, trades, clinics, restaurants and salons. 14-day free trial, live in 10 minutes.'
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    meta.content = desc
  }, [])

  return (
    <div className="min-h-screen bg-[#E6EBF4] text-[#0F172A]">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto max-w-[1100px] px-4 h-14 flex items-center justify-between">
          <Link to="/" className="font-extrabold tracking-tight">
            AiKOVA <span className="text-slate-400 font-semibold text-[12px]">Trials</span>
          </Link>
          <Link
            to="/auth?mode=signup&region=eurozone&next=%2Fonboarding%2Fentrance"
            className="h-9 px-4 rounded-full text-[12px] font-bold text-[#0F172A] inline-flex items-center"
            style={{ background: 'linear-gradient(102deg,#00E5FF,#2962FF,#76FF03)' }}
          >
            Get Started →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1100px] px-4 py-10">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Flagship trials</p>
        <h1 className="mt-2 text-[36px] sm:text-[48px] font-extrabold tracking-tight leading-[1.05]">
          5 AI Receptionist pilots — live in 10 minutes
        </h1>
        <p className="mt-4 max-w-[62ch] text-[15px] text-slate-600 leading-6">
          Pick a category card. Each page has pain points, a sample transcript, WhatsApp/call demo via our instant-try path,
          and a LinkedIn pilot CTA. No dashboard changes — marketing + demo only.
        </p>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TRIAL_CATEGORIES.map((c) => (
            <Link
              key={c.id}
              to={`/trials/${c.slug}`}
              className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
            >
              <div className="text-[28px]">{c.icon}</div>
              <h2 className="mt-3 text-[18px] font-extrabold tracking-tight">{c.short}</h2>
              <p className="mt-2 text-[13px] text-slate-600 leading-5">{c.blurb}</p>
              <div className="mt-4 text-[12px] font-bold text-[#2962FF]">Open trial page →</div>
            </Link>
          ))}
        </div>

        <p className="mt-10 text-[12px] text-slate-500">
          Pricing on every page: 14-day free trial, then from £79/mo. DM <b>PILOT + CATEGORY</b> on LinkedIn or submit the form.
        </p>
      </main>
    </div>
  )
}
