import { useEffect, useRef, useState } from "react";
import logoUrl from "./assets/32d4f05ae5209978-image_6A9BA612-7186-480D-9D5C-7EF8BE2260B7.jpeg";
import pricingTiersUrl from "./assets/7d9290b730632722-image_20261029_223334.webp";
import comparisonUrl from "./assets/20530fc21775b51f-image_20261029_223343.webp";
import AkcTierStrip from "../../../components/AkcTierStrip";
import { startSetupUrl, signInUrl } from "../../../lib/setupFlow";

const NAV_LINKS = [
  { label: "Features", href: "/eu/features" },
  { label: "Solutions", href: "/eu/solutions" },
  { label: "Languages", href: "/eu/languages" },
  { label: "How It Works", href: "/eu/how-it-works" },
];

const tiers = [
  {
    id: "starter",
    name: "Starter",
    price: "€25",
    sub: "per month VAT incl · 10,000 AKC",
    badge: null as string | null,
    members: "10,000 AKC / month",
    projects: "~500 voice mins runway",
    storage: "10GB · 3 voices · 2 langs",
    features: [
      "AKC prepaid wallet (VGC-style)",
      "1k SMS · 1k conversations",
      "Stripe SEPA · 2 channels",
      "5,000 AKC free trial (14 days)",
    ],
    muted: ["Social-to-Sale"],
    cta: "Get Starter",
    accent: "light",
  },
  {
    id: "growth",
    name: "Growth",
    price: "€79",
    sub: "per month VAT incl · 35,000 AKC",
    badge: "Most Popular",
    members: "35,000 AKC / month",
    projects: "~1,750 voice mins runway",
    storage: "50GB · 8 voices · 5 langs",
    features: [
      "Social-to-Sale · 5 channels",
      "5k SMS · 5k conversations",
      "Reload packs +10k → +150k AKC",
      "Priority support + analytics",
    ],
    muted: ["Dedicated account manager"],
    cta: "Get Growth",
    accent: "primary",
  },
  {
    id: "enterprise",
    name: "Scale",
    price: "€199",
    sub: "per month VAT incl · 100,000 AKC",
    badge: null,
    members: "100,000 AKC / month",
    projects: "~5,000 voice mins runway",
    storage: "200GB · 23 voices · 23 langs",
    features: [
      "All channels · team handoff",
      "20k SMS · custom AKC rates",
      "EU data residency Frankfurt",
      "SSO · SLA · Enterprise pools",
    ],
    muted: [],
    cta: "Go Scale",
    accent: "dark",
  },
];

const comparisonCards = [
  {
    name: "AiKOVA",
    price: "€89/mo Starter",
    callers: "200 unique callers",
    hosting: "EU-based GDPR Compliant",
    hostDetail: "EU data hosting Germany",
    bullets: ["GDPR compliant DPA available", "Multilingual 24 EU languages", "Calendar booking CRM", "24/7 AI voice human handoff"],
    saving: "Savings vs Slang ~68% cheaper",
    savingDetail: "Save ~€186/mo",
    overage: "Overage €0.40/extra caller",
    recommended: "Best for EU SMEs",
    color: "#2962FF",
  },
  {
    name: "Slang AI",
    price: "€275/mo Starter",
    callers: "1 location ~$299/mo",
    hosting: "US-based GDPR Compliant",
    hostDetail: "US hosting GDPR data processing",
    bullets: ["Restaurant-focused reservations", "OpenTable SevenRooms Yelp integrations", "24/7 voice agent reservation flow", "No free trial"],
    saving: "Highest cost option",
    savingDetail: "$299/mo USD No overage published",
    overage: "No overage published",
    recommended: "Best for Restaurants",
    color: "#0F172A",
  },
  {
    name: "Goodcall",
    price: "€73/mo Starter",
    callers: "100 unique callers",
    hosting: "US-based GDPR Compliant",
    hostDetail: "EU hosting option",
    bullets: ["Per unique caller model", "Booking SMS follow-ups CRM sync", "14-day free trial", "Growth €119/mo for 500 callers"],
    saving: "Savings vs Slang ~73% cheaper",
    savingDetail: "Save ~€202/mo",
    overage: "Overage €0.46/extra caller",
    recommended: "Best for Small Business Volume",
    color: "#475569",
  },
];

const faqs = [
  {
    q: "Are prices VAT included? Which VAT rate?",
    a: "Yes, all prices include 19% German VAT as reference EU VAT. Your invoice shows VAT breakdown for reverse-charge where applicable. EU businesses with valid VAT ID can use reverse charge — we automatically detect via VIES.",
  },
  {
    q: "Do you support SEPA Direct Debit and bank transfer?",
    a: "Yes. Powered by Stripe with SEPA Direct Debit, SEPA Credit Transfer, and bank transfer (IBAN). Card payments via Visa, Mastercard, SEPA. Billing monthly, cancel anytime from dashboard.",
  },
  {
    q: "Is AiKOVA GDPR compliant? Where is data hosted?",
    a: "Fully GDPR compliant. Data hosted in EU — Germany (Frankfurt, EU-Central-1). DPA available on request. No data leaves EU without explicit consent. EU data residency guaranteed for Enterprise. UK GDPR adequacy covered.",
  },
  {
    q: "What happens after 14-day free trial?",
    a: "Trial includes Growth features. No card required to start trial. After 14 days, choose tier or data remains exportable for 30 days. No auto-charge. Cancel anytime during trial in one click.",
  },
  {
    q: "Can I bring my own phone numbers for EU countries?",
    a: "Yes — bring numbers from 27 EU member states + UK. We support local DID, toll-free, and mobile. Number porting included in Enterprise. All voice data stays in EU POPs for latency and compliance.",
  },
  {
    q: "How does unique caller pricing work vs Slang / Goodcall?",
    a: "We count unique callers per month, not minutes. 200 unique callers included in €89 Starter. Extra caller €0.40 vs Goodcall €0.46. Slang charges per location flat — typically €275/mo. You save ~€186/mo vs Slang at Starter tier.",
  },
];

function useReveal() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const els = ref.current?.querySelectorAll(".reveal");
    if (!els) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const target = e.target as HTMLElement;
            target.classList.add("in");
            io.unobserve(target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el, i) => {
      (el as HTMLElement).style.transitionDelay = `${i * 70}ms`;
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return ref;
}

export default function EuPricingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [arpu, setArpu] = useState(30);
  const revealRef = useReveal();
  const growthRef = useRef<HTMLDivElement>(null);

  // growth calc
  const scenarios = [
    { users: 10000, churn: 0.05 },
    { users: 100000, churn: 0.04 },
  ];

  const calcMRR = (users: number) => users * arpu;
  const calcARR = (users: number) => calcMRR(users) * 12;

  return (
    <div
      data-safe-area-inset-root
      className="min-h-screen w-full bg-white text-[#0F172A] overflow-x-clip selection:bg-[#2962FF]/20"
      style={{ boxSizing: "border-box", paddingTop: "var(--safe-area-inset-top)" }}
    >
      {/* NAV */}
      <header
        data-safe-area-sticky-top
        className="sticky z-50 top-[var(--safe-area-inset-top)] w-full border-b border-[#E2E8F0] bg-white/85 glass"
      >
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8 h-[68px] flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="/eu" className="flex items-center gap-3">
              <img
                src={logoUrl}
                alt="AiKOVA Logo"
                className="h-8 w-auto rounded-md object-contain"
              />
              <span className="font-[700] tracking-tight text-[19px]">AiKOVA</span>
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#F1F5F9] px-2.5 py-1 text-[11px] font-semibold tracking-wide text-[#0F172A] border border-[#E2E8F0]">
                <span className="h-2 w-2 rounded-full bg-[#76FF03] animate-pulse" />
                EU PRICING • LIVE
              </span>
            </a>

            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="px-3.5 py-2 rounded-full text-[14px] font-medium text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="/eu/pricing"
                className="ml-2 inline-flex items-center gap-2 rounded-full bg-[#0F172A] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(15,23,42,0.5)]"
              >
                Pricing
                <span className="inline-flex items-center text-[14px] leading-none">🇬🇧🇪🇺</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#00E5FF]" />
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href={startSetupUrl("eurozone")}
              className="hidden md:inline-flex h-9 items-center rounded-full border border-[#E2E8F0] bg-white px-4 text-[13px] font-semibold hover:border-[#CBD5E1] transition"
            >
              Demo
            </a>
            <a
              href={signInUrl("eurozone")}
              className="hidden md:inline-flex h-9 items-center rounded-full px-3 text-[13px] font-semibold text-[#475569] hover:text-[#0F172A]"
            >
              Sign in
            </a>
            <a
              id="assess-button-main-hero"
              href={startSetupUrl("eurozone")}
              className="inline-flex h-9 items-center gap-2 rounded-full bg-gradient-to-r from-[#00E5FF] via-[#2962FF] to-[#012169] px-5 text-[13px] font-bold text-white shadow-[0_12px_24px_-12px_#2962FF] hover:opacity-95 active:scale-[0.98] transition"
            >
              Start free trial
              <span className="hidden sm:inline">↗</span>
            </a>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E2E8F0] bg-white"
              aria-label="Menu"
            >
              <div className="space-y-1.5">
                <div className="h-[2px] w-4 bg-[#0F172A] rounded" />
                <div className="h-[2px] w-4 bg-[#0F172A] rounded" />
                <div className="h-[2px] w-4 bg-[#0F172A] rounded" />
              </div>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-[#E2E8F0] bg-white px-5 py-4">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((l) => (
                <a key={l.label} href={l.href} className="py-2.5 text-[15px] font-medium text-[#334155]" onClick={() => setMobileOpen(false)}>
                  {l.label}
                </a>
              ))}
              <a href="/eu/pricing" className="py-2.5 text-[15px] font-semibold text-[#0F172A]" onClick={() => setMobileOpen(false)}>
                Pricing 🇬🇧🇪🇺 active
              </a>
            </div>
          </div>
        )}
      </header>

      <main ref={revealRef} className="w-full">
        {/* HERO */}
        <section className="relative overflow-hidden bg-white">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-[30%] left-1/2 h-[900px] w-[1200px] -translate-x-1/2 rounded-full bg-[radial-gradient(40%_60%_at_50%_30%,rgba(0,229,255,0.16),transparent_70%)]" />
            <div className="absolute top-[10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(60%_60%_at_50%_50%,rgba(41,98,255,0.12),transparent_70%)]" />
            <div className="absolute bottom-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(60%_60%_at_50%_50%,rgba(118,255,3,0.10),transparent_70%)]" />
          </div>

          <div className="relative mx-auto max-w-[1280px] px-5 lg:px-8 pt-10 lg:pt-16 pb-10">
            <div className="reveal flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-[#475569] uppercase">
                <span className="inline-flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#00E5FF]" />
                  <span className="h-2 w-2 rounded-full bg-[#2962FF]" />
                  <span className="h-2 w-2 rounded-full bg-[#76FF03]" />
                </span>
                Pricing • EUR • VAT Included • Stripe SEPA • GDPR Compliant
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#012169] px-3 py-1.5 text-[11px] font-bold tracking-wide text-white">
                🇬🇧 UK flag-off • EU27 + UK Local Expertise
              </span>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-12 items-start">
              <div className="reveal">
                <h1 className="text-[40px] sm:text-[54px] lg:text-[64px] leading-[0.92] font-[700] tracking-[-0.04em]">
                  Transparent pricing.
                  <br />
                  <span className="gradient-text">VAT included.</span>
                  <br />
                  Powered by Stripe.
                </h1>
                <p className="mt-6 max-w-[640px] text-[17px] leading-[1.6] text-[#475569]">
                  <span className="font-semibold text-[#0F172A]">€25 · 10k AKC · Starter · €79 · 35k AKC Growth · €199 · 100k AKC Scale.</span> Prepaid AiKOVA Credits (like VisaGuide VGC). 5,000 AKC free trial (14 days), EU hosting Germany, GDPR, SEPA. Reload packs anytime.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <a
                    href={startSetupUrl("eurozone")}
                    className="inline-flex h-[46px] items-center gap-2 rounded-full bg-[#0F172A] px-6 text-[14px] font-semibold text-white shadow-[0_16px_32px_-16px_rgba(15,23,42,0.6)] hover:bg-black transition"
                  >
                    Start free trial <span className="text-[#00E5FF]">→</span>
                  </a>
                  <button
                    onClick={() => document.getElementById("compare")?.scrollIntoView({ behavior: "smooth" })}
                    className="inline-flex h-[46px] items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-6 text-[14px] font-semibold text-[#0F172A] hover:border-[#CBD5E1] transition"
                  >
                    Compare Savings
                    <span className="inline-flex h-5 items-center justify-center rounded-full bg-[#F1F5F9] px-2 text-[11px]">€186</span>
                  </button>
                </div>

                <div className="mt-8 grid grid-cols-3 max-w-[520px] gap-3">
                  {[
                    { k: "Stripe + SEPA", v: "Secure payments" },
                    { k: "GDPR • DPA", v: "EU Hosting Germany" },
                    { k: "14-day trial", v: "Cancel anytime" },
                  ].map((i) => (
                    <div key={i.k} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-3">
                      <div className="text-[11px] font-bold tracking-wide text-[#64748B] uppercase">{i.k}</div>
                      <div className="mt-1 text-[13px] font-semibold text-[#0F172A] leading-tight">{i.v}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="reveal relative lg:sticky lg:top-[88px]">
                <div className="absolute -inset-3 rounded-[28px] bg-gradient-to-br from-[#00E5FF]/20 via-[#2962FF]/15 to-[#76FF03]/15 blur-[18px]" />
                <div className="relative overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-white shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)]">
                  <div className="flex items-center justify-between border-b border-[#F1F5F9] bg-[#F8FAFC]/80 px-5 py-3">
                    <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide text-[#475569] uppercase">
                      <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
                      Live EUR Pricing • Oct 2026
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#E2E8F0]" />
                      <span className="h-2 w-2 rounded-full bg-[#E2E8F0]" />
                      <span className="h-2 w-2 rounded-full bg-[#E2E8F0]" />
                    </div>
                  </div>
                  <div className="p-2 bg-white">
                    <img src={pricingTiersUrl} alt="European Business Pricing Tiers" className="w-full rounded-[16px] object-contain" />
                  </div>
                  <div className="grid grid-cols-3 divide-x divide-[#F1F5F9] border-t border-[#F1F5F9] bg-[#F8FAFC] text-center">
                    <div className="px-3 py-3">
                      <div className="text-[11px] font-bold text-[#64748B] tracking-wide uppercase">Starter</div>
                      <div className="text-[16px] font-bold text-[#0F172A]">€25</div>
                    </div>
                    <div className="px-3 py-3">
                      <div className="text-[11px] font-bold text-[#2962FF] tracking-wide uppercase">Growth • Popular</div>
                      <div className="text-[16px] font-bold text-[#0F172A]">€79</div>
                    </div>
                    <div className="px-3 py-3">
                      <div className="text-[11px] font-bold text-[#012169] tracking-wide uppercase">Enterprise</div>
                      <div className="text-[16px] font-bold text-[#0F172A]">€199</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 flex items-center gap-3 shadow-sm">
                  <div className="flex -space-x-2">
                    <div className="h-7 w-7 rounded-full bg-[#012169] border-2 border-white grid place-items-center text-[10px] text-white font-bold">EU</div>
                    <div className="h-7 w-7 rounded-full bg-[#C8102E] border-2 border-white grid place-items-center text-[10px] text-white font-bold">UK</div>
                    <div className="h-7 w-7 rounded-full bg-[#2962FF] border-2 border-white grid place-items-center text-[10px] text-white font-bold">DE</div>
                  </div>
                  <div className="text-[12px] leading-tight">
                    <div className="font-semibold text-[#0F172A]">Supporting 27 EU Member States + United Kingdom</div>
                    <div className="text-[#64748B]">Local expertise • IBAN billing • VAT reverse charge</div>
                  </div>
                  <div className="ml-auto h-2 w-2 rounded-full bg-[#76FF03] animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="border-y border-[#E2E8F0] bg-white">
          <AkcTierStrip />
        </div>

        {/* PRICING TIERS DETAILED */}
        <section id="pricing" className="relative bg-[#F8FAFC] border-y border-[#E2E8F0]">
          <div className="mx-auto max-w-[1280px] px-5 lg:px-8 py-12 lg:py-20">
            <div className="reveal flex flex-wrap items-end justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white border border-[#E2E8F0] px-3.5 py-1.5 text-[11px] font-bold tracking-[0.12em] text-[#475569] uppercase">
                  European Business Pricing Tiers • AKC Credits • VAT included
                </div>
                <h2 className="mt-4 text-[30px] lg:text-[44px] leading-[0.95] font-[700] tracking-[-0.03em]">
                  Powered by Stripe • SEPA Direct Debit available
                </h2>
              </div>
              <div className="max-w-[420px] text-[14px] leading-[1.6] text-[#475569]">
                All prices include VAT 19% • GDPR compliant • Hosted in EU • Billed monthly • Cancel anytime • 14-day free trial • Prices in EUR
              </div>
            </div>

            {/* Centerpiece image card */}
            <div className="reveal mt-10">
              <div className="relative rounded-[24px] border border-[#E2E8F0] bg-white p-2 sm:p-3 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.18)]">
                <div className="absolute -top-3 left-6 inline-flex items-center gap-2 rounded-full bg-[#0F172A] px-3.5 py-1.5 text-[11px] font-bold text-white shadow">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00E5FF]" /> Image that speaks • Original asset
                </div>
                <img
                  src={pricingTiersUrl}
                  alt="European Business Pricing Tiers Transparent pricing VAT included Powered by Stripe SEPA Direct Debit available"
                  className="w-full rounded-[16px] object-contain bg-white"
                />
              </div>
            </div>

            {/* Detailed 3 cards */}
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7">
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`reveal relative flex flex-col rounded-[24px] border bg-white p-6 lg:p-7 shadow-[var(--shadow-card)] transition-all duration-500 hover:shadow-[0_32px_64px_-20px_rgba(15,23,42,0.16)] hover:-translate-y-1 ${
                    tier.accent === "primary" ? "border-[#2962FF]/30 ring-1 ring-[#2962FF]/10" : "border-[#E2E8F0]"
                  }`}
                >
                  {tier.badge && (
                    <div className="absolute -top-3 right-6 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#2962FF] to-[#012169] px-3.5 py-1.5 text-[11px] font-bold text-white shadow">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#76FF03] animate-pulse" />
                      {tier.badge}
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[13px] font-bold tracking-[0.12em] uppercase text-[#64748B]">{tier.name}</div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-[42px] font-[700] leading-none tracking-[-0.04em]">{tier.price}</span>
                        <span className="text-[14px] font-medium text-[#475569]">/mo</span>
                      </div>
                      <div className="mt-1 text-[12px] font-semibold text-[#475569]">{tier.sub}</div>
                    </div>
                    <div
                      className={`grid h-10 w-10 place-items-center rounded-full border text-[16px] font-bold ${
                        tier.accent === "primary"
                          ? "bg-[#2962FF] text-white border-[#2962FF]"
                          : tier.accent === "dark"
                          ? "bg-[#0F172A] text-white border-[#0F172A]"
                          : "bg-[#F1F5F9] text-[#0F172A] border-[#E2E8F0]"
                      }`}
                    >
                      {tier.price.replace("€", "")}
                    </div>
                  </div>

                  <div className="mt-6 space-y-2.5 rounded-2xl bg-[#F8FAFC] border border-[#F1F5F9] p-4">
                    <div className="flex items-center gap-2 text-[13px] font-medium text-[#0F172A]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#2962FF]" />
                      {tier.members}
                    </div>
                    <div className="flex items-center gap-2 text-[13px] font-medium text-[#0F172A]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#00E5FF]" />
                      {tier.projects}
                    </div>
                    <div className="flex items-center gap-2 text-[13px] font-medium text-[#0F172A]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#76FF03]" />
                      {tier.storage}
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {tier.features.map((f) => (
                      <div key={f} className="flex items-start gap-2.5 text-[13px] leading-[1.4] text-[#334155]">
                        <span className="mt-[3px] inline-grid h-5 w-5 place-items-center rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[11px] text-[#059669]">✓</span>
                        {f}
                      </div>
                    ))}
                    {tier.muted.map((f) => (
                      <div key={f} className="flex items-start gap-2.5 text-[13px] leading-[1.4] text-[#94A3B8] line-through">
                        <span className="mt-[3px] inline-grid h-5 w-5 place-items-center rounded-full bg-[#F1F5F9] border border-[#E2E8F0] text-[11px]">–</span>
                        {f}
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto pt-7">
                    <a
                      href={startSetupUrl("eurozone")}
                      className={`w-full inline-flex h-[44px] items-center justify-center rounded-full text-[13px] font-bold transition active:scale-[0.98] ${
                        tier.accent === "light"
                          ? "bg-[#E0F2FE] text-[#0F172A] border border-[#BAE6FD] hover:bg-[#BAE6FD]"
                          : tier.accent === "primary"
                          ? "bg-[#2962FF] text-white shadow-[0_12px_24px_-12px_#2962FF] hover:bg-[#1E4FD8]"
                          : "bg-[#0F172A] text-white hover:bg-black"
                      }`}
                    >
                      {tier.cta} <span className="ml-1">→</span>
                    </a>
                    <div className="mt-3 text-center text-[11px] font-medium text-[#94A3B8]">Secure payments by Stripe • SEPA</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="reveal mt-8 grid grid-cols-1 md:grid-cols-3 gap-3 text-[12px]">
              <div className="rounded-full border border-[#E2E8F0] bg-white px-4 py-2.5 text-center font-medium text-[#475569]">
                Secure payments by Stripe • SEPA Direct Debit • Bank transfer supported
              </div>
              <div className="rounded-full border border-[#E2E8F0] bg-white px-4 py-2.5 text-center font-medium text-[#475569]">
                All prices include VAT 19% • GDPR compliant • Hosted in EU
              </div>
              <div className="rounded-full bg-[#0F172A] px-4 py-2.5 text-center font-semibold text-white">
                Billed monthly • Cancel anytime • 14-day free trial • Prices EUR VAT included
              </div>
            </div>
          </div>
        </section>

        {/* COMPARISON */}
        <section id="compare" className="bg-white">
          <div className="mx-auto max-w-[1280px] px-5 lg:px-8 py-14 lg:py-20">
            <div className="reveal max-w-[900px]">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-1.5 text-[11px] font-bold tracking-[0.12em] uppercase text-[#475569]">
                Eurozone Pricing Comparison • Oct 2026 • GDPR Compliant
              </div>
              <h2 className="mt-4 text-[32px] lg:text-[48px] leading-[0.95] font-[700] tracking-[-0.03em]">
                Eurozone Pricing Comparison — AI Phone Agents
                <br />
                <span className="text-[#475569]">AiKOVA vs Slang AI vs Goodcall</span>
              </h2>
              <p className="mt-4 text-[15px] leading-[1.6] text-[#475569] max-w-[720px]">
                EUR Pricing Savings GDPR Compliant Oct 2026. All three GDPR compliant DPA available EU data residency. Savings calculated vs Slang Starter monthly converted from USD 1USD≈0.92EUR. Tip For &gt;500 callers/mo Goodcall Growth or AiKOVA Pro may be more cost-effective.
              </p>
            </div>

            {/* Centerpiece image */}
            <div className="reveal mt-10">
              <div className="relative overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-[#F8FAFC] p-2 sm:p-3 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.18)]">
                <img
                  src={comparisonUrl}
                  alt="Eurozone Pricing Comparison AiKOVA vs Slang vs Goodcall"
                  className="w-full rounded-[16px] object-contain bg-white"
                />
              </div>
            </div>

            {/* Highlight grid */}
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {comparisonCards.map((c) => (
                <div
                  key={c.name}
                  className={`reveal relative rounded-[24px] border bg-white p-6 shadow-[var(--shadow-card)] ${
                    c.name === "AiKOVA" ? "border-[#2962FF]/30 ring-1 ring-[#2962FF]/10" : "border-[#E2E8F0]"
                  }`}
                >
                  {c.name === "AiKOVA" && (
                    <div className="absolute -top-3 left-6 inline-flex rounded-full bg-gradient-to-r from-[#00E5FF] to-[#2962FF] px-3 py-1 text-[11px] font-bold text-white">
                      BEST VALUE • EU SME CHOICE
                    </div>
                  )}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[13px] font-bold tracking-wide uppercase text-[#64748B]">{c.name}</div>
                      <div className="mt-1 text-[22px] font-[700] tracking-tight">{c.price}</div>
                      <div className="text-[12px] font-medium text-[#475569]">{c.callers}</div>
                    </div>
                    <div className="h-10 w-10 rounded-full grid place-items-center text-white font-bold text-[13px]" style={{ background: c.color }}>
                      {c.name[0]}
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] px-3.5 py-2.5">
                    <div className="text-[11px] font-bold uppercase tracking-wide text-[#475569]">{c.hosting}</div>
                    <div className="mt-0.5 text-[12px] font-medium text-[#0F172A]">{c.hostDetail}</div>
                  </div>

                  <ul className="mt-4 space-y-2">
                    {c.bullets.map((b) => (
                      <li key={b} className="flex gap-2 text-[12.5px] leading-[1.45] text-[#334155]">
                        <span className="text-[#2962FF]">•</span> {b}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 rounded-xl border border-dashed border-[#E2E8F0] bg-[#F8FAFC]/70 p-3">
                    <div className="text-[11px] font-bold text-[#0F172A]">{c.saving}</div>
                    <div className="text-[12px] font-medium text-[#475569]">{c.savingDetail}</div>
                    <div className="mt-1 text-[11px] text-[#94A3B8]">{c.overage}</div>
                  </div>

                  <div className="mt-4 inline-flex rounded-full bg-[#0F172A] px-3 py-1 text-[11px] font-semibold text-white">{c.recommended}</div>
                </div>
              ))}
            </div>

            {/* Quick Comparison */}
            <div className="reveal mt-10 rounded-[24px] border border-[#E2E8F0] bg-[#F8FAFC] p-6 lg:p-8">
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <div className="text-[13px] font-bold tracking-[0.12em] uppercase text-[#0F172A]">Quick Comparison • Recommended For</div>
                <span className="rounded-full bg-white border border-[#E2E8F0] px-2.5 py-1 text-[11px] font-semibold text-[#475569]">All GDPR compliant DPA available</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-2xl bg-white border border-[#E2E8F0] p-5">
                  <div className="inline-flex rounded-full bg-[#2962FF] px-2.5 py-1 text-[11px] font-bold text-white">AiKOVA</div>
                  <div className="mt-3 text-[14px] font-bold text-[#0F172A]">Best for EU SMEs Most balanced</div>
                  <div className="mt-1 text-[13px] leading-[1.5] text-[#475569]">EU hosting pricing Ideal for EU businesses needing GDPR bilingual support, multilingual 24 EU languages, calendar booking CRM 24/7 AI voice human handoff.</div>
                  <div className="mt-3 inline-flex rounded-full bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-1 text-[11px] font-bold text-[#065F46]">Save ~€186/mo vs Slang</div>
                </div>
                <div className="rounded-2xl bg-white border border-[#E2E8F0] p-5">
                  <div className="inline-flex rounded-full bg-[#0F172A] px-2.5 py-1 text-[11px] font-bold text-white">Slang AI</div>
                  <div className="mt-3 text-[14px] font-bold text-[#0F172A]">Best for Restaurants Specialized</div>
                  <div className="mt-1 text-[13px] leading-[1.5] text-[#475569]">Specialized restaurants hospitality Strong booking integrations Higher cost. US-based hosting, restaurant-focused reservations.</div>
                  <div className="mt-3 inline-flex rounded-full bg-[#FEF2F2] border border-[#FECACA] px-2.5 py-1 text-[11px] font-bold text-[#991B1B]">Highest cost €275/mo</div>
                </div>
                <div className="rounded-2xl bg-white border border-[#E2E8F0] p-5">
                  <div className="inline-flex rounded-full bg-[#475569] px-2.5 py-1 text-[11px] font-bold text-white">Goodcall</div>
                  <div className="mt-3 text-[14px] font-bold text-[#0F172A]">Best for Small Business Volume</div>
                  <div className="mt-1 text-[13px] leading-[1.5] text-[#475569]">Lowest entry price Pay-per-caller model Quick 14-day trial. Growth €119/mo for 500 callers, overage €0.46.</div>
                  <div className="mt-3 inline-flex rounded-full bg-[#EFF6FF] border border-[#BFDBFE] px-2.5 py-1 text-[11px] font-bold text-[#1E40AF]">Entry €73/mo 100 callers</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GROWTH CALCULATION */}
        <section ref={growthRef} className="bg-[#0F172A] text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_20%_10%,rgba(0,229,255,0.22),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(50%_60%_at_80%_20%,rgba(41,98,255,0.22),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(40%_50%_at_60%_90%,rgba(118,255,3,0.12),transparent_60%)]" />
          </div>

          <div className="relative mx-auto max-w-[1280px] px-5 lg:px-8 py-14 lg:py-20">
            <div className="reveal flex flex-wrap items-start justify-between gap-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold tracking-[0.12em] uppercase text-white/80">
                  Growth Calculation • Eurozone Revenue Artefact • EUR Pricing
                </div>
                <h2 className="mt-4 text-[30px] lg:text-[44px] leading-[0.95] font-[700] tracking-[-0.03em]">
                  Scale math: 10k vs 100k users
                  <br />
                  <span className="text-white/60">ARPU €30 • EU hosted margin</span>
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-[12px] font-semibold text-white/60 uppercase tracking-wide">ARPU Slider</div>
                <div className="flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 py-1.5">
                  <span className="text-[12px] font-bold">€</span>
                  <input
                    type="range"
                    min={15}
                    max={79}
                    value={arpu}
                    onChange={(e) => setArpu(Number(e.target.value))}
                    className="w-28 accent-[#00E5FF]"
                  />
                  <span className="min-w-[48px] text-[13px] font-bold">{arpu} EUR</span>
                </div>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {scenarios.map((sc) => {
                const mrr = calcMRR(sc.users);
                const arr = calcARR(sc.users);
                const netMrr = mrr * (1 - sc.churn);
                const ltv = (arpu / sc.churn) * 0.85; // simplified with gross margin
                return (
                  <div key={sc.users} className="reveal rounded-[24px] border border-white/10 bg-white/[0.06] p-6 lg:p-7 backdrop-blur">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 rounded-full bg-white text-[#0F172A] px-3 py-1 text-[11px] font-bold">
                        {sc.users.toLocaleString("de-DE")} users • {sc.churn * 100}% churn
                      </div>
                      <div className="text-[11px] font-semibold text-white/50">VAT included • EUR</div>
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-3">
                      <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
                        <div className="text-[11px] font-bold uppercase tracking-wide text-white/50">MRR</div>
                        <div className="mt-1 text-[22px] font-bold tracking-tight">€{mrr.toLocaleString("de-DE")}</div>
                        <div className="text-[11px] text-white/50">Monthly Recurring</div>
                      </div>
                      <div className="rounded-2xl bg-white text-[#0F172A] p-4 shadow">
                        <div className="text-[11px] font-bold uppercase tracking-wide text-[#475569]">ARR</div>
                        <div className="mt-1 text-[22px] font-bold tracking-tight">€{arr.toLocaleString("de-DE")}</div>
                        <div className="text-[11px] text-[#64748B]">Annual Run Rate</div>
                      </div>
                      <div className="rounded-2xl bg-gradient-to-br from-[#00E5FF] to-[#2962FF] p-4 text-white">
                        <div className="text-[11px] font-bold uppercase tracking-wide text-white/70">Net MRR after churn</div>
                        <div className="mt-1 text-[22px] font-bold tracking-tight">€{Math.round(netMrr).toLocaleString("de-DE")}</div>
                        <div className="text-[11px] text-white/70">Churn adjusted</div>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <div className="text-[11px] font-bold uppercase text-white/50">ARPU • Blended</div>
                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="text-[28px] font-bold">€{arpu}</span>
                          <span className="text-[12px] text-white/50">/user/mo</span>
                        </div>
                        <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full rounded-full bg-[#76FF03]" style={{ width: `${(arpu / 79) * 100}%` }} />
                        </div>
                        <div className="mt-2 text-[11px] text-white/50">Starter €25 • Growth €79 • Enterprise €199 blended</div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <div className="text-[11px] font-bold uppercase text-white/50">LTV • Gross Margin 85%</div>
                        <div className="mt-2 text-[28px] font-bold">€{Math.round(ltv).toLocaleString("de-DE")}</div>
                        <div className="mt-1 text-[11px] leading-[1.4] text-white/50">
                          LTV = ARPU / churn * margin. EU hosting Germany cost advantage vs US-based competitors.
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 rounded-xl border border-dashed border-white/15 bg-white/5 px-4 py-3 flex items-center justify-between">
                      <div className="text-[12px] font-medium text-white/70">
                        Compare: Slang €275/mo fixed per location → <span className="text-white font-bold">€{Math.round(sc.users * 0.275).toLocaleString("de-DE")}k/mo hypothetical</span> vs AiKOVA blended €{arpu}
                      </div>
                      <div className="rounded-full bg-[#76FF03] px-2.5 py-1 text-[11px] font-bold text-[#0F172A]">Save ~68%</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="reveal mt-8 flex flex-wrap gap-2 text-[11px]">
              <span className="rounded-full bg-white/10 border border-white/10 px-3 py-1.5 text-white/60">Secure payments by Stripe • SEPA Direct Debit • Bank transfer supported</span>
              <span className="rounded-full bg-white text-[#0F172A] px-3 py-1.5 font-semibold">All prices include VAT 19% • GDPR compliant • Hosted in EU • Billed monthly • Cancel anytime • 14-day free trial</span>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-[#F8FAFC] border-y border-[#E2E8F0]">
          <div className="mx-auto max-w-[1280px] px-5 lg:px-8 py-14 lg:py-20">
            <div className="reveal grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
              <div>
                <div className="inline-flex rounded-full border border-[#E2E8F0] bg-white px-3.5 py-1.5 text-[11px] font-bold tracking-[0.12em] uppercase text-[#475569]">FAQ • VAT? SEPA? GDPR DPA? EU Hosting?</div>
                <h2 className="mt-4 text-[32px] lg:text-[44px] leading-[0.95] font-[700] tracking-[-0.03em]">Eurozone billing,<br />built for finance teams.</h2>
                <p className="mt-4 text-[14px] leading-[1.6] text-[#475569] max-w-[420px]">VAT, SEPA, GDPR, DPA, EU data hosting, cancel flow, trial — answered with Stripe-level clarity. Supporting 27 EU Member States + UK Local Expertise.</p>

                <div className="mt-6 rounded-2xl border border-[#E2E8F0] bg-white p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#012169] grid place-items-center text-white font-bold">€</div>
                  <div>
                    <div className="text-[13px] font-bold text-[#0F172A]">SEPA Direct Debit • Bank transfer supported</div>
                    <div className="text-[12px] text-[#475569]">IBAN, VAT reverse charge, German VAT 19% reference</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {faqs.map((f, i) => (
                  <div key={f.q} className={`reveal rounded-[20px] border bg-white transition-all ${activeFaq === i ? "border-[#2962FF]/30 shadow-[0_12px_32px_-12px_rgba(41,98,255,0.25)]" : "border-[#E2E8F0] hover:border-[#CBD5E1]"}`}>
                    <button
                      onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                      className="w-full flex items-start justify-between gap-4 px-5 lg:px-6 py-4 lg:py-5 text-left"
                    >
                      <span className="text-[14px] lg:text-[15px] font-semibold leading-[1.35] text-[#0F172A]">{f.q}</span>
                      <span className={`mt-0.5 inline-grid h-7 w-7 shrink-0 place-items-center rounded-full border text-[14px] transition ${activeFaq === i ? "bg-[#0F172A] text-white border-[#0F172A] rotate-45" : "bg-[#F8FAFC] border-[#E2E8F0] text-[#475569]"}`}>+</span>
                    </button>
                    {activeFaq === i && <div className="px-5 lg:px-6 pb-5 text-[13.5px] leading-[1.6] text-[#475569]">{f.a}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF] via-[#2962FF] to-[#012169]" />
          <div className="absolute inset-0 bg-[radial-gradient(60%_100%_at_20%_0%,rgba(118,255,3,0.35),transparent_60%)]" />
          <div className="relative mx-auto max-w-[1280px] px-5 lg:px-8 py-10 lg:py-14">
            <div className="reveal flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="max-w-[760px]">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/20 px-3.5 py-1.5 text-[11px] font-bold tracking-wide text-white uppercase backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#76FF03] animate-pulse" /> Live Eurozone Savings
                </div>
                <h3 className="mt-4 text-[28px] lg:text-[40px] leading-[0.95] font-[700] tracking-[-0.03em] text-white">
                  Save ~€186/mo vs Slang AI. Start with €25, scale to €199, GDPR ready, EU hosted.
                </h3>
                <div className="mt-3 flex flex-wrap gap-2 text-[12px] font-medium text-white/80">
                  <span className="rounded-full bg-white/10 border border-white/15 px-3 py-1">Transparent pricing • VAT included • Powered by Stripe</span>
                  <span className="rounded-full bg-white text-[#0F172A] px-3 py-1 font-semibold">14-day free trial • Cancel anytime • SEPA Direct Debit</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <a
                  href={startSetupUrl("eurozone")}
                  className="inline-flex h-[48px] items-center justify-center gap-2 rounded-full bg-white px-7 text-[14px] font-bold text-[#0F172A] shadow-[0_12px_24px_-12px_rgba(0,0,0,0.4)] hover:bg-[#F8FAFC] transition active:scale-[0.98]"
                >
                  Start free trial <span>→</span>
                </a>
                <div className="inline-flex h-[48px] items-center rounded-full border border-white/20 bg-white/10 px-5 text-[12px] font-semibold text-white backdrop-blur">
                  🇪🇺 EU27 + 🇬🇧 UK • GDPR • DPA • Germany hosting
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-[#E2E8F0]">
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr] gap-10">
            <div>
              <div className="flex items-center gap-3">
                <img src={logoUrl} alt="AiKOVA Logo" className="h-8 w-auto rounded-md" />
                <span className="font-bold text-[18px] tracking-tight">AiKOVA</span>
                <span className="rounded-full bg-[#F1F5F9] border border-[#E2E8F0] px-2.5 py-1 text-[11px] font-bold">EUROZONE PRICING NO.6</span>
              </div>
              <p className="mt-4 max-w-[420px] text-[13px] leading-[1.6] text-[#475569]">
                Supporting 27 EU Member States United Kingdom Local Expertise. Billed monthly Cancel anytime 14-day free trial Prices EUR VAT included. Secure payments by Stripe SEPA Direct Debit Bank transfer supported All prices include VAT 19% GDPR compliant Hosted in EU.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  "🇩🇪 Germany Hosting",
                  "🇪🇺 GDPR Compliant",
                  "🇬🇧 UK Local Expertise",
                  "SEPA • Stripe",
                ].map((t) => (
                  <span key={t} className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1 text-[11px] font-semibold text-[#475569]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[12px] font-bold tracking-[0.12em] uppercase text-[#0F172A]">Product</div>
              <ul className="mt-4 space-y-2.5 text-[13px] text-[#475569]">
                <li>Features</li>
                <li>Solutions</li>
                <li>Languages • 24 EU</li>
                <li>How It Works</li>
                <li className="font-semibold text-[#0F172A]">Pricing 🇬🇧🇪🇺 active</li>
              </ul>
            </div>
            <div>
              <div className="text-[12px] font-bold tracking-[0.12em] uppercase text-[#0F172A]">Compliance</div>
              <ul className="mt-4 space-y-2.5 text-[13px] text-[#475569]">
                <li>GDPR • DPA Available</li>
                <li>EU Data Hosting Germany</li>
                <li>VAT Included 19%</li>
                <li>SEPA Direct Debit</li>
                <li>SLA 99.9% Uptime</li>
              </ul>
            </div>
            <div>
              <div className="text-[12px] font-bold tracking-[0.12em] uppercase text-[#0F172A]">Pricing</div>
              <ul className="mt-4 space-y-2.5 text-[13px] text-[#475569]">
                <li>Starter €25/mo</li>
                <li>Growth €79/mo Most Popular</li>
                <li>Enterprise €199/mo</li>
                <li>14-day free trial</li>
                <li>Billed monthly • Cancel anytime</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col lg:flex-row items-center justify-between gap-4 border-t border-[#E2E8F0] pt-6">
            <div className="text-[12px] text-[#94A3B8]">© 2026 AiKOVA • Eurozone Marketing Page No.6 • PRICING • UK flag-off • White theme • Images that speak • Infographic flawless beauty • EUR VAT included • Stripe SEPA GDPR compliant</div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#00E5FF]" />
              <span className="h-2 w-2 rounded-full bg-[#2962FF]" />
              <span className="h-2 w-2 rounded-full bg-[#76FF03]" />
              <span className="ml-2 text-[11px] font-bold tracking-wide text-[#475569] uppercase">Production Ready • Best UI Magic</span>
            </div>
          </div>
        </div>
      </footer>

      {/* subtle texture */}
      <style>{`
        @media (max-width: 390px) {
          h1 { font-size: 36px !important; }
        }
      `}</style>
    </div>
  );
}
