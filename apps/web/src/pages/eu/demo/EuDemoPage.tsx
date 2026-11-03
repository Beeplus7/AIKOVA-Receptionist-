import React, { useEffect, useRef, useState } from "react";
import logoUrl from "./assets/32d4f05ae5209978-image_6A9BA612-7186-480D-9D5C-7EF8BE2260B7.jpeg";
import heroDemoUrl from "./assets/176db8cd8e5e2b4e-image_20261029_224056.webp";
import opsHubUrl from "./assets/51eb4b9200ed0c81-image_20261029_224059.webp";
import highStreetUrl from "./assets/6b508a2736534e60-image_20261029_220349.webp";
import { startSetupUrl } from '../../../lib/setupFlow';

// helper for reveal
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const targets = el.querySelectorAll(".reveal");
          targets.forEach((t, i) => {
            setTimeout(() => t.classList.add("in"), i * 90);
          });
          // also direct
          if (el.classList.contains("reveal")) el.classList.add("in");
        }
      });
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

export default function EuDemoPage() {
  const [callActive, setCallActive] = useState(true);
  const [callSec, setCallSec] = useState(42);
  const [muted, setMuted] = useState(false);
  const [hold, setHold] = useState(false);
  const [whatsTyping, setWhatsTyping] = useState(true);
  const [assessOpen, setAssessOpen] = useState(false);
  const [formData, setFormData] = useState({ business: "", name: "", email: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [demoLogs, setDemoLogs] = useState<any[]>([]);

  // call timer
  useEffect(() => {
    if (!callActive) return;
    const id = setInterval(() => setCallSec(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [callActive]);

  useEffect(() => {
    const id = setInterval(() => setWhatsTyping(v => !v), 3200);
    return () => clearInterval(id);
  }, []);

  // load demo logs from records
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("actions", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ action: "records.list", args: { collection: "demo_leads", limit: 20 } })
        });
        const j = await res.json();
        if (j.data?.records) setDemoLogs(j.data.records.slice(0,3));
      } catch {}
    };
    load();
  }, []);

  const handleAssessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.business || !formData.email) return;
    setSaving(true);
    try {
      const res = await fetch("actions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "records.create",
          args: {
            collection: "demo_leads",
            value: { ...formData, createdAt: new Date().toISOString(), source: "Page No.7 DEMO" },
            idempotency_key: `${formData.email}-${Date.now()}`
          }
        })
      });
      const j = await res.json();
      if (j.error) throw new Error(j.error);
      setSavedMsg("Assess request saved. Our UK team will contact you within 2 hours.");
      setFormData({ business: "", name: "", email: "", phone: "" });
      // reload
      try {
        const r2 = await fetch("actions", { method:"POST", headers:{"content-type":"application/json"}, body: JSON.stringify({ action:"records.list", args:{ collection:"demo_leads", limit:20 } }) });
        const j2 = await r2.json();
        if (j2.data?.records) setDemoLogs(j2.data.records.slice(0,3));
      } catch {}
      setTimeout(()=>{ setAssessOpen(false); setSavedMsg(null); }, 2500);
    } catch (err:any) {
      setSavedMsg(err.message || "Could not save. Storage limit?");
    } finally {
      setSaving(false);
    }
  };

  const reveal1 = useReveal();
  const reveal2 = useReveal();
  const reveal3 = useReveal();
  const reveal4 = useReveal();

  const fmt = (s:number) => {
    const m = Math.floor(s/60).toString().padStart(2,"0");
    const sec = (s%60).toString().padStart(2,"0");
    return `${m}:${sec}`;
  };

  return (
    <div
      data-safe-area-inset-root
      className="min-h-screen bg-white text-[15px] overflow-x-clip selection:bg-[#2962FF]/15"
      style={{ boxSizing: "border-box", paddingTop: "var(--safe-area-inset-top)", background: "var(--bg)" }}
    >
      {/* NAV */}
      <header
        data-safe-area-sticky-top
        className="sticky z-50 border-b border-slate-100/80 bg-white/80 backdrop-blur-xl"
        style={{ top: "var(--safe-area-inset-top)" }}
      >
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="/eu" className="flex items-center gap-3">
              <img src={logoUrl} alt="Eurozone Logo" className="h-9 w-9 rounded-xl object-cover shadow-sm" />
              <span className="font-semibold tracking-tight text-[16px]">Eurozone AI</span>
              <span className="hidden sm:inline-flex ml-2 px-2.5 py-1 rounded-full bg-[#F8FAFC] border border-slate-200 text-[11px] font-semibold tracking-widest">UK • EU</span>
            </a>
            <nav className="hidden lg:flex items-center gap-7 text-[13.5px] font-medium text-slate-600">
              <a href="/eu/features" className="hover:text-slate-900 transition">Features</a>
              <a href="/eu/solutions" className="hover:text-slate-900 transition">Solutions</a>
              <a href="/eu/languages" className="hover:text-slate-900 transition">Languages</a>
              <a href="/eu/how-it-works" className="hover:text-slate-900 transition">How It Works</a>
              <a href="/eu/pricing" className="hover:text-slate-900 transition">Pricing</a>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#012169] text-white text-[12px] font-semibold shadow-sm">Demo 🇬🇧🇪🇺</span>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500" style={{ animation:"pulseDot 2s infinite" }} />
              Live • Frankfurt
            </div>
            <a href={startSetupUrl("eurozone")}
              id="assess-button-main-hero"
              
              className="h-[40px] px-5 rounded-full bg-[#0F172A] text-white text-[13px] font-semibold tracking-wide hover:bg-black transition shadow-[0_8px_20px_rgba(15,23,42,0.18)]"
            >Start free trial →
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC] to-white" />
        <div className="absolute -top-24 right-[-10%] w-[680px] h-[680px] rounded-full blur-[120px] opacity-[0.12] bg-gradient-to-br from-[#00E5FF] via-[#2962FF] to-[#76FF03]" />
        <div className="relative mx-auto max-w-[1280px] px-6 lg:px-8 pt-12 lg:pt-20 pb-12">
          <div className="reveal in mx-auto max-w-5xl text-center">
            <div className="inline-flex flex-wrap justify-center items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-[var(--shadow-soft)] text-[11px] font-semibold tracking-widest text-slate-600 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Demo • Live • UK +44 • EU Data Resident Frankfurt • GDPR Compliant • Version 1.4.2
              <span className="hidden sm:inline-flex ml-2 px-2 py-0.5 rounded-full bg-[#012169] text-white">UK FLAG-OFF</span>
            </div>
            <h1 className="mt-7 text-[40px] sm:text-[56px] lg:text-[68px] leading-[0.92] font-[700] tracking-[-0.04em] text-[#0F172A]">
              Live demo — Call <span className="relative inline-block"><span className="relative z-10 px-2 bg-gradient-to-r from-[#00E5FF] via-[#2962FF] to-[#76FF03] bg-clip-text text-transparent">+44 7700 900123</span><span className="absolute inset-0 top-[65%] h-[12px] bg-[#76FF03]/20 -rotate-1" /></span> now, see AI answer in 00:42
            </h1>
            <p className="mt-6 mx-auto max-w-3xl text-[16px] lg:text-[18px] leading-7 text-slate-600 font-[450]">
              Eurozone AI Receptionist Live Demo — same seamless as cyberstaff video. AI answers calls 24/7, WhatsApp table booking <span className="inline-flex px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[12px] font-semibold">no nuts</span>, Instagram same-day delivery London before 2pm, all GDPR compliant.
            </p>
          </div>

          {/* HERO INFOGRAPHIC */}
          <div ref={reveal1} className="mt-10 lg:mt-14">
            <div className="reveal relative mx-auto max-w-[1120px] rounded-[28px] bg-white border border-slate-200 shadow-[var(--shadow-elev)] p-3 lg:p-4">
              <div className="flex items-center justify-between px-4 py-2 text-[11px] font-semibold tracking-widest text-slate-500 uppercase">
                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Eurozone AI Receptionist Live Demo Version 1.4.2 • EU Data Resident Frankfurt • GDPR Compliant</span>
                <span className="hidden md:inline">Demo Mode • Simulated data • AES-256</span>
              </div>
              <img src={heroDemoUrl} alt="Eurozone AI Receptionist Live Demo 3 channels Phone WhatsApp Instagram" className="w-full rounded-[18px] object-cover border border-slate-100" />
              <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] font-medium text-slate-500 px-2">
                <span>PHONE • UK +44 • 00:42 • Mute Hold End</span>
                <span>WHATSAPP • Acme Boutique • AI Auto-reply On</span>
                <span>INSTAGRAM • @styleshop_uk • Active now</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE CHANNELS */}
      <section id="features" className="mx-auto max-w-[1280px] px-6 lg:px-8 py-12 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-[11px] font-bold tracking-[0.18em] text-[#012169] uppercase">Live Channels Detailed — Interactive</div>
            <h2 className="mt-3 text-[32px] lg:text-[44px] leading-[0.95] text-[#0F172A]">Three channels, one receptionist. Live now.</h2>
          </div>
          <div className="text-[13px] text-slate-500 max-w-sm">Tap to interact. Call duration ticks live. WhatsApp read receipts animate. Built for UK high street businesses.</div>
        </div>

        <div ref={reveal2} className="grid lg:grid-cols-3 gap-6">
          {/* PHONE */}
          <div className="reveal rounded-[22px] bg-white border border-slate-200 shadow-[var(--shadow-soft)] p-5 lg:p-6 flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-[#012169] text-white grid place-items-center text-[14px]">☎</div>
                <div>
                  <div className="text-[13px] font-bold">PHONE CALL • UK +44</div>
                  <div className="text-[11px] text-slate-500">Incoming Call +44 7700 900123 • United Kingdom Mobile</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold tracking-widest animate-pulse">LIVE AI ACTIVE • {fmt(callSec)}</span>
            </div>

            <div className="mt-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 p-4">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Call Duration {fmt(callSec)}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${callActive ? "bg-[#012169] text-white" : "bg-slate-200 text-slate-600"}`}>{callActive ? "Connected" : "Ended"}</span>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-900 text-white grid place-items-center text-[12px]">AI</div>
                  <div className="flex-1 rounded-2xl rounded-tl-sm bg-white border border-slate-200 p-3 text-[13px] leading-6 shadow-sm">
                    <div className="text-[11px] font-bold tracking-widest text-[#2962FF] mb-1">AI ASSISTANT SPEAKING</div>
                    Thanks for calling — I can help with bookings, support, general queries today. How can I assist you?
                    {hold && <div className="mt-2 text-amber-600 text-[11px] font-semibold">• On hold — retrieving availability</div>}
                    {muted && <div className="mt-2 text-slate-500 text-[11px]">• Muted</div>}
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[78%] rounded-2xl rounded-tr-sm bg-[#012169] text-white p-3 text-[13px] leading-6">We need a table tonight for four, garden side if possible.</div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={()=>setMuted(v=>!v)} className={`h-9 flex-1 rounded-full border text-[12px] font-semibold transition ${muted ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"}`}>Mute</button>
                <button onClick={()=>setHold(v=>!v)} className={`h-9 flex-1 rounded-full border text-[12px] font-semibold transition ${hold ? "bg-amber-500 text-white border-amber-500" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"}`}>Hold</button>
                <button onClick={()=>{ setCallActive(v=>!v); if(!callActive) setCallSec(42); }} className={`h-9 flex-1 rounded-full text-[12px] font-semibold ${callActive ? "bg-red-500 text-white hover:bg-red-600" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}>{callActive ? "End Call" : "Restart Call"}</button>
              </div>
            </div>

            <a href="tel:+447700900123" className="mt-5 h-12 rounded-full bg-gradient-to-r from-[#00E5FF] via-[#2962FF] to-[#012169] text-white grid place-items-center text-[13px] font-bold tracking-wide shadow-[0_12px_24px_rgba(41,98,255,0.25)] hover:opacity-95 transition">
              Click to Call +44 7700 900123 →
            </a>
            <div className="mt-3 text-[11px] text-slate-400 text-center">Simulated live demo • No actual call placed in preview</div>
          </div>

          {/* WHATSAPP */}
          <div className="reveal rounded-[22px] bg-white border border-slate-200 shadow-[var(--shadow-soft)] p-5 lg:p-6 flex flex-col" style={{ transitionDelay: "90ms" } as any}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-[#25D366] text-white grid place-items-center text-[14px]">W</div>
                <div>
                  <div className="text-[13px] font-bold">WHATSAPP CHAT DEMO</div>
                  <div className="text-[11px] text-slate-500">Acme Boutique • Online • AI Auto-reply On</div>
                </div>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="mt-5 flex-1 rounded-2xl bg-[#E9EFD8]/70 border border-[#DDE8C8] p-4 space-y-3">
              {[
                { me:false, t:"Hi do you have availability for table booking on Saturday for 4 people", time:"09:12", status:"" },
                { me:true, t:"Hello! Thanks for reaching out — I can check availability for Sat for 4. We have 6:30pm and 8:00pm available. Which works better for you?", time:"09:12", status:"delivered • AI" },
                { me:false, t:"8pm please dietary no nuts", time:"09:13", status:"" },
                { me:true, t:"Perfect — booked for 8pm, 4 guests, note no nuts added. You'll receive confirmation shortly. Need anything else?", time:"09:13", status:"read • AI" },
              ].map((m,i)=>(
                <div key={i} className={`flex ${m.me ? "justify-start" : "justify-end"}`}>
                  <div className={`${m.me ? "bg-white border border-slate-200 rounded-2xl rounded-tl-sm" : "bg-[#DCF8C6] rounded-2xl rounded-tr-sm"} max-w-[84%] p-3 shadow-sm`}>
                    <div className="text-[13px] leading-6">{m.t}</div>
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-500">{m.time} {m.status && `• ${m.status}`} {m.status.includes("read") && <span className="text-[#53BDEB]">✓✓</span>}</div>
                  </div>
                </div>
              ))}
              {whatsTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-3 py-2 text-[11px] text-slate-500 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:120ms]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:240ms]" />
                    AI is typing
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-full bg-[#F8FAFC] border border-slate-200 px-3 py-2 text-[11px] text-slate-600">Party: 4 • Sat 8pm • No nuts</div>
              <div className="rounded-full bg-[#012169] text-white px-3 py-2 text-[11px] font-semibold text-center">Confirmation sent ✓</div>
            </div>
          </div>

          {/* INSTAGRAM */}
          <div className="reveal rounded-[22px] bg-white border border-slate-200 shadow-[var(--shadow-soft)] p-5 lg:p-6 flex flex-col" style={{ transitionDelay: "180ms" } as any}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5] grid place-items-center text-white text-[12px] font-bold">IG</div>
                <div>
                  <div className="text-[13px] font-bold">@styleshop_uk • Instagram DM</div>
                  <div className="text-[11px] text-slate-500">Active now • AI Response</div>
                </div>
              </div>
              <span className="px-2 py-1 rounded-full bg-pink-50 text-pink-600 border border-pink-200 text-[10px] font-bold">AI ON</span>
            </div>

            <div className="mt-5 flex-1 rounded-2xl bg-[#FAF5FF] border border-[#E9D5FF] p-4 space-y-3">
              {[
                { me:false, t:"Hey! Do you offer same-day shipping to London?", time:"09:14" },
                { me:true, t:"Hi! Yes we offer same-day delivery in London for orders before 2pm. It's currently 9:14am so we can dispatch today for delivery today. Want me to share link?", time:"09:14", seen:"Seen • AI" },
                { me:false, t:"Yes please", time:"09:15" },
                { me:true, t:"Here's secure link: style.co/delivery-london — checkout before 2pm for today delivery. Happy to help!", time:"09:15", seen:"Seen • AI" },
              ].map((m,i)=>(
                <div key={i} className={`flex ${m.me ? "justify-start" : "justify-end"}`}>
                  <div className={`${m.me ? "bg-white border border-slate-200 rounded-2xl rounded-tl-sm" : "bg-gradient-to-br from-[#feda75]/30 via-white to-[#d62976]/10 border border-pink-100 rounded-2xl rounded-tr-sm"} max-w-[84%] p-3 shadow-sm`}>
                    <div className="text-[13px] leading-6">{m.t}</div>
                    <div className="mt-1 text-[10px] text-slate-500">{m.time} {m.seen && `• ${m.seen}`}</div>
                  </div>
                </div>
              ))}
            </div>
            <a href="https://style.co/delivery-london" target="_blank" rel="noopener" className="mt-4 h-11 rounded-full bg-white border border-slate-200 text-[12px] font-semibold grid place-items-center hover:bg-slate-50 transition">Open secure link style.co/delivery-london ↗</a>
          </div>
        </div>
      </section>

      {/* OPERATIONS HUB */}
      <section id="solutions" className="bg-[#F8FAFC] border-y border-slate-200 py-12 lg:py-20">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
          <div ref={reveal3}>
            <div className="reveal flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-[28px] lg:text-[40px] leading-[0.95] text-[#0F172A]">UK Business Live Demo — Operations Hub <span className="inline-flex ml-3 px-3 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-bold tracking-widest animate-pulse">LIVE • UPDATED JUST NOW</span></h2>
              <div className="text-[12px] text-slate-500 font-medium">Tuesday 29 Oct 2024 10:27 AM BST London UK BST</div>
            </div>

            <div className="reveal mt-8 rounded-[28px] bg-white border border-slate-200 shadow-[var(--shadow-elev)] overflow-hidden">
              <div className="p-3 lg:p-4">
                <img src={opsHubUrl} alt="UK Business Live Demo Operations Hub laptop on Brew & Bean Cafe table" className="w-full rounded-[18px] object-cover border border-slate-100" />
              </div>
              <div className="px-6 lg:px-8 pb-8 grid lg:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="rounded-[18px] bg-white border border-slate-200 shadow-[var(--shadow-soft)] p-5">
                  <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-emerald-700"><span className="h-2 w-2 rounded-full bg-emerald-500" /> THE GARDEN RESTAURANT</div>
                  <div className="mt-3">
                    <div className="text-[13px] font-semibold">Incoming AI Call • Call Connected</div>
                    <div className="mt-2 text-[12px] text-slate-600 leading-6">
                      <div><span className="font-semibold">Customer:</span> Sarah Mitchell</div>
                      <div><span className="font-semibold">Request:</span> Reservation for tonight Party of 4 at 19:30</div>
                      <div className="mt-2 p-2 rounded-xl bg-[#F8FAFC] border border-slate-200">AI Response: Confirmed Table for 4 booked 19:30 today Dietary note vegetarian no nuts Confirmation code <span className="font-mono font-bold text-[#012169]">GR-9842</span> sent via SMS Location 22 Garden Lane Bath BA1 2LS</div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button className="h-8 px-3 rounded-full bg-slate-900 text-white text-[11px] font-semibold">End Call</button>
                    <button className="h-8 px-3 rounded-full bg-white border border-slate-200 text-[11px] font-semibold">Add Notes</button>
                  </div>
                </div>
                {/* Card 2 */}
                <div className="rounded-[18px] bg-white border border-slate-200 shadow-[var(--shadow-soft)] p-5">
                  <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-[#012169]"><span className="h-2 w-2 rounded-full bg-[#012169]" /> BREW & BEAN CAFE • WhatsApp Business</div>
                  <div className="mt-3 text-[12px] leading-6 text-slate-700">
                    <div className="rounded-xl bg-[#F0FDF4] border border-emerald-100 p-3">
                      <div className="text-[11px] text-slate-500">New Message 2 min ago</div>
                      <div className="font-medium">Hi do you have gluten-free cake available today Also what time close</div>
                      <div className="mt-1 text-slate-500 text-[11px]">10:25 AM</div>
                    </div>
                    <div className="mt-3 rounded-xl bg-white border border-slate-200 p-3">
                      Hi! Yes we have gluten-free chocolate cake available today We're open until 17:30 Want me to reserve slice <span className="text-[10px] text-slate-400 ml-2">10:25 AM • AI</span>
                    </div>
                    <div className="mt-2 text-[11px]">Customer replied Yes please I'll pop around 15:00 Thanks <span className="text-slate-400">10:26 AM • Chat ID WA-77012</span></div>
                  </div>
                  <button className="mt-3 h-8 w-full rounded-full bg-[#25D366] text-white text-[11px] font-bold">Send Reply</button>
                </div>
                {/* Card 3 */}
                <div className="rounded-[18px] bg-white border border-slate-200 shadow-[var(--shadow-soft)] p-5">
                  <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-slate-600"><span className="h-2 w-2 rounded-full bg-slate-400" /> HIGH STREET CLINIC • Appointment Upcoming Today</div>
                  <div className="mt-3 text-[12px] leading-6">
                    <div className="font-semibold">Patient James Patel • 14:00 General Checkup</div>
                    <div className="text-slate-600">Notes Follow-up blood pressure review Confirmed via text Location 5 High Street Bristol BS1 2AG Status Confirmed Reminder sent 09:00</div>
                    <div className="mt-3 p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px]">Next 14:30 Priya Khan Vaccine consult</div>
                  </div>
                </div>
              </div>
              <div className="px-6 lg:px-8 pb-6 flex flex-wrap items-center justify-between gap-3 text-[11px] font-semibold tracking-widest text-slate-500 border-t border-slate-100 pt-4">
                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> 3 BUSINESSES CONNECTED • AI ACTIONS 12 TODAY • SYSTEM HEALTHY CHECK</span>
                <span>Laptop on Brew & Bean Cafe table with latte heart, eucalyptus plant, notebook, phone, business card — 18 High St Bristol</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GDPR */}
      <section className="mx-auto max-w-[1280px] px-6 lg:px-8 py-10">
        <div ref={reveal4} className="reveal rounded-[20px] bg-[#0F172A] text-white p-6 lg:p-7 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between shadow-[0_20px_60px_rgba(15,23,42,0.25)]">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] font-bold tracking-widest">GDPR CONSENT & COMPLIANCE • LIVE EU DATA RESIDENT FRANKFURT</div>
            <div className="mt-3 text-[13px] leading-6 text-slate-200">
              <span className="font-semibold text-white">Consent recorded</span> — User consented per GDPR Article 6(1)(a) • Data processed in EU Frankfurt • Retention 30 days • Data subject rights available: access, erasure, portability on request. <br />
              <span className="font-mono text-[11px] text-emerald-300">Consent granted Timestamp 2025-02-08 09:12:03 UTC • Consent ID gdpr_8f92kz14e • Logs transcripts encrypted AES-256 • Demo Mode Simulated data</span>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button className="h-9 px-4 rounded-full bg-white text-[#0F172A] text-[12px] font-bold">View Privacy Policy</button>
            <button className="h-9 px-4 rounded-full bg-white/10 border border-white/20 text-white text-[12px] font-semibold hover:bg-white/15 transition">Manage Consent Settings</button>
          </div>
        </div>
      </section>

      {/* TRY YOURSELF */}
      <section className="mx-auto max-w-[1280px] px-6 lg:px-8 py-12">
        <div className="rounded-[28px] bg-white border border-slate-200 shadow-[var(--shadow-soft)] p-8 lg:p-10 text-center">
          <div className="inline-flex px-3 py-1 rounded-full bg-[#F8FAFC] border border-slate-200 text-[11px] font-bold tracking-widest text-[#012169]">TRY IT YOURSELF • LIVE DEMO</div>
          <h3 className="mt-4 text-[28px] lg:text-[36px] leading-[0.95]">Call, chat, or DM — see it answer like your staff.</h3>
          <div className="mt-8 grid sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
            <a href="tel:+447700900123" className="h-14 rounded-full bg-[#0F172A] text-white grid place-items-center text-[14px] font-bold hover:bg-black transition shadow-[0_12px_24px_rgba(15,23,42,0.18)]">Call +44 7700 900123</a>
            <button onClick={()=>{ setAssessOpen(true); }} className="h-14 rounded-full bg-[#25D366] text-white grid place-items-center text-[14px] font-bold hover:opacity-95 transition">WhatsApp Demo</button>
            <button onClick={()=>{ setAssessOpen(true); }} className="h-14 rounded-full bg-gradient-to-r from-[#feda75] via-[#d62976] to-[#4f5bd5] text-white grid place-items-center text-[14px] font-bold hover:opacity-95 transition">Instagram DM Demo</button>
          </div>
          <div className="mt-6 flex justify-center">
            <a href={startSetupUrl("eurozone")} id="assess-button-main-hero-2"  className="h-12 px-8 rounded-full bg-gradient-to-r from-[#00E5FF] via-[#2962FF] to-[#76FF03] text-[#0F172A] text-[13px] font-extrabold tracking-wide shadow-[0_12px_24px_rgba(41,98,255,0.22)] hover:opacity-95 transition">Start free trial → Get UK Compliance Check</a>
          </div>
          {demoLogs.length>0 && (
            <div className="mt-8 text-left max-w-3xl mx-auto">
              <div className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-2">Recent assess requests (live from backend)</div>
              <div className="grid gap-2">
                {demoLogs.map((r:any)=>(
                  <div key={r.id} className="rounded-xl bg-[#F8FAFC] border border-slate-200 px-4 py-3 text-[12px] flex justify-between">
                    <span className="font-semibold">{r.value.business || "Business"}</span>
                    <span className="text-slate-500">{r.value.email} • {new Date(r.created_at).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* HIGH STREET PROOF */}
      <section id="languages" className="mx-auto max-w-[1280px] px-6 lg:px-8 pb-12">
        <div className="rounded-[24px] overflow-hidden border border-slate-200 shadow-[var(--shadow-soft)] bg-white">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-0">
            <img src={highStreetUrl} alt="UK High Street Garden Restaurant Brew Bean Cafe High Street Clinic Bloom Salon with Union Jack bunting" className="w-full h-full object-cover min-h-[320px]" />
            <div className="p-8 lg:p-10 flex flex-col justify-center">
              <div className="text-[11px] font-bold tracking-widest text-[#012169]">UK HIGH STREET VISUAL PROOF</div>
              <h3 className="mt-3 text-[26px] leading-[0.95]">Built for The Garden Restaurant, Brew & Bean Cafe, High Street Clinic, Bloom Salon.</h3>
              <p className="mt-4 text-[14px] leading-7 text-slate-600">White theme, images that speak, interactive live demo. The same phone that rings in Bath and Bristol now answers in Frankfurt — GDPR compliant, EU resident data, 30-day retention. Union Jack bunting on the high street, enterprise grade underneath.</p>
              <div className="mt-6 grid grid-cols-2 gap-3 text-[12px]">
                <div className="rounded-xl bg-[#F8FAFC] border border-slate-200 p-3"><div className="font-bold">Garden Restaurant</div><div className="text-slate-500">22 Garden Lane Bath BA1 2LS • Table booking AI</div></div>
                <div className="rounded-xl bg-[#F8FAFC] border border-slate-200 p-3"><div className="font-bold">Brew & Bean</div><div className="text-slate-500">18 High St Bristol • WhatsApp cake reserve</div></div>
                <div className="rounded-xl bg-[#F8FAFC] border border-slate-200 p-3"><div className="font-bold">High Street Clinic</div><div className="text-slate-500">5 High St Bristol • Appointment sync</div></div>
                <div className="rounded-xl bg-[#F8FAFC] border border-slate-200 p-3"><div className="font-bold">Bloom Salon</div><div className="text-slate-500">Union Jack • Same-day booking</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF] via-[#2962FF] to-[#76FF03]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,33,105,0.85),rgba(1,33,105,0.2))]" />
        <div className="relative mx-auto max-w-[1280px] px-6 lg:px-8 py-8 flex flex-col lg:flex-row items-center justify-between gap-4 text-white">
          <div className="flex items-center gap-3 text-[13px] font-semibold tracking-wide">
            <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
            All systems live — check AI call flow — clinic sync OK — Demo notes — 3 businesses connected
          </div>
          <a href={startSetupUrl("eurozone")}  className="h-11 px-7 rounded-full bg-white text-[#012169] text-[13px] font-extrabold tracking-wide shadow-[0_12px_24px_rgba(0,0,0,0.18)] hover:bg-[#F8FAFC] transition">Start free trial →</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0F172A] text-slate-300">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-12 grid lg:grid-cols-[1.2fr_1fr_1fr] gap-10">
          <div>
            <div className="flex items-center gap-3">
              <img src={logoUrl} alt="Logo" className="h-8 w-8 rounded-lg object-cover" />
              <span className="font-semibold text-white">Eurozone AI Receptionist</span>
            </div>
            <p className="mt-4 text-[13px] leading-6 text-slate-400 max-w-sm">Supporting 27 EU Member States • United Kingdom Local Expertise • Regulatory Compliance • Frankfurt data residency • AES-256 encryption • GDPR Article 6(1)(a) consent • Page No.7 DEMO.</p>
          </div>
          <div className="text-[13px] space-y-2">
            <div className="text-white font-semibold mb-3">Product</div>
            <div>Features • Solutions • Languages • How It Works • Pricing • Demo</div>
            <div className="text-slate-500">Version 1.4.2 • EU Data Resident • UK +44</div>
          </div>
          <div className="text-[13px] space-y-2">
            <div className="text-white font-semibold mb-3">Compliance</div>
            <div>GDPR • Data Processing in EU Frankfurt • 30 days retention</div>
            <div>Access • Erasure • Portability • Consent ID gdpr_8f92kz14e</div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-5 flex flex-wrap justify-between gap-3 text-[11px] tracking-widest text-slate-500 uppercase">
            <span>© Eurozone AI • White #FFFFFF • Alt #F8FAFC • Slate #0F172A • Gradient #00E5FF → #2962FF → #76FF03 • UK Blue #012169</span>
            <span>UK Flag-off • White Theme • Best UI Designer Magic • Images That Speak • Interactive Live Demo</span>
          </div>
        </div>
      </footer>

      {/* ASSESS MODAL */}
      {assessOpen && (
        <div className="fixed inset-0 z-[80] grid place-items-center p-4">
          <div className="absolute inset-0 bg-[#0F172A]/60 backdrop-blur-[10px]" onClick={()=>setAssessOpen(false)} />
          <div className="relative w-full max-w-[560px] rounded-[24px] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.35)] border border-slate-200 p-7 lg:p-8 animate-[dropIn_500ms_cubic-bezier(.22,1,.36,1)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[11px] font-bold tracking-widest text-[#012169]">ASSESS YOUR BUSINESS • PAGE NO.7 DEMO</div>
                <h3 className="mt-2 text-[24px] leading-[0.95] text-[#0F172A]">Get UK + EU compliance check for your high street.</h3>
                <p className="mt-2 text-[13px] text-slate-500">We’ll map phone, WhatsApp, Instagram to your existing flow. GDPR compliant, Frankfurt resident.</p>
              </div>
              <button onClick={()=>setAssessOpen(false)} className="h-9 w-9 rounded-full bg-[#F8FAFC] border border-slate-200 grid place-items-center text-slate-600 hover:bg-white">✕</button>
            </div>
            <form onSubmit={handleAssessSubmit} className="mt-6 grid gap-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <label className="grid gap-1.5">
                  <span className="text-[11px] font-bold tracking-widest text-slate-500">BUSINESS NAME</span>
                  <input value={formData.business} onChange={e=>setFormData({...formData,business:e.target.value})} required placeholder="The Garden Restaurant" className="h-11 rounded-full border border-slate-200 bg-white px-4 text-[13px] outline-none focus:border-[#2962FF] focus:ring-2 focus:ring-[#2962FF]/15" />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-[11px] font-bold tracking-widest text-slate-500">YOUR NAME</span>
                  <input value={formData.name} onChange={e=>setFormData({...formData,name:e.target.value})} placeholder="Sarah Mitchell" className="h-11 rounded-full border border-slate-200 bg-white px-4 text-[13px] outline-none focus:border-[#2962FF] focus:ring-2 focus:ring-[#2962FF]/15" />
                </label>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <label className="grid gap-1.5">
                  <span className="text-[11px] font-bold tracking-widest text-slate-500">EMAIL</span>
                  <input type="email" value={formData.email} onChange={e=>setFormData({...formData,email:e.target.value})} required placeholder="you@business.co.uk" className="h-11 rounded-full border border-slate-200 bg-white px-4 text-[13px] outline-none focus:border-[#2962FF] focus:ring-2 focus:ring-[#2962FF]/15" />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-[11px] font-bold tracking-widest text-slate-500">PHONE +44</span>
                  <input value={formData.phone} onChange={e=>setFormData({...formData,phone:e.target.value})} placeholder="+44 7700 900123" className="h-11 rounded-full border border-slate-200 bg-white px-4 text-[13px] outline-none focus:border-[#2962FF] focus:ring-2 focus:ring-[#2962FF]/15" />
                </label>
              </div>
              <button disabled={saving} className="mt-2 h-12 rounded-full bg-[#0F172A] text-white text-[13px] font-bold tracking-wide hover:bg-black disabled:opacity-60 transition">
                {saving ? "Saving to EU Frankfurt..." : "Request Assess → GDPR Consented"}
              </button>
              <div className="text-[11px] text-slate-400 leading-5">By submitting, you consent per GDPR Art 6(1)(a). Data processed in EU Frankfurt, retention 30 days, AES-256. Consent ID will be generated. No file uploads.</div>
              {savedMsg && <div className="rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 text-[12px] font-medium">{savedMsg}</div>}
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes dropIn { from{opacity:0; transform: translateY(16px) scale(.98)} to{opacity:1; transform: translateY(0) scale(1)} }
      `}</style>
    </div>
  );
}
