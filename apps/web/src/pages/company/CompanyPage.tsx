import { useEffect, useRef, useState } from "react";
import logoUrl from "./assets/32d4f05ae5209978-image_6A9BA612-7186-480D-9D5C-7EF8BE2260B7.jpeg";
import missionMapUrl from "./assets/40487a0611b0c427-image_20261029_185402.webp";
import teamBuildingUrl from "./assets/fca746176da19100-image_20261029_185402_1.webp";
import founderVisionUrl from "./assets/16cc43351b39308e-image_20261029_185418.webp";

// Hook for reveal on scroll
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    const els = document.querySelectorAll(".reveal");
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function CompanyPage() {
  useReveal();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      data-safe-area-inset-root
      style={{
        boxSizing: "border-box",
        paddingTop: "var(--safe-area-inset-top)",
        background: "var(--bg)",
        minHeight: "100vh",
        color: "var(--text)",
      }}
      className="w-full overflow-x-clip antialiased"
    >
      {/* NAV */}
      <header
        data-safe-area-sticky-top
        className="sticky z-50 backdrop-blur-xl border-b"
        style={{
          top: "var(--safe-area-inset-top)",
          background: "rgba(255,255,255,0.84)",
          borderColor: "var(--border)",
        }}
      >
        <div className="mx-auto max-w-[1240px] px-6 lg:px-8 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={logoUrl}
              alt="AiKOVA logo"
              className="h-9 w-9 rounded-xl object-cover shadow-sm"
            />
            <span className="font-bold tracking-tight text-[18px]">AiKOVA</span>
            <span className="hidden sm:inline-flex ml-2 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-[var(--bg-alt)] border text-[var(--text-muted)]">
              Company
            </span>
          </div>

          <nav className="hidden lg:flex items-center gap-7 text-[14px] font-medium">
            {["Features", "Solutions", "Languages", "How It Works", "Pricing"].map((item) => (
              <a
                key={item}
                href={({
                  Features: "/features",
                  Solutions: "/solutions",
                  Languages: "/languages",
                  "How It Works": "/how-it-works",
                  Pricing: "/pricing",
                } as Record<string, string>)[item]}
                className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              >
                {item}
              </a>
            ))}
            <a
              href="/company"
              className="relative text-[var(--text)] font-semibold"
            >
              Company
              <span
                className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full"
                style={{ background: "var(--gradient)" }}
              />
            </a>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <button className="h-10 px-5 rounded-full bg-[#0F172A] text-white text-[14px] font-semibold hover:opacity-90 transition-opacity">
              Get Started
            </button>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden h-9 w-9 grid place-items-center rounded-full border bg-white"
          >
            <span className="w-4 h-[2px] bg-slate-800 block mb-1" />
            <span className="w-4 h-[2px] bg-slate-800 block mb-1" />
            <span className="w-4 h-[2px] bg-slate-800 block" />
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t bg-white px-6 py-5 space-y-4">
            {["Features", "Solutions", "Languages", "How It Works", "Pricing", "Company"].map((l) => (
              <a
                key={l}
                className={`block text-[15px] ${l==="Company" ? "font-bold" : "text-slate-500"}`}
                href={({
                  Features: "/features",
                  Solutions: "/solutions",
                  Languages: "/languages",
                  "How It Works": "/how-it-works",
                  Pricing: "/pricing",
                  Company: "/company",
                } as Record<string, string>)[l]}
              >
                {l}
              </a>
            ))}
            <button className="w-full h-11 rounded-full bg-[#0F172A] text-white font-semibold">Get Started</button>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-[30%] left-1/2 -translate-x-1/2 w-[140%] h-[80%] rounded-[50%]"
            style={{
              background:
                "radial-gradient(60% 80% at 50% 20%, rgba(0,229,255,0.16) 0%, rgba(41,98,255,0.10) 40%, rgba(118,255,3,0.08) 70%, transparent 100%)",
            }}
          />
        </div>

        <div className="mx-auto max-w-[1240px] px-6 lg:px-8 pt-16 lg:pt-24 pb-10 lg:pb-20 relative">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-8 items-start">
            {/* Text */}
            <div className="reveal">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-alt)] border text-[11px] font-semibold tracking-widest uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
                Company • Building for Africa
              </div>

              <h1 className="display mt-6 text-[40px] lg:text-[64px] leading-[0.95] tracking-[-0.03em] font-bold">
                Empowering small
                <br />
                businesses across
                <br />
                <span className="gradient-text">Africa, one</span>
                <br />
                community at a time.
              </h1>

              <p className="mt-6 text-[18px] leading-[1.6] text-[var(--text-muted)] max-w-[48ch]">
                To equip Africa&apos;s entrepreneurs with accessible AI solutions, fostering innovation, sustainable growth, and creating lasting impact in communities across the continent.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  className="h-[48px] px-7 rounded-full text-white font-semibold text-[15px] shadow-lg"
                  style={{ background: "var(--gradient)" }}
                >
                  Our Mission
                </button>
                <button className="h-[48px] px-7 rounded-full bg-white border text-[15px] font-semibold">
                  Read Manifesto →
                </button>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-6 max-w-[420px] border-t pt-6">
                <div>
                  <div className="text-[28px] font-bold tracking-tight">50k+</div>
                  <div className="text-[12px] text-[var(--text-muted)] leading-tight mt-1">SMEs Supported<br/>Across 30+ Countries</div>
                </div>
                <div>
                  <div className="text-[28px] font-bold tracking-tight">1,200+</div>
                  <div className="text-[12px] text-[var(--text-muted)] leading-tight mt-1">Local Hubs &<br/>Partners</div>
                </div>
                <div>
                  <div className="text-[28px] font-bold tracking-tight">+42%</div>
                  <div className="text-[12px] text-[var(--text-muted)] leading-tight mt-1">SME Growth<br/>Nairobi Pilot</div>
                </div>
              </div>
            </div>

            {/* Hero Visual - Team Building */}
            <div className="reveal torch-glow" style={{ transitionDelay: "120ms" }}>
              <div className="relative rounded-[32px] overflow-hidden bg-white shadow-[0_24px_64px_rgba(15,23,42,0.14)] border">
                <img
                  src={teamBuildingUrl}
                  alt="AiKOVA team building for Africa office with BUILDING FOR AFRICA neon sign"
                  className="w-full aspect-[4/3] lg:aspect-[1.15/1] object-cover"
                />
                {/* Floating cards overlay */}
                <div className="absolute top-4 left-4 right-4 flex justify-between gap-3">
                  <div className="px-3 py-2 rounded-2xl bg-white/90 backdrop-blur-md shadow-md border text-[11px] font-semibold flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" /> Lagos Pilot Live
                  </div>
                  <div className="px-3 py-2 rounded-2xl bg-white/90 backdrop-blur-md shadow-md border text-[11px] font-semibold">
                    Q4 2024 • Payment API ✓
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="rounded-2xl bg-white/92 backdrop-blur-xl border shadow-lg p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl grid place-items-center text-white font-bold text-[13px]" style={{background:"var(--gradient)"}}>AK</div>
                    <div className="flex-1">
                      <div className="text-[13px] font-semibold leading-none">BUILDING FOR AFRICA</div>
                      <div className="text-[11px] text-[var(--text-muted)] mt-1">JENGA LABS tote • SME Growth dashboard • Torch of God light rays</div>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-[#0F172A] text-white grid place-items-center text-[12px]">↗</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <div className="flex-1 rounded-2xl border bg-white p-4 shadow-sm">
                  <div className="text-[11px] font-semibold tracking-widest uppercase text-[var(--text-faint)]">Headquarters</div>
                  <div className="mt-1 text-[14px] font-semibold">Nairobi • Lagos • Accra</div>
                </div>
                <div className="flex-1 rounded-2xl border bg-white p-4 shadow-sm">
                  <div className="text-[11px] font-semibold tracking-widest uppercase text-[var(--text-faint)]">Manifesto</div>
                  <div className="mt-1 text-[14px] font-semibold">Building for those overlooked</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION DEEP DIVE */}
      <section className="bg-[var(--bg-alt)] border-t border-b">
        <div className="mx-auto max-w-[1240px] px-6 lg:px-8 py-16 lg:py-28">
          <div className="max-w-[760px] mx-auto text-center reveal">
            <div className="inline-flex px-3 py-1 rounded-full bg-white border text-[11px] font-semibold tracking-widest uppercase">Our Mission • Infographic</div>
            <h2 className="display mt-5 text-[32px] lg:text-[52px] leading-[0.95] font-bold">
              A continent-wide map of <span className="gradient-text">purpose</span>
            </h2>
            <p className="mt-4 text-[16px] lg:text-[18px] text-[var(--text-muted)] leading-relaxed">
              From Casablanca Retail to Lagos Fashion & Textiles, Cape Town Manufacturing to Addis Ababa Agriculture — we’re weaving a network of 1,200+ hubs supporting 50,000+ small businesses.
            </p>
          </div>

          {/* Mission Map Card Centerpiece */}
          <div className="mt-12 lg:mt-16 reveal" style={{ transitionDelay: "100ms" }}>
            <div className="mx-auto max-w-[1040px] rounded-[32px] bg-white p-3 lg:p-5 shadow-[0_24px_80px_rgba(15,23,42,0.12)] border">
              <div className="rounded-[24px] overflow-hidden border bg-[#FCFEFF] relative">
                <div className="absolute inset-0 pointer-events-none opacity-60" style={{background:"radial-gradient(80% 60% at 50% 0%, rgba(0,229,255,0.18), transparent 60%)"}}/>
                <img
                  src={missionMapUrl}
                  alt="AiKOVA Empowering Small Businesses Across Africa mission map infographic showing Casablanca Retail, Lagos Fashion & Textiles, Cape Town Manufacturing, Addis Ababa Agriculture, Accra Digital Services, Kampala Training, Nairobi Cafe & Agribusiness"
                  className="relative z-10 w-full object-contain"
                />
              </div>
              <div className="px-2 lg:px-6 py-4 flex flex-wrap gap-3 justify-between items-center text-[12px] text-[var(--text-muted)]">
                <span>◍ AiKOVA Empowering Small Businesses Across Africa • Our Mission • Authentic infographic</span>
                <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#00E5FF]"/>Torch of God lighting preserved</span>
              </div>
            </div>
          </div>

          {/* 3 Pillars */}
          <div className="mt-14 grid lg:grid-cols-3 gap-6 max-w-[1080px] mx-auto">
            {[
              {
                title: "AI Tools & Automation",
                desc: "Inventory, marketing, customer engagement – plug-and-play modules for informal retail and rural clinics.",
                color: "#00E5FF",
                icon: "◑",
                points: ["Inventory sync", "Auto marketing", "Customer intake"]
              },
              {
                title: "Financial Inclusion",
                desc: "Microloans, payments, and merchant dashboards powered by Flutterwave, Paystack, M-Pesa rails.",
                color: "#2962FF",
                icon: "◒",
                points: ["Microloans", "Paystack / Flutterwave", "M-Pesa integration"]
              },
              {
                title: "Training & Community",
                desc: "Workshops, mentorship, and peer networks – local hire & train, trust & inclusion first.",
                color: "#76FF03",
                icon: "◓",
                points: ["Workshops", "Mentorship", "Peer network"]
              }
            ].map((pillar, i) => (
              <div
                key={pillar.title}
                className="reveal rounded-[24px] bg-white border p-7 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] transition-shadow"
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className="h-12 w-12 rounded-2xl grid place-items-center text-[18px] font-bold text-white" style={{ background: pillar.color === "#76FF03" ? "#0F172A" : pillar.color, boxShadow: `0 8px 20px ${pillar.color}40` }}>
                  {pillar.icon}
                </div>
                <h3 className="mt-5 text-[18px] font-bold leading-tight">{pillar.title}</h3>
                <p className="mt-2 text-[14px] leading-[1.6] text-[var(--text-muted)]">{pillar.desc}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {pillar.points.map(p => (
                    <span key={p} className="px-2.5 py-1 rounded-full bg-[var(--bg-alt)] border text-[11px] font-medium">{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Stats */}
          <div className="mt-14 reveal rounded-[24px] bg-[#0F172A] text-white p-8 lg:p-10 flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-center">
            <div className="flex flex-wrap gap-10">
              <div>
                <div className="text-[32px] font-bold leading-none">50,000+</div>
                <div className="mt-2 text-[12px] text-white/60 leading-tight">Small Businesses Supported<br/>Across 30+ Countries</div>
              </div>
              <div>
                <div className="text-[32px] font-bold leading-none">1,200+</div>
                <div className="mt-2 text-[12px] text-white/60 leading-tight">Local Hubs & Partners<br/>Empowering communities</div>
              </div>
              <div>
                <div className="text-[32px] font-bold leading-none">∞</div>
                <div className="mt-2 text-[12px] text-white/60 leading-tight">Next Generation Jobs created<br/>sustainable growth lasting impact</div>
              </div>
            </div>
            <div className="text-[13px] text-white/70 max-w-[32ch] leading-relaxed">Our north star: every informal shop, rural clinic, and community center deserves a front-desk — even when categories don&apos;t sync.</div>
          </div>
        </div>
      </section>

      {/* VISION: Plug-and-Play for Uncategorized Markets */}
      <section className="relative bg-white">
        <div className="mx-auto max-w-[1240px] px-6 lg:px-8 py-16 lg:py-28">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-start">
            {/* Visual */}
            <div className="reveal order-2 lg:order-1">
              <div className="rounded-[32px] overflow-hidden border bg-white shadow-[var(--shadow-large)]">
                <div className="relative">
                  <img
                    src={founderVisionUrl}
                    alt="Founder Vision: Plug-and-Play AI Receptionist for Uncategorized Markets, founder with Kente shirt, AI-RX Plug & Play v1.0 box, dashboard 128 calls handled"
                    className="w-full aspect-[1.2/1] object-cover"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur border text-[11px] font-bold shadow-sm">
                    Vision: Plug-and-Play AI Receptionist • v1.0
                  </div>
                </div>
                <div className="p-5 lg:p-7 grid grid-cols-2 gap-4 text-[12px]">
                  <div className="rounded-2xl bg-[var(--bg-alt)] border p-4">
                    <div className="text-[11px] font-semibold tracking-widest uppercase text-[var(--text-faint)]">Dashboard</div>
                    <div className="mt-2 text-[22px] font-bold leading-none">128</div>
                    <div className="text-[11px] text-[var(--text-muted)] mt-1">calls handled today</div>
                    <div className="mt-3 flex gap-1.5">
                      <span className="px-2 py-1 rounded-full bg-white border text-[10px]">EN</span>
                      <span className="px-2 py-1 rounded-full bg-white border text-[10px]">SW</span>
                      <span className="px-2 py-1 rounded-full bg-white border text-[10px]">HA</span>
                      <span className="px-2 py-1 rounded-full bg-white border text-[10px]">FR</span>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-[#0F172A] text-white p-4">
                    <div className="text-[11px] tracking-widest uppercase text-white/60">System</div>
                    <div className="mt-2 text-[13px] font-semibold leading-tight">Voice → AI → CRM Sync<br/>Compact AI Box</div>
                    <div className="mt-3 h-1.5 w-full rounded-full bg-white/15 overflow-hidden">
                      <div className="h-full w-[72%] rounded-full" style={{background:"var(--gradient)"}}/>
                    </div>
                    <div className="mt-1 text-[10px] text-white/60">Active Conversations 42</div>
                  </div>
                </div>
              </div>

              {/* Whiteboard annotations */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border bg-[#FFFEF7] p-4">
                  <div className="text-[11px] font-bold tracking-widest uppercase">Target</div>
                  <div className="mt-2 text-[13px] leading-snug text-[var(--text-muted)]">informal retail hubs • rural clinics • local markets • community centers</div>
                </div>
                <div className="rounded-2xl border bg-[#F0FFF4] p-4">
                  <div className="text-[11px] font-bold tracking-widest uppercase">Q1 Goal</div>
                  <div className="mt-2 text-[13px] font-semibold">Pilot 50 clinics Kenya & Nigeria</div>
                  <div className="mt-1 text-[11px] text-[var(--text-muted)]">West Africa → East Africa → Scale → Global South</div>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="reveal order-1 lg:order-2" style={{ transitionDelay: "120ms" }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-alt)] border text-[11px] font-semibold tracking-widest uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-[#76FF03]" />
                Founder Vision • Uncategorized Markets
              </div>
              <h2 className="display mt-6 text-[34px] lg:text-[48px] leading-[0.95] font-bold tracking-tight">
                Plug-and-Play for
                <br />
                Africa&apos;s <span className="gradient-text">uncategorized</span>
                <br />
                reality.
              </h2>

              <div className="mt-8 space-y-6 text-[16px] leading-[1.7] text-[var(--text-muted)]">
                <p>
                  <strong className="text-[var(--text)]">You told captain:</strong> categories don&apos;t sync in Africa. Businesses are random — a shop sells airtime, tailors dresses, and books clinic appointments in one ledger. No Shopify category fits.
                </p>
                <p>
                  That&apos;s why we built <strong className="text-[var(--text)]">AI-RX Plug & Play v1.0</strong> — a compact AI box. No front-desk in 90% of small businesses? We give them voice.
                </p>
                <div className="rounded-2xl border-l-[4px] bg-[var(--bg-alt)] p-5" style={{borderLeftColor:"#2962FF"}}>
                  <div className="text-[13px] font-bold text-[var(--text)]">Problem → Solution</div>
                  <div className="mt-2 text-[14px] leading-relaxed">
                    Problem: No front-desk in 90% small businesses, multi-lang needs, offline-first.<br/>
                    Solution: Voice AI, multilingual booking, FAQs, customer intake, Slack/WhatsApp sync.
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "24/7 multilingual receptionist",
                    "Booking • FAQs • Intake",
                    "Offline-first + CRM sync",
                    "Compact plug-and-play box"
                  ].map(t => (
                    <div key={t} className="flex items-center gap-2 text-[13px] font-medium text-[var(--text)]">
                      <span className="h-6 w-6 rounded-full grid place-items-center text-[12px] text-white" style={{background:"var(--text)"}}>✓</span>{t}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 rounded-2xl border bg-white p-5 flex items-start gap-4 shadow-sm">
                <img src={logoUrl} alt="AiKOVA" className="h-10 w-10 rounded-xl object-cover" />
                <div>
                  <div className="text-[13px] font-bold">Leadership • Community-first</div>
                  <div className="mt-1 text-[13px] text-[var(--text-muted)] leading-snug">Local hire & train • Trust & Inclusion • Leadership poster: BUILDING FOR THOSE OVERLOOKED • Start Lean Africa principles</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM & VALUES */}
      <section className="bg-[var(--bg-alt)] border-t">
        <div className="mx-auto max-w-[1240px] px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="reveal lg:col-span-1">
              <div className="inline-flex px-3 py-1 rounded-full bg-white border text-[11px] font-semibold tracking-widest uppercase">Team & Values</div>
              <h2 className="display mt-5 text-[32px] lg:text-[40px] leading-[0.95] font-bold">
                Building for those
                <br />
                overlooked.
              </h2>
              <p className="mt-4 text-[15px] leading-[1.7] text-[var(--text-muted)]">
                Seen in our office: BUILDING FOR THOSE OVERLOOKED poster, Scaling Startups book, Start Lean Africa sticky, Empowering African Businesses.
              </p>
              <div className="mt-8 space-y-3">
                {[
                  {k:"Lagos Pilot Launch", v:"Q4 2024 • Payment API + Logistics Tools + Merchant Dashboard"},
                  {k:"Nairobi 200+ SMEs", v:"Onboarded, +42% SME Growth measured"},
                  {k:"JENGA LABS", v:"Tote on desk • Build culture"}
                ].map(item=>(
                  <div key={item.k} className="rounded-2xl bg-white border p-4 flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#0F172A] text-white grid place-items-center text-[11px] font-bold">•</div>
                    <div>
                      <div className="text-[13px] font-bold">{item.k}</div>
                      <div className="text-[12px] text-[var(--text-muted)] mt-0.5 leading-snug">{item.v}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-5">
              {[
                {
                  title:"BUILDING FOR THOSE OVERLOOKED",
                  desc:"Poster on our wall. Not a slogan — a filter for every feature. If informal retail can't use it, we don't ship it.",
                  tag:"Poster • Culture"
                },
                {
                  title:"Start Lean Africa",
                  desc:"Empowering African Businesses sticky notes. Scaling Startups book on shelf. We read, test, pilot, repeat.",
                  tag:"Books • Method"
                },
                {
                  title:"Local Hire & Train",
                  desc:"Leadership: Community-first. Trust & Inclusion. We hire from the hubs we serve — Nairobi, Lagos, Accra.",
                  tag:"Values • Team"
                },
                {
                  title:"Torch of God Light",
                  desc:"You see it in the images — natural light rays pouring through windows onto desks. Beauty with purpose.",
                  tag:"Aesthetic • Infographic flawless"
                },
              ].map((c,i)=>(
                <div key={c.title} className="reveal rounded-[24px] bg-white border p-6 shadow-[var(--shadow-soft)]" style={{transitionDelay:`${i*80}ms`}}>
                  <div className="text-[11px] font-semibold tracking-widest uppercase text-[var(--text-faint)]">{c.tag}</div>
                  <h3 className="mt-3 text-[16px] font-bold leading-tight">{c.title}</h3>
                  <p className="mt-2 text-[13px] leading-[1.6] text-[var(--text-muted)]">{c.desc}</p>
                  <div className="mt-4 h-[3px] w-12 rounded-full" style={{background:"var(--gradient)"}}/>
                </div>
              ))}
              <div className="sm:col-span-2 reveal rounded-[24px] bg-[#0F172A] text-white p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                <div>
                  <div className="text-[14px] font-bold">5 diverse founders in office with BUILDING FOR AFRICA neon</div>
                  <div className="mt-1 text-[13px] text-white/60">Africa map pins, JENGA LABS tote, SME Growth +42% dashboard — all visible in our real office photo.</div>
                </div>
                <div className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-[12px] font-semibold whitespace-nowrap">Q4 2024 Payment API ✓</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="bg-white border-t">
        <div className="mx-auto max-w-[1240px] px-6 lg:px-8 py-16 lg:py-24">
          <div className="flex flex-wrap justify-between items-end gap-6 reveal">
            <div>
              <div className="inline-flex px-3 py-1 rounded-full bg-[var(--bg-alt)] border text-[11px] font-semibold tracking-widest uppercase">Timeline • Production Ready</div>
              <h2 className="display mt-4 text-[32px] lg:text-[44px] leading-[0.95] font-bold">From idea to 2,000+ businesses.</h2>
            </div>
            <p className="max-w-[36ch] text-[14px] leading-[1.6] text-[var(--text-muted)]">We keep categories messy — because Africa is. Plug-and-play, then scale.</p>
          </div>

          <div className="mt-12 grid lg:grid-cols-4 gap-0 relative">
            <div className="hidden lg:block absolute top-[34px] left-[8%] right-[8%] h-[2px] bg-gradient-to-r from-[#00E5FF] via-[#2962FF] to-[#76FF03] opacity-30"/>
            {[
              {year:"2024", title:"Idea", desc:"Vision: Plug-and-Play AI Receptionist for Uncategorized Markets. Whiteboard Target informal retail hubs, rural clinics.", status:"Done"},
              {year:"Q4 2024", title:"Payment API", desc:"Logistic Tools • Merchant Dashboard • Lagos Pilot • Nairobi 200+ SMEs • SME Growth +42%", status:"Live"},
              {year:"2025", title:"Pilot 50 Clinics", desc:"Kenya & Nigeria rural clinics, local markets, community centers. Dashboard Active 42 conversations.", status:"Next"},
              {year:"2026+", title:"Scale 2000+", desc:"West Africa → East Africa → Scale → Global South. Plug-and-play box everywhere.", status:"Vision"},
            ].map((step,i)=>(
              <div key={step.year} className="reveal relative pt-0 pb-8 lg:pb-0 lg:pt-14 px-0 lg:px-6 border-l lg:border-l-0 lg:border-t-0" style={{transitionDelay:`${i*100}ms`}}>
                <div className="lg:hidden absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#00E5FF] to-[#76FF03] opacity-30"/>
                <div className="pl-6 lg:pl-0">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#0F172A] text-white grid place-items-center text-[12px] font-bold z-10">{i+1}</div>
                    <span className="px-2.5 py-1 rounded-full bg-[var(--bg-alt)] border text-[11px] font-semibold">{step.year} • {step.status}</span>
                  </div>
                  <h3 className="mt-4 text-[18px] font-bold">{step.title}</h3>
                  <p className="mt-2 text-[13px] leading-[1.6] text-[var(--text-muted)]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="bg-[var(--bg-alt)] border-y">
        <div className="mx-auto max-w-[1240px] px-6 lg:px-8 py-10">
          <div className="flex flex-wrap items-center justify-between gap-6 reveal">
            <div className="text-[12px] font-semibold tracking-widest uppercase text-[var(--text-faint)]">Trusted Rails • Partners</div>
            <div className="flex flex-wrap gap-3">
              {["Africa's Talking","Flutterwave","Paystack","M-Pesa"].map(p=>(
                <div key={p} className="h-10 px-5 rounded-full bg-white border shadow-sm flex items-center gap-2 text-[13px] font-semibold">
                  <span className="h-2 w-2 rounded-full bg-[#2962FF]"/> {p}
                </div>
              ))}
            </div>
            <div className="text-[12px] text-[var(--text-muted)]">Compact AI Box • Voice → AI → CRM Sync • Offline-first</div>
          </div>
        </div>
      </section>

      {/* CTA Banner Gradient */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" style={{background:"var(--gradient)"}}/>
        <div className="absolute inset-0 opacity-20" style={{background:"radial-gradient(70% 100% at 0% 0%, white, transparent 60%)"}}/>
        <div className="relative mx-auto max-w-[1240px] px-6 lg:px-8 py-14 lg:py-20">
          <div className="reveal rounded-[32px] bg-[#0F172A]/90 backdrop-blur-xl border border-white/10 p-8 lg:p-12 flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-center text-white">
            <div>
              <div className="inline-flex px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[11px] font-semibold tracking-widest uppercase">Join us building for Africa • Hiring • Partnering</div>
              <h2 className="display mt-4 text-[28px] lg:text-[40px] leading-[0.95] font-bold">Join us building for Africa.<br/>We&apos;re hiring, partnering.</h2>
              <p className="mt-3 text-[14px] text-white/70 max-w-[48ch]">Plug-and-play AI receptionist for uncategorized markets. Local hire & train. Trust & inclusion. Torch of God lighting, flawless infographic beauty, white theme production-ready.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="h-12 px-7 rounded-full bg-white text-[#0F172A] font-semibold text-[14px] hover:opacity-90 transition-opacity">Join Team →</button>
              <button className="h-12 px-7 rounded-full bg-transparent border border-white/20 text-white font-semibold text-[14px] hover:bg-white/10 transition-colors">Partner With Us</button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t">
        <div className="mx-auto max-w-[1240px] px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row justify-between gap-10">
            <div className="max-w-[320px]">
              <div className="flex items-center gap-3">
                <img src={logoUrl} alt="AiKOVA" className="h-8 w-8 rounded-xl object-cover" />
                <span className="font-bold">AiKOVA</span>
              </div>
              <p className="mt-4 text-[13px] leading-[1.6] text-[var(--text-muted)]">
                Empowering Small Businesses Across Africa. AI Tools & Automation, Financial Inclusion, Training & Community. 50,000+ SMEs, 1,200+ hubs.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-[13px]">
              <div>
                <div className="font-semibold mb-3">Company</div>
                <div className="space-y-2 text-[var(--text-muted)]">
                  <div>About</div><div>Careers</div><div>Manifesto</div>
                </div>
              </div>
              <div>
                <div className="font-semibold mb-3">Product</div>
                <div className="space-y-2 text-[var(--text-muted)]">
                  <div>AI Receptionist</div><div>Merchant Dashboard</div><div>Payment API</div>
                </div>
              </div>
              <div>
                <div className="font-semibold mb-3">Markets</div>
                <div className="space-y-2 text-[var(--text-muted)]">
                  <div>Lagos Fashion</div><div>Nairobi Cafe</div><div>Accra Digital</div>
                </div>
              </div>
              <div>
                <div className="font-semibold mb-3">Legal</div>
                <div className="space-y-2 text-[var(--text-muted)]">
                  <div>Privacy</div><div>Terms</div><div>Contact</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between gap-3 text-[12px] text-[var(--text-muted)]">
            <span>© 2025 AiKOVA • Building for Africa • Torch of God • Page 10 of 11 • Company / About</span>
            <span>White #FFFFFF • Alt #F8FAFC • Slate #0F172A • Gradient #00E5FF → #2962FF → #76FF03</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
