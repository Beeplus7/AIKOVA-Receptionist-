import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useRegion, type RegionKey } from '../context/RegionContext'
import {
  homeForRegion,
  isAfricaMarketingPath,
  isEurozonePath,
  pathForRegion,
} from '../lib/regionRoutes'

const OPTIONS: { id: RegionKey; label: string }[] = [
  { id: 'africa', label: '🌍 Africa' },
  { id: 'eurozone', label: '🇪🇺 Eurozone' },
  { id: 'uk', label: '🇬🇧 UK' },
]

/** Readiness-style region pills — fixed top-left on marketing surfaces. */
export default function MarketingRegionSwitcher() {
  const { region, setRegion } = useRegion()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const lockRef = useRef(false)

  const onMarketing = isEurozonePath(pathname) || isAfricaMarketingPath(pathname) || pathname === '/'

  // Infer region from URL (deep links) without fighting an in-flight switcher click
  useEffect(() => {
    if (lockRef.current) return
    if (isEurozonePath(pathname)) {
      if (region === 'africa') setRegion('eurozone')
    } else if (isAfricaMarketingPath(pathname)) {
      if (region !== 'africa') setRegion('africa')
    }
  }, [pathname, region, setRegion])

  if (!onMarketing) return null

  const select = (next: RegionKey) => {
    lockRef.current = true
    setRegion(next)
    navigate(next === region ? homeForRegion(next) : pathForRegion(pathname, next))
    window.setTimeout(() => {
      lockRef.current = false
    }, 400)
  }

  return (
    <div className="marketing-region-switcher" role="group" aria-label="Marketing region">
      <div className="marketing-region-switcher__track">
        {OPTIONS.map((opt) => {
          const active = region === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => select(opt.id)}
              className={`marketing-region-switcher__btn${active ? ' is-active' : ''}`}
              aria-pressed={active}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
