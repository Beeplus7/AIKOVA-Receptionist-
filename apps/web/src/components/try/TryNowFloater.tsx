import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useRegion } from '../../context/RegionContext'
import { startSetupUrl } from '../../lib/setupFlow'
import {
  bizForRegion,
  chatScript,
  defaultLangForRegion,
  langsForRegion,
  type TryLang,
} from '../../lib/tryInstant/languages'
import InstantTryCallPanel from './InstantTryCallPanel'

function shouldShow(pathname: string) {
  if (pathname.startsWith('/app') || pathname.startsWith('/auth') || pathname.startsWith('/admin')) return false
  if (pathname.startsWith('/onboarding') || pathname.startsWith('/try')) return false
  if (pathname.startsWith('/readiness')) return false
  return true
}

type Mode = 'chat' | 'call'

export default function TryNowFloater() {
  const { pathname } = useLocation()
  const { region } = useRegion()
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<Mode>('chat')
  const [lang, setLang] = useState<TryLang>(() => defaultLangForRegion(region))
  const [step, setStep] = useState(0)
  const [busy, setBusy] = useState(false)
  const [started, setStarted] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  const biz = useMemo(() => bizForRegion(region), [region])
  const langOptions = useMemo(() => langsForRegion(region), [region])
  const lines = useMemo(() => chatScript(region, lang), [region, lang])
  const visible = lines.slice(0, Math.max(1, step))

  useEffect(() => {
    if (!open) return
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [step, open, mode])

  useEffect(() => {
    setStep(0)
    setStarted(false)
    setBusy(false)
    const next = defaultLangForRegion(region)
    setLang(next)
  }, [region])

  useEffect(() => {
    setStep(0)
    setStarted(false)
    setBusy(false)
  }, [lang])

  const openDemo = () => {
    setOpen(true)
    setStarted((was) => {
      if (!was) setStep(1)
      return true
    })
  }

  useEffect(() => {
    const onOpen = () => {
      setOpen(true)
      setMode('chat')
      setStarted((was) => {
        if (!was) setStep(1)
        return true
      })
    }
    const onCall = () => {
      setOpen(true)
      setMode('call')
    }
    window.addEventListener('aikova:try-now', onOpen)
    window.addEventListener('aikova:try-call', onCall)
    return () => {
      window.removeEventListener('aikova:try-now', onOpen)
      window.removeEventListener('aikova:try-call', onCall)
    }
  }, [])

  if (!shouldShow(pathname)) return null

  const playNext = () => {
    if (busy) return
    if (!started) {
      setStarted(true)
      setStep(1)
      return
    }
    if (step >= lines.length) return
    setBusy(true)
    window.setTimeout(() => {
      setStep((s) => Math.min(lines.length, s + 1))
      setBusy(false)
    }, 550)
  }

  const restart = () => {
    setStep(1)
    setStarted(true)
    setBusy(false)
  }

  const done = started && step >= lines.length

  return (
    <>
      {!open ? (
        <button
          type="button"
          onClick={openDemo}
          className="fixed z-[70] left-4 bottom-[88px] sm:left-6 sm:bottom-[76px] inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-[#0F172A] pl-2 pr-4 py-2 text-white shadow-[0_16px_40px_rgba(15,23,42,0.28)] hover:translate-y-[-1px] transition"
          style={{ animation: 'pulseGlow 2.8s ease-in-out infinite' }}
          aria-label="Try AiKOVA now without signing up"
        >
          <span
            className="h-9 w-9 rounded-full grid place-items-center text-[13px] font-black text-[#0F172A]"
            style={{ background: 'linear-gradient(102deg,#00E5FF,#2962FF,#76FF03)' }}
          >
            ▶
          </span>
          <span className="text-left leading-tight">
            <span className="block text-[12px] font-bold">Try now</span>
            <span className="block text-[10px] text-white/60">Chat · Voice · no signup</span>
          </span>
        </button>
      ) : null}

      {open ? (
        <div className="fixed z-[80] inset-x-3 bottom-3 sm:inset-x-auto sm:left-6 sm:bottom-[76px] sm:w-[400px] rounded-[24px] border border-[#E2E8F0] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.22)] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#F1F5F9] flex items-start justify-between gap-3 bg-[#F8FAFC]">
            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Instant try · no account</div>
              <div className="text-[14px] font-extrabold text-[#0F172A] truncate">{biz.name}</div>
              <div className="text-[11px] text-slate-500 truncate">
                {biz.agent} · {biz.phone} · {biz.payment}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-8 w-8 rounded-full border border-slate-200 bg-white text-slate-500 hover:text-slate-900"
              aria-label="Close try now"
            >
              ✕
            </button>
          </div>

          <div className="px-3 pt-2.5 flex items-center gap-2">
            <div className="flex rounded-full border border-slate-200 p-0.5 bg-white">
              {([
                { id: 'chat' as const, label: 'Chat' },
                { id: 'call' as const, label: 'Voice call' },
              ]).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setMode(t.id)}
                  className={`h-8 px-3 rounded-full text-[11px] font-bold ${
                    mode === t.id ? 'bg-[#0F172A] text-white' : 'text-slate-600'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-x-auto flex gap-1 pb-0.5">
              {langOptions.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLang(l.id)}
                  className={`h-7 px-2 rounded-full text-[10px] font-bold border shrink-0 ${
                    lang === l.id
                      ? 'bg-[#0F172A] text-white border-[#0F172A]'
                      : l.group === 'africa'
                        ? 'bg-[#ECFDF5] text-emerald-800 border-emerald-200'
                        : 'bg-white text-slate-600 border-slate-200'
                  }`}
                  title={l.label}
                >
                  {l.short}
                </button>
              ))}
            </div>
          </div>

          {mode === 'chat' ? (
            <>
              <div className="h-[260px] overflow-y-auto px-4 py-3 space-y-2.5 bg-white">
                {visible.map((m, i) => (
                  <div
                    key={`${lang}-${i}-${m.text.slice(0, 12)}`}
                    className={`max-w-[88%] rounded-2xl px-3 py-2 text-[13px] leading-5 ${
                      m.from === 'ai'
                        ? 'bg-[#F1F5F9] text-[#0F172A] rounded-tl-md'
                        : 'ml-auto bg-[#0F172A] text-white rounded-tr-md'
                    }`}
                  >
                    {m.text}
                  </div>
                ))}
                {busy ? (
                  <div className="text-[11px] font-semibold text-slate-400 animate-pulse">AiKOVA typing…</div>
                ) : null}
                <div ref={endRef} />
              </div>

              <div className="px-4 py-3 border-t border-[#F1F5F9] bg-[#F8FAFC] space-y-2">
                {!done ? (
                  <button
                    type="button"
                    onClick={playNext}
                    disabled={busy}
                    className="w-full h-11 rounded-full text-[13px] font-bold text-[#0F172A] disabled:opacity-50"
                    style={{ background: 'linear-gradient(102deg,#00E5FF,#2962FF,#76FF03)' }}
                  >
                    {!started ? 'Start 30s try' : busy ? '…' : 'Continue conversation'}
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={restart}
                      className="h-11 rounded-full border border-slate-200 bg-white text-[12px] font-semibold text-slate-700"
                    >
                      Replay
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('call')}
                      className="h-11 rounded-full text-[12px] font-bold text-[#0F172A] inline-flex items-center justify-center"
                      style={{ background: 'linear-gradient(102deg,#00E5FF,#2962FF,#76FF03)' }}
                    >
                      Try voice call →
                    </button>
                  </div>
                )}
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                  <Link to={`/try?region=${region}&mode=call`} className="hover:text-slate-700 underline-offset-2 hover:underline">
                    Open full try desk
                  </Link>
                  <Link to={startSetupUrl(region)} className="hover:text-slate-700">
                    Keep live →
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <div className="px-4 py-3 max-h-[380px] overflow-y-auto">
              <InstantTryCallPanel region={region} lang={lang} compact />
            </div>
          )}
        </div>
      ) : null}
    </>
  )
}
