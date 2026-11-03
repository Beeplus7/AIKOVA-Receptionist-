import { useEffect, useId, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, LayoutGrid } from 'lucide-react'
import { useRegion } from '../context/RegionContext'
import { pagesForRegion } from '../lib/regionRoutes'

const ADMIN_PAGES = [
  { to: '/readiness', label: 'Production Readiness' },
  { to: '/auth', label: 'Auth (Supabase)' },
  { to: '/auth?mode=signup&next=%2Fonboarding%2Fentrance', label: '1 · Sign up' },
  { to: '/onboarding/entrance', label: '2 · Entrance' },
  { to: '/onboarding', label: '3 · Onboarding 8-step' },
  { to: '/onboarding/complete', label: '4 · Confirm / Welcome' },
  { to: '/app/inbox', label: 'Gift Dashboard Inbox' },
  { to: '/app/dashboard', label: 'Dashboard KPIs' },
  { to: '/app/billing', label: 'AKC Wallet / Billing' },
  { to: '/admin/credits', label: 'Admin Credits Allocations' },
  { to: '/app/calls', label: 'Calls' },
  { to: '/app/knowledge', label: 'Knowledge' },
] as const

function isActive(pathname: string, to: string) {
  if (to === '/' || to === '/eu') return pathname === to
  return pathname === to || pathname.startsWith(`${to}/`)
}

function matchLabel(
  pathname: string,
  pages: readonly { to: string; label: string }[],
) {
  return pages.find((page) => isActive(pathname, page.to))?.label
}

export default function SitePagesMenu() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()
  const { region, label, flag } = useRegion()

  const onAdmin =
    location.pathname.startsWith('/onboarding') ||
    location.pathname.startsWith('/app') ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/readiness') ||
    location.pathname.startsWith('/production') ||
    location.pathname.startsWith('/auth')

  const marketingPages = pagesForRegion(region)

  useEffect(() => {
    setOpen(false)
  }, [location.pathname, region])

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const current = onAdmin
    ? (matchLabel(location.pathname, ADMIN_PAGES) ?? 'Admin')
    : (matchLabel(location.pathname, marketingPages) ?? `${flag} ${label}`)

  const renderList = (
    pages: readonly { to: string; label: string }[],
    prefix: string,
  ) => (
    <ul className="site-pages-menu__list">
      {pages.map((page) => {
        const active = isActive(location.pathname, page.to)
        return (
          <li key={`${prefix}-${page.to}`}>
            <Link
              role="menuitem"
              to={page.to}
              className={`site-pages-menu__item${active ? ' is-active' : ''}`}
              aria-current={active ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              {page.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )

  return (
    <div ref={rootRef} className="site-pages-menu">
      <button
        type="button"
        className="site-pages-menu__trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        <LayoutGrid size={15} strokeWidth={2.25} aria-hidden />
        <span className="site-pages-menu__label">{current}</span>
        <ChevronDown
          size={15}
          strokeWidth={2.25}
          aria-hidden
          className={`site-pages-menu__chevron${open ? ' is-open' : ''}`}
        />
      </button>

      {open ? (
        <div id={menuId} role="menu" className="site-pages-menu__panel">
          {!onAdmin ? (
            <div className="site-pages-menu__section">
              <p className="site-pages-menu__heading">
                {flag} {label} · 11 pages
              </p>
              {renderList(marketingPages, region)}
            </div>
          ) : null}
          <div className="site-pages-menu__section">
            <p className="site-pages-menu__heading">Admin / App</p>
            {renderList(ADMIN_PAGES, 'admin')}
          </div>
          {onAdmin ? (
            <div className="site-pages-menu__section">
              <p className="site-pages-menu__heading">
                {flag} {label} marketing
              </p>
              {renderList(marketingPages, region)}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
