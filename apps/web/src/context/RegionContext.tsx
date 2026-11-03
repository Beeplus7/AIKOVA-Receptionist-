import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type RegionKey = 'africa' | 'eurozone' | 'uk'

export type RegionAdapters = {
  region: RegionKey
  label: string
  flag: string
  telephony: string
  payment: string
  compliance: string
  voiceLibrary: string[]
  languages: string[]
  channels: string[]
}

const STORAGE_KEYS = {
  region: 'aikova_region',
  onboarding: 'aikova_onboarding',
  companion: 'aikova_companion_memory',
} as const

const ADAPTERS: Record<RegionKey, Omit<RegionAdapters, 'region'>> = {
  africa: {
    label: 'Africa',
    flag: '🌍',
    telephony: "Africa's Talking Primary + Twilio Fallback + Opus + USSD",
    payment: 'M-Pesa Flutterwave Paystack',
    compliance: 'NDPR',
    voiceLibrary: ['Lagos Yoruba', 'Ibadan Yoruba', 'Kenyan Swahili', 'Pidgin', 'Zulu', 'Hausa'],
    languages: ['EN', 'FR', 'AR', 'PT', 'SW', 'HA', 'YO', 'IG', 'ZU', 'XH', 'AM', 'Pidgin'],
    channels: ['WhatsApp', 'IG DM', 'FB Messenger', 'Web Chat', 'SMS Africa\'s Talking', 'M-Pesa'],
  },
  eurozone: {
    label: 'Eurozone',
    flag: '🇪🇺',
    telephony: 'Twilio/Vonage HD +44',
    payment: 'Stripe SEPA VAT OSS',
    compliance: 'GDPR AI Act',
    voiceLibrary: ['Scouse Liverpool', 'London', 'Yorkshire', 'Berlin Bavarian', 'Marseille', 'Paris'],
    languages: ['EN', 'FR', 'DE', 'ES', 'IT', 'NL', 'PL', 'PT'],
    channels: ['WhatsApp', 'IG DM', 'FB Messenger', 'Web Chat', 'SMS Twilio', 'Stripe SEPA'],
  },
  uk: {
    label: 'UK',
    flag: '🇬🇧',
    telephony: 'Twilio HD +44 Fallback',
    payment: 'Stripe UK VAT',
    compliance: 'UK GDPR',
    voiceLibrary: ['London RP', 'Scouse', 'Yorkshire', 'Mancunian', 'Scottish'],
    languages: ['EN', 'Scouse'],
    channels: ['WhatsApp', 'IG DM', 'FB Messenger', 'Web Chat', 'SMS Twilio', 'Stripe UK'],
  },
}

type RegionContextValue = RegionAdapters & {
  setRegion: (region: RegionKey) => void
}

const RegionContext = createContext<RegionContextValue | null>(null)

function readStoredRegion(fallback: RegionKey = 'eurozone'): RegionKey {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.region)
    if (raw === 'africa' || raw === 'eurozone' || raw === 'uk') return raw
  } catch {
    /* ignore */
  }
  return fallback
}

export function RegionProvider({
  children,
  initialRegion,
}: {
  children: ReactNode
  initialRegion?: RegionKey
}) {
  const [region, setRegionState] = useState<RegionKey>(
    () => initialRegion ?? readStoredRegion('eurozone'),
  )

  useEffect(() => {
    if (initialRegion) setRegionState(initialRegion)
  }, [initialRegion])

  const setRegion = useCallback((next: RegionKey) => {
    setRegionState(next)
    try {
      localStorage.setItem(STORAGE_KEYS.region, next)
      const memory = {
        region: next,
        updatedAt: new Date().toISOString(),
        adapters: ADAPTERS[next],
      }
      localStorage.setItem(STORAGE_KEYS.companion, JSON.stringify(memory))
    } catch {
      /* ignore */
    }
  }, [])

  const value = useMemo<RegionContextValue>(() => {
    const adapters = ADAPTERS[region]
    return {
      region,
      setRegion,
      ...adapters,
    }
  }, [region, setRegion])

  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>
}

export function useRegion() {
  const ctx = useContext(RegionContext)
  if (!ctx) {
    throw new Error('useRegion must be used within RegionProvider')
  }
  return ctx
}

export { STORAGE_KEYS, ADAPTERS }
