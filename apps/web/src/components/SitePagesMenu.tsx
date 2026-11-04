import { useEffect, useId, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, LayoutGrid } from 'lucide-react'
import { useRegion } from '../context/RegionContext'
import { pagesForRegion } from '../lib/regionRoutes'

function isActive(pathname: string, to: string) {
  const pathOnly = to.split('?')[0]
  if (pathOnly === '/' || pathOnly === '/eu') return pathname === pathOnly
  return pathname === pathOnly || pathname.startsWith(`${pathOnly}/`)
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

  // Keep onboarding / app chrome free of marketing page menu overlays
  if (
    location.pathname.startsWith('/onboarding') ||
    location.pathname.startsWith('/app') ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/auth')
  ) {
    return null
  }

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

  const current =
    matchLabel(location.pathname, marketingPages) ?? `${flag} ${label}`

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
          <div className="site-pages-menu__section">
            <p className="site-pages-menu__heading">
              {flag} {label} · {marketingPages.length} pages
            </p>
            <ul className="site-pages-menu__list">
              {marketingPages.map((page) => {
                const active = isActive(location.pathname, page.to)
                return (
                  <li key={page.to}>
                    {page.to.startsWith('/auth') ? (
                      <a
                        role="menuitem"
                        href={page.to}
                        className={`site-pages-menu__item${active ? ' is-active' : ''}`}
                        onClick={() => setOpen(false)}
                      >
                        {page.label}
                      </a>
                    ) : (
                      <Link
                        role="menuitem"
                        to={page.to}
                        className={`site-pages-menu__item${active ? ' is-active' : ''}`}
                        aria-current={active ? 'page' : undefined}
                        onClick={() => setOpen(false)}
                      >
                        {page.label}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  )
}
