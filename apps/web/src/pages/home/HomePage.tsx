import { useEffect, useRef, useState } from 'react';
import logoUrl from "./assets/32d4f05ae5209978-image_6A9BA612-7186-480D-9D5C-7EF8BE2260B7.jpeg";

const navLinks = [
  { label: 'Features', href: '/features' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Languages', href: '/languages' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Demo', href: '/business' },
];

const roadStops = [
  { id: 1, title: 'Connect', sub: 'Website / GBP / Docs', desc: 'Paste link, upload menu or FAQs. AiKOVA reads everything.', icon: '🔗' },
  { id: 2, title: 'Train', sub: 'Business Agnostic Brain', desc: 'Learns your offers, hours, policies - no code, no prompt engineering.', icon: '🧠' },
  { id: 3, title: 'Local Voice Mesh', sub: '12+ Languages + Accent', desc: 'Speaks Yoruba, Hausa, Swahili, Zulu, Pidgin, French + English dialects.', icon: '🎙️' },
  { id: 4, title: 'Social-to-Sale', sub: 'Comments & DMs → Sales', desc: 'Auto-replies on IG, FB, turns "how much?" into paid bookings.', icon: '💬' },
  { id: 5, title: 'Live', sub: '10 mins, 24/7', desc: 'Go live on voice, WhatsApp, SMS. Never miss a customer again.', icon: '🚀' },
];

const features = [
  { title: 'Omnichannel Inbox', desc: 'One feed for calls, WhatsApp, SMS, IG & FB. AI tags intent instantly.', metric: '3x faster replies', icon: '📥' },
  { title: 'Multilingual Voice Mesh', desc: 'Real African voices. Hyperlocal accent matching for trust.', metric: '12+ languages live', icon: '🌍' },
  { title: 'Social Auto-Reply', desc: 'Detects "price? location? available?" in comments and sends smart DM.', metric: '89% auto-converted', icon: '⚡' },
  { title: 'Booking & CRM', desc: 'Restaurant tables, clinic slots, salon chairs — booked without human.', metric: '70% missed calls saved', icon: '📅' },
  { title: 'Mobile-First, Low-Bandwidth', desc: 'Works on 2G, small APK, USSD fallback. Built for Africa.', metric: '47% data saved', icon: '📱' },
  { title: 'Smart Handoff', desc: 'When human needed, AI summaries + live transcript to your phone.', metric: '12s handoff', icon: '🤝' },
];

const languages = ['Swahili','Hausa','Yoruba','Igbo','Zulu','Pidgin','Amharic','French','Arabic','Twi','Kinyarwanda','Lingala','Shona','Oromo'];

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const heroCardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('in');
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      data-safe-area-inset-root
      className="min-h-screen bg-white text-slate-900 overflow-x-clip antialiased"
      style={{ boxSizing: 'border-box', paddingTop: 'var(--safe-area-inset-top)' } as any}
    >
      {/* NAVIGATION */}
      <header
        data-safe-area-sticky-top
        className="sticky z-[50] top-0 border-b border-slate-100"
        style={{ top: 'var(--safe-area-inset-top)' } as any}
      >
        <div className="glass">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl overflow-hidden ring-1 ring-slate-200 shadow-sm">
                <img src={logoUrl} alt="AiKOVA logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-[Sora] font-extrabold tracking-[-0.02em] text-[22px]">AiKOVA</span>
              <span className="hidden sm:inline-flex ml-2 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest bg-slate-900 text-white">NO1 HERO</span>
            </div>

            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map(l => (
                <a key={l.label} href={l.href} className="text-[13.5px] font-medium text-slate-600 hover:text-slate-900 transition">{l.label}</a>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <a href="#demo" className="text-[13.5px] font-medium px-4 py-2">Sign in</a>
              <a href="#cta" className="px-5 py-2.5 rounded-full text-[13.5px] font-bold text-white shadow-[0_8px_20px_rgba(41,98,255,0.25)]" style={{ background: 'var(--gradient)' }}>
                Start Free Trial
              </a>
            </div>

            <button onClick={() => setMobileOpen(v => !v)} className="lg:hidden w-10 h-10 rounded-full border border-slate-200 grid place-items-center">
              <div className="space-y-1.5">
                <div className="w-4 h-0.5 bg-slate-900 rounded" />
                <div className="w-4 h-0.5 bg-slate-900 rounded" />
                <div className="w-4 h-0.5 bg-slate-900 rounded" />
              </div>
            </button>
          </div>

          {mobileOpen && (
            <div className="lg:hidden border-t border-slate-100 px-4 py-4 space-y-3 bg-white">
              {navLinks.map(l => (
                <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)} className="block py-2 text-[14px] font-medium">{l.label}</a>
              ))}
              <a href="#cta" className="block text-center mt-2 px-5 py-3 rounded-full text-[14px] font-bold text-white" style={{ background: 'var(--gradient)' }}>Start Free Trial</a>
            </div>
          )}
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        {/* background glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-[30%] left-[10%] w-[60%] h-[80%] rounded-full blur-[120px] opacity-[0.15]" style={{ background: 'radial-gradient(circle at center, #00E5FF 0%, #2962FF 40%, transparent 70%)' }} />
          <div className="absolute top-[10%] right-[0%] w-[50%] h-[60%] rounded-full blur-[120px] opacity-[0.12]" style={{ background: 'radial-gradient(circle at center, #76FF03 0%, #00E5FF 60%, transparent 80%)' }} />
        </div>

        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-4 pt-12 sm:pt-16 lg:pt-20 pb-10 lg:pb-16 items-center">

            {/* LEFT */}
            <div className="relative z-10">
              <div className="reveal inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-white shadow-sm">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#76FF03' }} />
                <span className="text-[11px] font-bold tracking-widest text-slate-700 uppercase">Africa&apos;s Plug-and-Play AI Receptionist</span>
                <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-white">NEW</span>
              </div>

              <h1 className="reveal reveal-delay-1 mt-6 font-extrabold leading-[0.9] tracking-[-0.04em] text-[42px] sm:text-[56px] lg:text-[72px]">
                <span className="block">Any Business<span className="gradient-text">.</span></span>
                <span className="block">Any Language<span className="gradient-text">.</span></span>
                <span className="block">Any Channel<span className="gradient-text">.</span></span>
              </h1>

              <p className="reveal reveal-delay-2 mt-6 max-w-[560px] text-[16px] sm:text-[18px] leading-[1.5] text-slate-600">
                Africa is open, uncategorized, social-first. <span className="font-semibold text-slate-900">AiKOVA adapts to any business in 10 mins</span> — voice, SMS, WhatsApp, Instagram, FB. No code. No training.
              </p>

              <div className="reveal reveal-delay-3 mt-8 flex flex-wrap gap-3">
                <a href="#demo" className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-[15px] font-bold text-white shadow-[0_12px_28px_rgba(41,98,255,0.3)] transition hover:translate-y-[-1px]" style={{ background: 'var(--gradient)' }}>
                  Try Live Demo
                  <span className="transition group-hover:translate-x-0.5">→</span>
                </a>
                <a href="#road" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-[15px] font-semibold border border-slate-200 bg-white hover:bg-slate-50 transition">
                  <span className="w-8 h-8 rounded-full grid place-items-center bg-slate-900 text-white text-[12px]">▶</span>
                  Watch 45s Overview
                </a>
              </div>

              <div className="reveal reveal-delay-4 mt-8 flex flex-wrap items-center gap-3 text-[12px] font-medium text-slate-500">
                <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200">Works with</span>
                <span className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700">Africa&apos;s Talking</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span className="font-semibold text-slate-700">Flutterwave</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span className="font-semibold text-slate-700">M-Pesa</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span className="font-semibold text-slate-700">WhatsApp</span>
                </span>
              </div>

              {/* mini social proof */}
              <div className="reveal reveal-delay-5 mt-10 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 grid place-items-center text-[11px] font-bold" style={{ background: i===0?'#E0F7FF': i===1?'#E8F0FF':'#F1FFD6' }}>{['R','S','M'][i]}</div>
                  ))}
                </div>
                <div className="text-[12px] leading-[1.3]">
                  <div className="font-semibold text-slate-900">Loved by 200+ African businesses</div>
                  <div className="text-slate-500">Restaurants, clinics, salons & more</div>
                </div>
              </div>
            </div>

            {/* RIGHT - PHONE MOCKUP */}
            <div className="relative lg:h-[620px] flex justify-center lg:justify-end">
              {/* glow behind phone */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full blur-[80px] opacity-20" style={{ background: 'var(--gradient)' }} />

              <div className="relative w-[320px] sm:w-[360px]">
                {/* phone frame */}
                <div className="relative mx-auto w-[300px] h-[600px] rounded-[44px] bg-slate-900 p-[10px] shadow-[0_30px_80px_rgba(15,23,42,0.25)]">
                  <div className="w-full h-full rounded-[34px] bg-[#F8FAFC] overflow-hidden flex flex-col">
                    {/* phone header */}
                    <div className="h-[86px] px-5 pt-6 pb-3 bg-white border-b border-slate-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full overflow-hidden"><img src={logoUrl} alt="" className="w-full h-full object-cover" /></div>
                          <div>
                            <div className="text-[13px] font-bold leading-none">AiKOVA Inbox</div>
                            <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Live • 3 channels</div>
                          </div>
                        </div>
                        <div className="w-7 h-7 rounded-full bg-slate-100 grid place-items-center text-[12px]">⋯</div>
                      </div>
                    </div>

                    {/* dropping cards container */}
                    <div ref={heroCardsRef} className="flex-1 relative p-3 space-y-3 bg-[radial-gradient(circle_at_20%_20%,rgba(0,229,255,0.08),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(118,255,3,0.08),transparent_50%)]">
                      {/* card 1 */}
                      <div className="rounded-2xl bg-white border border-slate-200 shadow-[0_8px_24px_rgba(0,0,0,0.06)] p-3" style={{ animation: 'dropIn 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s both' }}>
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#E0F7FF] grid place-items-center text-[14px]">📞</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">Missed Call</span>
                              <span className="text-[10px] text-slate-400">+234 80…</span>
                            </div>
                            <div className="mt-1 text-[12.5px] font-medium leading-[1.3]">AI answered in Yoruba</div>
                            <div className="mt-1 text-[11px] text-slate-500 leading-[1.3]">"Bawo ni, ṣe le ran ọ lọwọ? Table for 2 booked."</div>
                            <div className="mt-2 flex gap-1.5">
                              <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">✓ Resolved</span>
                              <span className="text-[10px] px-2 py-1 rounded-full bg-slate-50 text-slate-600 border">Yorùbá</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* card 2 */}
                      <div className="rounded-2xl bg-white border border-slate-200 shadow-[0_8px_24px_rgba(0,0,0,0.06)] p-3" style={{ animation: 'dropIn 0.6s cubic-bezier(0.16,1,0.3,1) 0.6s both' }}>
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6EC7] to-[#FF3E7A] grid place-items-center text-white text-[14px]">IG</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-pink-50 text-pink-600 border border-pink-100">IG Comment</span>
                              <span className="text-[10px] text-slate-400">2m ago</span>
                            </div>
                            <div className="mt-1 text-[12.5px] font-medium leading-[1.3]">"how much for braids?"</div>
                            <div className="mt-2 rounded-xl bg-[#F8FAFC] border border-slate-100 p-2 text-[11px]">
                              <div className="text-slate-500">Auto DM sent:</div>
                              <div className="font-medium text-slate-800">Hi! Box braids 15k, 3hrs. Book? 💅</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* card 3 */}
                      <div className="rounded-2xl bg-white border border-slate-200 shadow-[0_8px_24px_rgba(0,0,0,0.06)] p-3" style={{ animation: 'dropIn 0.6s cubic-bezier(0.16,1,0.3,1) 1s both' }}>
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#E8FFD6] grid place-items-center text-[14px]">📅</div>
                          <div className="flex-1">
                            <div className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 w-fit">Booking Confirmed</div>
                            <div className="mt-1 text-[12.5px] font-semibold">Table for 2 — 7pm Today</div>
                            <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                              <span>Flutterwave • M-Pesa</span>
                              <span className="px-1.5 py-0.5 rounded bg-slate-900 text-white text-[9px]">PAID</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* typing indicator */}
                      <div className="flex items-center gap-2 px-1 pt-1">
                        <div className="w-6 h-6 rounded-full bg-white border border-slate-200 grid place-items-center text-[10px]">AI</div>
                        <div className="px-3 py-2 rounded-full bg-white border border-slate-200 text-[11px] text-slate-500 flex gap-1">
                          <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce" />
                          <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce [animation-delay:120ms]" />
                          <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce [animation-delay:240ms]" />
                        </div>
                      </div>
                    </div>

                    {/* input */}
                    <div className="h-[54px] bg-white border-t border-slate-100 px-3 flex items-center gap-2">
                      <div className="flex-1 h-9 rounded-full bg-slate-50 border border-slate-200 px-4 flex items-center text-[12px] text-slate-400">AiKOVA is replying…</div>
                      <div className="w-9 h-9 rounded-full grid place-items-center text-white" style={{ background: 'var(--gradient)' }}>↗</div>
                    </div>
                  </div>

                  {/* notch */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 rounded-full bg-slate-900" />
                </div>

                {/* floating badges */}
                <div className="absolute -left-4 top-[18%] hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-slate-200 shadow-[0_12px_30px_rgba(0,0,0,0.08)] text-[11px] font-semibold" style={{ animation: 'floatY 4s ease-in-out infinite' }}>
                  <span className="w-6 h-6 rounded-full bg-emerald-50 grid place-items-center">🌍</span> 12+ Languages
                </div>
                <div className="absolute -right-2 top-[46%] hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-slate-200 shadow-[0_12px_30px_rgba(0,0,0,0.08)] text-[11px] font-semibold" style={{ animation: 'floatY 4.6s ease-in-out infinite 0.6s' }}>
                  <span className="w-6 h-6 rounded-full bg-blue-50 grid place-items-center">⚡</span> 0.8s avg reply
                </div>
                <div className="absolute -left-2 bottom-[12%] hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-slate-200 shadow-[0_12px_30px_rgba(0,0,0,0.08)] text-[11px] font-semibold" style={{ animation: 'floatY 5s ease-in-out infinite 0.3s' }}>
                  <span className="w-6 h-6 rounded-full bg-amber-50 grid place-items-center">💰</span> M-Pesa auto-collect
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INFOGRAPHIC ROAD BANNER - THE MAIN REQUEST */}
      <section id="road" className="relative bg-[#F8FAFC] border-y border-slate-100 overflow-hidden">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div className="reveal">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-bold tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2962FF]" /> Roadagel-Style Journey
              </div>
              <h2 className="mt-4 text-[30px] sm:text-[40px] font-extrabold leading-[0.95] tracking-[-0.03em] max-w-[560px]">Your business road to <span className="gradient-text">24/7 sales</span>, paved in 10 mins.</h2>
            </div>
            <div className="reveal reveal-delay-1 max-w-[360px] text-[14px] leading-[1.5] text-slate-600">
              Inspired by infographic road banners — a single winding path that turns scattered tools into one autonomous receptionist.
            </div>
          </div>

          {/* DESKTOP ROAD */}
          <div className="hidden lg:block relative mt-8">
            {/* road svg */}
            <svg viewBox="0 0 1200 220" className="w-full h-[220px] overflow-visible">
              <defs>
                <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00E5FF" />
                  <stop offset="55%" stopColor="#2962FF" />
                  <stop offset="100%" stopColor="#76FF03" />
                </linearGradient>
                <linearGradient id="roadGradSoft" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(0,229,255,0.18)" />
                  <stop offset="55%" stopColor="rgba(41,98,255,0.18)" />
                  <stop offset="100%" stopColor="rgba(118,255,3,0.18)" />
                </linearGradient>
              </defs>

              {/* soft shadow road */}
              <path d="M 40 110 Q 200 40, 360 110 T 680 110 T 980 110 T 1160 80" fill="none" stroke="url(#roadGradSoft)" strokeWidth="28" strokeLinecap="round" opacity="0.9" />
              {/* main road */}
              <path d="M 40 110 Q 200 40, 360 110 T 680 110 T 980 110 T 1160 80" fill="none" stroke="url(#roadGrad)" strokeWidth="8" strokeLinecap="round" strokeDasharray="1400" strokeDashoffset="0" style={{ animation: 'roadDraw 2.2s cubic-bezier(0.16,1,0.3,1) both' }} />
              {/* dashed center */}
              <path d="M 40 110 Q 200 40, 360 110 T 680 110 T 980 110 T 1160 80" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeDasharray="12 18" opacity="0.9" />

              {/* car/bus moving */}
              <g>
                <circle r="8" fill="white" stroke="#0F172A" strokeWidth="2">
                  <animateMotion dur="12s" repeatCount="indefinite" rotate="auto" path="M 40 110 Q 200 40, 360 110 T 680 110 T 980 110 T 1160 80" />
                </circle>
                <g>
                  <rect x="-10" y="-5" width="20" height="10" rx="3" fill="#0F172A" />
                  <animateMotion dur="12s" repeatCount="indefinite" rotate="auto" path="M 40 110 Q 200 40, 360 110 T 680 110 T 980 110 T 1160 80" />
                </g>
              </g>
            </svg>

            {/* stops positioned over svg */}
            <div className="absolute inset-0">
              {roadStops.map((stop, i) => {
                const lefts = ['3%','26%','50%','74%','92%'];
                const tops = ['22%','8%','32%','18%','6%'];
                return (
                  <div key={stop.id} className="absolute" style={{ left: lefts[i], top: tops[i] }}>
                    {/* node */}
                    <div className="relative">
                      <div className="w-[56px] h-[56px] rounded-full bg-white border-[3px] border-slate-900 shadow-[0_8px_20px_rgba(0,0,0,0.12)] grid place-items-center text-[22px] z-10 relative" style={{ animation: 'pulseGlow 2.8s ease-in-out infinite', animationDelay: `${i*0.4}s` }}>
                        {stop.icon}
                        <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-slate-900 text-white text-[11px] font-bold grid place-items-center">{stop.id}</span>
                      </div>

                      {/* card above */}
                      <div className="reveal absolute bottom-[72px] left-1/2 -translate-x-1/2 w-[220px]" style={{ transitionDelay: `${i*120}ms` }}>
                        <div className="rounded-[18px] bg-white border border-slate-200 shadow-[0_16px_40px_rgba(15,23,42,0.12)] overflow-hidden">
                          <div className="h-1 w-full" style={{ background: 'var(--gradient)' }} />
                          <div className="p-4">
                            <div className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">{stop.title}</div>
                            <div className="mt-1 text-[13px] font-bold leading-[1.2]">{stop.sub}</div>
                            <div className="mt-2 text-[11.5px] leading-[1.4] text-slate-600">{stop.desc}</div>
                          </div>
                        </div>
                        <div className="mx-auto w-3 h-3 bg-white border-r border-b border-slate-200 rotate-45 -mt-1.5 shadow-sm" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MOBILE VERTICAL ROAD */}
          <div className="lg:hidden relative">
            <div className="relative pl-10">
              {/* vertical line */}
              <div className="absolute left-[18px] top-0 bottom-0 w-2 rounded-full" style={{ background: 'var(--gradient)' }} />
              <div className="absolute left-[22px] top-0 bottom-0 w-[2px] bg-white/80" style={{ backgroundImage: 'linear-gradient(to bottom, white 12px, transparent 12px)', backgroundSize: '100% 24px' }} />

              <div className="space-y-8">
                {roadStops.map(stop => (
                  <div key={stop.id} className="reveal flex gap-4">
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-full bg-white border-2 border-slate-900 grid place-items-center text-[18px] shadow-md z-10 relative">{stop.icon}</div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold grid place-items-center">{stop.id}</div>
                    </div>
                    <div className="flex-1 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
                      <div className="h-1 w-full" style={{ background: 'var(--gradient)' }} />
                      <div className="p-4">
                        <div className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">{stop.title}</div>
                        <div className="mt-1 font-bold text-[14px]">{stop.sub}</div>
                        <div className="mt-1 text-[12px] text-slate-600">{stop.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* African business types icons row */}
          <div className="reveal mt-12 flex flex-wrap items-center gap-2 sm:gap-3 justify-center lg:justify-start">
            <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mr-2">Built for:</span>
            {[
              { k: 'Restaurant', e: '🍛' },
              { k: 'Clinic', e: '🩺' },
              { k: 'Salon', e: '💈' },
              { k: 'Shop', e: '🛍️' },
              { k: 'Lodge', e: '🏨' },
              { k: 'Gym', e: '🏋️' },
              { k: 'Garage', e: '🔧' },
              { k: 'School', e: '🎓' },
            ].map(b => (
              <span key={b.k} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[12px] font-medium shadow-sm">
                <span>{b.e}</span> {b.k}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES - Card Dropping */}
      <section id="features" className="bg-white">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-[720px] mx-auto text-center">
            <div className="reveal inline-flex px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-bold tracking-widest uppercase">Plug & Play Cards</div>
            <h2 className="reveal reveal-delay-1 mt-4 text-[32px] sm:text-[48px] font-extrabold leading-[0.95] tracking-[-0.03em]">Built to adopt <span className="gradient-text">any business</span>. Drop in, go live.</h2>
            <p className="reveal reveal-delay-2 mt-4 text-[15px] sm:text-[16px] text-slate-600 leading-[1.6]">Six modular capabilities that fall into place like the dropping inbox above. Each card slides from top with staggered timing — zero config, all AI.</p>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="reveal group relative rounded-[20px] bg-white border border-slate-200 p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-all duration-300"
                style={{ transitionDelay: `${i*80}ms` }}
              >
                <div className="absolute top-0 left-6 right-6 h-1 rounded-full opacity-90" style={{ background: 'var(--gradient)' }} />
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-[14px] grid place-items-center text-[20px] border border-slate-100 shadow-sm" style={{ background: 'var(--gradient-soft)' }}>{f.icon}</div>
                  <span className="px-2.5 py-1 rounded-full bg-slate-900 text-white text-[10px] font-bold tracking-wide">{f.metric}</span>
                </div>
                <h3 className="mt-5 font-bold text-[17px] leading-[1.2]">{f.title}</h3>
                <p className="mt-2 text-[13.5px] leading-[1.5] text-slate-600">{f.desc}</p>
                <div className="mt-4 flex items-center gap-2 text-[12px] font-semibold text-slate-900">
                  <span>Learn more</span><span className="transition group-hover:translate-x-0.5">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL-TO-SALE FLOW */}
      <section id="social" className="bg-[#F8FAFC] border-y border-slate-100 overflow-hidden">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-[0.95fr_1.05fr] gap-10 lg:gap-16 items-center">
          {/* left visual */}
          <div className="reveal relative order-2 lg:order-1">
            <div className="rounded-[28px] bg-white border border-slate-200 p-6 sm:p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between mb-6">
                <div className="text-[12px] font-bold tracking-widest uppercase text-slate-400">Social → Sale Flow</div>
                <div className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[11px] font-bold">Auto Pilot</div>
              </div>

              <div className="relative space-y-4">
                <div className="absolute left-[22px] top-8 bottom-8 w-0.5 bg-slate-100" />
                {[
                  { step: 'IG Comment', detail: '"how much braids?" — @amaka_23', color: '#FFE4F0', icon: '💬' },
                  { step: 'AI Detects Intent', detail: 'Price inquiry • Pidgin detected', color: '#E0F7FF', icon: '🧠' },
                  { step: 'Auto DM Sent', detail: 'Hi! Box braids 15k, 3hrs. Book link ↓', color: '#E8FFD6', icon: '✉️' },
                  { step: 'Booking Link', detail: 'Cal slot — Thu 2pm — prefilled', color: '#FFF4D6', icon: '📅' },
                  { step: 'MoMo Payment', detail: 'Flutterwave — Paid 15k — Receipt sent', color: '#E8E0FF', icon: '💸' },
                ].map((s, idx) => (
                  <div key={s.step} className="reveal relative flex gap-4" style={{ transitionDelay: `${idx*90}ms` }}>
                    <div className="w-11 h-11 rounded-full bg-white border border-slate-200 shadow-sm grid place-items-center text-[16px] shrink-0 relative z-10">{s.icon}</div>
                    <div className="flex-1 rounded-2xl border border-slate-200 p-4 bg-white">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-[13px]">{s.step}</div>
                        <div className="w-2 h-2 rounded-full" style={{ background: idx%2===0 ? '#00E5FF' : '#76FF03' }} />
                      </div>
                      <div className="mt-1 text-[12px] text-slate-600">{s.detail}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl bg-slate-900 text-white p-4 flex items-center justify-between">
                <div>
                  <div className="text-[12px] font-bold">Revenue captured today</div>
                  <div className="text-[20px] font-extrabold">₦127,500 <span className="text-[12px] font-medium text-slate-400">from IG alone</span></div>
                </div>
                <div className="px-3 py-1.5 rounded-full text-[11px] font-bold bg-white text-slate-900">+23%</div>
              </div>
            </div>

            {/* floating */}
            <div className="absolute -right-3 top-[10%] hidden sm:block px-3 py-2 rounded-full bg-white border border-slate-200 shadow-lg text-[11px] font-bold" style={{ animation: 'floatY 4.5s ease-in-out infinite' }}>IG • FB • TikTok</div>
          </div>

          {/* right text */}
          <div className="order-1 lg:order-2">
            <div className="reveal inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-bold tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#FF3E7A]" /> Africa is Social Big
            </div>
            <h2 className="reveal reveal-delay-1 mt-5 text-[32px] sm:text-[48px] font-extrabold leading-[0.9] tracking-[-0.03em]">
              We turn <span className="gradient-text">comments & DMs</span> into sales while you sleep.
            </h2>
            <p className="reveal reveal-delay-2 mt-5 text-[16px] leading-[1.6] text-slate-600 max-w-[520px]">
              African customers don&apos;t email — they comment, voice-note, and DM. AiKOVA watches every comment, classifies intent in 0.8s, and replies in the same language + slang. Booking links + MoMo checkout embedded.
            </p>

            <div className="reveal reveal-delay-3 mt-8 grid grid-cols-2 gap-4 max-w-[520px]">
              <div className="rounded-2xl bg-white border border-slate-200 p-4">
                <div className="text-[24px] font-extrabold">89%</div>
                <div className="text-[12px] text-slate-600 leading-[1.3] mt-1">of "how much?" comments converted without human</div>
              </div>
              <div className="rounded-2xl bg-white border border-slate-200 p-4">
                <div className="text-[24px] font-extrabold">3.2x</div>
                <div className="text-[12px] text-slate-600 leading-[1.3] mt-1">more bookings from IG vs website alone</div>
              </div>
            </div>

            <div className="reveal reveal-delay-4 mt-8 flex gap-3">
              <a href="#demo" className="px-5 py-3 rounded-full text-[14px] font-bold text-white" style={{ background: 'var(--gradient)' }}>See Social Demo →</a>
              <a href="#road" className="px-5 py-3 rounded-full text-[14px] font-semibold border border-slate-200 bg-white">How it detects slang</a>
            </div>
          </div>
        </div>
      </section>

      {/* LANGUAGE SHOWCASE */}
      <section id="languages" className="relative overflow-hidden bg-white">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="reveal inline-flex px-3 py-1 rounded-full bg-[#F8FAFC] border border-slate-200 text-[11px] font-bold tracking-widest uppercase">Language Mesh</div>
              <h2 className="reveal reveal-delay-1 mt-4 text-[32px] sm:text-[44px] font-extrabold leading-[0.95] tracking-[-0.03em]">One brain. <span className="gradient-text">14 voices</span>. Hyperlocal accent.</h2>
              <p className="reveal reveal-delay-2 mt-4 text-[15px] leading-[1.6] text-slate-600 max-w-[520px]">
                Not just translation — AiKOVA speaks like your customer&apos;s neighbor. Yoruba in Ibadan street tone, Swahili with coastal swing, Pidgin that understands "how for do?".
              </p>

              <div className="reveal reveal-delay-3 mt-8 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 flex items-center gap-3 max-w-[460px]">
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 grid place-items-center">🎧</div>
                <div className="flex-1">
                  <div className="text-[12px] font-bold">Listen: Same sentence, 3 accents</div>
                  <div className="mt-2 h-2 rounded-full bg-slate-200 overflow-hidden flex">
                    <div className="h-full w-[30%] bg-[#00E5FF]" /><div className="h-full w-[40%] bg-[#2962FF]" /><div className="h-full w-[30%] bg-[#76FF03]" />
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full bg-slate-900 text-white grid place-items-center text-[12px]">▶</button>
              </div>
            </div>

            {/* floating badges map */}
            <div className="reveal relative h-[380px] sm:h-[440px] rounded-[28px] border border-slate-200 bg-[#F8FAFC] overflow-hidden">
              {/* faint africa map silhouette via gradients */}
              <div className="absolute inset-0 opacity-[0.06]" style={{ background: 'radial-gradient(circle at 55% 45%, #0F172A 20%, transparent 60%)' }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[420px] rounded-[120px] bg-slate-900/5 blur-[1px]" style={{ clipPath: 'ellipse(42% 48% at 50% 50%)' }} />

              {/* badges */}
              {languages.map((lang, i) => {
                const positions = [
                  { l: '18%', t: '12%' }, { l: '58%', t: '8%' }, { l: '32%', t: '22%' }, { l: '68%', t: '20%' },
                  { l: '12%', t: '38%' }, { l: '48%', t: '36%' }, { l: '72%', t: '38%' }, { l: '22%', t: '54%' },
                  { l: '56%', t: '52%' }, { l: '38%', t: '68%' }, { l: '66%', t: '66%' }, { l: '16%', t: '78%' },
                  { l: '46%', t: '82%' }, { l: '74%', t: '84%' },
                ];
                const pos = positions[i % positions.length];
                const colors = ['#E0F7FF','#E8F0FF','#F1FFD6','#FFE4F0','#FFF4D6'];
                return (
                  <div
                    key={lang}
                    className="absolute px-3 py-1.5 rounded-full border border-slate-200 bg-white shadow-[0_8px_20px_rgba(0,0,0,0.06)] text-[12px] font-semibold"
                    style={{ left: pos.l, top: pos.t, background: colors[i % colors.length], animation: `floatY ${4 + (i%3)}s ease-in-out infinite ${i*0.2}s` }}
                  >
                    {lang}
                  </div>
                );
              })}

              <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white border border-slate-200 p-4 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full grid place-items-center text-white" style={{ background: 'var(--gradient)' }}>AI</div>
                  <div>
                    <div className="text-[12px] font-bold">Auto-detect language</div>
                    <div className="text-[11px] text-slate-500">Pidgin → English → Yoruba in one chat</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[11px] font-bold">Live</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section id="cta" className="relative overflow-hidden">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="relative rounded-[28px] overflow-hidden p-[1px]" style={{ background: 'var(--gradient)' }}>
            <div className="rounded-[27px] relative overflow-hidden" style={{ background: 'var(--gradient)' }}>
              {/* pattern */}
              <div className="absolute inset-0 opacity-[0.18]" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
              <div className="relative px-6 sm:px-10 lg:px-14 py-12 lg:py-16 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                <div className="max-w-[560px]">
                  <h2 className="text-[28px] sm:text-[40px] font-extrabold leading-[0.95] tracking-[-0.03em] text-white">Ready to never miss a customer again?</h2>
                  <p className="mt-3 text-[14px] sm:text-[15px] leading-[1.5] text-white/80 max-w-[480px]">Plug in your website, Google Business, or menu. Go live in 10 mins. Free 14-day trial, no card.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a href="#demo" className="px-6 py-3.5 rounded-full bg-white text-slate-900 text-[14px] font-bold shadow-[0_10px_24px_rgba(0,0,0,0.15)] hover:translate-y-[-1px] transition">Start Free Trial →</a>
                  <a href="#road" className="px-6 py-3.5 rounded-full bg-slate-900/20 backdrop-blur border border-white/20 text-white text-[14px] font-semibold hover:bg-slate-900/30 transition">Talk to Founder</a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-between gap-3 text-[12px] text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 grid place-items-center text-[10px]">✓</span> No credit card • Cancel anytime
              <span className="w-1 h-1 rounded-full bg-slate-300" /> GDPR • NDPA compliant
            </div>
            <div className="flex items-center gap-2">
              <span>Built in Lagos & Nairobi</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold">SOC 2 soon</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-[1.2fr_2.8fr] gap-10">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl overflow-hidden ring-1 ring-slate-200"><img src={logoUrl} alt="AiKOVA" className="w-full h-full object-cover" /></div>
                <span className="font-[Sora] font-extrabold text-[20px]">AiKOVA</span>
              </div>
              <p className="mt-4 text-[13px] leading-[1.5] text-slate-600 max-w-[300px]">Africa&apos;s plug-and-play AI receptionist. Any business. Any language. Any channel. Page 1 of 11 — Hero Home.</p>
              <div className="mt-6 flex gap-2">
                {['IG','X','LI'].map(s => (
                  <div key={s} className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 grid place-items-center text-[11px] font-bold">{s}</div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              {[
                { title: 'Pages (11)', links: ['01 Hero Home (current)','02 Features Deep','03 Solutions','04 Voice Demo','05 Social Flow','06 Pricing','07 Languages','08 Security','09 Integrations','10 Case Studies','11 Contact'] },
                { title: 'Product', links: ['Omnichannel Inbox','Voice Mesh','Social Auto-Reply','Booking & CRM','API Docs'] },
                { title: 'Solutions', links: ['Restaurants','Clinics','Salons & Spas','Retail','Hotels','Schools'] },
                { title: 'Company', links: ['Manifesto','Careers','Contact','Privacy','Terms'] },
              ].map(col => (
                <div key={col.title}>
                  <div className="text-[11px] font-bold tracking-widest uppercase text-slate-400">{col.title}</div>
                  <div className="mt-4 space-y-2.5">
                    {col.links.map(l => (
                      <a key={l} href={({"Features":"/features","Solutions":"/solutions","Languages":"/languages","How It Works":"/how-it-works","How it Works":"/how-it-works","Pricing":"/pricing","Company":"/company","Customers":"/customers","Resources":"/resources","Demo":"/business","Business":"/business","Product":"/features","Developers":"/resources","About":"/company","About us":"/company","Blog":"/resources","Contact":"/get-started","Careers":"/company","Press":"/company","Founder Story":"/company","API Docs":"/resources","Playbooks":"/resources","Market Insights":"/resources","Compliance":"/resources","Growth Roadmap":"/resources","Case Studies":"/customers","Wall of Love":"/customers","Invoca Benchmark":"/customers","M-Pesa Billing":"/pricing","Salons":"/solutions","Clinics":"/solutions","Real Estate":"/solutions","E-commerce":"/solutions","Privacy":"/get-started","Terms":"/get-started","NDPA":"/get-started"} as Record<string,string>)[l] ?? "#"} className="block text-[13px] text-slate-600 hover:text-slate-900 transition">{l}</a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-[12px] text-slate-500">
            <div>© {new Date().getFullYear()} AiKOVA Labs. Made for African businesses.</div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8FAFC] border border-slate-200"><span className="w-2 h-2 rounded-full bg-[#76FF03] animate-pulse" /> All systems operational</span>
              <span>White theme • Production ready</span>
            </div>
          </div>
        </div>
      </footer>

      {/* minimal toast for demo links */}
      <div id="demo" className="sr-only">demo anchor</div>
      <div id="pricing" className="sr-only">pricing anchor</div>
    </div>
  );
}
