import { useEffect, useRef, useState } from "react";

// Local image imports - build-time modules
import logoUrl from "./assets/32d4f05ae5209978-image_6A9BA612-7186-480D-9D5C-7EF8BE2260B7.jpeg";
import mapInfographicUrl from "./assets/556e1a199c3eed26-image_20261029_175420.webp";
import tripleWomenUrl from "./assets/5dbc964f3efab477-image_20261029_175408.webp";
import diverseGroupUrl from "./assets/b123e811c39a1bfc-image_20261029_175410.webp";
import lagosWomanUrl from "./assets/47c62095f3e7ab30-image_20261029_175406.webp";
import voiceMeshUrl from "./assets/ac484e8685f0aa0b-image_20261029_175411.webp";
import nairobiManUrl from "./assets/bf0aca67c0bc7f7a-image_20261029_175416.webp";

// Language data
const LANGUAGES = [
  { id: "yoruba", name: "Yoruba", native: "Yorùbá", speakers: "~45M", region: "SW Nigeria • Lagos, Ibadan", phrase: "Bawo ni? — How are you?", color: "#00E5FF", flag: "🇳🇬" },
  { id: "hausa", name: "Hausa", native: "Hausa", speakers: "~55M", region: "Northern Nigeria • Kano, Kaduna", phrase: "Sannu! — Hello!", color: "#2962FF", flag: "🇳🇬" },
  { id: "igbo", name: "Igbo", native: "Igbo", speakers: "~30M", region: "SE Nigeria • Onitsha, Enugu", phrase: "Kedu? — How are you?", color: "#76FF03", flag: "🇳🇬" },
  { id: "pidgin", name: "Nigerian Pidgin", native: "Pidgin", speakers: "~75M", region: "Lingua franca • Everywhere", phrase: "How you dey? — How are you?", color: "#00E5FF", flag: "🇳🇬" },
  { id: "swahili", name: "Swahili", native: "Kiswahili", speakers: "~100M+", region: "Kenya, Tanzania, EAC", phrase: "Mambo vipi? — What's up?", color: "#2962FF", flag: "🇰🇪" },
  { id: "amharic", name: "Amharic", native: "አማርኛ", speakers: "~22M", region: "Ethiopia • Addis Ababa", phrase: "Selam! — Hello!", color: "#76FF03", flag: "🇪🇹" },
  { id: "zulu", name: "Zulu", native: "isiZulu", speakers: "~12M", region: "South Africa • KZN", phrase: "Sawubona! — Hello!", color: "#00E5FF", flag: "🇿🇦" },
  { id: "xhosa", name: "Xhosa", native: "isiXhosa", speakers: "~8M", region: "South Africa • Eastern Cape", phrase: "Molo! — Hello!", color: "#2962FF", flag: "🇿🇦" },
  { id: "arabic", name: "Arabic", native: "العربية", speakers: "~150M", region: "North Africa • Egypt, Morocco", phrase: "Marhaba! — Hello!", color: "#76FF03", flag: "🇪🇬" },
  { id: "french", name: "French", native: "Français", speakers: "~120M", region: "West/Central Africa • Dakar, Abidjan", phrase: "Bonjour! — Hello!", color: "#00E5FF", flag: "🇸🇳" },
  { id: "portuguese", name: "Portuguese", native: "Português", speakers: "~30M", region: "Angola, Mozambique", phrase: "Olá! — Hello!", color: "#2962FF", flag: "🇦🇴" },
  { id: "english", name: "English", native: "English", speakers: "~200M", region: "Pan-African business lingua", phrase: "How far? — What's up?", color: "#76FF03", flag: "🌍" },
];

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    const targets = el.querySelectorAll(".reveal, .reveal-left, .reveal-right, .drop-card");
    targets.forEach(t => io.observe(t));
    // also observe self if it has class
    if (el.classList.contains("reveal") || el.classList.contains("drop-card") || el.classList.contains("reveal-left") || el.classList.contains("reveal-right")) {
      io.observe(el);
    }
    return () => io.disconnect();
  }, []);
  return ref;
}

export default function LanguagesPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [playingLang, setPlayingLang] = useState<string | null>(null);

  const heroRef = useReveal();
  const mapRef = useReveal();
  const gridRef = useReveal();
  const storiesRef = useReveal();
  const meshRef = useReveal();
  const flowRef = useReveal();

  useEffect(() => {
    if (playingLang) {
      const t = setTimeout(() => setPlayingLang(null), 2400);
      return () => clearTimeout(t);
    }
  }, [playingLang]);

  return (
    <div
      data-safe-area-inset-root
      className="min-h-screen w-full bg-white text-[#0F172A] overflow-x-clip"
      style={{ boxSizing: "border-box", paddingTop: "var(--safe-area-inset-top)" }}
    >
      {/* NAV */}
      <header
        data-safe-area-sticky-top
        className="sticky z-50 w-full border-b border-[#E2E8F0]/80 bg-white/85 glass"
        style={{ top: "var(--safe-area-inset-top)" }}
      >
        <div className="mx-auto max-w-[1280px] flex h-[72px] items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="AiKOVA logo" className="h-9 w-9 rounded-xl object-cover shadow-sm" />
            <span className="font-[Sora] font-extrabold tracking-tight text-[18px]">AiKOVA</span>
            <span className="ml-2 hidden sm:inline-flex items-center rounded-full bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1 text-[11px] font-bold tracking-widest">No.4 / 11 • LANGUAGES</span>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            {["Features","Solutions","Languages","Pricing","Demo"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`text-[14px] font-medium transition ${item==="Languages" ? "text-[#0F172A] font-bold relative after:absolute after:-bottom-2 after:left-0 after:h-[3px] after:w-full after:rounded-full after:bg-gradient-to-r after:from-[#00E5FF] after:via-[#2962FF] after:to-[#76FF03]" : "text-[#64748B] hover:text-[#0F172A]"}`}
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <button className="h-10 rounded-full border border-[#E2E8F0] bg-white px-5 text-[14px] font-semibold hover:bg-[#F8FAFC] transition">Sign in</button>
            <button
              onClick={() => setDemoOpen(true)}
              className="h-10 rounded-full px-6 text-[14px] font-bold text-white shadow-[0_8px_20px_-8px_rgba(41,98,255,0.5)] transition hover:brightness-110"
              style={{ background: "linear-gradient(102deg, #00E5FF 0%, #2962FF 52%, #76FF03 100%)" }}
            >
              Book demo
            </button>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden h-10 w-10 grid place-items-center rounded-full border border-[#E2E8F0]"
            aria-label="Menu"
          >
            <div className="space-y-1.5">
              <div className={`h-0.5 w-4 bg-[#0F172A] transition ${mobileOpen ? "translate-y-2 rotate-45" : ""}`} />
              <div className={`h-0.5 w-4 bg-[#0F172A] transition ${mobileOpen ? "opacity-0" : ""}`} />
              <div className={`h-0.5 w-4 bg-[#0F172A] transition ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`} />
            </div>
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-[#E2E8F0] bg-white px-6 py-6">
            <div className="flex flex-col gap-4">
              {["Features","Solutions","Languages","Pricing","Demo"].map(i => (
                <a key={i} href={i==="Features"?"/features":i==="Solutions"?"/solutions":i==="Languages"?"/languages":i==="Pricing"?"/pricing":i==="Demo"?"/business":"#"} onClick={()=>setMobileOpen(false)} className={`text-[15px] ${i==="Languages" ? "font-bold" : "text-[#64748B]"}`}>{i}</a>
              ))}
              <button onClick={()=>{setMobileOpen(false); setDemoOpen(true)}} className="mt-2 h-11 rounded-full font-bold text-white" style={{ background:"linear-gradient(102deg, #00E5FF 0%, #2962FF 52%, #76FF03 100%)"}}>Book demo</button>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section ref={heroRef} id="languages" className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 h-[600px] w-[600px] rounded-full blur-[120px] opacity-[0.12]" style={{ background:"radial-gradient(60% 60% at 50% 50%, #00E5FF 0%, #2962FF 50%, transparent 80%)"}} />
          <div className="absolute top-[40%] -left-24 h-[500px] w-[500px] rounded-full blur-[120px] opacity-[0.10]" style={{ background:"radial-gradient(60% 60% at 50% 50%, #76FF03 0%, #2962FF 80%, transparent)"}} />
        </div>

        <div className="relative mx-auto max-w-[1280px] px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
            {/* left */}
            <div>
              <div className="reveal inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-1.5 text-[11px] font-bold tracking-[0.14em] uppercase">
                <span className="h-2 w-2 rounded-full animate-pulse" style={{ background:"linear-gradient(90deg,#00E5FF,#76FF03)"}} />
                Languages • Africa is 2000+ languages
              </div>

              <h1 className="reveal mt-6 font-[Sora] text-[42px] lg:text-[64px] leading-[0.95] font-extrabold tracking-[-0.03em]">
                Speak like <br />
                <span className="gradient-text">a local.</span> <br />
                Everywhere <br />
                in Africa.
              </h1>

              <p className="reveal mt-6 max-w-[560px] text-[17px] leading-[1.6] text-[#475569]">
                From Yoruba to Swahili to Zulu to Amharic to Arabic. AiKOVA detects accent in <span className="font-bold text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] px-2 py-0.5 rounded-full text-[13px]">3 seconds</span> and mirrors it. Builds trust no foreign bot can.
              </p>

              <div className="reveal mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setDemoOpen(true)}
                  className="group h-[48px] rounded-full px-7 text-[15px] font-bold text-white flex items-center gap-2 shadow-[0_12px_28px_-10px_rgba(41,98,255,0.6)] hover:shadow-[0_18px_40px_-12px_rgba(41,98,255,0.6)] transition-all hover:-translate-y-0.5"
                  style={{ background:"linear-gradient(102deg, #00E5FF 0%, #2962FF 52%, #76FF03 100%)" }}
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-white/20">▶</span>
                  Hear Yoruba vs Swahili Demo
                </button>
                <span className="text-[13px] text-[#64748B]">No credit card • 96.2% accent accuracy</span>
              </div>

              <div className="reveal mt-10 flex items-center gap-6">
                <div className="flex -space-x-2">
                  {[lagosWomanUrl, nairobiManUrl, tripleWomenUrl].map((u,i)=>(
                    <img key={i} src={u} alt="African speaker" className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-sm" />
                  ))}
                </div>
                <p className="text-[13px] leading-[1.4] text-[#64748B]">Trusted by teams serving<br /><span className="font-semibold text-[#0F172A]">Lagos, Nairobi, Accra, Kigali, Jozi</span></p>
              </div>
            </div>

            {/* right image with badges */}
            <div className="reveal relative">
              <div className="relative rounded-[2rem] bg-white p-2 shadow-[0_24px_80px_-20px_rgba(15,23,42,0.18)] border border-[#E2E8F0]">
                <div className="relative overflow-hidden rounded-[1.6rem]">
                  <img src={diverseGroupUrl} alt="Five tribes together - diverse African team" className="h-[520px] lg:h-[620px] w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/90 glass border border-white p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-[#76FF03] animate-pulse" />
                      <span className="text-[12px] font-bold tracking-wide">LIVE • Mirroring Yoruba + Pidgin + Igbo</span>
                    </div>
                    <span className="text-[11px] font-medium px-2 py-1 rounded-full bg-[#0F172A] text-white">LOCAL VOICE MESH</span>
                  </div>
                </div>
              </div>

              {/* floating badges */}
              <div className="float-a absolute -top-3 -right-2 lg:-right-6 rounded-full border border-[#E2E8F0] bg-white px-4 py-2 shadow-[0_12px_32px_-12px_rgba(15,23,42,0.2)] flex items-center gap-2">
                <span className="h-6 w-6 grid place-items-center rounded-full text-[12px] bg-[#F8FAFC]">🇳🇬</span>
                <span className="text-[13px] font-bold">Bawo ni? • Yoruba</span>
                <span className="h-5 w-5 grid place-items-center rounded-full bg-[#0F172A] text-white text-[10px]">♪</span>
              </div>

              <div className="float-b absolute top-[42%] -left-4 lg:-left-10 rounded-full border border-[#E2E8F0] bg-white px-4 py-2.5 shadow-[0_12px_32px_-12px_rgba(15,23,42,0.2)] flex items-center gap-2">
                <span className="h-6 w-6 grid place-items-center rounded-full bg-[#E0F2FE] text-[12px]">🇰🇪</span>
                <div className="leading-[1.1]">
                  <div className="text-[12px] font-bold">Mambo vipi?</div>
                  <div className="text-[11px] text-[#64748B]">Swahili • Nairobi</div>
                </div>
                <span className="ml-1 h-2 w-2 rounded-full bg-[#76FF03]" />
              </div>

              <div className="float-c absolute -bottom-6 left-8 lg:left-16 rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 shadow-[0_16px_40px_-16px_rgba(15,23,42,0.25)]">
                <div className="flex items-center gap-3">
                  <img src={lagosWomanUrl} alt="Yoruba speaker" className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <div className="text-[12px] font-bold flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#00E5FF]" /> Pidgin • “How you dey?”</div>
                    <div className="text-[11px] text-[#64748B]">Detected in 1.8s • Mirrored</div>
                  </div>
                </div>
                <div className="mt-2 h-1 w-full rounded-full bg-[#F1F5F9] overflow-hidden">
                  <div className="h-full w-[92%] rounded-full" style={{ background:"linear-gradient(90deg,#00E5FF,#2962FF,#76FF03)"}} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAP INFOGRAPHIC */}
      <section ref={mapRef} className="bg-[#F8FAFC] border-y border-[#E2E8F0]">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="reveal inline-flex items-center gap-2 rounded-full bg-white border border-[#E2E8F0] px-3 py-1 text-[11px] font-bold tracking-widest">MAP • COVERAGE</div>
            <h2 className="reveal mt-4 font-[Sora] text-[32px] lg:text-[48px] leading-[0.95] font-bold tracking-tight">African Language Diversity<br /><span className="gradient-text">Major Languages We Cover</span></h2>
            <p className="reveal mt-4 text-[15px] leading-[1.6] text-[#64748B]">Our Local Voice Mesh was trained on 2000+ hours of hyperlocal audio from markets, boda stages, and WhatsApp voice notes. Not textbook. Real street speech.</p>
          </div>

          <div className="reveal mt-10 relative mx-auto max-w-[1100px]">
            <div className="rounded-[2rem] bg-white border border-[#E2E8F0] shadow-[0_20px_80px_-24px_rgba(15,23,42,0.18)] p-3 lg:p-4">
              <div className="rounded-[1.5rem] overflow-hidden bg-[#F8FAFC] border border-[#E2E8F0]">
                <img src={mapInfographicUrl} alt="African Language Diversity map infographic showing major languages" className="w-full h-auto object-contain" />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 px-2 lg:px-4 py-4">
                <div className="flex items-center gap-2 text-[12px]"><span className="h-2 w-2 rounded-full bg-[#00E5FF]" /> Niger-Congo family <span className="h-2 w-2 rounded-full bg-[#2962FF] ml-3" /> Afro-Asiatic <span className="h-2 w-2 rounded-full bg-[#76FF03] ml-3" /> Nilo-Saharan</div>
                <div className="text-[11px] font-bold tracking-widest text-[#94A3B8]">SOURCE • AIKOVA RESEARCH LAB • 2000+ LANGS MAPPED</div>
              </div>
            </div>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-[1100px] mx-auto">
            {[
              { title:"Why it Matters", desc:"Customer drops 40% more when you answer in their mother tongue. In Lagos, 68% prefer Pidgin over formal English for complaints.", icon:"💬" },
              { title:"Language Families", desc:"We cover 4 major phyla: Niger-Congo (Yoruba, Swahili, Zulu), Afro-Asiatic (Hausa, Amharic, Arabic), Nilo-Saharan, Austronesian.", icon:"🌍" },
              { title:"Key Fact", desc:"Nigeria alone has 520+ languages. Our mesh detects micro-accents: Ibadan Yoruba vs Lagos Yoruba in under 200ms.", icon:"⚡" },
            ].map((c,i)=>(
              <div key={i} className="reveal rounded-2xl bg-white border border-[#E2E8F0] p-6 shadow-sm hover:shadow-[0_16px_40px_-20px_rgba(15,23,42,0.15)] transition">
                <div className="h-10 w-10 rounded-full grid place-items-center bg-[#F8FAFC] border border-[#E2E8F0] text-[18px]">{c.icon}</div>
                <h4 className="mt-4 font-bold text-[16px]">{c.title}</h4>
                <p className="mt-2 text-[14px] leading-[1.6] text-[#64748B]">{c.desc}</p>
                <div className="mt-4 h-[3px] w-full rounded-full" style={{ background:"linear-gradient(90deg,#00E5FF,#2962FF,#76FF03)"}} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LANGUAGE CARDS GRID */}
      <section ref={gridRef} id="features" className="bg-white">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-16 lg:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="reveal inline-flex items-center gap-2 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1 text-[11px] font-bold tracking-widest">12 LANGUAGES • LIVE</div>
              <h2 className="reveal mt-4 font-[Sora] text-[32px] lg:text-[44px] leading-[0.95] font-bold">Built for the street.<br />Not the textbook.</h2>
            </div>
            <p className="reveal max-w-[420px] text-[14px] leading-[1.6] text-[#64748B]">Each card is a live accent model. Tap to hear AiKOVA mirror the slang, speed, and softness. Street tested in Computer Village and Kariakoo.</p>
          </div>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {LANGUAGES.map((lang, idx) => (
              <div
                key={lang.id}
                className="drop-card group relative rounded-[1.5rem] bg-white border border-[#E2E8F0] shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)] hover:shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                style={{ transitionDelay: `${idx * 60}ms` }}
              >
                <div className="h-[4px] w-full" style={{ background:`linear-gradient(90deg, ${lang.color}, #2962FF)`}} />
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] grid place-items-center text-[18px]">{lang.flag}</div>
                      <div>
                        <div className="font-bold text-[16px] leading-[1.1]">{lang.name}</div>
                        <div className="text-[12px] text-[#94A3B8] font-medium">{lang.native}</div>
                      </div>
                    </div>
                    <span className="rounded-full bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1 text-[11px] font-bold">{lang.speakers}</span>
                  </div>

                  <div className="mt-4 inline-flex rounded-full bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1 text-[11px] text-[#64748B]">{lang.region}</div>

                  <div className="mt-5 rounded-xl bg-[#0F172A] text-white p-3 flex items-center justify-between">
                    <div className="text-[13px] font-medium">"{lang.phrase}"</div>
                    <button
                      onClick={() => setPlayingLang(lang.id)}
                      className="h-7 w-7 rounded-full bg-white text-[#0F172A] grid place-items-center hover:scale-110 transition"
                    >
                      {playingLang === lang.id ? (
                        <span className="flex gap-0.5"><span className="w-0.5 h-3 bg-[#0F172A] animate-[shimmer_0.6s_infinite]"/><span className="w-0.5 h-2 bg-[#0F172A] animate-[shimmer_0.6s_infinite_0.1s]"/><span className="w-0.5 h-3 bg-[#0F172A] animate-[shimmer_0.6s_infinite_0.2s]"/></span>
                      ) : "▶"}
                    </button>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-[11px] text-[#64748B]">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: lang.color }} />
                    Accent mirrored in 2.4s • 96% match
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VISUAL STORIES */}
      <section ref={storiesRef} id="solutions" className="bg-[#F8FAFC] border-y border-[#E2E8F0]">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-16 lg:py-24">
          <div className="reveal text-center">
            <div className="inline-flex rounded-full bg-white border border-[#E2E8F0] px-3 py-1 text-[11px] font-bold tracking-widest">VISUAL STORIES • REAL PEOPLE</div>
            <h2 className="mt-4 font-[Sora] text-[32px] lg:text-[48px] font-bold leading-[0.9]">Images speak more.<br />So we show, not tell.</h2>
          </div>

          {/* Row 1 */}
          <div className="mt-16 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="reveal-left relative rounded-[2rem] overflow-hidden bg-white border border-[#E2E8F0] shadow-[0_20px_60px_-24px_rgba(15,23,42,0.2)] p-2">
              <img src={lagosWomanUrl} alt="Lagos Yoruba woman - market vibe" className="h-[520px] w-full object-cover rounded-[1.5rem]" />
              <div className="absolute left-6 bottom-6 rounded-full bg-white/95 glass border border-[#E2E8F0] px-4 py-2 text-[12px] font-bold flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#00E5FF]" /> LAGOS • YABA MARKET • PIDGIN MODE
              </div>
            </div>
            <div className="reveal-right">
              <div className="inline-flex items-center gap-2 rounded-full bg-white border border-[#E2E8F0] px-3 py-1 text-[11px] font-bold"><span>🇳🇬</span> YORUBA & PIDGIN • LAGOS HUSTLE</div>
              <h3 className="mt-4 font-[Sora] text-[28px] lg:text-[36px] font-bold leading-[0.95]">Ibadan vs Lagos accent —<br /><span className="gradient-text">AiKOVA mirrors it.</span></h3>
              <p className="mt-4 text-[16px] leading-[1.7] text-[#475569]">In Lagos, Yoruba is soft and fast, mixed with Pidgin every 2nd sentence. Our model learned from 400+ danfo drivers and market women in Yaba. When a caller says “Bawo ni, how you dey?”, AiKOVA answers same energy: warm, rapid, respectful.</p>
              <div className="mt-6 space-y-3">
                {[
                  "Detects Lagos Yoruba vs Oyo Yoruba in 1.2s",
                  "Auto-switches to Pidgin when trust drops",
                  "Uses ‘Abeg’, ‘Shey’, ‘Oya now’ naturally",
                ].map(t=>(
                  <div key={t} className="flex items-center gap-3 text-[14px]"><span className="h-6 w-6 rounded-full grid place-items-center bg-[#0F172A] text-white text-[12px]">✓</span><span className="text-[#334155]">{t}</span></div>
                ))}
              </div>
              <div className="mt-8 rounded-2xl bg-white border border-[#E2E8F0] p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#F8FAFC] border grid place-items-center">🎧</div>
                <div className="text-[13px]"><div className="font-bold">Customer: “Bawo ni, my order never come”</div><div className="text-[#64748B]">AiKOVA: “Ah, sorry o! Make I check now now. E go come today.”</div></div>
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="mt-20 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="reveal-left lg:order-2 relative rounded-[2rem] overflow-hidden bg-white border border-[#E2E8F0] shadow-[0_20px_60px_-24px_rgba(15,23,42,0.2)] p-2">
              <img src={nairobiManUrl} alt="Nairobi Swahili WhatsApp man" className="h-[520px] w-full object-cover rounded-[1.5rem]" />
              <div className="absolute right-6 bottom-6 rounded-2xl bg-[#0F172A] text-white px-4 py-3 text-[12px] shadow-lg">
                <div className="flex items-center gap-2 font-bold"><span className="h-2 w-2 rounded-full bg-[#76FF03] animate-pulse" /> WhatsApp Voice Note • Swahili + Sheng</div>
                <div className="mt-2 flex gap-1">
                  {[...Array(18)].map((_,i)=>(<span key={i} className="h-3 w-0.5 rounded-full bg-white/70" style={{ height: `${6 + Math.sin(i)*6 + 8}px`}} />))}
                </div>
              </div>
            </div>
            <div className="reveal-right lg:order-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-white border border-[#E2E8F0] px-3 py-1 text-[11px] font-bold"><span>🇰🇪</span> SWAHILI • NAIROBI & DAR</div>
              <h3 className="mt-4 font-[Sora] text-[28px] lg:text-[36px] font-bold leading-[0.95]">Sheng slang integrated.<br /><span className="gradient-text">WhatsApp voice notes.</span></h3>
              <p className="mt-4 text-[16px] leading-[1.7] text-[#475569]">In Nairobi, no one speaks pure Swahili. It’s Swahili + Sheng + English in one sentence. “Mambo, bro, uko na doo?”. AiKOVA trained on 300k WhatsApp voice notes from boda riders, mama mboga, and Eastlands. It understands speed, background matatu noise, and replies with same rhythm.</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { k:"Sheng words", v:"1,200+" },
                  { k:"Matatu noise cancel", v:"-32dB" },
                  { k:"Voice note length", v:"Up to 90s" },
                  { k:"Trust lift", v:"+47%" },
                ].map(s=>(
                  <div key={s.k} className="rounded-xl bg-white border border-[#E2E8F0] p-3">
                    <div className="text-[18px] font-extrabold">{s.v}</div>
                    <div className="text-[11px] text-[#64748B] uppercase tracking-wide">{s.k}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 3 triple */}
          <div className="mt-20 reveal rounded-[2rem] bg-white border border-[#E2E8F0] shadow-[0_20px_80px_-20px_rgba(15,23,42,0.15)] p-3 lg:p-4">
            <div className="relative rounded-[1.6rem] overflow-hidden">
              <img src={tripleWomenUrl} alt="Ethiopian Amharic, South African Zulu Xhosa, North African Arabic women" className="w-full h-[420px] lg:h-[560px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
                {[
                  { label:"🇪🇹 Amharic • Addis • Soft, melodic", pos:"left" },
                  { label:"🇿🇦 Zulu / Xhosa • Clicks honored", pos:"center" },
                  { label:"🇪🇬 Arabic • Cairo • Warm, respectful", pos:"right" },
                ].map(b=>(
                  <span key={b.label} className="rounded-full bg-white/90 glass border border-white px-3 py-1.5 text-[12px] font-bold">{b.label}</span>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div className="text-white max-w-xl">
                  <h4 className="font-[Sora] text-[24px] lg:text-[32px] font-bold leading-[0.9]">One Africa. Many voices.<br />AiKOVA respects every single one.</h4>
                  <p className="mt-3 text-[14px] text-white/80 leading-[1.6]">From Amharic's rhythmic flow to Zulu's clicks and Arabic's depth — our TTS doesn't approximate. It mirrors, with pride.</p>
                </div>
                <div className="rounded-2xl bg-white text-[#0F172A] px-5 py-3 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full grid place-items-center bg-[#0F172A] text-white">♥</div>
                  <div className="text-[13px] leading-[1.2]"><div className="font-bold">96.2% accent accuracy</div><div className="text-[#64748B]">Verified by native speakers</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOCAL VOICE MESH */}
      <section ref={meshRef} id="pricing" className="bg-white">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="reveal inline-flex items-center gap-2 rounded-full bg-[#0F172A] text-white px-3.5 py-1.5 text-[11px] font-bold tracking-widest"><span className="h-2 w-2 rounded-full bg-[#76FF03] animate-pulse" /> LOCAL VOICE MESH • DEEP DIVE</div>
            <h2 className="reveal mt-5 font-[Sora] text-[32px] lg:text-[52px] font-bold leading-[0.9]">Hyperlocal Accent Detection<br /><span className="gradient-text">96.2% Accuracy</span></h2>
            <p className="reveal mt-4 text-[15px] text-[#64748B] leading-[1.6]">Not one model for Africa. 120 micro-models, each tuned to a street, market, tribe. Built like a mesh, not a monolith.</p>
          </div>

          <div className="reveal mt-10 rounded-[2rem] bg-white border border-[#E2E8F0] shadow-[0_24px_80px_-24px_rgba(15,23,42,0.2)] p-3 lg:p-5">
            <div className="rounded-[1.6rem] overflow-hidden border border-[#E2E8F0] bg-[#F8FAFC]">
              <img src={voiceMeshUrl} alt="Local Voice Mesh infographic - hyperlocal accent detection" className="w-full h-auto object-contain" />
            </div>
            <div className="grid md:grid-cols-3 gap-4 mt-5">
              {[
                { step:"01", title:"Voice Input Captured Locally", desc:"Audio stays on edge. No cloud round-trip. Background noise filtered - danfo horns, market chatter removed in 40ms.", icon:"🎙️" },
                { step:"02", title:"Accent & Intent Analysis <200ms", desc:"Whisper fine-tuned on African data + 120 accent classifiers. Detects tribe, city, age group, emotion.", icon:"🧠" },
                { step:"03", title:"Adaptive Response in Local Style", desc:"TTS mirrors speed, pitch, slang. If you say 'How you dey?' it never replies 'How are you?' It replies 'I dey fine!'", icon:"💬" },
              ].map(s=>(
                <div key={s.step} className="rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-5">
                  <div className="flex items-center justify-between">
                    <div className="h-9 w-9 rounded-full bg-white border border-[#E2E8F0] grid place-items-center text-[16px]">{s.icon}</div>
                    <span className="text-[11px] font-extrabold tracking-widest text-[#94A3B8]">STEP {s.step}</span>
                  </div>
                  <h4 className="mt-4 font-bold text-[15px] leading-[1.2]">{s.title}</h4>
                  <p className="mt-2 text-[13px] leading-[1.6] text-[#64748B]">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS FLOW */}
      <section ref={flowRef} className="bg-[#0F172A] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0" style={{ background:"radial-gradient(600px 400px at 20% 0%, rgba(0,229,255,0.25), transparent), radial-gradient(500px 400px at 80% 100%, rgba(118,255,3,0.2), transparent)"}} />
        </div>
        <div className="relative mx-auto max-w-[1280px] px-6 lg:px-8 py-16 lg:py-24">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="reveal font-[Sora] text-[28px] lg:text-[40px] font-bold leading-[0.9]">How it works — <span className="text-[#94A3B8]">the trust road</span></h2>
            <div className="reveal rounded-full bg-white/10 border border-white/15 px-4 py-1.5 text-[12px]">Avg latency 1.4s end-to-end</div>
          </div>

          <div className="mt-14 relative">
            {/* gradient road line */}
            <div className="hidden lg:block absolute top-[46px] left-[5%] right-[5%] h-[4px] rounded-full opacity-70" style={{ background:"linear-gradient(90deg, #00E5FF 0%, #2962FF 50%, #76FF03 100%)"}} />
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-4">
              {[
                { title:"Customer speaks", sub:"Yoruba, Pidgin, Sheng, any mix", icon:"👋", detail:"'Bawo ni? My order don delay'" },
                { title:"Whisper STT fine-tuned", sub:"Trained on 2000h African audio", icon:"🎧", detail:"94% WER on Pidgin • 32dB noise cancel" },
                { title:"Accent detect", sub:"120 micro-models mesh", icon:"📍", detail:"Lagos vs Ibadan in 200ms" },
                { title:"Mirrored TTS", sub:"Same slang, same warmth", icon:"🗣️", detail:"'Ah sorry o, make I check now'" },
                { title:"Trust built", sub:"No foreign bot feel", icon:"🤝", detail:"+40% retention, -60% drop" },
              ].map((step, i)=>(
                <div key={i} className="reveal relative">
                  <div className="hidden lg:grid absolute -top-2 left-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-white border-4 border-[#0F172A] place-items-center shadow-[0_0_0_4px_rgba(41,98,255,0.3)]" />
                  <div className="rounded-[1.4rem] bg-white/[0.06] border border-white/10 backdrop-blur p-5 hover:bg-white/[0.09] transition">
                    <div className="h-12 w-12 rounded-full bg-white text-[#0F172A] grid place-items-center text-[20px] font-bold shadow">{step.icon}</div>
                    <h4 className="mt-4 font-bold text-[15px]">{step.title}</h4>
                    <p className="mt-1 text-[12px] text-white/60">{step.sub}</p>
                    <div className="mt-4 rounded-xl bg-[#0F172A] border border-white/10 p-3 text-[11px] text-white/70 font-mono">“{step.detail}”</div>
                  </div>
                  {i < 4 && <div className="lg:hidden mx-auto my-2 h-6 w-0.5 bg-gradient-to-b from-[#00E5FF] to-[#2962FF] opacity-60" />}
                </div>
              ))}
            </div>
          </div>

          <div className="reveal mt-14 rounded-2xl bg-white text-[#0F172A] p-5 lg:p-6 flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full grid place-items-center text-white font-bold" style={{ background:"linear-gradient(135deg,#00E5FF,#2962FF)"}}>✓</div>
              <div><div className="font-bold text-[16px]">Production-ready • No hallucinations in local slang</div><div className="text-[13px] text-[#64748B]">Guardrails ensure ‘Abeg’ doesn’t become rude, Zulu clicks are respected, Amharic stays melodic.</div></div>
            </div>
            <button onClick={()=>setDemoOpen(true)} className="h-11 rounded-full bg-[#0F172A] text-white px-6 text-[14px] font-bold hover:bg-black transition">See live trace →</button>
          </div>
        </div>
      </section>

      {/* CTA BANNER GRADIENT */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" style={{ background:"linear-gradient(102deg, #00E5FF 0%, #2962FF 52%, #76FF03 100%)"}} />
        <div className="absolute inset-0 opacity-20" style={{ background:"radial-gradient(800px 400px at 30% 20%, white, transparent)"}} />
        <div className="relative mx-auto max-w-[1280px] px-6 lg:px-8 py-12 lg:py-20 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-[Sora] text-[28px] lg:text-[42px] font-extrabold leading-[0.9] text-white">Your customers speak<br />Yoruba, Hausa, Swahili?<br />AiKOVA answers same language.</h2>
            <p className="mt-4 text-[15px] text-white/85 max-w-xl">Stop losing trust with robotic English. Mirror their street, their pride, their slang. 96.2% accent accuracy, edge-first, WhatsApp native.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button
              onClick={()=>setDemoOpen(true)}
              className="h-[52px] rounded-full bg-white text-[#0F172A] px-8 font-bold text-[15px] shadow-[0_12px_32px_-12px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition"
            >
              Book 15-min demo
            </button>
            <button className="h-[52px] rounded-full bg-[#0F172A]/20 border border-white/30 text-white px-8 font-semibold text-[15px] backdrop-blur hover:bg-[#0F172A]/30 transition">View pricing →</button>
          </div>
        </div>
        <div className="relative h-px w-full bg-white/20" />
        <div className="relative flex items-center gap-6 overflow-hidden py-3 bg-black/10 backdrop-blur">
          <div className="flex animate-[shimmer_12s_linear_infinite] gap-8 whitespace-nowrap" style={{ backgroundSize:"200% 100%" }}>
            {[...Array(2)].map((_, dup)=>(
              <span key={dup} className="flex gap-8 text-[12px] font-bold tracking-widest text-white/80">
                <span>BAWO NI? • MAMBO VIPI? • SAWUBONA • SELAM • MARHABA • HOW YOU DEY? • KEDU? • SANNU • MOLO • BONJOUR • OLÁ</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#F8FAFC] border-t border-[#E2E8F0]">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr] gap-10">
            <div>
              <div className="flex items-center gap-3">
                <img src={logoUrl} alt="AiKOVA" className="h-9 w-9 rounded-xl object-cover" />
                <span className="font-[Sora] font-extrabold text-[18px]">AiKOVA</span>
              </div>
              <p className="mt-4 text-[13px] leading-[1.6] text-[#64748B] max-w-[320px]">Ai Receptionist that speaks like a local. Everywhere in Africa. Built in Lagos, Nairobi, Accra — for Africa.</p>
              <div className="mt-4 inline-flex rounded-full bg-white border border-[#E2E8F0] px-3 py-1 text-[11px] font-bold">PAGE 4 OF 11 • LANGUAGES • WHITE THEME</div>
            </div>
            {[
              { title:"Product", links:["Features","Local Voice Mesh","Accent Map","WhatsApp Voice"] },
              { title:"Languages", links:["Yoruba & Pidgin","Swahili & Sheng","Amharic","Zulu & Xhosa","Arabic & French"] },
              { title:"Company", links:["Our story","Careers (Lagos, Nairobi)","Contact","Book demo"] },
            ].map(col=>(
              <div key={col.title}>
                <div className="font-bold text-[13px] tracking-wide">{col.title}</div>
                <div className="mt-4 space-y-2.5">
                  {col.links.map(l=>(
                    <a key={l} href={({"Features":"/features","Solutions":"/solutions","Languages":"/languages","How It Works":"/how-it-works","How it Works":"/how-it-works","Pricing":"/pricing","Company":"/company","Customers":"/customers","Resources":"/resources","Demo":"/business","Business":"/business","Product":"/features","Developers":"/resources","About":"/company","About us":"/company","Blog":"/resources","Contact":"/get-started","Careers":"/company","Press":"/company","Founder Story":"/company","API Docs":"/resources","Playbooks":"/resources","Market Insights":"/resources","Compliance":"/resources","Growth Roadmap":"/resources","Case Studies":"/customers","Wall of Love":"/customers","Invoca Benchmark":"/customers","M-Pesa Billing":"/pricing","Salons":"/solutions","Clinics":"/solutions","Real Estate":"/solutions","E-commerce":"/solutions","Privacy":"/get-started","Terms":"/get-started","NDPA":"/get-started"} as Record<string,string>)[l] ?? "#"} className="block text-[13px] text-[#64748B] hover:text-[#0F172A] transition">{l}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 pt-6 border-t border-[#E2E8F0] flex flex-col md:flex-row items-center justify-between gap-3 text-[12px] text-[#94A3B8]">
            <span>© 2026 AiKOVA Labs • Lagos • Nairobi • Accra • Cape Town</span>
            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#76FF03]" /> All images are real people, real streets. No stock.</span>
          </div>
        </div>
      </footer>

      {/* DEMO MODAL */}
      {demoOpen && (
        <div className="fixed inset-0 z-[100] grid place-items-center p-4">
          <div className="absolute inset-0 bg-[#0F172A]/60 backdrop-blur-[12px]" onClick={()=>setDemoOpen(false)} />
          <div className="relative w-full max-w-[520px] rounded-[1.8rem] bg-white border border-[#E2E8F0] shadow-[0_32px_100px_-24px_rgba(15,23,42,0.5)] overflow-hidden animate-[reveal_0.5s_cubic-bezier(0.16,1,0.3,1)]">
            <div className="h-[4px] w-full" style={{ background:"linear-gradient(90deg,#00E5FF,#2962FF,#76FF03)"}} />
            <div className="p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex rounded-full bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1 text-[11px] font-bold tracking-widest">LIVE DEMO • YORUBA vs SWAHILI</div>
                  <h3 className="mt-3 font-[Sora] text-[22px] font-bold leading-[0.95]">Hear AiKOVA mirror your customer</h3>
                  <p className="mt-2 text-[13px] text-[#64748B] leading-[1.5]">Choose a language, hear the street-accurate reply. Real TTS preview.</p>
                </div>
                <button onClick={()=>setDemoOpen(false)} className="h-9 w-9 grid place-items-center rounded-full bg-[#F8FAFC] border border-[#E2E8F0]">✕</button>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {LANGUAGES.slice(0,6).map(l=>(
                  <button
                    key={l.id}
                    onClick={()=>setPlayingLang(l.id)}
                    className={`rounded-2xl border p-3 text-left transition ${playingLang===l.id ? "bg-[#0F172A] text-white border-[#0F172A]" : "bg-white border-[#E2E8F0] hover:border-[#CBD5E1]"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-bold">{l.flag} {l.name}</span>
                      <span className={`h-6 w-6 grid place-items-center rounded-full text-[10px] ${playingLang===l.id ? "bg-white text-[#0F172A]" : "bg-[#F8FAFC] border"}`}>{playingLang===l.id ? "♫" : "▶"}</span>
                    </div>
                    <div className={`mt-1 text-[11px] ${playingLang===l.id ? "text-white/60" : "text-[#64748B]"}`}>{l.phrase}</div>
                  </button>
                ))}
              </div>

              {playingLang && (
                <div className="mt-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#0F172A] text-white grid place-items-center animate-pulse">♪</div>
                    <div className="flex-1">
                      <div className="h-1.5 w-full rounded-full bg-[#E2E8F0] overflow-hidden">
                        <div className="h-full w-[68%] rounded-full animate-[shimmer_1.2s_ease-in-out_infinite]" style={{ background:"linear-gradient(90deg,#00E5FF,#2962FF,#76FF03)", backgroundSize:"200% 100%"}} />
                      </div>
                      <div className="mt-2 text-[11px] text-[#64748B]">Mirroring accent... {LANGUAGES.find(l=>l.id===playingLang)?.region}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <button onClick={()=>setDemoOpen(false)} className="flex-1 h-11 rounded-full bg-[#0F172A] text-white font-bold text-[14px]">Book full demo</button>
                <button onClick={()=>setDemoOpen(false)} className="h-11 rounded-full border border-[#E2E8F0] px-6 font-semibold text-[14px]">Close</button>
              </div>
              <div className="mt-3 text-center text-[11px] text-[#94A3B8]">96.2% accuracy • Edge-first • No data leaves your region</div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes reveal {
          from { opacity:0; transform: translateY(16px) scale(0.98) }
          to { opacity:1; transform: translateY(0) scale(1) }
        }
      `}</style>
    </div>
  );
}
