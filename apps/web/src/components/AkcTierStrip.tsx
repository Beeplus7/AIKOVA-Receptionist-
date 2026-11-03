import { Link } from 'react-router-dom'
import { PLAN_TIERS, WELCOME_AKC, formatAkc } from '../lib/akc/catalog'
import { useRegion } from '../context/RegionContext'

const GRADIENT = 'linear-gradient(90deg, #00E5FF 0%, #2962FF 52%, #76FF03 100%)'

/** Compact AKC coins / plan strip for marketing homes & pricing. */
export default function AkcTierStrip({ compact = false }: { compact?: boolean }) {
  const { region } = useRegion()
  const pricingHref = region === 'africa' ? '/pricing' : '/eu/pricing'
  const currency = region === 'africa' ? '$' : '€'

  return (
    <section
      className={`w-full ${compact ? 'py-6' : 'py-10'} px-4`}
      aria-label="AiKOVA Credits tiers"
    >
      <div className="mx-auto max-w-[1100px]">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
          <div>
            <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#64748B]">
              AiKOVA Credits · AKC
            </p>
            <h2 className="text-[22px] sm:text-[28px] font-[800] tracking-tight text-[#0F172A]">
              Prepaid usage coins — like VisaGuide VGC
            </h2>
            <p className="mt-1 text-[13px] text-[#475569]">
              {formatAkc(10_000)} ≈ {currency}25 · Welcome trial {formatAkc(WELCOME_AKC)} · 14 days
            </p>
          </div>
          <Link
            to={pricingHref}
            className="h-10 px-4 rounded-full text-[13px] font-semibold text-white inline-flex items-center shadow"
            style={{ background: GRADIENT }}
          >
            Full pricing →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PLAN_TIERS.map((t) => (
            <div
              key={t.id}
              className="rounded-[18px] border border-[#E2E8F0] bg-white p-4"
              style={t.popular ? { boxShadow: '0 0 0 1px #2962FF, 0 8px 24px rgba(41,98,255,0.12)' } : undefined}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[13px] font-bold">{t.name}</span>
                {t.popular ? (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: GRADIENT }}>
                    POPULAR
                  </span>
                ) : null}
              </div>
              <div className="mt-2 text-[20px] font-[800]">
                {t.usd == null ? 'Custom' : `${currency}${region === 'africa' ? t.usd : t.eur}`}
                {t.usd != null ? <span className="text-[12px] font-medium text-[#64748B]">/mo</span> : null}
              </div>
              <div className="mt-1 text-[11px] font-semibold text-[#475569]">
                {typeof t.akcMonthly === 'number' ? `${formatAkc(t.akcMonthly)} / mo` : t.akcMonthly}
              </div>
              {!compact ? (
                <ul className="mt-3 space-y-1">
                  {t.features.slice(0, 3).map((f) => (
                    <li key={f} className="text-[11px] text-[#64748B] flex gap-1.5">
                      <span className="text-[#2962FF]">✓</span> {f}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
