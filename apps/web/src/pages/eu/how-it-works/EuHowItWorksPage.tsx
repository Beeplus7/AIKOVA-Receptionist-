import { useEffect, useRef, useState } from "react";
import logoUrl from "./assets/32d4f05ae5209978-image_6A9BA612-7186-480D-9D5C-7EF8BE2260B7.jpeg";
import heroInfographicUrl from "./assets/e4b1ad868dbe7053-image_20261029_222748.webp";
import ragInfographicUrl from "./assets/507ac771e0aaffb3-image_20261029_222757.webp";
import { startSetupUrl } from '../../../lib/setupFlow';

// --- Types ---
type Assessment = {
  website: string;
  gbp?: string;
  country: string;
  phone?: string;
};

// --- Components ---

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("in");
            // staggered children
            el.querySelectorAll(".reveal-child").forEach((c, i) => {
              (c as HTMLElement).style.transitionDelay = `${i * 90}ms`;
              c.classList.add("in");
            });
          }
        });
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const Nav = ({ onAssess: _onAssess }: { onAssess: () => void }) => {
  const [open, setOpen] = useState(false);
  return (
    <header
      data-safe-area-sticky-top
      className="sticky z-40 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/70"
      style={{ top: "var(--safe-area-inset-top)" }}
    >
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8 h-[72px] flex items-center justify-between">
        <div className="flex items-center gap-10">
          <a href="/eu" className="flex items-center gap-3">
            <img src={logoUrl} alt="Eurozone AI" className="h-9 w-auto rounded-xl object-contain bg-white" />
            <span className="font-bold tracking-tight text-[18px] text-slate-900">EUROZONE AI</span>
          </a>
          <nav className="hidden lg:flex items-center gap-7 text-[14px] font-medium text-slate-600">
            <a href="/eu/features" className="hover:text-slate-900 transition">Features</a>
            <a href="/eu/solutions" className="hover:text-slate-900 transition">Solutions</a>
            <a href="/eu/languages" className="hover:text-slate-900 transition">Languages</a>
            <a
              href="/eu/how-it-works"
              className="relative text-slate-900 font-semibold"
            >
              <span className="inline-flex items-center gap-1.5">
                How It Works
                <span className="inline-flex items-center gap-0.5 text-[11px]">🇬🇧🇪🇺</span>
              </span>
              <span className="absolute -bottom-1 left-0 w-full h-[2px] gradient-border rounded-full" />
            </a>
            <a href="/eu/pricing" className="hover:text-slate-900 transition">Pricing</a>
            <a href={startSetupUrl("eurozone")} className="hover:text-slate-900 transition">Demo</a>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden w-9 h-9 rounded-full border border-slate-200 grid place-items-center"
          >
            <div className="w-4 h-3 flex flex-col justify-between">
              <span className="h-[1.5px] bg-slate-800 block" />
              <span className="h-[1.5px] bg-slate-800 block" />
              <span className="h-[1.5px] bg-slate-800 block" />
            </div>
          </button>
          <a href={startSetupUrl("eurozone")}
            id="assess-button-main-hero"
            
            className="hidden md:inline-flex h-[40px] px-5 rounded-full bg-slate-900 text-white text-[13.5px] font-semibold tracking-tight hover:bg-black transition shadow-[0_8px_20px_-8px_rgba(0,0,0,0.3)]"
          >Start free trial
          </a>
          <a
            href={startSetupUrl("eurozone")}
            className="md:hidden h-[40px] px-4 rounded-full bg-slate-900 text-white text-[13px] font-semibold inline-flex items-center"
          >
            Start free
          </a>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-6 py-4 flex flex-col gap-3 text-[14px] font-medium text-slate-700">
          <a href="/eu/features">Features</a>
          <a href="/eu/solutions">Solutions</a>
          <a href="/eu/languages">Languages</a>
          <a href="/eu/how-it-works" className="text-slate-900 font-semibold">How It Works 🇬🇧🇪🇺</a>
          <a href="/eu/pricing">Pricing</a>
        </div>
      )}
    </header>
  );
};

const Hero = ({ onAssess: _onAssess }: { onAssess: () => void }) => {
  const reveal = useReveal();
  return (
    <section className="relative overflow-hidden bg-white">
      {/* soft orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-slate-50 to-transparent rounded-full blur-3xl opacity-80" />
        <div className="absolute top-[40px] right-[-120px] w-[420px] h-[420px] bg-[#00E5FF]/10 rounded-full blur-[80px]" />
        <div className="absolute top-[120px] left-[-100px] w-[360px] h-[360px] bg-[#2962FF]/10 rounded-full blur-[70px]" />
      </div>

      <div className="mx-auto max-w-[1280px] px-6 lg:px-8 pt-10 lg:pt-16 pb-10 lg:pb-20 grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center relative">
        {/* left copy */}
        <div ref={reveal} className="reveal">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[11.5px] font-semibold tracking-wide text-slate-600 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            HOW IT WORKS • 10 MINS • UK & EU • GDPR READY
            <span className="ml-1 hidden sm:inline-flex items-center gap-1 rounded-full bg-slate-900 text-white px-2 py-0.5 text-[10px]">🇬🇧 🇪🇺 LIVE</span>
          </div>

          <h1 className="mt-6 text-[32px] sm:text-[42px] lg:text-[54px] leading-[0.95] font-[600] tracking-[-0.04em] text-slate-900">
            From website to live <span className="gradient-text">AI receptionist</span> in less time than a flat white.
          </h1>

          <p className="mt-5 text-[16px] lg:text-[17px] leading-7 text-slate-600 max-w-[560px]">
            Same seamless as the cyberstaff video you sent — but for Eurozone. Paste URL, connect Google Business, 3 steps. Twilio powers <span className="font-semibold text-slate-900">+44 UK / +33 FR / +49 DE</span> numbers, fully GDPR compliant with EU data residency.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a href={startSetupUrl("eurozone")}
              
              className="h-[48px] px-6 rounded-full bg-slate-900 text-white text-[14.5px] font-semibold inline-flex items-center gap-2 hover:bg-black transition shadow-[0_12px_24px_-12px_rgba(0,0,0,0.4)]"
            >Start free trial
              <span className="w-6 h-6 rounded-full bg-white text-slate-900 grid place-items-center text-[12px]">→</span>
            </a>
            <div className="inline-flex items-center gap-2 text-[12.5px] text-slate-500">
              <span className="inline-flex -space-x-2">
                <span className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white grid place-items-center text-[10px]">🇬🇧</span>
                <span className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white grid place-items-center text-[10px]">🇪🇺</span>
                <span className="w-7 h-7 rounded-full bg-slate-900 border-2 border-white grid place-items-center text-[9px] text-white">✓</span>
              </span>
              No card • 10 min setup • Live today
            </div>
          </div>

          {/* trust strip */}
          <div className="mt-8 grid grid-cols-3 gap-3 max-w-[520px]">
            {[
              { k: "2 mins", v: "Connect" },
              { k: "3 mins", v: "AI Brain" },
              { k: "1 min", v: "Go Live" },
            ].map((s) => (
              <div key={s.k} className="rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3">
                <div className="text-[18px] font-semibold tracking-tight text-slate-900">{s.k}</div>
                <div className="text-[11px] font-medium tracking-wide text-slate-500 uppercase">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* right infographic */}
        <div className="relative">
          <div className="relative rounded-[28px] bg-white border border-slate-200 shadow-[var(--shadow-float)] p-3 lg:p-4">
            <div className="rounded-[20px] overflow-hidden bg-[#F8FAFC] border border-slate-100">
              <img
                src={heroInfographicUrl}
                alt="Eurozone AI Receptionist How it works 3-step process to launch across UK & EU"
                className="w-full h-auto object-contain"
              />
            </div>
            {/* floating chips */}
            <div className="absolute -top-3 -right-3 lg:-right-6 bg-white border border-slate-200 rounded-full px-3 py-1.5 text-[11px] font-semibold shadow-[var(--shadow-soft)] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Twilio Verified UK +44
            </div>
            <div className="absolute -bottom-4 -left-4 bg-slate-900 text-white rounded-full px-3.5 py-2 text-[11px] font-semibold shadow-lg flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white/15 grid place-items-center">✓</span> GDPR • EU Hosted • ISO27001
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2.5 text-[11px]">
            <div className="rounded-full bg-[#E0F7FF] text-[#0A4A5A] px-3 py-1.5 font-semibold text-center border border-[#B6EFFF]">GBP Sync</div>
            <div className="rounded-full bg-[#EEF2FF] text-[#1E3A8A] px-3 py-1.5 font-semibold text-center border border-[#C7D2FE]">RAG • Qdrant</div>
            <div className="rounded-full bg-[#FFF1F2] text-[#881337] px-3 py-1.5 font-semibold text-center border border-[#FECDD3]">Twilio Voice</div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ThreeSteps = () => {
  const reveal = useReveal();
  return (
    <section id="how-it-works" className="bg-[#F8FAFC] border-y border-slate-200/70">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-16 lg:py-24">
        <div ref={reveal} className="reveal max-w-[760px]">
          <div className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3 py-1 text-[11px] font-semibold tracking-widest text-slate-500">
            DETAILED WORKFLOW • DROP CARDS
          </div>
          <h2 className="mt-4 text-[28px] lg:text-[42px] leading-[0.95] font-semibold tracking-tight">
            Three steps. Six minutes. <span className="text-slate-400">Live everywhere.</span>
          </h2>
          <p className="mt-3 text-[15px] leading-6 text-slate-600">Designed for UK & EU launch — same flow you loved in the video, now with Union Jack + EU flags, Twilio local numbers, and GDPR by default.</p>
        </div>

        <div className="mt-10 lg:mt-14 grid lg:grid-cols-3 gap-6 lg:gap-7">
          {/* Step 1 */}
          <div className="group relative rounded-[24px] bg-white border border-slate-200 shadow-[var(--shadow-card)] p-6 lg:p-7 reveal reveal-child overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[4px] bg-[#4285F4]" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F8FAFC] border border-slate-200 grid place-items-center text-[16px]">G</div>
                <div>
                  <div className="text-[11px] font-bold tracking-widest text-[#4285F4]">STEP 01</div>
                  <div className="text-[18px] font-semibold -mt-1">Connect</div>
                </div>
              </div>
              <div className="rounded-full bg-[#EFF6FF] text-[#1D4ED8] text-[11px] font-semibold px-2.5 py-1 border border-blue-100">2 mins</div>
            </div>

            <div className="mt-5 space-y-3 text-[13.5px] leading-5 text-slate-600">
              <div className="flex gap-2"><span className="mt-0.5 w-5 h-5 rounded-full bg-slate-900 text-white grid place-items-center text-[10px]">✓</span> Link your company website / booking page</div>
              <div className="flex gap-2"><span className="mt-0.5 w-5 h-5 rounded-full bg-slate-900 text-white grid place-items-center text-[10px]">✓</span> Integrate with Google Business Profile</div>
              <div className="flex gap-2"><span className="mt-0.5 w-5 h-5 rounded-full bg-slate-900 text-white grid place-items-center text-[10px]">✓</span> Sync hours, services, FAQs automatically</div>
            </div>

            <div className="mt-6 rounded-2xl bg-[#F8FAFC] border border-slate-200 p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 grid place-items-center">
                <div className="w-5 h-5 rounded bg-[#4285F4]/20" />
              </div>
              <div className="text-[12px]">
                <div className="font-semibold text-slate-900">Data Source</div>
                <div className="text-slate-500">Website + GBP • Auto-sync daily</div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="group relative rounded-[24px] bg-white border border-slate-200 shadow-[var(--shadow-card)] p-6 lg:p-7 reveal reveal-child overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[4px] bg-[#7C3AED]" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F5F3FF] border border-violet-200 grid place-items-center text-[16px]">🧠</div>
                <div>
                  <div className="text-[11px] font-bold tracking-widest text-violet-600">STEP 02</div>
                  <div className="text-[18px] font-semibold -mt-1">AI Brain Builds RAG</div>
                </div>
              </div>
              <div className="rounded-full bg-[#F5F3FF] text-[#6D28D9] text-[11px] font-semibold px-2.5 py-1 border border-violet-100">3 mins</div>
            </div>

            <div className="mt-5 space-y-3 text-[13.5px] leading-5 text-slate-600">
              <div className="flex gap-2"><span className="mt-0.5 w-5 h-5 rounded-full bg-violet-600 text-white grid place-items-center text-[10px]">✓</span> Processes docs knowledge base</div>
              <div className="flex gap-2"><span className="mt-0.5 w-5 h-5 rounded-full bg-violet-600 text-white grid place-items-center text-[10px]">✓</span> Embeds into secure vector DB Qdrant</div>
              <div className="flex gap-2"><span className="mt-0.5 w-5 h-5 rounded-full bg-violet-600 text-white grid place-items-center text-[10px]">✓</span> AI answers from verified sources only</div>
            </div>

            <div className="mt-6 rounded-2xl bg-gradient-to-br from-violet-50 to-fuchsia-50 border border-violet-100 p-3.5">
              <div className="text-[11px] font-bold tracking-widest text-violet-700">RAG = Real-time • Accurate • GDPR-ready</div>
              <div className="mt-1 text-[12px] text-slate-600">GPT-4o + Qdrant • Context-aware chunking</div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="group relative rounded-[24px] bg-white border border-slate-200 shadow-[var(--shadow-card)] p-6 lg:p-7 reveal reveal-child overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[4px] bg-[#EF4444]" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FFF1F2] border border-red-200 grid place-items-center text-[14px] font-bold text-[#E11D48]">Tw</div>
                <div>
                  <div className="text-[11px] font-bold tracking-widest text-red-600">STEP 03</div>
                  <div className="text-[18px] font-semibold -mt-1">Go Live</div>
                </div>
              </div>
              <div className="rounded-full bg-[#FFF1F2] text-[#BE123C] text-[11px] font-semibold px-2.5 py-1 border border-red-100">1 min</div>
            </div>

            <div className="mt-5 space-y-3 text-[13.5px] leading-5 text-slate-600">
              <div className="flex gap-2"><span className="mt-0.5 w-5 h-5 rounded-full bg-red-500 text-white grid place-items-center text-[10px]">✓</span> AI answers calls 24/7 via Twilio</div>
              <div className="flex gap-2"><span className="mt-0.5 w-5 h-5 rounded-full bg-red-500 text-white grid place-items-center text-[10px]">✓</span> Transfers to human or emails summary</div>
              <div className="flex gap-2"><span className="mt-0.5 w-5 h-5 rounded-full bg-red-500 text-white grid place-items-center text-[10px]">✓</span> Live on phone • Call routing • CRM</div>
            </div>

            <div className="mt-6 flex flex-wrap gap-1.5">
              {["+44 UK"," +33 FR"," +49 DE"," +34 ES"," +39 IT"," +31 NL"," +48 PL"," +351 PT"].map((c) => (
                <span key={c} className="rounded-full bg-slate-900 text-white text-[10px] font-semibold px-2.5 py-1">{c}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits row */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {[
            { label: "GDPR Compliant", color: "bg-[#DBEAFE] text-[#1E40AF] border-blue-200", dot: "bg-blue-600" },
            { label: "Multilingual EN FR DE ES", color: "bg-[#DCFCE7] text-[#166534] border-green-200", dot: "bg-green-600" },
            { label: "24/7 Availability", color: "bg-[#FEF9C3] text-[#854D0E] border-yellow-200", dot: "bg-yellow-500" },
            { label: "Secure Encrypted", color: "bg-[#F3E8FF] text-[#6B21A8] border-purple-200", dot: "bg-purple-600" },
          ].map((b) => (
            <div key={b.label} className={`rounded-full border px-4 py-2.5 flex items-center gap-2 text-[12.5px] font-semibold ${b.color}`}>
              <span className={`w-2 h-2 rounded-full ${b.dot}`} /> {b.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const RAGDeepDive = () => {
  const reveal = useReveal();
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-16 lg:py-24">
        <div ref={reveal} className="reveal text-center max-w-[820px] mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-3.5 py-1.5 text-[11px] font-semibold tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> EUROPEAN RAG KNOWLEDGE BASE
          </div>
          <h2 className="mt-5 text-[26px] lg:text-[42px] leading-[0.95] font-semibold tracking-tight">
            Secure Multilingual <span className="text-slate-400">GDPR-Compliant</span> Real-Time AI
          </h2>
          <p className="mt-3 text-[14px] lg:text-[15px] text-slate-600 leading-6">
            Built for European enterprises — ISO27001, SOC2, EU data residency. From PDFs to live phone answers in minutes.
          </p>
        </div>

        {/* Centerpiece image */}
        <div className="mt-10 lg:mt-14 mx-auto max-w-[1080px]">
          <div className="rounded-[28px] bg-white border border-slate-200 shadow-[var(--shadow-float)] p-3 lg:p-5">
            <div className="rounded-[20px] overflow-hidden border border-slate-100 bg-[#F8FAFC]">
              <img
                src={ragInfographicUrl}
                alt="European RAG Knowledge Base Secure Multilingual GDPR-Compliant Real-Time AI"
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[11px] font-medium text-slate-500 px-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 text-white px-2.5 py-1 text-[10px] font-semibold"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Hosted in EU</span>
                <span>ISO27001 • SOC2</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-full bg-slate-100 border border-slate-200">LLM: GPT-4o</span>
                <span className="px-2 py-1 rounded-full bg-slate-100 border border-slate-200">Vector DB: Qdrant</span>
                <span className="px-2 py-1 rounded-full bg-[#E0F2FE] border border-blue-200 text-blue-800">EU 2016/679</span>
              </div>
            </div>
          </div>
        </div>

        {/* 6 cards */}
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {[
            {
              n: "01",
              title: "Data Collection",
              sub: "Business Documents Website Scraping",
              bullets: ["Ingests PDFs contracts invoices reports", "Multilingual extraction EN DE FR ES IT", "Auto-crawl sitemap + GBP"],
              color: "#0EA5E9",
            },
            {
              n: "02",
              title: "Embedding Processing",
              sub: "GPT-4o Powered Embeddings",
              bullets: ["GPT-4o multimodal", "Context-aware chunking summarisation", "Real-time vectorisation"],
              color: "#7C3AED",
            },
            {
              n: "03",
              title: "Vector Database",
              sub: "Qdrant Vector Database",
              bullets: ["High-performance vector storage", "Scalable open-source cloud-native", "Hybrid filtering metadata"],
              color: "#059669",
            },
            {
              n: "04",
              title: "Booking Calendar",
              sub: "Integrated Booking Scheduling",
              bullets: ["Book consultations", "Automated reminders confirmation emails", "Sync Outlook Google iCal"],
              color: "#EA580C",
            },
            {
              n: "05",
              title: "GDPR Compliance",
              sub: "Privacy Compliance Framework",
              bullets: ["GDPR data minimisation explicit consent", "EU data residency hosted securely EU", "Encryption at rest in transit Right to erasure"],
              color: "#1E40AF",
            },
            {
              n: "06",
              title: "Key Benefits",
              sub: "Privacy-First • Fast • Auditable",
              bullets: ["Privacy-First • Scalable Fast", "Audit Traceability", "Cost-Efficient • Transparent"],
              color: "#65A30D",
            },
          ].map((card) => (
            <div key={card.n} className="group relative rounded-[20px] bg-white border border-slate-200 p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-white grid place-items-center text-[12px] font-bold tracking-wide">{card.n}</div>
                  <div>
                    <div className="text-[15px] font-semibold leading-tight">{card.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{card.sub}</div>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full" style={{ background: card.color }} />
              </div>
              <div className="mt-4 space-y-2">
                {card.bullets.map((b) => (
                  <div key={b} className="flex gap-2 text-[12.5px] leading-5 text-slate-600">
                    <span className="mt-1 w-1 h-1 rounded-full bg-slate-400 flex-shrink-0" /> {b}
                  </div>
                ))}
              </div>
              <div className="mt-5 h-[3px] w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full w-[68%] rounded-full" style={{ background: card.color }} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-[20px] border border-slate-200 bg-[#F8FAFC] px-6 py-4 flex flex-wrap items-center justify-between gap-3 text-[12px]">
          <div className="flex flex-wrap items-center gap-2 text-slate-600">
            <span className="font-semibold text-slate-900">Hosted in EU</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>ISO27001</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>SOC2 Compliant</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>Built for European Enterprises</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>GDPR Regulation EU 2016/679</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
            <span>Secure</span>•<span>Reliable</span>•<span>Transparent</span>•<span>Auditable</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const SocialToSale = () => {
  const reveal = useReveal();
  return (
    <section className="bg-[#F8FAFC] border-y border-slate-200/70">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-14 lg:py-20 grid lg:grid-cols-2 gap-10 items-center">
        <div ref={reveal} className="reveal">
          <div className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3 py-1 text-[11px] font-bold tracking-widest text-slate-600">
            SOCIAL-TO-SALE • EUROPE EDITION
          </div>
          <h3 className="mt-4 text-[26px] lg:text-[36px] leading-[0.95] font-semibold">
            IG Comment → WhatsApp DM → Booking → Stripe SEPA <span className="text-slate-400">€25</span>
          </h3>
          <p className="mt-3 text-[14px] leading-6 text-slate-600 max-w-[520px]">
            European beauty salons, clinics, consultancies: turn "How much balayage?" into booked revenue. Multilingual AI handles FAQs, proposes slots from your calendar, and collects SEPA payment.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {["🇬🇧 EN","🇫🇷 FR","🇩🇪 DE","🇪🇸 ES","🇮🇹 IT","🇳🇱 NL","🇵🇱 PL"].map((l) => (
              <span key={l} className="rounded-full bg-white border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700">{l}</span>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[24px] bg-white border border-slate-200 shadow-[var(--shadow-card)] p-5 lg:p-6">
            {/* flow */}
            <div className="flex items-center justify-between gap-2">
              {[
                { icon: "💬", title: "IG Comment", sub: `"How much\nbalayage?"` },
                { icon: "→", title: "", sub: "" },
                { icon: "🟢", title: "WhatsApp", sub: "Multilingual\nDM auto" },
                { icon: "→", title: "", sub: "" },
                { icon: "📅", title: "Booking", sub: "Calendar\nsync" },
                { icon: "→", title: "", sub: "" },
                { icon: "💳", title: "Stripe", sub: "SEPA €25\ndeposit" },
              ].map((s, i) =>
                s.icon === "→" ? (
                  <div key={i} className="text-slate-300">→</div>
                ) : (
                  <div key={i} className="flex-1 rounded-2xl bg-[#F8FAFC] border border-slate-200 p-3 text-center">
                    <div className="text-[18px]">{s.icon}</div>
                    <div className="mt-1 text-[11px] font-bold tracking-wide text-slate-900 leading-tight">{s.title}</div>
                    <div className="mt-1 text-[10px] leading-3 text-slate-500 whitespace-pre">{s.sub}</div>
                  </div>
                )
              )}
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 text-[11px]">
              <div className="rounded-xl bg-[#F0FDF4] border border-green-200 p-3">
                <div className="font-semibold text-green-800">No missed DM</div>
                <div className="text-green-700/70 mt-1">AI replies in &lt; 8s</div>
              </div>
              <div className="rounded-xl bg-[#EFF6FF] border border-blue-200 p-3">
                <div className="font-semibold text-blue-800">Calendar live</div>
                <div className="text-blue-700/70 mt-1">Google • Outlook • iCal</div>
              </div>
              <div className="rounded-xl bg-[#FFFBEB] border border-amber-200 p-3">
                <div className="font-semibold text-amber-800">€25 SEPA</div>
                <div className="text-amber-700/70 mt-1">Stripe EU</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const VisualRoad = () => {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-3 py-1 text-[11px] font-bold tracking-widest">
              VISUAL ROAD • LONDON TO WARSAW
            </div>
            <h3 className="mt-4 text-[26px] lg:text-[38px] leading-[0.95] font-semibold">
              Europe Implementation Tree — <span className="text-slate-400">time-marked</span>
            </h3>
          </div>
          <div className="text-[12px] text-slate-500 max-w-[420px]">Same road you shipped for EU rollout, now annotated: 2 min connect, 3 min brain, 1 min go-live. GDPR guardrails at every junction.</div>
        </div>

        <div className="mt-10 relative rounded-[24px] border border-slate-200 bg-[#F8FAFC] p-4 sm:p-6 lg:p-8 overflow-x-auto max-w-full">
          <div className="min-w-[640px] md:min-w-[900px]">
            {/* road line */}
            <div className="relative h-[160px]">
              <div className="absolute top-1/2 left-0 right-0 h-[6px] bg-gradient-to-r from-[#012169] via-[#2962FF] to-[#76FF03] rounded-full" />
              {/* nodes */}
              {[
                { city: "London", flag: "🇬🇧", time: "START", left: "2%", color: "#012169", desc: "Paste URL" },
                { city: "Paris", flag: "🇫🇷", time: "2 min", left: "22%", color: "#4285F4", desc: "GBP Sync" },
                { city: "Berlin", flag: "🇩🇪", time: "3 min", left: "44%", color: "#7C3AED", desc: "RAG Build" },
                { city: "Madrid", flag: "🇪🇸", time: "1 min", left: "66%", color: "#EF4444", desc: "Twilio Live" },
                { city: "Warsaw", flag: "🇵🇱", time: "LIVE", left: "88%", color: "#16A34A", desc: "+44 +33 +49 +34 +48" },
              ].map((n) => (
                <div key={n.city} className="absolute top-0 bottom-0" style={{ left: n.left }}>
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2">
                    <div className="w-[18px] h-[18px] rounded-full bg-white border-[4px] shadow" style={{ borderColor: n.color }} />
                  </div>
                  <div className="absolute top-0 -translate-x-1/2 text-center">
                    <div className="inline-flex items-center gap-1 rounded-full bg-white border border-slate-200 px-2.5 py-1 text-[11px] font-semibold shadow-sm">
                      <span>{n.flag}</span> {n.city}
                    </div>
                    <div className="mt-1 text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full text-white" style={{ background: n.color }}>{n.time}</div>
                  </div>
                  <div className="absolute bottom-0 -translate-x-1/2 text-center">
                    <div className="text-[11px] font-medium text-slate-600">{n.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-5 gap-3 text-[11px]">
              {[
                "EU data residency",
                "Multilingual EN FR DE ES IT",
                "Qdrant • GPT-4o",
                "Twilio +44 +33 +49 +34 +39 +31 +48 +351",
                "ISO27001 SOC2 GDPR EU 2016/679",
              ].map((t) => (
                <div key={t} className="rounded-full bg-white border border-slate-200 px-3 py-2 text-center font-medium text-slate-600">{t}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CTABanner = ({ onAssess: _onAssess }: { onAssess: () => void }) => {
  return (
    <section className="px-6 lg:px-8 pb-8">
      <div className="mx-auto max-w-[1280px]">
        <div className="relative overflow-hidden rounded-[28px] gradient-bg-uk p-[1px]">
          <div className="rounded-[27px] gradient-bg-uk p-8 lg:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 text-white px-3 py-1 text-[11px] font-semibold tracking-widest backdrop-blur">
                <span className="w-1.5 h-1.5 rounded-full bg-[#76FF03] animate-pulse" /> LIVE IN 10 MINS • GDPR READY • TWILIO UK NUMBERS
              </div>
              <h3 className="mt-4 text-[22px] lg:text-[30px] leading-[0.95] font-semibold text-white max-w-[620px]">
                Assess your business now — live in 10 mins, GDPR ready, Twilio UK numbers.
              </h3>
              <p className="mt-2 text-[13px] text-white/70 max-w-[540px]">Eurozone AI Receptionist • Website + Google Business → RAG Brain → Phone Live • EN FR DE ES IT NL PL</p>
            </div>
            <div className="flex items-center gap-3">
              <a href={startSetupUrl("eurozone")}
                id="assess-button-main-hero"
                
                className="h-[48px] px-7 rounded-full bg-white text-slate-900 text-[14px] font-bold shadow-[0_12px_24px_-12px_rgba(0,0,0,0.5)] hover:bg-slate-50 transition inline-flex items-center gap-2"
              >Start free trial
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white grid place-items-center">→</span>
              </a>
              <div className="hidden lg:flex items-center gap-2 text-white/80 text-[11px]">
                <span className="w-6 h-6 rounded-full bg-white/20 grid place-items-center">✓</span> No card • EU hosted
              </div>
            </div>
          </div>
          {/* glow */}
          <div className="pointer-events-none absolute -top-24 -right-24 w-[300px] h-[300px] bg-white/20 blur-[60px] rounded-full" />
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#0F172A] text-white">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-14 lg:py-16 grid lg:grid-cols-[1.2fr_0.8fr_0.8fr_1.2fr] gap-10">
        <div>
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="Eurozone AI" className="h-9 w-auto rounded-xl" />
            <span className="font-bold tracking-tight">EUROZONE AI</span>
          </div>
          <p className="mt-4 text-[13px] leading-6 text-slate-400 max-w-[320px]">
            AI receptionist for UK & EU — website to phone in 10 mins. GDPR compliant, EU-hosted, multilingual. Built for European enterprises.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold tracking-wide">27 EU STATES</span>
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold tracking-wide">UNITED KINGDOM</span>
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold tracking-wide">GDPR 2016/679</span>
          </div>
        </div>
        <div>
          <div className="text-[11px] font-bold tracking-widest text-slate-400">PRODUCT</div>
          <div className="mt-4 space-y-2.5 text-[13px] text-slate-300">
            <div>Features</div>
            <div>Solutions</div>
            <div>Languages</div>
            <div>How It Works 🇬🇧🇪🇺</div>
            <div>Pricing</div>
          </div>
        </div>
        <div>
          <div className="text-[11px] font-bold tracking-widest text-slate-400">COMPLIANCE</div>
          <div className="mt-4 space-y-2.5 text-[13px] text-slate-300">
            <div>GDPR Compliant</div>
            <div>EU Data Residency</div>
            <div>ISO27001 • SOC2</div>
            <div>Encryption at rest & transit</div>
            <div>Right to erasure</div>
          </div>
        </div>
        <div>
          <div className="text-[11px] font-bold tracking-widest text-slate-400">LOCAL EXPERTISE • REGULATORY</div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-[11px]">
            {["🇬🇧 UK +44","🇫🇷 FR +33","🇩🇪 DE +49","🇪🇸 ES +34","🇮🇹 IT +39","🇳🇱 NL +31","🇵🇱 PL +48","🇵🇹 PT +351","🇪🇺 EU"].map((c) => (
              <div key={c} className="rounded-full bg-white/[0.06] border border-white/10 px-2.5 py-1.5 text-center">{c}</div>
            ))}
          </div>
          <div className="mt-5 text-[11px] leading-5 text-slate-500">
            Supporting 27 EU Member States + United Kingdom • Local Expertise • Regulatory Compliance • Secure Reliable Transparent Auditable
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8 h-[56px] flex items-center justify-between text-[11px] text-slate-500">
          <span>© {new Date().getFullYear()} Eurozone AI • Hosted in EU • LLM GPT-4o • Vector DB Qdrant</span>
          <span className="hidden sm:inline">Built for European Enterprises • Compliant with GDPR Regulation EU 2016/679</span>
        </div>
      </div>
    </footer>
  );
};

const AssessModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [form, setForm] = useState<Assessment>({ website: "", gbp: "", country: "GB", phone: "" });
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ saved: number; error: string | null } | null>(null);
  const [records, setRecords] = useState<any[]>([]);

  const load = async () => {
    try {
      const res = await fetch("actions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "records.list", args: { collection: "assessments" } }),
      });
      const j = await res.json();
      if (j.data) setRecords(j.data.records || []);
    } catch {}
  };

  useEffect(() => {
    if (open) load();
  }, [open]);

  const submit = async () => {
    if (!form.website) return;
    setBusy(true);
    setResult(null);
    let saved = 0;
    let error: string | null = null;
    try {
      const res = await fetch("actions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "records.create",
          args: { collection: "assessments", value: form, idempotency_key: `${form.website}-${Date.now()}` },
        }),
      });
      const j = await res.json();
      if (j.error) throw new Error(j.error);
      saved = 1;
      await load();
    } catch (e: any) {
      error = e?.message || "Failed";
    }
    setResult({ saved, error });
    setBusy(false);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-[520px] bg-white rounded-t-[28px] sm:rounded-[24px] border border-slate-200 shadow-[var(--shadow-float)] p-6 sm:p-7 max-h-[92vh] overflow-auto">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold tracking-widest text-slate-500">ASSESS YOUR BUSINESS</div>
            <div className="text-[20px] font-semibold tracking-tight">Live in 10 mins • GDPR ready</div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full border border-slate-200 grid place-items-center">✕</button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-[12px] font-semibold text-slate-700">Business Website / Booking Page *</label>
            <input
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              placeholder="https://yourbusiness.co.uk"
              className="mt-1.5 w-full h-[44px] rounded-xl border border-slate-200 bg-[#F8FAFC] px-3.5 text-[14px] outline-none focus:border-slate-900"
            />
          </div>
          <div>
            <label className="text-[12px] font-semibold text-slate-700">Google Business Profile Link</label>
            <input
              value={form.gbp}
              onChange={(e) => setForm({ ...form, gbp: e.target.value })}
              placeholder="https://maps.google.com/..."
              className="mt-1.5 w-full h-[44px] rounded-xl border border-slate-200 bg-[#F8FAFC] px-3.5 text-[14px] outline-none focus:border-slate-900"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-semibold text-slate-700">Country</label>
              <select
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="mt-1.5 w-full h-[44px] rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 text-[14px]"
              >
                <option value="GB">🇬🇧 United Kingdom +44</option>
                <option value="FR">🇫🇷 France +33</option>
                <option value="DE">🇩🇪 Germany +49</option>
                <option value="ES">🇪🇸 Spain +34</option>
                <option value="IT">🇮🇹 Italy +39</option>
                <option value="NL">🇳🇱 Netherlands +31</option>
                <option value="PL">🇵🇱 Poland +48</option>
                <option value="PT">🇵🇹 Portugal +351</option>
              </select>
            </div>
            <div>
              <label className="text-[12px] font-semibold text-slate-700">Twilio Number (optional)</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+44 20..."
                className="mt-1.5 w-full h-[44px] rounded-xl border border-slate-200 bg-[#F8FAFC] px-3.5 text-[14px] outline-none focus:border-slate-900"
              />
            </div>
          </div>

          <div className="rounded-xl bg-[#F8FAFC] border border-slate-200 p-3.5 flex gap-2 text-[11px] text-slate-600">
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white grid place-items-center text-[10px] flex-shrink-0">✓</span>
            We ingest your site + GBP, build RAG with GPT-4o + Qdrant, provision Twilio local number, and go live. GDPR-compliant, EU-hosted, encrypted at rest & transit.
          </div>

          <button
            disabled={busy || !form.website}
            onClick={submit}
            className="w-full h-[46px] rounded-full bg-slate-900 text-white text-[14px] font-semibold disabled:opacity-50 hover:bg-black transition"
          >
            {busy ? "Assessing..." : "Assess & Launch Preview"}
          </button>

          {result && (
            <div className="rounded-xl border px-3 py-2 text-[12px] bg-white" style={{ borderColor: result.error ? "#FECACA" : "#BBF7D0", color: result.error ? "#991B1B" : "#166534" }}>
              {result.error ? `Error: ${result.error}` : `Saved ${result.saved} assessment — our team will provision ${form.country} number shortly.`}
            </div>
          )}

          {records.length > 0 && (
            <div className="pt-3 border-t border-slate-200">
              <div className="text-[11px] font-bold tracking-widest text-slate-500">RECENT ASSESSMENTS</div>
              <div className="mt-2 space-y-2 max-h-[120px] overflow-auto">
                {records.slice(0, 5).map((r) => (
                  <div key={r.id} className="rounded-xl bg-[#F8FAFC] border border-slate-200 px-3 py-2 text-[12px] flex items-center justify-between">
                    <span className="font-medium text-slate-900 truncate">{r.value.website}</span>
                    <span className="text-slate-500 text-[11px]">{r.value.country} • {new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function EuHowItWorksPage() {
  const [assessOpen, setAssessOpen] = useState(false);

  // global reveal observer fallback for any .reveal outside components
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in");
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div
      data-safe-area-inset-root
      className="min-h-screen w-full bg-white overflow-x-clip"
      style={{ boxSizing: "border-box", paddingTop: "var(--safe-area-inset-top)" }}
    >
      <Nav onAssess={() => setAssessOpen(true)} />
      <main id="top" className="bg-white">
        <Hero onAssess={() => setAssessOpen(true)} />
        <ThreeSteps />
        <RAGDeepDive />
        <SocialToSale />
        <VisualRoad />
        <CTABanner onAssess={() => setAssessOpen(true)} />
      </main>
      <Footer />
      <AssessModal open={assessOpen} onClose={() => setAssessOpen(false)} />

      {/* tiny flag watermark */}
      <div className="pointer-events-none fixed bottom-3 right-3 hidden lg:flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-2.5 py-1 text-[10px] font-semibold text-slate-600 shadow-sm">
        <span>🇬🇧</span> <span>🇪🇺</span> <span className="w-px h-3 bg-slate-200 mx-1" /> Page No.5 • How It Works • GDPR Ready
      </div>
    </div>
  );
}
