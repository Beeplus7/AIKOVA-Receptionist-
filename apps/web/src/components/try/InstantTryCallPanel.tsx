import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { RegionKey } from '../../context/RegionContext'
import {
  bizForRegion,
  callSpeech,
  speechLangFor,
  type TryLang,
} from '../../lib/tryInstant/languages'
import {
  placeInstantTryCall,
  pollCallStatus,
  provisionTwilioFrom,
  startCallerVerify,
  type RealCallResult,
} from '../../lib/tryInstant/realCall'
import { speakTryLine, stopTrySpeech, warmTryVoices } from '../../lib/tryInstant/speak'
import { startSetupUrl } from '../../lib/setupFlow'

type Phase =
  | 'idle'
  | 'countdown'
  | 'dialing'
  | 'ringing'
  | 'in-progress'
  | 'completed'
  | 'failed'
  | 'verify'
  | 'provision'

type Props = {
  region: RegionKey
  lang: TryLang
  compact?: boolean
}

function toE164Hint(raw: string) {
  return raw.replace(/[^\d+]/g, '')
}

export default function InstantTryCallPanel({ region, lang, compact }: Props) {
  const biz = useMemo(() => bizForRegion(region), [region])
  const [phone, setPhone] = useState('')
  const [phase, setPhase] = useState<Phase>('idle')
  const [count, setCount] = useState(3)
  const [statusLine, setStatusLine] = useState('')
  const [transcript, setTranscript] = useState('')
  const [validationCode, setValidationCode] = useState('')
  const [callSid, setCallSid] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [allowBrowserFallback, setAllowBrowserFallback] = useState(false)
  const lines = useMemo(() => callSpeech(region, lang), [region, lang])
  const speechLang = useMemo(() => speechLangFor(lang, region), [lang, region])
  const timers = useRef<number[]>([])
  const pollRef = useRef<number | null>(null)

  useEffect(() => {
    warmTryVoices()
  }, [])

  useEffect(() => {
    stopTrySpeech()
    clearAll()
    setPhase('idle')
    setError(null)
    setValidationCode('')
    setCallSid(null)
    setTranscript('')
    setStatusLine('')
    setAllowBrowserFallback(false)
  }, [region, lang])

  useEffect(
    () => () => {
      stopTrySpeech()
      clearAll()
    },
    [],
  )

  const clearAll = () => {
    timers.current.forEach((t) => window.clearInterval(t))
    timers.current = []
    if (pollRef.current) {
      window.clearInterval(pollRef.current)
      pollRef.current = null
    }
  }

  const hangUp = () => {
    stopTrySpeech()
    clearAll()
    setPhase((p) => (p === 'idle' ? 'idle' : 'completed'))
  }

  const startPoll = (sid: string) => {
    if (pollRef.current) window.clearInterval(pollRef.current)
    pollRef.current = window.setInterval(() => {
      void pollCallStatus(sid).then((r) => {
        if (!r.status) return
        setStatusLine(`Carrier status: ${r.status}`)
        if (r.status === 'ringing') setPhase('ringing')
        if (r.status === 'in-progress') setPhase('in-progress')
        if (r.status === 'completed' || r.status === 'busy' || r.status === 'failed' || r.status === 'no-answer' || r.status === 'canceled') {
          setPhase(r.status === 'completed' ? 'completed' : 'failed')
          if (r.status !== 'completed') setError(`Call ended: ${r.status}`)
          clearAll()
        }
      })
    }, 2000)
  }

  const handleNeedsSetup = async (res: RealCallResult) => {
    // Trial Twilio: verify destination first, then buy From number, then dial
    if (
      res.code === 'NEEDS_VERIFY_DEST' ||
      res.code === 'NEEDS_FROM' ||
      res.next?.includes('verify-start') ||
      res.next?.includes('provision-from')
    ) {
      setPhase('verify')
      setError(
        res.hint ||
          res.error ||
          'One-time setup: we will ring you with an AiKOVA verify code, then place the live call.',
      )
      setStatusLine('Step 1 of 2 — verify your mobile with AiKOVA')
      return
    }
    setPhase('failed')
    setError(res.error || 'Call failed')
    setAllowBrowserFallback(true)
  }

  const dialReal = async () => {
    setError(null)
    setPhase('dialing')
    setStatusLine('Contacting Twilio…')
    setTranscript(lines.display)

    const res = await placeInstantTryCall({
      phone: toE164Hint(phone),
      region,
      lang,
      text: lines.speak,
    })

    if (!res.ok) {
      await handleNeedsSetup(res)
      return
    }

    setCallSid(res.callSid || null)
    setStatusLine(res.message || 'Dialing your phone…')
    setPhase('ringing')
    if (res.callSid) startPoll(res.callSid)
  }

  const startBookAndCall = () => {
    const normalized = toE164Hint(phone)
    if (!normalized || normalized.length < 10) {
      setError('Enter your real mobile in E.164 form, e.g. +447700900123 or +2348012345678')
      return
    }
    if (phase === 'countdown' || phase === 'dialing' || phase === 'ringing' || phase === 'in-progress') return

    stopTrySpeech()
    clearAll()
    setError(null)
    setTranscript('')
    setPhase('countdown')
    let left = 3
    setCount(left)
    const iv = window.setInterval(() => {
      left -= 1
      if (left <= 0) {
        window.clearInterval(iv)
        setCount(0)
        void dialReal()
      } else {
        setCount(left)
      }
    }, 1000)
    timers.current.push(iv)
  }

  const runVerify = async () => {
    setError(null)
    setStatusLine('Starting AiKOVA verification call…')
    const res = await startCallerVerify(toE164Hint(phone))
    if (!res.ok) {
      setError(res.error || 'Verify failed')
      return
    }
    setValidationCode(res.validationCode || '')
    setStatusLine(res.instruction || 'Enter the code on your phone keypad when asked.')
    setPhase('verify')
  }

  const runProvisionThenDial = async () => {
    setError(null)
    setStatusLine('Provisioning Twilio From number…')
    setPhase('provision')
    const prov = await provisionTwilioFrom()
    if (!prov.ok) {
      setError([prov.error, prov.hint].filter(Boolean).join(' — '))
      setAllowBrowserFallback(true)
      return
    }
    setStatusLine(`From number ready: ${prov.from}. Dialing you…`)
    await dialReal()
  }

  const playBrowserFallback = async () => {
    setAllowBrowserFallback(false)
    setPhase('in-progress')
    setTranscript('')
    setStatusLine('Browser voice fallback (not a real ring)')
    await speakTryLine(lines.speak, { lang: speechLang, rate: 0.9, onPhrase: (p) => setTranscript((prev) => (prev ? `${prev} ${p}` : p)) })
    setTranscript(lines.display)
    setPhase('completed')
  }

  const replay = () => {
    stopTrySpeech()
    clearAll()
    setPhase('idle')
    setCount(3)
    setTranscript('')
    setError(null)
    setStatusLine('')
    setCallSid(null)
    setValidationCode('')
    setAllowBrowserFallback(false)
  }

  const livePhases = phase === 'ringing' || phase === 'in-progress' || phase === 'dialing' || phase === 'completed'

  return (
    <div className={compact ? 'space-y-2' : 'space-y-3'}>
      <div className="rounded-2xl border border-slate-200 bg-[#0F172A] text-white p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[9px] font-bold tracking-[0.16em] uppercase text-white/50">
              Book → 3s → real phone ring
            </div>
            <div className="text-[13px] font-extrabold truncate mt-0.5">{biz.name}</div>
            <div className="text-[10px] text-white/55 truncate">
              Agent {biz.agent} · Twilio / Africa’s Talking
            </div>
          </div>
          <span className="shrink-0 text-[9px] font-bold px-2 py-1 rounded-full bg-emerald-400/15 border border-emerald-300/25 text-emerald-200">
            Live PSTN
          </span>
        </div>

        {livePhases || phase === 'failed' || phase === 'verify' || phase === 'provision' ? (
          <div className="mt-3 rounded-xl bg-white/5 border border-white/10 p-3">
            <div className="flex items-center gap-3">
              <div
                className={`h-11 w-11 rounded-full grid place-items-center text-[14px] font-black text-[#0F172A] ${
                  phase === 'ringing' || phase === 'dialing' || phase === 'in-progress' ? 'animate-pulse' : ''
                }`}
                style={{ background: 'linear-gradient(102deg,#00E5FF,#2962FF,#76FF03)' }}
              >
                {biz.agent.slice(0, 1)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[12px] font-bold">
                  {phase === 'dialing' && 'Connecting carrier…'}
                  {phase === 'ringing' && 'Ringing your phone…'}
                  {phase === 'in-progress' && 'Call in progress'}
                  {phase === 'completed' && 'Call finished'}
                  {phase === 'failed' && 'Call failed'}
                  {phase === 'verify' && 'Verify number (trial)'}
                  {phase === 'provision' && 'Set up From number'}
                </div>
                <div className="text-[10px] text-white/50 truncate">
                  {phone || '—'} · {lang.toUpperCase()}
                  {callSid ? ` · ${callSid.slice(0, 10)}…` : ''}
                </div>
              </div>
              {(phase === 'ringing' || phase === 'in-progress' || phase === 'dialing') && (
                <button type="button" onClick={hangUp} className="h-9 px-3 rounded-full bg-rose-500 text-[11px] font-bold">
                  End UI
                </button>
              )}
            </div>
            {statusLine ? <p className="mt-2 text-[11px] text-white/60">{statusLine}</p> : null}
            {validationCode ? (
              <p className="mt-2 text-[18px] font-black tracking-[0.2em] text-emerald-300">
                CODE {validationCode}
              </p>
            ) : null}
            {transcript ? (
              <p className="mt-2.5 text-[12px] leading-5 text-white/85 max-h-[120px] overflow-y-auto">{transcript}</p>
            ) : null}
          </div>
        ) : null}
      </div>

      <label className="block">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Your mobile (will ring)</span>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={phase === 'countdown' || phase === 'dialing' || phase === 'ringing' || phase === 'in-progress'}
          className="mt-1 w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-[13px] disabled:opacity-60"
          placeholder="+4477… or +23480…"
        />
      </label>

      {error ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-900 leading-4">
          {error}
        </div>
      ) : null}

      {phase === 'verify' ? (
        <div className="grid gap-2">
          <button
            type="button"
            onClick={() => void runVerify()}
            className="h-11 rounded-full bg-[#0F172A] text-white text-[12px] font-bold"
          >
            Ring me with AiKOVA verify code
          </button>
          <button
            type="button"
            onClick={() => void runProvisionThenDial()}
            className="h-11 rounded-full text-[12px] font-bold text-[#0F172A]"
            style={{ background: 'linear-gradient(102deg,#00E5FF,#2962FF,#76FF03)' }}
          >
            I’ve entered the code → provision &amp; call
          </button>
        </div>
      ) : null}

      {phase === 'provision' ? (
        <button
          type="button"
          onClick={() => void runProvisionThenDial()}
          className="w-full h-11 rounded-full text-[12px] font-bold text-[#0F172A]"
          style={{ background: 'linear-gradient(102deg,#00E5FF,#2962FF,#76FF03)' }}
        >
          Provision Twilio number &amp; dial me
        </button>
      ) : null}

      {phase === 'idle' || phase === 'completed' || phase === 'failed' ? (
        <div className={`grid gap-2 ${phase !== 'idle' ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {phase !== 'idle' ? (
            <button
              type="button"
              onClick={replay}
              className="h-11 rounded-full border border-slate-200 bg-white text-[12px] font-semibold text-slate-700"
            >
              Reset
            </button>
          ) : null}
          <button
            type="button"
            onClick={startBookAndCall}
            className="h-11 rounded-full text-[13px] font-bold text-[#0F172A] inline-flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(102deg,#00E5FF,#2962FF,#76FF03)' }}
          >
            <span aria-hidden>📞</span> Book Now → Ring my phone
          </button>
        </div>
      ) : null}

      {phase === 'countdown' ? (
        <div className="h-11 rounded-full bg-[#0F172A] text-white text-[13px] font-bold inline-flex w-full items-center justify-center gap-2">
          <span className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          {count}s — Real call incoming…
        </div>
      ) : null}

      {allowBrowserFallback ? (
        <button
          type="button"
          onClick={() => void playBrowserFallback()}
          className="w-full h-10 rounded-full border border-slate-200 text-[11px] font-semibold text-slate-600"
        >
          Preview in browser only (no ring)
        </button>
      ) : null}

      {phase === 'completed' ? (
        <Link
          to={startSetupUrl(region)}
          className="h-10 w-full rounded-full border border-slate-200 bg-white text-[12px] font-bold text-slate-800 inline-flex items-center justify-center hover:bg-slate-50"
        >
          Keep this live → register
        </Link>
      ) : null}

      <p className="text-[10px] text-slate-400 leading-4">
        Places a real carrier call via Twilio (Polly voice). Trial accounts must verify your number once, then we
        can dial it. Max 5 try-calls / hour / number.
        {!compact ? ' Africa’s Talking used when those keys are set.' : null}
      </p>
    </div>
  )
}
