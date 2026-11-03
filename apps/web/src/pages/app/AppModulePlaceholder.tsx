import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom'

const LABELS: Record<string, string> = {
  dashboard: 'Dashboard KPIs',
  calls: 'Call Logs',
  calendar: 'Calendar',
  knowledge: 'Knowledge Base',
  voices: 'Voice Mesh',
  social: 'Social-to-Sale',
  team: 'Team',
  analytics: 'Analytics',
  integrations: 'Integrations',
  billing: 'Billing',
  settings: 'Settings',
}

export default function AppModulePlaceholder() {
  const { moduleId } = useParams()
  const location = useLocation()
  const [params] = useSearchParams()
  const region = params.get('region') || 'africa'
  const id =
    moduleId ||
    location.pathname.replace(/^\/app\/?/, '').split('/')[0] ||
    'dashboard'
  const label = LABELS[id] || id

  return (
    <div className="min-h-screen grid place-items-center bg-[#F8FAFC] px-6 text-center">
      <div className="max-w-md rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
        <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Phase 3 · Coming next</div>
        <h1 className="mt-3 text-[28px] font-extrabold tracking-tight text-[#0F172A]">{label}</h1>
        <p className="mt-3 text-[14px] leading-6 text-slate-600">
          Gift Dashboard UPRM core loop is live. This module ships after Phase 2 inbox.
          Region adapter: <span className="font-semibold">{region}</span>.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link
            to={`/app/inbox?region=${region}`}
            className="rounded-full px-5 py-2.5 text-[13px] font-bold text-[#0F172A]"
            style={{ background: 'linear-gradient(102deg,#00E5FF,#2962FF,#76FF03)' }}
          >
            Back to Inbox
          </Link>
          <Link
            to="/onboarding/entrance"
            className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-[13px] font-bold text-slate-700"
          >
            Onboarding
          </Link>
        </div>
      </div>
    </div>
  )
}
