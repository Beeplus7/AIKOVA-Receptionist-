import { Navigate, Route, Routes } from 'react-router-dom'
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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
