import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { I18nProvider } from './context/I18nContext';
import { ChatbotProvider } from './components/chatbot/ChatbotProvider';
import ErrorBoundary from './components/common/ErrorBoundary';
import NotificationManager from './components/common/NotificationManager';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ChatWidget from './components/chatbot/ChatWidget';
import { Analytics } from '@vercel/analytics/react';

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vendorsoluce-green mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

// Critical pages - loaded immediately
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import NotFoundPage from './pages/NotFoundPage';

// Lazy-loaded pages - loaded on demand
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const SBOMAnalyzer = lazy(() => import('./pages/SBOMAnalyzer'));
const SBOMAnalysisPage = lazy(() => import('./pages/SBOMAnalysisPage'));
const SupplyChainAssessment = lazy(() => import('./pages/SupplyChainAssessment'));
const SupplyChainResults = lazy(() => import('./pages/SupplyChainResults'));
const SupplyChainRecommendations = lazy(() => import('./pages/SupplyChainRecommendations'));
const VendorRiskDashboard = lazy(() => import('./pages/VendorRiskDashboard'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const VendorOnboardingPage = lazy(() => import('./pages/VendorOnboardingPage'));
const VendorManagementPage = lazy(() => import('./pages/VendorManagementPage'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const AcceptableUsePolicy = lazy(() => import('./pages/AcceptableUsePolicy'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const MasterPrivacyPolicy = lazy(() => import('./pages/MasterPrivacyPolicy'));
const MasterTermsOfService = lazy(() => import('./pages/MasterTermsOfService'));
const Templates = lazy(() => import('./pages/Templates'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const APIDocumentation = lazy(() => import('./pages/APIDocumentation'));
const IntegrationGuides = lazy(() => import('./pages/IntegrationGuides'));
const NISTChecklist = lazy(() => import('./pages/tools/NISTChecklist'));
const SBOMQuickScan = lazy(() => import('./pages/tools/SBOMQuickScan'));
const VendorRiskRadar = lazy(() => import('./pages/tools/VendorRiskRadar'));
const VendorRiskCalculator = lazy(() => import('./pages/tools/VendorRiskCalculator'));
const VendorIQ = lazy(() => import('./pages/tools/VendorIQ'));
const VendorSecurityAssessments = lazy(() => import('./pages/VendorSecurityAssessments'));
const VendorAssessmentPortal = lazy(() => import('./pages/VendorAssessmentPortal'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const UserActivity = lazy(() => import('./pages/UserActivity'));
const UserNotifications = lazy(() => import('./pages/UserNotifications'));
const BillingPage = lazy(() => import('./pages/BillingPage'));
const TemplatePreviewPage = lazy(() => import('./pages/TemplatePreviewPage'));
const DashboardDemoPage = lazy(() => import('./pages/DashboardDemoPage'));
const AssetManagementPage = lazy(() => import('./pages/AssetManagementPage'));
const MarketingAdminPage = lazy(() => import('./pages/MarketingAdminPage'));
const CreateCampaignPage = lazy(() => import('./pages/CreateCampaignPage'));

function App() {
  return (
    <I18nProvider>
      <ThemeProvider>
        <Router>
          <ErrorBoundary>
            <AuthProvider>
              <ChatbotProvider>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
                <NotificationManager />
                <Navbar />
                <main className="flex-1">
                  <Suspense fallback={<PageLoader />}>
                  <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/signin" element={<SignInPage />} />
                  <Route path="/signup" element={<Navigate to="/signin" replace />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/careers" element={<Navigate to="/contact" replace />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/acceptable-use-policy" element={<AcceptableUsePolicy />} />
                  <Route path="/cookie-policy" element={<CookiePolicy />} />
                  <Route path="/master-privacy-policy" element={<MasterPrivacyPolicy />} />
                  <Route path="/master-terms-of-service" element={<MasterTermsOfService />} />
                  <Route path="/templates" element={<Templates />} />
                  <Route path="/templates/preview" element={<TemplatePreviewPage />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/api-docs" element={<APIDocumentation />} />
                  <Route path="/integration-guides" element={<IntegrationGuides />} />

                  {/* Tools - can be public or protected based on requirements */}
                  <Route path="/tools/nist-checklist" element={<NISTChecklist />} />
                  <Route path="/tools/sbom-quick-scan" element={<SBOMQuickScan />} />
                  <Route path="/tools/vendor-risk-radar" element={<VendorRiskRadar />} />
                  <Route path="/tools/vendor-risk-calculator" element={<VendorRiskCalculator />} />
                  <Route path="/tools/vendor-iq" element={<VendorIQ />} />

                  {/* Assessment routes - public access for better user experience */}
                  <Route path="/supply-chain-assessment" element={<SupplyChainAssessment />} />
                  <Route path="/supply-chain-results/:id?" element={<SupplyChainResults />} />
                  <Route path="/supply-chain-recommendations/:id" element={<SupplyChainRecommendations />} />
                  <Route path="/sbom-analyzer" element={<SBOMAnalyzer />} />
                  <Route path="/sbom-analysis/:id" element={<SBOMAnalysisPage />} />
                  <Route path="/vendors" element={<VendorRiskDashboard />} />
                  <Route path="/vendor-risk-dashboard" element={<Navigate to="/vendors" replace />} />
                  <Route path="/vendor-onboarding" element={<VendorOnboardingPage />} />

                  {/* Vendor Management - Admin only */}
                  <Route path="/admin/vendors" element={
                    <ProtectedRoute>
                      <VendorManagementPage />
                    </ProtectedRoute>
                  } />

                  {/* Marketing Automation - Admin only */}
                  <Route path="/admin/marketing" element={
                    <ProtectedRoute>
                      <MarketingAdminPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/marketing/campaigns/new" element={
                    <ProtectedRoute>
                      <CreateCampaignPage />
                    </ProtectedRoute>
                  } />

                  {/* Dashboard Demo for non-authenticated users */}
                  <Route path="/dashboard-demo" element={<DashboardDemoPage />} />

                  {/* Vendor Security Assessments - Premium Feature */}
                  <Route path="/vendor-assessments" element={<VendorSecurityAssessments />} />
                  <Route path="/vendor-assessments/:id" element={<VendorAssessmentPortal />} />

                  {/* Protected routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/onboarding" element={
                    <ProtectedRoute>
                      <OnboardingPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } />
                  <Route path="/billing" element={
                    <ProtectedRoute>
                      <BillingPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/account" element={
                    <ProtectedRoute>
                      <AccountPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/user-dashboard" element={
                    <ProtectedRoute>
                      <UserDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/user-activity" element={
                    <ProtectedRoute>
                      <UserActivity />
                    </ProtectedRoute>
                  } />
                  <Route path="/notifications" element={
                    <ProtectedRoute>
                      <UserNotifications />
                    </ProtectedRoute>
                  } />

                  {/* Asset Management - Protected Route */}
                  <Route path="/asset-management" element={
                    <ProtectedRoute>
                      <AssetManagementPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/assets" element={<Navigate to="/asset-management" replace />} />

                  {/* Fallback route */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
                  </Suspense>
                </main>
                <Footer />
                <ChatWidget />
                <Analytics />
                </div>
              </ChatbotProvider>
            </AuthProvider>
          </ErrorBoundary>
        </Router>
      </ThemeProvider>
    </I18nProvider>
  );
}

export default App;
