/** Human-fluent browser TTS for instant-try (phrase chunks + best neural/cloud voices). */

let speakingToken = 0

export function stopTrySpeech() {
  speakingToken += 1
  try {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  } catch {
    /* ignore */
  }
}

const PREFERRED_NAME =
  /neural|natural|premium|enhanced|google|microsoft|samantha|karen|moira|tessa|daniel|martha|ava|zoe|fiona|karen|serena|susan|catherine|hazel|raveena|veena|google uk|google us|google français|microsoft zira|microsoft sona|microsoft aria|microsoft jenny/i

const AVOID_NAME = /compact|eloquence|whisper|novelty|bad\s*news|zarvox|trinoids|boing|bubbles/i

export function pickBestVoice(lang: string): SpeechSynthesisVoice | null {
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null
    const voices = window.speechSynthesis.getVoices()
    if (!voices.length) return null
    const target = lang.toLowerCase()
    const prefix = target.slice(0, 2)

    const scored = voices.map((v) => {
      const vl = (v.lang || '').toLowerCase()
      const name = v.name || ''
      let score = 0
      if (vl === target) score += 50
      else if (vl.startsWith(prefix)) score += 28
      else if (prefix === 'en' && vl.startsWith('en')) score += 18
      // African English / NG fallbacks
      if (target.startsWith('en-ng') && (vl.includes('ng') || /nigeria|raveena|veena/i.test(name))) score += 22
      if (target.startsWith('en-za') || target.startsWith('af') || target.startsWith('zu')) {
        if (vl.includes('za') || /tessa|south africa/i.test(name)) score += 22
      }
      if (target.startsWith('sw') && (vl.startsWith('sw') || /swahili/i.test(name))) score += 30
      if (PREFERRED_NAME.test(name)) score += 26
      if (!v.localService) score += 14 // often cloud/neural
      if (/female|woman/i.test(name)) score += 4
      if (AVOID_NAME.test(name)) score -= 40
      return { v, score }
    })

    scored.sort((a, b) => b.score - a.score)
    return scored[0]?.score > 0 ? scored[0].v : voices[0]
  } catch {
    return null
  }
}

/** Split into short spoken phrases so delivery feels like a real call, not a monologue. */
export function phraseChunks(text: string): string[] {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.?!…])\s+|(?<=[;:—–-])\s+|(?<=,)\s+(?=[A-ZÀ-ÖØ-ÝĘṢ])/u)
    .map((p) => p.trim())
    .filter((p) => p.length > 1)
}

function pauseMs(phrase: string, index: number): number {
  if (/[.?!…]$/.test(phrase)) return 420 + (index % 2) * 80
  if (/[,;:—–-]$/.test(phrase)) return 220
  return 160
}

export type SpeakOpts = {
  lang: string
  /** Slightly slower = warmer receptionist */
  rate?: number
  onPhrase?: (phrase: string, index: number) => void
}

export async function speakTryLine(text: string, langOrOpts: string | SpeakOpts, _maxChars = 900): Promise<void> {
  const opts: SpeakOpts = typeof langOrOpts === 'string' ? { lang: langOrOpts } : langOrOpts
  const token = ++speakingToken

  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

    // Chrome often needs a kick after cancel
    try {
      window.speechSynthesis.resume()
    } catch {
      /* ignore */
    }
    window.speechSynthesis.cancel()

    const voice = pickBestVoice(opts.lang)
    const chunks = phraseChunks(text.slice(0, _maxChars))
    if (!chunks.length) return

    const baseRate = opts.rate ?? 0.92

    for (let i = 0; i < chunks.length; i++) {
      if (token !== speakingToken) return
      const phrase = chunks[i]
      opts.onPhrase?.(phrase, i)

      await new Promise<void>((resolve) => {
        if (token !== speakingToken) {
          resolve()
          return
        }
        const u = new SpeechSynthesisUtterance(phrase)
        u.lang = opts.lang
        if (voice) u.voice = voice
        // Gentle human variance — not robotic flatline
        u.rate = baseRate + (i % 3 === 0 ? -0.02 : i % 3 === 1 ? 0.015 : 0)
        u.pitch = 1.02 + (i % 2 === 0 ? 0.02 : -0.015)
        u.volume = 1
        let settled = false
        const finish = () => {
          if (settled) return
          settled = true
          resolve()
        }
        u.onend = finish
        u.onerror = finish
        window.speechSynthesis.speak(u)
        // Safety if onend never fires
        window.setTimeout(finish, Math.min(9000, 700 + phrase.length * 55))
      })

      if (token !== speakingToken) return
      if (i < chunks.length - 1) {
        await new Promise((r) => window.setTimeout(r, pauseMs(phrase, i)))
      }
    }
  } catch {
    /* ignore */
  }
}

export function describeTryVoice(lang: string): string {
  const v = pickBestVoice(lang)
  if (!v) return 'Browser voice warming up…'
  const cloud = v.localService ? 'on-device' : 'neural/cloud'
  return `${v.name} · ${v.lang} · ${cloud}`
}

/** Warm the voices list (Chrome loads async). */
export function warmTryVoices() {
  try {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices()
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices()
      }
    }
  } catch {
    /* ignore */
  }
}
