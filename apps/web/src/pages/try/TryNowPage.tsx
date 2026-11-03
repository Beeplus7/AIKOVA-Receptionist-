import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useRegion, type RegionKey } from '../../context/RegionContext'
import { startSetupUrl, signInUrl } from '../../lib/setupFlow'
import {
  bizForRegion,
  chatScript,
  defaultLangForRegion,
  langsForRegion,
  scenariosFor,
  type TryLang,
} from '../../lib/tryInstant/languages'
import InstantTryCallPanel from '../../components/try/InstantTryCallPanel'

export default function TryNowPage() {
  const { region: ctxRegion, setRegion } = useRegion()
  const [params] = useSearchParams()
  const regionParam = params.get('region')
  const region: RegionKey =
    regionParam === 'africa' || regionParam === 'eurozone' || regionParam === 'uk'
      ? regionParam
      : ctxRegion

  const modeParam = params.get('mode')
  const [mode, setMode] = useState<'chat' | 'call'>(modeParam === 'call' ? 'call' : 'chat')
  const [lang, setLang] = useState<TryLang>(() => defaultLangForRegion(region))
  const biz = useMemo(() => bizForRegion(region), [region])
  const langOptions = useMemo(() => langsForRegion(region), [region])

  const greeting = useMemo(() => chatScript(region, lang)[0]?.text || 'Welcome.', [region, lang])
  const [log, setLog] = useState<{ from: 'ai' | 'user'; text: string }[]>([{ from: 'ai', text: greeting }])
  const [input, setInput] = useState('')

  useEffect(() => {
    setLang(defaultLangForRegion(region))
  }, [region])

  useEffect(() => {
    setLog([{ from: 'ai', text: chatScript(region, lang)[0]?.text || 'Welcome.' }])
  }, [region, lang])

  useEffect(() => {
    if (modeParam === 'call' || modeParam === 'chat') setMode(modeParam)
  }, [modeParam])

  const reply = (q: string) => {
    const lower = q.toLowerCase()
    const script = chatScript(region, lang)
    if (/table|book|reserv|tisch|mesa|tafel|tábìlì|8|20|19/.test(lower)) {
      return script[2]?.text || script[script.length - 1].text
    }
    if (/hour|close|ouvert|schließ|cierr|fech|sluit|àkókò/.test(lower)) {
      return lang === 'fr'
        ? 'Horaires démo : mar–dim 11:00–23:00. Après inscription on charge votre site.'
        : lang === 'de'
          ? 'Demo-Öffnungszeiten: Di–So 11:00–23:00. Nach Anmeldung laden wir Ihre Website.'
          : 'Demo hours: Tue–Sun 11:00–23:00. After signup we load your site knowledge.'
    }
    if (/pay|card|stripe|m-pesa|paystack|karte|tarjeta|cartão|káàdì/.test(lower)) {
      return `${biz.payment} demo for this region. Live checkout unlocks after signup.`
    }
    return script[script.length - 1]?.text || 'Demo only — sign up to go live.'
  }

  const send = (text: string) => {
    const q = text.trim()
    if (!q) return
    setLog((prev) => [...prev, { from: 'user', text: q }])
    setInput('')
    window.setTimeout(() => {
      setLog((prev) => [...prev, { from: 'ai', text: reply(q) }])
    }, 450)
  }

  return (
    <div className="min-h-screen bg-[#E6EBF4] text-[#0F172A]">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-[980px] px-4 h-14 flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Public try desk</div>
            <h1 className="text-[16px] font-extrabold tracking-tight">Try before you register</h1>
          </div>
          <div className="flex items-center gap-2">
            {(['africa', 'eurozone', 'uk'] as RegionKey[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRegion(r)}
                className={`h-8 px-2.5 rounded-full text-[11px] font-bold border ${
                  region === r ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                {r === 'africa' ? '🌍' : r === 'uk' ? '🇬🇧' : '🇪🇺'}
              </button>
            ))}
            <Link to={signInUrl(region)} className="hidden sm:inline h-9 px-3 rounded-full border border-slate-200 text-[12px] font-semibold items-center bg-white">
              Sign in
            </Link>
            <Link
              to={startSetupUrl(region)}
              className="h-9 px-4 rounded-full text-[12px] font-bold text-[#0F172A] inline-flex items-center"
              style={{ background: 'linear-gradient(102deg,#00E5FF,#2962FF,#76FF03)' }}
            >
              Start free trial
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[980px] px-4 py-6 grid gap-4 lg:grid-cols-[1fr_300px]">
        <section className="rounded-[24px] border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col min-h-[560px]">
          <div className="px-4 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[12px]">
            <span className="font-bold">
              {biz.name} · {biz.accent}
            </span>
            <div className="flex items-center gap-2">
              <div className="flex rounded-full border border-slate-200 p-0.5 bg-[#F8FAFC]">
                <button
                  type="button"
                  onClick={() => setMode('chat')}
                  className={`h-7 px-3 rounded-full text-[11px] font-bold ${mode === 'chat' ? 'bg-[#0F172A] text-white' : 'text-slate-600'}`}
                >
                  Chat
                </button>
                <button
                  type="button"
                  onClick={() => setMode('call')}
                  className={`h-7 px-3 rounded-full text-[11px] font-bold ${mode === 'call' ? 'bg-[#0F172A] text-white' : 'text-slate-600'}`}
                >
                  Voice call
                </button>
              </div>
              <span className="text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full font-bold text-[10px]">
                NOT LIVE · no auth
              </span>
            </div>
          </div>

          <div className="px-4 py-2 border-b border-slate-50 flex gap-1.5 overflow-x-auto">
            {langOptions.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLang(l.id)}
                className={`h-8 px-2.5 rounded-full text-[11px] font-bold border shrink-0 ${
                  lang === l.id ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                {l.short} · {l.label}
              </button>
            ))}
          </div>

          {mode === 'chat' ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-[#F8FAFC]">
                {log.map((m, i) => (
                  <div
                    key={i}
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-5 ${
                      m.from === 'ai' ? 'bg-white border border-slate-100 text-slate-800' : 'ml-auto bg-[#0F172A] text-white'
                    }`}
                  >
                    {m.text}
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-slate-100 flex flex-wrap gap-2">
                {scenariosFor(lang).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => send(s.prompt)}
                    className="h-8 px-3 rounded-full border border-slate-200 bg-white text-[11px] font-semibold text-slate-700 hover:border-slate-400"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <form
                className="p-3 border-t border-slate-100 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  send(input)
                }}
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a customer message…"
                  className="flex-1 h-11 rounded-xl border border-slate-200 bg-white px-3 text-[13px]"
                />
                <button type="submit" className="h-11 px-4 rounded-xl bg-[#0F172A] text-white text-[13px] font-bold">
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 p-4 bg-[#F8FAFC]">
              <InstantTryCallPanel region={region} lang={lang} />
            </div>
          )}
        </section>

        <aside className="space-y-3">
          <div className="rounded-[20px] border border-slate-200 bg-white p-4 text-[12px] leading-5 text-slate-600">
            <div className="text-[13px] font-bold text-slate-900">Voice trial (no signup)</div>
            <p className="mt-2">
              Book → 3s → <span className="font-semibold text-slate-900">real phone ring</span> via Twilio Polly. Trial numbers may need a one-time verify code first.
            </p>
            <ul className="mt-2 space-y-1.5 list-disc pl-4">
              <li>{biz.payment} · agent {biz.agent}</li>
              <li>Africa langs: YO · PCM · HA · IG · SW · ZU · AF</li>
              <li>5,000 AKC free trial · 14 days</li>
            </ul>
            <button
              type="button"
              onClick={() => setMode('call')}
              className="mt-3 h-10 w-full rounded-full bg-[#0F172A] text-white text-[12px] font-bold"
            >
              Open voice call trial
            </button>
            <Link
              to={startSetupUrl(region)}
              className="mt-2 h-10 w-full rounded-full text-[12px] font-bold text-[#0F172A] inline-flex items-center justify-center"
              style={{ background: 'linear-gradient(102deg,#00E5FF,#2962FF,#76FF03)' }}
            >
              Register & go live →
            </Link>
          </div>
          <Link to={region === 'africa' ? '/' : '/eu'} className="block text-center text-[12px] font-semibold text-slate-500 hover:text-slate-800">
            ← Back to marketing
          </Link>
        </aside>
      </main>
    </div>
  )
}
