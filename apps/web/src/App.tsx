import type { ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import SitePagesMenu from './components/SitePagesMenu'
import MarketingRegionSwitcher from './components/MarketingRegionSwitcher'
import CompanionGuideHost from './components/companion/CompanionGuideHost'
import TryNowFloater from './components/try/TryNowFloater'
import AuthGate from './components/auth/AuthGate'
import TryNowPage from './pages/try/TryNowPage'
import TrialsIndexPage from './pages/trials/TrialsIndexPage'
import TrialCategoryPage from './pages/trials/TrialCategoryPage'
import { RegionProvider, useRegion } from './context/RegionContext'
import HomePage from './pages/home/HomePage'
import FeaturesPage from './pages/features/FeaturesPage'
import SolutionsPage from './pages/solutions/SolutionsPage'
import LanguagesPage from './pages/languages/LanguagesPage'
import HowItWorksPage from './pages/how-it-works/HowItWorksPage'
import PricingPage from './pages/pricing/PricingPage'
import BusinessPage from './pages/business/BusinessPage'
import CustomersPage from './pages/customers/CustomersPage'
import ResourcesPage from './pages/resources/ResourcesPage'
import CompanyPage from './pages/company/CompanyPage'
import GetStartedPage from './pages/get-started/GetStartedPage'
import EuHomePage from './pages/eu/home/EuHomePage'
import EuFeaturesPage from './pages/eu/features/EuFeaturesPage'
import EuSolutionsPage from './pages/eu/solutions/EuSolutionsPage'
import EuLanguagesPage from './pages/eu/languages/EuLanguagesPage'
import EuHowItWorksPage from './pages/eu/how-it-works/EuHowItWorksPage'
import EuPricingPage from './pages/eu/pricing/EuPricingPage'
import EuDemoPage from './pages/eu/demo/EuDemoPage'
import EuGetStartedPage from './pages/eu/get-started/EuGetStartedPage'
import EuCustomersPage from './pages/eu/customers/EuCustomersPage'
import EuResourcesPage from './pages/eu/resources/EuResourcesPage'
import EuCompanyPage from './pages/eu/company/EuCompanyPage'
import EntrancePage from './pages/onboarding/entrance/EntrancePage'
import OnboardingFlowPage from './pages/onboarding/flow/OnboardingFlowPage'
import OnboardingCompletePage from './pages/onboarding/complete/OnboardingCompletePage'
import GiftDashboardPage from './pages/app/inbox/GiftDashboardPage'
import DashboardPage from './pages/app/dashboard/DashboardPage'
import ModulePage from './pages/app/modules/ModulePage'
import BillingWalletPage from './pages/app/billing/BillingWalletPage'
import SettingsProfilePage from './pages/app/settings/SettingsProfilePage'
import AdminCreditsPage from './pages/admin/AdminCreditsPage'
import AuthPage from './pages/auth/AuthPage'
import ProductionReadinessPage from './pages/readiness/ProductionReadinessPage'

function AppShell({ children }: { children: ReactNode }) {
  return <AuthGate>{children}</AuthGate>
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
    <>
      <CompanionGuideHost />
      <TryNowFloater />
    </>
  )
}

/** Eurozone is default marketing home; Africa keeps `/` when switcher selects it. */
function RootEntry() {
  const { region } = useRegion()
  if (region === 'africa') return <HomePage />
  return <Navigate to="/eu" replace />
}

export default function App() {
  return (
    <RegionProvider>
      <SitePagesMenu />
      <MarketingRegionSwitcher />
      <MarketingCompanion />
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
    </RegionProvider>
  )
}
