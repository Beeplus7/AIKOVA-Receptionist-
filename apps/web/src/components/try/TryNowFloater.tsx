import { Link, useLocation } from 'react-router-dom'

function shouldShow(pathname: string) {
  if (pathname.startsWith('/app') || pathname.startsWith('/auth') || pathname.startsWith('/admin')) return false
  if (pathname.startsWith('/onboarding') || pathname.startsWith('/try')) return false
  if (pathname.startsWith('/readiness') || pathname.startsWith('/trials')) return false
  return true
}

/** Persistent Try now control — desktop/tablet only; mobile uses in-page CTAs. */
export default function TryNowFloater() {
  const { pathname } = useLocation()
  if (!shouldShow(pathname)) return null

  return (
    <Link
      to="/trials"
      className="fixed z-[55] left-4 bottom-[88px] sm:left-6 sm:bottom-[76px] hidden md:inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-[#0F172A] pl-2 pr-4 py-2 text-white shadow-[0_16px_40px_rgba(15,23,42,0.28)] hover:translate-y-[-1px] transition"
      style={{ animation: 'pulseGlow 2.8s ease-in-out infinite' }}
      aria-label="Try AiKOVA trial templates"
    >
      <span
        className="h-9 w-9 rounded-full grid place-items-center text-[13px] font-black text-[#0F172A]"
        style={{ background: 'linear-gradient(102deg,#00E5FF,#2962FF,#76FF03)' }}
      >
        ▶
      </span>
      <span className="text-left leading-tight">
        <span className="block text-[12px] font-bold">Try now</span>
        <span className="block text-[10px] text-white/60">Trial templates</span>
      </span>
    </Link>
  )
}
