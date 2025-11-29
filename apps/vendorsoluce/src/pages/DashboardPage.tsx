import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import {
  Shield,
  FileCheck,
  BarChart3,
  Users,
  TrendingUp,
  AlertTriangle,
  Plus,
  ArrowRight,
  FileJson,
  Radar,
  Activity,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useVendors } from '../hooks/useVendors';
import { useSBOMAnalyses } from '../hooks/useSBOMAnalyses';
import { useSupplyChainAssessments } from '../hooks/useSupplyChainAssessments';
import GetStartedWidget from '../components/onboarding/GetStartedWidget';
import PerformanceOptimizedDashboard from '../components/dashboard/PerformanceOptimizedDashboard';
import ChatWidget from '../components/chatbot/ChatWidget';
import { useAppStore } from '../stores/appStore';
import Breadcrumbs from '../components/common/Breadcrumbs';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { TrialCountdownBanner } from '../components/onboarding/TrialCountdownBanner';
import { TrialConversionPrompt } from '../components/onboarding/TrialConversionPrompt';
import { OnboardingChecklist } from '../components/onboarding/OnboardingChecklist';

const DashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const addNotification = useAppStore((state) => state.addNotification);
  const { vendors, loading: vendorsLoading } = useVendors();
  const { analyses, loading: sbomLoading } = useSBOMAnalyses();
  const { assessments, loading: assessmentsLoading } = useSupplyChainAssessments();
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  const isLoading = vendorsLoading || sbomLoading || assessmentsLoading;

  // Welcome back notification for returning users
  React.useEffect(() => {
    if (user && !isLoading) {
      addNotification({
        title: 'Welcome back!',
        message: `You have ${vendors.length} vendors and ${assessments.length} assessments in your portfolio.`,
        type: 'info',
        duration: 4000
      });
    }
  }, [user, isLoading, vendors.length, assessments.length, addNotification]);

  // Calculate risk distribution with memoization
  const riskDistribution = useMemo(() => ({
    critical: vendors.filter(v => v.risk_level === 'Critical').length,
    high: vendors.filter(v => v.risk_level === 'High').length,
    medium: vendors.filter(v => v.risk_level === 'Medium').length,
    low: vendors.filter(v => v.risk_level === 'Low').length,
  }), [vendors]);

  const totalVulnerabilities = useMemo(() => 
    analyses.reduce((sum, analysis) => 
      sum + (analysis.total_vulnerabilities || 0), 0
    ), [analyses]
  );

  // Calculate percentages for progress bars
  const riskPercentages = useMemo(() => {
    const total = vendors.length || 1;
    return {
      critical: (riskDistribution.critical / total) * 100,
      high: (riskDistribution.high / total) * 100,
      medium: (riskDistribution.medium / total) * 100,
      low: (riskDistribution.low / total) * 100,
    };
  }, [vendors.length, riskDistribution]);

  const quickActions = [
    {
      title: 'Add Vendor',
      description: 'Add a new vendor to your risk portfolio',
      icon: <Plus className="h-6 w-6" />,
      href: '/vendor-risk-dashboard',
      color: 'bg-blue-500'
    },
    {
      title: 'Run Assessment',
      description: 'Start a new supply chain risk assessment',
      icon: <FileCheck className="h-6 w-6" />,
      href: '/supply-chain-assessment',
      color: 'bg-green-500'
    },
    {
      title: 'Analyze SBOM',
      description: 'Upload and analyze software components',
      icon: <FileJson className="h-6 w-6" />,
      href: '/sbom-analyzer',
      color: 'bg-purple-500'
    },
    {
      title: 'View Reports',
      description: 'Generate compliance and risk reports',
      icon: <BarChart3 className="h-6 w-6" />,
      href: '/vendor-risk-dashboard',
      color: 'bg-orange-500'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Breadcrumbs />
        <LoadingSkeleton variant="dashboard" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Breadcrumbs />

      {/* Welcome Section */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {user?.user_metadata?.full_name || profile?.full_name || 'User'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Here's an overview of your supply chain security posture
        </p>
      </div>

      {/* Trial Countdown Banner */}
      <div className="mb-6">
        <TrialCountdownBanner />
      </div>

      {/* Trial Conversion Prompt */}
      <div className="mb-6">
        <TrialConversionPrompt showAfterDays={7} />
      </div>

      {/* Onboarding Checklist for new users */}
      {(vendors.length === 0 || assessments.length === 0 || analyses.length === 0) && (
        <div className="mb-6">
          <OnboardingChecklist />
        </div>
      )}

      {/* Get Started Widget for new users */}
      <GetStartedWidget 
        vendorCount={vendors.length}
        assessmentCount={assessments.length}
        sbomCount={analyses.length}
        onHelpClick={() => setIsChatOpen(true)}
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{vendors.length}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Vendors</p>
                </div>
              </div>
              <TrendingUp className="h-5 w-5 text-blue-400 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {riskDistribution.critical + riskDistribution.high}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">High Risk Vendors</p>
                </div>
              </div>
              <Activity className="h-5 w-5 text-red-400 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <FileCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{assessments.length}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Assessments</p>
                </div>
              </div>
              <CheckCircle2 className="h-5 w-5 text-green-400 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalVulnerabilities}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Vulnerabilities</p>
                </div>
              </div>
              <Shield className="h-5 w-5 text-purple-400 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-vendorsoluce-green" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link 
                key={index} 
                to={action.href} 
                className="block group"
              >
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-vendorsoluce-green hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3 text-white group-hover:scale-110 transition-transform duration-300`}>
                    {action.icon}
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1 group-hover:text-vendorsoluce-green transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                  <div className="mt-2 flex items-center text-vendorsoluce-green text-sm group-hover:translate-x-1 transition-transform">
                    Get started <ArrowRight className="h-3 w-3 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Overview */}
      {vendors.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-vendorsoluce-green" />
                Vendor Risk Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Critical Risk</span>
                    <span className="text-sm font-bold text-red-600 dark:text-red-400">{riskDistribution.critical}</span>
                  </div>
                  <ProgressBar value={riskPercentages.critical} color="red" height="md" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">High Risk</span>
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{riskDistribution.high}</span>
                  </div>
                  <ProgressBar value={riskPercentages.high} color="orange" height="md" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Medium Risk</span>
                    <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">{riskDistribution.medium}</span>
                  </div>
                  <ProgressBar value={riskPercentages.medium} color="yellow" height="md" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Low Risk</span>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">{riskDistribution.low}</span>
                  </div>
                  <ProgressBar value={riskPercentages.low} color="green" height="md" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-vendorsoluce-green" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assessments.length > 0 && (
                  <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <FileCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Latest Assessment</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {assessments[0]?.assessment_name || 'Supply Chain Assessment'}
                      </p>
                    </div>
                  </div>
                )}
                
                {analyses.length > 0 && (
                  <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">SBOM Analysis</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {analyses[0]?.filename || 'Recent analysis'}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <Radar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Risk Radar</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Integrated risk monitoring available in dashboard
                    </p>
                  </div>
                </div>
                
                {vendors.length > 0 && (
                  <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Latest Vendor</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {vendors[0]?.name}
                      </p>
                    </div>
                  </div>
                )}

                {vendors.length === 0 && assessments.length === 0 && analyses.length === 0 && (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No recent activity. Start by adding a vendor or running an assessment.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="mb-8">
          <CardContent className="text-center py-12">
            <Shield className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Vendors Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Start building your vendor risk portfolio by adding your first vendor. This will enable risk distribution analysis and comprehensive reporting.
            </p>
            <Link
              to="/vendor-risk-dashboard"
              className="inline-flex items-center px-4 py-2 bg-vendorsoluce-green text-white rounded-lg hover:bg-opacity-90 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Vendor
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Performance Optimized Dashboard for power users */}
      {vendors.length > 3 || assessments.length > 2 || analyses.length > 2 ? (
        <div className="mb-8">
          <PerformanceOptimizedDashboard />
        </div>
      ) : null}
      
      {/* Chat Widget */}
      <ChatWidget isOpen={isChatOpen} onToggle={setIsChatOpen} />
    </div>
  );
};

export default DashboardPage;