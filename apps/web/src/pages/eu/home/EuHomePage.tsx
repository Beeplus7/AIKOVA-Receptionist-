import React, { useEffect, useRef, useState } from "react";
import logoImg from "./assets/32d4f05ae5209978-image_6A9BA612-7186-480D-9D5C-7EF8BE2260B7.jpeg";
import catInfographic from "./assets/163f747c5cfd683f-image_20261029_220348.webp";
import cafeWoman from "./assets/30772e30efff29d0-image_20261029_220348_1.webp";
import highStreet from "./assets/dc1f95fe8cb8a990-image_20261029_220349.webp";
import AkcTierStrip from "../../../components/AkcTierStrip";
import { startSetupUrl } from "../../../lib/setupFlow";

// Types for persistence
type Assessment = {
  website: string;
  businessName: string;
  category: string;
  location: string;
};

const CATEGORIES = [
  { id: "restaurant", name: "Restaurant", count: "18k+", icon: "🍽️", desc: "Cuisines worldwide • High Street & Markets", color: "#FEF3C7", shopMatch: 0, detail: "Today Roast Lamb & Mint • Fish & Chips £16-24" },
  { id: "cafe", name: "Café", count: "7.5k+", icon: "☕", desc: "Independent & Chains • Coworking Spaces", color: "#DBEAFE", shopMatch: 1, detail: "Latte Flat White Cold Brew • Pastries Fresh Daily" },
  { id: "clinic", name: "Clinic", count: "4.2k+", icon: "🏥", desc: "GP Clinics Private Care Pharmacy Dental", color: "#DCFCE7", shopMatch: 2, detail: "Flu Jab NHS • Health Check Mon-Fri 9am-6pm Sat 10am-2pm" },
  { id: "salon", name: "Salon", count: "6.1k+", icon: "✂️", desc: "Hair Beauty Nail Bars • Wellness Spa", color: "#FCE7F3", shopMatch: 3, detail: "Colour Cut & Style • Blow Dry • Appointments Welcome" },
  { id: "retail", name: "Retail", count: "22k+", icon: "🛍️", desc: "Fashion Lifestyle Markets • High Street", color: "#E0E7FF", shopMatch: 1, detail: "Fashion • Lifestyle • Local & Flagship" },
  { id: "pro", name: "Professional", count: "15k+", icon: "💼", desc: "Legal Accounting Consulting Marketing Tech", color: "#F3E8FF", shopMatch: 2, detail: "Lead qualification • GBP hours • Bank Holiday" },
];

const SHOPS = [
  { name: "THE GARDEN RESTAURANT", tag: "Modern British • Reservations", dish: "Roast Lamb & Mint • Fish & Chips", accent: "#CE1126" },
  { name: "BREW & BEAN CAFE", tag: "Specialty Coffee", dish: "Latte • Flat White • Cold Brew • Croissant", accent: "#012169" },
  { name: "HIGH STREET CLINIC", tag: "GP Pharmacy Health Services", dish: "Walk-ins Welcome • Flu Jab • NHS", accent: "#059669" },
  { name: "BLOOM SALON", tag: "Hair Beauty Barber", dish: "Book Online • Colour Cut Style Blow Dry", accent: "#DB2777" },
];

const HELP = [
  { cat: "Restaurant", pain: "Missed reservations during Sunday roast rush", fix: "AiKOVA books in British English + Polish + French. Handles allergies, table preferences, 4-top at 8pm.", icon: "🍽️" },
  { cat: "Café", pain: "Morning rush — 30 missed calls before 9am", fix: "AI handles 7am flat white orders, loyalty, oat milk preferences, pre-orders.", icon: "☕" },
  { cat: "Clinic", pain: "NHS vs private queries + no-show chaos", fix: "GDPR compliant triage. Separates NHS/Private, checks GP availability, flu jab eligibility.", icon: "🩺" },
  { cat: "Salon", pain: "Instagram 'how much balayage?' DMs at 11pm", fix: "Auto DM + booking. Knows balayage £120, roots, stylist gaps, deposit via Stripe.", icon: "💇‍♀️" },
  { cat: "Retail", pain: "'Where are you? Open Bank Holiday?'", fix: "GBP hours, Bank Holiday exceptions, click & collect, Camberwell to Camden directions.", icon: "🛒" },
  { cat: "Pro Services", pain: "Unqualified leads eating partner time", fix: "Lead qualification for legal/accounting. Matter type, budget, urgency → booked consult.", icon: "⚖️" },
];

const ROAD = [
  { city: "London", country: "UK Flag-Off", lang: "English • Polish • French", status: "Live", color: "#012169" },
  { city: "Amsterdam", country: "Netherlands", lang: "Dutch • English", status: "Q2", color: "#EA580C" },
  { city: "Berlin", country: "Germany", lang: "German • English • Turkish", status: "Q2", color: "#111827" },
  { city: "Paris", country: "France", lang: "French • Arabic • English", status: "Q3", color: "#1D4ED8" },
  { city: "Madrid", country: "Spain", lang: "Spanish • Catalan • English", status: "Q3", color: "#BE123C" },
  { city: "Warsaw", country: "Poland", lang: "Polish • English • Ukrainian", status: "Q4", color: "#DC2626" },
];

export default function EuHomePage(){
  const [activeCat, setActiveCat] = useState<string>("restaurant");
  const [website, setWebsite] = useState("");
  const [bizName, setBizName] = useState("");
  const [selectedCatForm, setSelectedCatForm] = useState("restaurant");
  const [assessments, setAssessments] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [showDemo, setShowDemo] = useState(false);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const heroPhoneRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver for reveal
  useEffect(()=>{
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting) e.target.classList.add("in");
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(el=>io.observe(el));
    return ()=>io.disconnect();
  },[]);

  // Parallax subtle
  useEffect(()=>{
    let ticking = false;
    const onScroll = ()=>{
      if(!ticking){
        requestAnimationFrame(()=>{
          const y = window.scrollY;
          if(parallaxRef.current) parallaxRef.current.style.transform = `translateY(${y*0.06}px)`;
          if(heroPhoneRef.current) heroPhoneRef.current.style.transform = `translateY(${y*-0.04}px) rotate(-1.5deg)`;
          ticking=false;
        });
        ticking=true;
      }
    };
    window.addEventListener("scroll", onScroll, {passive:true});
    return ()=>window.removeEventListener("scroll", onScroll);
  },[]);

  // Load records
  useEffect(()=>{
    (async()=>{
      try{
        const res = await fetch("actions", {method:"POST", headers:{"content-type":"application/json"}, body: JSON.stringify({action:"records.list", args:{collection:"uk_assessments"}})});
        const j = await res.json();
        if(j?.data?.records) setAssessments(j.data.records);
      }catch{}
    })();
  },[]);

  const submitAssessment = async (e: React.FormEvent)=>{
    e.preventDefault();
    if(!website) return;
    setBusy(true);
    setSavedMsg(null);
    try{
      const val: Assessment = { website, businessName: bizName || "Camberwell Business", category: selectedCatForm, location: "London, UK" };
      const res = await fetch("actions", {method:"POST", headers:{"content-type":"application/json"}, body: JSON.stringify({action:"records.create", args:{collection:"uk_assessments", value: val, idempotency_key: `uk_${website}_${Date.now()}`}})});
      const j = await res.json();
      if(j.error) throw new Error(j.error);
      setAssessments(prev=>[j.data, ...prev]);
      setSavedMsg(`Live scan started for ${website} — AI receptionist reading services, prices, hours. Faster than a flat white.`);
      setWebsite(""); setBizName("");
    }catch(err:any){
      setSavedMsg(err.message || "Could not save. Limit reached.");
    }finally{ setBusy(false); }
  };

  return (
    <div data-safe-area-inset-root style={{boxSizing:"border-box", paddingTop:"var(--safe-area-inset-top)", background:"var(--bg)"}} className="min-h-screen w-full overflow-x-clip antialiased">
      {/* Nav */}
      <header data-safe-area-sticky-top style={{top:"var(--safe-area-inset-top)"}} className="sticky z-50 border-b border-[var(--line)] bg-white/80 glass">
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8 h-[72px] flex items-center justify-between">
          <a href="/eu" className="flex items-center gap-3">
            <img src={logoImg} alt="AiKOVA logo" className="h-9 w-auto rounded-lg object-contain bg-white" />
            <span className="font-[Fraunces] font-bold text-[22px] tracking-tight">AiKOVA</span>
            <span className="hidden md:inline-flex ml-2 text-[11px] tracking-[0.18em] uppercase font-semibold px-2.5 py-1 rounded-full bg-[#F1F5F9] text-[#334155] border">Eurozone</span>
          </a>
          <nav className="hidden lg:flex items-center gap-8 text-[14px] font-medium text-[#334155]">
            {["Features","Solutions","Languages","Pricing","Demo"].map(t=>(
              <a key={t} href={({Features:"/eu/features",Solutions:"/eu/solutions",Languages:"/eu/languages",Pricing:"/eu/pricing",Demo:"/eu/demo"} as Record<string,string>)[t] ?? `#${t.toLowerCase()}`} className="hover:text-black transition">{t}</a>
            ))}
          </nav>
          <div className="flex items-center gap-2.5">
            <div className="hidden md:flex items-center gap-1.5 rounded-full border border-[var(--line)] px-2.5 py-1.5 bg-white shadow-sm">
              <span className="text-[16px]">🇬🇧</span><span className="w-px h-4 bg-[var(--line)] mx-1" /><span className="text-[16px]">🇪🇺</span>
            </div>
            {/* ASSESS BUTTON TO BE UPDATED ON MAIN HERO PAGE */}
            <a href={startSetupUrl('eurozone')} id="assess-button-main-hero" className="gradient-brand relative inline-flex items-center justify-center rounded-full px-5 h-10 text-[14px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(41,98,255,0.6)] hover:shadow-[0_12px_28px_-10px_rgba(41,98,255,0.7)] transition-all hover:-translate-y-px active:translate-y-0 overflow-hidden" style={{animation:"pulseGlow 2.8s infinite"}}>
              <span className="absolute inset-0 rounded-full pulse-ring border border-white/40 pointer-events-none" />
              <span className="relative">Assess Business →</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Flag-Off */}
      <section className="relative overflow-hidden">
        {/* Subtle Union Jack pattern */}
        <div ref={parallaxRef} className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035]" style={{backgroundImage:`repeating-linear-gradient(45deg, #012169 0 2px, transparent 2px 20px), repeating-linear-gradient(-45deg, #CE1126 0 2px, transparent 2px 20px)`}} />
        <div className="absolute inset-0 -z-10 gradient-uk-soft" />

        <div className="mx-auto max-w-[1280px] px-5 lg:px-8 pt-10 lg:pt-16 pb-14 lg:pb-20 grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-start">
          {/* Left copy */}
          <div className="reveal in">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 shadow-sm text-[12px] font-medium">
              <span>🇬🇧</span><span className="h-3 w-px bg-[#E2E8F0]" />
              <span className="uppercase tracking-[0.14em] text-[#334155]">UK Flag-Off • Eurozone Launch • London</span>
              <span className="hidden sm:inline-flex ml-2 rounded-full bg-[#0F172A] text-white px-2 py-0.5 text-[10px] tracking-wide">Supporting 1M+ businesses</span>
            </div>

            <h1 className="mt-6 text-[42px] sm:text-[56px] lg:text-[72px] leading-[0.92] font-[800] tracking-[-0.03em]">
              Europe&apos;s AI
              <br />
              <span className="relative inline-block">
                Receptionist.
                <span className="underline-uk absolute left-0 -bottom-2 w-full" />
              </span>
              <br />
              <span className="text-[40px] sm:text-[54px] lg:text-[68px] font-[600] text-[#334155]">Starting with the UK.</span>
            </h1>

            <p className="mt-7 max-w-[58ch] text-[16px] lg:text-[18px] leading-7 text-[#475569]">
              From The Garden Restaurant to High Street Clinic to Bloom Salon — <span className="font-semibold text-[#0F172A]">AiKOVA adapts to any British business in 10 mins</span>, like Africa but for Europe. 450M+ population, €12.5T GDP, GDPR ready.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {/* Primary assess button in hero */}
              <a href={startSetupUrl('eurozone')} id="assess-button" className="gradient-brand relative inline-flex items-center justify-center rounded-full h-[48px] px-7 text-[15px] font-semibold text-white shadow-[0_12px_28px_-12px_rgba(41,98,255,0.7)] hover:-translate-y-px active:translate-y-0 transition-all overflow-hidden" style={{animation:"pulseGlow 2.8s infinite"}}>
                <span className="absolute inset-0 rounded-full pulse-ring border border-white/40 pointer-events-none" />
                <span className="relative">Assess Your Business →</span>
              </a>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event('aikova:try-now'))}
                className="rounded-full h-[48px] px-6 text-[14px] font-semibold border border-[var(--line)] bg-[#0F172A] text-white hover:bg-[#1E293B] transition flex items-center gap-2"
              >
                <span className="h-6 w-6 rounded-full grid place-items-center text-[12px] font-black text-[#0F172A]" style={{ background: 'linear-gradient(102deg,#00E5FF,#2962FF,#76FF03)' }}>▶</span>
                Try now — no signup
              </button>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event('aikova:try-call'))}
                className="rounded-full h-[48px] px-6 text-[14px] font-semibold border border-[var(--line)] bg-white hover:bg-[#F8FAFC] transition flex items-center gap-2"
              >
                <span className="h-6 w-6 rounded-full bg-[#0F172A] text-white grid place-items-center text-[12px]">📞</span>
                Voice call trial
              </button>
              <button onClick={()=>setShowDemo(true)} className="rounded-full h-[48px] px-6 text-[14px] font-semibold border border-[var(--line)] bg-white hover:bg-[#F8FAFC] transition flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-[#0F172A] text-white grid place-items-center text-[12px]">▶</span> Watch UK Demo 45s
              </button>
              <a href="#euro-road" className="rounded-full h-[48px] px-6 text-[14px] font-semibold bg-[#F1F5F9] hover:bg-[#E2E8F0] transition">Explore Eurozone</a>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 text-[12px] text-[#64748B]">
              {["Works with Twilio","Stripe SEPA","GDPR Compliant","UK Numbers +44"].map(t=>(
                <span key={t} className="inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />{t}</span>
              ))}
            </div>

            {/* Trust row */}
            <div className="mt-8 grid grid-cols-3 gap-3 max-w-[520px]">
              {[
                {k:"1M+", v:"London businesses"},
                {k:"10 min", v:"Setup average"},
                {k:"24/7", v:"Never misses call"},
              ].map(s=>(
                <div key={s.k} className="rounded-2xl border bg-white p-4 shadow-sm">
                  <div className="text-[22px] font-bold tracking-tight">{s.k}</div>
                  <div className="text-[12px] text-[#64748B] mt-0.5">{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right visual - hero phone mockup */}
          <div className="relative lg:sticky lg:top-[96px]">
            <div ref={heroPhoneRef} className="relative mx-auto w-full max-w-[520px]">
              {/* soft blob */}
              <div className="absolute -inset-8 -z-10 rounded-[32px] bg-gradient-to-br from-[#E0F2FE] via-white to-[#FCE7F3] blur-[18px]" />
              
              <div className="relative rounded-[28px] bg-white p-2.5 shadow-[var(--shadow-card)] border border-[#E2E8F0]">
                <div className="rounded-[20px] overflow-hidden bg-[#F8FAFC] relative">
                  <img src={cafeWoman} alt="UK cafe woman AI Receptionist - The Daily Nook Coffee & Bakes" className="w-full h-auto object-cover aspect-[4/5]" />
                  {/* AI pill overlay */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/95 backdrop-blur px-3 py-1.5 text-[12px] font-semibold shadow">
                      <span className="h-2 w-2 rounded-full bg-[#22C55E] animate-pulse" />AI Receptionist • Online
                    </span>
                    <span className="rounded-full bg-[#0F172A] text-white px-2.5 py-1 text-[11px]">Camberwell RD • London</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white p-3 shadow-[0_12px_24px_-8px_rgba(0,0,0,0.25)] border">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[11px] uppercase tracking-wide text-[#64748B]">New booking</div>
                        <div className="text-[14px] font-semibold">2pm • 2 guests • 24 Oct • Confirmed</div>
                      </div>
                      <div className="h-8 w-8 rounded-full gradient-brand grid place-items-center text-white text-[14px]">✓</div>
                    </div>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-[#F1F5F9] overflow-hidden">
                      <div className="h-full w-[84%] gradient-brand" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating dropping cards */}
              <div className="pointer-events-none absolute -left-6 top-[18%] hidden sm:block drop-card" style={{animationDelay:"0.1s"}}>
                <div className="rounded-2xl bg-white border shadow-[var(--shadow-soft)] px-4 py-3 min-w-[220px]">
                  <div className="text-[12px] text-[#64748B]">The Garden Restaurant</div>
                  <div className="text-[13px] font-semibold">Table for 4 tonight? Roast?</div>
                  <div className="mt-1.5 flex gap-1">
                    <span className="h-1.5 w-8 rounded-full bg-[#FDE68A]" /><span className="h-1.5 w-5 rounded-full bg-[#E2E8F0]" />
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute -right-8 top-[42%] hidden sm:block drop-card" style={{animationDelay:"0.35s"}}>
                <div className="rounded-2xl bg-white border shadow-[var(--shadow-soft)] px-4 py-3 min-w-[200px]">
                  <div className="text-[12px] text-[#64748B]">High Street Clinic</div>
                  <div className="text-[13px] font-semibold">Flu Jab available? NHS?</div>
                  <div className="mt-1 text-[11px] inline-flex px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#166534]">GDPR triage OK</div>
                </div>
              </div>
              <div className="pointer-events-none absolute left-[8%] -bottom-6 hidden sm:block drop-card" style={{animationDelay:"0.6s", animationName:"floaty"}}>
                <div className="rounded-2xl bg-[#0F172A] text-white px-4 py-3 min-w-[210px] shadow-[var(--shadow-card)]">
                  <div className="text-[11px] opacity-70">Bloom Salon</div>
                  <div className="text-[13px] font-semibold">Colour Cut & Style? £85?</div>
                  <div className="mt-1.5 text-[11px] opacity-80">Auto-booked • Deposit £20 via Stripe</div>
                </div>
              </div>
            </div>

            {/* Union Jack bunting accent */}
            <div className="mx-auto mt-10 hidden lg:flex justify-center gap-1 opacity-60">
              {Array.from({length:12}).map((_,i)=>(
                <div key={i} className="h-0 w-0 border-l-[10px] border-r-[10px] border-t-[16px] border-l-transparent border-r-transparent" style={{borderTopColor: i%2===0? "#012169":"#CE1126"}} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* UK High Street Showcase */}
      <section id="features" className="relative py-14 lg:py-20 bg-[#F8FAFC] border-y border-[var(--line)]">
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="reveal">
              <div className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.14em] uppercase text-[#475569]"><span className="h-px w-8 bg-[#CBD5E1]" /> London High Street — Your Businesses Live Here</div>
              <h2 className="mt-3 text-[32px] lg:text-[44px] leading-[0.95] font-bold">Union Jack bunting over <span className="text-gradient">four live storefronts</span>. Images speak more.</h2>
            </div>
            <div className="reveal text-[13px] text-[#64748B] max-w-[38ch]">Shot on Camberwell Road. Real menus, real hours. AiKOVA knows Bank Holiday exceptions, Sunday roasts, and colour appointments.</div>
          </div>

          <div className="mt-8 reveal rounded-[24px] overflow-hidden border bg-white shadow-[var(--shadow-card)]">
            <div className="relative aspect-[16/9] overflow-hidden">
              <img src={highStreet} alt="UK High Street with Union Jack bunting - Garden Restaurant, Brew & Bean Cafe, High Street Clinic, Bloom Salon" className="h-full w-full object-cover" />
              {/* Highlight overlay based on active category */}
              <div className="absolute inset-0 grid grid-cols-4">
                {SHOPS.map((s, idx)=>(
                  <div key={s.name} className={`relative transition-all duration-500 ${activeCat === CATEGORIES[idx]?.id || (CATEGORIES.find(c=>c.id===activeCat)?.shopMatch===idx) ? "bg-white/0 ring-2 ring-inset ring-[#2962FF]/40" : "bg-black/0"}`}>
                    {(activeCat === CATEGORIES[idx]?.id || CATEGORIES.find(c=>c.id===activeCat)?.shopMatch===idx) && (
                      <div className="absolute top-3 left-3 rounded-full bg-white px-3 py-1 text-[11px] font-semibold shadow">{s.name} • Active</div>
                    )}
                  </div>
                ))}
              </div>
              <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                {SHOPS.map(shop=>(
                  <span key={shop.name} className="rounded-full bg-white/90 backdrop-blur px-3 py-1.5 text-[11px] font-medium border shadow-sm">{shop.name} • {shop.tag}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SHOPS.map((shop, i)=>(
              <div key={shop.name} className="reveal rounded-2xl border bg-white p-4 shadow-sm hover:shadow-[var(--shadow-soft)] transition-all" style={{transitionDelay:`${i*80}ms`}}>
                <div className="flex items-center justify-between">
                  <div className="text-[11px] tracking-[0.12em] uppercase font-semibold text-[#64748B]">Shop {i+1}</div>
                  <div className="h-2 w-2 rounded-full" style={{background: shop.accent}} />
                </div>
                <div className="mt-2 text-[14px] font-bold leading-tight">{shop.name}</div>
                <div className="text-[12px] text-[#64748B] mt-1">{shop.tag}</div>
                <div className="mt-3 rounded-xl bg-[#F8FAFC] border px-3 py-2 text-[12px] font-medium">{shop.dish}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Categories Infographic */}
      <section id="solutions" className="py-16 lg:py-24">
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <div className="reveal text-center max-w-[760px] mx-auto">
            <div className="inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.14em] uppercase">London Business Categories • Updated 2024 • Infographic Style</div>
            <h2 className="mt-4 text-[32px] lg:text-[48px] leading-[0.95] font-bold">Key sectors driving London&apos;s dynamic economy</h2>
            <p className="mt-3 text-[15px] text-[#64748B]">Click a category to highlight its High Street twin. 1M+ businesses, 6 archetypes, 1 AI receptionist.</p>
          </div>

          <div className="mt-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
            {/* Infographic image centerpiece */}
            <div className="reveal rounded-[24px] overflow-hidden border bg-white shadow-[var(--shadow-card)]">
              <div className="p-3">
                <img src={catInfographic} alt="London Business Categories infographic - Restaurant 18k+, Cafe 7.5k+, Clinic, Salon, Retail, Professional Services with icons" className="w-full h-auto rounded-[16px] object-cover" />
              </div>
              <div className="px-5 py-3 border-t bg-[#F8FAFC] flex flex-wrap gap-2 text-[11px]">
                <span className="rounded-full bg-white border px-2.5 py-1">Plate/Bowl • Restaurant</span>
                <span className="rounded-full bg-white border px-2.5 py-1">Coffee Croissant • Café</span>
                <span className="rounded-full bg-white border px-2.5 py-1">Shield Cross Stethoscope • Clinic</span>
                <span className="rounded-full bg-white border px-2.5 py-1">Scissors Comb • Salon</span>
                <span className="rounded-full bg-white border px-2.5 py-1">Shopping Bag • Retail</span>
                <span className="rounded-full bg-white border px-2.5 py-1">Briefcase Chart • Pro Services</span>
              </div>
            </div>

            {/* Category cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {CATEGORIES.map((c, idx)=>(
                <button
                  key={c.id}
                  onClick={()=>setActiveCat(c.id)}
                  className={`reveal text-left rounded-2xl border bg-white p-4 shadow-sm hover:shadow-[var(--shadow-soft)] transition-all relative overflow-hidden ${activeCat===c.id ? "ring-2 ring-[#2962FF] border-[#2962FF]/30" : ""}`}
                  style={{transitionDelay:`${idx*60}ms`}}
                >
                  <div className="absolute top-0 inset-x-0 h-1" style={{background:`linear-gradient(90deg, #00E5FF, #2962FF, #76FF03)`}} />
                  <div className="flex items-start justify-between">
                    <div className="h-10 w-10 rounded-xl grid place-items-center text-[18px] border" style={{background:c.color}}>{c.icon}</div>
                    <span className="rounded-full bg-[#0F172A] text-white px-2.5 py-1 text-[11px] font-bold">{c.count}</span>
                  </div>
                  <div className="mt-3 font-bold text-[15px]">{c.name}</div>
                  <div className="mt-1 text-[12px] text-[#64748B] leading-snug">{c.desc}</div>
                  <div className="mt-3 text-[11px] font-medium rounded-xl bg-[#F8FAFC] border px-2.5 py-1.5">{c.detail}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How AiKOVA Helps */}
      <section className="py-14 lg:py-20 bg-[#0F172A] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.08]" style={{backgroundImage:`radial-gradient(circle at 20% 20%, #00E5FF 0, transparent 50%), radial-gradient(circle at 80% 80%, #CE1126 0, transparent 50%)`}} />
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8 relative">
          <div className="reveal flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[30px] lg:text-[42px] leading-[0.95] font-bold">How AiKOVA helps — Magic flavour, UK-specific.</h2>
            <div className="text-[13px] text-white/60 max-w-[36ch]">British English, Polish, French, Spanish — understands flat white vs latte, NHS vs private, balayage pricing.</div>
          </div>

          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {HELP.map((h,i)=>(
              <div key={h.cat} className="reveal rounded-2xl bg-white/[0.06] border border-white/10 p-5 backdrop-blur hover:bg-white/[0.08] transition">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full gradient-brand grid place-items-center text-[18px]">{h.icon}</div>
                  <div className="font-semibold">{h.cat}</div>
                  <span className="ml-auto text-[11px] rounded-full bg-white/10 px-2 py-0.5">{i+1 < 10 ? `0${i+1}` : i+1}</span>
                </div>
                <div className="mt-4 text-[13px] leading-relaxed">
                  <div className="text-white/60">Pain:</div>
                  <div className="font-medium">{h.pain}</div>
                  <div className="mt-3 text-white/60">Fix:</div>
                  <div className="text-white/90">{h.fix}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eurozone Expansion Road */}
      <section id="euro-road" className="py-16 lg:py-24 bg-white border-t">
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <div className="reveal">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#F1F5F9] border px-3 py-1 text-[11px] font-semibold tracking-[0.14em] uppercase">Eurozone Expansion Road • Infographic</div>
            <h2 className="mt-4 text-[30px] lg:text-[44px] leading-[0.95] font-bold">From Union Jack to EU blue — one receptionist, six capitals.</h2>
          </div>

          <div className="mt-10 relative">
            {/* road line */}
            <div className="hidden lg:block absolute top-[52px] left-[6%] right-[6%] h-[6px] rounded-full" style={{background:"linear-gradient(90deg, #012169 0%, #CE1126 18%, #EA580C 32%, #111827 48%, #1D4ED8 66%, #BE123C 84%, #DC2626 100%)"}} />
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              {ROAD.map((r, idx)=>(
                <div key={r.city} className="reveal rounded-2xl border bg-white p-4 shadow-sm hover:shadow-[var(--shadow-soft)] transition relative" style={{transitionDelay:`${idx*70}ms`}}>
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{background:r.color}} />
                    <div className="text-[12px] font-semibold tracking-wide uppercase text-[#64748B]">{r.country}</div>
                    <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold ${r.status==="Live" ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#F1F5F9] text-[#475569]"}`}>{r.status}</span>
                  </div>
                  <div className="mt-2 text-[18px] font-bold">{r.city}</div>
                  <div className="mt-1 text-[12px] text-[#64748B]">{r.lang}</div>
                  <div className="mt-3 rounded-xl bg-[#F8FAFC] border px-2.5 py-2 text-[11px]">Business hub • GDPR • +{r.city} numbers • Stripe SEPA</div>
                  {/* dot on road */}
                  <div className="hidden lg:block absolute -top-2 left-1/2 -translate-x-1/2 h-4 w-4 rounded-full border-4 border-white shadow" style={{background:r.color}} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Assess Button Update Section */}
      <section id="assess-update-section" className="py-16 lg:py-24 bg-[#F8FAFC] border-y">
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8 grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-start">
          <div className="reveal">
            <h2 className="text-[28px] lg:text-[40px] leading-[0.95] font-bold">Assess Your Business — Button Will Be Updated on Main Hero Page</h2>
            <p className="mt-4 text-[14px] leading-6 text-[#475569]">Clicking assess runs quick scan like cyberstaff video: Enter website URL → AiKOVA reads services/prices/location/hours → Creates AI receptionist → Live call — in less time than making a flat white!</p>

            <div className="mt-6 rounded-2xl border bg-[#0F172A] text-[#E2E8F0] p-4 font-mono text-[12px] leading-6 overflow-x-auto">
              <div className="text-white/50">// ASSESS BUTTON TO BE UPDATED ON MAIN HERO PAGE</div>
              <div>{`<button`}</div>
              <div className="pl-4">{`id="assess-button-main-hero"`}</div>
              <div className="pl-4">{`class="gradient-brand rounded-full px-5 h-10 text-white"`}</div>
              <div>{`>`}Assess Your Business →{`</button>`}</div>
              <div className="mt-3 text-[#7DD3FC]">→ This button is now live and scrolls to this assessor.</div>
            </div>

            <div className="mt-6 flex gap-2">
              <span className="rounded-full bg-white border px-3 py-1.5 text-[11px]">Website → AI brain</span>
              <span className="rounded-full bg-white border px-3 py-1.5 text-[11px]">Services • Prices • Hours</span>
              <span className="rounded-full bg-white border px-3 py-1.5 text-[11px]">Live call in &lt;10 min</span>
            </div>

            {assessments.length>0 && (
              <div className="mt-8 rounded-2xl border bg-white p-4">
                <div className="text-[12px] font-semibold uppercase tracking-wide">Recent UK Assessments • Live</div>
                <div className="mt-3 grid gap-2 max-h-[220px] overflow-auto pr-1">
                  {assessments.map((r:any)=>(
                    <div key={r.id} className="rounded-xl border bg-[#F8FAFC] px-3 py-2 text-[12px] flex justify-between">
                      <span className="font-medium">{r.value?.businessName || r.value?.website}</span>
                      <span className="text-[#64748B]">{r.value?.category} • {r.value?.website}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="reveal rounded-[24px] border bg-white p-6 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between">
              <div className="text-[14px] font-bold">UK Business Quick Scan</div>
              <span className="text-[11px] rounded-full bg-[#DCFCE7] text-[#166534] px-2.5 py-1 font-semibold">GDPR Ready • Twilio UK +44</span>
            </div>

            <form onSubmit={submitAssessment} className="mt-6 grid gap-4">
              <div>
                <label className="text-[12px] font-semibold text-[#334155]">Website URL</label>
                <input value={website} onChange={e=>setWebsite(e.target.value)} placeholder="https://thegarden-restaurant.co.uk" className="mt-1.5 w-full rounded-xl border bg-white px-4 h-11 text-[14px] outline-none focus:ring-2 focus:ring-[#2962FF]/30 focus:border-[#2962FF]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[12px] font-semibold text-[#334155]">Business Name</label>
                  <input value={bizName} onChange={e=>setBizName(e.target.value)} placeholder="The Garden Restaurant" className="mt-1.5 w-full rounded-xl border bg-white px-4 h-11 text-[14px] outline-none focus:ring-2 focus:ring-[#2962FF]/30" />
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-[#334155]">Category</label>
                  <select value={selectedCatForm} onChange={e=>setSelectedCatForm(e.target.value)} className="mt-1.5 w-full rounded-xl border bg-white px-3 h-11 text-[14px] outline-none">
                    {CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <button disabled={busy} type="submit" className="gradient-brand mt-2 rounded-full h-12 text-[14px] font-semibold text-white shadow disabled:opacity-60 hover:-translate-y-px transition">
                {busy ? "Scanning..." : "Assess Your Business →"}
              </button>

              <div className="text-[11px] text-[#64748B]">Like cyberstaff video flow: reads menu/services, prices, location/hours, Bank Holidays. No card required.</div>

              {savedMsg && <div className="rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] px-3 py-2.5 text-[12px] text-[#166534]">{savedMsg}</div>}
            </form>

            <div className="mt-6 rounded-xl bg-[#F8FAFC] border p-3 text-[11px] leading-5 text-[#475569]">
              <div className="font-semibold text-[#0F172A]">What happens after Assess?</div>
              1) Enter URL • 2) AiKOVA extracts roasts, flat white prices, flu jab hours, balayage ££ • 3) Builds receptionist • 4) Live call to your +44 number • 5) Demo booking appears like &quot;New booking 2pm 2 guests 24 Oct Confirmed&quot;.
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner UK */}
      <section className="py-10">
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          <div className="reveal relative overflow-hidden rounded-[28px] border shadow-[var(--shadow-card)]">
            <div className="absolute inset-0" style={{background:"linear-gradient(102deg, rgba(1,33,105,0.10) 0%, rgba(255,255,255,0.9) 35%, rgba(206,17,38,0.08) 100%)"}} />
            <div className="absolute inset-0 opacity-[0.06]" style={{backgroundImage:`linear-gradient(90deg, #012169 33%, white 33% 66%, #CE1126 66%)`}} />
            <div className="relative p-8 lg:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#0F172A] text-white px-3 py-1 text-[11px] font-semibold">🇬🇧 UK Ready • London • Camberwell to Camden</div>
                <h3 className="mt-3 text-[24px] lg:text-[32px] leading-[0.95] font-bold max-w-[22ch]">Ready to never miss a customer from Camden to Camberwell? Assess your business now.</h3>
                <p className="mt-2 text-[13px] text-[#475569] max-w-[52ch]">The Garden Restaurant, Brew & Bean, High Street Clinic, Bloom Salon — AiKOVA already speaks their language.</p>
              </div>
              <a href={startSetupUrl("eurozone")}  className="gradient-brand rounded-full h-[48px] px-8 text-[14px] font-semibold text-white shadow hover:-translate-y-px transition">Start free trial →
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-[#E2E8F0] bg-[#F8FAFC]">
        <AkcTierStrip />
      </div>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8 py-12">
          <div className="flex flex-wrap gap-10 justify-between">
            <div className="max-w-[320px]">
              <div className="flex items-center gap-2">
                <img src={logoImg} alt="AiKOVA logo" className="h-8 w-auto rounded-lg" />
                <span className="font-[Fraunces] font-bold text-[18px]">AiKOVA</span>
              </div>
              <p className="mt-3 text-[13px] leading-6 text-[#64748B]">London Economy Overview — Supporting 1M+ businesses. Covering Central London • North • South • East • West. Data: London Business Hub • Infographic Style • Updated 2024.</p>
              <div className="mt-4 flex gap-1.5">
                {["🇬🇧","🇪🇺","🇳🇱","🇩🇪","🇫🇷","🇪🇸","🇵🇱"].map(f=><span key={f} className="text-[18px]">{f}</span>)}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-[13px]">
              <div>
                <div className="font-semibold mb-3">Eurozone Pages</div>
                <div className="grid gap-2 text-[#64748B]">
                  {["UK Flag-Off • London","Netherlands • Amsterdam","Germany • Berlin","France • Paris","Spain • Madrid","Poland • Warsaw","Italy • Milan","Belgium • Brussels","Ireland • Dublin","Portugal • Lisbon","Sweden • Stockholm"].map(l=><a key={l} className="hover:text-black" href="#euro-road">{l}</a>)}
                </div>
              </div>
              <div>
                <div className="font-semibold mb-3">London Categories</div>
                <div className="grid gap-2 text-[#64748B]">
                  {CATEGORIES.map(c=><a key={c.id} href="/eu/solutions" className="hover:text-black">{c.name} • {c.count}</a>)}
                </div>
              </div>
              <div>
                <div className="font-semibold mb-3">High Street</div>
                <div className="grid gap-2 text-[#64748B]">
                  {SHOPS.map(s=><span key={s.name}>{s.name}</span>)}
                  <span>Camberwell RD • 24 Oct Bookings</span>
                </div>
              </div>
              <div>
                <div className="font-semibold mb-3">Trust</div>
                <div className="grid gap-2 text-[#64748B]">
                  <span>Twilio UK +44</span>
                  <span>Stripe SEPA GBP</span>
                  <span>GDPR Compliant</span>
                  <span>The Daily Nook • Coffee & Bakes</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t flex flex-wrap justify-between gap-3 text-[11px] text-[#94A3B8]">
            <span>© {new Date().getFullYear()} AiKOVA Eurozone Landing — UK Flag-Off Showcase • White theme • Meta magic flavour • Images speak more</span>
            <span>Union Jack #CE1126 #012169 • Gradient #00E5FF → #2962FF → #76FF03</span>
          </div>
        </div>
      </footer>

      {/* Demo modal */}
      {showDemo && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm p-5 grid place-items-center" onClick={()=>setShowDemo(false)}>
          <div className="w-full max-w-[720px] rounded-[24px] bg-white shadow-[var(--shadow-card)] overflow-hidden" onClick={e=>e.stopPropagation()}>
            <div className="p-2">
              <div className="rounded-[18px] overflow-hidden bg-[#0F172A] aspect-[16/9] grid place-items-center relative">
                <img src={cafeWoman} alt="demo preview" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                <div className="relative rounded-full bg-white px-5 py-3 text-[14px] font-semibold shadow flex items-center gap-3">
                  <span className="h-8 w-8 rounded-full bg-[#0F172A] text-white grid place-items-center">▶</span>
                  UK Demo 45s — The Daily Nook • AI Receptionist answering
                  <span className="ml-2 text-[11px] px-2 py-0.5 rounded-full bg-[#F1F5F9]">Playing mock</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white p-3 flex justify-between items-center">
                  <div className="text-[12px]"><span className="font-semibold">New booking 2pm 2 guests 24 Oct Confirmed</span><div className="text-[#64748B]">Camberwell RD • 45s call • English + Polish</div></div>
                  <button onClick={()=>setShowDemo(false)} className="rounded-full bg-[#0F172A] text-white px-4 h-8 text-[12px]">Close</button>
                </div>
              </div>
            </div>
            <div className="p-5 flex justify-between items-center">
              <div className="text-[13px] text-[#475569]">From Brew & Bean latte order to Bloom colour cut — one AI, 6 London categories.</div>
              <a href={startSetupUrl("eurozone")} className="gradient-brand rounded-full px-5 h-9 text-[13px] font-semibold text-white inline-flex items-center">Start free trial →</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
