import { useEffect, useRef, useState } from 'react';
import logoUrl from './assets/32d4f05ae5209978-image_6A9BA612-7186-480D-9D5C-7EF8BE2260B7.jpeg';
import connectImg from './assets/a501c1d2588177ef-image_20261029_180459.webp';
import brainImg from './assets/f374648e1dde6765-image_20261029_180501.webp';
import adeolaImg from './assets/3d41e02dd105029a-image_20261029_180508.webp';
import socialImg from './assets/a2fb444cfe57d066-image_20261029_180520.webp';

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
        }
      });
    }, { threshold: 0.15 });
    const children = el.querySelectorAll('.reveal, .reveal-left, .reveal-right, .drop');
    children.forEach(c => obs.observe(c));
    // also observe self if has class
    if (el.classList.contains('reveal') || el.classList.contains('drop')) obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const icons = {
  link: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
  ),
  clock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
  ),
  check: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l5 5L20 7"/></svg>
  )
};

export default function HowItWorksPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const heroReveal = useReveal();
  const step1Reveal = useReveal();
  const step2Reveal = useReveal();
  const step3Reveal = useReveal();
  const step4Reveal = useReveal();
  const journeyReveal = useReveal();
  const compareReveal = useReveal();

  return (
    <div data-safe-area-inset-root className="min-h-screen bg-white overflow-x-clip" style={{ boxSizing: 'border-box', paddingTop: 'var(--safe-area-inset-top)' }}>
      {/* NAV */}
      <header data-safe-area-sticky-top className="sticky z-50 backdrop-blur-xl border-b border-slate-200/70 bg-white/85" style={{ top: 'var(--safe-area-inset-top)' }}>
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-10">
            <a href="/" className="flex items-center gap-2.5">
              <img src={logoUrl} alt="AiKOVA" className="h-9 w-9 rounded-xl object-cover shadow-sm" />
              <span className="font-bold text-[19px] tracking-tight text-slate-900">AiKOVA</span>
              <span className="hidden sm:inline-flex ml-2 text-[10px] font-bold tracking-[0.14em] uppercase bg-slate-900 text-white px-2 py-0.5 rounded-full">AI Receptionist</span>
            </a>
            <nav className="hidden lg:flex items-center gap-7 text-[14px] font-medium text-slate-600">
              <a href="/features" className="hover:text-slate-900 transition">Features</a>
              <a href="/solutions" className="hover:text-slate-900 transition">Solutions</a>
              <a href="/languages" className="hover:text-slate-900 transition">Languages</a>
              <a href="/how-it-works" className="text-slate-900 font-semibold relative">How It Works<span className="absolute -bottom-1 left-0 w-full h-[3px] gradient-road rounded-full"></span></a>
              <a href="/pricing" className="hover:text-slate-900 transition">Pricing</a>
              <a href="/business" className="hover:text-slate-900 transition">Demo</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <a href="/get-started" className="hidden md:inline-flex text-[14px] font-semibold text-slate-700 hover:text-slate-900 px-4 py-2">Sign in</a>
            <a href="/get-started" className="inline-flex items-center justify-center rounded-full text-white font-semibold text-[14px] px-5 py-2.5 shadow-[0_8px_20px_rgba(41,98,255,0.25)] gradient-road hover:opacity-95 transition">Start Free Trial</a>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden w-9 h-9 rounded-full border border-slate-200 grid place-items-center">
              <div className="space-y-1"><div className="w-4 h-0.5 bg-slate-800"/><div className="w-4 h-0.5 bg-slate-800"/><div className="w-4 h-0.5 bg-slate-800"/></div>
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-6 py-5 flex flex-col gap-4 text-[15px] font-medium">
            <a href="/features">Features</a><a href="/solutions">Solutions</a><a href="/languages">Languages</a><a className="font-bold" href="/how-it-works">How It Works</a><a href="/pricing">Pricing</a><a href="/business">Demo</a>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative gradient-mesh overflow-hidden">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8 pt-16 lg:pt-28 pb-14 lg:pb-20">
          <div ref={heroReveal as any} className="grid">
            <div className="max-w-[760px]">
              <div className="drop inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[11px] font-bold tracking-[0.12em] uppercase text-slate-600 shadow-sm">
                <span className="w-2 h-2 rounded-full gradient-road animate-pulse" />
                How It Works • Live in 10 Minutes
              </div>
              <h1 className="reveal mt-6 text-[40px] lg:text-[64px] leading-[0.95] font-[700] tracking-tight text-slate-900">
                Connect. Train. <span className="gradient-text">Go Live.</span><br />
                Never miss a customer again.
              </h1>
              <p className="reveal mt-6 text-[18px] lg:text-[19px] leading-relaxed text-slate-500 max-w-[560px]" style={{ transitionDelay: '120ms' }}>
                Africa's businesses are uncategorized, random. AiKOVA adapts in <span className="font-semibold text-slate-800">3 steps, not 3 weeks.</span> No engineers. No code. Just your business, live.
              </p>
            </div>

            {/* Road */}
            <div className="reveal mt-14 lg:mt-20 relative" style={{ transitionDelay: '200ms' }}>
              <div className="absolute top-[34px] left-0 right-0 h-[6px] hidden lg:block rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full w-full gradient-road" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {[
                  { n: '01', title: 'Connect', desc: 'Website, Google Profile, Docs, Calendar & Socials in 2 mins', dot: '#00E5FF' },
                  { n: '02', title: 'Train Brain', desc: 'RAG ingests, chunks & embeds — localized for African regulations', dot: '#2962FF' },
                  { n: '03', title: 'Go Live', desc: '24/7 AI answers, books & sells — accent-matched in 3 seconds', dot: '#76FF03' },
                ].map((s, i) => (
                  <div key={s.n} className="drop relative bg-white rounded-[20px] border border-slate-200 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]" style={{ transitionDelay: `${i*120}ms` }}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full grid place-items-center text-white font-bold text-[15px] shadow-lg" style={{ background: `linear-gradient(135deg, ${s.dot}, #2962FF)` }}>{s.n}</div>
                      <h3 className="text-[18px] font-semibold">{s.title}</h3>
                    </div>
                    <p className="mt-3 text-[14px] leading-relaxed text-slate-500">{s.desc}</p>
                    <div className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-slate-700">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white grid place-items-center">{icons.check}</span> {i === 0 ? '2 min setup' : i === 1 ? 'Auto-training' : 'Instant live'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STEP 1 */}
      <section className="bg-[#F8FAFC] border-y border-slate-200/60">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-16 lg:py-28">
          <div ref={step1Reveal as any} className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-center">
            <div className="reveal-left order-2 lg:order-1">
              <div className="relative rounded-[28px] bg-white border border-slate-200 p-3 shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
                <div className="rounded-[18px] overflow-hidden bg-slate-50 border border-slate-100">
                  <img src={connectImg} alt="Connect dashboard integrations" className="w-full h-auto object-cover" />
                </div>
                <div className="absolute -bottom-6 -right-6 hidden lg:flex items-center gap-3 rounded-2xl bg-slate-900 text-white px-4 py-3 shadow-xl">
                  <div className="w-8 h-8 rounded-full bg-white/15 grid place-items-center">{icons.link}</div>
                  <div><div className="text-[12px] opacity-70">Connections</div><div className="text-[14px] font-semibold">5 sources linked</div></div>
                </div>
              </div>
            </div>
            <div className="reveal-right order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.14em] uppercase text-[#2962FF]">
                <span className="w-7 h-[3px] rounded-full gradient-road" /> Step 1 • 2 Minutes
              </div>
              <h2 className="mt-4 text-[34px] lg:text-[44px] leading-[0.95]">1. Connect Your Business</h2>
              <p className="mt-4 text-[16px] leading-relaxed text-slate-500">Paste, import, upload — AiKOVA maps your business automatically. No CSV wrangling, no developer tickets.</p>

              <div className="mt-8 grid gap-3">
                {[
                  { t: 'Paste website URL', d: 'Auto-scrape services, pricing & FAQs' },
                  { t: 'Import Google Business Profile', d: 'Hours, location, reviews & photos' },
                  { t: 'Upload docs / FAQs', d: 'PDF, DOCX, Sheets — up to 10k docs' },
                  { t: 'Connect calendar', d: 'Google Calendar & Outlook for bookings' },
                  { t: 'Connect WhatsApp / IG / FB', d: 'Social DMs become bookings & sales' },
                ].map(item => (
                  <div key={item.t} className="flex gap-3.5 rounded-2xl bg-white border border-slate-200 p-4">
                    <div className="mt-0.5 w-6 h-6 rounded-full bg-slate-900 text-white grid place-items-center shrink-0">{icons.check}</div>
                    <div><div className="text-[14px] font-semibold text-slate-900">{item.t}</div><div className="text-[13px] text-slate-500 mt-0.5">{item.d}</div></div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-3 rounded-full bg-white border border-slate-200 px-4 py-2.5 w-fit shadow-sm">
                <span className="w-7 h-7 rounded-full gradient-road grid place-items-center text-white">{icons.clock}</span>
                <span className="text-[13px] font-semibold text-slate-700">Time: 2 mins • No code • No credit card</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STEP 2 */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-16 lg:py-28">
          <div ref={step2Reveal as any}>
            <div className="reveal max-w-[760px] mx-auto text-center">
              <div className="inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.14em] uppercase text-[#2962FF] justify-center">
                <span className="w-7 h-[3px] rounded-full gradient-road" /> Step 2 • Brain Training
              </div>
              <h2 className="mt-4 text-[34px] lg:text-[48px] leading-[0.95]">2. Train Brain — RAG Pipeline Built for Africa</h2>
              <p className="mt-4 text-[16px] leading-relaxed text-slate-500">Your documents become an accurate, context-aware AI. Not a generic chatbot — a trained receptionist that knows Lagos import permits, Nairobi finance rules, Accra procurement, Johannesburg markets.</p>
            </div>

            <div className="drop mt-10 lg:mt-14 rounded-[28px] bg-white border border-slate-200 p-3 lg:p-4 shadow-[0_30px_90px_rgba(15,23,42,0.12)]">
              <div className="rounded-[18px] overflow-hidden border border-slate-100 bg-[#F8FAFC]">
                <img src={brainImg} alt="AiKOVA Brain Training RAG infographic" className="w-full h-auto" />
              </div>
            </div>

            {/* Pipeline */}
            <div className="reveal mt-10 grid grid-cols-1 lg:grid-cols-5 gap-3">
              {[
                { k: 'Ingestion', v: 'Lagos permit, Nairobi financial, Accra procurement, JHB market docs' },
                { k: 'Chunking & Embedding', v: 'Semantic split + vector embeddings' },
                { k: 'Vector DB', v: 'Qdrant — fast African latency' },
                { k: 'Neural Training', v: 'Fine-tuned for Pidgin, Swahili, Zulu accents' },
                { k: 'Accurate AI', v: 'Context-aware answers, not hallucinations' },
              ].map((p, idx) => (
                <div key={p.k} className="relative rounded-2xl bg-[#F8FAFC] border border-slate-200 p-4">
                  <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-slate-400">0{idx+1}</div>
                  <div className="mt-1 text-[14px] font-semibold text-slate-900">{p.k}</div>
                  <div className="mt-1.5 text-[12px] leading-relaxed text-slate-500">{p.v}</div>
                  {idx < 4 && <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-[3px] gradient-road rounded-full" />}
                </div>
              ))}
            </div>

            <div className="reveal mt-8 flex flex-wrap gap-3 justify-center">
              {[
                { label: 'Accurate', sub: 'RAG-grounded, no hallucinations' },
                { label: 'Real-Time', sub: 'Updates in < 60s' },
                { label: 'Scalable to 10k+ docs', sub: 'Enterprise-ready' },
                { label: 'Secure', sub: 'SOC2, NDPA compliant' },
              ].map(b => (
                <div key={b.label} className="inline-flex items-center gap-3 rounded-full bg-slate-900 text-white px-4 py-2.5 shadow">
                  <span className="w-6 h-6 rounded-full bg-white/15 grid place-items-center">{icons.check}</span>
                  <span className="text-[13px] font-semibold">{b.label}</span><span className="text-[12px] opacity-60">• {b.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STEP 3 */}
      <section className="bg-[#F8FAFC] border-y border-slate-200/60">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-16 lg:py-28">
          <div ref={step3Reveal as any} className="grid lg:grid-cols-[0.95fr_1.05fr] gap-10 lg:gap-16 items-center">
            <div className="reveal-left">
              <div className="rounded-[28px] bg-white border border-slate-200 p-3 shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
                <div className="rounded-[18px] overflow-hidden relative">
                  <img src={adeolaImg} alt="Adeola Enterprises happy customer on call" className="w-full h-auto object-cover aspect-[4/3]" />
                  <div className="absolute bottom-3 left-3 right-3 rounded-2xl bg-white/95 backdrop-blur border border-slate-200 p-3 flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 grid place-items-center text-white text-[12px] font-bold">A</div>
                      <div><div className="text-[13px] font-semibold">Adeola Enterprises</div><div className="text-[11px] text-slate-500">Live • Accent: Yoruba-English</div></div>
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
                  <div className="text-[28px] font-bold tracking-tight">70%</div>
                  <div className="text-[12px] text-slate-500 leading-snug mt-1">Missed calls saved — no more voicemail hell</div>
                </div>
                <div className="rounded-2xl bg-slate-900 text-white p-4 shadow">
                  <div className="text-[28px] font-bold tracking-tight">2x bookings</div>
                  <div className="text-[12px] opacity-70 leading-snug mt-1">More appointments, M-Pesa paid</div>
                </div>
              </div>
            </div>

            <div className="reveal-right">
              <div className="inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.14em] uppercase text-[#2962FF]">
                <span className="w-7 h-[3px] rounded-full gradient-road" /> Step 3 • Go Live
              </div>
              <h2 className="mt-4 text-[34px] lg:text-[44px] leading-[0.95]">3. Go Live — AI Answers 24/7</h2>
              <p className="mt-4 text-[16px] leading-relaxed text-slate-500">One click live. Your AI receptionist handles calls with accent-mirrored voice, detects emergencies, books directly to your calendar.</p>

              <div className="mt-8 rounded-[20px] bg-white border border-slate-200 p-2 shadow-sm">
                <div className="rounded-[14px] bg-[#F8FAFC] border border-slate-100 p-4 grid gap-2.5">
                  {[
                    { step: 'Inbound Call', det: 'Phone rings → AiKOVA picks in 2s' },
                    { step: 'Whisper STT • African accents', det: 'Fine-tuned for Naija, Kenyan, Ghanaian English' },
                    { step: 'Language / Accent Detect in 3 sec', det: 'Yoruba, Pidgin, Swahili, Zulu, Amharic' },
                    { step: 'Qdrant RAG → LLM → TTS', det: 'Mirrored accent response, natural' },
                    { step: 'Booking / Lead → CRM', det: 'Calendar + WhatsApp + HubSpot sync' },
                    { step: 'Emergency → Human handoff', det: 'Smart escalation, no bot loops' },
                  ].map((f, i) => (
                    <div key={f.step} className="flex gap-3 items-start">
                      <div className="w-7 h-7 rounded-full bg-slate-900 text-white grid place-items-center text-[11px] font-bold shrink-0 mt-0.5">{i+1}</div>
                      <div><div className="text-[13px] font-semibold text-slate-900">{f.step}</div><div className="text-[12px] text-slate-500">{f.det}</div></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3.5 py-2 shadow-sm text-[12px] font-semibold"><span className="w-2 h-2 rounded-full bg-emerald-500" /> 1 min setup, then live</div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-3.5 py-2 text-[12px] font-semibold">STT • LLM • TTS • RAG</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STEP 4 */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-16 lg:py-28">
          <div ref={step4Reveal as any}>
            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-center">
              <div className="reveal-left order-2 lg:order-1">
                <div className="rounded-[28px] bg-white border border-slate-200 p-3 shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
                  <div className="rounded-[18px] overflow-hidden bg-[#FFF7F0] border border-slate-100">
                    <img src={socialImg} alt="Social to sale flow beaded earrings" className="w-full h-auto object-cover" />
                  </div>
                </div>
              </div>
              <div className="reveal-right order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.14em] uppercase text-[#2962FF]">
                  <span className="w-7 h-[3px] rounded-full gradient-road" /> Step 4 • Social-to-Sale
                </div>
                <h2 className="mt-4 text-[34px] lg:text-[44px] leading-[0.95]">4. Instagram Comment to M-Pesa Paid</h2>
                <p className="mt-4 text-[16px] leading-relaxed text-slate-500">Built for how Africa actually sells. That “How much?” comment becomes a confirmed booking and payment — no manual DM.</p>

                <div className="mt-8 grid gap-3">
                  <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 grid place-items-center text-white text-[12px] font-bold">IG</div>
                    <div><div className="text-[13px] font-semibold">IG Comment “How much?”</div><div className="text-[12px] text-slate-500">Beaded earrings • KES 1200 • Auto-detected intent</div></div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 flex gap-3 shadow-sm">
                    <div className="w-9 h-9 rounded-full bg-[#25D366] grid place-items-center text-white font-bold text-[12px]">WA</div>
                    <div><div className="text-[13px] font-semibold">WhatsApp DM → Auto-reply with catalog</div><div className="text-[12px] text-slate-500">Price, sizes, delivery options, M-Pesa prompt</div></div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-900 text-white p-4 flex gap-3 shadow">
                    <div className="w-9 h-9 rounded-full bg-white/15 grid place-items-center">✓</div>
                    <div><div className="text-[13px] font-semibold">Booking Confirmed → M-Pesa Payment</div><div className="text-[12px] opacity-70">Paid • Receipt sent • Calendar blocked</div></div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-gradient-to-r from-[#00E5FF]/10 via-[#2962FF]/10 to-[#76FF03]/10 border border-slate-200 p-4">
                  <div className="text-[13px] font-semibold text-slate-900">Practical for African entrepreneurs</div>
                  <div className="text-[12px] text-slate-500 mt-1">No Shopify needed. Turn IG, TikTok, WhatsApp into a checkout — localized currency, M-Pesa, bank transfer, delivery notes.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FULL JOURNEY ROAD */}
      <section className="bg-[#F8FAFC] border-y border-slate-200/60">
        <div className="mx-auto max-w-[1080px] px-6 lg:px-8 py-16 lg:py-28">
          <div ref={journeyReveal as any}>
            <div className="reveal text-center max-w-[640px] mx-auto">
              <h2 className="text-[34px] lg:text-[46px] leading-[0.95]">Full Journey — One Road</h2>
              <p className="mt-4 text-[15px] text-slate-500">Slide-in on scroll. The infographic your investors will screenshot.</p>
            </div>

            <div className="mt-14 relative">
              {/* vertical line */}
              <div className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-[4px] lg:-ml-[2px] bg-slate-200 rounded-full overflow-hidden">
                <div className="w-full h-full gradient-road opacity-80" />
              </div>

              <div className="grid gap-10 lg:gap-14">
                {[
                  { title: 'Connect', desc: 'Link website, Google Business, docs, calendar, socials. 2 mins.', icon: '🔗', side: 'left' },
                  { title: 'Train', desc: 'RAG ingests African regulatory docs, chunks, embeds, neural fine-tune.', icon: '🧠', side: 'right' },
                  { title: 'Voice Mesh', desc: 'Whisper STT + accent detection in 3s + mirrored TTS. Emergency handoff.', icon: '🎙️', side: 'left' },
                  { title: 'Social Sale', desc: 'IG → WhatsApp → Booking → M-Pesa. Beaded earrings KES 1200 to paid.', icon: '💬', side: 'right' },
                  { title: 'Live + Analytics', desc: '70% missed calls saved, 2x bookings, dashboard with call transcripts & ROI.', icon: '📊', side: 'left' },
                ].map((stop, i) => (
                  <div key={stop.title} className={`relative flex ${stop.side === 'left' ? 'lg:justify-start' : 'lg:justify-end'} justify-start`}>
                    <div className={`reveal ${i % 2 === 0 ? 'reveal-left' : 'reveal-right'} w-[calc(100%-48px)] lg:w-[44%] rounded-[20px] bg-white border border-slate-200 p-6 shadow-[0_12px_32px_rgba(15,23,42,0.06)]`} style={{ transitionDelay: `${i*80}ms` }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full gradient-road grid place-items-center text-white shadow">{stop.icon}</div>
                        <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-slate-400">Stop 0{i+1}</div>
                      </div>
                      <div className="mt-3 text-[18px] font-semibold">{stop.title}</div>
                      <div className="mt-2 text-[13px] leading-relaxed text-slate-500">{stop.desc}</div>
                    </div>
                    {/* dot */}
                    <div className="absolute left-6 lg:left-1/2 top-8 w-4 h-4 -ml-[6px] lg:-ml-[8px] rounded-full bg-white border-4 border-slate-900 shadow" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-16 lg:py-28">
          <div ref={compareReveal as any}>
            <div className="reveal flex flex-wrap items-end justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.14em] uppercase text-slate-500"><span className="w-7 h-[3px] rounded-full bg-slate-900" /> Why 10 Mins vs Weeks</div>
                <h2 className="mt-4 text-[34px] lg:text-[46px] leading-[0.95] max-w-[520px]">Others need engineers. AiKOVA needs you.</h2>
              </div>
              <p className="text-[15px] text-slate-500 max-w-[360px]">Synthflow, Bland, Retell charge $30k/year and still need a dev team. AiKOVA is no-code, Africa’s Talking native, M-Pesa ready.</p>
            </div>

            <div className="reveal mt-10 grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-4">
              <div className="rounded-[20px] border border-slate-200 bg-[#F8FAFC] p-6">
                <div className="text-[13px] font-bold tracking-[0.12em] uppercase text-slate-400">Others</div>
                <div className="mt-4 grid gap-3">
                  {[
                    'Synthflow $30k/year + setup fees',
                    'Needs engineers for RAG, STT, TTS',
                    'US accents only, fails on Pidgin/Swahili',
                    'No WhatsApp / M-Pesa / IG native',
                    'Weeks to go live, ticket hell',
                  ].map(t => (
                    <div key={t} className="flex gap-2.5 text-[13px] text-slate-500"><span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 grid place-items-center text-[10px]">✕</span>{t}</div>
                  ))}
                </div>
              </div>
              <div className="rounded-[20px] border border-slate-900 bg-slate-900 text-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.25)] relative overflow-hidden">
                <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full gradient-road opacity-20 blur-2xl" />
                <div className="relative">
                  <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold tracking-[0.12em] uppercase">AiKOVA</div>
                  <div className="mt-4 grid gap-3">
                    {[
                      'No-code, 10 mins, no credit card',
                      'Africa’s Talking native — calls + SMS + USSD',
                      'African accents: Naija, Kenyan, Ghana, SA',
                      'WhatsApp, IG, FB, M-Pesa, Google Calendar built-in',
                      'RAG pipeline: accurate, secure, 10k+ docs',
                      'Live in 1 min, 70% missed calls saved',
                    ].map(t => (
                      <div key={t} className="flex gap-2.5 text-[13px]"><span className="w-5 h-5 rounded-full bg-white text-slate-900 grid place-items-center">{icons.check}</span>{t}</div>
                    ))}
                  </div>
                  <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white text-slate-900 px-4 py-2 text-[13px] font-semibold">Start Free Trial — Live in 10 mins</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="mx-auto max-w-[1280px] px-6 lg:px-8 pb-12">
        <div className="rounded-[32px] p-[1.5px] gradient-road shadow-[0_24px_80px_rgba(41,98,255,0.25)]">
          <div className="rounded-[30px] bg-white lg:bg-transparent lg:bg-gradient-to-r lg:from-white lg:to-[#F8FAFC] px-7 lg:px-12 py-10 lg:py-14 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div>
              <h2 className="text-[30px] lg:text-[42px] leading-[0.95] tracking-tight">Ready to go live in 10 mins?</h2>
              <p className="mt-3 text-[15px] text-slate-500 max-w-[460px]">Start free trial, no credit card. Adeola did — 70% fewer missed calls by tomorrow morning. Africa's Talking credits included.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="/get-started" className="inline-flex items-center justify-center rounded-full bg-slate-900 text-white px-7 py-3.5 text-[14px] font-semibold shadow-lg hover:bg-black transition">Start Now — Free</a>
              <a href="/business" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-7 py-3.5 text-[14px] font-semibold text-slate-800 hover:bg-slate-50 transition">▶ Watch 45s Demo</a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-[#F8FAFC]">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2.5">
                <img src={logoUrl} alt="AiKOVA" className="h-8 w-8 rounded-xl object-cover" />
                <span className="font-bold text-[18px]">AiKOVA</span>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-slate-500 max-w-[280px]">AI receptionist for Africa. Never miss a customer. Built on Africa's Talking, Qdrant, Whisper STT, mirrored TTS.</p>
              <div className="mt-4 text-[11px] text-slate-400">Page 5 of 11 • How It Works • White theme • Production ready</div>
            </div>
            <div><div className="text-[12px] font-bold tracking-[0.12em] uppercase text-slate-400">Product</div><div className="mt-3 grid gap-2 text-[13px] text-slate-600"><a href="/features">Features</a><a href="/how-it-works">How It Works</a><a href="/languages">Languages</a><a href="/pricing">Pricing</a></div></div>
            <div><div className="text-[12px] font-bold tracking-[0.12em] uppercase text-slate-400">Solutions</div><div className="mt-3 grid gap-2 text-[13px] text-slate-600"><a href="/solutions">Salons</a><a href="/solutions">Clinics</a><a href="/solutions">Real Estate</a><a href="/solutions">E-commerce</a></div></div>
            <div><div className="text-[12px] font-bold tracking-[0.12em] uppercase text-slate-400">Company</div><div className="mt-3 grid gap-2 text-[13px] text-slate-600"><a href="/company">About</a><a href="/resources">Blog</a><a href="/company">Careers</a><a href="/get-started">Contact</a></div></div>
          </div>
          <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 text-[12px] text-slate-400">
            <div>© 2026 AiKOVA Labs Ltd — Nairobi • Lagos • Accra • Johannesburg</div>
            <div className="flex gap-4"><a href="/get-started">Privacy</a><a href="/get-started">Terms</a><a href="/get-started">NDPA</a></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
