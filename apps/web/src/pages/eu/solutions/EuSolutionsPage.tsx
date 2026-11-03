import { useEffect, useRef, useState } from 'react';
import logoUrl from "./assets/32d4f05ae5209978-image_6A9BA612-7186-480D-9D5C-7EF8BE2260B7.jpeg";
import infographicUrl from "./assets/f1ae727b6089333b-image_20261029_221804.webp";
import compositeUrl from "./assets/aec9f2c71c8b7d4e-image_20261029_221806.webp";
import highStreetUrl from "./assets/6b508a2736534e60-image_20261029_220349.webp";
import euroStreetUrl from "./assets/164011d51a86ede9-image_20261029_213921.webp";
import { startSetupUrl } from '../../../lib/setupFlow';

type Biz = {
  id: string;
  title: string;
  badge: string;
  imageType: 'high' | 'composite';
  slice: number;
  gradient: string;
  icon: string;
  bullets: [string, string];
  flow: string;
  flag: string;
  accent: string;
  stats: string;
};

const businesses: Biz[] = [
  {
    id: 'restaurant',
    title: 'Restaurant',
    badge: '18k+ UK',
    imageType: 'high',
    slice: 0,
    gradient: 'from-[#00E5FF] to-[#2962FF]',
    icon: '🍽️',
    bullets: ['Dining & Hospitality Solutions', 'Supply Chain & Licensing Support'],
    flow: 'Call → Book table in EN/FR/DE',
    flag: '🇬🇧 The Garden Restaurant',
    accent: '#00E5FF',
    stats: '18k+ establishments UK'
  },
  {
    id: 'cafe',
    title: 'Cafe',
    badge: '12k+ cafes',
    imageType: 'high',
    slice: 1,
    gradient: 'from-[#FF8A65] to-[#FF3D00]',
    icon: '☕',
    bullets: ['Cafe & Coffee Shop Services', 'Marketing POS Systems'],
    flow: 'Flat White order 7am → Pickup',
    flag: '🇬🇧 Brew & Bean',
    accent: '#FF8A65',
    stats: 'Avg 4.2s reply'
  },
  {
    id: 'clinic',
    title: 'Clinic',
    badge: 'GP • NHS',
    imageType: 'high',
    slice: 2,
    gradient: 'from-[#00E5FF] to-[#012169]',
    icon: '🏥',
    bullets: ['Healthcare & Clinic Mgmt', 'Compliance & Patient Services'],
    flow: 'Flu Jab NHS queries GDPR triage',
    flag: '🇬🇧 High Street Clinic',
    accent: '#2962FF',
    stats: 'GDPR • CQC ready'
  },
  {
    id: 'salon',
    title: 'Salon',
    badge: 'Beauty UK',
    imageType: 'high',
    slice: 3,
    gradient: 'from-[#FF80AB] to-[#C51162]',
    icon: '💈',
    bullets: ['Beauty & Wellness Booking', 'Client Management CRM'],
    flow: 'Balayage via Instagram DM → Book',
    flag: '🇬🇧 Bloom Salon',
    accent: '#FF80AB',
    stats: 'Instagram → Calendar'
  },
  {
    id: 'retail',
    title: 'Retail',
    badge: 'Omnichannel',
    imageType: 'composite',
    slice: 1,
    gradient: 'from-[#76FF03] to-[#00C853]',
    icon: '🛍️',
    bullets: ['Retail Operations Inventory', 'E-commerce Omnichannel Growth'],
    flow: 'Soy Candle Cotswold Lavender',
    flag: '🇬🇧 The Market Hall',
    accent: '#76FF03',
    stats: 'Open 9-6 Mon-Sat • Local Sustainable'
  },
  {
    id: 'professional',
    title: 'Professional Services',
    badge: 'ACCA • FCA',
    imageType: 'composite',
    slice: 2,
    gradient: 'from-[#012169] to-[#2962FF]',
    icon: '📊',
    bullets: ['Legal Accounting Consulting', 'Business Advisory Strategy'],
    flow: 'Lead qualification → Proposal',
    flag: '🇬🇧 Chartered Advisors',
    accent: '#012169',
    stats: 'ACCA Certified • FCA Registered'
  },
  {
    id: 'auto',
    title: 'Auto Repair',
    badge: 'EST 2018',
    imageType: 'composite',
    slice: 0,
    gradient: 'from-[#37474F] to-[#012169]',
    icon: '🔧',
    bullets: ['Automotive Repair Maintenance', 'Fleet Management Logistics'],
    flow: 'Servicing MOT Tyres EST 2018',
    flag: '🇬🇧 Speedline Autos',
    accent: '#37474F',
    stats: 'Servicing MOT Tyres'
  },
  {
    id: 'pub',
    title: 'Pub & Community',
    badge: 'Faith • Pub',
    imageType: 'composite',
    slice: 3,
    gradient: 'from-[#FFD600] to-[#FF6F00]',
    icon: '⛪',
    bullets: ['Pubs Hospitality Licensing', 'Staffing & Community Org'],
    flow: 'Food Bank Tues 2-4pm Youth Thurs 6pm',
    flag: '🇬🇧 St Luke\'s + Pubs',
    accent: '#FFD600',
    stats: 'Welcome Sun 10:30am'
  },
];

export default function EuSolutionsPage(){
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [assessOpen, setAssessOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(()=>{
    observerRef.current = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          e.target.classList.add('in');
        }
      });
    },{ threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    const els = document.querySelectorAll('.reveal, .slide-left, .slide-right, .card-drop');
    els.forEach(el=> observerRef.current?.observe(el));

    return ()=> observerRef.current?.disconnect();
  },[]);

  return (
    <div
      data-safe-area-inset-root
      className="min-h-screen bg-white text-[#0F172A] overflow-x-clip antialiased"
      style={{ boxSizing: 'border-box', paddingTop: 'var(--safe-area-inset-top)', background: 'var(--white)' }}
    >
      {/* NAV */}
      <header
        data-safe-area-sticky-top
        className="sticky z-40 bg-white/80 glass border-b border-slate-100"
        style={{ top: 'var(--safe-area-inset-top)' }}
      >
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 h-[72px] flex items-center justify-between">
          <a href="/eu" className="flex items-center gap-3">
            <img src={logoUrl} alt="AiKOVA Logo" className="h-9 w-9 rounded-xl object-cover shadow-sm" />
            <span className="font-[700] text-[20px] tracking-[-0.02em]">AiKOVA</span>
            <span className="hidden sm:inline-flex ml-2 px-2.5 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold tracking-widest">EUROZONE</span>
          </a>

          <nav className="hidden lg:flex items-center gap-7 text-[14px] font-[500]">
            <a href="/eu/features" className="hover:text-slate-900 text-slate-500 transition">Features</a>
            <a href="/eu/solutions" className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 text-white font-semibold">
              Solutions <span>🇬🇧</span>
            </a>
            <a href="/eu/languages" className="hover:text-slate-900 text-slate-500 transition">Languages</a>
            <a href="/eu/pricing" className="hover:text-slate-900 text-slate-500 transition">Pricing</a>
            <a href="/eu/demo" className="hover:text-slate-900 text-slate-500 transition">Demo</a>
          </nav>

          <div className="flex items-center gap-2.5">
            <a href={startSetupUrl("eurozone")}
              id="assess-button-main-hero"
              
              className="h-10 px-5 rounded-full bg-slate-900 text-white text-[13px] font-bold tracking-wide hover:bg-black transition shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
            >Start free trial →
            </a>
            <button className="lg:hidden h-10 w-10 rounded-full border border-slate-200 grid place-items-center" onClick={()=>setMobileMenu(v=>!v)}>
              <span className="text-[18px]">{mobileMenu ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
        {mobileMenu && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-5 py-4 flex flex-col gap-3 text-[14px]">
            <a href="/eu/features">Features</a>
            <a href="/eu/solutions" className="font-bold flex gap-2">Solutions 🇬🇧 <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10px]">ACTIVE</span></a>
            <a href="/eu/languages">Languages</a>
            <a href="/eu/pricing">Pricing</a>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-[30%] left-1/2 -translate-x-1/2 w-[1200px] h-[700px] rounded-full blur-[120px] opacity-[0.12]" style={{ background: 'var(--grad)' }} />
        </div>

        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 pt-10 lg:pt-16 pb-10">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-start">
            <div className="reveal">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-white text-[11px] font-bold tracking-widest text-slate-600 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#76FF03] animate-pulse" />
                SOLUTIONS • 8 BUSINESS TYPES • UK FLAG-OFF
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[#012169] text-white">🇬🇧</span>
              </div>

              <h1 className="mt-6 text-[40px] sm:text-[54px] lg:text-[64px] leading-[0.95] font-[800] tracking-[-0.03em]">
                One <span className="relative inline-block">
                  <span className="relative z-10">AiKOVA brain.</span>
                  <span className="absolute bottom-1 left-0 right-0 h-[12px] bg-gradient-to-r from-[#00E5FF]/40 to-[#76FF03]/40 -rotate-1" />
                </span>
                <br />
                Adapts to any
                <br />
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'var(--grad)' }}>British business.</span>
              </h1>

              <p className="mt-6 text-[17px] leading-[1.6] text-slate-600 max-w-[560px]">
                From <span className="font-semibold text-slate-900">The Garden Restaurant London</span> to <span className="font-semibold text-slate-900">Speedline Autos</span> to <span className="font-semibold text-slate-900">St Luke's Community Church</span> — AiKOVA adapts in 10 mins, same as Africa but for Eurozone. Supporting <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white text-[12px] font-bold">27 EU Member States + United Kingdom</span>, Local Expertise Regulatory Compliance.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="flex -space-x-2">
                  {[0,1,2,3].map(i=>(
                    <div key={i} className="h-9 w-9 rounded-full border-2 border-white bg-slate-100 grid place-items-center text-[11px] font-bold overflow-hidden">
                      <img src={i<2? highStreetUrl : compositeUrl} alt="" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="text-[12px] leading-[1.3]">
                  <div className="font-bold">Trusted by UK high streets</div>
                  <div className="text-slate-500">Garden • Brew & Bean • Market Hall • St Luke's</div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3 max-w-[420px]">
                {[
                  { k:'18k+', v:'Restaurants' },
                  { k:'GDPR', v:'Ready' },
                  { k:'EN FR DE', v:'Languages' },
                ].map(s=>(
                  <div key={s.k} className="rounded-2xl bg-[#F8FAFC] border border-slate-100 px-4 py-3">
                    <div className="font-[800] text-[18px]">{s.k}</div>
                    <div className="text-[11px] font-bold tracking-widest text-slate-500">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* INFOGRAPHIC ROADMAP */}
            <div className="reveal lg:sticky lg:top-[96px]">
              <div className="rounded-[28px] bg-white border border-slate-100 shadow-[var(--shadow-soft)] p-3">
                <div className="rounded-[20px] overflow-hidden bg-[#F8FAFC] border border-slate-100 relative">
                  <img src={infographicUrl} alt="European Business Solutions Connecting Businesses Across UK & EU" className="w-full h-auto object-cover" />
                  <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur border border-slate-200 text-[10px] font-bold tracking-widest shadow-sm flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#2962FF]" /> EUROPEAN BUSINESS SOLUTIONS
                  </div>
                  <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-bold tracking-widest">8 CARDS • UK + 27 EU</div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="text-[12px]">
                    <div className="font-bold flex items-center gap-2">Union Jack + EU Flag <span>🇬🇧🇪🇺</span></div>
                    <div className="text-slate-500">Tailored Solutions for Growth & Success</div>
                  </div>
                  <div className="h-10 w-10 rounded-full grid place-items-center text-white" style={{ background: 'var(--grad)' }}>↗</div>
                </div>
              </div>

              <div className="mt-4 rounded-[20px] bg-[#0F172A] text-white p-4 flex items-center gap-3">
                <img src={euroStreetUrl} alt="European businesses street" className="h-14 w-20 rounded-xl object-cover" />
                <div className="text-[12px] leading-[1.3]">
                  <div className="font-bold tracking-wide">EU STREET REFERENCE</div>
                  <div className="text-white/60">RESTAURANT Paris • CAFE Berlin • CLINIC London • SALON GLOW</div>
                </div>
                <div className="ml-auto h-8 w-8 rounded-full bg-white text-slate-900 grid place-items-center text-[14px]">→</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8 SOLUTIONS CARDS */}
      <section id="solutions" className="bg-[#F8FAFC] border-y border-slate-100">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-12 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="slide-left">
              <div className="inline-flex px-3 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-bold tracking-widest">8 BUSINESS CATEGORIES • REAL PHOTOS</div>
              <h2 className="mt-4 text-[36px] lg:text-[48px] leading-[0.95] font-[800]">Images speak more.<br />Business first.</h2>
            </div>
            <p className="slide-right max-w-[420px] text-[14px] text-slate-600 leading-[1.6]">Each card uses a real British high-street photo from The Garden Restaurant to St Luke's. Top border is the AiKOVA gradient, icon circle, flow, UK/EU flag, and hover zoom.</p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {businesses.map((b, idx)=>(
              <div
                key={b.id}
                className="card-drop group bg-white rounded-[22px] border border-slate-100 overflow-hidden shadow-[0_8px_24px_rgba(15,23,42,0.04)] hover:shadow-[var(--shadow-lift)] hover:-translate-y-1 transition-all duration-500 flex flex-col"
                style={{ transitionDelay: `${idx*60}ms` }}
              >
                {/* top gradient border */}
                <div className={`h-1 w-full bg-gradient-to-r ${b.gradient}`} />

                {/* image 240px with crop logic */}
                <div className="relative h-[220px] overflow-hidden bg-slate-50">
                  {b.imageType === 'high' ? (
                    <div className="absolute inset-0">
                      <img
                        src={highStreetUrl}
                        alt={`${b.title} - ${b.flag}`}
                        className="absolute top-0 h-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
                        style={{
                          width: '400%',
                          left: `${-b.slice*100}%`,
                        }}
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0">
                      <img
                        src={compositeUrl}
                        alt={`${b.title} - ${b.flag}`}
                        className="absolute object-cover transition-transform duration-700 group-hover:scale-[1.08]"
                        style={{
                          width: '200%',
                          height: '200%',
                          left: b.slice % 2 === 0 ? '0%' : '-100%',
                          top: b.slice < 2 ? '0%' : '-100%',
                        }}
                      />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />

                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur text-[10px] font-bold tracking-widest border border-white shadow-sm">{b.badge}</span>
                    <span className="h-7 w-7 rounded-full bg-white grid place-items-center text-[14px] shadow-sm">{b.icon}</span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div className="px-2.5 py-1 rounded-full bg-[#0F172A]/85 backdrop-blur text-white text-[11px] font-bold border border-white/10">
                      {b.flag}
                    </div>
                    <div className="h-8 w-8 rounded-full bg-white grid place-items-center shadow">↗</div>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${b.gradient} grid place-items-center text-white text-[16px] shadow-sm`}>{b.icon}</div>
                    <h3 className="text-[19px] font-[800] leading-[1.1]">{b.title}</h3>
                  </div>

                  <div className="mt-4 space-y-2">
                    {b.bullets.map(t=>(
                      <div key={t} className="flex gap-2 text-[12.5px] leading-[1.4] text-slate-600">
                        <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-slate-900 shrink-0" />
                        <span className="font-[500]">{t}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-xl bg-[#F8FAFC] border border-slate-100 px-3 py-2.5">
                    <div className="text-[10px] font-bold tracking-widest text-slate-400">FLOW</div>
                    <div className="mt-1 text-[12px] font-[600] text-slate-800 leading-[1.3]">{b.flow}</div>
                    <div className="mt-2 h-1 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div className={`h-full w-[72%] bg-gradient-to-r ${b.gradient}`} />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[11px] font-bold tracking-widest text-slate-500">{b.stats}</span>
                    <button
                      onClick={()=>setActiveDemo(b.id)}
                      className="h-8 px-3 rounded-full bg-slate-900 text-white text-[11px] font-bold tracking-wide hover:bg-black transition"
                    >
                      See Demo →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[18px] border border-dashed border-slate-300 bg-white p-4 flex flex-wrap gap-3 items-center text-[12px]">
            <span className="px-2.5 py-1 rounded-full bg-[#012169] text-white font-bold">UK BLUE #012169</span>
            <span className="px-2.5 py-1 rounded-full text-white font-bold" style={{ background: 'var(--grad)' }}>GRADIENT #00E5FF → #2962FF → #76FF03</span>
            <span className="text-slate-500">Card dropping + slide-in via IntersectionObserver • Tailwind rounded-2xl • Soft shadows</span>
          </div>
        </div>
      </section>

      {/* REAL PHOTOS SECTION */}
      <section id="features" className="py-14 lg:py-24 bg-white">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 slide-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F172A] text-white text-[11px] font-bold tracking-widest">
                <span className="h-1.5 w-1.5 rounded-full bg-[#76FF03]" /> UK EUROZONE BUSINESS SOLUTIONS
              </div>
              <h2 className="mt-5 text-[32px] lg:text-[44px] leading-[0.95] font-[800]">Modern British Businesses • Trusted • Compliant • Local Support</h2>
              <p className="mt-4 text-[14px] leading-[1.6] text-slate-600">We photographed real high-street businesses. This is not stock. This is Speedline Autos, Market Hall, Chartered Advisors, St Luke's. AiKOVA learns their opening hours, compliance, and tone.</p>

              <div className="mt-8 space-y-4">
                {[
                  { title: 'Auto Repair Garage • Speedline Autos', desc: 'Servicing MOT Tyres EST 2018. Mechanic in blue overalls. AiKOVA handles booking, MOT reminders, fleet logs, UK DVLA compliance.', color: '#37474F' },
                  { title: 'Retail Shop • The Market Hall', desc: 'Local Goods Soy Candle Cotswold Lavender Open 9-6 Mon-Sat. AiKOVA syncs inventory, Instagram comments → WhatsApp → Stripe.', color: '#76FF03' },
                  { title: 'Professional Services • Chartered Advisors', desc: 'Accounting & Consultancy ACCA Certified FCA Registered. TEA mug laptop. AiKOVA qualifies leads, books consultations, GDPR triage.', color: '#012169' },
                  { title: 'Faith Community • St Luke\'s Church', desc: 'Welcome All Sun Service 10:30am Community Food Bank Tues 2-4pm. AiKOVA answers community queries, youth group Thurs 6pm, donation flows.', color: '#FFD600' },
                ].map(item=>(
                  <div key={item.title} className="rounded-2xl border border-slate-100 p-4 flex gap-3 hover:shadow-[var(--shadow-soft)] transition">
                    <div className="h-9 w-1.5 rounded-full" style={{ background: item.color }} />
                    <div>
                      <div className="font-[700] text-[13px]">{item.title}</div>
                      <div className="mt-1 text-[12.5px] leading-[1.5] text-slate-600">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 slide-right">
              <div className="rounded-[28px] bg-white border border-slate-200 shadow-[var(--shadow-soft)] p-3">
                <div className="rounded-[20px] overflow-hidden border border-slate-100 relative">
                  <img src={compositeUrl} alt="UK Eurozone Business Solutions Modern British Businesses Trusted Compliant Local Support - 4 photos" className="w-full h-auto object-cover" />
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[50%] left-0 right-0 h-px bg-white/60" />
                    <div className="absolute left-[50%] top-0 bottom-0 w-px bg-white/60" />
                  </div>
                  <div className="absolute top-3 left-3 right-3 flex justify-between">
                    <span className="px-3 py-1.5 rounded-full bg-white text-[11px] font-bold shadow">4-QUADRANT REAL PHOTOS</span>
                    <span className="px-3 py-1.5 rounded-full bg-[#0F172A] text-white text-[11px] font-bold shadow">UK HIGH STREET VERIFIED</span>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  {[
                    { label: 'AUTO REPAIR GARAGE', sub: 'Speedline Autos • EST 2018' },
                    { label: 'RETAIL SHOP', sub: 'Market Hall • Local Goods' },
                    { label: 'PROFESSIONAL SERVICES', sub: 'Chartered Advisors • ACCA' },
                    { label: 'FAITH COMMUNITY CHURCH', sub: 'St Luke\'s • Welcome All' },
                  ].map(c=>(
                    <div key={c.label} className="rounded-2xl bg-[#F8FAFC] border border-slate-100 px-4 py-3">
                      <div className="text-[10px] font-bold tracking-widest text-slate-500">{c.label}</div>
                      <div className="mt-1 text-[12px] font-semibold">{c.sub}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-2xl bg-slate-900 text-white p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white text-slate-900 grid place-items-center font-bold">UK</div>
                  <div className="text-[12px] leading-[1.3]">
                    <div className="font-bold">How AiKOVA works for each</div>
                    <div className="text-white/60">10-min setup • Voice in local accent • GDPR • HMRC • FCA • DVLA • CQC checks</div>
                  </div>
                  <div className="ml-auto hidden sm:flex gap-1">
                    <span className="px-2 py-1 rounded-full bg-white/10 text-[10px] font-bold">GDPR</span>
                    <span className="px-2 py-1 rounded-full bg-white/10 text-[10px] font-bold">FCA</span>
                    <span className="px-2 py-1 rounded-full bg-white/10 text-[10px] font-bold">CQC</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-[20px] overflow-hidden border border-slate-100 shadow-sm">
                <img src={highStreetUrl} alt="UK High Street The Garden Restaurant Brew & Bean Cafe High Street Clinic Bloom Salon with Union Jack bunting" className="w-full h-[180px] object-cover" />
                <div className="p-3 bg-white flex items-center justify-between text-[11px] font-bold tracking-widest">
                  <span>THE GARDEN RESTAURANT • BREW & BEAN CAFE • HIGH STREET CLINIC • BLOOM SALON</span>
                  <span className="px-2 py-1 rounded-full bg-[#012169] text-white">🇬🇧 BUNTING</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL TO SALE */}
      <section id="languages" className="bg-[#F8FAFC] border-y border-slate-100">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-14 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="reveal">
              <div className="inline-flex px-3 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-bold tracking-widest">SOCIAL-TO-SALE • EUROZONE TAILORED</div>
              <h2 className="mt-4 text-[32px] lg:text-[42px] leading-[0.95] font-[800]">Instagram Comment "How much?" → WhatsApp DM → Booking → Stripe SEPA payment</h2>
              <p className="mt-4 text-[14px] text-slate-600 leading-[1.6]">Same flow as Africa but with SEPA, GDPR, and multilingual. London customer asks in English, Paris in French, Berlin in German — AiKOVA answers same language, GDPR ready, CQC compliant for clinics.</p>

              <div className="mt-8 flex flex-wrap gap-2">
                {['Instagram','WhatsApp','Stripe SEPA','GDPR','EN • FR • DE','NHS Link'].map(t=>(
                  <span key={t} className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[12px] font-semibold">{t}</span>
                ))}
              </div>
            </div>

            <div className="reveal">
              <div className="rounded-[28px] bg-white border border-slate-100 shadow-[var(--shadow-soft)] p-5">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-[13px]">Eurozone Social Flow</div>
                  <span className="px-2 py-1 rounded-full bg-slate-900 text-white text-[10px] font-bold">LIVE</span>
                </div>

                <div className="mt-6 relative">
                  <div className="absolute left-[18px] top-0 bottom-0 w-px bg-gradient-to-b from-[#00E5FF] via-[#2962FF] to-[#76FF03]" />
                  {[
                    { step: '01', icon: '💬', title: 'Instagram Comment', desc: '"How much is balayage?" @ Bloom Salon • Detected EN', time: '0.8s' },
                    { step: '02', icon: '📲', title: 'WhatsApp DM', desc: 'Hi Sarah! Balayage £85-120, 2hrs. Want Tue 3pm? • GDPR consent', time: '2.1s' },
                    { step: '03', icon: '📅', title: 'Booking + Calendar', desc: 'Books via Acuity • Sends NHS-style reminder • CQC log', time: '4.3s' },
                    { step: '04', icon: '💳', title: 'Stripe SEPA Payment', desc: '€ SEPA Direct Debit • VAT MOSS • Receipt FR/DE/EN', time: 'Done' },
                  ].map(f=>(
                    <div key={f.step} className="relative pl-12 pb-7 last:pb-0 group">
                      <div className="absolute left-0 top-0 h-9 w-9 rounded-full bg-white border border-slate-200 grid place-items-center shadow-sm group-hover:scale-110 transition">
                        <span className="text-[14px]">{f.icon}</span>
                      </div>
                      <div className="rounded-2xl bg-[#F8FAFC] border border-slate-100 px-4 py-3 flex justify-between gap-4 hover:bg-white hover:shadow-[var(--shadow-soft)] transition">
                        <div>
                          <div className="text-[11px] font-bold tracking-widest text-slate-400">{f.step} • {f.time}</div>
                          <div className="font-bold text-[13px] mt-1">{f.title}</div>
                          <div className="text-[12px] text-slate-600 mt-1 leading-[1.4]">{f.desc}</div>
                        </div>
                        <div className="h-7 w-7 rounded-full bg-slate-900 text-white grid place-items-center text-[12px]">→</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-xl bg-[#0F172A] text-white px-4 py-3 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-white text-slate-900 grid place-items-center">🇬🇧</div>
                  <div className="text-[12px]">
                    <div className="font-bold">UK Compliance Note</div>
                    <div className="text-white/60">Supporting 27 EU Member States • United Kingdom • FCA • GDPR • DVLA</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER GRADIENT UK */}
      <section className="py-10 lg:py-16">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
          <div className="rounded-[32px] overflow-hidden relative shadow-[0_20px_60px_rgba(1,33,105,0.18)]">
            <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, #012169 0%, #2962FF 45%, #00E5FF 78%, #76FF03 100%)' }} />
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${euroStreetUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', mixBlendMode: 'overlay' }} />
            <div className="relative p-8 lg:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8 text-white">
              <div className="max-w-[620px]">
                <div className="inline-flex px-3 py-1 rounded-full bg-white/15 border border-white/20 text-[11px] font-bold tracking-widest backdrop-blur">🇬🇧 UK FLAG-OFF • GDPR READY</div>
                <h2 className="mt-4 text-[30px] lg:text-[44px] leading-[0.95] font-[800]">Your customers in London, Paris, Berlin? AiKOVA answers same language, GDPR ready</h2>
                <p className="mt-4 text-[14px] leading-[1.6] text-white/80">From Garden Restaurant to Market Hall to Speedline Autos to St Luke's — one brain, 8 business types, 10-min Eurozone adapt. No code. No hassle. UK blue #012169 + AiKOVA gradient.</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 rounded-full bg-white text-slate-900 text-[11px] font-bold">27 EU Member States</span>
                  <span className="px-3 py-1.5 rounded-full bg-white/15 border border-white/20 text-[11px] font-bold">United Kingdom</span>
                  <span className="px-3 py-1.5 rounded-full bg-white/15 border border-white/20 text-[11px] font-bold">Local Expertise</span>
                  <span className="px-3 py-1.5 rounded-full bg-white/15 border border-white/20 text-[11px] font-bold">Regulatory Compliance</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 lg:items-end">
                <a href={startSetupUrl("eurozone")}
                  
                  className="h-12 px-7 rounded-full bg-white text-slate-900 font-bold text-[14px] shadow-[0_8px_24px_rgba(0,0,0,0.18)] hover:bg-[#F8FAFC] transition"
                >Start free trial →
                </a>
                <div className="text-[11px] text-white/70 font-medium">No credit card • 10-min setup • Same as Africa for Eurozone</div>
                <div className="mt-2 flex gap-2">
                  <img src={logoUrl} alt="logo" className="h-8 w-8 rounded-full object-cover border-2 border-white/30" />
                  <div className="h-8 px-3 rounded-full bg-white/15 border border-white/20 grid place-items-center text-[11px] font-bold">AiKOVA • EuroBiz Solutions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0F172A] text-white border-t border-white/5">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-2">
                <img src={logoUrl} alt="AiKOVA" className="h-9 w-9 rounded-xl object-cover" />
                <span className="font-bold text-[18px]">AiKOVA Eurozone</span>
              </div>
              <p className="mt-4 text-[13px] leading-[1.6] text-white/60">One Network • Scalable Solutions • EuroBiz Solutions • Supporting 27 EU Member States United Kingdom Local Expertise Regulatory Compliance.</p>
              <div className="mt-4 flex gap-2">
                <span className="px-2.5 py-1 rounded-full bg-white/10 text-[10px] font-bold">🇬🇧 UK FLAG-OFF</span>
                <span className="px-2.5 py-1 rounded-full bg-white/10 text-[10px] font-bold">🇪🇺 EU 27</span>
              </div>
            </div>
            <div>
              <div className="text-[12px] font-bold tracking-widest text-white/40">SOLUTIONS • 8 TYPES</div>
              <ul className="mt-4 space-y-2 text-[13px] text-white/70">
                <li>Restaurant • Garden Restaurant</li>
                <li>Cafe • Brew & Bean</li>
                <li>Clinic • High Street Clinic</li>
                <li>Salon • Bloom Salon</li>
                <li>Retail • Market Hall</li>
                <li>Professional • Chartered Advisors</li>
                <li>Auto Repair • Speedline Autos</li>
                <li>Pub & Faith • St Luke's + Pubs</li>
              </ul>
            </div>
            <div>
              <div className="text-[12px] font-bold tracking-widest text-white/40">EUROZONE PAGES</div>
              <ul className="mt-4 space-y-2 text-[13px] text-white/70">
                <li>Page 1 • Home UK</li>
                <li>Page 2 • Features GDPR</li>
                <li>Page 3 • Solutions (current) 🇬🇧</li>
                <li>Page 4 • Languages EN FR DE</li>
                <li>Page 5 • Pricing SEPA</li>
              </ul>
            </div>
            <div>
              <div className="text-[12px] font-bold tracking-widest text-white/40">COMPLIANCE</div>
              <div className="mt-4 rounded-2xl bg-white/5 border border-white/10 p-4">
                <div className="text-[11px] font-bold tracking-widest">SUPPORTING</div>
                <div className="mt-2 text-[12px] leading-[1.5] text-white/70">27 EU Member States United Kingdom Local Expertise Regulatory Compliance One Network Scalable Solutions EuroBiz Solutions • GDPR • FCA • CQC • HMRC • DVLA • Licensing • ACCA • FCA Registered • EST 2018 • Open 9-6 Mon-Sat • Community Food Bank Tues 2-4pm Youth Group Thurs 6pm</div>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap justify-between gap-3 text-[11px] text-white/40">
            <span>© AiKOVA Eurozone Marketing Page No.3 • White theme #FFFFFF • Best UI designer magic • Images speak more</span>
            <span>Gradient #00E5FF → #2962FF → #76FF03 • UK Blue #012169 • Alt #F8FAFC • Slate #0F172A</span>
          </div>
        </div>
      </footer>

      {/* DEMO MODAL */}
      {activeDemo && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm p-4 grid place-items-center" onClick={()=>setActiveDemo(null)}>
          <div className="bg-white rounded-[24px] w-full max-w-[520px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.3)]" onClick={e=>e.stopPropagation()}>
            {(() => {
              const b = businesses.find(x=>x.id===activeDemo)!;
              return (
                <>
                  <div className="h-[200px] relative overflow-hidden bg-slate-50">
                    <img src={b.imageType==='high'? highStreetUrl : compositeUrl} alt={b.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end text-white">
                      <div>
                        <div className="text-[11px] font-bold tracking-widest opacity-80">{b.flag} • {b.badge}</div>
                        <div className="text-[24px] font-[800]">{b.title} Demo</div>
                      </div>
                      <button onClick={()=>setActiveDemo(null)} className="h-9 w-9 rounded-full bg-white text-slate-900 grid place-items-center">✕</button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="rounded-2xl bg-[#F8FAFC] border border-slate-100 p-4">
                      <div className="text-[11px] font-bold tracking-widest text-slate-400">AIKOVA FLOW</div>
                      <div className="mt-2 text-[13px] font-semibold leading-[1.5]">{b.flow}</div>
                      <div className="mt-3 flex gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold">EN • FR • DE</span>
                        <span className="px-2.5 py-1 rounded-full bg-white border text-[11px] font-bold">GDPR Ready</span>
                      </div>
                    </div>
                    <ul className="mt-4 space-y-2">
                      {b.bullets.map(x=>(
                        <li key={x} className="flex gap-2 text-[13px]"><span className="text-[#2962FF]">✓</span>{x}</li>
                      ))}
                    </ul>
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <button onClick={()=>setActiveDemo(null)} className="h-11 rounded-full border border-slate-200 font-bold text-[13px]">Close</button>
                      <button onClick={()=>{ setActiveDemo(null); setAssessOpen(true); }} className="h-11 rounded-full bg-slate-900 text-white font-bold text-[13px]">Assess My Business →</button>
                    </div>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}

      {/* ASSESS MODAL */}
      {assessOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md p-4 grid place-items-center">
          <div className="bg-white rounded-[28px] w-full max-w-[560px] p-6 lg:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
            <div className="flex justify-between items-start gap-4">
              <div>
                <div className="inline-flex px-3 py-1 rounded-full bg-[#0F172A] text-white text-[10px] font-bold tracking-widest">ASSESS • UK FLAG-OFF</div>
                <h3 className="mt-3 text-[26px] font-[800] leading-[0.95]">Assess My Business – Eurozone Solutions</h3>
                <p className="mt-2 text-[13px] text-slate-600 leading-[1.5]">From The Garden Restaurant London to Speedline Autos to St Luke's Community Church — AiKOVA adapts in 10 mins. Supporting 27 EU + UK.</p>
              </div>
              <button onClick={()=>setAssessOpen(false)} className="h-9 w-9 rounded-full border border-slate-200 grid place-items-center">✕</button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {businesses.map(b=>(
                <div key={b.id} className="rounded-2xl border border-slate-100 bg-[#F8FAFC] p-3 flex items-center gap-2.5">
                  <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${b.gradient} grid place-items-center text-white text-[14px]`}>{b.icon}</div>
                  <div className="text-[12px] font-bold leading-[1.1]">{b.title}<div className="font-normal text-slate-500">{b.badge}</div></div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl p-4 text-white flex gap-3" style={{ background: 'var(--grad)' }}>
              <div className="h-10 w-10 rounded-full bg-white text-slate-900 grid place-items-center font-bold">✓</div>
              <div className="text-[12px] leading-[1.4]">
                <div className="font-bold">Your assessment is ready for Eurozone</div>
                <div className="text-white/80">One AiKOVA brain • Local expertise • Regulatory compliance • One network • Scalable solutions</div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={()=>setAssessOpen(false)} className="flex-1 h-11 rounded-full bg-slate-900 text-white font-bold text-[13px]">Continue →</button>
              <button onClick={()=>setAssessOpen(false)} className="h-11 px-5 rounded-full border border-slate-200 font-bold text-[13px]">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
