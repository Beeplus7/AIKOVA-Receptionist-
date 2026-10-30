import React, { useEffect, useRef, useState } from 'react';
import logoImg from './assets/32d4f05ae5209978-image_6A9BA612-7186-480D-9D5C-7EF8BE2260B7.jpeg';
import legalImg from './assets/04c0223ae111b1fe-image_20261029_185711.webp';
import demoImg from './assets/1e32f7d558a47b73-image_20261029_185712.webp';
import contactImg from './assets/ec2c74e49f8b0042-image_20261029_185716.webp';

// Intersection reveal hook
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
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    const children = el.querySelectorAll('.reveal');
    children.forEach(c => obs.observe(c));
    // also observe self if has reveal
    if (el.classList.contains('reveal')) obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

type ContactMsg = {
  fullName: string;
  email: string;
  helpType: string;
  message: string;
};

const sitemapPages = [
  { no: '01', path: '/home', title: 'Hero Home Page', desc: 'Torch, value prop, Africa-first hero', status: 'DONE' },
  { no: '02', path: '/features', title: 'Features', desc: 'Call handling, booking, multilingual', status: 'DONE' },
  { no: '03', path: '/solutions', title: 'Solutions With Images', desc: 'SMBs across 54 countries', status: 'DONE' },
  { no: '04', path: '/languages', title: 'Languages With Images', desc: '12+ languages, local dialects', status: 'DONE' },
  { no: '05', path: '/how-it-works', title: 'How It Works', desc: '3 steps: connect, train, go live', status: 'DONE' },
  { no: '06', path: '/pricing', title: 'Pricing', desc: 'Pay per call, scale for Africa', status: 'DONE' },
  { no: '07', path: '#live-demo', title: 'Demo (Live)', desc: 'This page — live AI receptionist', status: 'LIVE' },
  { no: '08', path: '/customers', title: 'Customers', desc: 'Lagos, Nairobi, Accra case studies', status: 'DONE' },
  { no: '09', path: '/resources', title: 'Resources', desc: 'Guides, API docs, community', status: 'DONE' },
  { no: '10', path: '/company', title: 'Company', desc: 'Mission, team, Pan-African vision', status: 'DONE' },
  { no: '11', path: '#contact', title: 'Legal / Contact', desc: 'Final — trust, legal, contact (you are here)', status: 'FINAL' },
];

export default function GetStartedPage() {
  const revealRef = useReveal();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [form, setForm] = useState<ContactMsg>({ fullName: '', email: '', helpType: 'General Inquiry', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [demoCalling, setDemoCalling] = useState(false);
  const [activeHelp, setActiveHelp] = useState('General Inquiry');

  // Load existing messages
  const reloadRecords = async () => {
    try {
      const res = await fetch('actions', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action: 'records.list', args: { collection: 'contact_messages', limit: 20 } })
      });
      const json = await res.json();
      if (json.data) setMessages(json.data.records || []);
    } catch {}
  };

  useEffect(() => { reloadRecords(); }, []);

  const createRow = async (row: ContactMsg) => {
    const idempotency_key = `contact-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const res = await fetch('actions', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'records.create', args: { collection: 'contact_messages', value: row, idempotency_key } })
    });
    const json = await res.json();
    if (!res.ok || json.error) throw new Error(json.error || 'Failed to save');
    return json.data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.message) {
      setSubmitResult({ type: 'error', msg: 'Please fill full name, email and message.' });
      return;
    }
    setSubmitting(true);
    setSubmitResult(null);
    let saved = 0;
    let error: string | null = null;
    try {
      for (const row of [form]) {
        await createRow({ ...row, helpType: activeHelp });
        saved += 1;
      }
    } catch (err: any) {
      error = err instanceof Error ? err.message : String(err);
    }
    try { await reloadRecords(); } catch {}
    setSubmitting(false);
    if (error) {
      setSubmitResult({ type: 'error', msg: error });
    } else {
      setSubmitResult({ type: 'success', msg: `Saved ${saved} message. Our Lagos/Nairobi/Accra team will reply within 2h. Built for 54 African countries.` });
      setForm({ fullName: '', email: '', helpType: 'General Inquiry', message: '' });
    }
  };

  const startDemo = () => {
    setDemoCalling(true);
    setTimeout(() => setDemoCalling(false), 3200);
  };

  return (
    <div
      data-safe-area-inset-root
      style={{ boxSizing: 'border-box', paddingTop: 'var(--safe-area-inset-top)', minHeight: '100vh', background: 'var(--bg)' }}
      className="overflow-x-clip"
    >
      {/* NAV */}
      <header
        data-safe-area-sticky-top
        style={{ top: 'var(--safe-area-inset-top)' }}
        className="sticky z-50 backdrop-blur-xl bg-white/80 border-b border-[var(--border)]"
      >
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8 h-[68px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="AiKOVA Logo" className="w-9 h-9 rounded-xl object-cover shadow-sm" />
            <div className="leading-tight">
              <div className="font-bold tracking-tight text-[15px]">AiKOVA</div>
              <div className="text-[11px] tracking-[0.12em] uppercase text-slate-500 font-semibold -mt-0.5">AI RECEPTIONIST</div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-7 text-[14px] font-medium text-slate-600">
            <a href="/features" className="hover:text-slate-900 transition">Features</a>
            <a href="/solutions" className="hover:text-slate-900 transition">Solutions</a>
            <a href="/languages" className="hover:text-slate-900 transition">Languages</a>
            <a href="/how-it-works" className="hover:text-slate-900 transition">How It Works</a>
            <a href="/pricing" className="hover:text-slate-900 transition">Pricing</a>
            <a href="#live-demo" className="text-slate-900 font-semibold border-b-2 border-slate-900 pb-0.5">Demo</a>
            <a href="#contact" className="hover:text-slate-900 transition">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <a href="#live-demo" className="hidden md:inline-flex gradient-btn text-white text-[13px] font-semibold px-5 h-9 rounded-full items-center">
              Start Live Demo
            </a>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="lg:hidden w-9 h-9 rounded-full border border-slate-200 grid place-items-center">
              <div className="space-y-1">
                <div className="w-4 h-0.5 bg-slate-800 rounded"></div>
                <div className="w-4 h-0.5 bg-slate-800 rounded"></div>
                <div className="w-4 h-0.5 bg-slate-800 rounded"></div>
              </div>
            </button>
          </div>
        </div>
        {mobileMenu && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-5 py-4 space-y-3 text-[14px] font-medium">
            <a href="/features" className="block">Features</a>
            <a href="/solutions" className="block">Solutions</a>
            <a href="/languages" className="block">Languages</a>
            <a href="/how-it-works" className="block">How It Works</a>
            <a href="/pricing" className="block">Pricing</a>
            <a href="#live-demo" className="block font-bold">Demo (active)</a>
            <a href="#contact" className="block">Contact</a>
          </div>
        )}
      </header>

      <main ref={revealRef as any} className="mx-auto max-w-[1280px] px-5 lg:px-8">
        {/* HERO FINAL */}
        <section className="pt-12 lg:pt-20 pb-12 lg:pb-16">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
            <div className="reveal">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-bold tracking-[0.12em] uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                No.11 Final • Demo + Trust
                <span className="ml-1 px-2 py-0.5 rounded-full text-white" style={{ background: 'var(--gradient-diagonal)' }}>FINAL</span>
              </div>
              <h1 className="mt-6 text-[38px] lg:text-[64px] leading-[0.95] tracking-[-0.03em] font-bold">
                Try AiKOVA live.<br />
                <span className="gradient-text">See Africa's trust.</span>
              </h1>
              <p className="mt-5 text-[17px] leading-relaxed text-slate-600 max-w-[560px]">
                Live demo call, contact our Lagos / Nairobi / Accra team, legal & trust built for 54 African countries. White theme constancy, torch of God.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#live-demo" onClick={(e)=>{e.preventDefault(); document.getElementById('live-demo')?.scrollIntoView({behavior:'smooth'})}} className="gradient-btn text-white font-semibold px-7 h-[46px] rounded-full inline-flex items-center gap-2">
                  <span>Start Live Demo</span>
                  <span className="w-5 h-5 rounded-full bg-white/20 grid place-items-center">↗</span>
                </a>
                <a href="#contact" className="h-[46px] px-7 rounded-full border border-slate-200 bg-white font-semibold inline-flex items-center hover:bg-slate-50 transition">
                  Talk to Founders
                </a>
              </div>

              <div className="mt-8 flex items-center gap-3 text-[12px] text-slate-500">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white grid place-items-center text-[10px] font-bold">AJ</div>
                  <div className="w-7 h-7 rounded-full bg-blue-100 border-2 border-white grid place-items-center text-[10px] font-bold">DO</div>
                  <div className="w-7 h-7 rounded-full bg-amber-100 border-2 border-white grid place-items-center text-[10px] font-bold">AM</div>
                </div>
                <span>Live support from Lagos • Nairobi • Accra • <span className="font-semibold text-slate-700">8am-6pm GMT+1 + 24/7 chat</span></span>
              </div>
            </div>

            <div className="reveal reveal-delay-1">
              <div className="relative rounded-[28px] bg-[var(--bg-alt)] border border-slate-200 p-3 shadow-[var(--shadow-card)]">
                <div className="rounded-[20px] overflow-hidden bg-white border border-slate-100">
                  <div className="h-10 flex items-center px-4 gap-1.5 border-b border-slate-100">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    <div className="ml-auto text-[11px] font-medium text-slate-400">aikova.africa/demo</div>
                  </div>
                  <img src={demoImg} alt="Kwame Osei Founder Nairobi Techworks AI Receptionist Live Demo" className="w-full aspect-[4/2.6] object-cover" />
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[12px] font-semibold">LIVE Connected • +1 555-0102</span>
                    </div>
                    <div className="text-[11px] px-2 py-1 rounded-full bg-slate-50 border border-slate-200 font-medium">Intent: Booking</div>
                  </div>
                </div>
                {/* floating badges */}
                <div className="absolute -right-2 top-14 hidden lg:flex flex-col gap-2">
                  <div className="bg-white shadow-[var(--shadow-card)] rounded-full px-3 py-1.5 text-[11px] font-semibold border border-slate-100 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 grid place-items-center">✓</span> Calendar Event Created
                  </div>
                  <div className="bg-white shadow-[var(--shadow-card)] rounded-full px-3 py-1.5 text-[11px] font-semibold border border-slate-100 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-blue-50 text-blue-600 grid place-items-center">↗</span> SMS Confirmation Sent
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LIVE DEMO SECTION */}
        <section id="live-demo" className="py-14 lg:py-20 border-t border-slate-100">
          <div className="reveal flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-slate-400">Live Demo • Africa First</div>
              <h2 className="mt-2 text-[32px] lg:text-[44px] leading-[0.95] font-bold">Live Demo — AI Receptionist in Action</h2>
            </div>
            <div className="flex items-center gap-2 text-[13px]">
              <span className="px-3 py-1 rounded-full bg-slate-900 text-white font-semibold">Kwame Osei</span>
              <span className="text-slate-500">Founder, Nairobi Techworks • Ankara blue bomber jacket • Demo driver</span>
            </div>
          </div>

          <div className="reveal reveal-delay-1 rounded-[24px] bg-white border border-slate-200 shadow-[var(--shadow-elevated)] overflow-hidden">
            <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-0">
              <div className="p-2 lg:p-3 bg-slate-50">
                <div className="rounded-[16px] overflow-hidden bg-white border border-slate-200 shadow-sm">
                  <img src={demoImg} alt="Kwame Osei Founder Nairobi Techworks AI Receptionist Live Demo laptop showing Incoming Call +1 555-0102 LIVE Connected" className="w-full object-cover" />
                </div>
              </div>
              <div className="p-6 lg:p-8 flex flex-col">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                    <img src={logoImg} className="w-full h-full object-cover" alt="logo" />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold">Kwame Osei • Live Session</div>
                    <div className="text-[11px] text-slate-500 -mt-0.5">Nairobi • Incoming Call +1 555-0102 LIVE Connected</div>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-bold tracking-widest uppercase text-emerald-600">LIVE</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    { k: 'Incoming Call', v: '+1 555-0102 • LIVE Connected', active: true },
                    { k: 'AI now handling', v: 'Intent Detected: Booking Appointment', active: false },
                    { k: 'Actions', v: 'Create Calendar Event + Send Confirmation SMS', active: false },
                    { k: 'Latency', v: 'Responding in 1.2s • 70% auto-handled', active: false },
                  ].map((item, i) => (
                    <div key={i} className={`rounded-2xl border p-4 flex gap-3 ${item.active ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200'}`}>
                      <div className={`w-8 h-8 rounded-full grid place-items-center text-[12px] font-bold shrink-0 ${item.active ? 'bg-white/15' : 'bg-slate-50 border border-slate-200'}`}>{i + 1}</div>
                      <div>
                        <div className={`text-[13px] font-semibold ${item.active ? 'text-white' : 'text-slate-900'}`}>{item.k}</div>
                        <div className={`text-[12px] mt-0.5 ${item.active ? 'text-white/70' : 'text-slate-500'}`}>{item.v}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl bg-[var(--bg-alt)] border border-slate-200 p-4">
                  <div className="text-[11px] font-bold tracking-widest uppercase text-slate-400">Live Phone To Call</div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-[18px] font-bold tracking-tight">+234 800 AIKOVA (245682)</div>
                    <button onClick={startDemo} className="gradient-btn text-white text-[12px] font-semibold px-4 h-8 rounded-full">
                      {demoCalling ? 'Calling...' : 'Call Now'}
                    </button>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <div className="flex-1 h-9 rounded-full bg-white border border-slate-200 flex items-center px-3 gap-2 text-[12px]">
                      <span className="w-5 h-5 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 grid place-items-center text-white text-[10px]">IG</span>
                      <span className="text-slate-600">@aikova.africa DM</span>
                    </div>
                    <div className="flex-1 h-9 rounded-full bg-white border border-slate-200 flex items-center px-3 gap-2 text-[12px]">
                      <span>💬</span>
                      <span className="text-slate-600">WhatsApp simulator</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-6 grid grid-cols-3 gap-3">
                  {[
                    { v: '1.2s', l: 'Avg response' },
                    { v: '70%', l: 'No human needed' },
                    { v: '12+', l: 'Languages' },
                  ].map(m => (
                    <div key={m.l} className="rounded-2xl border border-slate-200 bg-white p-3 text-center">
                      <div className="text-[20px] font-bold tracking-tight">{m.v}</div>
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5">{m.l}</div>
                    </div>
                  ))}
                </div>

                {demoCalling && (
                  <div className="mt-4 rounded-full px-4 py-2 bg-emerald-50 border border-emerald-200 text-[12px] font-medium text-emerald-700 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> AI Receptionist is answering... "Hello, Nairobi Techworks, how can I help you book today?"
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT US SECTION */}
        <section id="contact" className="py-14 lg:py-20">
          <div className="reveal">
            <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-slate-400">Contact Us • Pan-African Support</div>
            <h2 className="mt-2 text-[32px] lg:text-[44px] leading-[0.95] font-bold">Contact our founders across Africa</h2>
            <p className="mt-3 text-[15px] text-slate-600 max-w-[680px]">Use image as full width white card. Our Support Team and offices map. Real functional form below — persists via trusted backend.</p>
          </div>

          <div className="reveal reveal-delay-1 mt-8 rounded-[24px] bg-white border border-slate-200 shadow-[var(--shadow-card)] overflow-hidden">
            <img src={contactImg} alt="AfroPulse Contact Us Send us a message form Our Support Team Amara Johnson Customer Success Lagos David Otieno Technical Nairobi Abena Mensah Community Accra Our Offices Across Africa map" className="w-full object-cover" />
          </div>

          <div className="reveal reveal-delay-2 mt-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
            {/* Functional Form */}
            <div className="rounded-[24px] bg-white border border-slate-200 shadow-[var(--shadow-card)] p-6 lg:p-8">
              <div className="flex items-center justify-between">
                <h3 className="text-[20px] font-bold">Send us a message</h3>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-900 text-white font-bold tracking-widest uppercase">LIVE FORM</span>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[12px] font-semibold text-slate-600">Full Name</label>
                    <input value={form.fullName} onChange={e=>setForm({...form, fullName:e.target.value})} placeholder="Kwame Osei" className="mt-1.5 w-full h-11 rounded-full border border-slate-200 bg-white px-4 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
                  </div>
                  <div>
                    <label className="text-[12px] font-semibold text-slate-600">Email</label>
                    <input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} type="email" placeholder="kwame@nairobi.tech" className="mt-1.5 w-full h-11 rounded-full border border-slate-200 bg-white px-4 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
                  </div>
                </div>

                <div>
                  <label className="text-[12px] font-semibold text-slate-600">How can we help?</label>
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    {['General Inquiry','Book Demo','Support','Partnership','Legal & Trust'].map(opt=>(
                      <button key={opt} type="button" onClick={()=>setActiveHelp(opt)} className={`h-9 px-4 rounded-full text-[13px] font-medium border transition ${activeHelp===opt ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>{opt}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[12px] font-semibold text-slate-600">Message</label>
                  <textarea value={form.message} onChange={e=>setForm({...form, message:e.target.value})} placeholder="Tell us about your business in Lagos, Nairobi or Accra and how AiKOVA can help..." className="mt-1.5 w-full min-h-[120px] rounded-[18px] border border-slate-200 bg-white p-4 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none" />
                </div>

                <button disabled={submitting} type="submit" className="gradient-btn w-full h-[48px] rounded-full text-white font-semibold text-[14px] disabled:opacity-60">
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>

                {submitResult && (
                  <div className={`rounded-2xl px-4 py-3 text-[13px] border ${submitResult.type==='success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                    {submitResult.msg}
                  </div>
                )}

                <div className="text-[11px] text-slate-400">Stored in <span className="font-semibold text-slate-600">contact_messages</span> collection • {messages.length} messages saved • NDPR & GDPR compliant</div>
              </form>

              {messages.length>0 && (
                <div className="mt-6 border-t border-slate-100 pt-6 space-y-3 max-h-[220px] overflow-auto pr-1">
                  {messages.slice(0,5).map((r:any)=>(
                    <div key={r.id} className="rounded-2xl bg-slate-50 border border-slate-100 p-3">
                      <div className="text-[12px] font-semibold">{r.value.fullName} • {r.value.helpType}</div>
                      <div className="text-[11px] text-slate-500">{r.value.email}</div>
                      <div className="text-[12px] mt-1 text-slate-700 line-clamp-2">{r.value.message}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Team & Offices */}
            <div className="space-y-6">
              <div className="rounded-[24px] bg-white border border-slate-200 shadow-[var(--shadow-card)] p-6">
                <h4 className="text-[16px] font-bold">Our Support Team</h4>
                <div className="mt-4 space-y-3">
                  {[
                    { name: 'Amara Johnson', role: 'Customer Success • Lagos', initials: 'AJ', color: 'bg-amber-100 text-amber-700' },
                    { name: 'David Otieno', role: 'Technical • Nairobi', initials: 'DO', color: 'bg-blue-100 text-blue-700' },
                    { name: 'Abena Mensah', role: 'Community • Accra', initials: 'AM', color: 'bg-emerald-100 text-emerald-700' },
                  ].map(p=>(
                    <div key={p.name} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
                      <div className={`w-10 h-10 rounded-full grid place-items-center font-bold text-[13px] ${p.color}`}>{p.initials}</div>
                      <div>
                        <div className="text-[14px] font-semibold leading-tight">{p.name}</div>
                        <div className="text-[12px] text-slate-500">{p.role}</div>
                      </div>
                      <div className="ml-auto w-7 h-7 rounded-full bg-white border border-slate-200 grid place-items-center text-[12px]">↗</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] bg-slate-900 text-white p-6">
                <h4 className="text-[16px] font-bold">Our Offices Across Africa</h4>
                <div className="mt-4 space-y-4">
                  {[
                    { city: 'Lagos Office', addr: '152 Ozumba Mbadiwe Ave, Victoria Island, Lagos, Nigeria', flag: '🇳🇬' },
                    { city: 'Nairobi Office', addr: 'Westlands Road, 00100, Nairobi, Kenya', flag: '🇰🇪' },
                    { city: 'Accra Office', addr: 'Liberation Road, Airport Residential Area, Accra, Ghana', flag: '🇬🇭' },
                  ].map(o=>(
                    <div key={o.city} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 grid place-items-center text-[14px] shrink-0">{o.flag}</div>
                      <div>
                        <div className="text-[13px] font-semibold">{o.city}</div>
                        <div className="text-[12px] text-white/60 leading-snug mt-0.5">{o.addr}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-5 border-t border-white/10 space-y-2 text-[12px]">
                  <div className="flex justify-between"><span className="text-white/50">Support</span><span className="font-medium">support@aikova.africa</span></div>
                  <div className="flex justify-between"><span className="text-white/50">Phone</span><span className="font-medium">+234 800 AIKOVA</span></div>
                  <div className="flex justify-between"><span className="text-white/50">Hours</span><span className="font-medium">Mon-Fri 8am-6pm GMT+1 • 24/7 Chat</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LEGAL & TRUST */}
        <section id="legal" className="py-14 lg:py-20 border-y border-slate-100 bg-[var(--bg-alt)] -mx-5 lg:-mx-8 px-5 lg:px-8">
          <div className="mx-auto max-w-[1280px]">
            <div className="reveal text-center max-w-[760px] mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-bold tracking-[0.12em] uppercase">
                <span className="w-3 h-3 rounded-full grid place-items-center" style={{background:'var(--gradient-diagonal)'}}>🔒</span>
                Legal & Trust • Built for Africa • Pan-African Certified
              </div>
              <h2 className="mt-4 text-[32px] lg:text-[48px] leading-[0.95] font-bold">Legal & Trust — Built for Africa</h2>
              <p className="mt-3 text-[15px] text-slate-600">Security, privacy, compliance for African businesses — shield with gold lock, NDPR, GDPR, encryption at rest & in transit.</p>
            </div>

            <div className="reveal reveal-delay-1 mt-10 rounded-[24px] bg-white border border-slate-200 shadow-[var(--shadow-elevated)] overflow-hidden">
              <img src={legalImg} alt="LEGAL & TRUST Security Privacy Compliance for African Businesses shield with gold lock Legal Privacy Security Compliance cards Building Trustworthy Practices Across Africa Pan-African Certified & Trusted Ethical & Transparent" className="w-full object-cover" />
            </div>

            <div className="reveal reveal-delay-2 mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { title: 'Legal', icon: '⚖️', items: ['Contract Law', 'Regulatory Guidance', 'Corporate Governance'] },
                { title: 'Privacy', icon: '🔐', items: ['Data Privacy', 'Consent Management', 'Confidentiality', 'NDPR • GDPR'] },
                { title: 'Security', icon: '🛡️', items: ['Data Protection', 'Cyber Resilience', 'Risk Management', 'Encryption at rest / in transit'] },
                { title: 'Compliance', icon: '✅', items: ['Compliance Standards', 'Audits', 'Policy Framework', '54 African countries local regulatory'] },
              ].map(card=>(
                <div key={card.title} className="rounded-[20px] bg-white border border-slate-200 shadow-[var(--shadow-card)] p-5 gradient-border-top">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 grid place-items-center text-[14px]">{card.icon}</div>
                    <div className="font-bold text-[15px]">{card.title}</div>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {card.items.map(it=>(
                      <li key={it} className="flex items-start gap-2 text-[13px] text-slate-600">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{background:'var(--gradient-diagonal)'}} />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="reveal reveal-delay-3 mt-8 rounded-full border border-slate-200 bg-white px-4 py-3 flex flex-wrap items-center justify-center gap-3 text-[12px] font-medium shadow-sm">
              <span className="px-3 py-1 rounded-full text-white font-bold" style={{background:'var(--gradient-diagonal)'}}>Building Trustworthy Practices Across Africa</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500" />Pan-African Certified & Trusted</span>
              <span className="hidden md:block w-px h-4 bg-slate-200" />
              <span>Ethical & Transparent</span>
              <span className="hidden md:block w-px h-4 bg-slate-200" />
              <span>54 Countries • NDPR • GDPR • SOC 2 Ready</span>
            </div>
          </div>
        </section>

        {/* MASTER SITEMAP */}
        <section id="sitemap" className="py-14 lg:py-20">
          <div className="reveal flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-slate-400">Master Sitemap • Production Ready • Torch of God Constancy</div>
              <h2 className="mt-2 text-[30px] lg:text-[42px] leading-[0.95] font-bold">AiKOVA 11 Pages — Production Ready</h2>
            </div>
            <div className="text-[12px] px-3 py-1.5 rounded-full bg-slate-900 text-white font-semibold">
              White theme #FFFFFF + gradient #00E5FF→#2962FF→#76FF03 • Imagery speaks • African businesses
            </div>
          </div>

          <div className="reveal reveal-delay-1 mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sitemapPages.map(page=>(
              <a key={page.no} href={page.path} className="group relative rounded-[20px] bg-white border border-slate-200 shadow-[var(--shadow-card)] p-5 hover:shadow-[var(--shadow-elevated)] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1" style={{background:'var(--gradient-diagonal)'}} />
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full text-white font-bold grid place-items-center text-[12px] shadow-sm" style={{background:'var(--gradient-diagonal)'}}>{page.no}</div>
                    <div>
                      <div className="text-[11px] font-mono text-slate-400">{page.path}</div>
                      <div className="text-[15px] font-bold leading-tight">{page.title}</div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full border ${page.status==='FINAL' ? 'bg-slate-900 text-white border-slate-900' : page.status==='LIVE' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>{page.status}</span>
                </div>
                <div className="mt-3 text-[13px] text-slate-600 leading-snug">{page.desc}</div>
                <div className="mt-4 flex items-center gap-2 text-[12px] font-semibold text-slate-500 group-hover:text-slate-900">
                  <span>View page</span>
                  <span className="w-5 h-5 rounded-full border border-slate-200 grid place-items-center group-hover:bg-slate-900 group-hover:text-white transition">→</span>
                </div>
              </a>
            ))}
          </div>

          <div className="reveal reveal-delay-2 mt-6 rounded-[20px] bg-[var(--bg-alt)] border border-slate-200 p-5 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logoImg} alt="logo" className="w-8 h-8 rounded-lg object-cover" />
              <div className="text-[13px]">
                <span className="font-bold">Torch of God constancy note:</span>
                <span className="text-slate-600"> White theme #FFFFFF as base, alt #F8FAFC, slate text #0F172A, gradient accents. No print button. Production-ready React. Imagery is constancy — same 3 real images across tree.</span>
              </div>
            </div>
            <div className="text-[11px] font-mono text-slate-400">/demo-contact-legal → Final Page No.11 • Closes tree</div>
          </div>
        </section>

        {/* FINAL CTA BANNER */}
        <section className="reveal pb-12">
          <div className="rounded-[28px] p-[1px]" style={{background:'var(--gradient-diagonal)'}}>
            <div className="rounded-[27px] bg-white p-1">
              <div className="rounded-[22px] px-6 lg:px-10 py-8 lg:py-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6" style={{background:'var(--gradient-diagonal)'}}>
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-[11px] font-bold tracking-widest uppercase backdrop-blur">✓ 11 Pages Done</div>
                  <h3 className="mt-3 text-[24px] lg:text-[30px] leading-[0.95] font-bold text-white">Ready to wire into React web/mobile env.<br />Build Africa's open market with AiKOVA.</h3>
                  <p className="mt-2 text-[14px] text-white/80 max-w-[560px]">Production-ready marketing tree — Hero → Features → Solutions → Languages → How It Works → Pricing → Demo → Customers → Resources → Company → Legal/Contact (this final).</p>
                </div>
                <div className="flex flex-wrap gap-3 shrink-0">
                  <button onClick={()=>window.scrollTo({top:0, behavior:'smooth'})} className="h-11 px-6 rounded-full bg-white text-slate-900 font-semibold text-[14px] shadow-sm hover:bg-slate-50 transition">Download All Artifacts</button>
                  <a href="#live-demo" className="h-11 px-6 rounded-full bg-slate-900 text-white font-semibold text-[14px] inline-flex items-center hover:bg-black transition">Start Building</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row justify-between gap-8">
            <div>
              <div className="flex items-center gap-3">
                <img src={logoImg} alt="AiKOVA Logo" className="w-9 h-9 rounded-xl object-cover" />
                <div>
                  <div className="font-bold">AiKOVA • AI Receptionist</div>
                  <div className="text-[12px] text-slate-500">Built for Africa • Ready for Any Business • No.11 Final</div>
                </div>
              </div>
              <div className="mt-4 text-[12px] text-slate-500 max-w-[360px]">Torch of God constancy — white theme, real images, gradient road #00E5FF→#2962FF→#76FF03. Legal & Trust for 54 countries.</div>
              <div className="mt-4 flex gap-2">
                {['IG','X','LI','GH'].map(s=>(
                  <div key={s} className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 grid place-items-center text-[11px] font-bold">{s}</div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-[13px]">
              <div>
                <div className="font-bold mb-3">Product</div>
                <div className="space-y-2 text-slate-600">
                  <a href="/features" className="block hover:text-slate-900">Features</a>
                  <a href="/solutions" className="block hover:text-slate-900">Solutions</a>
                  <a href="/languages" className="block hover:text-slate-900">Languages</a>
                  <a href="/pricing" className="block hover:text-slate-900">Pricing</a>
                </div>
              </div>
              <div>
                <div className="font-bold mb-3">Demo + Trust</div>
                <div className="space-y-2 text-slate-600">
                  <a href="#live-demo" className="block hover:text-slate-900">Live Demo</a>
                  <a href="#legal" className="block hover:text-slate-900">Legal & Trust</a>
                  <a href="#contact" className="block hover:text-slate-900">Contact</a>
                  <a href="#sitemap" className="block hover:text-slate-900">Sitemap</a>
                </div>
              </div>
              <div>
                <div className="font-bold mb-3">Company</div>
                <div className="space-y-2 text-slate-600">
                  <a href="/company" className="block hover:text-slate-900">Company</a>
                  <a href="/customers" className="block hover:text-slate-900">Customers</a>
                  <a href="/resources" className="block hover:text-slate-900">Resources</a>
                </div>
              </div>
              <div>
                <div className="font-bold mb-3">Legal</div>
                <div className="space-y-2 text-slate-600">
                  <div>Privacy • NDPR/GDPR</div>
                  <div>Security • Encryption</div>
                  <div>Compliance • 54 countries</div>
                  <div>© 2026 AiKOVA</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-slate-100 flex flex-wrap justify-between gap-3 text-[11px] text-slate-400">
            <span>© 2026 AiKOVA AI Receptionist. Built for Africa. Ready for Any Business. White theme constancy.</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Pan-African Certified & Trusted • Ethical & Transparent
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
