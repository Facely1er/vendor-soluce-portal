import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RBACProvider } from './context/RBACContext';
import { ThemeProvider } from './context/ThemeContext';
import { I18nProvider } from './context/I18nContext';
import { ChatbotProvider } from './components/chatbot/ChatbotProvider';
import ErrorBoundary from './components/common/ErrorBoundary';
import NotificationManager from './components/common/NotificationManager';
import ProtectedRoute from './components/auth/ProtectedRoute';
import OnboardingGuard from './components/auth/OnboardingGuard';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { Analytics } from '@vercel/analytics/react';
import LoadingSkeleton from './components/common/LoadingSkeleton';
import { lazyWithRetry } from './utils/lazyLoader';

// Lazy load all pages for code splitting and bundle optimization
const HomePage = lazy(() => import('./pages/HomePage'));
const SignInPage = lazy(() => import('./pages/SignInPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const SBOMAnalyzer = lazy(() => import('./pages/SBOMAnalyzer'));
const SBOMAnalysisPage = lazy(() => import('./pages/SBOMAnalysisPage'));
const SupplyChainAssessment = lazy(() => import('./pages/SupplyChainAssessment'));
const SupplyChainResults = lazy(() => import('./pages/SupplyChainResults'));
const SupplyChainRecommendations = lazy(() => import('./pages/SupplyChainRecommendations'));
const VendorRiskDashboard = lazy(() => import('./pages/VendorRiskDashboard'));
const AssetVendorDashboard = lazy(() => import('./pages/AssetVendorDashboard'));
const AssetManagementPage = lazy(() => import('./pages/AssetManagementPage'));
const OnboardingWizard = lazy(() => import('./components/onboarding/OnboardingWizard'));
const VendorOnboardingPage = lazy(() => import('./pages/VendorOnboardingPage'));
const VendorManagementPage = lazy(() => import('./pages/VendorManagementPage'));
const Pricing = lazy(() => import('./pages/Pricing'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Templates = lazy(() => import('./pages/Templates'));
const HowItWorks = lazyWithRetry(() => import('./pages/HowItWorks'));
const APIDocumentation = lazy(() => import('./pages/APIDocumentation'));
const IntegrationGuides = lazy(() => import('./pages/IntegrationGuides'));
const NISTChecklist = lazy(() => import('./pages/tools/NISTChecklist'));
const SBOMQuickScan = lazy(() => import('./pages/tools/SBOMQuickScan'));
const VendorRiskRadar = lazy(() => import('./pages/tools/VendorRiskRadar'));
const VendorIQ = lazy(() => import('./pages/tools/VendorIQ'));
const VendorRiskCalculator = lazy(() => import('./pages/tools/VendorRiskCalculator'));
const VendorSecurityAssessments = lazy(() => import('./pages/VendorSecurityAssessments'));
const VendorAssessmentPortal = lazy(() => import('./pages/VendorAssessmentPortal'));
const VendorAssessmentReview = lazy(() => import('./pages/VendorAssessmentReview'));
const VendorAssessmentPortalDemo = lazy(() => import('./pages/VendorAssessmentPortalDemo'));
const SendQuestionnairePage = lazy(() => import('./pages/SendQuestionnairePage'));
const VendorQuestionnaireInbox = lazy(() => import('./pages/VendorQuestionnaireInbox'));
const VendorSignUpPage = lazy(() => import('./pages/VendorSignUpPage'));
const VendorProfileSetupPage = lazy(() => import('./pages/VendorProfileSetupPage'));
const ProactiveAssessmentWizard = lazy(() => import('./pages/ProactiveAssessmentWizard'));
const VendorReadinessDashboard = lazy(() => import('./pages/VendorReadinessDashboard'));
const VendorDirectoryPage = lazy(() => import('./pages/VendorDirectoryPage'));
const VendorPublicProfile = lazy(() => import('./pages/VendorPublicProfile'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const UserActivity = lazy(() => import('./pages/UserActivity'));
const UserNotifications = lazy(() => import('./pages/UserNotifications'));
const BillingPage = lazy(() => import('./pages/BillingPage'));
const StakeholderDashboardDemo = lazy(() => import('./pages/StakeholderDashboardDemo'));
const TemplatePreviewPage = lazy(() => import('./pages/TemplatePreviewPage'));
const DashboardDemoPage = lazy(() => import('./pages/DashboardDemoPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const ComplianceNIST800161Extended = lazy(() => import('./pages/ComplianceNIST800161Extended'));
const ProfessionalServices = lazy(() => import('./pages/services/ProfessionalServices'));
const WhichToolPage = lazy(() => import('./pages/WhichToolPage'));
const SuccessPage = lazy(() => import('./pages/SuccessPage'));
const HelpCenterPage = lazy(() => import('./pages/HelpCenterPage'));
const ROICalculatorPage = lazy(() => import('./pages/ROICalculatorPage'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'));
const SecurityPage = lazy(() => import('./pages/SecurityPage'));
const GettingStartedPage = lazy(() => import('./pages/GettingStartedPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));

function App() {
  return (
    <I18nProvider>
      <ThemeProvider>
        <Router>
          <ErrorBoundary>
            <AuthProvider>
              <RBACProvider>
                <ChatbotProvider>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
                <NotificationManager />
                <Navbar />
                <main className="flex-1">
                  <Suspense fallback={<LoadingSkeleton />}>
                    <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<HomePage />} />
                  <Route path="/signin" element={<SignInPage />} />
                  <Route path="/signup" element={<Navigate to="/signin" replace />} />
                  <Route path="/careers" element={<Navigate to="/contact" replace />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/services" element={<ProfessionalServices />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/templates" element={<Templates />} />
                  <Route path="/templates/preview" element={<TemplatePreviewPage />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/which-tool" element={<WhichToolPage />} />
                  <Route path="/api-docs" element={<APIDocumentation />} />
                  <Route path="/integration-guides" element={<IntegrationGuides />} />
                  <Route path="/success" element={<SuccessPage />} />
                  <Route path="/help" element={<HelpCenterPage />} />
                  <Route path="/roi-calculator" element={<ROICalculatorPage />} />
                  <Route path="/resources" element={<ResourcesPage />} />
                  <Route path="/security" element={<SecurityPage />} />
                  <Route path="/getting-started" element={<GettingStartedPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  
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
                  <Route path="/asset-vendor-dashboard" element={
                    <ProtectedRoute>
                      <AssetVendorDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/asset-management" element={
                    <ProtectedRoute>
                      <AssetManagementPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/vendor-onboarding" element={<VendorOnboardingPage />} />
                  
                  {/* Vendor Management - Admin only */}
                  <Route path="/admin/vendors" element={
                    <ProtectedRoute>
                      <VendorManagementPage />
                    </ProtectedRoute>
                  } />
                  
                  {/* Dashboard Demo for non-authenticated users */}
                  <Route path="/dashboard-demo" element={<DashboardDemoPage />} />
                  
                  {/* Vendor Security Assessments - Premium Feature */}
                  <Route path="/vendor-assessments" element={<VendorSecurityAssessments />} />
                  <Route path="/vendor-assessments/:id" element={<VendorAssessmentPortal />} />
                  <Route path="/vendor-assessments/:id/review" element={
                    <ProtectedRoute>
                      <VendorAssessmentReview />
                    </ProtectedRoute>
                  } />
                  <Route path="/vendor-assessments-demo" element={<VendorAssessmentPortalDemo />} />
                  
                  {/* Stakeholder Questionnaire Pages */}
                  <Route path="/send-questionnaire" element={
                    <ProtectedRoute>
                      <SendQuestionnairePage />
                    </ProtectedRoute>
                  } />
                  <Route path="/vendor/questionnaires" element={<VendorQuestionnaireInbox />} />
                  
                  {/* Vendor Marketplace Routes */}
                  <Route path="/vendor/signup" element={<VendorSignUpPage />} />
                  <Route path="/vendor/profile/setup" element={
                    <ProtectedRoute>
                      <VendorProfileSetupPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/vendor/dashboard" element={
                    <ProtectedRoute>
                      <VendorReadinessDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/vendor/assessments/proactive" element={
                    <ProtectedRoute>
                      <ProactiveAssessmentWizard />
                    </ProtectedRoute>
                  } />
                  <Route path="/directory" element={<VendorDirectoryPage />} />
                  <Route path="/directory/vendor/:id" element={<VendorPublicProfile />} />
                  
                  {/* Protected routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <OnboardingGuard>
                        <DashboardPage />
                      </OnboardingGuard>
                    </ProtectedRoute>
                  } />
                  <Route path="/compliance/nist-800-161-extended" element={
                    <ProtectedRoute>
                      <ComplianceNIST800161Extended />
                    </ProtectedRoute>
                  } />
                  <Route path="/onboarding" element={
                    <ProtectedRoute>
                      <OnboardingWizard />
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
                  
                  {/* Stakeholder Dashboard Demo */}
                  <Route path="/stakeholder-dashboard-demo" element={<StakeholderDashboardDemo />} />
                  
                    {/* Fallback route */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                  </Suspense>
                </main>
                <Footer />
                <Analytics />
                </div>
                </ChatbotProvider>
              </RBACProvider>
            </AuthProvider>
          </ErrorBoundary>
        </Router>
      </ThemeProvider>
    </I18nProvider>
  );
}

export default App;