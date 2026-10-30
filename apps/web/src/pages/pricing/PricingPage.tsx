import React, { useEffect, useRef, useState } from 'react';
import logoUrl from './assets/32d4f05ae5209978-image_6A9BA612-7186-480D-9D5C-7EF8BE2260B7.jpeg';
import savingsWomanUrl from './assets/d856cb1172e957e9-image_20261029_181807.webp';
import pricingInfographicUrl from './assets/0f83d47c38f52bd4-image_20261029_181810.webp';
import teamCelebrationUrl from './assets/4e8a18e31ecbb13a-image_20261029_181811.webp';
import comparisonUrl from './assets/97a7fad49cdb8340-image_20261029_181813.webp';

const shellStyle: React.CSSProperties = {
  boxSizing: 'border-box',
  paddingTop: 'var(--safe-area-inset-top)',
  background: 'var(--bg)',
};

type FAQ = { q: string; a: string };

const faqs: FAQ[] = [
  { q: "What counts as a conversation?", a: "One conversation = one customer call or chat handled end-to-end by AiKOVA, regardless of duration. No hidden per-minute fees. Up to 5 minutes included, then fair-use at $0.02/min." },
  { q: "Can I pay with M-Pesa, Flutterwave or Paystack?", a: "Yes. We support M-Pesa (KES), Flutterwave (NGN, GHS, ZAR), Paystack, bank transfer, and cards. Invoices in Naira, KES, Cedi or USD — you choose at checkout." },
  { q: "What if I exceed my plan limits?", a: "We’ll notify you at 80%. You can upgrade instantly, no downtime. No overage penalties — you only pay the next tier prorated. Scale plan is unlimited by design." },
  { q: "Is there a free trial?", a: "14-day free trial on Growth, no card required. Starter is free forever up to 100 customers. Includes onboarding in English, Swahili, Yoruba, Hausa, Igbo & Pidgin." },
  { q: "Do you support Yoruba, Igbo, Swahili?", a: "Yes — 12 African languages + English with accent adaptation. AiKOVA understands Pidgin, Sheng, Naija slang. Set per-branch language in 2 clicks." },
  { q: "Can I cancel anytime?", a: "Cancel in one click. Keep your data for 90 days. Annual plans refund prorated. We’re built for trust — same payments you use for your shop." },
];

export default function PricingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [billingAnnual, setBillingAnnual] = useState(false);
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    const els = document.querySelectorAll('.reveal');
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const pricingCards = [
    {
      name: "Starter",
      badge: "Free forever",
      price: billingAnnual ? 0 : 0,
      suffix: "/month",
      accent: "from-[#00E5FF] to-[#00B8D4]",
      border: "#00E5FF",
      desc: "Perfect for solo shops & market stalls testing AI receptionist.",
      features: ["Up to 100 customers / mo", "Basic invoicing & receipts", "Email support (24h)", "Mobile & web dashboard", "1 language, 1 location"],
      cta: "Get Started Free",
      ctaStyle: "bg-slate-900 text-white hover:bg-slate-800",
    },
    {
      name: "Growth",
      badge: "Most popular",
      price: billingAnnual ? 24 : 29,
      suffix: "/month",
      accent: "from-[#2962FF] to-[#00E5FF]",
      border: "#2962FF",
      desc: "For growing shops, salons, clinics — save 94% vs $399 tools.",
      features: ["Up to 1,000 customers / mo", "Analytics & weekly savings report", "Team — 5 users included", "M-Pesa, Flutterwave, Paystack", "Priority support + onboarding", "6 languages, 3 locations"],
      cta: "Start Growing — $29",
      ctaStyle: "text-white",
      popular: true,
    },
    {
      name: "Scale",
      badge: "For chains",
      price: billingAnnual ? 83 : 99,
      suffix: "/month",
      accent: "from-[#76FF03] to-[#00E5FF]",
      border: "#76FF03",
      desc: "Unlimited for restaurants, pharmacies, multi-branch operations.",
      features: ["Unlimited customers & calls", "Advanced reporting & API", "Dedicated success manager", "24/7 phone + WhatsApp", "Unlimited languages & locations", "Custom workflows & integrations"],
      cta: "Contact Sales",
      ctaStyle: "bg-slate-900 text-white hover:bg-slate-800",
    },
  ];

  return (
    <div data-safe-area-inset-root className="min-h-screen w-full overflow-x-clip" style={shellStyle}>
      {/* NAV */}
      <header
        data-safe-area-sticky-top
        className="sticky z-50 backdrop-blur-xl border-b"
        style={{ top: 'calc(var(--safe-area-inset-top))', background: 'rgba(255,255,255,0.84)', borderColor: 'var(--border)' }}
      >
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-8 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-9">
            <a href="/" className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl overflow-hidden ring-1 ring-slate-200 shadow-sm">
                <img src={logoUrl} alt="AiKOVA logo" className="h-full w-full object-cover" />
              </div>
              <span className="font-[Outfit] font-bold text-[18px] tracking-tight text-slate-900">AiKOVA</span>
              <span className="hidden sm:inline text-[11px] font-semibold tracking-widest uppercase px-2 py-1 rounded-full bg-slate-900 text-white">AI Receptionist</span>
            </a>
            <nav className="hidden lg:flex items-center gap-7 text-[14px] font-medium text-slate-600">
              {["Features","Solutions","Languages","How It Works"].map((l) => (
                <a key={l} href={`#${l.toLowerCase().replace(/\s/g,'-')}`} className="hover:text-slate-900 transition-colors">{l}</a>
              ))}
              <a href="#pricing" className="relative px-3 py-1.5 rounded-full font-semibold text-slate-900">
                <span className="absolute inset-0 rounded-full opacity-15" style={{ background: 'var(--gradient)' }} />
                <span className="relative">Pricing</span>
              </a>
              <a href="#demo" className="hover:text-slate-900 transition-colors">Demo</a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-[12px] text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Trusted by 2,000+ businesses
            </div>
            <a href="#cta" className="hidden sm:inline-flex h-10 px-5 rounded-full text-white text-[14px] font-semibold items-center justify-center shadow-[0_8px_20px_rgba(41,98,255,0.25)]" style={{ background: 'var(--gradient)' }}>
              Start free trial
            </a>
            <button
              aria-label="Menu"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden h-10 w-10 rounded-full border border-slate-200 grid place-items-center"
            >
              <span className="space-y-1.5 block">
                <span className={`block h-0.5 w-4 bg-slate-900 transition ${mobileOpen ? 'rotate-45 translate-y-[3px]' : ''}`} />
                <span className={`block h-0.5 w-4 bg-slate-900 transition ${mobileOpen ? '-rotate-45 -translate-y-[3px]' : ''}`} />
              </span>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-5 py-5 space-y-4">
            {["Features","Solutions","Languages","How It Works","Pricing","Demo"].map((l) => (
              <a key={l} href="#pricing" className="block text-[15px] font-medium text-slate-700">{l}</a>
            ))}
            <a href="#cta" className="flex h-11 rounded-full text-white font-semibold items-center justify-center" style={{ background: 'var(--gradient)' }}>Start free trial — $0</a>
          </div>
        )}
      </header>

      <main ref={revealRef} className="w-full">
        {/* HERO */}
        <section className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-8 pt-10 sm:pt-16 pb-8 sm:pb-14">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 sm:gap-12 items-start">
            <div className="reveal">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-white text-[11px] font-semibold tracking-widest uppercase text-slate-600 shadow-[var(--shadow-soft)]">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--gradient)' }} />
                Pricing • Built for Africa, Not Silicon Valley
                <span className="ml-1 px-2 py-0.5 rounded-full text-white" style={{ background: '#0F172A' }}>No.6 / 11</span>
              </div>

              <h1 className="mt-6 font-[Outfit] font-[800] leading-[0.95] tracking-[-0.04em] text-[38px] sm:text-[56px] lg:text-[68px] text-slate-900">
                Affordable for
                <span className="block relative">
                  <span className="relative z-10">startups.</span>
                  <span className="absolute left-0 bottom-[0.15em] h-[0.35em] w-full -rotate-[1deg] opacity-30" style={{ background: 'var(--gradient)' }} />
                </span>
                <span className="block text-slate-900">Powerful for scale.</span>
              </h1>

              <p className="mt-6 max-w-[560px] text-[17px] sm:text-[18px] leading-[1.6] text-slate-600">
                From $0 to $99, not $399/location. Pay with <span className="font-semibold text-slate-900">M-Pesa, Flutterwave, Paystack.</span> Save 94% vs Slang AI — same warmth, more languages, built for your market stall to multi-branch.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#pricing-cards" className="h-[48px] px-7 rounded-full text-white font-semibold text-[15px] inline-flex items-center justify-center gap-2 shadow-[0_12px_28px_rgba(41,98,255,0.28)] transition hover:translate-y-[-1px]" style={{ background: 'var(--gradient)' }}>
                  See plans & savings
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
                <a href="#comparison" className="h-[48px] px-6 rounded-full border border-slate-200 bg-white font-medium text-[15px] inline-flex items-center justify-center gap-2 hover:border-slate-300 transition">
                  <span className="h-6 w-6 rounded-full grid place-items-center text-[11px] font-bold text-white" style={{ background: '#0F172A' }}>$</span>
                  Why $25 not $399?
                </a>
              </div>

              <div className="mt-8 flex items-center gap-4 text-[13px] text-slate-500">
                <div className="flex -space-x-2">
                  {[0,1,2].map(i => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-100 grid place-items-center text-[10px] font-bold">{['N','K','G'][i]}</div>
                  ))}
                </div>
                <span><b className="text-slate-900">2000+</b> African businesses • 14-day trial • No card</span>
              </div>
            </div>

            {/* HERO SIDE VISUAL */}
            <div className="reveal reveal-delay-1 relative">
              <div className="relative rounded-[28px] bg-white p-3 shadow-[var(--shadow-card)] border border-slate-100">
                <div className="absolute -top-6 -right-6 hidden sm:flex h-[88px] w-[88px] rounded-[22px] bg-slate-900 text-white flex-col items-center justify-center rotate-3 shadow-xl z-10">
                  <span className="text-[11px] uppercase tracking-widest opacity-70">You Save</span>
                  <span className="text-[22px] font-bold leading-none">$374</span>
                  <span className="text-[11px]">/month</span>
                </div>

                <div className="rounded-[20px] overflow-hidden relative bg-slate-50">
                  <img src={savingsWomanUrl} alt="Woman showing N12,450 savings in market shop with Top-up Data Airtime background" className="w-full aspect-[4/3.1] object-cover" />
                  {/* floating savings card */}
                  <div className="absolute left-3 bottom-3 right-3 sm:left-4 sm:bottom-4 sm:right-auto sm:w-[280px] rounded-[18px] bg-white/95 backdrop-blur-xl border border-white shadow-[0_16px_40px_rgba(15,23,42,0.18)] p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-[11px] font-semibold tracking-widest uppercase text-slate-500">Monthly Savings</div>
                      <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold">+22% ↑</span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-[28px] font-[800] tracking-tight text-slate-900">N12,450</span>
                      <span className="text-[13px] text-slate-500">saved this month</span>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {[
                        { k: "Mon", v: 42 },
                        { k: "Tue", v: 68 },
                        { k: "Wed", v: 54 },
                        { k: "Thu", v: 86 },
                        { k: "Fri", v: 92 },
                        { k: "Sat", v: 74 },
                      ].slice(0,3).map(c => (
                        <div key={c.k} className="rounded-xl bg-slate-50 border border-slate-100 p-2">
                          <div className="text-[10px] text-slate-500">{c.k}</div>
                          <div className="mt-1 h-8 flex items-end">
                            <div className="w-full rounded-full" style={{ height: `${c.v}%`, background: 'var(--gradient)' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" /> vs market avg 18% lower — AiKOVA pricing
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3">
                    <div className="text-[10px] uppercase tracking-widest font-semibold text-slate-500">Top-up</div>
                    <div className="mt-1 text-[13px] font-semibold text-slate-900">Data & Airtime</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3">
                    <div className="text-[10px] uppercase tracking-widest font-semibold text-slate-500">Payments</div>
                    <div className="mt-1 text-[13px] font-semibold text-slate-900">M-Pesa + 3</div>
                  </div>
                  <div className="rounded-2xl text-white p-3" style={{ background: 'var(--gradient)' }}>
                    <div className="text-[10px] uppercase tracking-widest font-semibold opacity-80">African</div>
                    <div className="mt-1 text-[13px] font-bold">Market ready</div>
                  </div>
                </div>
              </div>

              <div className="absolute -z-10 top-10 -right-10 h-[280px] w-[280px] rounded-full blur-[60px] opacity-20" style={{ background: 'var(--gradient)' }} />
            </div>
          </div>
        </section>

        {/* COMPARISON HERO INFOGRAPHIC */}
        <section id="comparison" className="bg-[var(--bg-alt)] border-y border-slate-200/70">
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-8 py-12 sm:py-20">
            <div className="reveal text-center max-w-[780px] mx-auto">
              <div className="inline-flex px-3 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-semibold tracking-widest uppercase text-slate-600 shadow-sm">
                Comparison • Torch of God clarity
              </div>
              <h2 className="mt-5 font-[800] text-[32px] sm:text-[44px] leading-[1.05] tracking-[-0.03em] text-slate-900">
                Why pay $399 for restaurant-only?
              </h2>
              <p className="mt-4 text-[16px] sm:text-[17px] leading-[1.6] text-slate-600">
                AiKOVA is any business, any language, with local payments. Same AI warmth, <b className="text-slate-900">94% less cost.</b>
              </p>
            </div>

            <div className="reveal reveal-delay-1 mt-10 sm:mt-14 mx-auto max-w-[980px]">
              <div className="relative rounded-[28px] bg-white border border-slate-200 shadow-[0_20px_80px_rgba(15,23,42,0.08)] p-3 sm:p-4">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-[11px] font-bold tracking-widest uppercase shadow-lg">LIVE COMPARISON • VERIFIED SAVINGS</div>
                <div className="rounded-[18px] overflow-hidden border border-slate-100 bg-white">
                  <img src={comparisonUrl} alt="Slang $399 vs AiKOVA $25 comparison, save $374 per month, 94 percent savings, N578500 saved, M-Pesa" className="w-full object-contain" />
                </div>

                <div className="mt-4 grid sm:grid-cols-3 gap-3 text-[13px]">
                  <div className="rounded-2xl bg-red-50 border border-red-100 px-4 py-3 flex items-center gap-3">
                    <span className="h-8 w-8 rounded-full bg-red-500 text-white grid place-items-center font-bold">✕</span>
                    <div><div className="font-semibold text-slate-900">Slang AI: $399/mo</div><div className="text-slate-600">Restaurant only • No M-Pesa</div></div>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-3 flex items-center gap-3">
                    <span className="h-8 w-8 rounded-full bg-emerald-500 text-white grid place-items-center font-bold">✓</span>
                    <div><div className="font-semibold text-slate-900">AiKOVA: $25 avg</div><div className="text-slate-600">Any business • Local payments</div></div>
                  </div>
                  <div className="rounded-2xl text-white px-4 py-3 flex items-center gap-3" style={{ background: 'var(--gradient)' }}>
                    <span className="h-8 w-8 rounded-full bg-white text-slate-900 grid place-items-center font-bold">%</span>
                    <div><div className="font-bold">YOU SAVE $374 / MO</div><div className="opacity-90">Approx N578,500 saved • 94%</div></div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-3 text-[13px]">
                {["Any business type","12 African languages","M-Pesa, Flutterwave, Paystack","No per-location fee","Cancel anytime"].map(t => (
                  <span key={t} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--gradient)' }} /> {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PRICING PLANS */}
        <section id="pricing-cards" className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-8 py-14 sm:py-24">
          <div className="reveal flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase">
                <span className="px-2.5 py-1 rounded-full text-white" style={{ background: 'var(--gradient)' }}>Pricing</span>
                <span className="text-slate-500">For African Businesses • No Silicon Valley markup</span>
              </div>
              <h2 className="mt-4 font-[800] text-[34px] sm:text-[48px] leading-[0.95] tracking-[-0.03em] text-slate-900">
                Pricing Plans for<br />African Businesses
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="rounded-full p-1 bg-slate-100 border border-slate-200 flex">
                <button onClick={()=>setBillingAnnual(false)} className={`px-5 h-8 rounded-full text-[13px] font-semibold transition ${!billingAnnual ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>Monthly</button>
                <button onClick={()=>setBillingAnnual(true)} className={`px-5 h-8 rounded-full text-[13px] font-semibold transition flex items-center gap-2 ${billingAnnual ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>Annual <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px]">-20%</span></button>
              </div>
              <p className="max-w-[320px] text-[13px] leading-[1.5] text-slate-500">All plans include M-Pesa, Flutterwave, Paystack. Switch currency to NGN, KES, GHS anytime.</p>
            </div>
          </div>

          {/* visual reference + cards */}
          <div className="reveal reveal-delay-1 mt-10 grid lg:grid-cols-[360px_1fr] gap-6 items-start">
            <div className="rounded-[24px] bg-white border border-slate-200 shadow-[var(--shadow-card)] p-3">
              <div className="text-[11px] font-bold tracking-widest uppercase text-slate-500 px-2 py-1">Infographic reference • Visual system</div>
              <div className="mt-2 rounded-[16px] overflow-hidden border border-slate-100">
                <img src={pricingInfographicUrl} alt="Pricing plans infographic $0 Starter $29 Growth $99 Scale" className="w-full object-cover" />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
                <div className="rounded-xl bg-slate-50 border p-2"><div className="font-bold">Starter</div><div className="text-slate-500">$0</div></div>
                <div className="rounded-xl bg-blue-50 border border-blue-100 p-2"><div className="font-bold text-blue-700">Growth</div><div className="text-slate-500">$29</div></div>
                <div className="rounded-xl bg-lime-50 border border-lime-100 p-2"><div className="font-bold text-lime-700">Scale</div><div className="text-slate-500">$99</div></div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
              {pricingCards.map((card, idx) => (
                <div key={card.name} className={`reveal relative rounded-[24px] bg-white border shadow-[var(--shadow-card)] p-6 sm:p-7 flex flex-col hover:shadow-[var(--shadow-card-hover)] transition-all duration-500 ${idx===1 ? 'lg:-mt-4 lg:mb-4 lg:scale-[1.02] ring-1 ring-blue-100' : ''}`} style={{ transitionDelay: `${idx*90}ms` }}>
                  {/* top border */}
                  <div className="absolute top-0 left-6 right-6 h-[3px] rounded-full" style={{ background: card.border }} />

                  {card.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-white text-[11px] font-bold tracking-wide shadow-md" style={{ background: 'var(--gradient)' }}>
                      MOST POPULAR • 94% SAVINGS
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-[20px] text-slate-900">{card.name}</h3>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${card.popular ? 'bg-blue-50 border-blue-100 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>{card.badge}</span>
                  </div>

                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-[42px] font-[800] tracking-tight text-slate-900 leading-none">${card.price}</span>
                    <span className="text-[14px] text-slate-500 font-medium">{card.suffix}</span>
                    {billingAnnual && card.price>0 && <span className="ml-2 text-[11px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold">billed annually</span>}
                  </div>

                  <p className="mt-3 text-[13px] leading-[1.5] text-slate-600 min-h-[38px]">{card.desc}</p>

                  <ul className="mt-6 space-y-3">
                    {card.features.map(f => (
                      <li key={f} className="flex gap-2.5 text-[13px] leading-[1.4] text-slate-700">
                        <span className="mt-0.5 h-5 w-5 rounded-full grid place-items-center text-[11px] font-bold text-white shrink-0" style={{ background: card.popular ? 'var(--gradient)' : '#0F172A' }}>✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-7">
                    <button className={`w-full h-[46px] rounded-full font-semibold text-[14px] transition hover:translate-y-[-1px] active:translate-y-[0px] ${card.ctaStyle}`} style={card.popular ? { background: 'var(--gradient)' } : {}}>
                      {card.cta}
                    </button>
                    <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                      <span className="h-3 w-3 rounded-full bg-emerald-500 grid place-items-center text-white text-[8px]">✓</span> 14-day trial • No card • M-Pesa ready
                    </div>
                  </div>

                  {card.popular && (
                    <div className="mt-5 rounded-xl bg-slate-900 text-white p-3 flex items-center justify-between text-[11px]">
                      <span className="opacity-70"> vs Slang AI $399</span>
                      <span className="font-bold">You save $370/mo</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* trust row */}
          <div className="reveal mt-10 rounded-[20px] bg-white border border-slate-200 shadow-sm px-4 sm:px-6 py-4 flex flex-wrap gap-4 sm:gap-8 items-center justify-between text-[13px]">
            <div className="flex items-center gap-3">
              <span className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-600 grid place-items-center">🔒</span>
              <span className="font-semibold text-slate-900">Secure & Trusted</span>
              <span className="text-slate-500 hidden sm:inline">• Bank-level encryption • NDPR compliant</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Trusted by 2000+ African businesses</span>
              <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-blue-500" /> Support 24/7 in 6 languages</span>
              <span className="hidden md:inline-flex px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold">14-DAY FREE TRIAL</span>
            </div>
          </div>
        </section>

        {/* SAVINGS STORY */}
        <section className="bg-[var(--bg-alt)] border-y border-slate-200/70">
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-8 py-14 sm:py-20">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 sm:gap-12 items-center">
              <div className="reveal order-2 lg:order-1">
                <div className="rounded-[28px] bg-white border border-slate-200 shadow-[var(--shadow-card)] p-3 sm:p-4">
                  <div className="grid sm:grid-cols-[1.2fr_0.8fr] gap-3 sm:gap-4">
                    <div className="rounded-[18px] overflow-hidden bg-slate-50 border border-slate-100 relative">
                      <img src={savingsWomanUrl} alt="Real shop owner in market saves N12k monthly vs expensive alternatives" className="w-full h-full object-cover aspect-[4/3]" />
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur text-[11px] font-bold shadow">Affordable pricing • avg 18% lower vs market</div>
                    </div>
                    <div className="space-y-3">
                      <div className="rounded-[18px] bg-slate-900 text-white p-4">
                        <div className="text-[11px] uppercase tracking-widest opacity-60">Weekly Savings Chart</div>
                        <div className="mt-3 flex items-end gap-2 h-[84px]">
                          {[45,62,38,78,92,64,88].map((h,i)=>(
                            <div key={i} className="flex-1 rounded-full" style={{ height: `${h}%`, background: i===4 ? 'var(--gradient)' : 'rgba(255,255,255,0.18)' }} />
                          ))}
                        </div>
                        <div className="mt-3 flex justify-between text-[10px] opacity-60"><span>Mon</span><span>Sun</span></div>
                      </div>
                      <div className="rounded-[18px] border border-slate-200 bg-white p-4">
                        <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">This Month</div>
                        <div className="mt-2 flex items-baseline gap-2"><span className="text-[28px] font-[800]">N12,450</span><span className="text-[12px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold">+22%</span></div>
                        <div className="mt-3 space-y-2">
                          {[
                            { l: "vs Slang AI", v: "N578,500 saved" },
                            { l: "Top-up Data sales", v: "+18%" },
                            { l: "Customer replies", v: "342" },
                          ].map(r=>(
                            <div key={r.l} className="flex justify-between text-[12px]"><span className="text-slate-500">{r.l}</span><span className="font-semibold text-slate-900">{r.v}</span></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="reveal order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-bold tracking-widest uppercase text-slate-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Savings Story • Real Market
                </div>
                <h2 className="mt-5 font-[800] text-[30px] sm:text-[42px] leading-[0.98] tracking-[-0.03em] text-slate-900">
                  Real shop owner in market saves <span className="relative"><span className="relative z-10">N12k monthly</span><span className="absolute bottom-1 left-0 w-full h-[10px] opacity-30 -rotate-1" style={{ background: 'var(--gradient)' }} /></span> vs expensive alternatives
                </h2>
                <p className="mt-4 text-[16px] leading-[1.6] text-slate-600">
                  Meet Amara — runs a Top-up Data & Airtime shop in Yaba Market. Switched from manual receptionist + $399 tool to AiKOVA Growth at $29. Same customers, more sleep, <b className="text-slate-900">N12,450 extra profit this month</b> to restock.
                </p>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[
                    { k: "94% cheaper", v: "vs $399 Slang" },
                    { k: "18% lower", v: "vs local avg" },
                    { k: "342 replies", v: "auto-handled" },
                  ].map(s=>(
                    <div key={s.k} className="rounded-2xl bg-white border border-slate-200 p-3 shadow-sm">
                      <div className="text-[13px] font-bold text-slate-900">{s.k}</div>
                      <div className="text-[12px] text-slate-500">{s.v}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex gap-3">
                  <a href="#pricing-cards" className="h-11 px-6 rounded-full bg-slate-900 text-white font-semibold text-[14px] inline-flex items-center justify-center">See how she did it</a>
                  <span className="h-11 px-4 rounded-full bg-white border border-slate-200 inline-flex items-center gap-2 text-[13px] text-slate-600"><span className="h-6 w-6 rounded-full bg-slate-100 grid place-items-center">📍</span> Yaba, Lagos • Authentic market lighting</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GROWTH CELEBRATION */}
        <section className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-8 py-14 sm:py-20">
          <div className="reveal rounded-[28px] bg-white border border-slate-200 shadow-[0_20px_80px_rgba(15,23,42,0.08)] overflow-hidden">
            <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-0">
              <div className="relative p-3 sm:p-4">
                <div className="rounded-[20px] overflow-hidden border border-slate-100 relative">
                  <img src={teamCelebrationUrl} alt="Team of 5 celebrating +142% growth with Flutterwave Paystack M-Pesa payments" className="w-full aspect-[16/10] object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
                    {[
                      "Flutterwave $12,450 received",
                      "Paystack N1,250,000",
                      "M-Pesa KES 450,000",
                    ].map(p=>(
                      <span key={p} className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-[11px] font-semibold shadow">{p}</span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[
                    { k: "+142% growth", v: "YoY revenue" },
                    { k: "$89,420", v: "total payments" },
                    { k: "+312", v: "new customers" },
                  ].map(m=>(
                    <div key={m.k} className="rounded-2xl bg-slate-50 border border-slate-100 p-3">
                      <div className="text-[16px] font-[800] text-slate-900">{m.k}</div>
                      <div className="text-[11px] text-slate-500">{m.v}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 sm:p-10 flex flex-col justify-center bg-[var(--bg-alt)] lg:bg-white">
                <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase">
                  <span className="px-2.5 py-1 rounded-full text-white" style={{ background: 'var(--gradient)' }}>Growth • Impact</span>
                  <span className="text-slate-500">Teams across Africa</span>
                </div>
                <h3 className="mt-4 font-[800] text-[28px] sm:text-[36px] leading-[0.98] tracking-[-0.03em] text-slate-900">
                  When you save on receptionist, you invest in growth.
                </h3>
                <p className="mt-4 text-[15px] leading-[1.6] text-slate-600">
                  Teams across Africa using AiKOVA see <b className="text-slate-900">+142% YoY</b>. Why? $374 saved monthly = inventory, ads, staff. Our dashboard shows Flutterwave, Paystack, M-Pesa in one view.
                </p>

                <div className="mt-6 space-y-3">
                  {[
                    { t: "Mission: Empower African Businesses", d: "Not Silicon Valley markup — pricing that respects Naira, KES, Cedi reality." },
                    { t: "Growth • Payments • Impact", d: "One inbox for M-Pesa, Flutterwave, Paystack. Reconcile in 2 mins." },
                    { t: "New Markets: Nairobi • Lagos • Accra", d: "Yoruba, Igbo, Swahili, Pidgin — your customer feels at home." },
                  ].map(i=>(
                    <div key={i.t} className="flex gap-3">
                      <span className="mt-1 h-6 w-6 rounded-full grid place-items-center text-white text-[11px] shrink-0" style={{ background: 'var(--gradient)' }}>✓</span>
                      <div><div className="text-[14px] font-semibold text-slate-900">{i.t}</div><div className="text-[13px] text-slate-600">{i.d}</div></div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-2xl bg-slate-900 text-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full overflow-hidden"><img src={logoUrl} alt="AiKOVA" className="h-full w-full object-cover" /></div>
                    <div><div className="text-[13px] font-bold">AiKOVA Growth Team</div><div className="text-[11px] opacity-60">Nairobi • Lagos • Accra • Kigali</div></div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white text-slate-900 text-[11px] font-bold">+142% 🚀</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PAYMENT METHODS */}
        <section className="bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.15]" style={{ background: 'var(--gradient)' }} />
          <div className="absolute -top-24 -right-24 h-[400px] w-[400px] rounded-full blur-[90px] opacity-20" style={{ background: 'var(--gradient)' }} />
          <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-8 py-12 sm:py-16">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="reveal">
                <div className="inline-flex px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold tracking-widest uppercase">Local Payments • No Dollar Stress</div>
                <h3 className="mt-4 font-[800] text-[28px] sm:text-[36px] leading-[0.95] tracking-[-0.03em]">Pay like your customers pay.</h3>
                <p className="mt-3 max-w-[520px] text-[14px] leading-[1.6] text-white/70">M-Pesa, Flutterwave, Paystack, bank transfer. Invoices in Naira, KES, Cedi or USD. No hidden FX fees — what you see is what your shop keeps.</p>
              </div>
              <div className="reveal reveal-delay-1 grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4">
                {[
                  { n: "M-Pesa", s: "KES • Instant", c: "#00A651" },
                  { n: "Flutterwave", s: "NGN • Cards", c: "#F5A623" },
                  { n: "Paystack", s: "NGN • Bank", c: "#011B33" },
                  { n: "Bank Transfer", s: "All currencies", c: "#2962FF" },
                  { n: "Naira", s: "₦ • NGN", c: "#008751" },
                  { n: "KES", s: "KSh • Kenya", c: "#BB0000" },
                  { n: "Cedi", s: "₵ • Ghana", c: "#FCD116" },
                  { n: "USD", s: "$ • Global", c: "#00E5FF" },
                ].map(p=>(
                  <div key={p.n} className="rounded-2xl bg-white/10 backdrop-blur border border-white/10 p-4 hover:bg-white/15 transition">
                    <div className="h-8 w-8 rounded-full grid place-items-center text-[12px] font-bold text-white" style={{ background: p.c }}>{p.n[0]}</div>
                    <div className="mt-3 text-[13px] font-semibold">{p.n}</div>
                    <div className="text-[11px] text-white/60">{p.s}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-8 py-14 sm:py-20">
          <div className="reveal max-w-[720px] mx-auto text-center">
            <h2 className="font-[800] text-[32px] sm:text-[44px] leading-[0.95] tracking-[-0.03em] text-slate-900">Questions? Answers in plain market English.</h2>
            <p className="mt-4 text-[15px] text-slate-600">No legalese. Same clarity we give your customers — fast, honest, local.</p>
          </div>

          <div className="reveal mt-10 max-w-[820px] mx-auto space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className={`rounded-[20px] border bg-white shadow-sm transition-all ${openFaq===i ? 'border-slate-900 shadow-[var(--shadow-card)]' : 'border-slate-200 hover:border-slate-300'}`}>
                <button onClick={()=> setOpenFaq(openFaq===i ? null : i)} className="w-full text-left px-6 py-5 flex items-start justify-between gap-4">
                  <span className="font-semibold text-[15px] text-slate-900">{f.q}</span>
                  <span className={`h-7 w-7 rounded-full grid place-items-center border text-[14px] transition ${openFaq===i ? 'bg-slate-900 text-white border-slate-900 rotate-45' : 'bg-white text-slate-500 border-slate-200'}`}>+</span>
                </button>
                {openFaq===i && (
                  <div className="px-6 pb-6 -mt-1 text-[14px] leading-[1.6] text-slate-600">
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA BANNER */}
        <section id="cta" className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-8 pb-14 sm:pb-20">
          <div className="reveal relative rounded-[28px] overflow-hidden p-[1px]" style={{ background: 'var(--gradient)' }}>
            <div className="rounded-[27px] bg-slate-900 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{ background: 'var(--gradient)' }} />
              <div className="absolute -top-20 -right-20 h-[360px] w-[360px] rounded-full blur-[80px] opacity-30" style={{ background: 'var(--gradient)' }} />
              <div className="relative grid lg:grid-cols-[1.1fr_0.9fr] gap-8 p-8 sm:p-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white text-[11px] font-bold tracking-widest uppercase">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Limited • Save $374 this month
                  </div>
                  <h2 className="mt-5 font-[800] text-[32px] sm:text-[46px] leading-[0.92] tracking-[-0.03em] text-white">
                    Save $374/month today.<br />Start free trial,<br /><span className="text-transparent bg-clip-text" style={{ backgroundImage: 'var(--gradient)' }}>pay with M-Pesa.</span>
                  </h2>
                  <p className="mt-4 max-w-[520px] text-[15px] leading-[1.6] text-white/70">
                    Join 2,000+ African shops, clinics, salons who switched from $399 Slang AI. 14-day trial, no card, cancel anytime. Built for Yaba Market, ready for scale.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a href="#pricing-cards" className="h-[52px] px-8 rounded-full bg-white text-slate-900 font-bold text-[15px] inline-flex items-center justify-center gap-2 shadow-[0_12px_30px_rgba(255,255,255,0.15)] hover:translate-y-[-1px] transition">
                      Start free — $0 today
                      <span className="h-6 w-6 rounded-full bg-slate-900 text-white grid place-items-center text-[12px]">→</span>
                    </a>
                    <a href="#comparison" className="h-[52px] px-7 rounded-full border border-white/20 bg-white/10 text-white font-semibold text-[14px] inline-flex items-center justify-center backdrop-blur hover:bg-white/15 transition">
                      See $399 vs $25 breakdown
                    </a>
                  </div>
                  <div className="mt-6 flex items-center gap-3 text-[12px] text-white/60">
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400" /> No card required</span>
                    <span>•</span>
                    <span>14-day trial • M-Pesa • Flutterwave • Paystack</span>
                  </div>
                </div>

                <div className="relative">
                  <div className="rounded-[22px] bg-white p-3 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                    <div className="rounded-[16px] overflow-hidden border">
                      <img src={comparisonUrl} alt="Save $374 per month comparison visual" className="w-full object-cover" />
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <div className="rounded-xl bg-slate-50 border p-3 text-center"><div className="text-[20px] font-[800]">94%</div><div className="text-[10px] text-slate-500 uppercase tracking-wide">Savings</div></div>
                      <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-center"><div className="text-[20px] font-[800] text-emerald-600">$374</div><div className="text-[10px] text-slate-500 uppercase tracking-wide">Saved / mo</div></div>
                      <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 text-center"><div className="text-[20px] font-[800] text-blue-600">2k+</div><div className="text-[10px] text-slate-500 uppercase tracking-wide">Businesses</div></div>
                    </div>
                  </div>

                  <div className="absolute -bottom-4 -left-4 rounded-full bg-white shadow-xl border border-slate-100 px-4 py-2 flex items-center gap-2 text-[12px] font-semibold">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> N578,500 saved avg • Verified
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-[var(--bg-alt)]">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-8 py-12 sm:py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl overflow-hidden ring-1 ring-slate-200"><img src={logoUrl} alt="AiKOVA logo" className="h-full w-full object-cover" /></div>
                <span className="font-bold text-[18px]">AiKOVA</span>
              </div>
              <p className="mt-4 max-w-[320px] text-[13px] leading-[1.6] text-slate-600">
                AI Receptionist built for Africa, not Silicon Valley. Affordable for startups, powerful for scale. M-Pesa, Flutterwave, Paystack native.
              </p>
              <div className="mt-6 flex gap-2">
                {["M-Pesa","Flutterwave","Paystack"].map(m=>(
                  <span key={m} className="px-3 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-semibold text-slate-700">{m}</span>
                ))}
              </div>
            </div>
            {[
              { h: "Product", l: ["Features","Solutions","Languages","How It Works","Pricing","Demo"] },
              { h: "Company", l: ["About us","Careers","Press","Contact","Nairobi • Lagos • Accra"] },
              { h: "Legal", l: ["Privacy • NDPR","Terms","Security","Support 24/7"] },
            ].map(col=>(
              <div key={col.h}>
                <div className="text-[12px] font-bold tracking-widest uppercase text-slate-900">{col.h}</div>
                <ul className="mt-4 space-y-2.5 text-[13px] text-slate-600">
                  {col.l.map(it=> <li key={it}><a href={({"Features":"/features","Solutions":"/solutions","Languages":"/languages","How It Works":"/how-it-works","How it Works":"/how-it-works","Pricing":"/pricing","Company":"/company","Customers":"/customers","Resources":"/resources","Demo":"/business","Business":"/business","Product":"/features","Developers":"/resources","About":"/company","About us":"/company","Blog":"/resources","Contact":"/get-started","Careers":"/company","Press":"/company","Founder Story":"/company","API Docs":"/resources","Playbooks":"/resources","Market Insights":"/resources","Compliance":"/resources","Growth Roadmap":"/resources","Case Studies":"/customers","Wall of Love":"/customers","Invoca Benchmark":"/customers","M-Pesa Billing":"/pricing","Salons":"/solutions","Clinics":"/solutions","Real Estate":"/solutions","E-commerce":"/solutions","Privacy":"/get-started","Terms":"/get-started","NDPA":"/get-started"} as Record<string,string>)[it] ?? "#"} className="hover:text-slate-900 transition">{it}</a></li>)}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between gap-4 text-[12px] text-slate-500">
            <span>© {new Date().getFullYear()} AiKOVA AI Receptionist • Page 6 of 11 • Pricing • White theme • Torch of God constancy</span>
            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" /> All systems operational • 99.9% uptime • Made for African markets</span>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 390px) {
          h1 { font-size: 34px !important; }
        }
      `}</style>
    </div>
  );
}
