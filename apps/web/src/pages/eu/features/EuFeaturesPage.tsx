import React, { useEffect, useRef, useState } from "react";
import logoImg from "./assets/32d4f05ae5209978-image_6A9BA612-7186-480D-9D5C-7EF8BE2260B7.jpeg";
import infographicImg from "./assets/2db904ff2ed9ddfb-image_20261029_221319.webp";
import dashboardImg from "./assets/68c68abc873ff7ec-image_20261029_221321.webp";
import euroStreetImg from "./assets/164011d51a86ede9-image_20261029_213921.webp";
import ukStreetImg from "./assets/6b508a2736534e60-image_20261029_220349.webp";
import { startSetupUrl } from '../../../lib/setupFlow';

// --- helpers ---
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

type Assessment = {
  businessName: string;
  category: string;
  location: string;
  email: string;
  createdAt: string;
};

const INDUSTRIES = [
  {
    id: "restaurant",
    label: "Restaurant",
    count: "18k+ establishments",
    from: "The Garden Restaurant, London",
    to: "Le Jardin Bistro, Paris",
    copy: "Handles reservations in EN/FR/DE, dietary notes, no-show reduction via WhatsApp.",
    accent: "#2962FF",
  },
  {
    id: "cafe",
    label: "Cafe",
    count: "7.5k+ cafes",
    from: "Brew & Bean, High St",
    to: "Kaffeebar, Berlin",
    copy: "Flat White orders, loyalty stamps, coworking desk bookings, 1m12s avg response.",
    accent: "#00E5FF",
  },
  {
    id: "clinic",
    label: "Clinic",
    count: "4.2k+ clinics",
    from: "High Street Clinic, London",
    to: "Brightwell Clinic",
    copy: "NHS queries, GDPR triage, consent flows, right-to-erasure on request.",
    accent: "#012169",
  },
  {
    id: "salon",
    label: "Salon",
    count: "9k+ salons",
    from: "Bloom Salon",
    to: "Glow Salon",
    copy: "Balayage bookings via Instagram DM auto-reply, deposit via Stripe SEPA.",
    accent: "#76FF03",
  },
  {
    id: "retail",
    label: "Retail",
    count: "22k+ shops",
    from: "Fashion & Lifestyle",
    to: "High Street Markets",
    copy: "Click & collect, multilingual product Q&A, returns handling with GDPR log.",
    accent: "#2962FF",
  },
  {
    id: "professional",
    label: "Professional Services",
    count: "11k+ firms",
    from: "Legal · Accounting",
    to: "Consulting",
    copy: "Lead qualification in 12+ languages, call routing to right department, encrypted EU storage.",
    accent: "#012169",
  },
];

export default function EuFeaturesPage() {
  const [assessOpen, setAssessOpen] = useState(false);
  const [form, setForm] = useState({ businessName: "", category: "Restaurant", location: "London, UK", email: "" });
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState<number>(0);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  // reveal refs
  const heroRef = useReveal<HTMLDivElement>();
  const infographicRef = useReveal<HTMLDivElement>();
  const industriesRef = useReveal<HTMLDivElement>();
  const deepDiveRef = useReveal<HTMLDivElement>();

  useEffect(() => {
    // load assessments
    (async () => {
      try {
        const res = await fetch("actions", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ action: "records.list", args: { collection: "assessments", limit: 100 } }),
        });
        const j = await res.json();
        if (j.data) setAssessments(j.data.records || []);
      } catch {}
    })();
  }, []);

  const openAssess = () => setAssessOpen(true);

  const submitAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.businessName || !form.email) {
      setToast("Business name and email required");
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setBusy(true);
    try {
      const payload: Assessment = {
        businessName: form.businessName,
        category: form.category,
        location: form.location,
        email: form.email,
        createdAt: new Date().toISOString(),
      };
      const res = await fetch("actions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "records.create",
          args: {
            collection: "assessments",
            value: payload,
            idempotency_key: `assess-${form.email}-${form.businessName}`.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
          },
        }),
      });
      const j = await res.json();
      if (j.error) throw new Error(j.error);
      setSaved((s) => s + 1);
      setAssessments((a) => [j.data, ...a]);
      setToast(`Assessed • ${form.businessName} flagged for UK→EU rollout`);
      setAssessOpen(false);
      setForm({ businessName: "", category: "Restaurant", location: "London, UK", email: "" });
      setTimeout(() => setToast(null), 4000);
    } catch (err: any) {
      setToast(err.message || "Could not save");
      setTimeout(() => setToast(null), 4000);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      data-safe-area-inset-root
      style={{
        boxSizing: "border-box",
        paddingTop: "var(--safe-area-inset-top)",
        background: "#FFFFFF",
        minHeight: "100vh",
      }}
      className="w-full overflow-x-clip antialiased"
    >
      {/* NAV */}
      <header
        data-safe-area-sticky-top
        style={{ top: "var(--safe-area-inset-top)" }}
        className="sticky z-40 w-full bg-white/90 backdrop-blur-xl border-b border-[var(--border)]"
      >
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10 h-[72px] flex items-center justify-between">
          <a href="/eu" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 shadow-sm">
              <img src={logoImg} alt="Eurozone AI Logo" className="h-full w-full object-cover" />
            </div>
            <div className="leading-none">
              <div className="font-[700] tracking-tight text-[15px] text-slate-900" style={{ fontFamily: "Space Grotesk" }}>
                Eurozone<span className="font-light">AI</span>
              </div>
              <div className="mono text-[10px] tracking-[0.14em] uppercase text-slate-500 -mt-[1px]">UK → EU • Reception</div>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-7">
            <a href="/eu/features" className="group relative text-[14px] font-medium text-slate-900">
              <span className="inline-flex items-center gap-1.5">
                Features <span className="text-[14px]">🇬🇧</span>
              </span>
              <span className="absolute -bottom-1 left-0 h-[2px] w-full bg-slate-900" />
            </a>
            <a href="/eu/solutions" className="text-[14px] text-slate-500 hover:text-slate-900 transition">Solutions</a>
            <a href="/eu/languages" className="text-[14px] text-slate-500 hover:text-slate-900 transition">Languages</a>
            <a href="/eu/pricing" className="text-[14px] text-slate-500 hover:text-slate-900 transition">Pricing</a>
            <a href="#dashboard" className="text-[14px] text-slate-500 hover:text-slate-900 transition">Dashboard</a>
            <span className="h-5 w-px bg-slate-200" />
            <div className="flex items-center gap-2 mono text-[11px] text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              GDPR • EU HOSTED
            </div>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={openAssess}
              id="assess-button-main-hero"
              className="h-10 px-4 sm:px-5 rounded-full bg-slate-900 text-white text-[13.5px] font-medium tracking-tight hover:bg-black transition shadow-[0_4px_16px_-6px_rgba(0,0,0,0.3)]"
            >
              Assess business
            </button>
            <div className="lg:hidden h-10 w-10 grid place-items-center rounded-full border border-slate-200 bg-white">
              <div className="space-y-1">
                <div className="h-[2px] w-4 bg-slate-800 rounded" />
                <div className="h-[2px] w-4 bg-slate-800 rounded" />
                <div className="h-[2px] w-3 bg-slate-800 rounded" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section ref={heroRef.ref as any} className="relative overflow-x-clip">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC] via-white to-white" />
          <div className="absolute top-0 right-0 w-[60vw] h-[50vh] bg-gradient-to-br from-[#00E5FF]/10 via-[#2962FF]/8 to-[#76FF03]/10 blur-[80px] rounded-full" />
          <div className="absolute -left-20 top-[30%] w-[40vw] h-[40vh] bg-[#012169]/[0.04] blur-[60px] rounded-full" />
        </div>

        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10 pt-10 sm:pt-16 pb-10 sm:pb-14">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-12 items-start">
            {/* left copy */}
            <div className={`reveal ${heroRef.visible ? "is-visible" : ""} pt-2`}>
              <div className="inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 shadow-sm">
                <span className="h-5 w-5 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#2962FF] grid place-items-center text-[10px] text-white font-bold">✓</span>
                <span className="mono text-[11px] tracking-wide text-slate-600">Features • Built for UK & EU Compliance</span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400">• London → Paris → Berlin</span>
              </div>

              <h1 className="mt-6 text-[32px] sm:text-[46px] lg:text-[56px] leading-[0.96] tracking-[-0.03em] font-[700] text-slate-900">
                AI Receptionist that speaks
                <br />
                <span className="grad-text">12+ languages.</span>
                <br />
                GDPR ready.
              </h1>

              <p className="mt-5 text-[16px] sm:text-[17px] leading-[1.6] text-slate-600 max-w-[52ch]">
                From <span className="text-slate-900 font-medium">The Garden Restaurant London</span> to{" "}
                <span className="text-slate-900 font-medium">Le Jardin Bistro Paris</span> — handles bookings, calls, DMs,
                voicemails and calendar. Encrypted, EU-hosted in Frankfurt, with Right to Erasure built-in.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a href={startSetupUrl("eurozone")}
                  
                  className="h-[46px] px-6 rounded-full bg-slate-900 text-white text-[14px] font-medium hover:bg-black transition flex items-center gap-2"
                >Start free trial
                  <span className="h-6 w-6 rounded-full bg-white/15 grid place-items-center">→</span>
                </a>
                <a href="/eu/features" className="h-[46px] px-6 rounded-full border border-slate-200 bg-white text-slate-700 text-[14px] font-medium hover:border-slate-300 transition grid place-items-center">
                  See features infographic
                </a>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3 mono text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 border border-slate-200 px-3 py-1.5">
                  <span className="h-2 w-2 rounded-full bg-slate-900" /> Works with Twilio
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 border border-slate-200 px-3 py-1.5">Stripe SEPA</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-emerald-800">GDPR Compliant</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-3 py-1.5 text-blue-800">EU Data Storage • Frankfurt</span>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-3 max-w-[520px]">
                {[
                  { k: "20", v: "New conversations / day", sub: "Today" },
                  { k: "7", v: "Bookings auto-synced", sub: "Calendar" },
                  { k: "1m12s", v: "Avg response", sub: "-32s vs manual" },
                ].map((s) => (
                  <div key={s.k} className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-[var(--shadow-card)]">
                    <div className="text-[20px] font-bold tracking-tight text-slate-900" style={{ fontFamily: "Space Grotesk" }}>
                      {s.k}
                    </div>
                    <div className="mono text-[10px] text-slate-500 uppercase tracking-wide mt-0.5">{s.sub}</div>
                    <div className="text-[12px] leading-[1.3] text-slate-600 mt-1">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* right visual - dashboard */}
            <div className={`reveal reveal-delay-1 ${heroRef.visible ? "is-visible" : ""} relative`}>
              <div className="relative rounded-[28px] overflow-hidden border border-slate-200 bg-white shadow-[var(--shadow-elevated)]">
                <div className="absolute top-0 inset-x-0 h-[4px] bg-gradient-to-r from-[#00E5FF] via-[#2962FF] to-[#76FF03]" />
                <div className="p-3 sm:p-4">
                  <div className="flex items-center justify-between px-1 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
                      <span className="ml-2 mono text-[11px] text-slate-500">European AI Receptionist Dashboard • Live Connected</span>
                    </div>
                    <span className="mono text-[10px] px-2 py-1 rounded-full bg-slate-900 text-white">UK GMT+1 • OCT 2024</span>
                  </div>

                  <div className="rounded-[18px] overflow-hidden border border-slate-200">
                    <img src={dashboardImg} alt="European AI Receptionist Dashboard showing live bookings and messages with Union Jack keyring and flat white coffee" className="w-full h-auto object-cover" />
                  </div>

                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { label: "Phone • Voicemail", value: "3 missed → transcribed" },
                      { label: "WhatsApp", value: "12 new • auto-reply" },
                      { label: "Instagram", value: "5 DMs • 2 leads" },
                      { label: "Booking Calendar", value: "7 bookings • synced" },
                    ].map((it) => (
                      <div key={it.label} className="rounded-xl bg-[#F8FAFC] border border-slate-200 p-2.5">
                        <div className="mono text-[10px] uppercase tracking-wide text-slate-500">{it.label}</div>
                        <div className="text-[12px] font-medium text-slate-800 mt-1 leading-tight">{it.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* floating badges */}
              <div className="absolute -left-3 sm:-left-6 top-[18%] rounded-2xl bg-white border border-slate-200 shadow-[var(--shadow-card)] px-3.5 py-2.5 flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-400 grid place-items-center text-white text-[12px]">🇬🇧</div>
                <div>
                  <div className="mono text-[10px] text-slate-500 uppercase">Active</div>
                  <div className="text-[12px] font-semibold text-slate-900 -mt-0.5">Union Jack keyring • Owner in cafe</div>
                </div>
              </div>

              <div className="absolute -right-2 sm:-right-4 bottom-[18%] rounded-2xl bg-slate-900 text-white px-4 py-3 shadow-[var(--shadow-elevated)]">
                <div className="mono text-[10px] opacity-70">UPCOMING • 18 OCT</div>
                <div className="text-[12px] font-medium mt-1">Haircut • Olivia M • Instagram</div>
                <div className="text-[11px] opacity-70 mt-0.5">Consultation • James P • Phone</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INFOGRAPHIC CORE */}
      <section id="features" ref={infographicRef.ref as any} className="relative bg-[#F8FAFC] border-y border-slate-200">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10 py-12 sm:py-20">
          <div className={`reveal ${infographicRef.visible ? "is-visible" : ""} flex flex-col items-center text-center max-w-3xl mx-auto`}>
            <div className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3 py-1 shadow-sm mono text-[11px] text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2962FF]" />
              Eurozone Business Features • UK Flag-Off to EU
            </div>
            <h2 className="mt-4 text-[28px] sm:text-[40px] leading-[1.05] tracking-tight font-bold text-slate-900">
              The infographic is the spec.
              <br />
              <span className="text-slate-500 font-[500]">AI Receptionist • GDPR • Multilingual</span>
            </h2>
            <p className="mt-3 text-[15px] leading-[1.6] text-slate-600">
              Built from the original Eurozone infographic: Union Jack + EU flag header, three columns, industries footer.
              Everything below expands that single source of truth.
            </p>
          </div>

          {/* centerpiece white card */}
          <div className={`reveal reveal-delay-1 ${infographicRef.visible ? "is-visible" : ""} mt-10 sm:mt-14`}>
            <div className="relative mx-auto max-w-[1080px] rounded-[28px] bg-white border border-slate-200 shadow-[var(--shadow-infographic)] overflow-hidden p-2 sm:p-3">
              <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#012169] via-[#2962FF] to-[#76FF03]" />
              <div className="rounded-[20px] overflow-hidden border border-slate-100 bg-white">
                <img src={infographicImg} alt="Eurozone Business Features infographic with AI Receptionist Features, GDPR Compliant, Multilingual, Built for Eurozone Industries Restaurant Cafe Clinic Salon" className="w-full h-auto object-contain" />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 bg-[#F8FAFC] border-t border-slate-100">
                <div className="mono text-[11px] text-slate-500 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#012169]" />
                  Source file • /mnt/data/resource/image_20261029_221319.webp • White card • Soft shadow
                </div>
                <div className="flex items-center gap-2">
                  <span className="mono text-[10px] px-2 py-1 rounded-full bg-slate-900 text-white">Seamless Secure Scalable</span>
                  <span className="mono text-[10px] px-2 py-1 rounded-full border border-slate-200 bg-white">Designed for UK & EU compliance</span>
                </div>
              </div>
            </div>
          </div>

          {/* three detailed columns */}
          <div className="mt-12 sm:mt-16 grid md:grid-cols-3 gap-6">
            {/* col 1 */}
            <div className={`reveal ${infographicRef.visible ? "is-visible" : ""} rounded-[22px] bg-white border border-slate-200 p-6 shadow-[var(--shadow-card)]`}>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#2962FF]/10 border border-[#2962FF]/15 grid place-items-center text-[#2962FF]">✦</div>
                <div>
                  <div className="mono text-[11px] tracking-wide uppercase text-slate-500">Column 1</div>
                  <div className="text-[16px] font-semibold text-slate-900 -mt-0.5">AI Receptionist Features</div>
                </div>
              </div>
              <div className="mt-5 space-y-4">
                {[
                  { t: "24/7 Availability", d: "Never miss a call – London to Berlin coverage" },
                  { t: "Call Handling & Booking", d: "Appointments automated, deposits via Stripe SEPA" },
                  { t: "Smart Call Routing", d: "Direct to right team / department with context" },
                  { t: "Voice & Chat", d: "Natural conversation AI – phone, WhatsApp, Instagram" },
                ].map((f) => (
                  <div key={f.t} className="flex gap-3">
                    <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-[#2962FF] text-white grid place-items-center text-[11px]">✓</span>
                    <div>
                      <div className="text-[13.5px] font-semibold text-slate-900 leading-tight">{f.t}</div>
                      <div className="text-[12.5px] text-slate-600 mt-0.5 leading-[1.4]">{f.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* col 2 */}
            <div className={`reveal reveal-delay-1 ${infographicRef.visible ? "is-visible" : ""} rounded-[22px] bg-white border border-slate-200 p-6 shadow-[var(--shadow-card)]`}>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-200 grid place-items-center text-emerald-700">🛡</div>
                <div>
                  <div className="mono text-[11px] tracking-wide uppercase text-slate-500">Column 2</div>
                  <div className="text-[16px] font-semibold text-slate-900 -mt-0.5">GDPR Compliant</div>
                </div>
              </div>
              <div className="mt-5 space-y-4">
                {[
                  { t: "Data Encrypted & Secure", d: "End-to-end encryption at rest & in transit" },
                  { t: "EU Data Storage", d: "Hosted in EU region – Frankfurt, GDPR residency" },
                  { t: "Consent Management", d: "GDPR compliant flows, granular opt-in logs" },
                  { t: "Right to Erasure", d: "Data deletion on request – 72h SLA, audit trail" },
                ].map((f) => (
                  <div key={f.t} className="flex gap-3">
                    <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-emerald-600 text-white grid place-items-center text-[11px]">✓</span>
                    <div>
                      <div className="text-[13.5px] font-semibold text-slate-900 leading-tight">{f.t}</div>
                      <div className="text-[12.5px] text-slate-600 mt-0.5 leading-[1.4]">{f.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* col 3 */}
            <div className={`reveal reveal-delay-2 ${infographicRef.visible ? "is-visible" : ""} rounded-[22px] bg-white border border-slate-200 p-6 shadow-[var(--shadow-card)]`}>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 grid place-items-center text-[#012169]">◍</div>
                <div>
                  <div className="mono text-[11px] tracking-wide uppercase text-slate-500">Column 3</div>
                  <div className="text-[16px] font-semibold text-slate-900 -mt-0.5">Multilingual</div>
                </div>
              </div>
              <div className="mt-5 space-y-4">
                {[
                  { t: "Supports 12+ Languages", d: "English, French, German, Spanish, Italian, Polish, Dutch..." },
                  { t: "Real-time Translation", d: "Localised responses, context-aware slang" },
                  { t: "Regional Accents", d: "Natural UK & EU voices – London, Paris, Berlin intonation" },
                ].map((f) => (
                  <div key={f.t} className="flex gap-3">
                    <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-slate-900 text-white grid place-items-center text-[11px]">✓</span>
                    <div>
                      <div className="text-[13.5px] font-semibold text-slate-900 leading-tight">{f.t}</div>
                      <div className="text-[12.5px] text-slate-600 mt-0.5 leading-[1.4]">{f.d}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div id="languages" className="mt-6 rounded-xl bg-[#F8FAFC] border border-slate-200 p-3 flex flex-wrap gap-1.5">
                {["EN","FR","DE","ES","IT","PL","NL","PT","EL","SV","DA","RO"].map((l) => (
                  <span key={l} className="mono text-[10px] px-2 py-1 rounded-full bg-white border border-slate-200">
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INDUSTRIES SHOWCASE */}
      <section id="industries" ref={industriesRef.ref as any} className="relative">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10 py-14 sm:py-20">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-end">
            <div className={`reveal ${industriesRef.visible ? "is-visible" : ""}`}>
              <div className="mono text-[11px] tracking-[0.14em] uppercase text-slate-500 flex items-center gap-2">
                <span className="h-px w-8 bg-slate-300" /> Built for Eurozone Industries
              </div>
              <h2 className="mt-3 text-[30px] sm:text-[38px] leading-[1.05] tracking-tight font-bold text-slate-900">
                Same 6 categories as
                <br />
                UK high street.
              </h2>
              <p className="mt-3 text-[15px] leading-[1.6] text-slate-600 max-w-[44ch]">
                Visual proof: UK high street bunting → European boulevard. The same playbook for The Garden Restaurant,
                Brew & Bean Cafe, High Street Clinic, Bloom Salon – now scaled to Paris, Berlin, EU.
              </p>

              <div className="mt-6 flex gap-3">
                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-[var(--shadow-card)] w-[48%]">
                  <img src={ukStreetImg} alt="UK High Street with The Garden Restaurant, Brew and Bean Cafe, High Street Clinic, Bloom Salon and Union Jack bunting" className="w-full h-[160px] sm:h-[190px] object-cover" />
                  <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center justify-between">
                    <span className="mono text-[10px] text-slate-500">UK High Street • Proof</span>
                    <span className="text-[11px]">🇬🇧</span>
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-[var(--shadow-card)] w-[52%]">
                  <img src={euroStreetImg} alt="European businesses street with Restaurant Paris Le Jardin Bistro, Cafe Berlin Kaffeebar, Clinic London Brightwell, Salon Glow" className="w-full h-[160px] sm:h-[190px] object-cover" />
                  <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center justify-between">
                    <span className="mono text-[10px] text-slate-500">EU Boulevard • Paris • Berlin • London</span>
                    <span className="text-[11px]">🇪🇺</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={`reveal reveal-delay-1 ${industriesRef.visible ? "is-visible" : ""} grid sm:grid-cols-2 gap-4`}>
              {INDUSTRIES.map((cat, idx) => (
                <div
                  key={cat.id}
                  style={{ transitionDelay: `${idx * 0.06}s` }}
                  className={`reveal ${industriesRef.visible ? "is-visible" : ""} group rounded-[20px] bg-white border border-slate-200 p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] hover:-translate-y-[2px] transition-all`}
                >
                  <div className="flex items-start justify-between">
                    <div className="h-10 w-10 rounded-xl border grid place-items-center text-[16px]" style={{ background: `${cat.accent}10`, borderColor: `${cat.accent}20`, color: cat.accent }}>
                      {cat.id === "restaurant" ? "◐" : cat.id === "cafe" ? "☕" : cat.id === "clinic" ? "✚" : cat.id === "salon" ? "✦" : cat.id === "retail" ? "◧" : "◎"}
                    </div>
                    <span className="mono text-[10px] px-2 py-1 rounded-full bg-[#F8FAFC] border border-slate-200 text-slate-600">{cat.count}</span>
                  </div>
                  <div className="mt-4">
                    <div className="text-[16px] font-semibold text-slate-900 tracking-tight">{cat.label}</div>
                    <div className="mt-1 mono text-[11px] text-slate-500 leading-[1.4]">
                      {cat.from} → {cat.to}
                    </div>
                    <div className="mt-2 text-[13px] leading-[1.5] text-slate-600">{cat.copy}</div>
                  </div>
                  <div className="mt-4 h-px bg-gradient-to-r from-slate-200 via-slate-100 to-transparent" />
                  <div className="mt-3 flex items-center gap-2 text-[11px] mono text-slate-500">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: cat.accent }} />
                    Handles {cat.label.toLowerCase()} in EN/FR/DE + GDPR
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE DEEP DIVE - DASHBOARD */}
      <section id="dashboard" ref={deepDiveRef.ref as any} className="bg-slate-900 text-white relative overflow-x-clip">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#012169] via-slate-900 to-[#0F172A]" />
          <div className="absolute -top-20 -right-20 w-[60vw] h-[60vh] bg-gradient-to-br from-[#00E5FF]/20 to-[#2962FF]/20 blur-[100px] rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-[50vw] h-[50vh] bg-[#76FF03]/10 blur-[90px] rounded-full" />
        </div>

        <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10 py-14 sm:py-20">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 sm:gap-12 items-start">
            <div className={`reveal ${deepDiveRef.visible ? "is-visible" : ""}`}>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 mono text-[11px] text-white/70">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Feature Deep Dive • Live Connected • October 2024
              </div>
              <h2 className="mt-5 text-[28px] sm:text-[42px] leading-[1.02] tracking-tight font-bold">
                Dashboard that a cafe owner
                <br />
                <span className="text-white/50">actually uses.</span>
              </h2>

              <div className="mt-8 grid sm:grid-cols-2 gap-3">
                {[
                  { icon: "☎", title: "Phone Connected", desc: "3 missed calls → Voicemail transcribed • Smart routing to owner or team" },
                  { icon: "💬", title: "WhatsApp • 12 new", desc: "Auto-reply enabled • Flat white order parsed • Booking intent captured" },
                  { icon: "◑", title: "Instagram • 5 DMs", desc: "Lead captured 2 • Balayage enquiry • Bloom Salon auto-reply with calendar link" },
                  { icon: "◒", title: "Booking Calendar Synced", desc: "7 bookings • Next 14:30 Haircut • 2-way sync with Google Calendar" },
                  { icon: "🌐", title: "Multilingual EN/FR/DE/ES", desc: "Auto translation enabled • Regional accents • Local slang understood" },
                  { icon: "🔒", title: "GDPR Compliant", desc: "Data encrypted • EU region Frankfurt • Consent logs • Right to erasure" },
                ].map((f) => (
                  <div key={f.title} className="rounded-2xl bg-white/[0.06] border border-white/10 p-4 backdrop-blur">
                    <div className="flex gap-3">
                      <div className="h-9 w-9 rounded-xl bg-white/10 border border-white/10 grid place-items-center text-[14px]">{f.icon}</div>
                      <div>
                        <div className="text-[13.5px] font-semibold">{f.title}</div>
                        <div className="text-[12.5px] leading-[1.5] text-white/60 mt-1">{f.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-white text-slate-900 p-5 border border-white/20 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="mono text-[11px] uppercase tracking-wide text-slate-500">Today's Summary • Live</div>
                  <div className="mono text-[10px] px-2 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">All systems operational • London UK GMT+1</div>
                </div>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { k: "20", label: "New Conversations", delta: "+8 from yesterday" },
                    { k: "7", label: "Bookings Scheduled", delta: "+2" },
                    { k: "1m12s", label: "Response Time", delta: "-32s avg" },
                    { k: "96%", label: "AI Confidence", delta: "Stable" },
                  ].map((m) => (
                    <div key={m.label}>
                      <div className="text-[22px] font-bold tracking-tight" style={{ fontFamily: "Space Grotesk" }}>
                        {m.k}
                      </div>
                      <div className="text-[12px] font-medium text-slate-700 mt-0.5">{m.label}</div>
                      <div className="mono text-[11px] text-slate-500 mt-0.5">{m.delta}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex gap-2">
                  <div className="h-1.5 flex-1 rounded-full bg-gradient-to-r from-[#00E5FF] via-[#2962FF] to-[#76FF03]" />
                </div>
                <div className="mt-3 flex flex-wrap gap-2 mono text-[10px] text-slate-500">
                  <span>Upcoming: 18 Friday Haircut Olivia M • Instagram</span>
                  <span>•</span>
                  <span>Consultation James P</span>
                  <span>•</span>
                  <span>Phone follow-up +44 7700 900123</span>
                </div>
              </div>
            </div>

            <div className={`reveal reveal-delay-1 ${deepDiveRef.visible ? "is-visible" : ""} relative`}>
              <div className="rounded-[26px] overflow-hidden border border-white/10 bg-white p-2 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.5)]">
                <img src={dashboardImg} alt="European AI Receptionist Dashboard detail showing to-dos October 2024 and Union Jack keyring" className="w-full h-auto rounded-[18px] object-cover" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
                  <div className="mono text-[10px] uppercase text-white/50">TO-DOs • October 2024</div>
                  <div className="mt-2 space-y-2 text-[12px] text-white/80">
                    <div className="flex gap-2">
                      <span className="text-emerald-400">✓</span> Confirm 14:30 haircut • Olivia
                    </div>
                    <div className="flex gap-2">
                      <span className="text-white/40">○</span> Follow-up call • James P • +44...
                    </div>
                    <div className="flex gap-2">
                      <span className="text-white/40">○</span> GDPR erasure request • 72h
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl bg-[#76FF03] text-slate-900 p-4">
                  <div className="mono text-[10px] uppercase opacity-60">Real Owner Moment</div>
                  <div className="mt-1 text-[13px] font-semibold leading-tight">Man in cafe with laptop, flat white coffee, Union Jack keyring – managing bookings between sips.</div>
                  <div className="mt-2 mono text-[11px] opacity-70">Image speaks more than copy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPLIANCE BANNER */}
      <section className="relative border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10 py-6 sm:py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-slate-900 text-white grid place-items-center font-bold text-[12px]">✓</div>
              <div>
                <div className="mono text-[11px] uppercase tracking-[0.14em] text-slate-500">Compliance • Seamless Secure Scalable</div>
                <div className="text-[14px] font-medium text-slate-900">Designed for UK & EU compliance • GDPR • EU AI Act • ePrivacy • Data residency</div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 mono text-[11px]">
              <span className="px-3 py-1.5 rounded-full bg-slate-900 text-white">GDPR</span>
              <span className="px-3 py-1.5 rounded-full border border-slate-200 bg-white">EU AI Act</span>
              <span className="px-3 py-1.5 rounded-full border border-slate-200 bg-white">ePrivacy</span>
              <span className="px-3 py-1.5 rounded-full border border-slate-200 bg-white">Frankfurt • EU Storage</span>
              <span className="px-3 py-1.5 rounded-full bg-[#012169] text-white">UK Flag-Off 🇬🇧 → EU 🇪🇺</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA GRADIENT */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF] via-[#2962FF] to-[#76FF03]" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10" />
        <div className="absolute -right-20 top-0 w-[50vw] h-full bg-white/15 blur-[50px] rounded-full" />

        <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10 py-12 sm:py-16">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/20 px-3 py-1 mono text-[11px] text-white">
                <span>🇬🇧 UK flag-off to Eurozone</span>
                <span className="opacity-60">•</span>
                <span>1M+ businesses • Central London N/S/E/W</span>
              </div>
              <h2 className="mt-4 text-[28px] sm:text-[40px] leading-[0.95] tracking-tight font-bold text-slate-900">
                Assess your business –
                <br />
                <span className="text-white">UK flag-off to Eurozone</span>
              </h2>
              <p className="mt-3 text-[15px] leading-[1.6] text-slate-900/70 max-w-[50ch]">
                We map your high street presence – Garden Restaurant, Brew & Bean, High Street Clinic, Bloom Salon –
                and generate your EU rollout playbook in 24h. GDPR-ready, multilingual, proven.
              </p>
              <div className="mt-2 mono text-[11px] text-slate-900/60">
                {assessments.length > 0 ? `${assessments.length} businesses assessed • Last: ${assessments[0]?.value?.businessName || "–"}` : `${saved} assessed in this session`}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 lg:justify-end">
              <a
                href={startSetupUrl("eurozone")}
                id="assess-button-main-hero-bottom"
                className="h-[52px] px-7 rounded-full bg-slate-900 text-white text-[14.5px] font-semibold tracking-tight hover:bg-black transition shadow-[0_8px_24px_-8px_rgba(0,0,0,0.4)] flex items-center justify-center gap-2"
              >
                Start free trial • 2 min
                <span className="h-6 w-6 rounded-full bg-white text-slate-900 grid place-items-center text-[12px]">→</span>
              </a>
              <a href="/eu/features" className="h-[52px] px-7 rounded-full bg-white text-slate-900 text-[14.5px] font-medium border border-slate-900/10 hover:bg-slate-50 transition grid place-items-center">
                View infographic source
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0F172A] text-white border-t border-white/10">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10 py-12 sm:py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr] gap-10">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl overflow-hidden border border-white/10">
                  <img src={logoImg} alt="Eurozone AI Logo" className="h-full w-full object-cover" />
                </div>
                <div>
                  <div className="font-bold text-[15px]" style={{ fontFamily: "Space Grotesk" }}>
                    EurozoneAI • Features No.2
                  </div>
                  <div className="mono text-[11px] text-white/50">UK Flag-Off • White theme • Production ready</div>
                </div>
              </div>
              <p className="mt-4 text-[13px] leading-[1.6] text-white/60 max-w-[36ch]">
                From London Business Hub to Le Jardin Bistro Paris – AI receptionist for restaurant, cafe, clinic, salon,
                retail, professional services. Twilio • Stripe SEPA • GDPR • EU hosted.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="mono text-[10px] px-2.5 py-1 rounded-full bg-white/10 border border-white/10">1M+ businesses</span>
                <span className="mono text-[10px] px-2.5 py-1 rounded-full bg-white/10 border border-white/10">Central London N/S/E/W</span>
                <span className="mono text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/20 text-emerald-200">GDPR ready</span>
              </div>
            </div>

            <div>
              <div className="mono text-[11px] uppercase tracking-wide text-white/40">Eurozone Pages</div>
              <div className="mt-4 space-y-2.5 text-[13.5px] text-white/70">
                <div><a href="/eu" className="hover:text-white transition">No.1 Home • UK Hub</a></div>
                <div><a href="/eu/features" className="text-white font-medium">No.2 Features • EU 🇬🇧 Active</a></div>
                <div><a href="/eu/solutions" className="hover:text-white transition">No.3 Solutions • Industries</a></div>
                <div><a href="/eu/languages" className="hover:text-white transition">No.4 Languages • 12+ 🇪🇺</a></div>
                <div><a href="/eu/pricing" className="hover:text-white transition">No.5 Pricing • SEPA</a></div>
                <div><a href="/eu/demo" className="hover:text-white transition">No.6 Demo • Live Dashboard</a></div>
              </div>
            </div>

            <div>
              <div className="mono text-[11px] uppercase tracking-wide text-white/40">Business Categories</div>
              <div className="mt-4 space-y-2 text-[13px] text-white/60">
                <div>Restaurant • 18k+</div>
                <div>Cafe • 7.5k+ • Flat White</div>
                <div>Clinic • GDPR Triage</div>
                <div>Salon • Instagram DM</div>
                <div>Retail • Fashion Markets</div>
                <div>Professional • Legal/Accounting</div>
              </div>
            </div>

            <div>
              <div className="mono text-[11px] uppercase tracking-wide text-white/40">Trust & Proof</div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl overflow-hidden border border-white/10">
                  <img src={ukStreetImg} alt="UK High Street proof" className="w-full h-[84px] object-cover opacity-80" />
                </div>
                <div className="rounded-xl overflow-hidden border border-white/10">
                  <img src={euroStreetImg} alt="EU street proof" className="w-full h-[84px] object-cover opacity-80" />
                </div>
              </div>
              <div className="mt-3 rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="mono text-[10px] text-white/40 uppercase">Latest Assess</div>
                <div className="text-[12px] text-white/80 mt-1">
                  {assessments[0]?.value ? `${assessments[0].value.businessName} • ${assessments[0].value.category} • ${assessments[0].value.location}` : "No assessments yet – be first to flag UK→EU"}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 mono text-[11px] text-white/40">
            <span>© EurozoneAI • Features Page No.2 • White #FFFFFF • Alt #F8FAFC • Slate #0F172A • UK Blue #012169 • Gradient #00E5FF→#2962FF→#76FF03 • Production-ready • Images speak</span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> EU Data Storage • Frankfurt • GDPR • No print button
            </span>
          </div>
        </div>
      </footer>

      {/* ASSESS MODAL */}
      {assessOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setAssessOpen(false)} />
          <div className="relative w-full sm:max-w-[520px] m-0 sm:m-6 rounded-t-[28px] sm:rounded-[24px] bg-white border border-slate-200 shadow-[var(--shadow-elevated)] overflow-hidden animate-[slideIn_0.5s_cubic-bezier(0.16,1,0.3,1)]">
            <div className="h-[4px] w-full bg-gradient-to-r from-[#00E5FF] via-[#2962FF] to-[#76FF03]" />
            <div className="p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mono text-[11px] uppercase tracking-wide text-slate-500">Assess • UK Flag-Off to Eurozone 🇬🇧→🇪🇺</div>
                  <h3 className="mt-1 text-[22px] font-bold tracking-tight text-slate-900">Map your high street to EU boulevard</h3>
                  <p className="mt-1 text-[13px] leading-[1.5] text-slate-600">2 min • We check category, GDPR, language fit, and generate playbook.</p>
                </div>
                <button onClick={() => setAssessOpen(false)} className="h-8 w-8 rounded-full border border-slate-200 grid place-items-center text-slate-500 hover:bg-slate-50">
                  ✕
                </button>
              </div>

              <form onSubmit={submitAssessment} className="mt-6 space-y-4">
                <div>
                  <label className="mono text-[11px] uppercase text-slate-500">Business name</label>
                  <input
                    value={form.businessName}
                    onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                    placeholder="The Garden Restaurant, Brew & Bean..."
                    className="mt-1.5 w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-[14px] outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mono text-[11px] uppercase text-slate-500">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="mt-1.5 w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-[14px] outline-none focus:border-slate-900"
                    >
                      {INDUSTRIES.map((i) => (
                        <option key={i.id} value={i.label}>
                          {i.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mono text-[11px] uppercase text-slate-500">Location</label>
                    <input
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      placeholder="London, Paris, Berlin..."
                      className="mt-1.5 w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-[14px] outline-none focus:border-slate-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="mono text-[11px] uppercase text-slate-500">Work email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="owner@brewbean.co.uk"
                    className="mt-1.5 w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-[14px] outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>

                <div className="rounded-xl bg-[#F8FAFC] border border-slate-200 p-3 flex gap-2.5">
                  <span className="h-6 w-6 rounded-full bg-slate-900 text-white grid place-items-center text-[11px]">✓</span>
                  <div className="text-[12px] leading-[1.4] text-slate-600">
                    GDPR • EU storage Frankfurt • Consent logs • Right to erasure • <span className="font-medium text-slate-900">Images speak</span> – your data stays in EU.
                  </div>
                </div>

                <button
                  disabled={busy}
                  className="w-full h-12 rounded-full bg-slate-900 text-white text-[14px] font-medium hover:bg-black transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {busy ? "Assessing..." : "Assess business • Generate EU playbook"}
                  <span className="h-6 w-6 rounded-full bg-white/15 grid place-items-center">→</span>
                </button>

                <div className="mono text-[10px] text-center text-slate-400">
                  {assessments.length} assessed • Includes Garden Restaurant, Brew & Bean, High Street Clinic, Bloom Salon proof
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[120] rounded-full bg-slate-900 text-white px-5 py-3 text-[13px] shadow-[var(--shadow-elevated)] flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          {toast}
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateY(16px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
