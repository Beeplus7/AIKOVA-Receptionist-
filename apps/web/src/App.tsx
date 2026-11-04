import { lazy, Suspense, type ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import SitePagesMenu from './components/SitePagesMenu'
import MarketingRegionSwitcher from './components/MarketingRegionSwitcher'
import AuthGate from './components/auth/AuthGate'
import { RegionProvider, useRegion } from './context/RegionContext'

const CompanionGuideHost = lazy(() => import('./components/companion/CompanionGuideHost'))
const TryNowFloater = lazy(() => import('./components/try/TryNowFloater'))

// Eager home + auth so mobile CTAs paint with first JS (no Suspense wait / redirect chunk)
import HomePage from './pages/home/HomePage'
import EuHomePage from './pages/eu/home/EuHomePage'
import AuthPage from './pages/auth/AuthPage'

const TryNowPage = lazy(() => import('./pages/try/TryNowPage'))
const TrialsIndexPage = lazy(() => import('./pages/trials/TrialsIndexPage'))
const TrialCategoryPage = lazy(() => import('./pages/trials/TrialCategoryPage'))
const FeaturesPage = lazy(() => import('./pages/features/FeaturesPage'))
const SolutionsPage = lazy(() => import('./pages/solutions/SolutionsPage'))
const LanguagesPage = lazy(() => import('./pages/languages/LanguagesPage'))
const HowItWorksPage = lazy(() => import('./pages/how-it-works/HowItWorksPage'))
const PricingPage = lazy(() => import('./pages/pricing/PricingPage'))
const BusinessPage = lazy(() => import('./pages/business/BusinessPage'))
const CustomersPage = lazy(() => import('./pages/customers/CustomersPage'))
const ResourcesPage = lazy(() => import('./pages/resources/ResourcesPage'))
const CompanyPage = lazy(() => import('./pages/company/CompanyPage'))
const GetStartedPage = lazy(() => import('./pages/get-started/GetStartedPage'))
const EuFeaturesPage = lazy(() => import('./pages/eu/features/EuFeaturesPage'))
const EuSolutionsPage = lazy(() => import('./pages/eu/solutions/EuSolutionsPage'))
const EuLanguagesPage = lazy(() => import('./pages/eu/languages/EuLanguagesPage'))
const EuHowItWorksPage = lazy(() => import('./pages/eu/how-it-works/EuHowItWorksPage'))
const EuPricingPage = lazy(() => import('./pages/eu/pricing/EuPricingPage'))
const EuDemoPage = lazy(() => import('./pages/eu/demo/EuDemoPage'))
const EuGetStartedPage = lazy(() => import('./pages/eu/get-started/EuGetStartedPage'))
const EuCustomersPage = lazy(() => import('./pages/eu/customers/EuCustomersPage'))
const EuResourcesPage = lazy(() => import('./pages/eu/resources/EuResourcesPage'))
const EuCompanyPage = lazy(() => import('./pages/eu/company/EuCompanyPage'))
const EntrancePage = lazy(() => import('./pages/onboarding/entrance/EntrancePage'))
const OnboardingFlowPage = lazy(() => import('./pages/onboarding/flow/OnboardingFlowPage'))
const OnboardingCompletePage = lazy(() => import('./pages/onboarding/complete/OnboardingCompletePage'))
const GiftDashboardPage = lazy(() => import('./pages/app/inbox/GiftDashboardPage'))
const DashboardPage = lazy(() => import('./pages/app/dashboard/DashboardPage'))
const ModulePage = lazy(() => import('./pages/app/modules/ModulePage'))
const BillingWalletPage = lazy(() => import('./pages/app/billing/BillingWalletPage'))
const SettingsProfilePage = lazy(() => import('./pages/app/settings/SettingsProfilePage'))
const AdminCreditsPage = lazy(() => import('./pages/admin/AdminCreditsPage'))
const ProductionReadinessPage = lazy(() => import('./pages/readiness/ProductionReadinessPage'))

function AppShell({ children }: { children: ReactNode }) {
  return <AuthGate>{children}</AuthGate>
}

function PageFallback() {
  return (
    <div className="min-h-[40vh] grid place-items-center text-[13px] font-medium text-slate-500" aria-busy="true">
      Loading…
    </div>
  )
}

function shouldShowCompanion(pathname: string) {
  if (pathname.startsWith('/app') || pathname.startsWith('/auth') || pathname.startsWith('/admin')) return false
  if (pathname.startsWith('/onboarding')) return false
  return true
}

function MarketingCompanion() {
  const { pathname } = useLocation()
  if (!shouldShowCompanion(pathname)) return null
  return (
    <Suspense fallback={null}>
      <CompanionGuideHost />
      <TryNowFloater />
    </Suspense>
  )
}

/** Eurozone is default marketing home; Africa keeps `/` when switcher selects it.
 * Render home in-place (no / → /eu redirect) so mobile CTAs are not delayed by an extra navigation. */
function RootEntry() {
  const { region } = useRegion()
  if (region === 'africa') return <HomePage />
  return <EuHomePage />
}

export default function App() {
  return (
    <RegionProvider>
      <SitePagesMenu />
      <MarketingRegionSwitcher />
      <MarketingCompanion />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<RootEntry />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route path="/languages" element={<LanguagesPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/business" element={<BusinessPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/company" element={<CompanyPage />} />
          <Route path="/get-started" element={<GetStartedPage />} />

          <Route path="/eu" element={<EuHomePage />} />
          <Route path="/eu/features" element={<EuFeaturesPage />} />
          <Route path="/eu/solutions" element={<EuSolutionsPage />} />
          <Route path="/eu/languages" element={<EuLanguagesPage />} />
          <Route path="/eu/how-it-works" element={<EuHowItWorksPage />} />
          <Route path="/eu/pricing" element={<EuPricingPage />} />
          <Route path="/eu/demo" element={<EuDemoPage />} />
          <Route path="/eu/customers" element={<EuCustomersPage />} />
          <Route path="/eu/resources" element={<EuResourcesPage />} />
          <Route path="/eu/company" element={<EuCompanyPage />} />
          <Route path="/eu/get-started" element={<EuGetStartedPage />} />

          <Route
            path="/onboarding/entrance"
            element={
              <AppShell>
                <EntrancePage />
              </AppShell>
            }
          />
          <Route
            path="/onboarding/complete"
            element={
              <AppShell>
                <OnboardingCompletePage />
              </AppShell>
            }
          />
          <Route
            path="/onboarding"
            element={
              <AppShell>
                <OnboardingFlowPage />
              </AppShell>
            }
          />
          <Route
            path="/onboarding/*"
            element={
              <AppShell>
                <OnboardingFlowPage />
              </AppShell>
            }
          />

          <Route path="/auth" element={<AuthPage />} />
          <Route path="/try" element={<TryNowPage />} />
          <Route path="/trials" element={<TrialsIndexPage />} />
          <Route path="/trials/:category" element={<TrialCategoryPage />} />

          <Route path="/app" element={<Navigate to="/app/inbox" replace />} />
          <Route
            path="/app/inbox"
            element={
              <AppShell>
                <GiftDashboardPage />
              </AppShell>
            }
          />
          <Route
            path="/app/dashboard"
            element={
              <AppShell>
                <DashboardPage />
              </AppShell>
            }
          />
          <Route
            path="/app/billing"
            element={
              <AppShell>
                <BillingWalletPage />
              </AppShell>
            }
          />
          <Route
            path="/app/settings"
            element={
              <AppShell>
                <SettingsProfilePage />
              </AppShell>
            }
          />
          <Route
            path="/app/:moduleId"
            element={
              <AppShell>
                <ModulePage />
              </AppShell>
            }
          />

          <Route
            path="/admin/credits"
            element={
              <AppShell>
                <AdminCreditsPage />
              </AppShell>
            }
          />
          <Route path="/admin" element={<Navigate to="/admin/credits" replace />} />

          <Route path="/readiness" element={<ProductionReadinessPage />} />
          <Route path="/production" element={<Navigate to="/readiness" replace />} />

          <Route path="*" element={<Navigate to="/eu" replace />} />
        </Routes>
      </Suspense>
    </RegionProvider>
  )
}
