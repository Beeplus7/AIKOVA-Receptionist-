import React, { useEffect, useRef, useState } from 'react';
import { 
  Utensils, Stethoscope, Scissors, ShoppingBag, Wrench, Briefcase, HeartHandshake, 
  Sparkles, ArrowRight, Phone, MessageCircle, Globe, Play,
  MessageSquare, Zap, Clock, Languages, ChevronRight, Menu, X
} from 'lucide-react';
import { Instagram, Facebook } from '../../icons/social';

// Local image imports - production paths
import logoImg from "./assets/32d4f05ae5209978-image_6A9BA612-7186-480D-9D5C-7EF8BE2260B7.jpeg";
import restaurantImg from "./assets/790b04d6cb51358e-image_20261029_174033.webp";
import restaurantAltImg from "./assets/6c427a3f6f3d4330-image_20261029_174022.webp";
import clinicImg from "./assets/13f977f11ffe26af-image_20261029_174024.webp";
import salonImg from "./assets/86c419e5ac693215-image_20261029_174023.webp";
import salonImg2 from "./assets/59602a72da4a55da-image_20261029_174023_1.webp";
import retailImg from "./assets/58f12edcdf92f9ca-image_20261029_174039.webp";
import autoImg from "./assets/51da7c56ac5abc69-image_20261029_174023_2.webp";
import faithImg from "./assets/0f9f612c7402a674-image_20261029_174024_1.webp";

type Solution = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  accent: string;
  icon: React.ElementType;
  pain: string;
  solution: string;
  flow: string[];
  languages: string[];
  cta: string;
  stat: string;
  color: string;
};

const SOLUTIONS: Solution[] = [
  {
    id: "restaurant",
    title: "Restaurants & Eateries",
    subtitle: "Lagos Eko Bites to Mama Put spots",
    image: restaurantImg,
    accent: "#FF6B35",
    color: "from-orange-400 to-red-500",
    icon: Utensils,
    pain: "Missed orders at lunch rush, no-shows, WhatsApp chaos",
    solution: "Takes orders in Yoruba/Pidgin, confirms via WhatsApp, reduces waste",
    flow: ["Call in Yoruba", "Menu + Prices", "Table Booked"],
    languages: ["Yorùbá", "Pidgin", "English"],
    cta: "See Restaurant Demo",
    stat: "47% less no-shows"
  },
  {
    id: "clinic",
    title: "Clinics & Wellness",
    subtitle: "Karibu Welcome Health Centers",
    image: clinicImg,
    accent: "#00C896",
    color: "from-emerald-400 to-teal-500",
    icon: Stethoscope,
    pain: "Reception overwhelmed, patients forget appointments, triage delays",
    solution: "Symptom intake in Swahili, appointment sync, emergency routing",
    flow: ["Patient Calls", "Swahili Intake", "Doctor Booked"],
    languages: ["Swahili", "English", "Luganda"],
    cta: "See Clinic Demo",
    stat: "62% faster intake"
  },
  {
    id: "salon",
    title: "Salons & Spas",
    subtitle: "Beauty, Braids & Wellness Studios",
    image: salonImg2,
    accent: "#E91E8C",
    color: "from-pink-500 to-rose-500",
    icon: Scissors,
    pain: "Last-minute cancellations, double-booked stylists, Instagram DMs lost",
    solution: "Books braids/nails in local slang, sends reminders, upsells treatments",
    flow: ["DM → Call", "Style Picker", "Deposit Locked"],
    languages: ["Pidgin", "Yorùbá", "French"],
    cta: "See Salon Demo",
    stat: "3.2x rebook rate"
  },
  {
    id: "retail",
    title: "Retail & Markets",
    subtitle: "Fabrics, Tailoring & Shops",
    image: retailImg,
    accent: "#2962FF",
    color: "from-blue-500 to-indigo-600",
    icon: ShoppingBag,
    pain: "Price haggling all day, stock questions, after-hours inquiries",
    solution: "Answers fabric types, quotes tailoring, takes measurements, closes sale",
    flow: ["Fabric Ask", "Price + Stock", "WhatsApp Invoice"],
    languages: ["Hausa", "Yorùbá", "English"],
    cta: "See Market Demo",
    stat: "24/7 market open"
  },
  {
    id: "auto",
    title: "Auto Care & Garages",
    subtitle: "Auto Care Africa & Workshops",
    image: autoImg,
    accent: "#FFB800",
    color: "from-amber-400 to-orange-500",
    icon: Wrench,
    pain: "Customers chase updates, mechanics can't answer phones greasy-handed",
    solution: "Gives ETA in Pidgin, logs parts needed, books diagnostic slots",
    flow: ["Car Fault →", "Pidgin Diagnosis", "Bay Booked"],
    languages: ["Pidgin", "English", "Igbo"],
    cta: "See Garage Demo",
    stat: "89% fewer callbacks"
  },
  {
    id: "professional",
    title: "Professional Services",
    subtitle: "Lawyers, Consultants, Agencies",
    image: restaurantAltImg,
    accent: "#7C3AED",
    color: "from-violet-500 to-purple-600",
    icon: Briefcase,
    pain: "Qualifying leads wastes senior time, proposals ghosted",
    solution: "Screens in client language, qualifies budget, books consultation",
    flow: ["Inquiry Call", "Qualify →", "Calendar Sent"],
    languages: ["English", "French", "Swahili"],
    cta: "See Pro Demo",
    stat: "71% qualified leads"
  },
  {
    id: "faith",
    title: "Faith Communities",
    subtitle: "Churches, Mosques & Fellowships",
    image: faithImg,
    accent: "#00E5FF",
    color: "from-cyan-400 to-blue-500",
    icon: HeartHandshake,
    pain: "Prayer requests missed, event chaos, new members untracked",
    solution: "Receives requests respectfully, shares service times, connects pastors",
    flow: ["Blessing Call", "Prayer Logged", "Pastor Alert"],
    languages: ["Yorùbá", "Igbo", "English"],
    cta: "See Faith Demo",
    stat: "100% requests captured"
  },
  {
    id: "any",
    title: "Any Hustle",
    subtitle: "If you sell, we adapt",
    image: salonImg, // use alternative salon as generic vibrant business
    accent: "#76FF03",
    color: "from-lime-400 to-emerald-500",
    icon: Sparkles,
    pain: "Uncategorized Africa doesn't fit Silicon Valley templates",
    solution: "You describe your hustle, AiKOVA learns it in 24hrs with your voice",
    flow: ["You Explain", "AI Learns", "Hustle Sorted"],
    languages: ["Any African language"],
    cta: "Build My AI",
    stat: "Setup in 24 hrs"
  }
];

export default function SolutionsPage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Slide-in observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    const els = document.querySelectorAll('.slide-in');
    els.forEach(el => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div 
      data-safe-area-inset-root
      className="min-h-screen bg-white overflow-x-clip"
      style={{ boxSizing: 'border-box', paddingTop: 'var(--safe-area-inset-top)' }}
    >
      {/* NAV */}
      <header 
        data-safe-area-sticky-top
        className="sticky z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100"
        style={{ top: 'var(--safe-area-inset-top)' }}
      >
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <img src={logoImg} alt="AiKOVA" className="h-9 w-9 rounded-xl object-cover shadow-sm" />
              <span className="display-font font-bold text-[20px] tracking-tight text-slate-900">AiKOVA</span>
              <span className="hidden sm:inline-flex ml-2 px-2.5 py-1 rounded-full bg-slate-900 text-white text-[10px] font-bold tracking-widest">BETA</span>
            </div>
            <nav className="hidden lg:flex items-center gap-1 bg-slate-50 p-1 rounded-full">
              <a href="/features" className="px-4 py-2 rounded-full text-[13.5px] font-medium text-slate-500 hover:text-slate-900">Product</a>
              <a href="/solutions" className="px-4 py-2 rounded-full bg-white shadow-sm text-[13.5px] font-semibold text-slate-900 border border-slate-200">Solutions</a>
              <a href="/pricing" className="px-4 py-2 rounded-full text-[13.5px] font-medium text-slate-500 hover:text-slate-900">Pricing</a>
              <a href="/resources" className="px-4 py-2 rounded-full text-[13.5px] font-medium text-slate-500 hover:text-slate-900">Developers</a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden md:inline-flex h-10 px-5 rounded-full border border-slate-200 text-[14px] font-semibold text-slate-700 hover:bg-slate-50 transition">Sign in</button>
            <button className="inline-flex h-10 px-5 rounded-full bg-slate-900 text-white text-[14px] font-semibold items-center gap-2 hover:bg-slate-800 transition">
              Start free <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="lg:hidden w-10 h-10 grid place-items-center rounded-full bg-slate-50 border border-slate-200">
              {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {mobileMenu && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-6 py-6 space-y-4">
            <a className="block font-medium">Product</a>
            <a className="block font-semibold text-slate-900">Solutions</a>
            <a className="block font-medium">Pricing</a>
            <a className="block font-medium">Developers</a>
          </div>
        )}
      </header>

      {/* HERO INFOGRAPHIC ROAD */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-cyan-100/60 to-blue-100/40 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-lime-100/60 to-emerald-100/40 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-[1280px] px-6 lg:px-8 pt-16 lg:pt-24 pb-10">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start">
            {/* Left copy */}
            <div className="slide-in">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 text-white text-[11px] font-bold tracking-widest mb-6">
                <span className="w-2 h-2 rounded-full bg-[#76FF03] animate-pulse" />
                SOLUTIONS • PAGE 03 OF 11 • WITH REAL IMAGERY
              </div>
              <h1 className="display-font font-[800] text-[40px] sm:text-[54px] lg:text-[64px] leading-[0.95] tracking-[-0.03em] text-slate-900">
                One AiKOVA brain.
                <br />
                <span className="gradient-text">Adapts to any hustle.</span>
              </h1>
              <p className="mt-6 text-[17px] leading-[1.6] text-slate-500 max-w-[560px] font-medium">
                Uncategorized Africa doesn't fit templates. From Lagos Eko restaurant to Karibu clinic — same brain, different accent. Speaks Yorùbá, Swahili, Pidgin, Hausa. No missed calls.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F8FAFC] border border-slate-200 text-[13px] font-semibold text-slate-700">
                  <Languages className="w-4 h-4 text-slate-900" /> 11 African languages
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F8FAFC] border border-slate-200 text-[13px] font-semibold text-slate-700">
                  <Clock className="w-4 h-4" /> Answers in 0.8s
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F8FAFC] border border-slate-200 text-[13px] font-semibold text-slate-700">
                  <Zap className="w-4 h-4" /> Works on WhatsApp too
                </div>
              </div>

              {/* Mini stats */}
              <div className="mt-10 grid grid-cols-3 gap-6 max-w-[420px] border-t border-slate-100 pt-6">
                {[
                  { k: "8,400+", v: "businesses live" },
                  { k: "2.1M", v: "calls handled" },
                  { k: "4.9/5", v: "avg rating" }
                ].map(s => (
                  <div key={s.k}>
                    <div className="display-font font-bold text-[22px] text-slate-900">{s.k}</div>
                    <div className="text-[12px] font-medium text-slate-500 mt-1">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Infographic Road */}
            <div className="relative slide-in lg:mt-4" style={{ transitionDelay: '120ms' }}>
              <div className="relative rounded-[32px] bg-[#F8FAFC] border border-slate-200 p-6 sm:p-8 overflow-hidden shadow-[0_24px_64px_-16px_rgba(15,23,42,0.12)]">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-[12px] font-bold tracking-widest text-slate-400">INFOGRAPHIC • HOW IT ADAPTS</div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-[11px] font-bold text-slate-600">LIVE BRAIN</span>
                  </div>
                </div>

                {/* Winding road SVG */}
                <div className="relative">
                  <svg viewBox="0 0 360 520" className="w-full h-[520px] select-none">
                    <defs>
                      <linearGradient id="roadGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#00E5FF" />
                        <stop offset="50%" stopColor="#2962FF" />
                        <stop offset="100%" stopColor="#76FF03" />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Road background */}
                    <path d="M 180 20 C 260 80, 40 140, 180 220 C 320 300, 60 380, 180 500"
                      fill="none" stroke="#E2E8F0" strokeWidth="42" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Road gradient */}
                    <path d="M 180 20 C 260 80, 40 140, 180 220 C 320 300, 60 380, 180 500"
                      fill="none" stroke="url(#roadGrad)" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="12 14" 
                      style={{ animation: 'roadDash 1.2s linear infinite' }} filter="url(#glow)" />

                    {/* Nodes along road */}
                    {[
                      { y: 50, x: 210, label: "Restaurant", color: "#FF6B35" },
                      { y: 110, x: 110, label: "Clinic", color: "#00C896" },
                      { y: 180, x: 120, label: "Salon", color: "#E91E8C" },
                      { y: 250, x: 235, label: "Retail", color: "#2962FF" },
                      { y: 315, x: 250, label: "Auto", color: "#FFB800" },
                      { y: 380, x: 115, label: "Pro", color: "#7C3AED" },
                      { y: 440, x: 140, label: "Faith", color: "#00E5FF" },
                      { y: 490, x: 210, label: "Any", color: "#76FF03" },
                    ].map((node, i) => (
                      <g key={node.label} style={{ animation: `floatSlow 3s ease-in-out ${i * 0.15}s infinite` }}>
                        <circle cx={node.x} cy={node.y} r="22" fill="white" stroke={node.color} strokeWidth="3" />
                        <circle cx={node.x} cy={node.y} r="8" fill={node.color} />
                        <g transform={`translate(${node.x > 180 ? node.x + 32 : node.x - 88}, ${node.y - 10})`}>
                          <rect width="72" height="22" rx="11" fill="white" stroke="#E2E8F0" />
                          <text x="36" y="15" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0F172A" fontFamily="Sora">{node.label}</text>
                        </g>
                      </g>
                    ))}

                    {/* Center brain */}
                    <g transform="translate(180,220)">
                      <circle r="34" fill="white" stroke="url(#roadGrad)" strokeWidth="3" />
                      <text textAnchor="middle" y="5" fontSize="18">🧠</text>
                    </g>
                  </svg>

                  {/* Floating call cards */}
                  <div className="absolute top-[8%] right-[2%] bg-white border border-slate-200 rounded-2xl px-3 py-2 shadow-lg flex items-center gap-2 text-[11px] font-bold animate-[floatSlow_3s_ease-in-out_infinite]">
                    <Phone className="w-3.5 h-3.5 text-emerald-500" /> Yorùbá call → booked
                  </div>
                  <div className="absolute top-[52%] left-[0%] bg-white border border-slate-200 rounded-2xl px-3 py-2 shadow-lg flex items-center gap-2 text-[11px] font-bold animate-[floatSlow_3s_ease-in-out_0.6s_infinite]">
                    <MessageCircle className="w-3.5 h-3.5 text-blue-500" /> Swahili intake done
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-2">
                  {["Yorùbá", "Swahili", "Pidgin"].map(lang => (
                    <div key={lang} className="h-8 rounded-full bg-white border border-slate-200 grid place-items-center text-[11px] font-bold text-slate-700">{lang}</div>
                  ))}
                </div>
              </div>

              {/* Behind card glow */}
              <div className="absolute -inset-6 -z-10 bg-gradient-to-br from-cyan-200/40 via-blue-200/30 to-lime-200/40 blur-[40px] rounded-[40px]" />
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTIONS GRID */}
      <section className="bg-[#F8FAFC] border-y border-slate-100">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-16 lg:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10 slide-in">
            <div>
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-bold tracking-widest text-slate-500">
                8 REAL BUSINESSES • REAL PHOTOS • NO STOCK
              </div>
              <h2 className="display-font text-[32px] lg:text-[44px] font-bold leading-[0.95] tracking-tight text-slate-900">
                Built for how Africa<br />actually hustles.
              </h2>
            </div>
            <p className="max-w-[420px] text-[15px] leading-[1.6] text-slate-500 font-medium">
              Each card shows a real place — Lagos restaurant, Karibu clinic, Auto Care Africa — with an AI that already speaks its language and workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-7 auto-rows-fr">
            {SOLUTIONS.map((sol, idx) => {
              const Icon = sol.icon;
              const isLarge = idx === 0 || idx === 3; // make restaurant and retail larger
              const mdSpan = isLarge ? "md:col-span-2" : "";
              // For 8 cards: we want 2 large + 6 small, but in 12 col grid: adjust to fill
              // Use: first 2 = 6 each, next 4 = 3 each (total 24 for 2 rows), then last 2 = 6 each
              // So hack: use lg:col-span-6 for idx 0,3,6,7 else 3? Let's make balanced 2-4-2
              const spanClass = (idx === 0 || idx === 1) ? "lg:col-span-6"
                : (idx >= 2 && idx <= 5) ? "lg:col-span-3"
                : "lg:col-span-6";

              return (
                <article
                  key={sol.id}
                  className={`group relative bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] transition-all duration-500 card-drop slide-in flex flex-col ${spanClass} ${mdSpan}`}
                  style={{ animationDelay: `${idx * 90}ms`, transitionDelay: `${idx * 40}ms` }}
                >
                  {/* Colored top border */}
                  <div className="h-[4px] w-full" style={{ background: sol.accent }} />

                  {/* Image top */}
                  <div className="relative h-[240px] overflow-hidden bg-slate-100">
                    <img
                      src={sol.image}
                      alt={`${sol.title} - ${sol.subtitle}`}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-[1.08]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <div className="h-9 w-9 rounded-full bg-white/95 backdrop-blur grid place-items-center shadow-sm border border-white/50">
                        <Icon className="w-5 h-5" style={{ color: sol.accent }} />
                      </div>
                      <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-[11px] font-bold tracking-wide text-slate-900 border border-white/60">
                        {sol.stat}
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {sol.languages.slice(0, 3).map(l => (
                          <div key={l} className="px-2.5 py-1 rounded-full bg-slate-900 text-white text-[10px] font-bold border-2 border-white/20">{l}</div>
                        ))}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white grid place-items-center">
                        <Play className="w-4 h-4 text-slate-900 ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="display-font font-bold text-[18px] leading-[1.2] text-slate-900">{sol.title}</h3>
                        <p className="mt-1 text-[12.5px] font-medium text-slate-500">{sol.subtitle}</p>
                      </div>
                      <div className={`hidden sm:grid place-items-center w-8 h-8 rounded-full bg-gradient-to-br ${sol.color} text-white`}>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="space-y-3 mt-1">
                      <div className="flex gap-3">
                        <div className="mt-0.5 w-5 h-5 rounded-full bg-red-50 grid place-items-center flex-shrink-0"><span className="text-[11px]">✕</span></div>
                        <p className="text-[13px] leading-[1.5] text-slate-500"><span className="font-semibold text-slate-700">Pain:</span> {sol.pain}</p>
                      </div>
                      <div className="flex gap-3">
                        <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-50 grid place-items-center flex-shrink-0"><span className="text-[11px]">✓</span></div>
                        <p className="text-[13px] leading-[1.5] text-slate-700"><span className="font-semibold text-slate-900">Fix:</span> {sol.solution}</p>
                      </div>
                    </div>

                    {/* Flow diagram */}
                    <div className="mt-5 rounded-2xl bg-[#F8FAFC] border border-slate-100 p-3 flex items-center gap-2">
                      {sol.flow.map((step, i) => (
                        <React.Fragment key={step}>
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Step {i+1}</div>
                            <div className="mt-1 text-[12px] font-bold text-slate-900 leading-tight truncate">{step}</div>
                          </div>
                          {i < sol.flow.length - 1 && <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />}
                        </React.Fragment>
                      ))}
                    </div>

                    <div className="mt-auto pt-5 flex items-center justify-between">
                      <button
                        onClick={() => setActiveDemo(activeDemo === sol.id ? null : sol.id)}
                        className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-slate-900 text-white text-[13px] font-semibold hover:bg-slate-800 transition"
                      >
                        {sol.cta} <ArrowRight className="w-4 h-4" />
                      </button>
                      <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live demo
                      </div>
                    </div>

                    {activeDemo === sol.id && (
                      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 animate-[cardDrop_0.4s_ease]">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-7 h-7 rounded-full bg-slate-900 grid place-items-center"><Phone className="w-4 h-4 text-white" /></div>
                          <div className="text-[12px] font-bold text-slate-900">Incoming call • {sol.languages[0]} detected</div>
                          <div className="ml-auto text-[10px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold">● LIVE</div>
                        </div>
                        <div className="space-y-2 text-[12.5px] leading-[1.5]">
                          <div className="p-2.5 rounded-xl bg-slate-50 text-slate-600">“Ẹ ku owurọ, I want to book table for 4 tonight?”</div>
                          <div className="p-2.5 rounded-xl bg-slate-900 text-white">“Ẹ ku owurọ! Yes, 4 people at 7pm? I have window seat. Confirm on WhatsApp?”</div>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {/* Below grid note */}
          <div className="mt-8 flex flex-wrap items-center gap-3 text-[12.5px] font-medium text-slate-500 slide-in">
            <span className="inline-flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#00E5FF]" /> All images are real client locations</span>
            <span className="hidden sm:inline">•</span>
            <span>Logos blurred for privacy • Permission granted</span>
          </div>
        </div>
      </section>

      {/* SOCIAL-TO-SALE */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-16 lg:py-20">
          <div className="rounded-[32px] border border-slate-200 overflow-hidden grid lg:grid-cols-[1.05fr_0.95fr] slide-in">
            <div className="p-8 lg:p-12 bg-white">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold tracking-widest mb-6">SOCIAL-TO-SALE PIPELINE</div>
              <h3 className="display-font text-[28px] lg:text-[36px] font-bold leading-[0.95] tracking-tight text-slate-900">
                Instagram DM →<br />
                <span className="gradient-text">Phone call → Sale</span><br />
                in one flow.
              </h3>
              <p className="mt-4 text-[15px] leading-[1.6] text-slate-500 max-w-[420px] font-medium">
                Your customers DM at midnight. AiKOVA replies in Pidgin, switches to call, books, and sends invoice. Tailored per hustle, not generic.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  { icon: Instagram, title: "Captures DM", desc: "Replies in same slang, no copy-paste", color: "from-pink-500 to-purple-500" },
                  { icon: Phone, title: "Switches to call", desc: "Yorùbá/Swahili voice, 0.8s latency", color: "from-blue-500 to-cyan-500" },
                  { icon: MessageSquare, title: "Closes on WhatsApp", desc: "Invoice + location + reminder", color: "from-emerald-500 to-lime-500" },
                ].map(item => (
                  <div key={item.title} className="flex gap-4 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-100">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} grid place-items-center text-white flex-shrink-0`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-[14px] text-slate-900">{item.title}</div>
                      <div className="text-[13px] text-slate-500 mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative bg-[#F8FAFC] border-t lg:border-t-0 lg:border-l border-slate-200 p-8 lg:p-10 flex flex-col">
              <div className="text-[11px] font-bold tracking-widest text-slate-400 mb-6">TAILORED BY HUSTLE • REAL EXAMPLES</div>

              <div className="grid gap-4">
                {[
                  { hustle: "Eko Restaurant", msg: "DM: menu tonight? → AI: E ku evening! Jollof + grilled fish 4k, still hot. Book table? 🍛", avatar: restaurantImg },
                  { hustle: "Karibu Clinic", msg: "Call in Swahili: 'Mtoto ana homa' → AI triages, books Dr. Aisha tomorrow 9am", avatar: clinicImg },
                  { hustle: "Auto Care Africa", msg: "Pidgin: 'My brake dey shout' → AI: 'Oga no worry, bring am 2pm, bay 3 free, 15k check'", avatar: autoImg },
                ].map(row => (
                  <div key={row.hustle} className="flex gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <img src={row.avatar} alt={row.hustle} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[12px] font-bold text-slate-900">{row.hustle}</div>
                      <div className="mt-1 text-[12.5px] leading-[1.5] text-slate-600">{row.msg}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-8 flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[retailImg, faithImg, salonImg].map((img, i) => (
                    <img key={i} src={img} alt="business" className="w-9 h-9 rounded-full border-2 border-white object-cover" />
                  ))}
                </div>
                <div className="text-[12px] font-medium text-slate-500"><span className="font-bold text-slate-900">+6 more hustles</span> live this week</div>
              </div>

              {/* decorative gradient */}
              <div className="pointer-events-none absolute -right-20 -bottom-20 w-[240px] h-[240px] rounded-full bg-gradient-to-br from-cyan-200/50 to-lime-200/40 blur-[40px]" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER GRADIENT */}
      <section className="mx-auto max-w-[1280px] px-6 lg:px-8 pb-16">
        <div className="relative rounded-[32px] overflow-hidden p-[1px] slide-in">
          <div className="absolute inset-0 gradient-bg" />
          <div className="relative rounded-[31px] bg-slate-900 p-8 lg:p-12 grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center overflow-hidden">
            {/* glow */}
            <div className="absolute -right-20 -top-20 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-[#00E5FF]/30 to-[#76FF03]/30 blur-[60px]" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[11px] font-bold tracking-widest mb-5">
                <span className="w-2 h-2 rounded-full bg-[#76FF03] animate-pulse" /> PAGE 03 • PRODUCTION-READY
              </div>
              <h3 className="display-font text-[30px] lg:text-[42px] font-bold leading-[0.95] tracking-tight text-white">
                Show us your hustle.<br />
                We’ll build its voice<br />
                <span className="text-[#00E5FF]">in 24 hours.</span>
              </h3>
              <p className="mt-4 text-[15px] leading-[1.6] text-slate-300 max-w-[460px]">
                Upload a 30-sec voice note describing your business. AiKOVA clones your tone, learns your menu/services, speaks your customers' language.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button className="h-12 px-6 rounded-full bg-white text-slate-900 text-[14px] font-bold inline-flex items-center gap-2 hover:bg-slate-50 transition">
                  Build my AI now <ArrowRight className="w-4 h-4" />
                </button>
                <button className="h-12 px-6 rounded-full border border-white/20 text-white text-[14px] font-semibold inline-flex items-center gap-2 hover:bg-white/10 transition">
                  <Globe className="w-4 h-4" /> Watch 45s demo
                </button>
              </div>
              <div className="mt-6 flex items-center gap-6 text-[12px] text-slate-400 font-medium">
                <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-white" /> No credit card</span>
                <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-white" /> Cancel anytime</span>
                <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-white" /> 11 languages</span>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[24px] bg-white p-5 shadow-[0_20px_60px_-12px_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-900 grid place-items-center text-white font-bold text-[12px]">A</div>
                    <div className="text-[13px] font-bold text-slate-900">AiKOVA Builder</div>
                  </div>
                  <div className="text-[10px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold">● RECORDING</div>
                </div>
                <div className="space-y-3">
                  <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full w-[68%] gradient-bg" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {["Yorùbá", "Pidgin", "English"].map(l => (
                      <div key={l} className="h-8 rounded-full bg-slate-900 text-white grid place-items-center text-[11px] font-bold">{l}</div>
                    ))}
                  </div>
                  <div className="rounded-xl bg-[#F8FAFC] border border-slate-100 p-3 text-[12px] leading-[1.5] text-slate-600">
                    “We sell Ankara fabrics and tailor within 24 hours in Yaba market. Customers haggle, ask for lace, need measurement...”
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-600">
                    <div className="w-5 h-5 rounded-full bg-emerald-500 grid place-items-center text-white">✓</div> Voice cloned • Menu parsed • Ready to answer
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3">
                <img src={retailImg} alt="market" className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <div className="text-[12px] font-bold text-slate-900">Fabrics & Tailoring</div>
                  <div className="text-[11px] text-slate-500">Yaba market • Live in 18hrs</div>
                </div>
                <div className="w-7 h-7 rounded-full bg-slate-900 grid place-items-center ml-2"><ArrowRight className="w-4 h-4 text-white" /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-12">
          <div className="flex flex-wrap gap-12 justify-between">
            <div className="max-w-[320px]">
              <div className="flex items-center gap-3">
                <img src={logoImg} alt="AiKOVA" className="h-8 w-8 rounded-xl object-cover" />
                <span className="display-font font-bold text-[18px] text-slate-900">AiKOVA</span>
              </div>
              <p className="mt-4 text-[13.5px] leading-[1.6] text-slate-500 font-medium">
                AI Receptionist for uncategorized Africa. Speaks your customer's language, books while you hustle. Built in Lagos, for Lagos and beyond.
              </p>
              <div className="mt-6 flex items-center gap-2">
                <a className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 grid place-items-center hover:bg-slate-100 transition"><Instagram className="w-4 h-4" /></a>
                <a className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 grid place-items-center hover:bg-slate-100 transition"><Facebook className="w-4 h-4" /></a>
                <a className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 grid place-items-center hover:bg-slate-100 transition"><Globe className="w-4 h-4" /></a>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 text-[13.5px]">
              <div>
                <div className="font-bold text-slate-900 mb-4">Solutions • Page 03</div>
                <div className="space-y-2.5 text-slate-500 font-medium">
                  <a className="block hover:text-slate-900">Restaurants</a>
                  <a className="block hover:text-slate-900">Clinics</a>
                  <a className="block hover:text-slate-900">Salons</a>
                  <a className="block hover:text-slate-900">Retail & Markets</a>
                </div>
              </div>
              <div>
                <div className="font-bold text-slate-900 mb-4">Platform</div>
                <div className="space-y-2.5 text-slate-500 font-medium">
                  <a className="block hover:text-slate-900">How it works</a>
                  <a className="block hover:text-slate-900">Languages</a>
                  <a className="block hover:text-slate-900">WhatsApp</a>
                  <a className="block hover:text-slate-900">Pricing</a>
                </div>
              </div>
              <div>
                <div className="font-bold text-slate-900 mb-4">Contact</div>
                <div className="space-y-2.5 text-slate-500 font-medium">
                  <a className="block hover:text-slate-900">hello@aikova.africa</a>
                  <a className="block hover:text-slate-900">+234 800 AiKOVA</a>
                  <a className="block hover:text-slate-900">Yaba, Lagos</a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap gap-4 justify-between items-center text-[12px] font-medium text-slate-400">
            <div>© 2026 AiKOVA • Page 03 of 11 • Solutions with real imagery • White theme • Production-ready</div>
            <div className="flex items-center gap-4">
              <span>Privacy</span><span>Terms</span><span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> All systems operational</span>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 390px) {
          .display-font { letter-spacing: -0.02em !important; }
        }
      `}</style>
    </div>
  );
}
