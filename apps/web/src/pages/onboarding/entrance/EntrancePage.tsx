import { Link, useNavigate } from 'react-router-dom'
import { RegionProvider, useRegion, type RegionKey } from '../../../context/RegionContext'

const DOORS: {
  key: RegionKey
  flag: string
  title: string
  subtitle: string
  adapters: string[]
  href: string
}[] = [
  {
    key: 'africa',
    flag: '🌍',
    title: 'Africa',
    subtitle: "Africa's Talking · M-Pesa · NDPR · 54 countries",
    adapters: ['Lagos Yoruba', 'WhatsApp QR', 'Opus low-data'],
    href: '/onboarding?region=africa',
  },
  {
    key: 'eurozone',
    flag: '🇪🇺',
    title: 'Eurozone',
    subtitle: 'Twilio · Stripe SEPA · GDPR AI Act · VAT · 27 states',
    adapters: ['Scouse Liverpool', 'WhatsApp QR', 'HD Voice'],
    href: '/onboarding?region=eurozone',
  },
  {
    key: 'uk',
    flag: '🇬🇧',
    title: 'UK',
    subtitle: 'UK flag-off → Berlin → Paris · Twilio +44 · Stripe UK',
    adapters: ['London RP', 'UK GDPR', 'Gateway to EU'],
    href: '/onboarding?region=uk',
  },
]

function EntranceInner() {
  const navigate = useNavigate()
  const { setRegion } = useRegion()

  const pick = (key: RegionKey, href: string) => {
    setRegion(key)
    navigate(href)
  }

  return (
    <div className="min-h-screen bg-[#E6EBF4] text-[#0F172A] overflow-x-clip">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-[20%] left-[5%] h-[55%] w-[55%] rounded-full blur-[120px] opacity-[0.12]"
          style={{ background: 'radial-gradient(circle,#00E5FF,#2962FF,transparent 70%)' }}
        />
        <div
          className="absolute bottom-[-10%] right-[0%] h-[50%] w-[50%] rounded-full blur-[120px] opacity-[0.1]"
          style={{ background: 'radial-gradient(circle,#76FF03,#00E5FF,transparent 70%)' }}
        />
      </div>

      <header className="relative z-10 mx-auto flex max-w-[1100px] items-center justify-between px-5 pt-8">
        <Link to="/" className="flex items-center gap-2.5 min-w-0">
          <div
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[15px] font-black text-[#0F172A]"
            style={{ background: 'linear-gradient(135deg,#00E5FF,#2962FF,#76FF03)' }}
          >
            A
          </div>
          <div className="min-w-0">
            <div className="text-[15px] font-bold tracking-tight">AiKOVA</div>
            <div className="truncate text-[10px] font-semibold text-slate-500">
              VisaguideOS Entrance · One Engine Two Continents
            </div>
          </div>
        </Link>
        <div className="shrink-0 text-right">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Step 2 of 4</div>
          <div className="text-[11px] font-semibold text-slate-600">Auth ✓ · Entrance · Onboarding · Inbox</div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-[1100px] px-5 pb-20 pt-14">
        <div className="mx-auto max-w-[720px] text-center">
          <div className="inline-flex items-center gap-2 rounded-xl border border-slate-300/70 bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-600 shadow-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#76FF03]" />
            Phase 1 Dual-Mode · Auto-detect IP + browser + GBP
          </div>
          <h1 className="mt-5 text-[40px] font-extrabold leading-[0.95] tracking-[-0.04em] sm:text-[56px]">
            Choose your door.
            <span
              className="block bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(102deg,#00E5FF,#2962FF,#76FF03)' }}
            >
              Same engine. Two adapters.
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-[540px] text-[15px] leading-6 text-slate-600">
            You’re signed in. Pick Africa, Eurozone, or UK — then complete onboarding (8 steps) → confirmation → Gift Dashboard welcome.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {DOORS.map((door, i) => (
            <button
              key={door.key}
              type="button"
              onClick={() => pick(door.key, door.href)}
              className="group overflow-visible rounded-2xl border border-slate-300/80 bg-white p-6 text-left shadow-[0_8px_28px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(41,98,255,0.12)]"
              style={{ animation: `dropIn 0.55s cubic-bezier(0.16,1,0.3,1) ${i * 80}ms both` }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[40px] leading-none">{door.flag}</span>
                <span className="rounded-lg bg-[#0F172A] px-2.5 py-1 text-[10px] font-bold text-white opacity-0 transition group-hover:opacity-100">
                  Enter →
                </span>
              </div>
              <h2 className="mt-4 text-[24px] font-extrabold tracking-tight">{door.title}</h2>
              <p className="mt-2 text-[13px] leading-5 text-slate-600">{door.subtitle}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {door.adapters.map((a) => (
                  <span
                    key={a}
                    className="rounded-lg border border-slate-200 bg-[#F1F5F9] px-2.5 py-1 text-[10px] font-semibold text-slate-600"
                  >
                    {a}
                  </span>
                ))}
              </div>
              <div
                className="mt-6 flex h-11 items-center justify-center rounded-xl text-[13px] font-bold text-[#0F172A]"
                style={{ background: 'linear-gradient(102deg,#00E5FF,#2962FF,#76FF03)' }}
              >
                Start onboarding
              </div>
            </button>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-[12px] font-semibold text-slate-500">
          <Link
            to="/onboarding"
            className="rounded-xl border border-slate-300/80 bg-white px-4 py-2.5 shadow-sm hover:bg-slate-50"
          >
            Skip to 8-step flow
          </Link>
          <Link
            to="/app/inbox"
            className="rounded-xl bg-[#0F172A] px-4 py-2.5 text-white shadow-sm hover:opacity-90"
          >
            Open Gift Dashboard UPRM
          </Link>
        </div>
      </main>
    </div>
  )
}

export default function EntrancePage() {
  return (
    <RegionProvider>
      <EntranceInner />
    </RegionProvider>
  )
}
