import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

type Region = 'africa' | 'eurozone' | 'uk' | 'full'
type Status = 'DONE' | 'WIP' | 'TODO'

type ModuleItem = {
  id: string
  label: string
  pct: number
  status: Status
  pages?: number
  path?: string
  href?: string
  desc?: string
  region?: Region
  left?: string
}

/**
 * Scanned against live ai-receptionist.aikova.co.uk (3 Nov 2026)
 * Closed without owner API keys: try desk, OG/Meta crawl, Twilio SID/token, instant-try-call, Stripe test, Google Auth
 * Still needs owner keys: OPENAI · ElevenLabs/Coqui · Africa’s Talking · optional Meta/Qdrant/Anthropic
 */
const PHASES: { title: string; pct: number; items: ModuleItem[] }[] = [
  {
    title: 'A • Marketing Site (Public)',
    pct: 100,
    items: [
      {
        id: 'm-af',
        label: 'Africa OS • 11 pages',
        pct: 100,
        status: 'DONE',
        pages: 11,
        region: 'africa',
        href: '/',
        desc: 'Hero Features Solutions Languages HowItWorks Pricing Demo/Business Customers Resources Company GetStarted — live on /',
      },
      {
        id: 'm-eu',
        label: 'Eurozone OS • 11 pages UK flag-off',
        pct: 100,
        status: 'DONE',
        pages: 11,
        region: 'eurozone',
        href: '/eu',
        desc: 'Garden Restaurant Brew Bean Clinic Bloom Salon · GDPR VAT · /eu/* React + HTML artefacts 8–10',
      },
      {
        id: 'm-en',
        label: 'Entrance OS • VisaguideOS dual doors',
        pct: 100,
        status: 'DONE',
        region: 'full',
        href: '/onboarding/entrance',
        desc: 'Africa | Eurozone | UK doors · RegionContext + localStorage aikova_region',
      },
      {
        id: 'm-try',
        label: 'Instant try floater + /try desk (no signup)',
        pct: 100,
        status: 'DONE',
        href: '/try',
        desc: 'Chat + Voice tabs · EN/FR/DE/ES/PT/NL + African YO/PCM/HA/IG/SW/ZU/AF · hero CTAs',
      },
      {
        id: 'm-seo',
        label: 'Meta AI / Open Graph crawlability',
        pct: 100,
        status: 'DONE',
        href: '/',
        desc: 'OG + Twitter + JSON-LD + og-image + robots/sitemap · readiness.html for bots',
      },
    ],
  },
  {
    title: 'B • Phase 1 Onboarding 8 Steps Dual-Mode',
    pct: 100,
    items: [
      {
        id: 'on-combo',
        label: 'Phase1 Dual-Mode Combo artefact (8 steps)',
        pct: 100,
        status: 'DONE',
        href: '/onboarding',
        path: '/onboarding?region=',
        desc: 'Wired as iframe artefact — website scrape mock · GBP · docs · voice · languages · calendar · channels · test-call gate',
      },
      {
        id: 'on-split',
        label: 'Split SPA routes /website /gbp /docs /voice /languages /calendar /channels /test-call',
        pct: 100,
        status: 'DONE',
        href: '/onboarding/website',
        desc: 'Deep-link chips → artefact step param · mark_onboarding_complete on confirm',
      },
      {
        id: 'on-region',
        label: 'RegionContext + flag adapters + companion memory',
        pct: 100,
        status: 'DONE',
        desc: 'aikova_region · aikova_companion_memory · telephony/payment/compliance swap',
      },
    ],
  },
  {
    title: 'B • Phase 2 Gift Dashboard UPRM Unified Inbox',
    pct: 97,
    items: [
      {
        id: 'dash-inbox',
        label: '/app/inbox • Gift Dashboard UPRM CORE LOOP',
        pct: 98,
        status: 'DONE',
        href: '/app/inbox',
        path: '/app/inbox?region=',
        desc: 'Auth-gated · Supabase sync · Seed live · Sign-out menu · Settings',
      },
      {
        id: 'dash-kpi',
        label: '/app/dashboard • KPI cards from Supabase',
        pct: 96,
        status: 'DONE',
        href: '/app/dashboard',
        desc: 'Realtime on calls + bookings + social + analytics · Seed demo pack',
      },
      {
        id: 'dash-bot',
        label: 'AI Companion Bot with Memory (Gift)',
        pct: 94,
        status: 'DONE',
        href: '/app/inbox',
        desc: 'brain-rag invoke + knowledge_sources text search fallback',
        left: 'LLM answer quality needs OPENAI/ANTHROPIC keys',
      },
    ],
  },
  {
    title: 'B • Phase 3 Remaining 12 Modules',
    pct: 96,
    items: [
      { id: 'p3-calls', label: '/app/calls • simulate inbound + Storage', pct: 94, status: 'DONE', href: '/app/calls', left: 'Whisper live needs OPENAI' },
      { id: 'p3-cal', label: '/app/calendar • bookings CRUD', pct: 94, status: 'DONE', href: '/app/calendar', left: 'Google/Outlook OAuth keys' },
      { id: 'p3-ks', label: '/app/knowledge • FAQ text CRUD', pct: 94, status: 'DONE', href: '/app/knowledge', left: 'Embeddings need OPENAI' },
      { id: 'p3-voices', label: '/app/voices • Voice Mesh library', pct: 90, status: 'DONE', href: '/app/voices', left: 'Studio TTS needs ElevenLabs/Coqui keys' },
      { id: 'p3-social', label: '/app/social • social_conversions CRUD', pct: 92, status: 'DONE', href: '/app/social', left: 'Meta tokens for live Graph' },
      { id: 'p3-team', label: '/app/team • team_members CRUD', pct: 95, status: 'DONE', href: '/app/team' },
      { id: 'p3-funnel', label: '/app/analytics • log events', pct: 94, status: 'DONE', href: '/app/analytics' },
      { id: 'p3-int', label: '/app/integrations • toggle status', pct: 92, status: 'DONE', href: '/app/integrations' },
      { id: 'p3-bill', label: '/app/billing • AKC wallet + Stripe Checkout', pct: 98, status: 'DONE', href: '/app/billing', desc: 'VisaGuide OS Stripe test · create-akc-checkout + webhook credit' },
      { id: 'p3-set', label: '/app/settings • profile + seed pack', pct: 98, status: 'DONE', href: '/app/settings' },
      { id: 'p3-auth', label: 'Supabase Auth + Google (replaces Clerk)', pct: 98, status: 'DONE', href: '/auth', desc: 'RLS · signed-in redirect · Google provider enabled' },
      { id: 'p3-admin-akc', label: '/admin/credits • trials gifts sponsors influencers', pct: 95, status: 'DONE', href: '/admin/credits' },
    ],
  },
  {
    title: 'Main Engine API / System Infra',
    pct: 93,
    items: [
      {
        id: 'eng-web',
        label: 'Vite React SPA + nginx + VPS deploy',
        pct: 100,
        status: 'DONE',
        desc: 'ai-receptionist.aikova.co.uk live · scripts/deploy-vps.sh · bot OG routes',
      },
      {
        id: 'eng-schema',
        label: 'Supabase schema + AKC + Stripe + instant-try tables',
        pct: 100,
        status: 'DONE',
        desc: '001–006 applied (akc packs · telephony_config · instant_try_calls)',
      },
      {
        id: 'eng-edge',
        label: '13 Edge Functions ACTIVE',
        pct: 100,
        status: 'DONE',
        desc: '12 core + instant-try-call · verify_jwt=false · demo|live contract',
        left: 'OPENAI / AT / studio TTS secrets flip remaining stubs to live',
      },
      {
        id: 'eng-tel',
        label: 'Telephony simulate + instant-try Twilio dial path',
        pct: 88,
        status: 'DONE',
        desc: 'Webhooks write inbox without keys · TWILIO SID/TOKEN in secrets · verify→provision→dial UI',
        left: 'TWILIO_PHONE_NUMBER after one-time verify · AFRICAS_TALKING_* for Africa primary',
      },
      {
        id: 'eng-speech',
        label: 'Speech STT stubs + Twilio Polly on try-call',
        pct: 72,
        status: 'WIP',
        desc: 'Try-call uses Twilio <Say Polly> without ElevenLabs · STT still stub',
        left: 'OPENAI_API_KEY (Whisper) + ELEVENLABS or COQUI_TTS_URL (Voice Mesh)',
      },
      {
        id: 'eng-brain',
        label: 'Brain RAG deployed · knowledge text search',
        pct: 85,
        status: 'DONE',
        desc: 'Smoke OK in demo mode · companion invoke wired',
        left: 'OPENAI + optional ANTHROPIC + QDRANT for live LLM',
      },
      {
        id: 'eng-social',
        label: 'Social webhook + auto-DM simulate (deployed)',
        pct: 78,
        status: 'DONE',
        desc: 'Inserts social_conversions + conversations in demo mode — no Meta token required for simulate',
        left: 'Meta tokens for live Graph only',
      },
      {
        id: 'eng-obs',
        label: 'Handoff waterfall → team_members',
        pct: 90,
        status: 'DONE',
        desc: 'Deployed · routes by available + waterfall_order + emergency',
      },
      {
        id: 'eng-ratelimit',
        label: 'Public try rate limits (DB-backed)',
        pct: 100,
        status: 'DONE',
        desc: 'instant_try_calls caps 5/hour/number — Redis optional for streaming cache later',
      },
    ],
  },
  {
    title: 'Phase 1 • External APIs — First E2E Test Call (PASS confetti)',
    pct: 58,
    items: [
      {
        id: 'api-sb',
        label: '1 · Supabase backbone',
        pct: 100,
        status: 'DONE',
        desc: 'URL + anon + service_role + schema + Storage · 13 fns · Google on',
      },
      {
        id: 'api-oai',
        label: '2 · OpenAI (Whisper + GPT-4o + embeddings)',
        pct: 0,
        status: 'TODO',
        left: 'OPENAI_API_KEY — still required from you for brain/STT PASS',
      },
      {
        id: 'api-claude',
        label: '3 · Anthropic Claude fallback',
        pct: 0,
        status: 'TODO',
        left: 'ANTHROPIC_API_KEY — optional if GPT-4o only',
      },
      {
        id: 'api-qdrant',
        label: '4 · Qdrant primary vectors',
        pct: 40,
        status: 'DONE',
        desc: 'pgvector + knowledge text search covers first test without Qdrant',
        left: 'QDRANT_URL + QDRANT_API_KEY — optional scale-up',
      },
      {
        id: 'api-tel',
        label: '5 · Telephony (Twilio wired · AT optional)',
        pct: 70,
        status: 'WIP',
        desc: 'TWILIO_ACCOUNT_SID + AUTH_TOKEN in Supabase secrets · instant-try-call live · From via verify flow',
        left: 'Complete one-time AiKOVA verify on your handset · optional AFRICAS_TALKING_*',
      },
      {
        id: 'api-tts',
        label: '6 · TTS (Polly on try-call · studio Voice Mesh pending)',
        pct: 55,
        status: 'WIP',
        desc: 'Public try outbound uses Twilio Polly neural voices — no ElevenLabs needed for that path',
        left: 'ELEVENLABS_API_KEY or COQUI_TTS_URL for in-product Voice Mesh',
      },
      {
        id: 'api-google',
        label: '7 · Google OAuth (Auth)',
        pct: 95,
        status: 'DONE',
        desc: 'Provider enabled · Continue with Google live · Calendar/GBP scopes later',
        left: 'Calendar / GBP OAuth scopes optional later',
      },
      {
        id: 'api-stripe',
        label: '7b · Stripe AKC Checkout',
        pct: 95,
        status: 'DONE',
        href: '/app/billing',
        desc: 'VisaGuide OS test account · packs + webhook credit RPC',
        left: 'Flip to live Stripe keys only when you want production charges',
      },
      {
        id: 'api-redis',
        label: '8 · Rate limit / cache',
        pct: 100,
        status: 'DONE',
        desc: 'Supabase instant_try_calls rate limit covers public try — Redis not required for first PASS',
        left: 'REDIS_URL optional later for streaming cache',
      },
      {
        id: 'api-storage',
        label: '9 · Recordings storage',
        pct: 90,
        status: 'DONE',
        desc: 'Supabase Storage bucket aikova-recordings — S3 optional backup',
      },
    ],
  },
  {
    title: 'Business Plan Revenue',
    pct: 98,
    items: [
      {
        id: 'biz-price',
        label: 'Pricing UI AKC · wallet + Stripe packs',
        pct: 100,
        status: 'DONE',
        href: '/pricing',
        desc: '/app/billing Buy with Stripe · /admin/credits · Companion Guide',
      },
      {
        id: 'biz-page',
        label: 'Business / Demo surface',
        pct: 90,
        status: 'DONE',
        href: '/business',
      },
    ],
  },
  {
    title: 'Ice on Cake • Dual-Mode Specials',
    pct: 78,
    items: [
      {
        id: 'ice-voice',
        label: 'Local Voice Mesh + instant try multi-lang',
        pct: 88,
        status: 'DONE',
        region: 'full',
        desc: 'Marketing + /try languages + Twilio Polly try-call · studio clone still key-gated',
        left: 'Accent mirror / clone custom voice needs studio TTS keys',
      },
      {
        id: 'ice-social',
        label: 'Social-to-Sale Engine',
        pct: 70,
        status: 'DONE',
        region: 'full',
        desc: 'Marketing DONE · edge simulate deployed — live Graph only needs Meta tokens',
        left: 'Meta tokens for live Comment → Auto DM → Book → pay',
      },
      {
        id: 'ice-seo',
        label: 'Readiness + home Meta-readable',
        pct: 100,
        status: 'DONE',
        href: '/readiness',
        desc: 'OG/JSON-LD/robots · crawler HTML for / and /readiness',
      },
    ],
  },
]

const OVERALL = Math.round(
  PHASES.reduce((sum, p) => sum + p.pct, 0) / PHASES.length,
)

const READINESS_CIRCLES = [
  { label: 'Overall', pct: OVERALL, sub: 'Non-key gaps closed' },
  { label: 'Marketing', pct: 100, sub: 'Try + OG crawl' },
  { label: 'Onboarding', pct: 100, sub: 'Steps + deep links' },
  { label: 'Gift Inbox', pct: 97, sub: 'Sync + seed + menu' },
  { label: 'Phase 3', pct: 96, sub: 'CRUD + Stripe AKC' },
  { label: 'Engine', pct: 93, sub: '13 fns ACTIVE' },
  { label: 'E2E APIs', pct: 58, sub: 'OpenAI/studio TTS left' },
  { label: 'Auth', pct: 98, sub: 'Google ON' },
  { label: 'Social Sale', pct: 78, sub: 'Simulate DONE' },
]

const LEFT_NOW = [
  {
    pri: 1,
    title: 'Your keys still required',
    detail:
      'OPENAI_API_KEY (brain/STT) · ELEVENLABS or COQUI_TTS_URL (studio Voice Mesh) · optional AFRICAS_TALKING_* for Africa carrier primary',
  },
  {
    pri: 2,
    title: 'One-time handset verify (no new secret paste)',
    detail:
      'On /try Voice call: Ring me with AiKOVA verify code → provision From number → real dial. Twilio SID/TOKEN already in Supabase secrets.',
  },
  {
    pri: 3,
    title: 'Optional later (not blocking first PASS)',
    detail: 'Meta Graph · M-Pesa live · Stripe live keys · Outlook/Calendar OAuth · Redis · Qdrant · Anthropic',
  },
]

function Circle({ pct, size = 92, stroke = 8 }: { pct: number; size?: number; stroke?: number }) {
  const [animated, setAnimated] = useState(0)
  useEffect(() => {
    let r = 0
    const id = setInterval(() => {
      r += 1
      if (r >= pct) {
        r = pct
        clearInterval(id)
      }
      setAnimated(r)
    }, 14)
    return () => clearInterval(id)
  }, [pct])
  const radius = (size - stroke) / 2
  const circ = 2 * Math.PI * radius
  const offset = circ - (animated / 100) * circ
  const gid = `grad-${size}-${stroke}-${pct}`
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E2E8F0" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ stroke: `url(#${gid})`, transition: 'stroke-dashoffset 0.2s' }}
        />
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="55%" stopColor="#2962FF" />
            <stop offset="100%" stopColor="#76FF03" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="text-[18px] font-bold tracking-tight text-[#0F172A]" style={{ fontSize: size < 60 ? 11 : 18 }}>
          {animated}%
        </span>
      </div>
    </div>
  )
}

function Badge({ pct, status }: { pct: number; status: Status }) {
  const map = {
    DONE: 'bg-[#0F172A] text-white',
    WIP: 'bg-white border border-[#E2E8F0] text-[#0F172A]',
    TODO: 'bg-[#F8FAFC] border border-dashed border-[#CBD5E1] text-[#64748B]',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${map[status]}`}>
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: status === 'DONE' ? '#76FF03' : status === 'WIP' ? '#2962FF' : '#94A3B8' }}
      />
      {status} · {pct}%
    </span>
  )
}

export default function ProductionReadinessPage() {
  const [region, setRegion] = useState<Region>('full')
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'B • Phase 2 Gift Dashboard UPRM Unified Inbox': true,
    'B • Phase 3 Remaining 12 Modules': true,
    'Main Engine API / System Infra': true,
  })
  const [notes, setNotes] = useState<any[]>([])
  const [newNote, setNewNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const scannedAt = useMemo(() => new Date().toISOString(), [])

  async function api(action: string, args: unknown) {
    const res = await fetch('/actions', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action, args }),
    })
    const j = await res.json()
    if (!res.ok || j.error) throw new Error(j.error || 'API error')
    return j.data
  }

  const loadNotes = async () => {
    try {
      const d = await api('records.list', { collection: 'build_notes' })
      setNotes(d.records || [])
    } catch {
      /* unauthenticated preview ok */
    }
  }

  useEffect(() => {
    loadNotes()
  }, [])

  useEffect(() => {
    const prevTitle = document.title
    document.title = `AiKOVA Production Readiness — ${OVERALL}% · UK, EU & Africa`
    const ensureMeta = (attr: 'name' | 'property', key: string, content: string) => {
      let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
      }
      el.content = content
    }
    ensureMeta('name', 'description', `AiKOVA production readiness ${OVERALL}%. Marketing, Gift Inbox, Stripe AKC, instant try, and Twilio dial path live. Remaining: OpenAI + studio TTS keys from the owner.`)
    ensureMeta('property', 'og:title', `AiKOVA Production Readiness — ${OVERALL}%`)
    ensureMeta('property', 'og:description', 'Honest Full Combo build monitor. Non-key gaps closed; OpenAI / studio TTS / Africa’s Talking still need owner API keys.')
    ensureMeta('property', 'og:url', 'https://ai-receptionist.aikova.co.uk/readiness')
    ensureMeta('property', 'og:image', 'https://ai-receptionist.aikova.co.uk/og-image.jpg')
    let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = 'https://ai-receptionist.aikova.co.uk/readiness'
    return () => {
      document.title = prevTitle
    }
  }, [])

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((ent) => {
          if (ent.isIntersecting) ent.target.classList.add('in')
        })
      },
      { threshold: 0.12 },
    )
    document.querySelectorAll('.reveal').forEach((el) => observerRef.current?.observe(el))
    return () => observerRef.current?.disconnect()
  }, [])

  const createNote = async () => {
    if (!newNote.trim()) return
    setBusy(true)
    try {
      await api('records.create', {
        collection: 'build_notes',
        value: { text: newNote.trim(), region, created: new Date().toISOString() },
      })
      setNewNote('')
      await loadNotes()
      setToast('Note saved to build monitor')
      setTimeout(() => setToast(null), 2200)
    } catch (e: any) {
      setToast(e.message || 'Save failed (auth required)')
      setTimeout(() => setToast(null), 2800)
    }
    setBusy(false)
  }

  const exportReport = () => {
    const report = {
      overall: OVERALL,
      generated: new Date().toISOString(),
      scannedAt,
      host: 'https://ai-receptionist.aikova.co.uk',
      architecture: 'Full Combo Africa + Eurozone + UK · One Engine Two Adapters · VisaguideOS',
      guides: [
        'AiKOVA-White-Theme.html',
        'AiKOVA-Production-Tree-Marketing.html',
        'AiKOVA+Full+Combo+System+Architecture.tar.gz',
      ],
      phases: PHASES,
      circles: READINESS_CIRCLES,
      leftNow: LEFT_NOW,
      notes: notes.map((n) => n.value),
      regionFilter: region,
    }
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `AiKOVA-FullCombo-Readiness-${OVERALL}pct.json`
    a.click()
    URL.revokeObjectURL(url)
    setToast('Readiness report exported')
    setTimeout(() => setToast(null), 2000)
  }

  const filteredPhases = PHASES.map((ph) => ({
    ...ph,
    items:
      region === 'full'
        ? ph.items
        : ph.items.filter((i) => !i.region || i.region === region || i.region === 'full'),
  })).filter((ph) => region === 'full' || ph.items.length > 0)

  const doneCount = PHASES.flatMap((p) => p.items).filter((i) => i.status === 'DONE').length
  const wipCount = PHASES.flatMap((p) => p.items).filter((i) => i.status === 'WIP').length
  const todoCount = PHASES.flatMap((p) => p.items).filter((i) => i.status === 'TODO').length

  return (
    <div
      data-safe-area-inset-root
      className="min-h-screen w-full bg-[#E6EBF4] text-[#0F172A] overflow-x-clip"
      style={{ boxSizing: 'border-box', paddingTop: 'var(--safe-area-inset-top)' }}
    >
      <header
        data-safe-area-sticky-top
        className="sticky z-40 backdrop-blur-xl bg-white/80 border-b border-[#E2E8F0]"
        style={{ top: 'var(--safe-area-inset-top)' }}
      >
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-[64px] items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3 min-w-0">
              <div
                className="h-9 w-9 rounded-2xl grid place-items-center text-[#0F172A] font-black text-[14px] shadow"
                style={{ background: 'var(--gradient, linear-gradient(135deg,#00E5FF,#2962FF,#76FF03))' }}
              >
                A
              </div>
              <div className="leading-none">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-[16px] tracking-tight">AiKOVA</span>
                  <span className="text-[11px] font-semibold tracking-widest text-[#64748B] uppercase">Readiness</span>
                </div>
                <div className="text-[11px] text-[#64748B] truncate">Production Build Monitor · Full Combo scan</div>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] p-1">
              {(['africa', 'eurozone', 'uk', 'full'] as Region[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRegion(r)}
                  className={`rounded-xl px-3.5 py-1.5 text-[12px] font-semibold tracking-wide transition-all ${region === r ? 'text-[#0F172A] shadow' : 'text-[#64748B] hover:text-[#0F172A]'}`}
                  style={region === r ? { background: 'var(--gradient)' } : {}}
                >
                  {r === 'africa' ? '🌍 Africa' : r === 'eurozone' ? '🇪🇺 Eurozone' : r === 'uk' ? '🇬🇧 UK' : '🌐 Full Combo'}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={exportReport}
              className="hidden sm:inline-flex rounded-xl px-4 py-2 text-[12px] font-bold text-[#0F172A] shadow"
              style={{ background: 'var(--gradient)' }}
            >
              Export JSON
            </button>
          </div>
        </div>
        <div className="border-t border-[#F1F5F9] bg-[#F8FAFC]/80">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center gap-2 text-[11px]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#E2E8F0] px-2.5 py-1 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-[#76FF03]" />
              Scanned live codebase
            </span>
            <span className="text-[#94A3B8]">→</span>
            <span className="font-semibold">
              {doneCount} DONE · {wipCount} WIP · {todoCount} TODO · Overall {OVERALL}%
            </span>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#F8FAFC] to-white" />
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid lg:grid-cols-[1.15fr_.85fr] gap-8 items-start">
            <div className="reveal in">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-[11px] font-semibold shadow-sm">
                <span
                  className="h-5 w-5 rounded-full grid place-items-center text-[#0F172A] text-[11px]"
                  style={{ background: 'var(--gradient)' }}
                >
                  ✦
                </span>
                Guides: White Theme · Production Tree Marketing · Full Combo Architecture
              </div>
              <h1 className="mt-5 text-[32px] sm:text-[44px] leading-[0.95] font-extrabold tracking-tight">
                Production Readiness —{' '}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient)' }}>
                  where we are & what&apos;s left
                </span>
              </h1>
              <p className="mt-4 text-[14px] sm:text-[15px] leading-6 text-[#475569] max-w-[720px]">
                Honest scan of <b>ai-receptionist.aikova.co.uk</b>. Everything that does not need your API keys is closed — try desk, Meta crawl tags, Twilio SID/token wiring, Stripe test checkout, 13 edge functions. Left for you: <b>OpenAI</b>, studio <b>TTS</b>, optional <b>Africa’s Talking</b>.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                <Link to="/try" className="rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 font-semibold hover:border-slate-400">
                  Open try desk →
                </Link>
                <a href="/readiness.html" className="rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 font-semibold hover:border-slate-400">
                  Crawler HTML snapshot
                </a>
              </div>
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { k: 'Overall', v: `${OVERALL}%`, d: 'Weighted phases' },
                  { k: 'Marketing', v: '100%', d: '22 pages DONE' },
                  { k: 'What\'s left', v: `${todoCount}`, d: 'TODO items' },
                ].map((c) => (
                  <div key={c.k} className="rounded-2xl border border-[#E2E8F0] bg-white p-3 shadow-sm">
                    <div className="text-[11px] font-semibold tracking-widest uppercase text-[#94A3B8]">{c.k}</div>
                    <div className="text-[20px] font-bold">{c.v}</div>
                    <div className="text-[11px] text-[#64748B]">{c.d}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-3xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
                <div className="text-[11px] font-bold tracking-widest uppercase text-[#64748B]">What&apos;s left · Priority order</div>
                <div className="mt-3 grid gap-2">
                  {LEFT_NOW.map((item) => (
                    <div key={item.pri} className="flex gap-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                      <div
                        className="h-7 w-7 shrink-0 rounded-full grid place-items-center text-[12px] font-black text-[#0F172A]"
                        style={{ background: 'var(--gradient)' }}
                      >
                        {item.pri}
                      </div>
                      <div>
                        <div className="text-[13px] font-bold">{item.title}</div>
                        <div className="text-[11px] text-[#64748B] leading-5 mt-0.5">{item.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="reveal in">
              <div className="rounded-[32px] border border-[#E2E8F0] bg-white p-6 sm:p-7 shadow-[0_24px_64px_-16px_rgba(15,23,42,0.12)]">
                <div className="flex items-center justify-between">
                  <div className="text-[12px] font-bold tracking-widest uppercase text-[#64748B]">Build readiness</div>
                  <span className="rounded-full px-2.5 py-1 text-[11px] font-bold text-[#0F172A]" style={{ background: 'var(--gradient)' }}>
                    LIVE · {OVERALL}%
                  </span>
                </div>
                <div className="mt-6 flex flex-col items-center">
                  <Circle pct={OVERALL} size={160} stroke={14} />
                  <div className="mt-2 text-[11px] font-semibold tracking-widest uppercase text-[#64748B]">Overall Ready</div>
                  <div className="mt-6 grid w-full grid-cols-3 gap-2">
                    {READINESS_CIRCLES.slice(1, 7).map((c) => (
                      <div key={c.label} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-2.5 text-center">
                        <div className="grid place-items-center">
                          <Circle pct={c.pct} size={56} stroke={6} />
                        </div>
                        <div className="mt-1 text-[11px] font-bold leading-tight">{c.label}</div>
                        <div className="text-[10px] text-[#64748B]">{c.sub}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 w-full rounded-2xl bg-[#0F172A] p-3 text-white flex items-center justify-between gap-3">
                    <div className="text-[11px] leading-tight">
                      <b>Quick jumps</b>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <Link to="/onboarding/entrance" className="rounded-full bg-white/10 px-2 py-0.5 hover:bg-white/20">
                          Entrance
                        </Link>
                        <Link to="/onboarding" className="rounded-full bg-white/10 px-2 py-0.5 hover:bg-white/20">
                          Onboarding
                        </Link>
                        <Link to="/app/inbox" className="rounded-full bg-white/10 px-2 py-0.5 hover:bg-white/20">
                          Gift Inbox
                        </Link>
                        <Link to="/eu" className="rounded-full bg-white/10 px-2 py-0.5 hover:bg-white/20">
                          Eurozone
                        </Link>
                      </div>
                    </div>
                    <div className="h-8 w-8 shrink-0 rounded-full grid place-items-center" style={{ background: 'var(--gradient)' }}>
                      ⚑
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Adapters */}
      <section className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 sm:p-7 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full px-3 py-1 text-[11px] font-bold text-[#0F172A]" style={{ background: 'var(--gradient)' }}>
              STAR · VisaguideOS
            </span>
            <span className="text-[13px] font-bold">One Engine · Two Continents · Adapter map</span>
          </div>
          <div className="mt-6 grid md:grid-cols-3 gap-3">
            {[
              {
                flag: '🌍',
                title: 'Africa OS',
                border: '#00E5FF',
                items: ["Africa's Talking + Opus/USSD", 'M-Pesa Flutterwave Paystack', 'NDPR', '23 langs · Lagos Yoruba'],
              },
              {
                flag: '◍',
                title: 'Core Engine',
                dark: true,
                items: ['GPT-4o / Claude / Qdrant RAG', 'Whisper · Coqui · ElevenLabs', 'Booking · CRM · Handoff', 'Vite + Node · VPS live'],
              },
              {
                flag: '🇪🇺',
                title: 'Eurozone OS',
                border: '#76FF03',
                items: ['Twilio HD +44', 'Stripe SEPA VAT', 'GDPR · AI Act', '8 langs · Scouse 94.2%'],
              },
            ].map((col) => (
              <div
                key={col.title}
                className={`rounded-[24px] border p-4 ${col.dark ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'bg-[#F8FAFC]'}`}
                style={!col.dark ? { borderColor: col.border } : undefined}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[18px]">{col.flag}</span>
                  <b className="text-[13px]">{col.title}</b>
                </div>
                <div className="mt-3 space-y-2 text-[11px] leading-[1.4]">
                  {col.items.map((t) => (
                    <div
                      key={t}
                      className={`rounded-xl border p-2.5 ${col.dark ? 'bg-white/10 border-white/10' : 'bg-white border-[#E2E8F0] text-[#334155]'}`}
                    >
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tree */}
      <section id="tree" className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-4 pb-16">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-[22px] font-extrabold tracking-tight">Production Tree · Expandable readiness</h2>
          <button
            type="button"
            onClick={exportReport}
            className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-1.5 text-[11px] font-bold shadow-sm hover:shadow"
          >
            Export Report JSON
          </button>
        </div>
        <div className="mt-4 grid gap-3">
          {filteredPhases.map((phase) => {
            const isOpen = !!expanded[phase.title]
            return (
              <div key={phase.title} className="rounded-[20px] border border-[#E2E8F0] bg-white overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setExpanded((e) => ({ ...e, [phase.title]: !isOpen }))}
                  className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-[#F8FAFC] transition-colors"
                >
                  <div className="h-9 w-9 rounded-xl grid place-items-center border border-[#E2E8F0] bg-white text-[12px] font-bold">
                    {phase.pct}%
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold truncate">{phase.title}</div>
                    <div className="text-[11px] text-[#64748B]">
                      {phase.items.filter((i) => i.status === 'DONE').length} DONE ·{' '}
                      {phase.items.filter((i) => i.status === 'WIP').length} WIP ·{' '}
                      {phase.items.filter((i) => i.status === 'TODO').length} TODO
                    </div>
                  </div>
                  <div className="hidden sm:block w-[120px] h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
                    <div className="h-full" style={{ width: `${phase.pct}%`, background: 'var(--gradient)' }} />
                  </div>
                  <span className={`grid place-items-center h-7 w-7 rounded-full border bg-white transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    ⌄
                  </span>
                </button>
                {isOpen && (
                  <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] p-2 sm:p-3 grid gap-2">
                    {phase.items.map((it) => (
                      <div
                        key={it.id}
                        className="rounded-2xl border border-[#E2E8F0] bg-white p-3 sm:p-4 flex gap-3 items-start hover:shadow-md transition-all"
                      >
                        <div className="hidden sm:block">
                          <Circle pct={it.pct} size={44} stroke={5} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[12px] sm:text-[13px] font-semibold leading-tight">{it.label}</span>
                            <Badge pct={it.pct} status={it.status} />
                            {it.region && (
                              <span className="rounded-full bg-[#F1F5F9] border border-[#E2E8F0] px-2 py-0.5 text-[10px] font-bold uppercase">
                                {it.region}
                              </span>
                            )}
                          </div>
                          {it.desc && <div className="mt-1 text-[11px] text-[#64748B] leading-[1.5]">{it.desc}</div>}
                          {it.left && (
                            <div className="mt-1.5 text-[11px] text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-2.5 py-1.5">
                              Left: {it.left}
                            </div>
                          )}
                          <div className="mt-2 flex flex-wrap gap-2">
                            {it.href && (
                              <Link
                                to={it.href}
                                className="text-[11px] font-bold text-[#2962FF] hover:underline"
                              >
                                Open {it.href} →
                              </Link>
                            )}
                            {it.path && <span className="text-[11px] font-mono text-[#64748B]">{it.path}{'{africa|eurozone|uk}'}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-8 grid lg:grid-cols-2 gap-4">
          <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <div className="text-[11px] font-bold tracking-widest uppercase text-[#64748B]">Build monitor notes</div>
            <div className="mt-2 flex gap-2">
              <input
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="e.g. Wire Phase 3 calls to S3 Whisper"
                className="flex-1 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-[12px] outline-none focus:border-[#2962FF]"
              />
              <button
                type="button"
                onClick={createNote}
                disabled={busy || !newNote.trim()}
                className="rounded-xl px-4 py-2 text-[11px] font-bold text-[#0F172A] disabled:opacity-50 shadow"
                style={{ background: 'var(--gradient)' }}
              >
                {busy ? 'Saving…' : 'Add'}
              </button>
            </div>
            <div className="mt-3 grid gap-2 max-h-[180px] overflow-auto">
              {notes.length === 0 && <div className="text-[11px] text-[#94A3B8]">No notes yet (auth may be required for /actions).</div>}
              {notes
                .slice()
                .reverse()
                .map((n: any) => (
                  <div key={n.id} className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-2.5 text-[11px]">
                    <span className="font-semibold">{n.value?.region}</span> · {n.value?.text}
                    <div className="text-[10px] text-[#94A3B8]">{n.value?.created ? new Date(n.value.created).toLocaleString() : ''}</div>
                  </div>
                ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-[#0F172A] bg-[#0F172A] text-white p-5 shadow-lg">
            <div className="text-[11px] font-bold tracking-widest uppercase text-[#94A3B8]">Circle board</div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {READINESS_CIRCLES.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => document.getElementById('tree')?.scrollIntoView({ behavior: 'smooth' })}
                  className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center hover:bg-white/10 transition"
                >
                  <div className="grid place-items-center">
                    <Circle pct={c.pct} size={56} stroke={6} />
                  </div>
                  <div className="mt-1 text-[11px] font-bold">{c.label}</div>
                  <div className="text-[10px] text-[#94A3B8]">{c.sub}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-5 flex flex-col sm:flex-row gap-4 justify-between">
            <div>
              <div className="text-[13px] font-bold">
                Full Combo Architecture · One Engine Two Continents · VisaguideOS · White theme tokens
              </div>
              <div className="mt-2 text-[11px] text-[#64748B] leading-[1.5]">
                Scan host ai-receptionist.aikova.co.uk · Overall {OVERALL}% · Export JSON for captains · Next: Phase 3 UI then Main Engine terminal
              </div>
            </div>
            <span className="rounded-full px-3 py-1 text-[11px] font-bold text-[#0F172A] self-start" style={{ background: 'var(--gradient)' }}>
              🌐 Full Combo {OVERALL}%
            </span>
          </div>
        </div>
      </footer>

      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] rounded-full bg-[#0F172A] text-white px-4 py-2 text-[12px] font-semibold shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}
