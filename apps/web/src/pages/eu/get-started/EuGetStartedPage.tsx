import { useEffect, useRef, useState } from 'react';
import logoImg from "./assets/32d4f05ae5209978-image_6A9BA612-7186-480D-9D5C-7EF8BE2260B7.jpeg";
import complianceImg from "./assets/1cae591b7f9b125a-image_20261030_070722.webp";
import missionImg from "./assets/7d3d8d21117456e7-image_20261030_070725.webp";
import { startSetupUrl } from '../../../lib/setupFlow';

// Types for persistence
type Inquiry = { name: string; email: string; message: string; consent: boolean; createdAt: string };

const SITEMAP = [
  { n: 1, path: "/eu", title: "UK Hero Landing", desc: "Hero with UK high street Union Jack bunting Garden Restaurant Brew Bean Clinic Bloom Salon + Assess button", icon: "🇬🇧" },
  { n: 2, path: "/eu/features", title: "Features", desc: "Eurozone Business Features GDPR Compliant Multilingual", icon: "✨" },
  { n: 3, path: "/eu/solutions", title: "Solutions", desc: "8 business types Restaurant Cafe Clinic Salon Retail Professional Services Auto Repair Pub", icon: "🧩" },
  { n: 4, path: "/eu/languages", title: "Languages", desc: "8 languages 320M+ speakers Scouse Bavarian Marseille 94.2% accuracy", icon: "🗣️" },
  { n: 5, path: "/eu/how-it-works", title: "How It Works", desc: "3-step Connect Train Live Twilio GDPR RAG", icon: "⚙️" },
  { n: 6, path: "/eu/pricing", title: "Pricing", desc: "EUR €25 €79 €199 VAT Stripe SEPA vs Slang €275", icon: "💶" },
  { n: 7, path: "/eu/demo", title: "Demo", desc: "Live Demo 3 channels Phone +44 WhatsApp Instagram GDPR consent", icon: "📞" },
  { n: 8, path: "/eu/customers", title: "Customers", desc: "500+ businesses testimonials", icon: "🤝" },
  { n: 9, path: "/eu/resources", title: "Resources", desc: "Playbooks Restaurant Cafe Clinic Salon + GDPR Guide v2024.10", icon: "📚" },
  { n: 10, path: "/eu/company", title: "Company", desc: "Mission Map 1M+ Businesses €4.2T GDP 27 states", icon: "🏢" },
  { n: 11, path: "/eu/get-started", title: "Final", desc: "Demo + Contact + Legal & Trust GDPR AI Act VAT this page", icon: "✅" },
];

export default function EuGetStartedPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "", consent: true });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver for card dropping + slide-in
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".card-drop, .slide-in").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const loadInquiries = async () => {
    try {
      const res = await fetch("actions", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "records.list", args: { collection: "inquiries", limit: 20 } }) });
      const j = await res.json();
      if (j.data) setInquiries(j.data.records || []);
    } catch {}
  };
  useEffect(() => { loadInquiries(); }, []);

  const handleSend = async () => {
    if (!form.name || !form.email || !form.message) return;
    setBusy(true);
    const value: Inquiry = { name: form.name, email: form.email, message: form.message, consent: form.consent, createdAt: new Date().toISOString() };
    try {
      const res = await fetch("actions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "records.create", args: { collection: "inquiries", value, idempotency_key: `inq-${form.email}-${Date.now()}` } })
      });
      const j = await res.json();
      if (j.error) throw new Error(j.error);
      setSent(true);
      setForm({ name: "", email: "", message: "", consent: true });
      await loadInquiries();
      setTimeout(() => setSent(false), 4000);
    } catch (e) {
      console.error(e);
    } finally { setBusy(false); }
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div data-safe-area-inset-root className="min-h-screen w-full bg-white overflow-x-clip" style={{ boxSizing: "border-box", paddingTop: "var(--safe-area-inset-top)" }}>
      {/* NAV - white sticky */}
      <header data-safe-area-sticky-top className="sticky z-50 border-b border-[var(--border)] bg-white/80 backdrop-blur-xl" style={{ top: "var(--safe-area-inset-top)" }}>
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="/eu" className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl overflow-hidden bg-black shadow-sm">
                <img src={logoImg} alt="AiKOVA Logo" className="h-full w-full object-cover" />
              </div>
              <span className="font-bold tracking-[-0.02em] text-[20px] text-slate-900">AiKOVA</span>
              <span className="ml-2 hidden lg:inline-flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-bold tracking-widest text-white">BUILT FOR AFRICA • EUROZONE READY</span>
            </a>
            <nav className="hidden xl:flex items-center gap-1 text-[13.5px] font-medium">
              {["Features","Solutions","Languages","How It Works","Pricing","Demo","Resources","Company"].map(l => (
                <button key={l} onClick={() => scrollTo("sitemap")} className="px-3 py-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition">{l}</button>
              ))}
              <button className="px-3 py-2 rounded-full bg-[#012169] text-white font-semibold flex items-center gap-1.5 shadow-sm">Final <span>🇬🇧🇪🇺</span></button>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-400 font-medium tracking-wide">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> UK FLAG-OFF • LIVE
            </div>
            {/* ASSESS BUTTON TO BE UPDATED ON MAIN HERO PAGE */}
            <button
              id="assess-button-main-hero"
              onClick={() => scrollTo("contact")}
              className="relative group rounded-full px-5 h-[42px] text-[13px] font-bold text-white overflow-hidden shadow-[0_8px_24px_rgba(41,98,255,0.35)]"
            >
              <span className="absolute inset-0 gradient-uk transition group-hover:brightness-[1.05]" />
              <span className="absolute inset-0 rounded-full pulse-ring border border-white/40 pointer-events-none" />
              <span className="relative flex items-center gap-1.5">Assess Your Business <span className="text-[14px]">→</span></span>
            </button>
          </div>
        </div>
        {/* mobile subnav */}
        <div className="xl:hidden border-t border-slate-100 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 px-4 py-2">
            {["Features","Solutions","Languages","How It Works","Pricing","Demo","Resources","Company","Final 🇬🇧🇪🇺"].map(t => (
              <button key={t} className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[12px] font-medium ${t.includes("Final") ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-600"}`}>{t}</button>
            ))}
          </div>
        </div>
      </header>

      {/* HERO FINAL */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC] via-white to-white" />
        <div className="absolute -top-24 right-[-10%] h-[520px] w-[680px] rounded-[40%] bg-gradient-to-br from-[#00E5FF]/20 via-[#2962FF]/15 to-[#76FF03]/15 blur-[80px]" />
        <div className="absolute top-[30%] left-[-8%] h-[420px] w-[520px] rounded-full bg-[#012169]/[0.06] blur-[60px]" />

        <div ref={heroRef} className="relative mx-auto max-w-[1280px] px-5 lg:px-8 pt-10 lg:pt-16 pb-12 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
          <div className="slide-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold tracking-widest text-slate-600 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Final • No.11 • Demo + Contact + Legal & Trust • UK + 27 EU • 1M+ Businesses
            </div>

            <h1 className="mt-6 text-[42px] lg:text-[64px] leading-[0.95] tracking-[-0.03em] font-bold text-slate-900">
              Compliant,<br />
              <span className="gradient-text-uk">Trusted,</span> Ready<br />
              for the Eurozone
            </h1>
            <p className="mt-5 max-w-[560px] text-[17px] leading-7 text-slate-600">
              Manage GDPR, EU AI Act, VAT compliance across Eurozone businesses securely and transparently. <span className="font-semibold text-slate-900">20+ Eurozone Countries • 1200+ Registered Businesses • Live Map.</span>
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button onClick={() => scrollTo("live-map")} className="h-[48px] rounded-full bg-slate-900 px-6 text-[14px] font-semibold text-white shadow-[0_10px_24px_rgba(15,23,42,0.18)] hover:bg-black transition">Start Demo →</button>
              <button onClick={() => scrollTo("contact")} className="h-[48px] rounded-full border border-slate-200 bg-white px-6 text-[14px] font-semibold text-slate-900 hover:bg-slate-50 transition">Contact Team</button>
              <button id="assess-button-main-hero" onClick={() => scrollTo("contact")} className="relative h-[48px] rounded-full px-6 text-[14px] font-bold text-white shadow-[0_8px_24px_rgba(41,98,255,0.35)] overflow-hidden">
                <span className="absolute inset-0 gradient-uk" />
                <span className="relative">Assess Your Business</span>
              </button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 border border-slate-200 px-3 py-1.5 text-[11px] font-medium text-slate-600">
                <span className="flex -space-x-2">
                  {[1,2,3].map(i => <span key={i} className="h-6 w-6 rounded-full border-2 border-white bg-gradient-to-br from-slate-200 to-slate-300 inline-block" />)}
                </span>
                Trusted by <b className="text-slate-900">500+ businesses</b> across Eurozone
              </div>
              <div className="inline-flex gap-2 text-[11px]">
                {["GDPR","AI Act","VAT","Legal","Privacy","Cookies"].map(k => (
                  <span key={k} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 font-semibold text-slate-500">{k}</span>
                ))}
              </div>
              <span className="text-[11px] text-slate-400">2024 Eurozone Business Compliance Hub</span>
            </div>

            {/* Trust row */}
            <div className="mt-8 grid grid-cols-3 gap-3 max-w-[520px]">
              {[
                { t: "20+ Countries", s: "Eurozone coverage" },
                { t: "1200+ Businesses", s: "Registered & verified" },
                { t: "500+ Partners", s: "Trusted network" },
              ].map(c => (
                <div key={c.t} className="rounded-2xl border border-slate-100 bg-white p-3 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                  <div className="text-[13px] font-bold text-slate-900">{c.t}</div>
                  <div className="text-[11px] text-slate-500">{c.s}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual - compliance hub image */}
          <div className="card-drop lg:sticky lg:top-[96px]">
            <div className="relative rounded-[28px] bg-white border border-slate-100 shadow-[0_24px_64px_-16px_rgba(15,23,42,0.18)] overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[4px] gradient-uk" />
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#FF5F56]" />
                  <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
                  <span className="h-3 w-3 rounded-full bg-[#27C93F]" />
                  <span className="ml-3 text-[11px] font-semibold tracking-widest text-slate-400">EUROZONE BUSINESS COMPLIANCE HUB</span>
                </div>
                <span className="rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-1 text-[10px] font-bold tracking-widest">LIVE • GDPR READY</span>
              </div>
              <div className="relative aspect-[16/10] bg-[#F8FAFC] overflow-hidden">
                <img src={complianceImg} alt="Compliance Hub Final - Live Map 20+ Eurozone Countries 1200+ Registered Businesses map blue pins" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent pointer-events-none" />
                {/* floating badges */}
                <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                  {["GDPR Compliant","AI Act Aligned","VAT Ready"].map(b => (
                    <span key={b} className="backdrop-blur-md bg-white/90 border border-white/60 shadow-lg rounded-full px-3 py-1.5 text-[10px] font-bold tracking-wide text-slate-800">{b}</span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 divide-x divide-slate-100 bg-white">
                <div className="p-4">
                  <div className="text-[18px] font-bold text-slate-900">20+ Countries</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Live pins UK → DE → FR</div>
                </div>
                <div className="p-4">
                  <div className="text-[18px] font-bold text-slate-900">1200+ Registered</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Businesses verified</div>
                </div>
                <div className="p-4 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full gradient-uk grid place-items-center text-white text-[12px] font-bold">✓</div>
                  <div className="text-[11px] leading-4 font-semibold text-slate-700">Compliant<br/>Trusted<br/>Ready</div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <span className="h-px w-8 bg-slate-200" /> Images that speak — white theme, soft shadows, production ready <span className="h-px w-8 bg-slate-200" />
            </div>
          </div>
        </div>
      </section>

      {/* LIVE MAP SECTION */}
      <section id="live-map" className="mx-auto max-w-[1280px] px-5 lg:px-8 py-12 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div className="slide-in">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#012169] text-white px-3 py-1 text-[11px] font-bold tracking-widest">LIVE MAP • UK + 27 EU • 1M+ BUSINESSES</div>
            <h2 className="mt-4 text-[32px] lg:text-[44px] leading-[0.95] font-bold tracking-[-0.02em]">Eurozone Coverage,<br />Real-Time Compliance</h2>
          </div>
          <p className="max-w-[420px] text-[15px] leading-6 text-slate-600">London → Berlin → Paris corridor with 20+ Eurozone Countries mapped. Blue pins for 1200+ registered businesses, GDPR compliant, AI Act aligned, VAT ready.</p>
        </div>

        <div className="card-drop relative rounded-[32px] border border-slate-100 bg-white shadow-[var(--shadow-card)] overflow-hidden p-2 lg:p-3">
          <div className="rounded-[24px] overflow-hidden bg-[#F8FAFC] relative">
            <img src={complianceImg} alt="Eurozone Compliance Live Map" className="w-full aspect-[16/9] object-cover" />
            <div className="absolute top-5 left-5 right-5 flex flex-wrap justify-between gap-3 pointer-events-none">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-100 px-4 py-3 min-w-[180px]">
                <div className="text-[11px] font-bold tracking-widest text-slate-400">EUROZONE LIVE</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-[24px] font-bold tracking-tight">20+ Countries</span>
                  <span className="text-[12px] text-emerald-600 font-bold">● LIVE</span>
                </div>
                <div className="mt-1 text-[11px] text-slate-500">UK London • Berlin Germany • Paris France</div>
              </div>
              <div className="flex gap-2">
                {[
                  { label: "GDPR Compliant", color: "bg-emerald-500" },
                  { label: "AI Act Aligned", color: "bg-[#2962FF]" },
                  { label: "VAT Ready", color: "bg-[#76FF03]" },
                ].map(b => (
                  <div key={b.label} className="bg-white/90 backdrop-blur rounded-full border border-white shadow-lg px-3 py-2 flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${b.color}`} />
                    <span className="text-[11px] font-bold tracking-wide">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end">
              <div className="bg-slate-900 text-white rounded-2xl px-4 py-3 shadow-xl">
                <div className="text-[11px] tracking-widest opacity-60">REGISTERED BUSINESSES</div>
                <div className="text-[20px] font-bold">1,200+ • Verified & Live</div>
              </div>
              <div className="hidden lg:flex gap-2">
                <span className="bg-white rounded-full px-3 py-1.5 text-[11px] font-semibold shadow">London 🇬🇧</span>
                <span className="bg-white rounded-full px-3 py-1.5 text-[11px] font-semibold shadow">Berlin 🇩🇪</span>
                <span className="bg-white rounded-full px-3 py-1.5 text-[11px] font-semibold shadow">Paris 🇫🇷</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPLIANCE MADE SIMPLE - 3 cards dropping */}
      <section className="bg-[#F8FAFC] border-y border-slate-100">
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8 py-14 lg:py-20">
          <div className="max-w-[720px]">
            <h2 className="text-[30px] lg:text-[42px] font-bold leading-[0.95] tracking-[-0.02em]">Compliance Made Simple</h2>
            <p className="mt-3 text-[16px] leading-7 text-slate-600">Everything you need for legal, trust & regulatory compliance. White theme, best UI designer magic, card dropping + slide-in.</p>
          </div>

          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {[
              {
                title: "GDPR",
                sub: "Data privacy protection compliant",
                desc: "Automated DSR handling, consent logs, breach monitoring across all member states. Built for UK flag-off to 27 EU states.",
                icon: "🛡️",
                grad: "from-[#00E5FF] to-[#2962FF]",
                points: ["Automated DSR handling", "Consent logs", "Breach monitoring"]
              },
              {
                title: "EU AI Act",
                sub: "Risk classification transparency",
                desc: "Compliance workflows aligned to EU AI Act requirements. Reporting, transparency, risk classification for 1M+ businesses.",
                icon: "🤖",
                grad: "from-[#2962FF] to-[#76FF03]",
                points: ["Risk classification", "Transparency reporting", "Compliance workflows"]
              },
              {
                title: "VAT Compliance",
                sub: "Automated VAT filing OSS reporting",
                desc: "Invoicing for 20+ Eurozone jurisdictions. OSS, Stripe, SEPA. Production-ready, secure, transparent.",
                icon: "📄",
                grad: "from-[#012169] to-[#2962FF]",
                points: ["Automated VAT filing", "OSS reporting", "Invoicing 20+ jurisdictions"]
              },
            ].map((c, i) => (
              <div key={c.title} className="card-drop group relative rounded-[24px] bg-white border border-slate-100 p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-lift)] hover:-translate-y-1 transition-all duration-500" style={{ transitionDelay: `${i*120}ms` }}>
                <div className={`absolute top-0 inset-x-6 h-[3px] bg-gradient-to-r ${c.grad} rounded-full`} />
                <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 grid place-items-center text-[22px]">{c.icon}</div>
                <h3 className="mt-5 text-[20px] font-bold tracking-tight">{c.title}</h3>
                <div className="text-[13px] font-semibold text-slate-500 mt-1">{c.sub}</div>
                <p className="mt-3 text-[14px] leading-6 text-slate-600">{c.desc}</p>
                <div className="mt-5 space-y-2">
                  {c.points.map(p => (
                    <div key={p} className="flex items-center gap-2 text-[12px] font-medium text-slate-700">
                      <span className="h-5 w-5 rounded-full bg-slate-900 text-white grid place-items-center text-[10px]">✓</span> {p}
                    </div>
                  ))}
                </div>
                <div className="mt-6 inline-flex items-center gap-1 text-[12px] font-bold tracking-wide text-slate-900">Learn more <span>→</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GET IN TOUCH + LEGAL & TRUST */}
      <section id="contact" className="mx-auto max-w-[1280px] px-5 lg:px-8 py-14 lg:py-20 grid lg:grid-cols-[1.15fr_0.85fr] gap-8">
        <div className="card-drop rounded-[28px] border border-slate-100 bg-white p-7 lg:p-8 shadow-[var(--shadow-card)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[28px] font-bold tracking-tight leading-none">Get in Touch</h2>
              <p className="mt-2 text-[14px] leading-6 text-slate-600 max-w-[420px]">Questions about compliance for your business? Our team is here to help. GDPR compliant data processing. Trusted by 500+ businesses across Eurozone.</p>
            </div>
            <span className="hidden lg:inline-flex rounded-full bg-slate-900 text-white px-3 py-1 text-[11px] font-bold tracking-widest">RESPONSE &lt; 2H • CET</span>
          </div>

          <div className="mt-8 grid gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-[12px] font-semibold tracking-wide text-slate-700">Full Name</span>
                <input value={form.name} onChange={e=>setForm({...form, name: e.target.value})} placeholder="Jane Doe" className="mt-2 w-full h-[48px] rounded-2xl border border-slate-200 bg-white px-4 text-[14px] outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition" />
              </label>
              <label className="block">
                <span className="text-[12px] font-semibold tracking-wide text-slate-700">Business Email</span>
                <input value={form.email} onChange={e=>setForm({...form, email: e.target.value})} placeholder="jane@yourcompany.eu" className="mt-2 w-full h-[48px] rounded-2xl border border-slate-200 bg-white px-4 text-[14px] outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition" />
              </label>
            </div>
            <label className="block">
              <span className="text-[12px] font-semibold tracking-wide text-slate-700">Message</span>
              <textarea value={form.message} onChange={e=>setForm({...form, message: e.target.value})} placeholder="Tell us about compliance needs..." rows={5} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-4 text-[14px] outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition resize-none" />
            </label>
            <label className="flex items-start gap-3 py-1">
              <input type="checkbox" checked={form.consent} onChange={e=>setForm({...form, consent: e.target.checked})} className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
              <span className="text-[12px] leading-5 text-slate-600">We respect privacy. GDPR compliant data processing. Your data is encrypted end-to-end. ISO27001 • SOC2 Type II.</span>
            </label>

            <button disabled={busy} onClick={handleSend} className="mt-2 h-[52px] rounded-full bg-[#012169] text-white text-[14px] font-bold tracking-wide shadow-[0_12px_28px_rgba(1,33,105,0.3)] hover:bg-[#001a53] disabled:opacity-60 transition flex items-center justify-center gap-2">
              {busy ? "Sending..." : sent ? "✓ Message Sent" : "Send Message"} {!busy && !sent && <span>→</span>}
            </button>

            {inquiries.length>0 && (
              <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <div className="text-[11px] font-bold tracking-widest text-slate-400">RECENT INQUIRIES • {inquiries.length}</div>
                <div className="mt-3 space-y-2 max-h-[160px] overflow-auto">
                  {inquiries.slice(0,5).map((r:any)=>(
                    <div key={r.id} className="flex items-center justify-between text-[12px] bg-white border border-slate-100 rounded-xl px-3 py-2">
                      <span className="font-semibold">{r.value?.name || r.value?.email}</span>
                      <span className="text-slate-500 truncate max-w-[180px]">{r.value?.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-drop rounded-[28px] border border-slate-100 bg-white p-7 shadow-[var(--shadow-soft)]">
            <h3 className="text-[18px] font-bold tracking-tight">Legal & Trust</h3>
            <div className="mt-6 space-y-6">
              <div>
                <div className="text-[11px] font-bold tracking-widest text-slate-400 flex items-center gap-2"><span className="h-5 w-5 rounded-full bg-slate-900 text-white grid place-items-center text-[10px]">✓</span> LEGAL</div>
                <div className="mt-3 grid grid-cols-1 gap-2">
                  {["Terms of Service","Privacy Policy","Data Processing Agreement","Cookie Policy","Sub-processors List"].map(l => (
                    <a key={l} href="#" className="flex items-center justify-between rounded-xl border border-slate-100 bg-[#F8FAFC] px-4 py-3 text-[13px] font-medium hover:bg-white hover:shadow-sm transition">
                      <span>{l}</span><span className="text-slate-400">↗</span>
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-bold tracking-widest text-slate-400 flex items-center gap-2"><span className="h-5 w-5 rounded-full bg-emerald-500 text-white grid place-items-center text-[10px]">✓</span> TRUST & SECURITY</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["ISO27001 Certified","SOC2 Type II","Encrypted end-to-end","GDPR Compliant","AI Act Aligned","VAT Ready"].map(b => (
                    <span key={b} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold tracking-wide text-slate-700">{b}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-bold tracking-widest text-slate-400 flex items-center gap-2"><span className="h-5 w-5 rounded-full bg-[#2962FF] text-white grid place-items-center text-[10px]">✓</span> SUPPORT</div>
                <div className="mt-3 rounded-2xl bg-slate-900 text-white p-4">
                  <div className="text-[12px] opacity-70">Business hours Mon-Fri 9:00-18:00 CET</div>
                  <div className="mt-1 text-[14px] font-semibold">support@eurozonecompliance.eu</div>
                  <div className="mt-3 h-px bg-white/10" />
                  <div className="mt-3 text-[11px] opacity-60">2024 Eurozone Business Compliance Hub • Torch of God constancy • OS Delivered Africa + Europe</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] gradient-uk p-[1px]">
            <div className="rounded-[23px] bg-white p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl overflow-hidden bg-black"><img src={logoImg} alt="AiKOVA" className="h-full w-full object-cover" /></div>
              <div>
                <div className="text-[13px] font-bold">AiKOVA — Built for Africa, Ready for Eurozone</div>
                <div className="text-[11px] text-slate-500">Trusted by 500+ businesses • 1M+ Businesses • €4.2T GDP</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION MAP INTEGRATION */}
      <section className="bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.12]"><div className="absolute inset-0 gradient-uk" /></div>
        <div className="relative mx-auto max-w-[1280px] px-5 lg:px-8 py-14 lg:py-20 grid lg:grid-cols-[0.95fr_1.05fr] gap-10 items-center">
          <div className="card-drop rounded-[28px] overflow-hidden border border-white/10 bg-white/[0.06] backdrop-blur p-2">
            <div className="rounded-[20px] overflow-hidden bg-white">
              <img src={missionImg} alt="Eurozone Company Mission Map Connecting UK & EU27 1M+ Businesses London -> Berlin -> Paris" className="w-full aspect-[4/3] object-cover" />
            </div>
            <div className="p-4 grid grid-cols-3 gap-3 text-[11px]">
              <div><div className="font-bold tracking-widest opacity-60">COVERAGE</div><div className="mt-1 font-bold text-[13px]">UK + 27 EU Countries</div></div>
              <div><div className="font-bold tracking-widest opacity-60">MISSION</div><div className="mt-1">To empower 1M+ businesses</div></div>
              <div><div className="font-bold tracking-widest opacity-60">VISION</div><div className="mt-1">Connected resilient ecosystem London Berlin Paris</div></div>
            </div>
          </div>

          <div className="slide-in">
            <div className="inline-flex rounded-full bg-white/10 border border-white/10 px-3 py-1 text-[11px] font-bold tracking-widest">EUROZONE COMPANY - MISSION MAP • CONNECTING UK & EU27 • 1M+ BUSINESSES</div>
            <h2 className="mt-5 text-[32px] lg:text-[44px] leading-[0.9] font-bold tracking-[-0.02em]">London → Berlin → Paris<br />Torch of God constancy</h2>
            <div className="mt-6 grid sm:grid-cols-2 gap-4 text-[13px] leading-6">
              <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
                <div className="text-[11px] font-bold tracking-widest opacity-60">EU 27 MEMBER STATES</div>
                <div className="mt-2 leading-5 opacity-90">Austria Belgium Bulgaria Croatia Cyprus Czechia Denmark Estonia Finland France Germany Greece Hungary Ireland Italy Latvia Lithuania Luxembourg Malta Netherlands Poland Portugal Romania Slovakia Slovenia Spain Sweden</div>
              </div>
              <div className="space-y-3">
                <div className="rounded-2xl bg-white text-slate-900 p-4">
                  <div className="text-[11px] font-bold tracking-widest text-slate-400">KEY OBJECTIVES</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["Expand Market Access","Build Connectivity","Drive Innovation"].map(o => (
                      <span key={o} className="rounded-full bg-slate-900 text-white px-3 py-1 text-[11px] font-semibold">{o}</span>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl bg-white/10 border border-white/10 p-4 flex gap-6">
                  <div><div className="text-[20px] font-bold">1M+ Businesses</div><div className="text-[11px] opacity-70">Impact</div></div>
                  <div><div className="text-[20px] font-bold">€4.2T GDP</div><div className="text-[11px] opacity-70">Single Market</div></div>
                  <div><div className="text-[20px] font-bold">500+ Partners</div><div className="text-[11px] opacity-70">Trusted</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MASTER SITEMAP - ALL 11 */}
      <section id="sitemap" className="mx-auto max-w-[1280px] px-5 lg:px-8 py-14 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold tracking-widest shadow-sm">MASTER SITEMAP • 11 PAGES • UK FLAG-OFF TO 27 EU STATES</div>
            <h2 className="mt-4 text-[32px] lg:text-[48px] leading-[0.9] font-bold tracking-[-0.03em]">Eurozone 11 Pages Complete<br /><span className="gradient-text-uk">UK Flag-Off to 27 EU States</span></h2>
          </div>
          <div className="text-[13px] text-slate-600 max-w-[380px]">Production-ready white theme, rounded 2xl, soft shadows, card dropping + slide-in via IntersectionObserver. Best UI designer magic, images that speak.</div>
        </div>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SITEMAP.map((p, idx) => (
            <div key={p.n} className="card-drop group relative rounded-[22px] border border-slate-100 bg-white p-5 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] hover:-translate-y-0.5 transition-all duration-500" style={{ transitionDelay: `${(idx%3)*90}ms` }}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full gradient-uk grid place-items-center text-white text-[13px] font-bold shadow">No.{p.n}</div>
                  <div>
                    <div className="text-[14px] font-bold leading-none">{p.title}</div>
                    <div className="text-[11px] font-mono text-slate-500 mt-1">{p.path}</div>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 text-[10px] font-bold tracking-widest">DONE</span>
              </div>
              <div className="mt-4 text-[13px] leading-6 text-slate-600 line-clamp-3">{p.desc}</div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[18px]">{p.icon}</span>
                <span className={`text-[11px] font-bold tracking-widest px-2.5 py-1 rounded-full border ${p.n===11 ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 text-slate-600 border-slate-100"}`}>{p.n===11 ? "THIS PAGE • FINAL 🇬🇧🇪🇺" : "PRODUCTION READY"}</span>
              </div>
              <div className="absolute top-0 inset-x-5 h-[2px] bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-0 group-hover:opacity-100 transition" />
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA BANNER GRADIENT UK */}
      <section className="mx-auto max-w-[1280px] px-5 lg:px-8 pb-12">
        <div className="relative rounded-[28px] overflow-hidden p-[1.5px] gradient-uk">
          <div className="relative rounded-[26px] bg-slate-900 overflow-hidden">
            <div className="absolute inset-0 gradient-uk opacity-20" />
            <div className="absolute -right-24 -top-24 h-[380px] w-[380px] rounded-full bg-white/10 blur-[40px]" />
            <div className="relative px-7 lg:px-10 py-8 lg:py-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="max-w-[680px]">
                <div className="inline-flex rounded-full bg-white/10 border border-white/10 px-3 py-1 text-[11px] font-bold tracking-widest text-white">FINAL CTA • EUROZONE 11 PAGES COMPLETE</div>
                <h3 className="mt-4 text-[22px] lg:text-[28px] leading-[1.05] font-bold text-white tracking-tight">Eurozone 11 Pages Complete • UK Flag-Off to 27 EU States • 1M+ Businesses • London → Berlin → Paris • Torch of God constancy • OS Delivered Africa + Europe</h3>
                <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                  {["Built for Africa • Ready for Any Business • Now Building for Eurozone","27 Countries • Single Market • Harmonised Trade","Updated 2024 • Confidential • Internal Strategy"].map(t => (
                    <span key={t} className="rounded-full bg-white/10 border border-white/10 px-3 py-1 text-white/80">{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <a href={startSetupUrl("eurozone")} id="assess-button-main-hero"  className="relative h-[52px] rounded-full bg-white text-slate-900 px-7 text-[14px] font-bold shadow-xl hover:bg-slate-50 transition">Start free trial →</a>
                <button onClick={()=>scrollTo("sitemap")} className="h-[52px] rounded-full bg-white/10 border border-white/20 text-white px-7 text-[14px] font-semibold backdrop-blur hover:bg-white/15 transition">Download All Artifacts</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 bg-[#F8FAFC]">
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8 py-12 grid lg:grid-cols-[1.2fr_1fr_1fr] gap-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl overflow-hidden bg-black"><img src={logoImg} alt="AiKOVA Logo" className="h-full w-full object-cover" /></div>
              <span className="font-bold text-[18px] tracking-tight">AiKOVA</span>
            </div>
            <p className="mt-4 text-[14px] leading-6 text-slate-600 max-w-[380px]">Built for Africa. Ready for Any Business. Now Building for Eurozone. Eurozone Business Compliance Hub — Compliant, Trusted, Ready.</p>
            <div className="mt-5 flex gap-2">
              {["Market Access","Regulatory Alignment","Innovation Funding","Sustainable Growth"].map(p => (
                <span key={p} className="rounded-full bg-white border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-600">{p}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-widest text-slate-400">ALL 11 PAGES</div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-[13px]">
              {SITEMAP.map(s => (
                <a key={s.n} href={s.path} className="text-slate-600 hover:text-slate-900"><span className="font-mono text-[11px] text-slate-400">/{s.n}</span> {s.title}</a>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-widest text-slate-400">EUROZONE • SINGLE MARKET</div>
            <p className="mt-4 text-[13px] leading-6 text-slate-600">27 countries • Single Market • Harmonised Trade • GDPR AI Act VAT Legal Privacy Cookies • Trusted by 500+ businesses across Eurozone • 2024 Eurozone Business Compliance Hub</p>
            <div className="mt-5 rounded-2xl bg-white border border-slate-200 p-4">
              <div className="text-[11px] font-bold tracking-widest text-slate-400">STRATEGIC PILLARS</div>
              <div className="mt-2 text-[12px] leading-5 text-slate-700">Market Access • Regulatory Alignment • Innovation Funding • Sustainable Growth • 1M+ Businesses • €4.2T GDP • London → Berlin → Paris</div>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-100 py-5">
          <div className="mx-auto max-w-[1280px] px-5 lg:px-8 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500">
            <span>© 2024 Eurozone Business Compliance Hub • GDPR • AI Act • VAT • Legal • Privacy • Cookies • UK Flag-Off • Torch of God constancy • OS Delivered Africa + Europe</span>
            <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Production Ready • White #FFFFFF • Alt #F8FAFC • Slate #0F172A</span>
          </div>
        </div>
      </footer>

      <style>{`
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}
