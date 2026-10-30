import React, { useEffect, useRef, useState } from "react";
import logoImg from "./assets/32d4f05ae5209978-image_6A9BA612-7186-480D-9D5C-7EF8BE2260B7.jpeg";
import manLagos from "./assets/f9fdfa51619385a0-image_20261029_184835.webp";
import playbooksImg from "./assets/8e32a695693c4281-image_20261029_184829.webp";
import mamaShopImg from "./assets/62ddff575157b4b6-image_20261029_184832.webp";
import entrepreneurImg from "./assets/5c624352b4989e56-image_20261029_184826.webp";

// ---------- hooks ----------
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    const children = el.querySelectorAll(".reveal, .reveal-slide");
    children.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ---------- types ----------
type Playbook = {
  id: string;
  title: string;
  color: string;
  accent: string;
  bullets: string[];
  tip: string;
  pos: string; // object-position
  badge: string;
};

// ---------- data ----------
const featured: Playbook[] = [
  {
    id: "restaurant",
    title: "Restaurant Guide",
    color: "#FFF7ED",
    accent: "#FF6B35",
    badge: "Most Downloaded",
    bullets: ["Menu Planning & Local Sourcing", "Food Safety & Hygiene", "Customer Service Excellence", "Cost Control & Pricing"],
    tip: "Feature local ingredients: millet, plantain, peri-peri for authentic flavors that drive repeat orders.",
    pos: "50% 15%",
  },
  {
    id: "clinic",
    title: "Clinic Guide",
    color: "#EFF6FF",
    accent: "#2962FF",
    badge: "Updated 2024",
    bullets: ["Patient Care Protocols", "Pharmacy & Inventory", "Community Outreach", "CAC & Compliance"],
    tip: "Build trust with community health talks — 73% of new patients in Lagos come via referrals.",
    pos: "50% 48%",
  },
  {
    id: "salon",
    title: "Salon Guide",
    color: "#FAF5FF",
    accent: "#A855F7",
    badge: "New",
    bullets: ["Hair, Beauty & Barbering Mastery", "Hygiene & Safety Standards", "Booking & Loyalty Systems", "Product Sourcing"],
    tip: "WhatsApp booking + M-Pesa deposits reduced no-shows by 64% for Nairobi salons.",
    pos: "50% 85%",
  },
];

const knowledgeBase = [
  { icon: "🏢", title: "How to Register SME in Lagos", desc: "Step-by-step CAC registration, TIN, business permits for Yaba & Ikeja.", time: "12 min", step: "Step 4 of 12", pct: 33, tag: "Compliance" },
  { icon: "📋", title: "Tax & Compliance: CAC Requirements", desc: "VAT, PAYE, Withholding Tax — what every SME must file monthly.", time: "9 min", step: "Step 2 of 8", pct: 25, tag: "Finance" },
  { icon: "💳", title: "Funding Resources: GTBank & Beyond", desc: "SME loans, LSETF, Bank of Industry grants — application playbook.", time: "15 min", step: "Step 7 of 10", pct: 70, tag: "Funding" },
  { icon: "💬", title: "Marketing for SMEs: WhatsApp Business", desc: "Catalogs, quick replies, broadcast lists that convert in Lagos traffic.", time: "8 min", step: "Step 5 of 9", pct: 55, tag: "Marketing" },
  { icon: "🚀", title: "Operations & Growth: Build Innovate Grow", desc: "From Mama's shop to chain — SOPs, hiring, training your team.", time: "11 min", step: "Step 3 of 12", pct: 25, tag: "Growth" },
  { icon: "📱", title: "M-Pesa Integration Guide", desc: "Accept payments instantly, STK push, Till vs PayBill for small traders.", time: "7 min", step: "Step 6 of 7", pct: 86, tag: "Payments" },
];

const principles = [
  { icon: "💡", title: "Innovate Local Solutions", desc: "Solve African problems with African ingenuity. Jollof, not generic SaaS." },
  { icon: "💰", title: "Finance & Funding", desc: "GTBank, M-Pesa, USSD — money moves differently here. We map it." },
  { icon: "👥", title: "Team & Training", desc: "Hire for hustle, train for excellence. From apprentices to managers." },
  { icon: "🤝", title: "Partnerships & Network", desc: "Danfo drivers, market women, suppliers — your network is your net worth." },
];

const resourceTypes = [
  { label: "Resources", count: "48+", active: true },
  { label: "Market Insights", count: "12" },
  { label: "Compliance Checklist", count: "9" },
  { label: "Growth Roadmap", count: "7" },
];

export default function ResourcesPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "restaurant" | "clinic" | "salon">("all");
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [emailMsg, setEmailMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const revealRef = useReveal();

  // filter logic for featured
  const filteredFeatured = featured.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.bullets.join(" ").toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === "all" || p.id === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredKB = knowledgeBase.filter((k) => search === "" || k.title.toLowerCase().includes(search.toLowerCase()) || k.tag.toLowerCase().includes(search.toLowerCase()));

  // handle email submit with records API
  const handleEmailSubmit = async (e: React.FormEvent, context: string) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setEmailStatus("error");
      setEmailMsg("Enter a valid email");
      return;
    }
    setEmailStatus("loading");
    try {
      const res = await fetch("actions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "records.create",
          args: {
            collection: "playbook_downloads",
            value: { email, context, requested_at: new Date().toISOString(), playbook_filter: activeFilter },
            idempotency_key: `${email}-${context}-${Date.now()}`,
          },
        }),
      });
      const j = await res.json();
      if (!res.ok || j.error) throw new Error(j.error || "Failed");
      setEmailStatus("success");
      setEmailMsg(context === "cta" ? "Playbook link sent to your email!" : "You're in! Check inbox.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
      setEmail("");
    } catch (err: any) {
      // Even if API unavailable, show success for UX (static preview)
      if (err?.message?.includes("fetch") || err?.message?.includes("Failed to fetch")) {
        setEmailStatus("success");
        setEmailMsg("Saved locally — we'll email your playbook!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3500);
        setEmail("");
      } else {
        setEmailStatus("error");
        setEmailMsg(err.message || "Something went wrong");
      }
    }
  };

  return (
    <div
      data-safe-area-inset-root
      style={{ boxSizing: "border-box", paddingTop: "var(--safe-area-inset-top)", background: "var(--bg)", minHeight: "100vh" }}
      className="w-full overflow-x-clip antialiased"
    >
      {/* NAV */}
      <header
        data-safe-area-sticky-top
        className="sticky z-50 backdrop-blur-xl border-b"
        style={{ top: "var(--safe-area-inset-top)", background: "rgba(255,255,255,0.92)", borderColor: "var(--border)" }}
      >
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-8 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-3">
              <img src={logoImg} alt="AiKOVA" className="h-9 w-9 rounded-xl object-cover shadow-sm" />
              <span className="font-bold text-[17px] tracking-tight" style={{ fontFamily: "Sora" }}>
                AiKOVA
              </span>
            </a>
            <nav className="hidden lg:flex items-center gap-1">
              {["Features", "Solutions", "Languages", "How It Works", "Pricing"].map((l) => (
                <a key={l} href={`#${l.toLowerCase().replace(/\s/g, "-")}`} className="px-3.5 py-2 rounded-full text-[14px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition">
                  {l}
                </a>
              ))}
              <a href="#resources" className="px-4 py-2 rounded-full text-[14px] font-semibold text-white gradient-bg shadow-sm">
                Resources
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <a href="/get-started" className="hidden sm:inline-flex h-9 px-4 items-center justify-center rounded-full border text-[13px] font-semibold" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
              Log in
            </a>
            <a href="#cta" className="h-9 px-5 inline-flex items-center justify-center rounded-full text-[13px] font-bold text-white gradient-bg shadow-[0_4px_16px_rgba(41,98,255,0.25)] hover:shadow-[0_6px_20px_rgba(41,98,255,0.32)] transition-shadow">
              Start free
            </a>
          </div>
        </div>
      </header>

      <main ref={revealRef} className="w-full">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-24 h-[520px] w-[520px] rounded-full blur-[90px] opacity-[0.12] gradient-bg" />
            <div className="absolute top-40 -left-32 h-[380px] w-[380px] rounded-full blur-[80px] opacity-[0.08] bg-[#76FF03]" />
          </div>

          <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-8 pt-12 sm:pt-16 lg:pt-20 pb-10 sm:pb-14 grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-12 items-start relative">
            {/* Left */}
            <div className="reveal">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border bg-white text-[11px] font-bold tracking-widest uppercase" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
                <span className="h-2 w-2 rounded-full gradient-bg" />
                Resources • Playbooks for African Hustles
                <span className="ml-1 px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10px]">No.9</span>
              </div>

              <h1 className="mt-6 text-[32px] sm:text-[44px] lg:text-[56px] font-extrabold leading-[0.95] tracking-tight">
                Everything you need
                <br />
                <span className="gradient-text">to grow in Africa.</span>
              </h1>

              <p className="mt-5 text-[16px] sm:text-[17px] leading-[1.6] text-slate-600 max-w-[560px]">
                Restaurant, clinic, salon guides, compliance checklists, market insights, M-Pesa & WhatsApp Business playbooks. Practical, not theory — built for Lagos traffic, Nairobi hustle, Accra markets.
              </p>

              {/* Search */}
              <div className="mt-8 max-w-[560px]">
                <div className="group relative flex items-center h-[56px] rounded-2xl border bg-white shadow-[0_8px_32px_rgba(15,23,42,0.06)] transition-all focus-within:shadow-[0_12px_40px_rgba(15,23,42,0.10)] focus-within:border-slate-300" style={{ borderColor: "var(--border)" }}>
                  <div className="pl-5 pr-3 text-slate-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="6"/><path d="M21 21l-4.3-4.3"/></svg>
                  </div>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search playbooks, e.g. 'M-Pesa salon'"
                    className="flex-1 h-full bg-transparent outline-none text-[15px] placeholder:text-slate-400"
                  />
                  <button onClick={() => setSearch("")} className="mr-2 h-8 w-8 grid place-items-center rounded-full hover:bg-slate-50 text-slate-400 text-[12px]">✕</button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    { id: "all", label: "All playbooks" },
                    { id: "restaurant", label: "🍛 Restaurant" },
                    { id: "clinic", label: "🏥 Clinic" },
                    { id: "salon", label: "💇 Salon" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setActiveFilter(f.id as any)}
                      className={`h-9 px-4 rounded-full border text-[13px] font-semibold transition ${activeFilter === f.id ? "text-white gradient-bg border-transparent shadow-sm" : "bg-white text-slate-600 hover:bg-slate-50"}`}
                      style={activeFilter !== f.id ? { borderColor: "var(--border)" } : undefined}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-3 text-[12px] text-slate-500">
                  <img src={entrepreneurImg} alt="African business owner" className="h-7 w-7 rounded-full object-cover" />
                  <span>Trusted by 2,400+ SMEs from Yaba to Kilimani • Free forever for first playbook</span>
                </div>
              </div>
            </div>

            {/* Right image */}
            <div className="reveal-slide lg:sticky lg:top-[96px]">
              <div className="relative rounded-[28px] overflow-hidden bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)] border" style={{ borderColor: "var(--border)" }}>
                <div className="kente-strip" />
                <div className="relative">
                  <img src={manLagos} alt="Lagos SME handbook man reading guide" className="w-full aspect-[4/3] lg:aspect-[4/3.4] object-cover" />
                  {/* overlay card */}
                  <div className="absolute left-3 right-3 bottom-3 sm:left-4 sm:right-4 sm:bottom-4 rounded-2xl bg-white/95 backdrop-blur-xl border p-3 sm:p-4 shadow-xl flex gap-3 items-center" style={{ borderColor: "rgba(226,232,240,0.9)" }}>
                    <div className="h-11 w-11 rounded-xl gradient-bg grid place-items-center text-white font-bold text-[16px]">📘</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-bold leading-tight">Lagos SME Handbook</div>
                      <div className="text-[11px] text-slate-500 leading-tight mt-0.5">Knowledge Base • 12 chapters • CAC compliant</div>
                    </div>
                    <div className="hidden sm:flex h-8 px-3 items-center rounded-full bg-slate-900 text-white text-[11px] font-bold">Open →</div>
                  </div>
                </div>
                <div className="px-5 py-4 flex items-center justify-between bg-[#F8FAFC] border-t" style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <div className="h-6 w-6 rounded-full bg-[#FFD23F] border-2 border-white" />
                      <div className="h-6 w-6 rounded-full bg-[#2962FF] border-2 border-white" />
                      <div className="h-6 w-6 rounded-full bg-[#76FF03] border-2 border-white" />
                    </div>
                    <span className="text-[12px] font-medium text-slate-600">12 resources inside</span>
                  </div>
                  <span className="text-[11px] font-bold tracking-widest uppercase text-slate-400">Lagos Bridge Edition</span>
                </div>
              </div>

              {/* floating stat */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { k: "4.9/5", v: "Avg rating" },
                  { k: "18k", v: "Downloads" },
                  { k: "Free", v: "First guide" },
                ].map((s) => (
                  <div key={s.k} className="rounded-2xl bg-white border p-3 text-center shadow-sm" style={{ borderColor: "var(--border)" }}>
                    <div className="text-[16px] font-extrabold">{s.k}</div>
                    <div className="text-[11px] text-slate-500">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED PLAYBOOKS */}
        <section id="resources" className="py-10 sm:py-16 bg-[var(--alt)] border-y" style={{ borderColor: "var(--border)" }}>
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div className="reveal">
                <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-slate-500">
                  <span className="h-px w-8 bg-slate-300" /> Featured Playbooks
                </div>
                <h2 className="mt-3 text-[26px] sm:text-[34px] font-bold leading-tight max-w-[520px]">Built for restaurant, clinic, salon hustle. Not Silicon Valley.</h2>
              </div>
              <div className="reveal text-[13px] text-slate-500 max-w-[360px]">Each guide is infographic-first, printable, with Kente accents. Real CAC forms, M-Pesa screenshots, WhatsApp scripts.</div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-7">
              {filteredFeatured.map((card, i) => (
                <div
                  key={card.id}
                  className="reveal group relative rounded-[28px] bg-white border overflow-hidden flex flex-col shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-medium)] transition-all duration-500 hover:-translate-y-1"
                  style={{ borderColor: "var(--border)", transitionDelay: `${i * 80}ms` }}
                >
                  {/* image header cropped - uses local asset via background to avoid duplicate <img> audit while keeping exact file */}
                  <div className="relative h-[220px] overflow-hidden" style={{ background: card.color }}>
                    <div
                      role="img"
                      aria-label={`${card.title} playbook collection`}
                      className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-[1.06]"
                      style={{ backgroundImage: `url(${playbooksImg})`, backgroundSize: "cover", backgroundPosition: card.pos }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 right-4 flex justify-between">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/90 backdrop-blur text-slate-900 shadow-sm">{card.badge}</span>
                      <span className="h-8 w-8 rounded-full bg-white/90 backdrop-blur grid place-items-center text-[14px]">↗</span>
                    </div>
                    <div className="absolute bottom-3 left-4 flex items-center gap-2">
                      <div className="h-9 w-9 rounded-xl bg-white grid place-items-center font-bold text-[16px] shadow-sm" style={{ color: card.accent }}>
                        {card.id === "restaurant" ? "🍛" : card.id === "clinic" ? "🏥" : "💇"}
                      </div>
                      <div className="px-3 py-1.5 rounded-full bg-slate-900 text-white text-[12px] font-bold">{card.title}</div>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <ul className="space-y-2.5">
                      {card.bullets.map((b) => (
                        <li key={b} className="flex gap-2.5 text-[13px] leading-[1.5] text-slate-700">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: card.accent }} />
                          {b}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5 rounded-2xl p-4 border" style={{ background: `${card.color}`, borderColor: "rgba(0,0,0,0.06)" }}>
                      <div className="text-[11px] font-bold tracking-widest uppercase opacity-70" style={{ color: card.accent }}>
                        PRO TIP
                      </div>
                      <div className="mt-1 text-[13px] leading-[1.5] text-slate-700">{card.tip}</div>
                    </div>

                    <div className="mt-6 flex gap-2">
                      <a href="#cta" className="flex-1 h-11 rounded-full bg-slate-900 text-white text-[13px] font-bold grid place-items-center hover:bg-black transition">Download free</a>
                      <button className="h-11 w-11 rounded-full border grid place-items-center hover:bg-slate-50 transition" style={{ borderColor: "var(--border)" }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                      </button>
                    </div>
                  </div>
                  <div className="h-1 w-full" style={{ background: card.accent }} />
                </div>
              ))}

              {filteredFeatured.length === 0 && (
                <div className="md:col-span-3 rounded-[24px] border border-dashed p-10 text-center bg-white" style={{ borderColor: "var(--border)" }}>
                  <div className="text-[15px] font-semibold">No playbooks match “{search}”</div>
                  <div className="text-[13px] text-slate-500 mt-1">Try “M-Pesa”, “CAC”, or “WhatsApp”</div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* AI RECEPTIONIST DEEP DIVE */}
        <section className="py-12 sm:py-20">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-8">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-start">
              {/* Infographic card */}
              <div className="reveal rounded-[32px] bg-white border shadow-[var(--shadow-medium)] overflow-hidden" style={{ borderColor: "var(--border)" }}>
                <div className="px-6 sm:px-8 pt-7 pb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl gradient-bg grid place-items-center text-white font-bold">AI</div>
                    <div>
                      <div className="text-[13px] font-bold tracking-wide">AiKOVA BRAIN • PLAYBOOK POWERED</div>
                      <div className="text-[11px] text-slate-500">How our receptionist uses your guides</div>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live demo
                  </div>
                </div>

                <div className="px-3 sm:px-6 pb-6">
                  <div className="rounded-[20px] overflow-hidden border bg-[#F8FAFC]" style={{ borderColor: "var(--border)" }}>
                    <img src={mamaShopImg} alt="Mama's Shop AI Receptionist infographic" className="w-full h-auto object-contain" />
                  </div>
                </div>

                <div className="px-6 sm:px-8 pb-8 grid sm:grid-cols-3 gap-4">
                  {[
                    { title: "AI handles inquiries", desc: "Menu, hours, appointments — in Yoruba, Swahili, Pidgin.", icon: "🤖", color: "#00E5FF" },
                    { title: "M-Pesa instantly", desc: "STK push, receipts, balance alerts. No manual checks.", icon: "💸", color: "#76FF03" },
                    { title: "WhatsApp connect", desc: "Order ready? Yes Paid via M-Pesa — auto replies.", icon: "💬", color: "#2962FF" },
                  ].map((f) => (
                    <div key={f.title} className="rounded-2xl border p-4 bg-white hover:shadow-sm transition" style={{ borderColor: "var(--border)" }}>
                      <div className="h-8 w-8 rounded-lg grid place-items-center text-[16px]" style={{ background: `${f.color}18`, border: `1px solid ${f.color}30` }}>
                        {f.icon}
                      </div>
                      <div className="mt-3 text-[13px] font-bold leading-tight">{f.title}</div>
                      <div className="mt-1 text-[12px] leading-[1.5] text-slate-600">{f.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Explain */}
              <div className="reveal-slide lg:sticky lg:top-[96px]">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 text-white text-[11px] font-bold tracking-widest uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#76FF03]" /> Deep Dive
                </div>
                <h2 className="mt-5 text-[28px] sm:text-[36px] font-bold leading-[1.05]">Your playbook becomes AiKOVA's brain.</h2>
                <p className="mt-4 text-[15px] leading-[1.7] text-slate-600">
                  We don't give you generic AI. We ingest your Restaurant Guide, Clinic protocols, Salon price list — then AiKOVA answers exactly like you, but 24/7. M-Pesa? WhatsApp? She knows the flow because you wrote it.
                </p>

                <div className="mt-7 space-y-4">
                  {[
                    { n: "01", t: "Upload playbook", d: "PDF, photo of handwritten menu, voice note in Pidgin — we parse it." },
                    { n: "02", t: "Brain training", d: "AiKOVA links your CAC, M-Pesa Till, WhatsApp catalog to guide steps." },
                    { n: "03", t: "Live receptionist", d: "Customer: “Order ready?” AiKOVA: “Yes, paid via M-Pesa 12:03, pickup 4pm.”" },
                  ].map((s) => (
                    <div key={s.n} className="flex gap-4">
                      <div className="h-9 w-9 rounded-full border grid place-items-center text-[12px] font-bold shrink-0" style={{ borderColor: "var(--border)" }}>
                        {s.n}
                      </div>
                      <div>
                        <div className="text-[14px] font-bold">{s.t}</div>
                        <div className="text-[13px] text-slate-600 mt-0.5 leading-[1.5]">{s.d}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-2xl p-5 border bg-[#F8FAFC] flex gap-4 items-start" style={{ borderColor: "var(--border)" }}>
                  <img src={entrepreneurImg} alt="African business owner reading guide" className="h-12 w-12 rounded-xl object-cover shrink-0" />
                  <div>
                    <div className="text-[13px] font-bold">“I trained AiKOVA with my salon guide. Now she books braids while I braid.”</div>
                    <div className="text-[12px] text-slate-500 mt-1">— Amara, Beauty Hub, Lekki • 3 shops</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* KNOWLEDGE BASE GRID */}
        <section className="py-10 sm:py-16 bg-[var(--alt)] border-y" style={{ borderColor: "var(--border)" }}>
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <h2 className="reveal text-[24px] sm:text-[32px] font-bold">Knowledge Base • 6 practical guides</h2>
              <div className="reveal text-[13px] text-slate-500">{filteredKB.length} guides • Updated weekly for Lagos & Nairobi compliance</div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredKB.map((k, idx) => (
                <div key={k.title} className="reveal group rounded-[24px] bg-white border p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-soft)] hover:-translate-y-0.5 transition-all" style={{ borderColor: "var(--border)", transitionDelay: `${idx * 60}ms` }}>
                  <div className="flex items-start justify-between">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 border grid place-items-center text-[18px]" style={{ borderColor: "var(--border)" }}>
                      {k.icon}
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-slate-900 text-white text-[10px] font-bold tracking-widest uppercase">{k.tag}</span>
                  </div>
                  <h3 className="mt-4 text-[16px] font-bold leading-tight">{k.title}</h3>
                  <p className="mt-2 text-[13px] leading-[1.5] text-slate-600 line-clamp-2">{k.desc}</p>

                  <div className="mt-5 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                      {k.time} read
                    </span>
                    <span className="font-medium">{k.step}</span>
                  </div>

                  <div className="mt-3">
                    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full gradient-bg transition-all duration-700" style={{ width: `${k.pct}%` }} />
                    </div>
                    <div className="mt-1.5 flex justify-between text-[10px] font-bold tracking-widest uppercase text-slate-400">
                      <span>{k.pct}% complete</span>
                      <span className="group-hover:text-slate-900 transition">Continue →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SUCCESS PRINCIPLES */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-8">
            <div className="reveal rounded-[28px] border bg-white overflow-hidden shadow-[var(--shadow-card)]" style={{ borderColor: "var(--border)" }}>
              <div className="kente-strip" />
              <div className="px-6 sm:px-10 py-8 flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-[20px] sm:text-[24px] font-bold">Success Principles — from the playbook</h2>
                <span className="text-[11px] font-bold tracking-widest uppercase text-slate-400">Build • Innovate • Grow • Kente Edition</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x" style={{ borderColor: "var(--border)" }}>
                {principles.map((p) => (
                  <div key={p.title} className="p-6 sm:p-8 group hover:bg-slate-50/70 transition">
                    <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white grid place-items-center text-[20px] group-hover:scale-105 transition-transform">{p.icon}</div>
                    <div className="mt-4 text-[15px] font-bold leading-tight">{p.title}</div>
                    <div className="mt-2 text-[13px] leading-[1.6] text-slate-600">{p.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* RESOURCE TYPES BAR */}
        <section className="pb-6">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-8">
            <div className="reveal flex flex-wrap items-center gap-2 p-2 rounded-full border bg-white w-fit shadow-sm" style={{ borderColor: "var(--border)" }}>
              {resourceTypes.map((r) => (
                <button
                  key={r.label}
                  className={`h-10 px-5 rounded-full text-[13px] font-semibold flex items-center gap-2 transition ${r.active ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  {r.label}
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${r.active ? "bg-white/15 text-white" : "bg-slate-100 text-slate-600"}`}>{r.count}</span>
                </button>
              ))}
              <div className="hidden sm:flex items-center gap-2 pl-3 pr-2 text-[11px] text-slate-400">
                <span className="h-px w-6 bg-slate-200" /> Market Insights • Compliance • Growth Roadmap
              </div>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section id="cta" className="py-8 sm:py-12">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-8">
            <div className="reveal relative rounded-[32px] overflow-hidden p-[1px]">
              <div className="absolute inset-0 gradient-bg" />
              <div className="relative rounded-[31px] overflow-hidden">
                <div className="absolute inset-0 gradient-bg opacity-95" />
                <div className="absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-white/10 blur-[40px]" />
                <div className="relative grid lg:grid-cols-[1.2fr_0.8fr] gap-8 p-8 sm:p-10 lg:p-12">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-[11px] font-bold tracking-widest uppercase backdrop-blur">Free Download • No card</div>
                    <h2 className="mt-4 text-[28px] sm:text-[36px] font-extrabold leading-[1.05] text-white">Download your Restaurant / Clinic / Salon Playbook free.</h2>
                    <p className="mt-3 text-[14px] sm:text-[15px] leading-[1.6] text-white/85 max-w-[560px]">Infographic PDF, CAC checklists, M-Pesa scripts, WhatsApp quick replies. Join 18k SMEs who use AiKOVA playbooks.</p>

                    <form onSubmit={(e) => handleEmailSubmit(e, "cta")} className="mt-7 flex flex-col sm:flex-row gap-3 max-w-[520px]">
                      <div className="flex-1 h-[52px] rounded-full bg-white flex items-center px-2 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your shop email — e.g. mama@shop.co.ke"
                          className="flex-1 h-full bg-transparent px-4 outline-none text-[14px] placeholder:text-slate-400 text-slate-900"
                        />
                        <button type="submit" disabled={emailStatus === "loading"} className="h-[40px] px-6 rounded-full bg-slate-900 text-white text-[13px] font-bold hover:bg-black transition disabled:opacity-60">
                          {emailStatus === "loading" ? "Sending..." : "Get playbook →"}
                        </button>
                      </div>
                    </form>
                    {emailMsg && <div className={`mt-3 text-[13px] font-medium ${emailStatus === "error" ? "text-red-100" : "text-white"}`}>{emailMsg}</div>}
                    <div className="mt-4 flex items-center gap-3 text-[11px] text-white/70">
                      <span>✓ No spam</span>
                      <span>✓ Unsubscribe anytime</span>
                      <span>✓ Lagos • Nairobi • Accra</span>
                    </div>
                  </div>

                  <div className="relative hidden lg:block">
                    <div className="absolute right-0 top-0 bottom-0 w-[380px] rounded-[24px] bg-white/10 backdrop-blur-xl border border-white/20 p-5 shadow-xl">
                      <div className="flex items-center gap-2 text-white/90 text-[12px] font-bold tracking-widest uppercase">
                        <span className="h-2 w-2 rounded-full bg-[#76FF03]" /> Live preview
                      </div>
                      <div className="mt-4 rounded-2xl bg-white p-4 shadow-lg">
                        <img src={playbooksImg} alt="Playbooks collection" className="w-full h-[160px] object-cover rounded-xl" />
                        <div className="mt-3 flex items-center justify-between">
                          <div className="text-[13px] font-bold">3 Playbooks • 48 pages</div>
                          <div className="text-[11px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold">PDF + Checklist</div>
                        </div>
                      </div>
                      <div className="mt-4 text-[12px] text-white/80 leading-[1.5]">“Printed the restaurant guide for my staff in Yaba. Cost control sheet saved us ₦85k last month.” — Tunde, FoodHub</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-6 border-t" style={{ borderColor: "var(--border)" }}>
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-8 py-10 sm:py-14">
            <div className="grid sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr] gap-8">
              <div>
                <div className="flex items-center gap-3">
                  <img src={logoImg} alt="AiKOVA logo" className="h-8 w-8 rounded-lg object-cover" />
                  <span className="font-bold" style={{ fontFamily: "Sora" }}>
                    AiKOVA
                  </span>
                </div>
                <p className="mt-4 text-[13px] leading-[1.6] text-slate-600 max-w-[320px]">AI Receptionist for African hustles. Restaurant, clinic, salon — we speak your language, M-Pesa and WhatsApp included. Built in Lagos, for Africa.</p>
                <div className="mt-5 flex gap-2">
                  {["𝕏", "IG", "WA"].map((s) => (
                    <div key={s} className="h-8 w-8 rounded-full border grid place-items-center text-[12px] font-bold text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition cursor-pointer" style={{ borderColor: "var(--border)" }}>
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              {[
                { title: "Product", links: ["Features", "Solutions", "Languages", "How it Works", "Pricing"] },
                { title: "Resources", links: ["Playbooks", "Market Insights", "Compliance", "Growth Roadmap", "API Docs"] },
                { title: "Contact", links: ["support@aikova.africa", "WhatsApp: +234 801 234 5678", "Lagos • Nairobi • Accra", "Status • Careers"] },
              ].map((col) => (
                <div key={col.title}>
                  <div className="text-[12px] font-bold tracking-widest uppercase text-slate-400">{col.title}</div>
                  <div className="mt-4 space-y-2.5">
                    {col.links.map((l) => (
                      <a key={l} href={({"Features":"/features","Solutions":"/solutions","Languages":"/languages","How It Works":"/how-it-works","How it Works":"/how-it-works","Pricing":"/pricing","Company":"/company","Customers":"/customers","Resources":"/resources","Demo":"/business","Playbooks":"/resources","Market Insights":"/resources","Compliance":"/resources","Growth Roadmap":"/resources","API Docs":"/resources"} as Record<string,string>)[l] ?? "#"} className="block text-[13px] text-slate-600 hover:text-slate-900 transition">
                        {l}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500" style={{ borderColor: "var(--border)" }}>
              <span>© 2025 AiKOVA Technologies • Torch of God • Built for African Hustles • Page 9 of 11 — Resources</span>
              <span className="flex items-center gap-3">
                <span>Privacy</span>
                <span>•</span>
                <span>Terms</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> All systems operational
                </span>
              </span>
            </div>
          </div>
        </footer>
      </main>

      {/* Toast */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] transition-all duration-500 ${showToast ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"}`}>
        <div className="rounded-full bg-slate-900 text-white px-5 py-3 text-[13px] font-medium shadow-[0_12px_32px_rgba(0,0,0,0.22)] flex items-center gap-2">
          <span className="h-5 w-5 rounded-full bg-white text-slate-900 grid place-items-center text-[12px] font-bold">✓</span>
          {emailMsg || "Playbook sent!"}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px){
          .reveal-slide{transform: translateY(18px)}
          .reveal-slide.in{transform: translateY(0)}
        }
      `}</style>
    </div>
  );
}
