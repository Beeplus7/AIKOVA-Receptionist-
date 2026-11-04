// AiKOVA Explanatory Companion Guide — floater + page-flip popout (wired into marketing)
import { useEffect, useRef, useState, useCallback, type CSSProperties, type ReactNode } from "react";

const GRADIENT = "linear-gradient(90deg, #00E5FF 0%, #2962FF 52%, #76FF03 100%)";
const GRADIENT2 = "linear-gradient(135deg, #00E5FF 0%, #2962FF 60%, #76FF03 100%)";

type PageMeta = { title: string; short: string };

const PAGE_META: PageMeta[] = [
  { title: "Cover", short: "Cover" },
  { title: "One Engine Two Continents", short: "Engine" },
  { title: "7 Layers Ferrari Engine", short: "Layers" },
  { title: "Setup 5 Mins 8 Steps", short: "Setup" },
  { title: "Supabase Wired", short: "Supabase" },
  { title: "Gift Dashboard UPRM", short: "Inbox" },
  { title: "Social-to-Sale", short: "Social" },
  { title: "Voice Mesh", short: "Voice" },
  { title: "Pricing", short: "Pricing" },
  { title: "Technical Stack", short: "Stack" },
  { title: "Deployment", short: "Deploy" },
  { title: "FAQ", short: "FAQ" },
  { title: "Final CTA", short: "Launch" },
];

export default function CompanionGuideHost() {
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDir, setFlipDir] = useState<"next" | "prev">("next");
  const [zoom, setZoom] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const dragStartX = useRef<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const total = PAGE_META.length;

  const go = useCallback((dir: "next" | "prev", target?: number) => {
    if (isFlipping) return;
    if (target !== undefined) {
      if (target === current) return;
      const d = target > current ? "next" : "prev";
      setFlipDir(d);
      setIsFlipping(true);
      setTimeout(() => {
        setCurrent(target);
        setIsFlipping(false);
      }, 520);
      return;
    }
    if (dir === "next" && current >= total - 1) return;
    if (dir === "prev" && current <= 0) return;
    setFlipDir(dir);
    setIsFlipping(true);
    setTimeout(() => {
      setCurrent((c) => (dir === "next" ? c + 1 : c - 1));
      setIsFlipping(false);
    }, 520);
  }, [current, isFlipping, total]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go("next");
      if (e.key === "ArrowLeft") go("prev");
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, go]);

  useEffect(() => {
    const t = setTimeout(() => setShowTooltip(false), 5000);
    return () => clearTimeout(t);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const diff = e.clientX - dragStartX.current;
    if (diff < -80) go("next");
    if (diff > 80) go("prev");
    dragStartX.current = null;
  };

  const onBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setIsOpen(false);
  };

  return (
    <div className="aikova-companion-host pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-live="polite">
      {/* Secondary floater left bottom — desktop only */}
      <div className="pointer-events-auto fixed left-4 sm:left-6 bottom-6 z-40 hidden md:flex">
        <button type="button" onClick={() => setIsOpen(true)} className="h-11 px-4 rounded-full bg-white border border-[#E2E8F0] shadow-[0_8px_24px_rgba(15,23,42,0.08)] flex items-center gap-2 text-[13px] font-medium hover:shadow-lg transition-shadow">
          <span className="h-6 w-6 rounded-full flex items-center justify-center text-white text-[12px]" style={{ background: GRADIENT }}>⚡</span>
          Setup in 5 mins — How?
          <span className="ml-1 h-5 w-5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[10px]">→</span>
        </button>
      </div>

      {/* Main Floater — hide on mobile so it never covers hero / CTA taps */}
      <div className="pointer-events-auto fixed bottom-6 right-6 z-50 hidden md:flex flex-col items-end gap-3">
        <div className={`transition-all duration-300 ${showTooltip ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"} rounded-[16px] bg-white border border-[#E2E8F0] shadow-[0_16px_40px_rgba(15,23,42,0.12)] p-3.5 min-w-[260px] max-w-[min(280px,calc(100vw-2rem))]`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[13px] font-bold leading-tight text-[#0F172A]">Click to open Companion Guide</p>
              <p className="mt-1 text-[11px] leading-4 text-[#64748B]">Page Flip — Full System Explainer — Setup in 5 mins</p>
            </div>
            <span className="px-2 py-1 rounded-full text-[10px] font-bold text-white shrink-0" style={{ background: GRADIENT }}>NEW</span>
          </div>
        </div>

        <div className="mr-1 px-3 py-1.5 rounded-full bg-white border border-[#E2E8F0] shadow-sm text-[11px] font-bold flex items-center gap-2">
          <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: "#76FF03" }} />
          Full System Explainer
          <span className="ml-1 px-1.5 py-0.5 rounded-full text-[9px] text-white" style={{ background: GRADIENT }}>13 pages</span>
        </div>

        <div className="relative">
          <div className="absolute inset-0 rounded-full" style={{ background: GRADIENT, animation: "aikovaPingRing 2s cubic-bezier(0,0,0.2,1) infinite" }} />
          <button
            type="button"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => { setIsOpen(true); setShowTooltip(false); }}
            className="relative h-[64px] w-[64px] rounded-full flex items-center justify-center text-white shadow-[0_12px_32px_rgba(41,98,255,0.35)] hover:scale-[1.08] active:scale-[0.98] transition-transform duration-200"
            style={{ background: GRADIENT, animation: "aikovaFloatPulse 2s ease-in-out infinite" }}
            aria-label="Open AiKOVA Companion Guide"
          >
            <span className="text-[26px]" aria-hidden>📖</span>
            <span className="absolute -top-1 -right-1 h-6 min-w-[24px] px-1 rounded-full bg-[#EF4444] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow">New</span>
          </button>
        </div>
        <div className="mr-2 text-[11px] font-bold tracking-wide px-2.5 py-1 rounded-full bg-[#0F172A] text-white">Ai Guide</div>
      </div>

      {isOpen && (
        <div
          ref={modalRef}
          onClick={onBackdrop}
          className="pointer-events-auto fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-[#0F172A]/40 backdrop-blur-[10px]"
          style={{ animation: "aikovaSlideInUp 0.35s cubic-bezier(0.16,1,0.3,1)" }}
        >
          <div
            className={`relative w-full ${fullscreen ? "max-w-[96vw] h-[92vh]" : "max-w-[1100px] aspect-[16/10] max-h-[88vh]"} bg-white rounded-[24px] sm:rounded-[28px] shadow-[0_24px_80px_rgba(0,0,0,0.24)] overflow-hidden flex flex-col border border-white/60`}
            style={{ transformOrigin: "center", animation: "aikovaDropIn 0.45s cubic-bezier(0.16,1,0.3,1)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute left-0 top-0 bottom-0 w-[14px] sm:w-[18px] z-20" style={{ background: `linear-gradient(180deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)` }}>
              <div className="absolute inset-y-0 right-0 w-[6px]" style={{ background: GRADIENT, opacity: 0.9 }} />
            </div>

            <div className="relative ml-[14px] sm:ml-[18px] h-[56px] border-b border-[#E2E8F0] bg-white flex items-center justify-between px-4 sm:px-6 shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-[10px] flex items-center justify-center text-white font-bold" style={{ background: GRADIENT }}>A</div>
                <div className="leading-tight">
                  <div className="text-[12px] font-bold tracking-tight">AiKOVA Companion Guide</div>
                  <div className="text-[10px] text-[#64748B] font-medium">Page {current + 1} of {total} • {PAGE_META[current].title}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={() => setZoom(!zoom)} className="h-8 w-8 rounded-full border border-[#E2E8F0] bg-white flex items-center justify-center text-[13px] hover:bg-[#F8FAFC]" aria-label="Zoom">⤢</button>
                <button type="button" onClick={() => setFullscreen(!fullscreen)} className="h-8 w-8 rounded-full border border-[#E2E8F0] bg-white flex items-center justify-center text-[13px] hover:bg-[#F8FAFC]" aria-label="Fullscreen">⛶</button>
                <button type="button" onClick={() => setIsOpen(false)} className="h-8 w-8 rounded-full text-white flex items-center justify-center" style={{ background: GRADIENT }} aria-label="Close">✕</button>
              </div>
            </div>

            <div className="relative flex-1 ml-[14px] sm:ml-[18px] overflow-hidden bg-[#FCFDFF] aikova-perspective" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
              <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-[24px] aikova-page-shadow-left z-10" />
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-[36px] aikova-page-shadow-right z-10" />

              <div className={`h-full w-full overflow-auto aikova-paper-texture transition-transform duration-300 ${zoom ? "scale-[1.08]" : "scale-100"} ${isFlipping ? (flipDir === "next" ? "aikova-rotate-y-neg" : "aikova-rotate-y") : ""}`}>
                <div className="min-h-full p-4 sm:p-7 lg:p-8">
                  <div key={current} className="aikova-animate-slide-in">
                    {renderPage(current)}
                  </div>
                </div>
              </div>

              {isFlipping && (
                <div className="pointer-events-none absolute inset-0 z-20 flex">
                  <div className="flex-1 bg-white border-r border-[#E2E8F0]/60 shadow-[8px_0_24px_rgba(0,0,0,0.12)] origin-left" style={{ animation: flipDir === "next" ? "aikovaDoorLeft 0.52s ease-in-out forwards" : "aikovaDoorRight 0.52s ease-in-out reverse forwards", background: "linear-gradient(90deg, #FFFFFF 0%, #F8FAFC 100%)" }}>
                    <div className="h-full w-full p-6 opacity-60">
                      <div className="h-3 w-20 rounded-full mb-4" style={{ background: GRADIENT }} />
                      <div className="space-y-2">
                        <div className="h-2 w-full bg-[#E2E8F0] rounded-full" />
                        <div className="h-2 w-5/6 bg-[#E2E8F0] rounded-full" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 bg-[#F8FAFC]" />
                </div>
              )}
            </div>

            <div className="ml-[14px] sm:ml-[18px] h-[72px] border-t border-[#E2E8F0] bg-white flex items-center justify-between px-4 sm:px-6 shrink-0 gap-3">
              <button type="button" onClick={() => go("prev")} disabled={current === 0 || isFlipping} className="h-10 px-4 rounded-full border border-[#E2E8F0] bg-white text-[13px] font-medium flex items-center gap-2 disabled:opacity-40 hover:bg-[#F8FAFC] transition-colors">← Prev</button>
              <div className="flex-1 flex flex-col items-center gap-2 max-w-[520px]">
                <div className="flex items-center gap-1.5">
                  {PAGE_META.map((_, i) => (
                    <button key={i} type="button" onClick={() => go(i > current ? "next" : "prev", i)} className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-8" : "w-2"} ${i === current ? "" : i < current ? "bg-[#0F172A]" : "bg-[#E2E8F0]"}`} style={i === current ? { background: GRADIENT } : undefined} aria-label={`Go to page ${i + 1}`} />
                  ))}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#64748B] font-medium">
                  <span className="px-2.5 py-1 rounded-full bg-[#F8FAFC] border border-[#E2E8F0]">Page {current + 1} of {total}</span>
                  <span className="hidden md:inline-flex">Swipe / ← → • ESC close</span>
                </div>
              </div>
              <button type="button" onClick={() => go("next")} disabled={current === total - 1 || isFlipping} className="h-10 px-5 rounded-full text-white text-[13px] font-semibold flex items-center gap-2 shadow-[0_8px_20px_rgba(41,98,255,0.25)] disabled:opacity-40" style={{ background: GRADIENT }}>Next →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ---------- Page Renderers ----------
function renderPage(idx: number) {
  switch (idx) {
    case 0:
      return <PageCover />;
    case 1:
      return <PageOneEngine />;
    case 2:
      return <PageLayers />;
    case 3:
      return <PageSetup />;
    case 4:
      return <PageSupabase />;
    case 5:
      return <PageGiftDashboard />;
    case 6:
      return <PageSocialSale />;
    case 7:
      return <PageVoiceMesh />;
    case 8:
      return <PagePricing />;
    case 9:
      return <PageStack />;
    case 10:
      return <PageDeploy />;
    case 11:
      return <PageFAQ />;
    case 12:
      return <PageFinal />;
    default:
      return null;
  }
}

function Badge({ children, gradient }: { children: ReactNode; gradient?: boolean }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide border ${gradient ? "text-white border-transparent" : "bg-white border-[#E2E8F0] text-[#475569]"}`} style={gradient ? { background: GRADIENT } : undefined}>
      {children}
    </span>
  );
}

function PageCover() {
  return (
    <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
      <div className="space-y-5">
        <div className="inline-flex gap-2">
          <Badge gradient>MARKETING 100%</Badge>
          <Badge>ONBOARDING 92%</Badge>
          <Badge gradient>ENGINE SUPABASE 95%+</Badge>
          <Badge>OVERALL 66%→95%+</Badge>
        </div>
        <h2 className="text-[28px] sm:text-[36px] font-[800] tracking-[-0.03em] leading-[0.95] text-[#0F172A]">
          AiKOVA — Ai Receptionist — Explanatory Companion Guide — One Engine, Two Continents — Built for Africa, Ready for Eurozone
        </h2>
        <p className="text-[14px] leading-6 text-[#475569]">Full System Explained — Setup in 5 Minutes — Easy Implementation — Ferrari Body + Supabase Engine</p>
        <div className="rounded-[20px] border border-[#E2E8F0] bg-[#F8FAFC] p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: GRADIENT2 }}>V</div>
          <div>
            <div className="text-[12px] font-bold">VisaguideOS — Torch of God — Torch constancy</div>
            <div className="text-[11px] text-[#64748B]">Dual doors one torch • Entrance pattern • Flawless beauty • Meta sharpness 100%</div>
          </div>
        </div>
        <div className="flex items-center gap-3 pt-1">
          <div className="h-11 px-6 rounded-full text-white font-semibold text-[13px] flex items-center gap-2 shadow-lg" style={{ background: GRADIENT }}>
            Flip to start →
            <span className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center">↗</span>
          </div>
          <span className="text-[11px] text-[#64748B]">Drag to flip • Page curl shadows • 3D paper texture</span>
        </div>
      </div>
      <div className="relative">
        <div className="rounded-[24px] bg-white border border-[#E2E8F0] shadow-[0_16px_48px_rgba(15,23,42,0.08)] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wide">FERRARI BODY + ENGINE • SUPABASE WIRED</span>
            <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: "#76FF03" }} />
          </div>
          <div className="relative rounded-2xl bg-[#0F172A] p-4 h-[220px] overflow-hidden">
            {/* car body mock */}
            <div className="absolute left-6 top-10 right-6 h-[88px] rounded-[18px] border border-white/10 bg-gradient-to-r from-white/10 to-white/[0.02] flex items-center px-4 gap-3">
              <div className="h-10 w-14 rounded-[10px] bg-white/10" />
              <div className="flex-1 space-y-2">
                <div className="h-2 w-3/4 bg-white/20 rounded-full" />
                <div className="h-2 w-1/2 bg-white/10 rounded-full" />
              </div>
              <div className="h-8 w-8 rounded-full flex items-center justify-center text-[14px]" style={{ background: GRADIENT }}>🏎️</div>
            </div>
            {/* engine */}
            <div className="absolute left-6 bottom-8 right-6 h-[64px] rounded-[14px] border border-white/10 bg-[#111C2E] flex items-center px-4 gap-3">
              <div className="grid grid-cols-3 gap-1">
                {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-2 w-6 rounded-full" style={{ background: i % 2 === 0 ? "#00E5FF" : "#76FF03", opacity: 0.8 }} />)}
              </div>
              <div className="ml-2 text-[10px] font-mono text-white/70">SUPABASE • PG VECTOR • REALTIME • EDGE FUNCTIONS • STORAGE</div>
            </div>
            {/* pulsing cable */}
            <svg className="absolute left-1/2 top-[98px] -translate-x-1/2 w-[120px] h-[32px]" viewBox="0 0 120 32">
              <path d="M0 16 Q60 0 120 16" stroke="url(#grad)" strokeWidth="2" fill="none" strokeDasharray="8 6" style={{ animation: "cablePulse 1s linear infinite" }} />
              <defs><linearGradient id="grad" x1="0" x2="1"><stop offset="0%" stopColor="#00E5FF" /><stop offset="50%" stopColor="#2962FF" /><stop offset="100%" stopColor="#76FF03" /></linearGradient></defs>
            </svg>
            <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-white/10 text-[9px] font-bold text-white tracking-wide">FERRARI BODY BEAUTIFUL ✅</div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { l: "Marketing", v: "100%" },
              { l: "Onboarding", v: "92%" },
              { l: "Engine", v: "95%+" },
            ].map(b => (
              <div key={b.l} className="rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-2.5">
                <div className="text-[10px] font-bold text-[#64748B]">{b.l}</div>
                <div className="text-[13px] font-bold gradient-text" style={{ background: GRADIENT, WebkitBackgroundClip: "text" as any }}>{b.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PageOneEngine() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-[24px] sm:text-[30px] font-[800] tracking-tight leading-tight">One Engine, Two Continents, Zero Config — Same Brain, Two Adapters</h2>
          <p className="mt-2 max-w-[720px] text-[13px] leading-5 text-[#475569]">Same codebase powers Africa's Talking M-Pesa NDPR Lagos Yoruba Ibadan vs Lagos Kenyan vs Tanzanian Zulu Xhosa Hausa Igbo Amharic Pidgin 23 languages 54 countries 1.4B + Eurozone Twilio Vonage +44 HD Voice Stripe SEPA VAT OSS GDPR ePrivacy EU AI Act 8 languages 27 EU + UK 450M €4.2T</p>
        </div>
        <Badge gradient>FLAG SWITCH INSTANT SWAP 🌍 Africa | 🇪🇺 Eurozone | 🇬🇧 UK</Badge>
      </div>

      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-5">
        <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <div className="text-[11px] font-bold tracking-wide mb-4">CENTRAL ENGINE BRAIN + ADAPTERS</div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-3 text-center">
              <div className="text-[18px]">🇳🇬🇰🇪🇿🇦🇬🇭</div>
              <div className="mt-1 text-[11px] font-bold">AFRICA ADAPTER</div>
              <div className="mt-1 text-[10px] text-[#64748B]">Africa's Talking +234 Opus USSD M-Pesa Flutterwave</div>
            </div>
            <div className="h-12 w-12 rounded-full flex items-center justify-center text-white text-[18px] shadow-lg shrink-0" style={{ background: GRADIENT }}>🧠</div>
            <div className="flex-1 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-3 text-center">
              <div className="text-[18px]">🇬🇧🇩🇪🇫🇷🇪🇸🇮🇹🇳🇱🇵🇱🇵🇹</div>
              <div className="mt-1 text-[11px] font-bold">EUROZONE ADAPTER</div>
              <div className="mt-1 text-[10px] text-[#64748B]">Twilio Vonage +44 HD Voice G.722 Stripe SEPA VAT OSS GDPR</div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#0F172A] text-white">🌍 Africa</span>
            <span className="h-[2px] w-8 rounded-full" style={{ background: GRADIENT }} />
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white border">🇪🇺 Eurozone</span>
            <span className="h-[2px] w-8 rounded-full" style={{ background: GRADIENT }} />
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white border">🇬🇧 UK</span>
          </div>
          <div className="mt-4 rounded-2xl p-3 border" style={{ borderColor: "transparent", background: "var(--gradient-soft)" }}>
            <div className="text-[11px] font-bold">Easy impl:</div>
            <div className="text-[12px] mt-1">Pick region flag — engine auto swaps telephony payment compliance voice</div>
          </div>
        </div>

        <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-5">
          <div className="text-[11px] font-bold tracking-wide mb-3">MAP AFRICA + EUROZONE WITH CONNECTION LINES GRADIENT</div>
          <div className="relative h-[220px] rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] overflow-hidden p-4">
            <div className="absolute left-6 top-6 bottom-6 w-[44%] rounded-2xl bg-white border border-[#E2E8F0] p-3">
              <div className="text-[10px] font-bold">AFRICA 54 • 1.4B • 23 LANGS</div>
              <div className="mt-2 grid grid-cols-3 gap-1.5 text-[9px]">
                <span className="px-1.5 py-1 rounded-full bg-[#F8FAFC] border">Yoruba</span>
                <span className="px-1.5 py-1 rounded-full bg-[#F8FAFC] border">Swahili</span>
                <span className="px-1.5 py-1 rounded-full bg-[#F8FAFC] border">Zulu</span>
                <span className="px-1.5 py-1 rounded-full bg-[#F8FAFC] border">Hausa</span>
                <span className="px-1.5 py-1 rounded-full bg-[#F8FAFC] border">Pidgin</span>
                <span className="px-1.5 py-1 rounded-full bg-[#F8FAFC] border">Amharic</span>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden"><div className="h-full w-[96%] rounded-full" style={{ background: GRADIENT }} /></div>
              <div className="mt-1 text-[9px] text-[#64748B]">96.2% STT • Low-bandwidth Opus</div>
            </div>
            <div className="absolute right-6 top-6 bottom-6 w-[44%] rounded-2xl bg-white border border-[#E2E8F0] p-3">
              <div className="text-[10px] font-bold">EUROZONE 27+UK • 450M • €4.2T • 8 LANGS</div>
              <div className="mt-2 grid grid-cols-3 gap-1.5 text-[9px]">
                <span className="px-1.5 py-1 rounded-full bg-[#F8FAFC] border">EN</span>
                <span className="px-1.5 py-1 rounded-full bg-[#F8FAFC] border">DE</span>
                <span className="px-1.5 py-1 rounded-full bg-[#F8FAFC] border">FR</span>
                <span className="px-1.5 py-1 rounded-full bg-[#F8FAFC] border">ES</span>
                <span className="px-1.5 py-1 rounded-full bg-[#F8FAFC] border">IT</span>
                <span className="px-1.5 py-1 rounded-full bg-[#F8FAFC] border">NL</span>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden"><div className="h-full w-[94%] rounded-full" style={{ background: GRADIENT }} /></div>
              <div className="mt-1 text-[9px] text-[#64748B]">94.2% STT • HD Voice G.722</div>
            </div>
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 200">
              <path d="M140 80 Q200 20 260 80" stroke="url(#g1)" strokeWidth="1.5" fill="none" strokeDasharray="6 6" />
              <path d="M140 120 Q200 180 260 120" stroke="url(#g1)" strokeWidth="1.5" fill="none" strokeDasharray="6 6" />
              <defs><linearGradient id="g1" x1="0" x2="1"><stop offset="0%" stopColor="#00E5FF" /><stop offset="100%" stopColor="#76FF03" /></linearGradient></defs>
            </svg>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white border shadow flex items-center justify-center text-[12px]">🌐</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PageLayers() {
  const layers = [
    { n: 1, t: "Telephony Gateway", d: "Africa's Talking + Twilio Vonage SIP WebRTC — Africa +234 Opus low-bandwidth USSD fallback vs Eurozone +44 HD Voice G.722" },
    { n: 2, t: "Speech Stack", d: "Whisper v3 large fine-tuned 96.2% Africa 94.2% Eurozone 3-sec detection + Coqui 23 voices vs ElevenLabs 8 voices clone custom accent mirroring 3s streaming 300ms cache Redis" },
    { n: 3, t: "Brain", d: "GPT-4o Claude 3.5 Sonnet router intent Booking Question Complaint Lead sentiment entity + RAG Qdrant 815 vectors + Supabase pgvector backup + Sources website 342 about 128 services 256 contact 89 GBP hours address reviews 4.8 Docs FAQs Playbooks + Semantic search 0.85 threshold reranker citations shared memory Calls SMS WhatsApp IG FB Web Email same brain guardrails No hallucination outside KB" },
    { n: 4, t: "Business Logic", d: "Booking Google Outlook Calendly double-booking guard buffer 15min timezone Africa/Lagos vs Europe/London + Lead CRM HubSpot Salesforce Zoho Sheets + Analytics funnel revenue M-Pesa vs Stripe SEPA" },
    { n: 5, t: "Social-to-Sale Engine", d: "Ice on cake differentiator — IG Graph API FB Graph API comments DMs webhooks rate limiter Comment how much? price? book? trigger -> Auto DM within 60s price from KB 815 vectors -> Qualify -> Book slot -> Payment link M-Pesa Flutterwave Paystack vs Stripe SEPA -> Confirm -> Calendar follow-up" },
    { n: 6, t: "Team Smart Handoff", d: "Waterfall routing skill-based availability calendar escalation emergency contacts human takeover seamless context transfer full conversation Qdrant 815 vectors voice transcript intent sentiment booking payment Call transfer Africa's Talking vs Twilio SMS WhatsApp Slack Teams Gift Dashboard UPRM Unified Inbox" },
    { n: 7, t: "Observability Infra", d: "AWS af-south-1 Cape Town + eu-central-1 Frankfurt + K8s + Docker + Terraform + CI/CD + Cloudflare edge cache <100ms TTFB <100kb JS + Postgres + Redis + Qdrant + S3 aikova-recordings + Backup daily + PITR + EU Data Residency Frankfurt GDPR + Africa Cape Town NDPR + Grafana Prometheus Sentry PagerDuty + Cost tracking $0.05/min 85% margin + Security Clerk Auth JWT RBAC encryption TLS WAF rate limiter audit log" },
  ];
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[24px] sm:text-[28px] font-[800] tracking-tight">Ferrari Engine — 7 Layers — Supabase Wired — Close the Gaps</h2>
        <p className="mt-1 text-[12px] text-[#64748B]">Engine blueprint diagram with 7 layers gradient connections • One Engine powers all — no separate setup per layer</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 max-h-[420px] overflow-auto pr-1">
        {layers.map(l => (
          <div key={l.n} className="rounded-[18px] border border-[#E2E8F0] bg-white p-4 shadow-[0_4px_12px_rgba(15,23,42,0.04)] flex gap-3 gradient-border">
            <div className="h-8 w-8 rounded-full text-white font-bold flex items-center justify-center shrink-0" style={{ background: GRADIENT }}>{l.n}</div>
            <div>
              <div className="text-[13px] font-bold">{l.t}</div>
              <div className="mt-1 text-[11px] leading-4 text-[#475569]">{l.d}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl p-3 border flex items-center gap-2 text-[11px]" style={{ borderColor: "transparent", background: "var(--gradient-soft)" }}>
        <span className="h-2 w-2 rounded-full" style={{ background: GRADIENT }} /> Ferrari Engine Supabase Wired — 7 Layers visual vertical stack cards — Imagery: Engine blueprint diagram with 7 layers gradient connections
      </div>
    </div>
  );
}

function PageSetup() {
  const steps = [
    { s: 1, t: "Website — Connect Website — Scrape + Qdrant embed 815 vectors", d: "Enter website URL — AI scrapes home 342 about 128 services 256 contact 89 — auto embeds 815 vectors Qdrant + Supabase pgvector — No hallucination guardrails ON — Business memory pill Business Website 815 vectors • Easy: Paste URL -> Click Scrape -> Done 60s • Region: Africa vs Eurozone same", img: "Browser mock entering https://ekobites.ng + https://garden-restaurant.london + progress circular 0-100% 815 vectors visualization dots" },
    { s: 2, t: "GBP — Import Google Business Profile — OAuth", d: "Click Connect GBP -> OAuth -> Hours address reviews auto import • Imagery: Google Maps mock hours Mon-Sat 9-6 vs Mon-Sat 9am-10pm address photos reviews 4.8 stars" },
    { s: 3, t: "Docs — Upload Docs — PDFs FAQs — Guardrails ON", d: "Drag PDFs -> AI extracts + embeds 815 vectors • Upload zone drag drop PDFs playbooks FAQs + list files" },
    { s: 4, t: "Voice — Pick Voice — Voice Mesh Library — 96.2% vs 94.2% 3s mirroring", d: "Click voice -> Preview -> Select -> Voice clone custom upload sample • Voice library grid 23 African voices Lagos Yoruba Ibadan vs Lagos Kenyan Swahili vs Tanzanian Zulu Xhosa Hausa Igbo Amharic Pidgin SA English vs 8 Eurozone Scouse Liverpool London Yorkshire Berlin Bavarian Marseille Paris Madrid Milan Amsterdam Warsaw Lisbon — play waveform — accent mirroring animation 3s detection mirror accent" },
    { s: 5, t: "Languages — Pick Languages — Flag Switch Instant Swap", d: "Toggle flags -> Engine auto swaps STT TTS responses • Flags chips 🌍 Africa EN FR AR PT SW HA YO IG ZU XH AM Pidgin vs 🇪🇺 Eurozone EN FR DE ES IT NL PL PT — instant swap fade slide adapter bar" },
    { s: 6, t: "Calendar — Connect Calendar — OAuth double-booking guard", d: "Connect calendar -> OAuth -> Double-booking guard ON buffer 15min timezone Africa/Lagos vs Europe/London • Imagery: Google Calendar Outlook Calendly OAuth buttons + calendar mock slots" },
    { s: 7, t: "Channels — Connect Channels — WhatsApp QR IG DM FB Web Chat <script> + SMS", d: "WhatsApp Scan QR -> IG Connect OAuth -> FB Connect -> Copy <script> paste in website -> SMS toggle ON • Channel cards WhatsApp QR code mock + Instagram DM + Facebook + Web Chat <script> embed + SMS toggle Africa's Talking M-Pesa vs Twilio Stripe SEPA GDPR consent checkbox" },
    { s: 8, t: "Test Call — Gate — E2E — Africa +234 Opus vs +44 HD Voice GDPR PASS confetti -> Gift Dashboard", d: "Enter phone -> Click Test Call -> Hear AI answer with business knowledge -> PASS -> Gift Dashboard UPRM Unified Inbox • Phone input +234 Lagos Africa vs +44 London Eurozone + Call button + simulation flow Telephony Gateway -> STT Whisper -> Brain Qdrant 815 vectors -> TTS accent mirroring -> Booking -> Payment M-Pesa STK push vs Stripe SEPA -> Transcript sentiment recording S3 -> PASS badge + confetti -> Gift Dashboard" },
  ];
  return (
    <div className="space-y-4">
      <h2 className="text-[22px] sm:text-[26px] font-[800] tracking-tight">Setup in 5 Minutes — 8 Steps — Easy Implementation — Flag Switch Instant Swap</h2>
      <div className="grid gap-3 max-h-[460px] overflow-auto pr-1">
        {steps.map(st => (
          <div key={st.s} className="flex gap-3 rounded-[18px] border border-[#E2E8F0] bg-white p-3 sm:p-4">
            <div className="h-9 w-9 rounded-full text-white font-bold flex items-center justify-center shrink-0 shadow" style={{ background: GRADIENT }}>{st.s}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-bold leading-tight">{st.t}</div>
              <div className="mt-1 text-[11px] leading-4 text-[#475569]">{st.d}</div>
              {st.img && <div className="mt-2 rounded-xl bg-[#F8FAFC] border border-dashed border-[#CBD5E1] p-2 text-[10px] text-[#64748B]">Imagery: {st.img}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PageSupabase() {
  return (
    <div className="space-y-5">
      <h2 className="text-[24px] font-[800] tracking-tight">Supabase Wired — Close the Gaps — Auth + Realtime + pgvector + Storage + Edge Functions</h2>
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-4">
        <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-4">
          <div className="text-[11px] font-bold mb-3">SUPABASE TABLES DIAGRAM</div>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            {["businesses", "knowledge_sources", "conversations", "messages", "calls", "bookings", "social_conversions", "team_members", "voices", "analytics_events", "integrations", "billing_usage"].map(t => (
              <div key={t} className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-2 font-mono flex items-center justify-between">
                <span>{t}</span><span className="h-1.5 w-1.5 rounded-full" style={{ background: GRADIENT }} />
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-[#0F172A] p-3 font-mono text-[10px] text-white leading-4">
            <div>• RLS: businesses.user_id = auth.uid()</div>
            <div>• pgvector VECTOR(1536) text-embedding-3-large 815 vectors per business</div>
            <div>• Storage bucket aikova-recordings + Realtime conversations</div>
            <div>• Edge Functions: telephony-webhook-africa, eurozone, stt-whisper, tts-coqui-elevenlabs, brain-rag, knowledge-embed, booking-calendar, social-webhook-instagram, facebook, social-auto-dm, handoff-waterfall, billing-usage</div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="rounded-[20px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <div className="text-[12px] font-bold">Supabase PostgreSQL + Auth + Realtime + Storage + Edge Functions + pgvector</div>
            <p className="mt-2 text-[11px] leading-4 text-[#475569]">Supabase Wired benefits close gaps: Auth 5%→95% KPI dashboard 15%→95% Phase 3 12 modules 8%→90% Engine 32%→95% Voice Mesh 65%→95% Social Sale 35%→90% = 95%+ Overall</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                { k: "Auth", v: "5%→95%" },
                { k: "KPI", v: "15%→95%" },
                { k: "Phase 3", v: "8%→90%" },
                { k: "Engine", v: "32%→95%" },
                { k: "Voice", v: "65%→95%" },
                { k: "Social", v: "35%→90%" },
              ].map(b => (
                <div key={b.k} className="rounded-xl bg-white border border-[#E2E8F0] p-2 text-center">
                  <div className="text-[10px] text-[#64748B]">{b.k}</div>
                  <div className="text-[11px] font-bold" style={{ background: GRADIENT, WebkitBackgroundClip: "text" as any, WebkitTextFillColor: "transparent" }}>{b.v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[20px] bg-[#0F172A] p-4 text-white">
            <div className="text-[11px] font-bold">Easy impl: supabase link + db push schema + functions deploy --all + env keys</div>
            <div className="mt-2 font-mono text-[10px] leading-4 text-[#CBD5E1]">supabase link --project-ref aikova<br />supabase db push<br />supabase functions deploy --all<br />EU Data Residency Frankfurt GDPR + Africa Cape Town NDPR<br />M-Pesa vs Stripe SEPA adapters</div>
            <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden"><div className="h-full w-[95%] rounded-full" style={{ background: GRADIENT }} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PageGiftDashboard() {
  return (
    <div className="space-y-4">
      <h2 className="text-[22px] font-[800] tracking-tight">Gift Dashboard — UPRM — Unified Inbox — Core Loop — All 24 Calls 8 Messages 12 Social 18 Bookings 6</h2>
      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-4">
        <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold">UNIFIED INBOX MOCK • WHITE ROUNDED 2XL ROWS</span>
            <div className="flex gap-1">
              {["All", "Calls", "Messages", "Social", "Bookings"].map(f => (
                <span key={f} className="px-2 py-1 rounded-full text-[9px] border bg-[#F8FAFC]">{f}</span>
              ))}
            </div>
          </div>
          <div className="space-y-2 max-h-[280px] overflow-auto pr-1">
            {[
              { ch: "📞", phone: "+234 Lagos Yoruba", intent: "Booking", sent: "92% positive • 94% AI conf • Hi AiKOVA AI receptionist - I want to book appointment tomorrow..." },
              { ch: "💬", phone: "+44 London Scouse", intent: "Question", sent: "78% neutral • 89% AI conf • What are your hours? Do you deliver to Liverpool?" },
              { ch: "📷", phone: "IG DM @ekobites", intent: "Lead", sent: "88% positive • Comment how much? price? -> Auto DM within 60s" },
              { ch: "📘", phone: "FB Comment", intent: "Complaint", sent: "62% negative • Escalate -> Team handoff waterfall" },
              { ch: "🟢", phone: "WhatsApp +254", intent: "Booking", sent: "91% positive • M-Pesa STK push payment link" },
            ].map((r, i) => (
              <div key={i} className="rounded-2xl border border-[#E2E8F0] bg-white p-2.5 flex items-center gap-2 hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:border-[#CBD5E1] transition-all" style={{ animation: `aikovaDropIn 0.4s both ${i * 50}ms` } as CSSProperties}>
                <span className="h-7 w-7 rounded-full bg-[#F8FAFC] border flex items-center justify-center text-[12px]">{r.ch}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold">{r.phone}</span>
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold border" style={{ borderColor: "transparent", background: "var(--gradient-soft)" }}>{r.intent}</span>
                  </div>
                  <div className="text-[10px] text-[#64748B] truncate">{r.sent}</div>
                </div>
                <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <div className="rounded-[20px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <div className="text-[11px] font-bold">PREVIEW PANEL 360PX TABS • TRANSCRIPT SENTIMENT RECORDING PLAY</div>
            <div className="mt-3 rounded-xl bg-white border p-3">
              <div className="text-[11px] font-mono">Transcript: "Hello, I need table for 4 tomorrow 7pm near Lekki..."</div>
              <div className="mt-2 flex gap-1.5">
                <span className="px-2 py-1 rounded-full text-[9px] bg-[#F8FAFC] border">Sentiment positive 92%</span>
                <span className="px-2 py-1 rounded-full text-[9px] bg-[#F8FAFC] border">AI conf 94%</span>
                <span className="px-2 py-1 rounded-full text-[9px] text-white" style={{ background: GRADIENT }}>Play ▶ S3</span>
              </div>
            </div>
            <div className="mt-3 text-[11px] leading-4 text-[#475569]">One inbox to rule them all — Calls SMS WhatsApp IG DMs/Comments FB Web Chat Email shared memory Qdrant 815 vectors Supabase pgvector Realtime conversations messages calls bookings social_conversions — Companion Bot with Memory dual-mode region memory pills Business Website 815 vectors Telephony Payment Compliance Voice Languages Inbox 24 new suggestion chips per region per step input send gradient mic voice mobile bottom sheet + collections aikova_onboarding aikova_companion_memory aikova_region localStorage + Supabase sync</div>
          </div>
          <div className="rounded-2xl p-3 border text-[11px]" style={{ borderColor: "transparent", background: "var(--gradient-soft)" }}>
            Easy impl: After test call PASS -&gt; Gift Dashboard auto opens -&gt; See all conversations Realtime -&gt; Click row -&gt; See transcript sentiment recording -&gt; Companion Bot suggests next steps per region
          </div>
        </div>
      </div>
    </div>
  );
}

function PageSocialSale() {
  return (
    <div className="space-y-5">
      <h2 className="text-[22px] font-[800] tracking-tight">Social-to-Sale — Comment → Auto-DM → Close — MoMo/Paystack vs Stripe — Ice on Cake</h2>
      <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-4">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium">
          <span className="px-3 py-2 rounded-2xl bg-[#F8FAFC] border">IG comment "how much? price? book?" mock</span>
          <span className="h-6 w-6 rounded-full text-white flex items-center justify-center" style={{ background: GRADIENT }}>→</span>
          <span className="px-3 py-2 rounded-2xl text-white" style={{ background: GRADIENT }}>Auto DM within 60s price from KB 815 vectors</span>
          <span className="h-6 w-6 rounded-full border flex items-center justify-center">→</span>
          <span className="px-3 py-2 rounded-2xl bg-[#F8FAFC] border">Qualify intent</span>
          <span className="h-6 w-6 rounded-full border flex items-center justify-center">→</span>
          <span className="px-3 py-2 rounded-2xl bg-[#F8FAFC] border">Book slot calendar</span>
          <span className="h-6 w-6 rounded-full border flex items-center justify-center">→</span>
          <span className="px-3 py-2 rounded-2xl bg-[#0F172A] text-white">Payment M-Pesa STK vs Stripe SEPA VAT OSS</span>
          <span className="h-6 w-6 rounded-full border flex items-center justify-center">→</span>
          <span className="px-3 py-2 rounded-2xl bg-white border border-dashed">Confirm + Calendar ICS + Follow-up</span>
        </div>
        <div className="mt-4 grid lg:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-3">
            <div className="text-[11px] font-bold">LISTENERS IG GRAPH API FB GRAPH API COMMENTS DMS WEBHOOKS REAL-TIME RATE LIMITER SPAM FILTER</div>
            <div className="mt-2 space-y-1.5 text-[11px]">
              <div className="flex items-center gap-2"><span className="h-5 w-5 rounded-full bg-white border flex items-center justify-center">💬</span> Trigger detection intent Booking Question Complaint Lead</div>
              <div className="flex items-center gap-2"><span className="h-5 w-5 rounded-full bg-white border flex items-center justify-center">⚡</span> Auto DM within 60s price from KB 815 vectors — Lead scoring — Follow-up automation HubSpot Salesforce — Conversion tracking social_conversions table region Africa vs Eurozone — MoMo low-data image compressed + Pidgin response vs HD image + 8 languages</div>
            </div>
          </div>
          <div className="rounded-2xl border p-3" style={{ borderColor: "transparent", background: "var(--gradient-soft)" }}>
            <div className="text-[11px] font-bold">Easy impl</div>
            <div className="mt-1 text-[11px] leading-4">Connect Instagram OAuth -&gt; Enable auto-DM toggle -&gt; Set trigger keywords "how much? price? book?" -&gt; Set payment provider M-Pesa vs Stripe SEPA -&gt; Test comment -&gt; See DM sent -&gt; Conversion tracked</div>
            <div className="mt-3 flex gap-2">
              <span className="px-2 py-1 rounded-full bg-white border text-[10px]">MoMo low-data</span>
              <span className="px-2 py-1 rounded-full bg-white border text-[10px]">Pidgin response</span>
              <span className="px-2 py-1 rounded-full text-white text-[10px]" style={{ background: GRADIENT }}>Ice on Cake Differentiator</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PageVoiceMesh() {
  return (
    <div className="space-y-4">
      <h2 className="text-[22px] font-[800] tracking-tight">Voice Mesh — Local Voice Mesh — Hyperlocal Accent Detection — 96.2% Africa 94.2% Eurozone 3-sec Mirroring</h2>
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-4">
          <div className="text-[11px] font-bold">MAP AFRICA WITH PINS LAGOS YORUBA VS IBADAN YORUBA KENYAN SWAHILI VS TANZANIAN ZULU XHOSA HAUSA IGBO AMHARIC PIDGIN SA ENGLISH</div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
            {[
              "Lagos Yoruba vs Ibadan Yoruba",
              "Kenyan Swahili vs Tanzanian Swahili",
              "Zulu Xhosa Hausa Igbo",
              "Amharic Pidgin SA English",
              "Scouse Liverpool London Yorkshire Mancunian Scottish",
              "Berlin Bavarian Marseille Paris Madrid Milan Amsterdam Warsaw Lisbon",
            ].map(p => (
              <div key={p} className="rounded-xl bg-[#F8FAFC] border p-2 flex items-center gap-2">
                <span className="h-5 w-5 rounded-full flex items-center justify-center text-white text-[10px]" style={{ background: GRADIENT }}>📍</span>
                {p}
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-[#0F172A] p-3 flex items-center justify-between">
            <div className="text-white">
              <div className="text-[10px] opacity-60">ACCURACY BADGES</div>
              <div className="text-[12px] font-bold">96.2% Africa • 94.2% Eurozone • 3s detection animation</div>
            </div>
            <div className="h-8 w-16 rounded-full bg-white/10 flex items-center px-1"><div className="h-6 w-6 rounded-full bg-white animate-pulse" /></div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="rounded-[20px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <div className="text-[11px] font-bold">WHISPER V3 LARGE FINE-TUNED AFRICA ACCENTS 23 LANGUAGES + EUROZONE 8 LANGUAGES + 3-SEC DETECTION</div>
            <p className="mt-2 text-[11px] leading-4 text-[#475569]">Streaming + VAD + Noise cancellation + Low-bandwidth Opus 16kbps Africa vs HD 64kbps Eurozone + Language detection auto + Whisper.cpp GPU — TTS Coqui TTS Africa voices + ElevenLabs Eurozone + Voice clone custom + SSML + Emotion + Accent mirroring mirror detected accent in 3 seconds + Streaming 300ms latency + Cache Redis</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-white border p-2 text-center"><div className="text-[10px]">Coqui 23</div><div className="text-[11px] font-bold">Africa voices</div></div>
              <div className="rounded-xl bg-white border p-2 text-center"><div className="text-[10px]">ElevenLabs 8</div><div className="text-[11px] font-bold">Eurozone</div></div>
              <div className="rounded-xl text-white p-2 text-center" style={{ background: GRADIENT }}><div className="text-[10px]">3s mirror</div><div className="text-[11px] font-bold">Accent mirroring</div></div>
            </div>
          </div>
          <div className="rounded-2xl p-3 border text-[11px]" style={{ borderColor: "transparent", background: "var(--gradient-soft)" }}>
            Easy impl: Pick voice from library -&gt; Preview waveform -&gt; Enable accent mirroring toggle -&gt; Upload custom voice clone sample 10s -&gt; 3s detection auto
          </div>
        </div>
      </div>
    </div>
  );
}

function PagePricing() {
  return (
    <div className="space-y-4">
      <h2 className="text-[22px] font-[800] tracking-tight">Pricing — AiKOVA Credits (AKC) — $25 $79 $199 vs €25 €79 €199 VAT — Like VisaGuide VGC</h2>
      <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-[11px] leading-4 text-[#475569]">
        <strong className="text-[#0F172A]">AKC prepaid wallet:</strong> Anchor 10,000 AKC ≈ $25 / €25 · Welcome trial 5,000 AKC (14 days) · Rates: voice 20 AKC/min · SMS 15 · convo 50 · voice clone 5,000 · Admin allocates gifts / trials / sponsors / influencers at /admin/credits
      </div>
      <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {[
          { name: "Starter", price: "$25 / €25", feat: ["10,000 AKC / mo", "~500 voice mins", "1k convos · 1k SMS", "10GB · 3 voices · 2 langs", "2 channels · M-Pesa/Stripe"] },
          { name: "Growth", price: "$79 / €79", feat: ["35,000 AKC / mo", "~1,750 voice mins", "5k convos · 5k SMS", "50GB · 8 voices · 5 langs", "Social-to-Sale · reload packs"], popular: true },
          { name: "Scale", price: "$199 / €199", feat: ["100,000 AKC / mo", "~5,000 voice mins", "20k convos · 20k SMS", "200GB · 23 voices · 23 langs", "Team handoff · analytics"] },
          { name: "Enterprise", price: "Custom AKC pool", feat: ["Custom rates", "Sponsor / influencer pools", "EU Data Residency", "NDPR GDPR", "SSO · SLA"] },
        ].map(c => (
          <div key={c.name} className={`rounded-[20px] border bg-white p-4 flex flex-col ${c.popular ? "shadow-[0_8px_24px_rgba(41,98,255,0.15)] border-transparent ring-1" : "border-[#E2E8F0]"}`} style={c.popular ? { boxShadow: "0 0 0 1px #2962FF, 0 8px 24px rgba(41,98,255,0.15)" } : undefined}>
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold">{c.name}</span>
              {c.popular && <span className="px-2 py-1 rounded-full text-[9px] font-bold text-white" style={{ background: GRADIENT }}>POPULAR</span>}
            </div>
            <div className="mt-2 text-[18px] font-[800]">{c.price}</div>
            <div className="mt-1 text-[10px] text-[#64748B]">VAT incl · AKC wallet · M-Pesa vs Stripe SEPA</div>
            <div className="mt-3 space-y-1.5 flex-1">
              {c.feat.map(f => (
                <div key={f} className="flex items-center gap-2 text-[11px]">
                  <span className="h-4 w-4 rounded-full flex items-center justify-center text-white text-[8px]" style={{ background: GRADIENT }}>✓</span>
                  {f}
                </div>
              ))}
            </div>
            <div className="mt-4 h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden"><div className="h-full w-[70%] rounded-full" style={{ background: GRADIENT }} /></div>
            <div className="mt-1 text-[9px] text-[#64748B]">akc_wallets · akc_ledger · billing_usage</div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl p-3 border text-[11px]" style={{ borderColor: "transparent", background: "var(--gradient-soft)" }}>
        Easy impl: Choose plan → AKC allotment lands in wallet → usage debits rates → reload packs (+10k…+150k) or admin gift/trial/sponsor → Africa M-Pesa / EU Stripe SEPA · /app/billing + /admin/credits
      </div>
    </div>
  );
}

function PageStack() {
  return (
    <div className="space-y-4">
      <h2 className="text-[22px] font-[800] tracking-tight">Technical Stack — File Tree — Supabase Wired — Production Ready — &lt;100kb JS Cloudflare Edge &lt;100ms</h2>
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-4">
        <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-4 font-mono text-[11px] leading-5 overflow-auto max-h-[360px]">
          <div className="text-[11px] font-sans font-bold tracking-wide mb-2">FILE TREE DIAGRAM</div>
          <div>app/(marketing)/africa eu 11 pages DONE VisaguideOS entrance dual doors +</div>
          <div>app/(onboarding)/website?region= gbp docs voice?region= languages?region= calendar channels?region= test-call?region= +</div>
          <div>app/(dashboard)/dashboard KPI inbox calls calendar knowledge sources playbooks voices social team analytics integrations billing settings +</div>
          <div>supabase/migrations full combo schema +</div>
          <div>supabase/functions 12 edge functions +</div>
          <div>components onboarding stepper flag switch segmented control sliding gradient instant swap Qdrant embed visualization circular progress 0-100% 815 vectors voice library grid play waveform language chips channel connect checkmarks test-call gate PASS confetti +</div>
          <div>dashboard gift UPRM inbox list rows white rounded 2xl hover shadow-lg gradient border hover dropping stagger 50ms preview panel 360px +</div>
          <div>ai-companion Companion Bot memory pills suggestion chips + ui white theme tokens</div>
          <div className="mt-3 h-px bg-[#E2E8F0]" />
          <div className="mt-2">Vite React SPA + nginx + VPS deploy ai-receptionist.aikova.co.uk scripts/deploy-vps.sh +</div>
          <div>Node /actions records CRUD + Supabase PostgreSQL + Auth + Realtime + Storage aikova-recordings + Edge Functions + pgvector + Qdrant + Postgres Redis S3 Grafana Prometheus Sentry PagerDuty Cloudflare edge cache &lt;100ms TTFB &lt;100kb JS Mobile-first low-bandwidth Opus USSD fallback M-Pesa low-data + Lighthouse 95+ Core Web Vitals + Clerk Auth 14 modules JWT RBAC encryption TLS WAF rate limiter audit log</div>
        </div>
        <div className="space-y-3">
          <div className="rounded-[20px] bg-[#0F172A] p-4 text-white">
            <div className="text-[11px] font-bold">PRODUCTION READY CHECKLIST</div>
            <div className="mt-3 space-y-2 text-[11px]">
              <div className="flex items-center justify-between"><span>Cloudflare edge cache &lt;100ms TTFB</span><span className="h-4 w-4 rounded-full flex items-center justify-center" style={{ background: GRADIENT }}>✓</span></div>
              <div className="flex items-center justify-between"><span>&lt;100kb JS Mobile-first low-bandwidth</span><span className="h-4 w-4 rounded-full flex items-center justify-center" style={{ background: GRADIENT }}>✓</span></div>
              <div className="flex items-center justify-between"><span>Lighthouse 95+ Core Web Vitals</span><span className="h-4 w-4 rounded-full flex items-center justify-center" style={{ background: GRADIENT }}>✓</span></div>
              <div className="flex items-center justify-between"><span>EU Data Residency Frankfurt + af-south-1 Cape Town</span><span className="h-4 w-4 rounded-full flex items-center justify-center" style={{ background: GRADIENT }}>✓</span></div>
              <div className="flex items-center justify-between"><span>Grafana Prometheus Sentry PagerDuty</span><span className="h-4 w-4 rounded-full flex items-center justify-center" style={{ background: GRADIENT }}>✓</span></div>
            </div>
            <div className="mt-4 h-1.5 rounded-full bg-white/10 overflow-hidden"><div className="h-full w-[95%] rounded-full" style={{ background: GRADIENT }} /></div>
          </div>
          <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-[11px]">
            <div className="font-bold">Ferrari Body Beautiful ✅ DONE Wired LIVE https://ai-receptionist.aikova.co.uk/onboarding?region=eurozone</div>
            <div className="mt-1 text-[#475569]">White theme best UI magic card dropping slide-in gradient as content color production ready no print button.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PageDeploy() {
  const [copied, setCopied] = useState(false);
  const terminal = `supabase link --project-ref aikova-prod
supabase db push
supabase functions deploy --all
npm run build
./scripts/deploy-vps.sh production
# monitor + curl tests +234 vs +44
curl https://ai-receptionist.aikova.co.uk/health
# open onboarding + inbox + dashboard
open https://ai-receptionist.aikova.co.uk/onboarding?region=eurozone
open https://ai-receptionist.aikova.co.uk/dashboard`;

  const copy = () => {
    void navigator.clipboard?.writeText(terminal).catch(() => {
      const ta = document.createElement("textarea");
      ta.value = terminal;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-[22px] font-[800] tracking-tight">Deployment — Terminal Agent Prompt — How to Deploy — Close Gaps — Supabase Wired</h2>
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-4">
        <div className="rounded-[20px] bg-[#0F172A] p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-white tracking-wide">TERMINAL WINDOW MOCK BASH COMMANDS SYNTAX HIGHLIGHT</span>
            <button onClick={copy} className="h-7 px-3 rounded-full bg-white text-[11px] font-bold flex items-center gap-1">
              {copied ? "Copied ✓" : "Copy prompt"}
            </button>
          </div>
          <pre className="mt-3 font-mono text-[11px] leading-5 text-[#E2E8F0] whitespace-pre-wrap">{terminal}</pre>
          <div className="mt-4 flex gap-2">
            <span className="px-2 py-1 rounded-full bg-white/10 text-white text-[10px]">supabase link</span>
            <span className="px-2 py-1 rounded-full text-white text-[10px]" style={{ background: GRADIENT }}>db push + functions deploy</span>
            <span className="px-2 py-1 rounded-full bg-white/10 text-white text-[10px]">deploy production</span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-4">
            <div className="text-[12px] font-bold">Copy-paste terminal prompt from Main Engine Supabase Wired artifact — Env keys — Supabase migration — Edge Functions — Phase 3 modules build 8%→90% — Main Engine runtime 32%→95% — Knowledge embed 815 vectors per business Eko Bites Lagos vs Garden Restaurant London — Test E2E +234 Opus vs +44 HD Voice GDPR PASS confetti -&gt; Gift Dashboard UPRM Unified Inbox Supabase Realtime</div>
            <div className="mt-3 grid grid-cols-1 gap-2 text-[11px]">
              {[
                "1 Supabase setup",
                "2 Env",
                "3 Auth KPI",
                "4 Phase 3 12 modules",
                "5 Main Engine runtime",
                "6 Knowledge embed",
                "7 Test E2E",
                "8 Deploy production",
                "9 Verify Gift Dashboard — Overall 66%->95%+",
              ].map(s => (
                <div key={s} className="flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full flex items-center justify-center text-white text-[10px]" style={{ background: GRADIENT }}>✓</span>
                  <span className="font-medium">{s}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl p-3 border text-[11px] flex items-center gap-2" style={{ borderColor: "transparent", background: "var(--gradient-soft)" }}>
            <span className="h-2 w-2 rounded-full" style={{ background: GRADIENT }} /> Easy impl: 9 steps — Supabase setup → Env → Auth KPI → Phase 3 12 modules → Main Engine runtime → Knowledge embed → Test E2E → Deploy production → Verify Gift Dashboard
          </div>
        </div>
      </div>
    </div>
  );
}

function PageFAQ() {
  const faqs = [
    { q: "How long to setup?", a: "5 minutes 8 steps — Website -> GBP -> Docs -> Voice -> Languages -> Calendar -> Channels -> Test Call -> Gift Dashboard" },
    { q: "One engine two continents how?", a: "Same codebase — adapters instant swap — flag switch 🌍 Africa | 🇪🇺 Eurozone | 🇬🇧 UK — Telephony Africa's Talking vs Twilio — Payment M-Pesa vs Stripe SEPA — Compliance NDPR vs GDPR — Voice 23 vs 8 — Languages 23 vs 8" },
    { q: "Supabase wired benefits?", a: "Auth RLS + Realtime Gift Dashboard + pgvector 815 vectors backup Qdrant + Storage aikova-recordings + Edge Functions 12 telephony speech brain booking social handoff billing — Close gaps Auth 5%->95% Phase 3 8%->90% Engine 32%->95% = Overall 95%+" },
    { q: "No hallucination guarantee?", a: "Guardrails No hallucination outside KB — Qdrant 815 vectors + Supabase pgvector + semantic search 0.85 threshold reranker citations — Playbooks FAQs 24 Services 8 Hours — Business memory pills" },
    { q: "Social-to-Sale Comment -> Auto-DM -> Close how?", a: "IG FB Graph API webhooks — Comment how much? price? book? trigger — Auto DM within 60s price from KB 815 vectors — Book slot — Payment link M-Pesa STK push vs Stripe SEPA — Confirm booking — Calendar ICS — Follow-up — social_conversions table tracking" },
    { q: "Voice Mesh hyperlocal accent detection Ibadan vs Lagos?", a: "Whisper v3 fine-tuned Lagos Yoruba Ibadan vs Lagos Kenyan Swahili vs Tanzanian Zulu Xhosa Hausa Igbo Amharic Pidgin SA English vs Scouse Liverpool London Yorkshire Berlin Bavarian Marseille — 96.2% Africa 94.2% Eurozone 3-sec detection mirroring — Coqui 23 Africa vs ElevenLabs 8 Eurozone clone custom" },
    { q: "Deployment ai-receptionist.aikova.co.uk?", a: "Vite React SPA nginx VPS scripts/deploy-vps.sh + Supabase link db push functions deploy + npm run build deploy production af-south-1 Cape Town eu-central-1 Frankfurt Cloudflare edge <100ms <100kb JS" },
  ];
  return (
    <div className="space-y-4">
      <h2 className="text-[22px] font-[800] tracking-tight">FAQ — Easy Implementation — Troubleshooting — One Engine Two Continents</h2>
      <div className="grid sm:grid-cols-2 gap-3 max-h-[420px] overflow-auto pr-1">
        {faqs.map(f => (
          <div key={f.q} className="rounded-[18px] border border-[#E2E8F0] bg-white p-4">
            <div className="text-[12px] font-bold flex items-start gap-2">
              <span className="h-5 w-5 rounded-full flex items-center justify-center text-white text-[10px] shrink-0" style={{ background: GRADIENT }}>Q</span>
              {f.q}
            </div>
            <div className="mt-2 text-[11px] leading-4 text-[#475569]">A: {f.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PageFinal() {
  const [confetti, setConfetti] = useState(false);
  useEffect(() => {
    setConfetti(true);
    const t = setTimeout(() => setConfetti(false), 3000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="relative space-y-5 overflow-hidden">
      {confetti && (
        <div className="pointer-events-none absolute inset-0 z-10">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="absolute w-1.5 h-6 rounded-full" style={{ left: `${(i * 7) % 100}%`, top: `-10%`, background: i % 3 === 0 ? "#00E5FF" : i % 3 === 1 ? "#2962FF" : "#76FF03", animation: `aikovaDropIn 0.8s both ${i * 60}ms`, transform: `rotate(${i * 15}deg)` }} />
          ))}
        </div>
      )}
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-center">
        <div className="space-y-4">
          <h2 className="text-[26px] sm:text-[32px] font-[800] tracking-[-0.02em] leading-[0.95]">Ready to Build? — One Engine, Two Continents — Ferrari Body + Supabase Engine — Torch of God</h2>
          <div className="rounded-[20px] border border-[#E2E8F0] bg-[#F8FAFC] p-4 flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-white border shadow flex items-center justify-center text-[28px]">🏎️</div>
            <div className="flex-1">
              <div className="text-[11px] font-bold tracking-wide">FERRARI BODY + ENGINE CONNECTION CABLE PULSING GRADIENT + OVERALL 66% → 95%+ PROGRESS BIG + CONFETTI + GIFT DASHBOARD UPRM MOCK</div>
              <div className="mt-2 h-2 rounded-full bg-[#E2E8F0] overflow-hidden"><div className="h-full rounded-full" style={{ width: "95%", background: GRADIENT }} /></div>
              <div className="mt-1 text-[10px] text-[#64748B]">Ferrari Body Beautiful ✅ DONE Wired LIVE https://ai-receptionist.aikova.co.uk/onboarding?region=eurozone — Ferrari Engine Supabase Wired 🔧 BUILDING — Close the Gaps — One Engine Two Continents — VisaguideOS Entrance Pattern — Torch of God — ASSESS BUTTON TO BE UPDATED ON MAIN HERO PAGE assess-button-main-hero pulsing — 2024 Confidential Internal Strategy — Strategic Pillars Market Access Regulatory Alignment Innovation Funding Sustainable Growth</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/readiness" className="h-11 px-5 rounded-full text-white font-semibold text-[13px] shadow inline-flex items-center" style={{ background: GRADIENT }}>Open Main Engine / Readiness</a>
            <a href="/onboarding?region=eurozone" className="h-11 px-5 rounded-full bg-white border border-[#E2E8F0] font-medium text-[13px] inline-flex items-center">Open onboarding (Eurozone)</a>
            <a href="/auth" className="h-11 px-5 rounded-full text-white font-semibold text-[13px] shadow animate-pulse inline-flex items-center" style={{ background: GRADIENT }}>Deploy — Sign in &amp; wire</a>
            <a href="/app/dashboard" className="h-11 px-5 rounded-full bg-[#0F172A] text-white font-medium text-[13px] inline-flex items-center">Open Dashboard</a>
          </div>
        </div>
        <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
          <div className="text-[11px] font-bold mb-3">GIFT DASHBOARD UPRM MOCK</div>
          <div className="rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold">Unified Inbox • 24 new</span>
              <span className="h-2 w-2 rounded-full bg-[#22C55E] animate-pulse" />
            </div>
            <div className="mt-3 space-y-2">
              {[
                { t: "Call +234 Lagos", s: "Booking tomorrow 7pm" },
                { t: "IG DM @ekobites", s: "how much? -> Auto DM sent" },
                { t: "WhatsApp +44", s: "Stripe payment confirmed" },
              ].map(r => (
                <div key={r.t} className="rounded-xl bg-white border p-2.5 flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full flex items-center justify-center text-white text-[10px]" style={{ background: GRADIENT }}>✓</div>
                  <div><div className="text-[11px] font-bold">{r.t}</div><div className="text-[10px] text-[#64748B]">{r.s}</div></div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 rounded-2xl p-3 text-[11px] text-white" style={{ background: GRADIENT2 }}>
            <div className="font-bold">ASSESS BUTTON TO BE UPDATED ON MAIN HERO PAGE assess-button-main-hero pulsing</div>
            <div className="mt-1 opacity-90">Torch of God • VisaguideOS • One Engine Two Continents • Torch constancy • Flawless beauty</div>
          </div>
        </div>
      </div>
    </div>
  );
}
