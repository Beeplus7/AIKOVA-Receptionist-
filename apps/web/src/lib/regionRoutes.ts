import type { RegionKey } from '../context/RegionContext'

export const EUROZONE_PAGES = [
  { to: '/eu', label: 'Home' },
  { to: '/eu/features', label: 'Features' },
  { to: '/eu/solutions', label: 'Solutions' },
  { to: '/eu/languages', label: 'Languages' },
  { to: '/eu/how-it-works', label: 'How It Works' },
  { to: '/eu/pricing', label: 'Pricing' },
  { to: '/eu/demo', label: 'Demo' },
  { to: '/eu/customers', label: 'Customers' },
  { to: '/eu/resources', label: 'Resources' },
  { to: '/eu/company', label: 'Company' },
  { to: '/eu/get-started', label: 'Get Started' },
] as const

export const AFRICA_PAGES = [
  { to: '/', label: 'Home' },
  { to: '/features', label: 'Features' },
  { to: '/solutions', label: 'Solutions' },
  { to: '/languages', label: 'Languages' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/business', label: 'Business' },
  { to: '/customers', label: 'Customers' },
  { to: '/resources', label: 'Resources' },
  { to: '/company', label: 'Company' },
  { to: '/get-started', label: 'Get Started' },
] as const

/** Pair Africa ↔ Eurozone for switcher landing remap */
const AF_TO_EU: Record<string, string> = {
  '/': '/eu',
  '/features': '/eu/features',
  '/solutions': '/eu/solutions',
  '/languages': '/eu/languages',
  '/how-it-works': '/eu/how-it-works',
  '/pricing': '/eu/pricing',
  '/business': '/eu/demo',
  '/customers': '/eu/customers',
  '/resources': '/eu/resources',
  '/company': '/eu/company',
  '/get-started': '/eu/get-started',
}

const EU_TO_AF: Record<string, string> = Object.fromEntries(
  Object.entries(AF_TO_EU).map(([af, eu]) => [eu, af]),
)

export function isEurozonePath(pathname: string) {
  return pathname === '/eu' || pathname.startsWith('/eu/')
}

export function isAfricaMarketingPath(pathname: string) {
  if (isEurozonePath(pathname)) return false
  if (
    pathname.startsWith('/app') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/onboarding') ||
    pathname.startsWith('/readiness') ||
    pathname.startsWith('/production')
  ) {
    return false
  }
  return AFRICA_PAGES.some((p) => p.to === pathname || (p.to !== '/' && pathname.startsWith(`${p.to}/`)))
}

export function homeForRegion(region: RegionKey) {
  return region === 'africa' ? '/' : '/eu'
}

/** Map current path into the destination region's equivalent page (else home). */
export function pathForRegion(pathname: string, region: RegionKey) {
  if (region === 'africa') {
    if (isAfricaMarketingPath(pathname) || pathname === '/') return pathname === '/eu' ? '/' : pathname
    return EU_TO_AF[pathname] ?? '/'
  }
  // eurozone + uk share EU marketing set
  if (isEurozonePath(pathname)) return pathname
  return AF_TO_EU[pathname] ?? '/eu'
}

export function pagesForRegion(region: RegionKey) {
  return region === 'africa' ? AFRICA_PAGES : EUROZONE_PAGES
}
