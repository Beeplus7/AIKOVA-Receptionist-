import { useState } from 'react';
import logoUrl from "./assets/32d4f05ae5209978-image_6A9BA612-7186-480D-9D5C-7EF8BE2260B7.jpeg";
import projectionUrl from "./assets/3ab4ff4a0287b09f-image_20261029_190409.webp";
import growthUrl from "./assets/908c4c28c19f1e6f-image_20261029_190434.webp";

// Helpers
const fmt = (n: number) => {
  if (n >= 1_000_000) return `$${(n/1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1000) return `$${(n/1000).toFixed(n % 1000 === 0 ? 0 : 0)}k`;
  return `$${n.toLocaleString()}`;
};
const fmtNum = (n: number) => n.toLocaleString();

type Dist = { starter: number; pro: number; ent: number };

export default function BusinessPage() {
  const [distMode, setDistMode] = useState<'conservative' | 'optimistic'>('conservative');
  const [scenarioBMode, setScenarioBMode] = useState<'realistic' | 'growth'>('realistic');

  const distConservative: Dist = { starter: 0.6, pro: 0.3, ent: 0.1 };
  const distOptimistic: Dist = { starter: 0.5, pro: 0.35, ent: 0.15 };
  const currentDist = distMode === 'conservative' ? distConservative : distOptimistic;

  // Calculations for 10k
  const calc10k = (d: Dist) => {
    const s = Math.round(10000 * d.starter);
    const p = Math.round(10000 * d.pro);
    const e = 10000 - s - p;
    return {
      s, p, e,
      sRev: s * 25,
      pRev: p * 79,
      eRev: e * 199,
      get totalMRR() { return this.sRev + this.pRev + this.eRev },
      get totalARR() { return this.totalMRR * 12 }
    };
  };
  const tenKCon = calc10k(distConservative);
  const tenKOpt = calc10k(distOptimistic);

  // 100k calculations
  const calc100k = (d: Dist) => {
    const s = Math.round(100000 * d.starter);
    const p = Math.round(100000 * d.pro);
    const e = 100000 - s - p;
    return {
      s, p, e,
      sRev: s * 25,
      pRev: p * 79,
      eRev: e * 199,
      get totalMRR() { return this.sRev + this.pRev + this.eRev },
      get totalARR() { return this.totalMRR * 12 }
    };
  };
  const hundredKCon = calc100k(distConservative);
  const hundredKOpt = calc100k(distOptimistic);

  // Realistic model from image: $1.44M ARR = $120k MRR for 100k users (freemium + activation)
  const realistic100k = {
    mrr: 120_000,
    arr: 1_440_000,
    avgPerUser: 1.2,
    payingRate: 0.32, // 32k paying of 100k
    blended: 12 // $12 annual?
  };

  // Forecast months
  const forecast = [
    { m: 'Jan', users: 10000, mrr: 12000, note: 'Pre-launch' },
    { m: 'Feb', users: 15000, mrr: 18000 },
    { m: 'Mar', users: 22000, mrr: 28000 },
    { m: 'Apr', users: 30000, mrr: 39000 },
    { m: 'May', users: 38000, mrr: 48000 },
    { m: 'Jun', users: 45000, mrr: 58000, highlight: true },
    { m: 'Jul', users: 55000, mrr: 70000 },
    { m: 'Aug', users: 67000, mrr: 85000 },
    { m: 'Sep', users: 78000, mrr: 97000 },
    { m: 'Oct', users: 88000, mrr: 108000 },
    { m: 'Nov', users: 95000, mrr: 115000 },
    { m: 'Dec', users: 100000, mrr: 120000, arr: 1440000 },
  ];

  const maxMRR = Math.max(...forecast.map(f => f.mrr));

  return (
    <div data-safe-area-inset-root className="min-h-screen bg-white text-slate-900 overflow-x-clip" style={{ boxSizing: 'border-box', paddingTop: 'var(--safe-area-inset-top)' }}>
      {/* NAV */}
      <nav data-safe-area-sticky-top className="sticky z-40 backdrop-blur-xl bg-white/80 border-b border-slate-200" style={{ top: 'var(--safe-area-inset-top)' }}>
        <div className="mx-auto max-w-[1240px] px-5 md:px-8 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="AiKOVA logo" className="h-9 w-9 rounded-xl object-cover shadow-sm" />
            <div className="flex items-center gap-2.5">
              <span className="font-bold text-[17px] tracking-tight">AiKOVA</span>
              <span className="hidden sm:inline-flex h-5 w-px bg-slate-200" />
              <span className="text-[13px] font-medium text-slate-500 tracking-wide hidden sm:inline">Business Plan Revenue</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold tracking-widest uppercase text-slate-600">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Pre-Launch
            </span>
            <a href="#valuation" className="hidden md:inline-flex rounded-full bg-slate-900 text-white px-4 py-2 text-[12.5px] font-semibold tracking-wide hover:bg-slate-800 transition">Valuation Deck</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-50 to-white" />
        <div className="absolute -top-24 right-[-10%] -z-10 h-[520px] w-[520px] rounded-full blur-[90px] opacity-20 gradient-accent" />
        <div className="mx-auto max-w-[1240px] px-5 md:px-8 pt-10 md:pt-16 pb-10">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-start">
            <div className="card-drop">
              <div className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 shadow-sm px-3 py-1 text-[11px] font-semibold tracking-widest uppercase text-slate-600 mb-5">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full gradient-accent text-white text-[10px]">◍</span> Business Plan • Pre-Launch to 100k Users
              </div>
              <h1 className="text-[32px] md:text-[52px] leading-[0.95] tracking-tight font-[700] text-slate-900">
                From 10k to 100k users in 12 months — <span className="gradient-text">$1.44M ARR</span>
              </h1>
              <p className="mt-5 text-[15.5px] leading-7 text-slate-600 max-w-[620px]">
                Africa's open <span className="font-semibold text-slate-900">uncategorized market</span>, social-first, plug-and-play. 3 pricing tiers $25 Starter $79 Professional $199 Enterprise. Local payments M-Pesa, Flutterwave, Paystack. Built for voice-first MSMEs.
              </p>

              <div className="mt-7 flex flex-wrap gap-2.5">
                {[
                  { k: 'MRR', v: '$120k', sub: 'at 100k users' },
                  { k: 'ARR', v: '$1.44M', sub: 'Realistic model' },
                  { k: 'Users', v: '100k', sub: '10x in 12mo' },
                  { k: 'Margin', v: '78-85%', sub: 'Gross' },
                ].map(card => (
                  <div key={card.k} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 min-w-[130px] shadow-[0_8px_24px_-12px_rgba(15,23,42,0.12)]">
                    <div className="text-[11px] tracking-widest uppercase font-semibold text-slate-400">{card.k}</div>
                    <div className="text-[18px] font-bold tracking-tight">{card.v}</div>
                    <div className="text-[11px] text-slate-500">{card.sub}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <a href="#scenario10" className="rounded-full bg-slate-900 text-white px-5 py-2.5 text-[13px] font-semibold hover:bg-slate-800 transition">Explore 10k → 100k</a>
                <a href="#pricing" className="rounded-full bg-white border border-slate-200 px-5 py-2.5 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition">Pricing tiers</a>
              </div>
            </div>

            {/* Right KPI Card - uses growth image */}
            <div className="card-drop [animation-delay:120ms] rounded-[24px] border border-slate-200 bg-white shadow-[var(--shadow-card)] overflow-hidden">
              <div className="p-2">
                <img src={growthUrl} alt="Business Plan Revenue Growth 10k to 100k" className="w-full rounded-[16px] object-cover aspect-[1.4/1] bg-slate-50" />
              </div>
              <div className="px-6 pb-6 pt-2 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                  <div className="text-[10px] uppercase tracking-widest font-semibold text-slate-400">CAC • LTV</div>
                  <div className="mt-1 text-[13px] font-semibold">$50 → $2000</div>
                  <div className="text-[11px] text-emerald-600 font-medium">LTV:CAC 40:1 • 25% lower than market</div>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                  <div className="text-[10px] uppercase tracking-widest font-semibold text-slate-400">Churn & Growth</div>
                  <div className="mt-1 text-[13px] font-semibold">4% churn • 700% Rev Growth</div>
                  <div className="text-[11px] text-slate-500">East & West Africa • Social-first</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING TIERS */}
      <section id="pricing" className="mx-auto max-w-[1240px] px-5 md:px-8 py-12 md:py-16 border-t border-slate-100">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex rounded-full bg-slate-900 text-white px-3 py-1 text-[11px] font-semibold tracking-widest uppercase">Pricing Architecture</div>
            <h2 className="mt-3 text-[28px] md:text-[36px] leading-none tracking-tight">3 tiers built for Africa</h2>
            <p className="mt-2 text-[14px] text-slate-500 max-w-[560px]">Local payments, usage-based COGS, 80% gross margin at $0.25/min sale vs $0.05/min cost.</p>
          </div>
          <div className="flex rounded-full border border-slate-200 p-1 bg-slate-50">
            <button onClick={() => setDistMode('conservative')} className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition ${distMode === 'conservative' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>Conservative 60/30/10</button>
            <button onClick={() => setDistMode('optimistic')} className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition ${distMode === 'optimistic' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>Optimistic 50/35/15</button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            { name: 'Starter', price: 25, calls: '5,000 API calls', features: ['Basic AI Chat', 'WhatsApp + IG Inbox', 'M-Pesa / Paystack', '1 Business Number'], pct: currentDist.starter },
            { name: 'Professional', price: 79, calls: '50,000 API calls', features: ['Advanced AI + Custom Models', 'Priority Support & Analytics', 'Voice Mesh + Social-to-Sale', '3 Numbers + Team'], pct: currentDist.pro, popular: true },
            { name: 'Enterprise', price: 199, calls: 'Unlimited', features: ['Dedicated Instance + SSO', '24/7 Dedicated Support', 'On-prem Edge + NDPR', 'Unlimited Numbers'], pct: currentDist.ent },
          ].map((tier) => (
            <div key={tier.name} className={`relative rounded-[22px] border bg-white p-[1px] shadow-[var(--shadow-soft)] card-drop ${tier.popular ? 'md:-translate-y-2' : ''}`}>
              {tier.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 text-white px-3 py-1 text-[10px] font-bold tracking-widest uppercase">Most Popular</div>}
              <div className="rounded-[20px] bg-white p-6 h-full flex flex-col">
                <div className="flex items-center justify-between">
                  <h3 className="text-[18px] font-semibold">{tier.name}</h3>
                  <span className="rounded-full bg-slate-50 border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-600">{Math.round(tier.pct * 100)}% mix</span>
                </div>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-[34px] font-bold tracking-tight">${tier.price}</span>
                  <span className="text-[13px] text-slate-500">/month</span>
                </div>
                <div className="mt-1 text-[12px] font-medium text-slate-500">{tier.calls}</div>
                <div className="mt-5 h-px bg-slate-100" />
                <ul className="mt-5 space-y-2.5 flex-1">
                  {tier.features.map(f => (
                    <li key={f} className="flex gap-2 text-[13px] text-slate-700">
                      <span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-slate-900 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <div className={`mt-6 rounded-xl p-[1px] ${tier.popular ? 'gradient-accent' : 'bg-slate-200'}`}>
                  <div className={`rounded-[10px] px-4 py-2.5 text-center text-[12.5px] font-semibold ${tier.popular ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700'}`}>
                    {tier.name} • {tier.calls}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-[20px] border border-slate-200 bg-[#F8FAFC] p-4 md:p-5 flex flex-col md:flex-row gap-4 items-start md:items-center">
          <img src={projectionUrl} alt="Financial projection pricing tiers reference" className="w-full md:w-[360px] rounded-xl border border-slate-200 object-cover bg-white" />
          <div className="flex-1">
            <div className="text-[12px] font-semibold tracking-widest uppercase text-slate-500">Reference • Pricing Architecture</div>
            <p className="mt-1 text-[13px] leading-6 text-slate-600">Original pricing analysis: $25 / $79 / $199 mapping to API consumption. For Africa, blended ARPU is lower due to freemium activation (32% paying) and social-first trials. COGS breakdown validates 78-85% margin even at $1.2 blended user.</p>
            <div className="mt-3 grid grid-cols-3 gap-2 max-w-[520px]">
              {[
                { l: 'STT Whisper', v: '$0.006/min' },
                { l: 'TTS', v: '$0.015/min' },
                { l: 'LLM tokens', v: '$0.01/conv' },
                { l: 'Africa’s Talking', v: '$0.02/min' },
                { l: 'Infra', v: '$0.005/min' },
                { l: 'Total COGS', v: '~$0.05/min', strong: true },
              ].map(i => (
                <div key={i.l} className={`rounded-lg border bg-white px-2.5 py-2 ${i.strong ? 'border-slate-900' : 'border-slate-200'}`}>
                  <div className="text-[10px] uppercase tracking-wide text-slate-400">{i.l}</div>
                  <div className={`text-[12px] font-semibold ${i.strong ? 'text-slate-900' : 'text-slate-700'}`}>{i.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SCENARIO A - 10k */}
      <section id="scenario10" className="bg-[#F8FAFC] border-y border-slate-100">
        <div className="mx-auto max-w-[1240px] px-5 md:px-8 py-12 md:py-16">
          <div className="flex flex-wrap gap-3 items-center mb-6">
            <span className="rounded-full bg-white border border-slate-200 px-3 py-1 text-[11px] font-semibold tracking-widest uppercase">Scenario A</span>
            <h2 className="text-[26px] md:text-[32px] leading-none">10k Users • Pre-Launch</h2>
            <span className="text-[13px] text-slate-500">Blended ARPU sensitivity analysis</span>
          </div>

          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
            <div className="rounded-[22px] border border-slate-200 bg-white p-6 shadow-[var(--shadow-soft)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[16px]">Full-Paid Model • 10k Users</h3>
                <span className="text-[11px] px-2 py-1 rounded-full bg-slate-900 text-white font-semibold">{distMode === 'conservative' ? '60/30/10' : '50/35/15'}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="text-[11px] uppercase tracking-widest text-slate-400 border-b border-slate-100">
                      <th className="text-left py-2 font-semibold">Tier</th>
                      <th className="text-right py-2 font-semibold">Users</th>
                      <th className="text-right py-2 font-semibold">Price</th>
                      <th className="text-right py-2 font-semibold">MRR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[ 
                      { label: 'Starter', users: distMode === 'conservative' ? tenKCon.s : tenKOpt.s, price: 25, rev: distMode === 'conservative' ? tenKCon.sRev : tenKOpt.sRev },
                      { label: 'Professional', users: distMode === 'conservative' ? tenKCon.p : tenKOpt.p, price: 79, rev: distMode === 'conservative' ? tenKCon.pRev : tenKOpt.pRev },
                      { label: 'Enterprise', users: distMode === 'conservative' ? tenKCon.e : tenKOpt.e, price: 199, rev: distMode === 'conservative' ? tenKCon.eRev : tenKOpt.eRev },
                    ].map(r => (
                      <tr key={r.label} className="border-b border-slate-50">
                        <td className="py-2.5 font-medium">{r.label}</td>
                        <td className="py-2.5 text-right mono">{fmtNum(r.users)}</td>
                        <td className="py-2.5 text-right mono">${r.price}</td>
                        <td className="py-2.5 text-right mono font-semibold">{fmt(r.rev)}</td>
                      </tr>
                    ))}
                    <tr className="font-bold">
                      <td className="py-3">Total</td>
                      <td className="py-3 text-right">10,000</td>
                      <td className="py-3 text-right mono">avg ${(distMode === 'conservative' ? tenKCon.totalMRR/10000 : tenKOpt.totalMRR/10000).toFixed(1)}</td>
                      <td className="py-3 text-right mono">{fmt(distMode === 'conservative' ? tenKCon.totalMRR : tenKOpt.totalMRR)} MRR</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 rounded-xl bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-widest opacity-70">Total ARR (Full-Paid)</div>
                  <div className="text-[20px] font-bold mono">{fmt(distMode === 'conservative' ? tenKCon.totalARR : tenKOpt.totalARR)}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] opacity-70">Payback & Margin</div>
                  <div className="text-[12px] font-medium">&lt;2 mo • 78% GM</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[22px] border border-slate-200 bg-white p-6 shadow-[var(--shadow-soft)]">
                <h4 className="font-semibold text-[14px]">Realistic Activation Model • 10k Registered</h4>
                <p className="mt-2 text-[12.5px] leading-5 text-slate-500">Only 32-40% pay in months 1-3. Africa open market needs social trials. Use this for pre-seed narrative.</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                    <div className="text-[11px] uppercase tracking-wide text-slate-400">Conservative</div>
                    <div className="text-[14px] font-bold mt-1">Avg $30 • $300k MRR</div>
                    <div className="text-[11px] text-slate-500">$3.6M ARR • 10k users</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                    <div className="text-[11px] uppercase tracking-wide text-slate-400">Blended $40</div>
                    <div className="text-[14px] font-bold mt-1">$400k MRR • $4.8M ARR</div>
                    <div className="text-[11px] text-slate-500">If full activation</div>
                  </div>
                </div>
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[12px] text-amber-900">
                  <span className="font-semibold">Investor Note:</span> For pre-launch deck, pitch $300k MRR conservative, but show upside $586k MRR ($58.6 ARPU) at full conversion. Difference = activation roadmap.
                </div>
              </div>

              <div className="rounded-[22px] bg-slate-900 text-white p-6">
                <div className="text-[11px] uppercase tracking-widest opacity-60">Pre-Launch Assumptions</div>
                <ul className="mt-3 space-y-2 text-[13px] leading-5 opacity-90">
                  <li>• 10k users Jan = WhatsApp + IG waitlist, M-Pesa onboarding</li>
                  <li>• CAC $50 (25% lower than market avg $67), LTV $2000</li>
                  <li>• Churn 7% → 4% after PMF, local voice mesh reduces cost</li>
                  <li>• Gross Margin 78% (image) → 85% at scale</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SCENARIO B - 100k */}
      <section id="scenario100" className="mx-auto max-w-[1240px] px-5 md:px-8 py-12 md:py-16">
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <span className="rounded-full bg-slate-900 text-white px-3 py-1 text-[11px] font-semibold tracking-widest uppercase">Scenario B</span>
          <h2 className="text-[26px] md:text-[32px] leading-none tracking-tight">100k Users • Scale in 12 Months</h2>
          <div className="flex rounded-full border border-slate-200 p-1 bg-slate-50 ml-auto">
            <button onClick={() => setScenarioBMode('realistic')} className={`px-4 py-1.5 rounded-full text-[12px] font-semibold ${scenarioBMode === 'realistic' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>Realistic $1.44M ARR</button>
            <button onClick={() => setScenarioBMode('growth')} className={`px-4 py-1.5 rounded-full text-[12px] font-semibold ${scenarioBMode === 'growth' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>Growth $14M-$70M ARR</button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
          <div className="rounded-[24px] border border-slate-200 bg-white p-2 shadow-[var(--shadow-card)]">
            <img src={growthUrl} alt="100k Users MRR $120k ARR $1.44M Business Growth Chart" className="w-full rounded-[18px] object-cover bg-white" />
            <div className="p-5">
              <div className="flex gap-2 flex-wrap">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium">MRR $120k • ARR $1.44M</span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium">USER BASE 100k • 700% Growth</span>
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[11px] font-semibold text-emerald-700">Gross Margin 85% • LTV:CAC 40:1</span>
              </div>
              <p className="mt-3 text-[13px] leading-6 text-slate-600">Adapted from Afri Cloud model but tuned for AiKOVA voice-first MSMEs. Original image shows East & West Africa footprint, 700% revenue growth, CAC $50, Churn 4%. This is the centerpiece for pre-seed.</p>
            </div>
          </div>

          <div className="space-y-4">
            {scenarioBMode === 'realistic' ? (
              <div className="rounded-[22px] border border-slate-200 bg-[#F8FAFC] p-6">
                <h4 className="font-semibold">Realistic Model • Matches Image ($12 blended)</h4>
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between text-[13px]"><span className="text-slate-500">Total Users</span><span className="font-semibold mono">100,000</span></div>
                  <div className="flex justify-between text-[13px]"><span className="text-slate-500">Paying (32%)</span><span className="font-semibold mono">32,000</span></div>
                  <div className="flex justify-between text-[13px]"><span className="text-slate-500">Avg per paying / mo</span><span className="font-semibold mono">$37.5</span></div>
                  <div className="h-px bg-slate-200" />
                  <div className="flex justify-between text-[14px] font-bold"><span>MRR</span><span className="mono">{fmt(realistic100k.mrr)}</span></div>
                  <div className="flex justify-between text-[14px] font-bold"><span>ARR</span><span className="mono">{fmt(realistic100k.arr)}</span></div>
                  <div className="flex justify-between text-[12px] text-slate-500"><span>Blended per total user</span><span className="mono">$1.2/mo • $14.4/yr</span></div>
                </div>
                <div className="mt-5 rounded-xl bg-white border border-slate-200 p-3 text-[12px] leading-5 text-slate-600">
                  Why $1.2 not $25? Freemium + social trials, 68% free tier driving virality, activation funnel 60 days. Matches $1.44M ARR target in growth chart. Gross Margin 85% because COGS per minute low, free users limited to 100 mins.
                </div>
              </div>
            ) : (
              <div className="rounded-[22px] border border-slate-900 bg-slate-900 text-white p-6">
                <h4 className="font-semibold text-white">Growth Model • Full Paid Activation</h4>
                <div className="mt-4 space-y-2 text-[13px]">
                  <div className="flex justify-between"><span className="opacity-70">Conservative 60/30/10</span><span className="font-semibold mono">{fmt(hundredKCon.totalMRR)} MRR • {fmt(hundredKCon.totalARR)} ARR</span></div>
                  <div className="flex justify-between"><span className="opacity-70">Optimistic 50/35/15</span><span className="font-semibold mono">{fmt(hundredKOpt.totalMRR)} MRR • {fmt(hundredKOpt.totalARR)} ARR</span></div>
                  <div className="h-px bg-white/10 my-3" />
                  <div className="flex justify-between text-[12px]"><span className="opacity-60">Avg ARPU</span><span className="mono">${(hundredKCon.totalMRR/100000).toFixed(1)} - ${(hundredKOpt.totalMRR/100000).toFixed(1)}</span></div>
                  <div className="flex justify-between text-[12px]"><span className="opacity-60">Blended Annual</span><span className="mono">$703 - $844 per user</span></div>
                </div>
                <div className="mt-4 rounded-xl bg-white/10 p-3 text-[11.5px] leading-5">
                  For Seed deck, show realistic $1.44M ARR now, with path to $14.4M ARR (if $12/mo avg across 100k) or $70M ARR (full paid). Africa pricing power allows this 10x upside as churn drops 7% → 4%.
                </div>
              </div>
            )}

            <div className="rounded-[22px] border border-slate-200 bg-white p-5">
              <h4 className="text-[13px] font-semibold tracking-wide uppercase text-slate-500">Unit Economics at 100k</h4>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {[
                  { k: 'CAC', v: '$50', d: '25% lower than market' },
                  { k: 'LTV', v: '$2000', d: '40 months avg' },
                  { k: 'LTV:CAC', v: '40:1', d: 'Top quartile AI SaaS' },
                  { k: 'Payback', v: '<2 mo', d: 'At $79 tier' },
                ].map(i => (
                  <div key={i.k} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div className="text-[11px] tracking-widest uppercase text-slate-400">{i.k}</div>
                    <div className="text-[15px] font-bold">{i.v}</div>
                    <div className="text-[11px] text-slate-500">{i.d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UNIT ECONOMICS DEEP DIVE */}
      <section className="bg-[#F8FAFC] border-y border-slate-100">
        <div className="mx-auto max-w-[1240px] px-5 md:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 rounded-[22px] border border-slate-200 bg-white p-6 shadow-[var(--shadow-soft)]">
              <h3 className="font-semibold text-[16px]">COGS Breakdown • 80% Margin</h3>
              <div className="mt-5 grid grid-cols-5 gap-2 text-[11px]">
                <div className="col-span-2 text-slate-400 uppercase tracking-widest font-semibold">Component</div>
                <div className="text-right text-slate-400 uppercase tracking-widest font-semibold">Cost/min</div>
                <div className="text-right text-slate-400 uppercase tracking-widest font-semibold">% COGS</div>
                <div className="text-right text-slate-400 uppercase tracking-widest font-semibold">Sale</div>
              </div>
              {[
                { c: 'Africa’s Talking Voice', cost: 0.02, pct: 40 },
                { c: 'Whisper STT', cost: 0.006, pct: 12 },
                { c: 'TTS (ElevenLabs)', cost: 0.015, pct: 30 },
                { c: 'LLM tokens (GPT-4o mini)', cost: 0.01, pct: 20, per: '/conv' },
                { c: 'Infra (Fly.io + Supabase)', cost: 0.005, pct: 10 },
              ].map(row => (
                <div key={row.c} className="grid grid-cols-5 gap-2 py-2.5 border-b border-slate-50 text-[13px]">
                  <div className="col-span-2">{row.c}</div>
                  <div className="text-right mono">${row.cost.toFixed(3)}{row.per || ''}</div>
                  <div className="text-right text-slate-500">{row.pct}%</div>
                  <div className="text-right mono">$0.25/min</div>
                </div>
              ))}
              <div className="mt-4 flex gap-3">
                <div className="flex-1 rounded-xl gradient-accent p-[1px]">
                  <div className="rounded-[11px] bg-white px-4 py-3 flex justify-between items-center">
                    <span className="text-[13px] font-semibold">Total COGS</span><span className="mono font-bold">~$0.051/min</span>
                  </div>
                </div>
                <div className="flex-1 rounded-xl bg-slate-900 px-4 py-3 flex justify-between items-center text-white">
                  <span className="text-[13px] font-semibold">Gross Margin</span><span className="mono font-bold">78-85%</span>
                </div>
              </div>
            </div>

            <div className="rounded-[22px] border border-slate-200 bg-white p-6 shadow-[var(--shadow-soft)]">
              <h4 className="font-semibold text-[14px]">SaaS Metrics • 100k Target</h4>
              <div className="mt-4 space-y-3">
                {[
                  { label: 'Churn', value: '4%', trend: '↓ from 7% at 10k', color: 'emerald' },
                  { label: 'Gross Margin', value: '85%', trend: '78% at 10k → 85% at 100k', color: 'blue' },
                  { label: 'LTV:CAC', value: '40:1', trend: 'Market avg 5:1', color: 'violet' },
                  { label: 'Revenue Growth', value: '700%', trend: 'Jan-Dec 12mo', color: 'amber' },
                ].map(m => (
                  <div key={m.label} className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-100 px-3 py-2.5">
                    <div>
                      <div className="text-[11px] uppercase tracking-wide text-slate-400">{m.label}</div>
                      <div className="text-[13px] font-semibold">{m.value}</div>
                    </div>
                    <div className="text-[11px] text-slate-500 text-right max-w-[120px]">{m.trend}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl bg-slate-900 text-white px-3 py-2.5 text-[11.5px]">
                East & West Africa footprint • Social-to-Sale • Mobile-first
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12-MONTH FORECAST */}
      <section className="mx-auto max-w-[1240px] px-5 md:px-8 py-12 md:py-16">
        <div className="flex flex-wrap justify-between gap-4 items-end mb-8">
          <div>
            <span className="rounded-full bg-slate-900 text-white px-3 py-1 text-[11px] font-semibold tracking-widest uppercase">12-Month Forecast</span>
            <h2 className="mt-3 text-[28px] md:text-[32px] leading-none">10k → 100k • $12k → $120k MRR</h2>
          </div>
          <div className="text-[12px] text-slate-500">Key Growth 10k → 100k in 12 months • ARR $1.44M</div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white shadow-[var(--shadow-soft)] p-5 md:p-7 overflow-x-auto">
          <div className="min-w-[720px]">
            <div className="flex items-end gap-[6px] h-[220px] border-b border-slate-100 pb-2">
              {forecast.map(f => {
                const h = (f.mrr / maxMRR) * 180 + 20;
                return (
                  <div key={f.m} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="relative w-full flex justify-center" style={{ height: `${h}px` }}>
                      <div className={`w-full max-w-[48px] rounded-t-[10px] transition-all ${f.highlight ? 'gradient-accent shadow-[0_8px_20px_-6px_rgba(41,98,255,0.5)]' : 'bg-slate-900 group-hover:bg-slate-800'}`} style={{ height: '100%' }}>
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 text-white px-2 py-1 text-[10px] mono whitespace-nowrap transition"> {fmt(f.mrr)} • {fmtNum(f.users)} </div>
                      </div>
                    </div>
                    <div className="text-[11px] font-semibold text-slate-600">{f.m}</div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-2">
              {forecast.map(f => (
                <div key={f.m} className={`rounded-xl border px-2.5 py-2 ${f.m === 'Dec' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-100 bg-slate-50'}`}>
                  <div className="text-[10px] uppercase tracking-wide opacity-70">{f.m}</div>
                  <div className="text-[12px] font-bold mono">{fmtNum(f.users)}</div>
                  <div className="text-[11px] mono opacity-80">{fmt(f.mrr)}</div>
                  {f.arr && <div className="text-[10px] font-semibold mt-1">ARR {fmt(f.arr)}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="rounded-[16px] border border-slate-200 bg-white p-4">
            <div className="text-[11px] uppercase tracking-widest font-semibold text-slate-400">Jan • Pre-launch</div>
            <div className="mt-1 font-semibold">10k users • $12k MRR • $144k ARR</div>
            <div className="text-[12px] text-slate-500 mt-1">Waitlist + IG ads, 32% paying, CAC $50</div>
          </div>
          <div className="rounded-[16px] border border-slate-200 bg-white p-4">
            <div className="text-[11px] uppercase tracking-widest font-semibold text-slate-400">Jun • Product-Market Fit</div>
            <div className="mt-1 font-semibold">45k users • $58k MRR</div>
            <div className="text-[12px] text-slate-500 mt-1">Voice mesh live, churn 7% → 5%, LTV:CAC 30:1</div>
          </div>
          <div className="rounded-[16px] border border-emerald-200 bg-emerald-50 p-4">
            <div className="text-[11px] uppercase tracking-widest font-semibold text-emerald-700">Dec • Scale</div>
            <div className="mt-1 font-semibold text-emerald-900">100k users • $120k MRR • $1.44M ARR • 700% growth</div>
            <div className="text-[12px] text-emerald-700 mt-1">Seed-ready, 85% GM, 4% churn</div>
          </div>
        </div>
      </section>

      {/* PRE-SEED VALUATION */}
      <section id="valuation" className="bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 gradient-accent blur-[80px] -z-0" style={{ transform: 'translateY(-30%)' }} />
        <div className="relative mx-auto max-w-[1240px] px-5 md:px-8 py-14 md:py-20">
          <div className="flex flex-wrap gap-3 items-center mb-8">
            <span className="rounded-full bg-white/10 border border-white/20 px-3 py-1 text-[11px] font-semibold tracking-widest uppercase">Pre-Seed Valuation • After 12 Months</span>
            <h2 className="text-[28px] md:text-[40px] leading-[0.95] tracking-tight font-bold">From $5M cap to $12M-$18M Seed</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            {[
              {
                method: 'Method 1 • ARR Multiple',
                title: 'AI SaaS Africa high-growth',
                range: '8-12x ARR',
                calc: '$1.44M ARR → $11.5M - $17.3M',
                calc2: '$4.8M ARR (blended $40) → $38M - $57M',
                note: 'Benchmark: African AI SaaS 8-12x due to scarcity + growth. Use $1.44M realistic for Seed.'
              },
              {
                method: 'Method 2 • User Multiple',
                title: 'Per-user valuation',
                range: '$120 per user',
                calc: '100k × $120 = $12M',
                calc2: 'African SaaS $80-$150/user, social-first premium',
                note: 'Image reference: 100k user base valued at $12M. Aligns with ARR multiple.'
              },
              {
                method: 'Method 3 • Conservative Pre-Seed',
                title: 'Current raise → Seed re-price',
                range: 'Pre-traction cap $5M-$8M',
                calc: 'Raise $500k-$1.2M at $5M-$8M cap',
                calc2: 'After 12mo 100k → $12M-$18M Seed round',
                note: 'Target Seed $1.2M completed Sept 2024 style • Adapt to AiKOVA 2025 • Goal 250k users ARR $3.5M'
              },
            ].map(card => (
              <div key={card.method} className="rounded-[20px] bg-white/[0.06] border border-white/10 backdrop-blur p-6">
                <div className="text-[11px] uppercase tracking-widest opacity-60 font-semibold">{card.method}</div>
                <div className="mt-2 text-[15px] font-semibold">{card.title}</div>
                <div className="mt-3 inline-flex rounded-full bg-white text-slate-900 px-3 py-1 text-[12px] font-bold">{card.range}</div>
                <div className="mt-4 space-y-1.5">
                  <div className="text-[13px] font-semibold mono">{card.calc}</div>
                  <div className="text-[12px] opacity-70">{card.calc2}</div>
                </div>
                <div className="mt-4 rounded-xl bg-white/10 border border-white/10 px-3 py-2.5 text-[11.5px] leading-5 opacity-80">{card.note}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid md:grid-cols-[1.2fr_0.8fr] gap-5">
            <div className="rounded-[20px] bg-white text-slate-900 p-6">
              <h4 className="font-semibold">Seed Round Target • After 12 Months 100k</h4>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                  <div className="text-[11px] uppercase tracking-wide text-slate-400">Valuation</div>
                  <div className="font-bold">$12M-$18M</div>
                  <div className="text-[11px] text-slate-500">Post 100k users, $1.44M ARR</div>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                  <div className="text-[11px] uppercase tracking-wide text-slate-400">Seed Raise</div>
                  <div className="font-bold">$1.2M-$2M</div>
                  <div className="text-[11px] text-slate-500">18-24mo runway to 250k users</div>
                </div>
                <div className="rounded-xl bg-slate-900 text-white p-3 col-span-2">
                  <div className="text-[11px] uppercase tracking-wide opacity-60">Goal 2025</div>
                  <div className="font-semibold mt-1">250k Users Target • ARR $3.5M • Strategy Product-Led Growth, Partnerships, Mobile-First</div>
                </div>
              </div>
            </div>
            <div className="rounded-[20px] border border-white/15 bg-white/5 p-6">
              <h4 className="font-semibold text-[14px]">Use of Funds • Pre-Seed $500k-$1.2M</h4>
              <div className="mt-4 space-y-3">
                {[
                  { label: 'Product & Engineering', pct: 40, desc: 'Local Voice Mesh, Social-to-Sale, AI Receptionist' },
                  { label: 'Growth & Marketing', pct: 30, desc: 'IG/WhatsApp ads, influencer, East/West Africa' },
                  { label: 'Africa Ops', pct: 20, desc: 'Africa’s Talking, Flutterwave, Paystack, M-Pesa' },
                  { label: 'Legal & Compliance', pct: 10, desc: 'NDPR, data residency, telco licensing' },
                ].map(f => (
                  <div key={f.label} className="flex gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white text-slate-900 flex items-center justify-center font-bold text-[12px]">{f.pct}%</div>
                    <div>
                      <div className="text-[13px] font-semibold">{f.label}</div>
                      <div className="text-[11.5px] opacity-70">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SUMMARY */}
      <section className="mx-auto max-w-[1240px] px-5 md:px-8 py-12 md:py-16">
        <div className="flex items-center gap-3 mb-6">
          <span className="rounded-full bg-slate-900 text-white px-3 py-1 text-[11px] font-semibold tracking-widest uppercase">Summary • 2028 Projection</span>
          <h2 className="text-[22px] font-bold tracking-tight">Investor Snapshot</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { k: '2028 Total ARR', v: '$2.05M', sub: 'From reference image • AiKOVA path to $14M+ with 100k', ref: 'CAGR 90.2% from projection' },
            { k: 'Gross Margin', v: '78% → 85%', sub: 'At 10k → 100k, COGS $0.05/min', ref: 'Selling $0.25/min' },
            { k: 'Customers Target', v: '2,000+ paying', sub: '32k paying of 100k total, SMBs in open market', ref: '700% revenue growth' },
            { k: 'Valuation Uplift', v: '2.4x in 12mo', sub: '$5M cap pre-traction → $12M-$18M Seed', ref: 'LTV:CAC 40:1 validates' },
          ].map(c => (
            <div key={c.k} className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-[var(--shadow-soft)]">
              <div className="text-[11px] uppercase tracking-widest font-semibold text-slate-400">{c.k}</div>
              <div className="mt-2 text-[20px] font-bold tracking-tight">{c.v}</div>
              <div className="mt-1 text-[12px] text-slate-600 leading-5">{c.sub}</div>
              <div className="mt-3 inline-flex rounded-full bg-slate-50 border border-slate-200 px-2.5 py-1 text-[10px] font-medium text-slate-500">{c.ref}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[20px] border border-slate-200 bg-[#F8FAFC] p-4 flex flex-col md:flex-row gap-4 items-center">
          <img src={projectionUrl} alt="Financial projection 2024-2028 table" className="w-full md:w-[420px] rounded-xl border border-slate-200 bg-white object-cover" />
          <div className="flex-1 text-[13px] leading-6 text-slate-600">
            <div className="font-semibold text-slate-900">Reference Projection 2024-2028 • ARR 0.15M to 2.05M • CAGR 90.2%</div>
            <p className="mt-1">Original financial table shows pricing tiers $25 $79 $199, revenue projection table, ARR forecast $0.15M to $2.05M, CAGR 90.2%, Gross Margin 78%. For AiKOVA with 100k users, realistic model is $1.44M ARR (conservative freemium), growth model $14M-$48M ARR if full paid conversion. Investor deck should anchor on $1.44M ARR and show upside path.</p>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-[1240px] px-5 md:px-8 py-10">
          <div className="rounded-[24px] bg-slate-900 text-white p-7 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full gradient-accent blur-[60px] opacity-40" />
            <div className="relative">
              <div className="flex items-center gap-3">
                <img src={logoUrl} alt="AiKOVA" className="h-8 w-8 rounded-lg" />
                <span className="font-bold tracking-tight">AiKOVA</span>
                <span className="rounded-full bg-white/10 border border-white/20 px-2.5 py-0.5 text-[10px] tracking-widest uppercase">AI Receptionist</span>
              </div>
              <h3 className="mt-4 text-[22px] md:text-[28px] leading-[0.95] font-bold tracking-tight max-w-[520px]">Invest in AiKOVA — Building for Africa's uncategorized market</h3>
              <p className="mt-2 text-[13px] opacity-70 max-w-[520px]">Social-first, plug-and-play, local payments. 10k → 100k users in 12 months, $1.44M ARR realistic, $14M-$70M upside, 85% GM, 40:1 LTV:CAC, 4% churn.</p>
            </div>
            <div className="relative flex flex-col gap-2.5">
              <a href="#pricing" className="rounded-full bg-white text-slate-900 px-6 py-3 text-[13px] font-bold text-center hover:bg-slate-100 transition">View Pricing & Models</a>
              <div className="text-[11px] opacity-60 text-center">Pre-Seed $500k-$1.2M at $5M-$8M cap • Seed $12M-$18M after 100k</div>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap justify-between gap-2 text-[11px] text-slate-400">
            <span>© AiKOVA 2025 • Ai Receptionist for Africa • M-Pesa • Flutterwave • Paystack • Africa's Talking</span>
            <span>Business Plan Revenue Artefact • Pre-Launch 10k vs 100k • Pre-Seed Valuation 12 Months</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
