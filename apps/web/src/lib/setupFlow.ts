import type { RegionKey } from '../context/RegionContext'

/**
 * Canonical setup funnel (synced):
 * Marketing CTA → Sign up/in → Entrance (region door) → Onboarding 8 steps
 * → Confirmation / welcome by name → UPRM Gift Dashboard (/app/inbox)
 *
 * Browse marketing without auth. Auth is required before Entrance/Onboarding/App.
 */
export const SETUP = {
  auth: '/auth',
  entrance: '/onboarding/entrance',
  onboarding: '/onboarding',
  complete: '/onboarding/complete',
  inbox: '/app/inbox',
} as const

export function startSetupUrl(region: RegionKey = 'eurozone') {
  const next = encodeURIComponent(SETUP.entrance)
  return `${SETUP.auth}?mode=signup&region=${encodeURIComponent(region)}&next=${next}`
}

/** React Router location object — avoids flaky string `to` parsing with encoded `next`. */
export function startSetupTo(region: RegionKey = 'eurozone') {
  return {
    pathname: SETUP.auth,
    search: `?mode=signup&region=${encodeURIComponent(region)}&next=${encodeURIComponent(SETUP.entrance)}`,
  } as const
}

export function signInUrl(region: RegionKey = 'eurozone', next = SETUP.entrance) {
  return `${SETUP.auth}?mode=signin&region=${encodeURIComponent(region)}&next=${encodeURIComponent(next)}`
}

export function onboardingUrl(region: RegionKey) {
  return `${SETUP.onboarding}?region=${encodeURIComponent(region)}`
}
