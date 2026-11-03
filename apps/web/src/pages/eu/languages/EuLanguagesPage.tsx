import { useEffect, useRef, useState } from "react";
import { startSetupUrl } from "../../../lib/setupFlow";
import logoUrl from "./assets/32d4f05ae5209978-image_6A9BA612-7186-480D-9D5C-7EF8BE2260B7.jpeg";
import cafeUrl from "./assets/4530171039d0aad5-image_20261029_222427.webp";
import mapLanguagesUrl from "./assets/20ac78def055c22d-image_20261029_222429.webp";
import voiceMeshUrl from "./assets/e574b16a7bc6cccf-image_20261029_222430.webp";

type Assessment = {
  company: string;
  email: string;
  language: string;
};

const LANGUAGES = [
  { flag: "🇬🇧", name: "UK English", speakers: "~67M", region: "United Kingdom", family: "Germanic", phrase: "How can I help?", note: "Global lingua franca", color: "#012169" },
  { flag: "🇫🇷", name: "French", speakers: "~67M", region: "France", family: "Romance", phrase: "Bonjour, comment puis-je aider?", note: "EU institutional core", color: "#2962FF" },
  { flag: "🇩🇪", name: "German", speakers: "~76M", region: "Germany", family: "Germanic", phrase: "Wie kann ich helfen?", note: "Most spoken native in EU", color: "#0F172A" },
  { flag: "🇪🇸", name: "Spanish", speakers: "~47M", region: "Spain", family: "Romance", phrase: "¿En qué puedo ayudar?", note: "2nd global native", color: "#EF4444" },
  { flag: "🇮🇹", name: "Italian", speakers: "~59M", region: "Italy", family: "Romance", phrase: "Come posso aiutare?", note: "Design & luxury verticals", color: "#10B981" },
  { flag: "🇳🇱", name: "Dutch", speakers: "~24M", region: "Netherlands", family: "Germanic", phrase: "Hoe kan ik helpen?", note: "High English overlap", color: "#F59E0B" },
  { flag: "🇵🇱", name: "Polish", speakers: "~38M", region: "Poland", family: "Slavic", phrase: "Jak mogę pomóc?", note: "CEE gateway", color: "#E11D48" },
  { flag: "🇵🇹", name: "Portuguese", speakers: "~10M", region: "Portugal", family: "Romance", phrase: "Como posso ajudar?", note: "Brazil bridge", color: "#059669" },
];

const ACCENTS = [
  { label: "SCOUSE", city: "Liverpool", desc: "Distinctive local accent", region: "Northern England", tag: "UK • 3s detect" },
  { label: "LONDON", city: "London English", desc: "Estuary • Multicultural London", region: "South-East", tag: "UK • 94.2%" },
  { label: "YORKSHIRE", city: "Yorkshire", desc: "Northern England dialect", region: "North", tag: "UK • Edge" },
  { label: "BERLIN", city: "Berlinerisch", desc: "North-East dialect", region: "Germany", tag: "DE • Real-time" },
  { label: "BAVARIAN", city: "Munich", desc: "Bavarian dialect Southern Germany", region: "Southern Germany", tag: "DE • On-device" },
  { label: "MARSEILLE", city: "Southern French", desc: "Provençal • Occitan influence", region: "France", tag: "FR • GDPR" },
];

export default function EuLanguagesPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [assessOpen, setAssessOpen] = useState(false);
  const [form, setForm] = useState<Assessment>({ company: "", email: "", language: "French" });
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [records, setRecords] = useState<any[]>([]);

  const observerRef = useRef<IntersectionObserver | null>(null);

  // records persistence
  async function loadRecords() {
    try {
      const res = await fetch("actions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "records.list", args: { collection: "assessments" } }),
      });
      const j = await res.json();
      if (j.data) setRecords(j.data.records || []);
    } catch {}
  }

  useEffect(() => {
    loadRecords();
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          observerRef.current?.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

    const els = document.querySelectorAll(".card-drop, .slide-in-left, .slide-in-right");
    els.forEach((el) => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  const submitAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company || !form.email) return;
    setSaving(true);
    setSavedMsg(null);
    try {
      const idempotency_key = `${form.email}-${Date.now()}`;
      const res = await fetch("actions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "records.create",
          args: { collection: "assessments", value: form, idempotency_key },
        }),
      });
      const j = await res.json();
      if (j.error) throw new Error(j.error);
      setSavedMsg(`Assessment queued for ${form.company} • ${form.language}. Our EU team will mirror your accent.`);
      setForm({ company: "", email: "", language: "French" });
      await loadRecords();
      setTimeout(() => setAssessOpen(false), 1200);
    } catch (err: any) {
      setSavedMsg(err.message || "Failed to save. Storage limit may be reached.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      data-safe-area-inset-root
      style={{ boxSizing: "border-box", paddingTop: "var(--safe-area-inset-top)", background: "var(--bg)" }}
      className="min-h-screen w-full overflow-x-clip antialiased"
    >
      {/* NAV */}
      <header
        data-safe-area-sticky-top
        style={{ top: "var(--safe-area-inset-top)" }}
        className="sticky z-40 w-full border-b border-[var(--border)] bg-white/80 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-[68px] max-w-[1240px] items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-8">
            <a href="/eu" className="flex items-center gap-3">
              <img src={logoUrl} alt="AiKOVA logo" className="h-9 w-9 rounded-xl object-cover shadow-sm ring-1 ring-black/5" />
              <span className="font-semibold tracking-tight text-[15px] text-slate-900">AiKOVA</span>
              <span className="hidden sm:inline-flex items-center rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-white">EUROZONE</span>
            </a>
            <nav className="hidden lg:flex items-center gap-7 text-[13.5px] font-medium text-slate-600">
              <a href="/eu/features" className="hover:text-slate-900 transition">Features</a>
              <a href="/eu/solutions" className="hover:text-slate-900 transition">Solutions</a>
              <a href="/eu/languages" className="relative flex items-center gap-1.5 font-semibold text-slate-900">
                <span className="absolute -bottom-2 left-0 h-0.5 w-full bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full" />
                Languages <span className="text-[11px]">🇬🇧🇪🇺</span>
              </a>
              <a href="/eu/pricing" className="hover:text-slate-900 transition">Pricing</a>
              <a href="/eu/demo" className="hover:text-slate-900 transition">Demo</a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <a
              id="assess-button-main-hero"
              href={startSetupUrl("eurozone")}
              className="inline-flex h-9 items-center justify-center rounded-full bg-slate-900 px-5 text-[13px] font-semibold text-white shadow-[0_4px_14px_rgba(15,23,42,0.18)] transition hover:bg-black hover:shadow-[0_8px_20px_rgba(15,23,42,0.22)] active:scale-[0.98]"
            >
              Start free trial →
            </a>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white">
              <div className="space-y-1">
                <div className="h-0.5 w-4 bg-slate-800 rounded-full" />
                <div className="h-0.5 w-4 bg-slate-800 rounded-full" />
                <div className="h-0.5 w-3 bg-slate-800 rounded-full" />
              </div>
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-5 py-4 text-[14px] font-medium text-slate-700 space-y-3">
            <a href="/eu/features" onClick={() => setMobileOpen(false)} className="block">Features</a>
            <a href="/eu/solutions" onClick={() => setMobileOpen(false)} className="block">Solutions</a>
            <a href="/eu/languages" onClick={() => setMobileOpen(false)} className="block font-semibold text-slate-900">Languages 🇬🇧🇪🇺 (active)</a>
            <a href="/eu/pricing" onClick={() => setMobileOpen(false)} className="block">Pricing</a>
            <a href="/eu/demo" onClick={() => setMobileOpen(false)} className="block">Demo</a>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-white">
        <div className="gradient-mesh absolute inset-0 pointer-events-none" />
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-10 px-5 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-[88px]">
          <div className="slide-in-left relative z-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[11px] font-semibold tracking-widest text-slate-600 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LANGUAGES • 8 LANGUAGES • 320M+ SPEAKERS • 3 FAMILIES
            </div>
            <h1 className="max-w-[620px] text-[38px] font-bold leading-[0.95] tracking-[-0.03em] text-slate-900 lg:text-[56px]">
              Speak like a local. <span className="font-[600]">From Scouse to Bavarian to Marseille.</span>
            </h1>
            <p className="mt-5 max-w-[540px] text-[15.5px] leading-7 text-slate-600">
              Europe speaks <span className="font-semibold text-slate-900">8 major languages across 3 families</span>. AiKOVA detects accent in <span className="inline-flex items-center rounded-full bg-slate-900 px-2 py-0.5 text-[12px] font-bold text-white">3 seconds</span> and mirrors it — builds trust no foreign bot can. Same as Africa Yoruba/Hausa but for Europe. GDPR-ready, on-device, UK flag-off compliant.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a href={startSetupUrl("eurozone")} className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-[#00E5FF] via-[#2962FF] to-[#76FF03] px-6 text-[14px] font-bold text-slate-900 shadow-[0_8px_24px_rgba(41,98,255,0.22)] transition hover:brightness-110 active:scale-[0.98]">
                Start free trial →
              </a>
              <div className="flex items-center gap-2 text-[12px] font-medium text-slate-500">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i=> <div key={i} className="h-7 w-7 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px]">🇪🇺</div>)}
                </div>
                320M+ speakers covered
              </div>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 max-w-[480px]">
              {[
                { k: "8 Languages", v: "3 Families Romance Germanic Slavic" },
                { k: "94.2% Accuracy", v: "Validated 6 regions UK DE FR" },
                { k: "3s Detection", v: "Real-time EVM-AccentNet v2.1" },
              ].map((i) => (
                <div key={i.k} className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
                  <div className="text-[12px] font-bold tracking-tight text-slate-900">{i.k}</div>
                  <div className="mt-1 text-[11px] leading-4 text-slate-500">{i.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="slide-in-right relative">
            <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-2 shadow-[0_24px_64px_rgba(15,23,42,0.12)]">
              <div className="gradient-border-top rounded-t-[20px]" />
              <img src={cafeUrl} alt="Diverse people in London cafe with AI Receptionist translating EN to FR DE ES IT" className="aspect-[4/3] w-full rounded-[20px] object-cover" />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/60 bg-white/90 p-4 shadow-xl backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                    <span className="text-[11px] font-bold tracking-widest text-slate-700">AI RECEPTIONIST • LIVE</span>
                  </div>
                  <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-bold text-white">EN → FR / DE / ES / IT</span>
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2 text-[10px]">
                  {["🇬🇧 EN", "🇫🇷 FR", "🇩🇪 DE", "🇪🇸 ES"].map((l) => (
                    <div key={l} className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-center font-semibold text-slate-700">{l}</div>
                  ))}
                </div>
                <div className="mt-3 text-[11px] leading-4 text-slate-600">Camden High St • Flat white + croissant • Union Jack + EU flag — AI mirroring Scouse & Berlinerisch tone</div>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 hidden lg:flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-white shadow-xl rotate-12 text-[11px] font-bold tracking-widest">🇬🇧 OFF • 🇪🇺 ON</div>
          </div>
        </div>
      </section>

      {/* BIG MAP INFOGRAPHIC */}
      <section id="features" className="bg-[var(--bg-alt)] px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1240px]">
          <div className="mx-auto max-w-[760px] text-center">
            <div className="inline-flex rounded-full bg-white border border-slate-200 px-3 py-1 text-[11px] font-bold tracking-widest text-slate-500 shadow-sm">EUROPEAN LANGUAGE DIVERSITY • INFOGRAPHIC</div>
            <h2 className="mt-5 text-[32px] font-bold leading-[1.05] tracking-[-0.02em] lg:text-[44px]">European Languages Infographic Map — 8 Languages 8 Countries</h2>
            <p className="mt-4 text-[15px] leading-6 text-slate-600">White-card centerpiece. Image speaks. UK English ~67M, Germany ~76M most spoken native in EU, France ~67M, Netherlands ~24M, Poland ~38M, Italy ~59M, Spain ~47M, Portugal ~10M.</p>
          </div>

          <div className="card-drop mt-10 overflow-hidden rounded-[28px] border border-slate-200 bg-white p-3 shadow-[var(--shadow-medium)] lg:p-4">
            <div className="gradient-border-top rounded-t-[20px]" />
            <img src={mapLanguagesUrl} alt="European Languages Infographic Map 8 Languages 8 Countries - UK English 67M German 76M French 67M Dutch 24M Polish 38M Italian 59M Spanish 47M Portuguese 10M" className="w-full rounded-[20px] object-contain bg-white" />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { title: "Why it Matters", text: "320M+ native speakers combined across 3 families. Customers trust a voice that sounds like theirs — Scouse in Liverpool, Bavarian in Munich.", icon: "🌍" },
              { title: "3 Language Families", text: "Romance (FR, ES, IT, PT), Germanic (EN, DE, NL), Slavic (PL). One model stack fine-tuned with Whisper + EVM-AccentNet.", icon: "🧬" },
              { title: "Key Fact", text: "German is the most spoken native language in EU (~76M). AiKOVA mirrors it, plus UK English that still drives 67M conversations.", icon: "📊" },
            ].map((c) => (
              <div key={c.title} className="card-drop rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-[16px] text-white">{c.icon}</div>
                <h3 className="mt-4 text-[16px] font-bold">{c.title}</h3>
                <p className="mt-2 text-[13.5px] leading-6 text-slate-600">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LANGUAGE CARDS GRID */}
      <section id="languages" className="bg-white px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-[30px] font-bold tracking-tight lg:text-[40px]">8 Languages. One Receptionist.</h2>
              <p className="mt-3 max-w-[560px] text-[14.5px] leading-6 text-slate-600">Each card drops in. Gradient top border. Flag, speakers, region, example phrase. Production-ready UI magic.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-600">
              <span className="h-2 w-2 rounded-full bg-[#2962FF]" /> GDPR • On-device inference • UK flag-off
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {LANGUAGES.map((lang, idx) => (
              <div
                key={lang.name}
                className="card-drop group relative overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-medium)] hover:-translate-y-0.5"
                style={{ transitionDelay: `${idx * 70}ms` }}
              >
                <div className="gradient-border-top" />
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-[22px] ring-1 ring-slate-200">{lang.flag}</div>
                    <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-bold tracking-wide text-white">{lang.speakers}</span>
                  </div>
                  <h3 className="mt-4 text-[16px] font-bold tracking-tight">{lang.name}</h3>
                  <div className="mt-1 flex items-center gap-2 text-[11px] font-medium text-slate-500">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5">{lang.region}</span>
                    <span>• {lang.family}</span>
                  </div>
                  <div className="mt-4 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
                    <div className="text-[10px] font-bold tracking-widest text-slate-400">EXAMPLE</div>
                    <div className="mt-1 text-[13px] font-medium leading-5 text-slate-800">“{lang.phrase}”</div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {lang.note}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-[#00E5FF] to-[#2962FF] transition-all duration-500 group-hover:w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCAL VOICE MESH DEEP DIVE */}
      <section id="solutions" className="bg-[#F8FAFC] px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1240px]">
          <div className="mx-auto max-w-[860px] text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold tracking-widest text-slate-600 shadow-sm">
              <span className="inline-flex h-5 items-center justify-center rounded-full bg-gradient-to-r from-[#00E5FF] to-[#2962FF] px-2 text-[10px] text-white">MESH</span>
              EUROPEAN LOCAL VOICE MESH • 94.2% ACCURACY • 3-SECOND REAL-TIME
            </div>
            <h2 className="mt-6 text-[32px] font-bold leading-[1.05] tracking-tight lg:text-[46px]">
              Hyperlocal Accent Detection <span className="gradient-text">that builds trust.</span>
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-slate-600">Eurozone ice on cake. Scouse, London, Yorkshire, Berlin, Bavarian, Marseille — detected in 3 seconds, mirrored instantly.</p>
          </div>

          <div className="card-drop mt-10 overflow-hidden rounded-[28px] border border-slate-200 bg-white p-3 shadow-[var(--shadow-medium)] lg:p-4">
            <div className="gradient-border-top rounded-t-[20px]" />
            <img src={voiceMeshUrl} alt="European Local Voice Mesh Accent Detection Map 3-Second Real-Time Scouse Liverpool London Yorkshire Berlin Bavarian Munich Marseille Provencal How it works Audio Capture ML Analysis Accent Classification Performance Metrics" className="w-full rounded-[20px] object-contain bg-white" />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {ACCENTS.map((a) => (
              <div key={a.label} className="card-drop rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-widest text-slate-900">{a.label}</span>
                  <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[9px] font-bold text-white">{a.tag}</span>
                </div>
                <div className="mt-2 text-[13px] font-semibold text-slate-900">{a.city}</div>
                <div className="mt-1 text-[11px] leading-4 text-slate-500">{a.desc}</div>
                <div className="mt-2 text-[10px] font-medium text-slate-400">{a.region}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="card-drop rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-[15px] font-bold">How it Works</h3>
              <div className="mt-5 space-y-4">
                {[
                  { n: "1", t: "Audio Capture", d: "3-second voice sample, edge-captured" },
                  { n: "2", t: "ML Analysis", d: "Phonetic & acoustic features — EVM-AccentNet v2.1" },
                  { n: "3", t: "Accent Classification", d: "Matches to regional dialect label" },
                ].map((s) => (
                  <div key={s.n} className="flex gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[11px] font-bold text-white">{s.n}</div>
                    <div>
                      <div className="text-[13px] font-semibold">{s.t}</div>
                      <div className="text-[12px] text-slate-500">{s.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-drop rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-[15px] font-bold">Performance Metrics</h3>
              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-[12px] font-medium text-slate-600">Detection Time</span>
                  <span className="text-[13px] font-bold">~3s avg</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-[12px] font-medium text-slate-600">Accuracy</span>
                  <span className="text-[13px] font-bold">94.2% • 6 regions</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-[12px] font-medium text-slate-600">Coverage</span>
                  <span className="text-[13px] font-bold">6 dialects UK DE FR</span>
                </div>
                <div className="text-[11px] leading-4 text-slate-500">Model EVM-AccentNet • Trained on 50k+ samples • Updated Oct 2026</div>
              </div>
            </div>

            <div className="card-drop rounded-[20px] border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
              <h3 className="text-[15px] font-bold">Mesh Network Features</h3>
              <div className="mt-5 space-y-3 text-[12.5px] leading-5 text-slate-300">
                <div className="flex gap-2"><span className="text-[#00E5FF]">•</span> Low-latency edge processing</div>
                <div className="flex gap-2"><span className="text-[#00E5FF]">•</span> Cross-border dialect recognition</div>
                <div className="flex gap-2"><span className="text-[#00E5FF]">•</span> Privacy-first on-device inference</div>
                <div className="flex gap-2"><span className="text-emerald-400">•</span> GDPR Compliant • EU data residency</div>
                <div className="mt-4 rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                  <div className="text-[10px] font-bold tracking-widest text-slate-400">KEY APPLICATIONS</div>
                  <div className="mt-1 text-[11px] leading-4">Customer Support • Voice UI Adaptation • Linguistic Research • Language Learning • Content Moderation</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VISUAL STORIES */}
      <section className="bg-white px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1240px] space-y-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
            <div className="slide-in-left overflow-hidden rounded-[24px] border border-slate-200 bg-white p-2 shadow-[var(--shadow-soft)]">
              <img src={cafeUrl} alt="Multilingual cafe Camden EN to FR DE ES IT live translation" className="aspect-[16/10] w-full rounded-[16px] object-cover" />
            </div>
            <div className="slide-in-right">
              <div className="inline-flex rounded-full bg-slate-900 px-3 py-1 text-[11px] font-bold tracking-widest text-white">VISUAL STORY 01 • CAMDEN</div>
              <h3 className="mt-4 text-[26px] font-bold leading-[1.1] tracking-tight lg:text-[34px]">Multilingual Cafe in Camden — EN → FR / DE / ES / IT Live</h3>
              <p className="mt-4 text-[14.5px] leading-7 text-slate-600">
                5 diverse people at a wooden table, flat whites + croissant, Union Jack + EU flag on brick wall. The AI Receptionist kiosk says <span className="font-semibold text-slate-900">“AI RECEPTIONIST TRANSLATING NOW ACTIVE”</span>. TODAY menu Espresso Flat White Latte Croissant Cake — but the real menu is languages. Helping conversation in 5 languages, mirroring tone so a French customer feels Parisian service in London.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Live Translation EN→FR DE ES IT", "Camden High St • Black Cab", "Flat White + Croissant Moment"].map(t=> <span key={t} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-600">{t}</span>)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
            <div className="slide-in-left order-2 lg:order-1">
              <div className="inline-flex rounded-full bg-gradient-to-r from-[#00E5FF] to-[#2962FF] px-3 py-1 text-[11px] font-bold tracking-widest text-white">VISUAL STORY 02 • HYPERLOCAL</div>
              <h3 className="mt-4 text-[26px] font-bold leading-[1.1] tracking-tight lg:text-[34px]">Hyperlocal Matters — Scouse gets Scouse.</h3>
              <p className="mt-4 text-[14.5px] leading-7 text-slate-600">
                Scouse customer in Liverpool gets Scouse-like response, Bavarian in Munich gets Bavarian tone — builds trust no foreign bot can. The mesh detects in 3 seconds: Audio Capture → ML Analysis Phonetic & acoustic → Accent Classification. Privacy-first on-device inference, GDPR ready. 94.2% accuracy validated across 6 regions.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
                  <div className="text-[11px] font-bold tracking-widest text-slate-400">LIVERPOOL</div>
                  <div className="mt-1 text-[12px] font-semibold">Scouse → Scouse mirror</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
                  <div className="text-[11px] font-bold tracking-widest text-slate-400">MUNICH</div>
                  <div className="mt-1 text-[12px] font-semibold">Bavarian → Bavarian tone</div>
                </div>
              </div>
            </div>
            <div className="slide-in-right order-1 lg:order-2 overflow-hidden rounded-[24px] border border-slate-200 bg-white p-2 shadow-[var(--shadow-soft)]">
              <img src={voiceMeshUrl} alt="Hyperlocal accent detection Scouse Bavarian Marseille" className="aspect-[16/10] w-full rounded-[16px] object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS FLOW */}
      <section id="demo" className="bg-slate-900 px-5 py-16 text-white lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-[28px] font-bold tracking-tight lg:text-[40px]">How it Works — Infographic Road</h2>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-widest ring-1 ring-white/20">WHISPER STT • QDRANT RAG • MIRRORED TTS</span>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-3 lg:grid-cols-7 lg:items-center">
            {[
              { step: "Customer speaks", desc: "French / German / Scouse / Bavarian / Marseille" },
              { step: "Whisper STT", desc: "Fine-tuned European accents" },
              { step: "Language / Accent Detect", desc: "3s • 94.2% • EVM-AccentNet" },
              { step: "Qdrant RAG", desc: "EU knowledge base" },
              { step: "LLM", desc: "GDPR • On-device" },
              { step: "TTS mirrored accent", desc: "Scouse → Scouse, Bavarian → Bavarian" },
              { step: "Booking / Lead", desc: "CRM • Cal.com • Trust built" },
            ].map((s, i) => (
              <div key={s.step} className="card-drop relative flex items-center gap-3 lg:flex-col lg:items-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[13px] font-bold text-slate-900 shadow">{i + 1}</div>
                <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 lg:w-full">
                  <div className="text-[13px] font-semibold leading-tight">{s.step}</div>
                  <div className="mt-1 text-[11px] leading-4 text-slate-300">{s.desc}</div>
                </div>
                {i < 6 && <div className="hidden lg:block absolute top-5 -right-2 h-0.5 w-4 bg-white/20" />}
              </div>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-2xl bg-gradient-to-r from-[#00E5FF]/20 to-[#2962FF]/20 p-5 ring-1 ring-white/10">
              <div className="text-[12px] font-bold tracking-widest text-cyan-300">UK FLAG-OFF</div>
              <div className="mt-2 text-[13px] leading-5 text-slate-200">White theme, UK blue #012169 accents, no Union Jack dependency. Built for EU 27 + UK local expertise.</div>
            </div>
            <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
              <div className="text-[12px] font-bold tracking-widest text-slate-400">REGULATORY</div>
              <div className="mt-2 text-[13px] leading-5 text-slate-200">GDPR Compliant • On-device inference • EU data residency • No cross-border voice leakage.</div>
            </div>
            <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
              <div className="text-[12px] font-bold tracking-widest text-[#76FF03]">TRUST SIGNAL</div>
              <div className="mt-2 text-[13px] leading-5 text-slate-200">Same playbook as Africa Yoruba/Hausa — but for Europe. Customers hear themselves, not a foreign bot.</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="relative overflow-hidden px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-[1240px]">
          <div className="relative overflow-hidden rounded-[28px] bg-slate-900 p-8 shadow-[0_24px_64px_rgba(15,23,42,0.24)] lg:p-12">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF]/30 via-[#2962FF]/30 to-[#76FF03]/20" />
            <div className="absolute -right-24 -top-24 h-[400px] w-[400px] rounded-full bg-[#2962FF]/20 blur-[80px]" />
            <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <h2 className="text-[28px] font-bold leading-[1.05] tracking-tight text-white lg:text-[42px]">Your customers speak French, German, Scouse? AiKOVA answers same accent, GDPR ready.</h2>
                <p className="mt-4 max-w-[560px] text-[14.5px] leading-6 text-slate-200">8 languages • 6 hyperlocal accents • 3-second detection • 94.2% accuracy. White theme, production-ready, images that speak. UK flag-off, EU flag-on.</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {records.slice(0,3).map((r:any)=>(
                    <span key={r.id} className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white ring-1 ring-white/15">{r.value.company} • {r.value.language}</span>
                  ))}
                  {records.length>0 && <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-slate-900">{records.length} assessments saved</span>}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <a href={startSetupUrl("eurozone")} className="inline-flex h-12 items-center justify-center rounded-full bg-white px-7 text-[14px] font-bold text-slate-900 shadow-xl transition hover:bg-slate-50 active:scale-[0.98]">
                  Start free trial →
                </a>
                <div className="text-center text-[11px] font-medium tracking-wide text-slate-300">No credit card • GDPR DPA • EU data residency</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white px-5 py-12 lg:px-8">
        <div className="mx-auto max-w-[1240px] grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <img src={logoUrl} alt="AiKOVA" className="h-8 w-8 rounded-lg object-cover" />
              <span className="font-bold tracking-tight">AiKOVA Eurozone</span>
            </div>
            <p className="mt-4 max-w-[360px] text-[13px] leading-6 text-slate-600">Supporting 27 EU Member States + United Kingdom Local Expertise. Regulatory Compliance, GDPR, on-device inference. Languages Page No.4 — white theme, best UI magic.</p>
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-widest text-slate-400">PRODUCT</div>
            <div className="mt-3 space-y-2 text-[13px] text-slate-600">
              <div>Features</div><div>Solutions</div><div>Languages 🇬🇧🇪🇺</div><div>Pricing</div>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-widest text-slate-400">EU COVERAGE</div>
            <div className="mt-3 space-y-2 text-[13px] text-slate-600">
              <div>UK English ~67M</div><div>German ~76M most spoken</div><div>French ~67M</div><div>320M+ combined native</div>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-widest text-slate-400">MESH</div>
            <div className="mt-3 space-y-2 text-[13px] text-slate-600">
              <div>3s Detection • 94.2% Accuracy</div><div>6 dialects UK DE FR</div><div>EVM-AccentNet v2.1</div><div>Privacy-first edge</div>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-[1240px] flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-6 text-[11px] text-slate-500">
          <span>© 2026 AiKOVA • Eurozone Marketing Page No.4 • White #FFFFFF • Slate #0F172A • Gradient #00E5FF→#2962FF→#76FF03 • UK Blue #012169</span>
          <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400" /> GDPR Ready • UK flag-off</span>
        </div>
      </footer>

      {/* ASSESS MODAL */}
      {assessOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-[440px] rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_24px_64px_rgba(0,0,0,0.24)]">
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-bold tracking-tight">Assess My Accent Fit</h3>
              <button onClick={() => setAssessOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200">✕</button>
            </div>
            <p className="mt-2 text-[12.5px] leading-5 text-slate-600">Tell us your company + target language. We queue a 3s accent mirroring test and save it securely (records API).</p>
            <form onSubmit={submitAssessment} className="mt-5 space-y-3">
              <input value={form.company} onChange={e=>setForm({...form, company: e.target.value})} placeholder="Company name" required className="h-11 w-full rounded-full border border-slate-200 bg-white px-4 text-[13px] outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900" />
              <input value={form.email} onChange={e=>setForm({...form, email: e.target.value})} type="email" placeholder="Work email" required className="h-11 w-full rounded-full border border-slate-200 bg-white px-4 text-[13px] outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900" />
              <select value={form.language} onChange={e=>setForm({...form, language: e.target.value})} className="h-11 w-full rounded-full border border-slate-200 bg-white px-4 text-[13px] outline-none focus:border-slate-900">
                {LANGUAGES.map(l=> <option key={l.name} value={l.name}>{l.flag} {l.name} {l.speakers}</option>)}
              </select>
              <button disabled={saving} type="submit" className="flex h-11 w-full items-center justify-center rounded-full bg-slate-900 px-5 text-[13px] font-bold text-white shadow transition hover:bg-black disabled:opacity-60">
                {saving ? "Saving..." : "Run 3s Test & Save →"}
              </button>
              {savedMsg && <div className="rounded-xl bg-slate-50 p-3 text-[12px] leading-5 text-slate-700 ring-1 ring-slate-100">{savedMsg}</div>}
            </form>
            <div className="mt-4 text-[10px] leading-4 text-slate-500">Storage: {records.length}/1000 records • 16 KiB per record • Uses trusted actions API • No uploads supported</div>
          </div>
        </div>
      )}
    </div>
  );
}
