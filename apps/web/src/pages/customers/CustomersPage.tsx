import { useEffect, useRef, useState } from "react";
import logoImg from "./assets/32d4f05ae5209978-image_6A9BA612-7186-480D-9D5C-7EF8BE2260B7.jpeg";
import restaurantImg from "./assets/9b1b347af74fc5b4-image_20261029_184252.webp";
import salonImg from "./assets/fc52085e521e5117-image_20261029_184254.webp";
import clinicImg from "./assets/ce9e7e22371f1a8b-image_20261029_184258.webp";
import groupImg from "./assets/a80f5700c652c8f7-image_20261029_184303.webp";
import { 
  Utensils, Scissors, Stethoscope, ShoppingBag, Wrench, Briefcase,
  PhoneOff, CalendarCheck, Languages, Clock3, Play, ArrowUpRight,
  MessageCircle, Sparkles, Quote, Check, MapPin, Star
} from "lucide-react";
import { Instagram } from "../../icons/social";

// Hook for reveal animation
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    const items = el.querySelectorAll(".reveal");
    items.forEach(i => obs.observe(i));
    return () => obs.disconnect();
  }, []);
  return ref;
}

export default function CustomersPage() {
  const revealRef = useReveal();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [playing, setPlaying] = useState(false);

  return (
    <div
      data-safe-area-inset-root
      className="min-h-screen w-full bg-white text-slate-900 overflow-x-clip antialiased"
      style={{ boxSizing: "border-box", paddingTop: "var(--safe-area-inset-top)", background: "var(--bg)" }}
    >
      <style>{`
        html { scroll-behavior: smooth; }
        .card-hover { transition: transform .45s cubic-bezier(.16,1,.3,1), box-shadow .45s ease; }
        .card-hover:hover { transform: translateY(-6px); box-shadow: var(--shadow-hover); }
      `}</style>

      {/* NAV */}
      <header
        data-safe-area-sticky-top
        className="sticky z-50 top-[var(--safe-area-inset-top)] w-full border-b border-slate-100 bg-white/85 backdrop-blur-xl"
        style={{ top: "var(--safe-area-inset-top)" } as any}
      >
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <img src={logoImg} alt="AiKOVA logo" className="h-9 w-9 rounded-xl object-cover" />
              <span className="font-extrabold text-[20px] tracking-tight">AiKOVA</span>
              <span className="hidden sm:inline-flex ml-2 text-[11px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-slate-900 text-white">AI RECEPTIONIST</span>
            </div>
            <nav className="hidden lg:flex items-center gap-1 text-[14px] font-medium text-slate-600">
              {["Features","Solutions","Languages","How It Works","Pricing"].map(l => (
                <a key={l} href={`#${l.toLowerCase().replace(/\s/g,'-')}`} className="px-3.5 py-2 rounded-full hover:bg-slate-50 hover:text-slate-900 transition">{l}</a>
              ))}
              <a href="#customers" className="px-4 py-2 rounded-full text-white font-semibold shadow-sm" style={{ background: "var(--gradient)" }}>Customers</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <a href="#demo" className="hidden md:inline-flex text-[14px] font-semibold px-4 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 transition">Demo</a>
            <a href="#trial" className="inline-flex items-center gap-2 text-[14px] font-bold px-5 py-2.5 rounded-full text-white shadow-[0_8px_20px_rgba(41,98,255,0.25)] hover:scale-[1.02] active:scale-[0.98] transition" style={{ background: "var(--gradient)" }}>
              Start Free Trial <ArrowUpRight className="h-4 w-4" />
            </a>
            <button onClick={()=>setMobileOpen(v=>!v)} className="lg:hidden h-10 w-10 grid place-items-center rounded-full border border-slate-200">
              <span className="text-xl leading-none">{mobileOpen ? "×" : "≡"}</span>
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-6 py-6 flex flex-col gap-4">
            {["Features","Solutions","Languages","How It Works","Pricing","Customers"].map(l => (
              <a key={l} className={`text-[15px] font-medium ${l==="Customers" ? "gradient-text font-bold" : "text-slate-600"}`} href={({"Features":"/features","Solutions":"/solutions","Languages":"/languages","How It Works":"/how-it-works","How it Works":"/how-it-works","Pricing":"/pricing","Company":"/company","Customers":"/customers","Resources":"/resources","Demo":"/business","Business":"/business","Product":"/features","Developers":"/resources","About":"/company","About us":"/company","Blog":"/resources","Contact":"/get-started","Careers":"/company","Press":"/company","Founder Story":"/company","API Docs":"/resources","Playbooks":"/resources","Market Insights":"/resources","Compliance":"/resources","Growth Roadmap":"/resources","Case Studies":"/customers","Wall of Love":"/customers","Invoca Benchmark":"/customers","M-Pesa Billing":"/pricing","Salons":"/solutions","Clinics":"/solutions","Real Estate":"/solutions","E-commerce":"/solutions","Privacy":"/get-started","Terms":"/get-started","NDPA":"/get-started"} as Record<string,string>)[l] ?? "#"}>{l}</a>
            ))}
          </div>
        )}
      </header>

      <main ref={revealRef} className="w-full">
        {/* HERO */}
        <section className="relative bg-white overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-24 h-[520px] w-[520px] rounded-full blur-[90px] opacity-[0.12]" style={{ background: "var(--gradient)" }} />
            <div className="absolute top-40 -left-24 h-[420px] w-[420px] rounded-full blur-[80px] opacity-[0.08]" style={{ background: "var(--gradient)" }} />
          </div>

          <div className="mx-auto max-w-[1280px] px-6 lg:px-8 pt-16 lg:pt-24 pb-10 lg:pb-16 relative">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
              <div>
                <div className="reveal inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-bold tracking-[0.18em] uppercase text-slate-700">
                  <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: "#76FF03" }} />
                  Customers • Trusted Across Africa
                </div>

                <h1 className="reveal delay-1 mt-6 text-[40px] lg:text-[64px] leading-[0.92] font-extrabold tracking-[-0.03em]">
                  <span className="serif font-normal italic text-slate-500 text-[0.85em]">2000+</span> African businesses
                  <br />
                  <span className="gradient-text">never miss</span> a customer
                </h1>

                <p className="reveal delay-2 mt-6 text-[18px] leading-relaxed text-slate-600 max-w-[560px]">
                  From Lagos restaurant to Nairobi clinic to Accra salon, AiKOVA adapts. Real voices, real accents, real bookings — even when you're in the market, weaving, or on rounds.
                  <span className="ml-2 inline-flex items-center gap-1 font-semibold text-slate-900"><Sparkles className="h-4 w-4" /> Torch of God constancy.</span>
                </p>

                <div className="reveal delay-3 mt-8 flex flex-wrap items-center gap-4">
                  <a href="#testimonials" className="inline-flex h-[48px] items-center justify-center px-7 rounded-full text-white font-bold text-[15px] shadow-lg hover:scale-[1.02] active:scale-[0.98] transition" style={{ background: "var(--gradient)" }}>
                    Meet our customers
                  </a>
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[restaurantImg, salonImg, clinicImg].map((s,i)=>(
                        <img key={i} src={s} alt="customer avatar" className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-sm" />
                      ))}
                    </div>
                    <div className="text-[13px] leading-tight">
                      <div className="flex items-center gap-1 font-bold"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> 4.9/5 from 1,200 reviews</div>
                      <div className="text-slate-500">Lagos • Nairobi • Accra</div>
                    </div>
                  </div>
                </div>

                <div className="reveal mt-10 flex flex-wrap gap-3">
                  {[
                    "Yoruba • Pidgin • Igbo",
                    "Swahili • English • Sheng",
                    "Twi • Ga • Hausa"
                  ].map(t=>(
                    <span key={t} className="px-3.5 py-1.5 rounded-full bg-[#F8FAFC] border border-slate-200 text-[12px] font-semibold text-slate-700">{t}</span>
                  ))}
                </div>
              </div>

              {/* HERO IMAGE CARD */}
              <div className="reveal delay-2 relative">
                <div className="absolute -inset-4 rounded-[32px] opacity-30 blur-[24px]" style={{ background: "var(--gradient-soft)" }} />
                <div className="relative bg-white rounded-[28px] p-2.5 shadow-[0_24px_64px_rgba(15,23,42,0.12)] border border-slate-100">
                  <div className="relative rounded-[20px] overflow-hidden aspect-[4/3] bg-slate-50 group">
                    <img src={groupImg} alt="AiKOVA Connecting Small Businesses Nairobi Lagos Accra - 5 happy customers with Africa map pins" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                    {/* Overlay content */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-[11px] font-bold tracking-widest uppercase shadow">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Live • Torch of God
                      </div>
                      <div className="px-3 py-1.5 rounded-full bg-white text-[11px] font-bold shadow">Africa Map • Lagos Nairobi Accra</div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <div className="text-white font-bold text-[18px] leading-tight">AiKOVA Connecting Small Businesses</div>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {["Lagos badge","Accra badge","Nairobi badge"].map(b=>(
                              <span key={b} className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-[10px] font-bold uppercase tracking-wide text-slate-800">{b}</span>
                            ))}
                          </div>
                        </div>
                        <div className="h-12 w-12 rounded-full grid place-items-center bg-white shadow-lg">
                          <span className="text-[20px]">☀️</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* floating metrics */}
                  <div className="mt-2.5 grid grid-cols-3 gap-2.5">
                    {[
                      {k:"Calls answered", v:"100%"},
                      {k:"Avg response", v:"1.2s"},
                      {k:"Saved vs Slang", v:"$371/mo"},
                    ].map(m=>(
                      <div key={m.k} className="rounded-2xl bg-[#F8FAFC] border border-slate-100 px-3 py-3">
                        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{m.k}</div>
                        <div className="mt-1 text-[16px] font-extrabold">{m.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS BAR */}
        <section className="bg-[#F8FAFC] border-y border-slate-100">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-10 lg:py-14">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: PhoneOff, label: "Missed calls saved", value: "70%", sub: "Invoca benchmark 52% missed → 0 with AiKOVA", accent: "#00E5FF" },
                { icon: CalendarCheck, label: "Bookings uplift", value: "+142%", sub: "Average across 2000+ businesses", accent: "#2962FF" },
                { icon: Languages, label: "Languages", value: "12+", sub: "Yoruba, Pidgin, Swahili, Twi, English...", accent: "#76FF03" },
                { icon: Clock3, label: "Uptime", value: "24/7", sub: "Torch of God constancy, never sleeps", accent: "#00E5FF" },
              ].map((s, i)=>(
                <div key={s.label} className="reveal card-hover gradient-border-top bg-white rounded-[20px] p-6 border border-slate-100" style={{ transitionDelay: `${i*80}ms` }}>
                  <div className="h-10 w-10 rounded-full grid place-items-center" style={{ background: `color-mix(in srgb, ${s.accent} 14%, white)` }}>
                    <s.icon className="h-5 w-5" style={{ color: s.accent === "#76FF03" ? "#3a6b00" : "#2962FF" }} />
                  </div>
                  <div className="mt-4 text-[42px] leading-none font-extrabold tracking-tight">{s.value}</div>
                  <div className="mt-2 text-[13px] font-bold uppercase tracking-wide text-slate-700">{s.label}</div>
                  <div className="mt-2 text-[13px] leading-snug text-slate-500">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS GRID */}
        <section id="testimonials" className="bg-white py-16 lg:py-24">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
              <div className="reveal">
                <div className="inline-flex px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold tracking-widest uppercase">Real Stories • Real Warm Light</div>
                <h2 className="mt-4 text-[32px] lg:text-[48px] leading-[0.95] font-extrabold tracking-tight max-w-[640px]">
                  Not actors. <span className="serif font-normal italic text-slate-400">Real owners</span> who turned missed calls into money.
                </h2>
              </div>
              <p className="reveal delay-1 max-w-[360px] text-[15px] leading-relaxed text-slate-600">
                Same warm African lighting as No.3-6. Same Torch. We photograph where they work — market, salon chair, clinic.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 lg:gap-7">
              {/* Restaurant */}
              <article className="reveal card-hover group bg-white rounded-[28px] border border-slate-100 overflow-hidden shadow-[var(--shadow-card)] flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img src={restaurantImg} alt="Adeola O. - Eko Bites Lagos restaurant owner testimonial - curly hair woman in ankara blazer" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1.5 rounded-full bg-white text-[11px] font-bold uppercase tracking-wide shadow flex items-center gap-1.5"><Utensils className="h-3.5 w-3.5" /> Restaurant</span>
                    <span className="px-3 py-1.5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center gap-1"><MapPin className="h-3 w-3" /> Lagos</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-[11px] font-bold">+110% bookings</div>
                    <div className="h-8 w-8 rounded-full bg-white grid place-items-center shadow"><Quote className="h-4 w-4" /></div>
                  </div>
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-[12px] font-bold tracking-wide uppercase text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Verified owner • Eko Bites</div>
                  <blockquote className="mt-4 text-[20px] leading-[1.35] font-medium tracking-tight serif italic text-slate-900">
                    “AiKOVA answers in Yoruba & Pidgin even when I'm in market. My bookings doubled, saved N578k vs Slang $399”
                  </blockquote>
                  <div className="mt-6 flex items-center gap-3">
                    <img src={restaurantImg} alt="Adeola" className="h-10 w-10 rounded-full object-cover" />
                    <div>
                      <div className="text-[14px] font-bold">Adeola O. — Eko Bites Lagos</div>
                      <div className="text-[12px] text-slate-500">Restaurant • Balogun Market, Lagos</div>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-[#F8FAFC] border border-slate-100 px-4 py-3">
                      <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Metric</div>
                      <div className="mt-1 font-extrabold text-[15px]">+110% bookings</div>
                    </div>
                    <div className="rounded-2xl px-4 py-3 text-white font-bold text-[13px] flex items-center justify-center" style={{ background: "var(--gradient)" }}>Saved N578k</div>
                  </div>
                </div>
              </article>

              {/* Salon */}
              <article className="reveal delay-1 card-hover group bg-white rounded-[28px] border border-slate-100 overflow-hidden shadow-[var(--shadow-card)] flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img src={salonImg} alt="Amara - Glam Roots Salon owner testimonial - braids gold beads weaving beauty" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1.5 rounded-full bg-white text-[11px] font-bold uppercase tracking-wide shadow flex items-center gap-1.5"><Scissors className="h-3.5 w-3.5" /> Salon</span>
                    <span className="px-3 py-1.5 rounded-full bg-[#76FF03] text-slate-900 text-[11px] font-bold">Est 2019</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-[11px] font-bold">+85% IG bookings</div>
                    <div className="px-3 py-1.5 rounded-full bg-white text-[11px] font-bold shadow">Weaving Beauty Building Confidence</div>
                  </div>
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-[12px] font-bold tracking-wide uppercase text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-[#2962FF]" /> Instagram-first • Accra</div>
                  <blockquote className="mt-4 text-[20px] leading-[1.35] font-medium tracking-tight serif italic text-slate-900">
                    “Instagram DMs ‘how much braids?’ now auto-DM and book. No more missed clients. Weaving Beauty Building Confidence Est 2019”
                  </blockquote>
                  <div className="mt-6 flex items-center gap-3">
                    <img src={salonImg} alt="Amara" className="h-10 w-10 rounded-full object-cover" />
                    <div>
                      <div className="text-[14px] font-bold">Amara — Glam Roots Salon</div>
                      <div className="text-[12px] text-slate-500">Salon • Osu, Accra • @glamroots</div>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-[#F8FAFC] border border-slate-100 px-4 py-3">
                      <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">DM → Booking</div>
                      <div className="mt-1 font-extrabold text-[15px]">+85% IG bookings</div>
                    </div>
                    <div className="rounded-2xl px-4 py-3 bg-slate-900 text-white font-bold text-[13px] flex items-center justify-center gap-1.5"><Instagram className="h-4 w-4" /> Auto-DM on</div>
                  </div>
                </div>
              </article>

              {/* Clinic */}
              <article className="reveal delay-2 card-hover group bg-white rounded-[28px] border border-slate-100 overflow-hidden shadow-[var(--shadow-card)] flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img src={clinicImg} alt="Dr. Aisha Njeri - Mara Health Centre Nairobi clinic doctor testimonial Kenya flag lanyard" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1.5 rounded-full bg-white text-[11px] font-bold uppercase tracking-wide shadow flex items-center gap-1.5"><Stethoscope className="h-3.5 w-3.5" /> Clinic</span>
                    <span className="px-3 py-1.5 rounded-full bg-white text-[11px] font-bold flex items-center gap-1">🇰🇪 Nairobi</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <div className="px-3 py-1.5 rounded-full bg-emerald-500 text-white text-[11px] font-bold">0 missed emergency calls</div>
                    <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-[10px] font-bold">Huduma Bora</div>
                  </div>
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-[12px] font-bold tracking-wide uppercase text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Health • Mara Health Centre</div>
                  <blockquote className="mt-4 text-[20px] leading-[1.35] font-medium tracking-tight serif italic text-slate-900">
                    “Huduma Bora Afya Bora — Good service good health. AiKOVA handles immunization clinic Wednesdays 8am-4pm, malaria prevention queries, in Swahili & English”
                  </blockquote>
                  <div className="mt-6 flex items-center gap-3">
                    <img src={clinicImg} alt="Dr Aisha" className="h-10 w-10 rounded-full object-cover" />
                    <div>
                      <div className="text-[14px] font-bold">Dr. Aisha Njeri — Mara Health Centre Nairobi</div>
                      <div className="text-[12px] text-slate-500">Clinic • Kajiado Road, Nairobi</div>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-[#F8FAFC] border border-slate-100 px-4 py-3">
                      <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Result</div>
                      <div className="mt-1 font-extrabold text-[15px]">0 missed emergency</div>
                    </div>
                    <div className="rounded-2xl px-4 py-3 text-white font-bold text-[13px] flex items-center justify-center" style={{ background: "linear-gradient(135deg,#2962FF,#00E5FF)" }}>Wed 8am-4pm auto</div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* LOGO WALL / INDUSTRIES */}
        <section className="bg-[#F8FAFC] border-y border-slate-100 py-12 lg:py-16">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
            <div className="reveal flex flex-wrap items-center justify-between gap-6 mb-8">
              <div className="text-[13px] font-bold tracking-[0.18em] uppercase text-slate-500">Trusted by industries across Africa</div>
              <div className="text-[13px] text-slate-500">From 1-person hustle to 50-seat clinic</div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { icon: Utensils, name: "Restaurant", count: "640+" },
                { icon: Stethoscope, name: "Clinic", count: "380+" },
                { icon: Scissors, name: "Salon", count: "520+" },
                { icon: ShoppingBag, name: "Retail", count: "310+" },
                { icon: Wrench, name: "Auto", count: "150+" },
                { icon: Briefcase, name: "Pro Services", count: "240+" },
              ].map((it, idx)=>(
                <div key={it.name} className="reveal group bg-white rounded-[20px] border border-slate-200 p-5 flex flex-col gap-3 hover:border-slate-900 transition" style={{ transitionDelay: `${idx*60}ms` }}>
                  <div className="h-10 w-10 rounded-full bg-slate-900 text-white grid place-items-center group-hover:scale-110 transition">
                    <it.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-[15px]">{it.name}</div>
                    <div className="text-[12px] text-slate-500 font-semibold">{it.count} businesses</div>
                  </div>
                  <div className="mt-1 h-1 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${60+idx*6}%`, background: "var(--gradient)" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CASE STUDIES DEEP DIVE */}
        <section className="bg-white py-16 lg:py-24">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
              {/* Before/After */}
              <div className="reveal rounded-[28px] border border-slate-100 bg-white p-8 lg:p-10 shadow-[var(--shadow-card)] overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "var(--gradient)" }} />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold tracking-widest uppercase">Before / After</div>
                    <h3 className="mt-4 text-[28px] leading-[1.05] font-extrabold tracking-tight">From 52% missed to 0 missed</h3>
                    <p className="mt-2 text-[14px] text-slate-600 max-w-[420px]">Invoca benchmark: Small businesses miss 52% of calls. AiKOVA answers in 1.2s, books, and syncs to calendar — Torch constancy.</p>
                  </div>
                  <div className="h-10 w-10 rounded-full grid place-items-center bg-[#F8FAFC] border border-slate-200"><PhoneOff className="h-5 w-5" /></div>
                </div>

                <div className="mt-10 grid grid-cols-2 gap-6">
                  <div className="rounded-[20px] bg-[#F8FAFC] border border-slate-100 p-5">
                    <div className="text-[12px] font-bold uppercase tracking-wide text-slate-500">Before AiKOVA</div>
                    <div className="mt-4">
                      <div className="text-[48px] leading-none font-extrabold text-slate-300">52%</div>
                      <div className="mt-1 text-[13px] font-semibold text-slate-600">calls missed</div>
                      <div className="mt-4 h-2 rounded-full bg-slate-200 overflow-hidden"><div className="h-full bg-slate-400 rounded-full" style={{ width: "52%" }} /></div>
                      <ul className="mt-4 space-y-2 text-[13px] text-slate-600">
                        <li className="flex gap-2"><span className="text-red-400">✕</span> No Yoruba / Swahili</li>
                        <li className="flex gap-2"><span className="text-red-400">✕</span> Voicemail full</li>
                        <li className="flex gap-2"><span className="text-red-400">✕</span> No after-hours</li>
                      </ul>
                    </div>
                  </div>
                  <div className="rounded-[20px] bg-slate-900 text-white p-5 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-40" style={{ background: "var(--gradient)" }} />
                    <div className="relative">
                      <div className="text-[12px] font-bold uppercase tracking-wide text-white/70">After AiKOVA</div>
                      <div className="mt-4">
                        <div className="text-[48px] leading-none font-extrabold">0%</div>
                        <div className="mt-1 text-[13px] font-semibold text-white/80">missed • 24/7 answered</div>
                        <div className="mt-4 h-2 rounded-full bg-white/20 overflow-hidden"><div className="h-full bg-white rounded-full" style={{ width: "100%" }} /></div>
                        <ul className="mt-4 space-y-2 text-[13px] text-white/90">
                          <li className="flex gap-2"><Check className="h-4 w-4 text-[#76FF03]" /> 12+ African languages</li>
                          <li className="flex gap-2"><Check className="h-4 w-4 text-[#76FF03]" /> Books to calendar</li>
                          <li className="flex gap-2"><Check className="h-4 w-4 text-[#76FF03]" /> Torch never sleeps</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-3 text-[12px] font-semibold text-slate-500">
                  <span className="h-6 w-6 rounded-full bg-slate-900 text-white grid place-items-center text-[10px]">i</span>
                  Source: Invoca 2024 Small Business Call Benchmark, AiKOVA 2000+ accounts
                </div>
              </div>

              {/* Social-to-Sale */}
              <div className="reveal delay-1 rounded-[28px] border border-slate-100 bg-white p-8 lg:p-10 shadow-[var(--shadow-card)] relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "var(--gradient)" }} />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 text-[11px] font-bold tracking-widest uppercase"><Instagram className="h-3.5 w-3.5" /> Social-to-Sale</div>
                    <h3 className="mt-4 text-[28px] leading-[1.05] font-extrabold tracking-tight">IG comment → DM → Booking</h3>
                    <p className="mt-2 text-[14px] text-slate-600 max-w-[420px]">Glam Roots turned “how much braids?” comments into 312 new customers in 90 days. No inbox checking.</p>
                  </div>
                  <div className="h-10 w-10 rounded-full grid place-items-center bg-[#F8FAFC] border border-slate-200"><MessageCircle className="h-5 w-5" /></div>
                </div>

                <div className="mt-10 relative">
                  <div className="absolute top-[34px] left-6 right-6 h-[2px] bg-gradient-to-r from-[#00E5FF] via-[#2962FF] to-[#76FF03] opacity-30 hidden lg:block" />
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 relative">
                    {[
                      { step: "01", title: "Comment", desc: "“Price for knotless?” on Reel", icon: Instagram, meta: "Instagram" },
                      { step: "02", title: "Auto-DM", desc: "AiKOVA replies in Pidgin, sends menu + link", icon: MessageCircle, meta: "in 1.2s" },
                      { step: "03", title: "Booked", desc: "Calendar slot secured, M-Pesa deposit", icon: CalendarCheck, meta: "+N12k avg" },
                    ].map(s=>(
                      <div key={s.step} className="rounded-[18px] bg-[#F8FAFC] border border-slate-100 p-5 relative">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-extrabold tracking-widest text-slate-400">{s.step}</span>
                          <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-white border border-slate-200">{s.meta}</span>
                        </div>
                        <div className="mt-3 h-9 w-9 rounded-full bg-white border border-slate-200 grid place-items-center shadow-sm">
                          <s.icon className="h-4 w-4" />
                        </div>
                        <div className="mt-3 font-bold text-[15px]">{s.title}</div>
                        <div className="mt-1 text-[13px] leading-snug text-slate-600">{s.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 rounded-[20px] p-5 text-white flex items-center justify-between gap-4" style={{ background: "var(--gradient)" }}>
                  <div>
                    <div className="text-[12px] font-bold uppercase tracking-wide opacity-80">Result in 90 days</div>
                    <div className="mt-1 text-[22px] font-extrabold leading-none">+312 new customers</div>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur grid place-items-center"><ArrowUpRight className="h-6 w-6" /></div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {["No missed DMs","Yoruba • Pidgin • Twi","M-Pesa checkout","Calendar sync"].map(t=>(
                    <span key={t} className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[11px] font-semibold">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VIDEO TESTIMONIAL PLACEHOLDER */}
        <section className="bg-[#F8FAFC] border-y border-slate-100 py-12 lg:py-16">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
            <div className="reveal rounded-[28px] bg-white border border-slate-100 shadow-[var(--shadow-card)] p-2 lg:p-3">
              <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-3">
                <div className="relative rounded-[20px] overflow-hidden aspect-[16/9] lg:aspect-[16/10] bg-slate-900 group cursor-pointer" onClick={()=>setPlaying(v=>!v)}>
                  <img src={restaurantImg} alt="Adeola video testimonial thumbnail" className="absolute inset-0 h-full w-full object-cover opacity-70 group-hover:scale-[1.02] transition duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                  {!playing ? (
                    <div className="absolute inset-0 grid place-items-center">
                      <div className="h-[88px] w-[88px] rounded-full grid place-items-center shadow-[0_12px_32px_rgba(0,0,0,0.3)] hover:scale-105 transition" style={{ background: "var(--gradient)" }}>
                        <Play className="h-8 w-8 text-white ml-1" fill="white" />
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 grid place-items-center bg-slate-900/80">
                      <div className="text-white text-center px-8">
                        <div className="text-[20px] font-bold">Playing Adeola's story — 45s</div>
                        <div className="mt-2 text-[13px] text-white/70">Video uploads not available yet. This is a placeholder for the real 45s story.</div>
                        <button onClick={()=>setPlaying(false)} className="mt-6 px-5 py-2.5 rounded-full bg-white text-slate-900 font-bold text-[13px]">Close preview</button>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-white grid place-items-center font-bold">A</div>
                      <div className="text-white">
                        <div className="font-bold text-[14px]">Watch Adeola's story • 45s</div>
                        <div className="text-[12px] text-white/70">Eko Bites Lagos • Yoruba & Pidgin</div>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-[11px] font-bold">
                      <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" /> REC • Torch light
                    </div>
                  </div>
                </div>

                <div className="rounded-[20px] bg-[#F8FAFC] border border-slate-100 p-6 lg:p-7 flex flex-col">
                  <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-slate-500"><Sparkles className="h-4 w-4" /> Founder note</div>
                  <blockquote className="mt-4 text-[18px] leading-[1.4] font-medium serif italic">
                    “We built AiKOVA because my auntie in Yaba missed 3 catering orders while in traffic. Now her phone answers in Yoruba. That's Torch — not tech hype.”
                  </blockquote>
                  <div className="mt-6 flex items-center gap-3">
                    <img src={logoImg} alt="founder" className="h-9 w-9 rounded-full object-cover" />
                    <div>
                      <div className="text-[13px] font-bold">Tunde • Founder, AiKOVA</div>
                      <div className="text-[11px] text-slate-500">Lagos • Building for African SMBs</div>
                    </div>
                  </div>
                  <div className="mt-auto pt-8 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white border border-slate-100 p-4">
                      <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Avg setup</div>
                      <div className="mt-1 font-extrabold">7 minutes</div>
                    </div>
                    <div className="rounded-2xl bg-slate-900 text-white p-4">
                      <div className="text-[11px] font-bold uppercase tracking-wide text-white/60">Pay</div>
                      <div className="mt-1 font-extrabold text-[13px]">M-Pesa • Card</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA BANNER GRADIENT */}
        <section id="trial" className="bg-white py-12 lg:py-20">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
            <div className="reveal relative rounded-[32px] overflow-hidden p-1" style={{ background: "var(--gradient)" }}>
              <div className="rounded-[28px] bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-60" style={{ background: "var(--gradient)" }} />
                <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_20%_-10%,rgba(255,255,255,0.22),transparent),radial-gradient(600px_400px_at_80%_110%,rgba(118,255,3,0.25),transparent)]" />
                <div className="relative p-8 lg:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="max-w-[620px]">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/15 text-white text-[11px] font-bold tracking-widest uppercase">
                      <span className="h-2 w-2 rounded-full bg-[#76FF03] animate-pulse" /> Join 2000+ businesses • Torch of God
                    </div>
                    <h3 className="mt-5 text-[32px] lg:text-[44px] leading-[0.95] font-extrabold tracking-tight text-white">
                      Join 2000+ African businesses.
                      <br />
                      <span className="serif font-normal italic text-white/70">Start free trial, pay with M-Pesa</span>
                    </h3>
                    <p className="mt-4 text-[15px] leading-relaxed text-white/70 max-w-[520px]">
                      No credit card. 7-minute setup. Yoruba, Swahili, Twi, Pidgin, English. Cancel anytime. Real human support in Lagos & Nairobi.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {["N578k saved vs Slang","12+ languages","24/7 Torch","M-Pesa + Card"].map(t=>(
                        <span key={t} className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/10 text-white text-[11px] font-semibold">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 min-w-[260px]">
                    <a href="#start" className="h-[56px] inline-flex items-center justify-center gap-2 rounded-full bg-white text-slate-900 font-extrabold text-[15px] hover:scale-[1.02] active:scale-[0.98] transition shadow-[0_12px_24px_rgba(0,0,0,0.25)]">
                      Start Now — Free <ArrowUpRight className="h-4 w-4" />
                    </a>
                    <a href="#founder" className="h-[52px] inline-flex items-center justify-center gap-2 rounded-full bg-transparent border border-white/20 text-white font-bold text-[14px] hover:bg-white/10 transition">
                      Talk to Founder
                    </a>
                    <div className="mt-1 flex items-center justify-center gap-2 text-[11px] text-white/60 font-medium">
                      <Check className="h-3.5 w-3.5" /> 1,200+ 5-star reviews • No spam
                    </div>
                  </div>
                </div>
                {/* decorative torch rays */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-[320px] w-[320px] rounded-full blur-[50px] bg-white/10" />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#F8FAFC] border-t border-slate-200">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-[1.2fr_1fr_1fr_1fr] gap-10">
            <div>
              <div className="flex items-center gap-3">
                <img src={logoImg} alt="AiKOVA logo" className="h-8 w-8 rounded-lg object-cover" />
                <span className="font-extrabold text-[18px]">AiKOVA</span>
              </div>
              <p className="mt-4 text-[14px] leading-relaxed text-slate-600 max-w-[320px]">
                AI Receptionist for African small businesses. Answers in Yoruba, Pidgin, Swahili, Twi, English. Torch of God constancy.
              </p>
              <div className="mt-6 flex gap-2">
                <span className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[11px] font-bold">Lagos</span>
                <span className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[11px] font-bold">Nairobi</span>
                <span className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[11px] font-bold">Accra</span>
              </div>
            </div>
            {[
              { title: "Product", links: ["Features","Solutions","Languages","How It Works","Pricing"] },
              { title: "Proof", links: ["Customers","Case Studies","Wall of Love","Invoca Benchmark"] },
              { title: "Company", links: ["Founder Story","Careers","Contact","M-Pesa Billing"] },
            ].map(col=>(
              <div key={col.title}>
                <div className="text-[12px] font-bold tracking-widest uppercase text-slate-500">{col.title}</div>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map(l=>(
                    <li key={l}><a href={({"Features":"/features","Solutions":"/solutions","Languages":"/languages","How It Works":"/how-it-works","How it Works":"/how-it-works","Pricing":"/pricing","Company":"/company","Customers":"/customers","Resources":"/resources","Demo":"/business","Business":"/business","Product":"/features","Developers":"/resources","About":"/company","About us":"/company","Blog":"/resources","Contact":"/get-started","Careers":"/company","Press":"/company","Founder Story":"/company","API Docs":"/resources","Playbooks":"/resources","Market Insights":"/resources","Compliance":"/resources","Growth Roadmap":"/resources","Case Studies":"/customers","Wall of Love":"/customers","Invoca Benchmark":"/customers","M-Pesa Billing":"/pricing","Salons":"/solutions","Clinics":"/solutions","Real Estate":"/solutions","E-commerce":"/solutions","Privacy":"/get-started","Terms":"/get-started","NDPA":"/get-started"} as Record<string,string>)[l] ?? "#"} className={`text-[14px] ${l==="Customers" ? "font-bold gradient-text" : "text-slate-600 hover:text-slate-900"}`}>{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="text-[12px] text-slate-500">© {new Date().getFullYear()} AiKOVA Technologies Ltd. Torch of God • Built in Lagos, serving Africa. Production-ready Page No.8 of 11.</div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold tracking-widest uppercase text-slate-400">White theme • Infographic flawless beauty</span>
              <div className="h-2 w-2 rounded-full" style={{ background: "var(--gradient)" }} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
