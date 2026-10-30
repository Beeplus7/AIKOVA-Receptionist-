import React, { useEffect, useRef, useState } from "react";
import logoUrl from "./assets/32d4f05ae5209978-image_6A9BA612-7186-480D-9D5C-7EF8BE2260B7.jpeg";
import {
  Inbox,
  Brain,
  CalendarCheck,
  Smartphone,
  ArrowLeftRight,
  BarChart3,
  Check,
  Sparkles,
  MapPinned,
  MessageCircle,
  Waves,
  Zap,
  Globe2,
  Phone,
  Layers,
  ShoppingBag,
  Cpu,
  Database,
  Mic2,
  Languages,
  Workflow,
  ArrowRight,
  Play,
  Shield,
} from "lucide-react";

// ---------------- Hook ----------------
function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVisible(true);
        obs.disconnect();
      }
    }, { threshold: 0.15, ...options });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

// ---------------- Data ----------------
const features = [
  {
    id: "inbox",
    title: "Omnichannel Inbox",
    desc: "Voice, SMS, WhatsApp, IG Comments/DMs, FB, Web Chat, Email — one thread, one brain, zero context loss.",
    icon: Inbox,
    accent: "from-[#00E5FF] to-[#2962FF]",
    metric: "All in one thread",
    bullets: ["Shared memory like XBert / Frontdesk", "Auto language switch per contact", "Social comment → DM → sale"],
    tag: "Inspired by Frontdesk & XBert but Africa-first",
    channels: ["Voice", "SMS", "WhatsApp", "IG", "FB", "Web", "Email"],
  },
  {
    id: "brain",
    title: "Business Agnostic Brain",
    desc: "Learns from website, Google Business Profile, docs, FAQs. No industry lock. Any business in 10 mins.",
    icon: Brain,
    accent: "from-[#2962FF] to-[#7C4DFF]",
    metric: "Live in 10 mins",
    bullets: ["Website + GBP + Docs ingestion", "Qdrant RAG with freshness", "Clinic, shop, restaurant, salon"],
    tag: "Inspired by Slang AI but not restaurant-only",
    channels: ["Web", "GBP", "Docs", "FAQs"],
  },
  {
    id: "booking",
    title: "Booking & Lead CRM",
    desc: "No double-booking. Syncs Calendly, Google, Outlook. Pushes leads to HubSpot, Salesforce, Sheets instantly.",
    icon: CalendarCheck,
    accent: "from-[#76FF03] to-[#00E5FF]",
    metric: "Zero double-booking",
    bullets: ["Calendly / Google / Outlook two-way sync", "Lead → HubSpot / Salesforce / Sheets", "Paystack & MoMo payment links"],
    tag: "Inspired by Rosie & RingCentral but simpler",
    channels: ["Calendly", "Sheets", "HubSpot"],
  },
  {
    id: "mobile",
    title: "Mobile-First Low-Bandwidth",
    desc: "Opus codec, SMS fallback, USSD, Africa's Talking primary. Works on 2G, works when WiFi dies.",
    icon: Smartphone,
    accent: "from-[#00E5FF] to-[#76FF03]",
    metric: "Works on 2G",
    bullets: ["Opus 8kbps + adaptive jitter buffer", "SMS & USSD auto-fallback", "Africa's Talking + Twilio dual stack"],
    tag: "Built for uncategorized Africa",
    channels: ["2G", "SMS", "USSD", "Opus"],
  },
  {
    id: "handoff",
    title: "Smart Handoff & Emergency",
    desc: "Rule + sentiment + emergency phrase detection. Warm transfer with summary. Waterfall routing when team sleeps.",
    icon: ArrowLeftRight,
    accent: "from-[#2962FF] to-[#00E5FF]",
    metric: "< 2s detection",
    bullets: ["IONOS-style emergency phrases", "RingCentral-style warm transfer + summary", "Rosie-style waterfall routing"],
    tag: "Inspired by IONOS & RingCentral but human-first",
    channels: ["Rules", "Sentiment", "Waterfall"],
  },
  {
    id: "analytics",
    title: "Analytics & Observability",
    desc: "Call volume, resolution, language breakdown, social conversion funnel. Grafana + LangSmith under the hood.",
    icon: BarChart3,
    accent: "from-[#7C4DFF] to-[#2962FF]",
    metric: "Real-time",
    bullets: ["Language & accent analytics", "IG comment → booking funnel", "Grafana / LangSmith traces"],
    tag: "Inspired by Slang AI analytics but open",
    channels: ["Calls", "Langs", "Funnel"],
  },
];

const roadNodes = features.map((f, i) => ({
  label: f.title.split(" ")[0],
  full: f.title,
  icon: f.icon,
  pos: i,
}));

export default function FeaturesPage() {
  const [activeRoad, setActiveRoad] = useState<string>("inbox");
  const coreRef = useInView<HTMLDivElement>();
  const iceRef = useInView<HTMLDivElement>();
  const compareRef = useInView<HTMLDivElement>();
  const flowRef = useInView<HTMLDivElement>();

  return (
    <div
      data-safe-area-inset-root
      style={{
        boxSizing: "border-box",
        paddingTop: "var(--safe-area-inset-top)",
        background: "var(--bg)",
        minHeight: "100vh",
      }}
      className="w-full overflow-x-clip antialiased"
    >
      {/* Navigation */}
      <header
        data-safe-area-sticky-top
        style={{ top: "var(--safe-area-inset-top)" }}
        className="sticky z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="AiKOVA" className="h-9 w-9 rounded-xl object-cover shadow-sm" />
            <span className="font-[700] text-[20px] tracking-tight text-slate-900">AiKOVA</span>
            <span className="ml-2 hidden rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500 ring-1 ring-slate-200 sm:inline">Features No.2/11</span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {[
              { label: "Features", href: "/features", active: true },
              { label: "Solutions", href: "/solutions" },
              { label: "Languages", href: "/languages" },
              { label: "Pricing", href: "/pricing" },
              { label: "Demo", href: "/business" },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href ?? `#${l.label.toLowerCase()}`}
                className={`relative text-[14px] font-[600] tracking-tight transition ${
                  l.active ? "text-slate-900" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {l.label}
                {l.active && (
                  <span
                    className="absolute -bottom-2 left-0 h-[3px] w-full rounded-full"
                    style={{ background: "var(--grad)" }}
                  />
                )}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="/business"
              className="hidden rounded-full px-4 py-2 text-[13px] font-semibold text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 md:block"
            >
              Watch demo
            </a>
            <a
              href="/get-started"
              className="rounded-full bg-slate-900 px-5 py-[10px] text-[13px] font-bold text-white shadow-[0_8px_20px_rgba(15,23,42,0.15)] transition hover:translate-y-[-1px] md:hidden lg:inline-flex"
              style={{ background: "linear-gradient(90deg,#00E5FF 0%,#2962FF 50%,#1A237E 100%)" }}
            >
              Start free trial
            </a>
            <button className="rounded-full bg-slate-900 px-5 py-[10px] text-[13px] font-bold text-white shadow-[0_8px_20px_rgba(15,23,42,0.15)] transition hover:translate-y-[-1px] hidden md:inline-flex lg:hidden" style={{ background: "linear-gradient(90deg,#00E5FF 0%,#2962FF 50%,#1A237E 100%)" }}>
              Start free
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-180px] h-[560px] w-[1200px] -translate-x-1/2 rounded-full bg-gradient-to-br from-[#00E5FF]/10 via-[#2962FF]/10 to-[#76FF03]/10 blur-[80px]" />
        </div>

        <div className="relative mx-auto max-w-[1280px] px-6 pb-16 pt-14 lg:px-8 lg:pt-20">
          <div className="mx-auto max-w-[860px] text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 shadow-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#00E5FF]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-600">Features • Built for uncategorized Africa</span>
            </div>

            <h1 className="mt-7 text-[42px] font-[700] leading-[0.95] tracking-[-0.03em] text-slate-900 sm:text-[64px] lg:text-[72px]">
              One brain.
              <br />
              <span className="relative">
                Every channel.
                <span className="absolute bottom-1 left-0 -z-10 h-[14px] w-full bg-gradient-to-r from-[#00E5FF]/40 to-[#76FF03]/30" />
              </span>
              <br />
              Any business.
            </h1>

            <p className="mx-auto mt-6 max-w-[640px] text-[16px] leading-[1.6] text-slate-500 sm:text-[18px]">
              Plug-and-play receptionist that adopts any business type — clinic, shop, restaurant, salon — in 10 mins. No code. No industry lock. Just answers.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a href="#core" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-bold text-white shadow-[0_12px_24px_rgba(41,98,255,0.25)] transition hover:translate-y-[-1px]" style={{ background: "var(--grad)" }}>
                <Play className="h-4 w-4 fill-white" /> Explore features
              </a>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] font-semibold text-slate-600">
                <Shield className="h-4 w-4" /> SOC2 • Africa's Talking native
              </span>
            </div>
          </div>

          {/* Road Infographic */}
          <div className="relative mt-14 rounded-[32px] border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4 shadow-[0_24px_64px_rgba(15,23,42,0.06)] sm:p-8 lg:mt-20">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                <Layers className="h-4 w-4" /> Feature road • 6 nodes • live
              </div>
              <div className="hidden items-center gap-2 text-[11px] text-slate-400 sm:flex">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> All systems operational
              </div>
            </div>

            {/* Desktop road */}
            <div className="relative hidden md:block">
              <div className="absolute left-[4%] right-[4%] top-[52px] h-[4px] rounded-full" style={{ background: "var(--grad)" }} />
              {/* dashed underlay */}
              <svg className="absolute left-[4%] right-[4%] top-[52px] h-[4px] w-[92%] overflow-visible" preserveAspectRatio="none">
                <line x1="0" y1="2" x2="100%" y2="2" stroke="white" strokeDasharray="8 12" strokeWidth="4" opacity={0.6} />
              </svg>

              <div className="grid grid-cols-6 gap-2">
                {roadNodes.map((node) => {
                  const Icon = node.icon;
                  const isActive = activeRoad === features[node.pos].id;
                  return (
                    <button
                      key={node.full}
                      onClick={() => setActiveRoad(features[node.pos].id)}
                      className={`group relative flex flex-col items-center gap-3 rounded-[20px] border bg-white p-4 text-center transition-all duration-300 ${
                        isActive ? "border-slate-900 shadow-[0_16px_32px_rgba(15,23,42,0.12)] -translate-y-2" : "border-slate-200 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(15,23,42,0.06)]"
                      }`}
                    >
                      <div className={`flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-gradient-to-br ${features[node.pos].accent} text-white shadow-[0_8px_16px_rgba(41,98,255,0.25)]`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{String(node.pos + 1).padStart(2, "0")}</div>
                        <div className="mt-1 text-[13px] font-bold leading-tight text-slate-900">{node.full}</div>
                      </div>
                      {isActive && (
                        <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">●</div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* pop card */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="col-span-2 rounded-[20px] border border-slate-200 bg-white p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${features.find((f) => f.id === activeRoad)?.accent} text-white`}>
                        {React.createElement(features.find((f) => f.id === activeRoad)!.icon, { className: "h-5 w-5" })}
                      </div>
                      <div>
                        <div className="text-[14px] font-bold text-slate-900">{features.find((f) => f.id === activeRoad)?.title}</div>
                        <div className="mt-1 max-w-[420px] text-[13px] leading-[1.5] text-slate-500">{features.find((f) => f.id === activeRoad)?.desc}</div>
                      </div>
                    </div>
                    <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-bold text-white">{features.find((f) => f.id === activeRoad)?.metric}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {features.find((f) => f.id === activeRoad)?.channels.map((c) => (
                      <span key={c} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">{c}</span>
                    ))}
                  </div>
                </div>
                <div className="rounded-[20px] bg-slate-900 p-5 text-white">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest opacity-60"><Zap className="h-4 w-4" /> Live trace</div>
                  <div className="mt-4 space-y-2 font-mono text-[11px] leading-[1.6]">
                    <div><span className="opacity-50">› inbound:</span> WhatsApp / IG</div>
                    <div><span className="opacity-50">› stt:</span> Whisper [yo-NG 96%]</div>
                    <div><span className="opacity-50">› rag:</span> Qdrant hit 0.89</div>
                    <div className="inline-flex rounded bg-white/10 px-2 py-1 text-[#76FF03]">› action: booking created ✓</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile vertical road */}
            <div className="relative md:hidden">
              <div className="absolute left-[26px] top-[20px] bottom-[20px] w-[4px] rounded-full" style={{ background: "var(--grad-vert)" }} />
              <div className="space-y-3">
                {features.map((f, idx) => {
                  const Icon = f.icon;
                  return (
                    <div key={f.id} className="relative flex gap-4 rounded-[20px] border border-slate-200 bg-white p-4">
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${f.accent} text-white shadow-sm`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold tracking-widest text-slate-400">0{idx + 1}</span>
                          <span className="text-[14px] font-bold text-slate-900">{f.title}</span>
                        </div>
                        <p className="mt-1 text-[12px] leading-[1.5] text-slate-500">{f.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES */}
      <section id="core" className="bg-[#F8FAFC] py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
          <div className="mx-auto max-w-[720px] text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-slate-500 shadow-sm ring-1 ring-slate-200">
              <Sparkles className="h-3.5 w-3.5" /> Core Features • 6 pillars
            </div>
            <h2 className="mt-6 text-[32px] font-[700] leading-[0.95] tracking-[-0.02em] text-slate-900 sm:text-[48px]">Everything you need.<br />Nothing you don't.</h2>
            <p className="mt-4 text-[15px] leading-[1.6] text-slate-500">Each card drops in with purpose. Gradient top bar, metric, 3 bullets. Built like Frontdesk, Slang, RingCentral — but for Africa.</p>
          </div>

          <div ref={coreRef.ref as any} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => {
              const Icon = f.icon;
              const visible = coreRef.visible;
              return (
                <div
                  key={f.id}
                  style={{
                    animation: visible ? `dropIn 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s both` : "none",
                    transform: visible ? undefined : "translateY(-40px)",
                    opacity: visible ? undefined : 0,
                  }}
                  className="group relative flex flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_8px_32px_rgba(15,23,42,0.04)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_rgba(15,23,42,0.08)]"
                >
                  <div className="h-[4px] w-full" style={{ background: "var(--grad)" }} />
                  <div className="p-7">
                    <div className="flex items-start justify-between">
                      <div className={`flex h-[56px] w-[56px] items-center justify-center rounded-[18px] bg-gradient-to-br ${f.accent} text-white shadow-[0_10px_20px_rgba(41,98,255,0.2)] transition-transform group-hover:scale-[1.05]`}>
                        <Icon className="h-7 w-7" />
                      </div>
                      <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-bold tracking-wide text-white">{f.metric}</span>
                    </div>

                    <h3 className="mt-6 text-[20px] font-bold leading-[1.15] tracking-[-0.01em] text-slate-900">{f.title}</h3>
                    <p className="mt-2 text-[14px] leading-[1.6] text-slate-500">{f.desc}</p>

                    <div className="mt-6 space-y-2.5">
                      {f.bullets.map((b) => (
                        <div key={b} className="flex items-start gap-2.5 text-[13px] leading-[1.5] text-slate-700">
                          <span className="mt-[2px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white">
                            <Check className="h-3 w-3" />
                          </span>
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-wrap gap-1.5">
                      {f.channels.map((c) => (
                        <span key={c} className="rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500 ring-1 ring-slate-200">{c}</span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto border-t border-slate-100 bg-slate-50/70 px-7 py-3.5">
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#76FF03]" />
                      {f.tag}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ICE ON CAKE */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                <span className="h-2 w-2 rounded-full bg-[#2962FF]" /> Ice on the cake
              </div>
              <h2 className="mt-4 text-[30px] font-[700] leading-[0.95] tracking-[-0.02em] text-slate-900 sm:text-[44px]">Two unfair advantages.</h2>
            </div>
            <p className="max-w-[420px] text-[14px] leading-[1.6] text-slate-500">Competitors sound American. We sound like home. Competitors ignore Instagram. We turn comments into MoMo.</p>
          </div>

          <div ref={iceRef.ref as any} className="mt-10 grid gap-6 lg:grid-cols-2">
            {/* Local Voice Mesh */}
            <div
              className={`relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_16px_40px_rgba(15,23,42,0.06)] transition-all duration-700 ${
                iceRef.visible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
              }`}
            >
              <div className="absolute right-[-40px] top-[-40px] h-[220px] w-[220px] rounded-full bg-gradient-to-br from-[#00E5FF]/15 to-[#2962FF]/15 blur-[30px]" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white"><Waves className="h-6 w-6" /></div>
                    <div>
                      <div className="text-[13px] font-bold uppercase tracking-widest text-slate-400">Feature spotlight</div>
                      <div className="text-[20px] font-bold tracking-tight text-slate-900">Local Voice Mesh</div>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#00E5FF]/15 px-3 py-1 text-[11px] font-bold text-[#0F172A]">3-sec detection</span>
                </div>

                <div className="mt-8 grid gap-6 sm:grid-cols-[1.1fr_0.9fr]">
                  <div className="space-y-4">
                    <div className="rounded-[16px] border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-500"><Mic2 className="h-4 w-4" /> Accent detection</div>
                      <div className="mt-3 flex items-end gap-[3px] h-[36px]">
                        {Array.from({ length: 28 }).map((_, i) => (
                          <span key={i} className="w-[3px] rounded-full" style={{ height: `${12 + Math.sin(i * 0.8) * 10 + Math.random() * 14}px`, background: i % 3 === 0 ? "#00E5FF" : i % 3 === 1 ? "#2962FF" : "#76FF03" }} />
                        ))}
                      </div>
                      <div className="mt-3 flex gap-2 text-[11px] font-semibold">
                        <span className="rounded-full bg-slate-900 px-2.5 py-1 text-white">Lagos Yoruba • soft</span>
                        <span className="rounded-full bg-white px-2.5 py-1 ring-1 ring-slate-200 text-slate-600">Ibadan Yoruba • deep</span>
                      </div>
                    </div>

                    <div className="rounded-[16px] border border-slate-200 p-4">
                      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-500"><MapPinned className="h-4 w-4" /> Dialect map • Nigeria</div>
                      <div className="mt-3 relative h-[96px] overflow-hidden rounded-xl bg-[#F8FAFC] p-3">
                        <svg viewBox="0 0 200 80" className="h-full w-full">
                          <path d="M20 20 Q60 5 100 25 T180 30 Q170 60 100 70 T20 50 Z" fill="none" stroke="#E2E8F0" strokeWidth="2" />
                          <circle cx="48" cy="32" r="8" fill="#00E5FF" opacity={0.9} />
                          <circle cx="132" cy="48" r="8" fill="#2962FF" opacity={0.9} />
                          <text x="36" y="52" fontSize="7" fontWeight="700" fill="#0F172A">Ibadan</text>
                          <text x="120" y="68" fontSize="7" fontWeight="700" fill="#0F172A">Lagos</text>
                        </svg>
                      </div>
                      <div className="mt-2 text-[12px] leading-[1.5] text-slate-500">Mirrors caller's dialect. Builds trust in 3 seconds. Yoruba, Swahili (KE vs TZ), Igbo, Hausa.</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-[16px] bg-slate-900 p-4 text-white">
                      <div className="text-[11px] font-bold uppercase tracking-widest opacity-60">Before / After</div>
                      <div className="mt-3 space-y-2 text-[12px] leading-[1.5]">
                        <div className="rounded-lg bg-white/10 p-2.5"><span className="opacity-60">Bot:</span> "Hello, how may I help you?" <span className="ml-1 rounded bg-red-500/20 px-1.5 py-0.5 text-[10px]">Foreign</span></div>
                        <div className="rounded-lg bg-gradient-to-br from-[#00E5FF]/20 to-[#2962FF]/20 p-2.5 ring-1 ring-white/10"><span className="opacity-80">AiKOVA:</span> "Ẹ ku owurọ, bawo ni? Se kin ṣe iranlọwọ?" <span className="ml-1 rounded bg-[#76FF03]/30 px-1.5 py-0.5 text-[10px] text-[#76FF03]">Home</span></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-600"><Languages className="h-4 w-4" /> 3-sec accent lock • Voice cloning</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social-to-Sale Engine */}
            <div
              className={`relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_16px_40px_rgba(15,23,42,0.06)] transition-all duration-700 delay-150 ${
                iceRef.visible ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
              }`}
            >
              <div className="absolute left-[-30px] bottom-[-30px] h-[200px] w-[200px] rounded-full bg-gradient-to-br from-[#76FF03]/20 to-[#00E5FF]/15 blur-[30px]" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white"><ShoppingBag className="h-6 w-6" /></div>
                    <div>
                      <div className="text-[13px] font-bold uppercase tracking-widest text-slate-400">Feature spotlight</div>
                      <div className="text-[20px] font-bold tracking-tight text-slate-900">Social-to-Sale Engine</div>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#76FF03]/20 px-3 py-1 text-[11px] font-bold text-slate-900">IG → MoMo</span>
                </div>

                <div className="mt-8">
                  {/* Infographic flow */}
                  <div className="rounded-[18px] border border-slate-200 bg-slate-50 p-4">
                    <div className="grid grid-cols-5 items-center gap-2 text-center">
                      {[
                        { icon: MessageCircle, label: "Comment", sub: "@user • price?" },
                        { icon: ArrowRight, label: "", sub: "", arrow: true },
                        { icon: Smartphone, label: "DM", sub: "Auto reply" },
                        { icon: CalendarCheck, label: "Booking", sub: "2 clicks" },
                        { icon: ShoppingBag, label: "Pay", sub: "MoMo / Paystack" },
                      ].map((step, idx) =>
                        step.arrow ? (
                          <div key={idx} className="flex justify-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow ring-1 ring-slate-200"><ArrowRight className="h-4 w-4" /></div>
                          </div>
                        ) : (
                          <div key={idx} className="flex flex-col items-center">
                            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${idx === 4 ? "bg-slate-900 text-white" : "bg-white text-slate-900 ring-1 ring-slate-200"} shadow-sm`}>
                              <step.icon className="h-5 w-5" />
                            </div>
                            <div className="mt-2 text-[11px] font-bold text-slate-900">{step.label}</div>
                            <div className="text-[10px] text-slate-500">{step.sub}</div>
                          </div>
                        )
                      )}
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {[
                        { k: "Capture rate", v: "94%" },
                        { k: "DM → Book", v: "38%" },
                        { k: "Avg time", v: "41s" },
                      ].map((m) => (
                        <div key={m.k} className="rounded-xl bg-white p-3 ring-1 ring-slate-200">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{m.k}</div>
                          <div className="mt-1 text-[18px] font-bold text-slate-900">{m.v}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 rounded-[16px] bg-slate-900 p-4 text-white">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest opacity-60"><Globe2 className="h-4 w-4" /> Example trace</div>
                    <div className="mt-3 space-y-1.5 font-mono text-[11px]">
                      <div className="flex gap-2"><span className="opacity-50">IG:</span> <span>"How much for braids tomorrow?"</span></div>
                      <div className="flex gap-2"><span className="text-[#00E5FF]">AiKOVA → DM:</span> <span>Hey! ₦15k, slots 10am & 2pm. Want 10am?</span></div>
                      <div className="flex gap-2"><span className="opacity-50">User:</span> <span>"Yes 10am"</span></div>
                      <div className="inline-flex rounded bg-[#76FF03]/20 px-2 py-1 text-[#76FF03]">Booking + Paystack link sent • paid ✓</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON STRIP */}
      <section className="bg-[#F8FAFC] py-16 sm:py-20">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-[22px] font-bold tracking-tight text-slate-900 sm:text-[28px]">Why AiKOVA vs everyone else?</h2>
            <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-slate-500 ring-1 ring-slate-200">Comparison • Africa-first</span>
          </div>

          <div ref={compareRef.ref as any} className={`mt-8 grid gap-4 lg:grid-cols-3 transition-all duration-700 ${compareRef.visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
            {[
              {
                vs: "Slang AI",
                price: "$399/location",
                scope: "Restaurant only",
                theirs: ["US English only", "Needs Toast POS", "Per location pricing"],
                ours: "AiKOVA $25 any business",
                accent: "from-[#FF6B6B] to-[#FF8E53]",
              },
              {
                vs: "RingCentral",
                price: "Needs RingEX",
                scope: "Enterprise lock-in",
                theirs: ["Requires RingEX suite", "No Africa's Talking", "No social inbox"],
                ours: "AiKOVA standalone + Africa's Talking",
                accent: "from-[#2962FF] to-[#00E5FF]",
              },
              {
                vs: "Frontdesk / Rosie",
                price: "US local",
                scope: "English-only, US numbers",
                theirs: ["US numbers only", "No Yoruba/Swahili", "No MoMo / Paystack"],
                ours: "AiKOVA Africa languages + MoMo",
                accent: "from-[#7C4DFF] to-[#76FF03]",
              },
            ].map((row) => (
              <div key={row.vs} className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${row.accent} shadow-sm`} />
                    <div>
                      <div className="text-[13px] font-bold text-slate-400">VS</div>
                      <div className="text-[16px] font-bold text-slate-900">{row.vs}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[12px] font-bold text-slate-900">{row.price}</div>
                    <div className="text-[11px] text-slate-500">{row.scope}</div>
                  </div>
                </div>

                <div className="mx-5 rounded-[14px] bg-slate-50 p-4 ring-1 ring-slate-200">
                  {row.theirs.map((t) => (
                    <div key={t} className="flex items-center gap-2 py-1 text-[12px] text-slate-600">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-50 text-red-500 ring-1 ring-red-100">✕</span>
                      {t}
                    </div>
                  ))}
                </div>

                <div className="mt-3 p-5 pt-3">
                  <div className="flex items-center gap-2 rounded-[14px] bg-slate-900 px-4 py-3 text-white">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#76FF03] text-slate-900"><Check className="h-4 w-4" /></div>
                    <span className="text-[13px] font-bold">{row.ours}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT CONNECTS */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
          <div className="mx-auto max-w-[720px] text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-slate-500"><Workflow className="h-4 w-4" /> How it connects • data flow</div>
            <h2 className="mt-5 text-[32px] font-[700] leading-[0.95] tracking-[-0.02em] sm:text-[44px]">From voice to action in 1.8s.</h2>
            <p className="mt-3 text-[14px] leading-[1.6] text-slate-500">Whisper tuned for African accents → Language detect → Qdrant RAG → LLM router → Voice cloning → CRM. No black box.</p>
          </div>

          <div ref={flowRef.ref as any} className={`mt-12 transition-all duration-700 ${flowRef.visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
            {/* Desktop flow */}
            <div className="hidden overflow-x-auto lg:block">
              <div className="min-w-[1060px] rounded-[28px] border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                <div className="grid grid-cols-[repeat(8,1fr)] items-center gap-2">
                  {[
                    { icon: Phone, label: "Inbound", sub: "Call / IG / WA", color: "#00E5FF" },
                    { icon: Mic2, label: "Whisper STT", sub: "African accents 96%", color: "#2962FF" },
                    { icon: Languages, label: "Lang Detect", sub: "Yoruba/Swahili", color: "#7C4DFF" },
                    { icon: Database, label: "Qdrant RAG", sub: "GBP + Docs", color: "#2962FF" },
                    { icon: Cpu, label: "LLM Router", sub: "GPT-4o / Haiku", color: "#00E5FF" },
                    { icon: Waves, label: "TTS + Clone", sub: "Local voice mesh", color: "#76FF03" },
                    { icon: Zap, label: "Action", sub: "Book / Pay", color: "#2962FF" },
                    { icon: BarChart3, label: "CRM", sub: "Sheets/HubSpot", color: "#0F172A" },
                  ].map((step, idx, arr) => (
                    <React.Fragment key={step.label}>
                      <div className="flex flex-col items-center text-center">
                        <div className="flex h-[56px] w-[56px] items-center justify-center rounded-2xl bg-white shadow-[0_8px_20px_rgba(15,23,42,0.08)] ring-1 ring-slate-200" style={{ color: step.color }}>
                          <step.icon className="h-6 w-6" />
                        </div>
                        <div className="mt-3 text-[12px] font-bold text-slate-900">{step.label}</div>
                        <div className="mt-1 text-[11px] text-slate-500">{step.sub}</div>
                        {idx === 1 && <span className="mt-2 rounded-full bg-[#00E5FF]/15 px-2 py-1 text-[10px] font-bold text-slate-700">tuned</span>}
                        {idx === 5 && <span className="mt-2 rounded-full bg-[#76FF03]/20 px-2 py-1 text-[10px] font-bold text-slate-700">3-sec</span>}
                      </div>
                      {idx < arr.length - 1 && (
                        <div className="flex items-center justify-center">
                          <div className="h-[3px] w-full rounded-full" style={{ background: "var(--grad)" }} />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <div className="mt-8 grid grid-cols-3 gap-4">
                  <div className="rounded-xl bg-slate-900 p-4 text-white">
                    <div className="text-[11px] font-bold uppercase tracking-widest opacity-60">Observability</div>
                    <div className="mt-2 font-mono text-[11px] leading-[1.6]">trace_id: 7f3a • latency: 1.8s • cost: $0.021 • lang: yo-NG → en</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Stack</div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {["Africa's Talking", "Whisper", "Qdrant", "LangSmith", "Grafana"].map((s) => (
                        <span key={s} className="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-semibold ring-1 ring-slate-200">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-[#00E5FF]/10 via-[#2962FF]/10 to-[#76FF03]/10 p-4 ring-1 ring-slate-200">
                    <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Latency breakdown</div>
                    <div className="mt-2 flex gap-1">
                      {[
                        { w: "22%", c: "#00E5FF", l: "STT" },
                        { w: "18%", c: "#2962FF", l: "RAG" },
                        { w: "40%", c: "#7C4DFF", l: "LLM" },
                        { w: "20%", c: "#76FF03", l: "TTS" },
                      ].map((b) => (
                        <div key={b.l} style={{ width: b.w, background: b.c }} className="h-2 rounded-full" />
                      ))}
                    </div>
                    <div className="mt-2 flex gap-3 text-[10px] font-bold text-slate-500">
                      <span>STT 0.4s</span><span>RAG 0.3s</span><span>LLM 0.7s</span><span>TTS 0.4s</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile flow vertical */}
            <div className="lg:hidden">
              <div className="relative rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <div className="absolute left-[28px] top-[24px] bottom-[24px] w-[3px] rounded-full" style={{ background: "var(--grad-vert)" }} />
                <div className="space-y-4">
                  {[
                    { icon: Phone, label: "Inbound Call", sub: "Voice / WhatsApp / IG" },
                    { icon: Mic2, label: "Whisper STT (African accents)", sub: "Yoruba, Swahili, Pidgin" },
                    { icon: Database, label: "Qdrant RAG", sub: "Website + GBP + Docs" },
                    { icon: Cpu, label: "LLM Router", sub: "Action + answer" },
                    { icon: Waves, label: "TTS Voice Cloning", sub: "Mirrors dialect" },
                    { icon: CalendarCheck, label: "Booking → CRM", sub: "Sheets / HubSpot / Paystack" },
                  ].map((s) => (
                    <div key={s.label} className="relative flex gap-4 rounded-[16px] bg-white p-4 shadow-sm ring-1 ring-slate-200">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white"><s.icon className="h-5 w-5" /></div>
                      <div>
                        <div className="text-[13px] font-bold text-slate-900">{s.label}</div>
                        <div className="text-[11px] text-slate-500">{s.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section id="cta" className="bg-white pb-8">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[32px] p-[1px]" style={{ background: "var(--grad)" }}>
            <div className="relative rounded-[31px] px-8 py-12 sm:px-12 sm:py-16" style={{ background: "linear-gradient(100deg,#00E5FF 0%,#2962FF 55%,#1E3A8A 100%)" }}>
              <div className="absolute right-[-60px] top-[-60px] h-[280px] w-[280px] rounded-full bg-white/10 blur-[40px]" />
              <div className="absolute left-[-40px] bottom-[-40px] h-[200px] w-[200px] rounded-full bg-[#76FF03]/20 blur-[30px]" />

              <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white backdrop-blur">
                    <span className="h-2 w-2 rounded-full bg-[#76FF03] animate-pulse" /> No.1 Hero demo live
                  </div>
                  <h2 className="mt-4 text-[28px] font-[700] leading-[0.95] tracking-[-0.02em] text-white sm:text-[40px]">Ready to see these features live? Try No.1 Hero demo</h2>
                  <p className="mt-3 max-w-[520px] text-[14px] leading-[1.6] text-white/80">Click through the interactive hero we built — voice, IG comment → DM → booking, accent mesh. 90 seconds and you'll get it.</p>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <a href="/get-started" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-bold text-slate-900 shadow-[0_12px_24px_rgba(0,0,0,0.15)] transition hover:translate-y-[-1px]">
                      <Play className="h-4 w-4 fill-slate-900" /> Open No.1 Hero
                    </a>
                    <a href="/business" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-[14px] font-bold text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/15">
                      View No.3 Solutions <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                <div className="relative">
                  <div className="rounded-[20px] bg-white/10 p-4 backdrop-blur-xl ring-1 ring-white/20">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-white/70">
                      <span>Live inbox preview</span><span className="rounded-full bg-[#76FF03] px-2 py-1 text-[10px] text-slate-900">3 new</span>
                    </div>
                    <div className="mt-4 space-y-2">
                      {[
                        { ch: "IG", msg: "Price for braids tomorrow?", time: "2s ago", dot: "#E1306C" },
                        { ch: "WA", msg: "Clinic appointment • Hausa detected", time: "8s ago", dot: "#25D366" },
                        { ch: "Call", msg: "Yoruba Ibadan • booking confirmed", time: "14s ago", dot: "#00E5FF" },
                      ].map((m) => (
                        <div key={m.ch} className="flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 shadow-sm">
                          <span className="h-2 w-2 rounded-full" style={{ background: m.dot }} />
                          <span className="text-[11px] font-bold text-slate-900">{m.ch}</span>
                          <span className="flex-1 truncate text-[12px] text-slate-600">{m.msg}</span>
                          <span className="text-[10px] text-slate-400">{m.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 bg-white py-12">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-3">
                <img src={logoUrl} alt="AiKOVA" className="h-9 w-9 rounded-xl object-cover" />
                <span className="text-[18px] font-bold tracking-tight">AiKOVA</span>
              </div>
              <p className="mt-3 max-w-[320px] text-[13px] leading-[1.6] text-slate-500">AI receptionist for uncategorized Africa. Voice + WhatsApp + IG + Web. One brain. Any business. Built with Africa's Talking.</p>
              <div className="mt-4 flex gap-2">
                {["🇳🇬", "🇰🇪", "🇬🇭", "🇿🇦"].map((f) => (
                  <span key={f} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-[14px] ring-1 ring-slate-200">{f}</span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[12px] font-bold uppercase tracking-widest text-slate-400">11 Pages Journey</div>
              <div className="mt-4 grid gap-2 text-[13px]">
                {[
                  { n: "No.1 Hero", href: "/", highlight: true },
                  { n: "No.2 Features", href: "/features", active: true },
                  { n: "No.3 Solutions", href: "/solutions", highlight: true },
                  { n: "No.4 Languages", href: "/languages" },
                  { n: "No.5 Pricing", href: "/pricing" },
                  { n: "No.6 Demo", href: "/business" },
                  { n: "No.7 Social Proof", href: "/customers" },
                  { n: "No.8 Integrations", href: "/resources" },
                  { n: "No.9 Security", href: "/company" },
                  { n: "No.10 FAQ", href: "/resources" },
                  { n: "No.11 Final CTA", href: "/get-started" },
                ].map((l) => (
                  <a
                    key={l.n}
                    href={l.href}
                    className={`flex items-center gap-2 transition ${
                      (l as any).active
                        ? "font-bold text-slate-900"
                        : (l as any).highlight
                        ? "font-semibold text-slate-700 hover:text-slate-900"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {(l as any).active && <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--grad)" }} />}
                    {l.n}
                    {(l as any).highlight && ! (l as any).active && <span className="rounded-full bg-[#00E5FF]/10 px-2 py-0.5 text-[10px] font-bold text-slate-700">next</span>}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[12px] font-bold uppercase tracking-widest text-slate-400">Features index</div>
              <div className="mt-4 space-y-2 text-[13px] text-slate-500">
                <a href="#core" className="block hover:text-slate-900">Omnichannel Inbox</a>
                <a href="#core" className="block hover:text-slate-900">Business Agnostic Brain</a>
                <a href="#core" className="block hover:text-slate-900">Booking & CRM</a>
                <a href="#core" className="block hover:text-slate-900">Low-Bandwidth Mobile</a>
                <a href="#core" className="block hover:text-slate-900">Smart Handoff</a>
                <a href="#core" className="block hover:text-slate-900">Analytics</a>
              </div>
            </div>

            <div>
              <div className="text-[12px] font-bold uppercase tracking-widest text-slate-400">Built for Africa</div>
              <div className="mt-4 space-y-3">
                <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
                  <div className="text-[11px] font-bold text-slate-700">Low bandwidth • 2G • USSD • SMS fallback</div>
                  <div className="mt-1 text-[11px] text-slate-500">Works when others fail.</div>
                </div>
                <div className="rounded-xl bg-slate-900 p-3 text-white">
                  <div className="text-[11px] font-bold">Voice Mesh • IG → MoMo</div>
                  <div className="mt-1 text-[11px] opacity-70">The ice on cake features No.2 reveals.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 text-[11px] text-slate-400 sm:flex-row">
            <span>© 2025 AiKOVA • Built for uncategorized Africa • No.2 of 11 Marketing Pages</span>
            <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#76FF03]" /> Production-ready React • White theme • Infographic design</span>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 640px){
          h1{ letter-spacing: -0.04em }
        }
      `}</style>
    </div>
  );
}
