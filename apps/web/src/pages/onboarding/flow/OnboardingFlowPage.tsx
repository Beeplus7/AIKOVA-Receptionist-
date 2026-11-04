import { useEffect, useMemo } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import ArtefactFrame from '../../../components/ArtefactFrame'
import { SETUP } from '../../../lib/setupFlow'

const STEP_SLUGS = [
  'website',
  'gbp',
  'docs',
  'voice',
  'languages',
  'calendar',
  'channels',
  'test-call',
] as const

export default function OnboardingFlowPage() {
  const [params] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const region = params.get('region') || 'eurozone'

  const step = useMemo(() => {
    const parts = location.pathname.replace(/\/+$/, '').split('/')
    const last = parts[parts.length - 1]
    if (last && (STEP_SLUGS as readonly string[]).includes(last)) return last
    return params.get('step') || null
  }, [location.pathname, params])

  const src = useMemo(() => {
    const base = '/artefacts/onboarding/phase1-dual-mode.html'
    const q = new URLSearchParams()
    q.set('region', region === 'africa' || region === 'eurozone' || region === 'uk' ? region : 'eurozone')
    if (step) q.set('step', step)
    // Bust iframe HTML cache after artefact UX updates (Step 3 bot scrape, etc.)
    q.set('v', '20261104-kb-scrape')
    return `${base}?${q.toString()}`
  }, [region, step])

  const completeHref = `${SETUP.complete}?region=${encodeURIComponent(region)}`
  const inboxHref = SETUP.inbox

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data = event.data
      if (!data || typeof data !== 'object') return
      if (data.type === 'aikova:onboarding-finish' || data.type === 'aikova:gift-dashboard') {
        navigate(data.type === 'aikova:gift-dashboard' ? inboxHref : completeHref)
      }
      if (data.type === 'aikova:onboarding-step' && typeof data.step === 'string') {
        navigate(`/onboarding/${data.step}?region=${encodeURIComponent(region)}`)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [navigate, completeHref, inboxHref, region])

  return (
    <div className="relative min-h-screen bg-[#E6EBF4]">
      <ArtefactFrame
        title="AiKOVA Onboarding — Phase 1 Dual-Mode"
        src={src}
        className="eu-artefact--onboarding"
      />

      <div className="pointer-events-none fixed inset-x-0 top-3 z-[75] flex justify-center px-3">
        <div className="pointer-events-auto max-w-[920px] w-full flex flex-wrap gap-1.5 justify-center">
          {STEP_SLUGS.map((s) => (
            <Link
              key={s}
              to={`/onboarding/${s}?region=${encodeURIComponent(region)}`}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold border shadow-sm ${
                step === s
                  ? 'bg-[#0F172A] text-white border-[#0F172A]'
                  : 'bg-white/95 text-slate-600 border-slate-200'
              }`}
            >
              {s}
            </Link>
          ))}
        </div>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[80] flex justify-center p-3 sm:p-4">
        <div className="pointer-events-auto w-full max-w-[720px] rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-xl shadow-[0_16px_40px_rgba(15,23,42,0.18)] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              Onboarding{step ? ` · ${step}` : ''}
            </div>
            <div className="text-[13px] font-semibold text-slate-800 truncate">
              Finish the 8 steps, then confirm → Gift Dashboard
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to={SETUP.entrance}
              className="h-10 px-3 rounded-full border border-slate-200 text-[12px] font-semibold text-slate-600 inline-flex items-center"
            >
              Entrance
            </Link>
            <Link
              to={completeHref}
              className="h-10 px-4 rounded-full text-[12px] font-bold text-[#0F172A] inline-flex items-center shadow"
              style={{ background: 'linear-gradient(102deg,#00E5FF,#2962FF,#76FF03)' }}
            >
              Confirm & welcome →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
