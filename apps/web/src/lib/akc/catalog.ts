/** AiKOVA Credits (AKC) — prepaid usage currency. Anchor: 10,000 AKC ≈ $25 / €25 */

export const AKC_ANCHOR = {
  akc: 10_000,
  usd: 25,
  eur: 25,
} as const

export const WELCOME_AKC = 5_000
export const WELCOME_DAYS = 14

export type AkcPlan = 'starter' | 'growth' | 'scale' | 'enterprise'

export const PLAN_TIERS: {
  id: AkcPlan
  name: string
  usd: number | null
  eur: number | null
  akcMonthly: number | string
  popular?: boolean
  features: string[]
}[] = [
  {
    id: 'starter',
    name: 'Starter',
    usd: 25,
    eur: 25,
    akcMonthly: 10_000,
    features: [
      '10,000 AKC / month',
      '~500 voice mins',
      '1k SMS · 1k convos',
      '10GB storage · 3 voices · 2 langs',
      '2 channels · M-Pesa or Stripe',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    usd: 79,
    eur: 79,
    akcMonthly: 35_000,
    popular: true,
    features: [
      '35,000 AKC / month',
      '~1,750 voice mins',
      '5k SMS · 5k convos',
      '50GB · 8 voices · 5 langs',
      'Social-to-Sale · 5 channels',
    ],
  },
  {
    id: 'scale',
    name: 'Scale',
    usd: 199,
    eur: 199,
    akcMonthly: 100_000,
    features: [
      '100,000 AKC / month',
      '~5,000 voice mins',
      '20k SMS · 20k convos',
      '200GB · 23 voices · 23 langs',
      'Team handoff · analytics',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    usd: null,
    eur: null,
    akcMonthly: 'Custom',
    features: [
      'Custom AKC pool',
      'Dedicated infra · EU/Africa residency',
      'NDPR + GDPR · SLA',
      'SSO · on-prem option',
    ],
  },
]

export const RELOAD_PACKS = [
  { key: 'akc_10k', akc: 10_000, usd: 25, eur: 25, label: '+10k Starter runway', popular: false },
  { key: 'akc_35k', akc: 35_000, usd: 79, eur: 79, label: '+35k Growth runway', popular: true },
  { key: 'akc_50k', akc: 50_000, usd: 99, eur: 99, label: '+50k Power', popular: false },
  { key: 'akc_100k', akc: 100_000, usd: 199, eur: 199, label: '+100k Scale runway', popular: false },
  { key: 'akc_150k', akc: 150_000, usd: 279, eur: 279, label: '+150k Max', popular: false },
] as const

export const USAGE_RATES = [
  { id: 'voice.min', label: 'Voice minute', akc: 20, unit: 'min' },
  { id: 'sms.out', label: 'Outbound SMS', akc: 15, unit: 'msg' },
  { id: 'conversation', label: 'Conversation', akc: 50, unit: 'each' },
  { id: 'tts.1k_chars', label: 'TTS 1k chars', akc: 10, unit: '1k' },
  { id: 'storage.gb_mo', label: 'Storage GB/mo', akc: 100, unit: 'GB' },
  { id: 'voice.clone', label: 'Voice clone', akc: 5000, unit: 'each' },
  { id: 'social.auto_dm', label: 'Social auto-DM', akc: 80, unit: 'each' },
] as const

export function formatAkc(n: number) {
  return `${n.toLocaleString()} AKC`
}
