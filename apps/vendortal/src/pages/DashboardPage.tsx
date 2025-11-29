import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import {
  Shield,
  FileCheck,
  BarChart3,
  Users,
  TrendingUp,
  AlertTriangle,
  Plus,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useVendors } from '../hooks/useVendors';
import { useSBOMAnalyses } from '../hooks/useSBOMAnalyses';
import { useSupplyChainAssessments } from '../hooks/useSupplyChainAssessments';
import GetStartedWidget from '../components/onboarding/GetStartedWidget';
import OnboardingCompletionBanner from '../components/onboarding/OnboardingCompletionBanner';
import PerformanceOptimizedDashboard from '../components/dashboard/PerformanceOptimizedDashboard';
import { useAppStore } from '../stores/appStore';
import Breadcrumbs from '../components/common/Breadcrumbs';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

const DashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const { vendors, loading: vendorsLoading } = useVendors();
  const { analyses, loading: sbomLoading } = useSBOMAnalyses();
  const { assessments, loading: assessmentsLoading } = useSupplyChainAssessments();
  const addNotification = useAppStore((state) => state.addNotification);

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

  // Calculate risk distribution
  const riskDistribution = {
    critical: vendors.filter(v => v.risk_level === 'Critical').length,
    high: vendors.filter(v => v.risk_level === 'High').length,
    medium: vendors.filter(v => v.risk_level === 'Medium').length,
    low: vendors.filter(v => v.risk_level === 'Low').length,
  };

  const totalVulnerabilities = analyses.reduce((sum, analysis) => 
    sum + (analysis.total_vulnerabilities || 0), 0
  );

  const quickActions = [
    {
      title: 'Quick Assessment',
      description: '5-minute free vendor risk screening',
      icon: <FileCheck className="h-6 w-6" />,
      href: '/tools/vendor-iq?mode=quick',
      color: 'bg-green-500'
    },
    {
      title: 'NIST Compliance',
      description: 'Prove NIST 800-161 compliance in 30 minutes',
      icon: <Shield className="h-6 w-6" />,
      href: '/vendor-assessments',
      color: 'bg-blue-500'
    },
    {
      title: 'Add Vendor',
      description: 'Add a new vendor to your portfolio',
      icon: <Plus className="h-6 w-6" />,
      href: '/vendor-risk-dashboard',
      color: 'bg-purple-500'
    },
    {
      title: 'Risk Radar',
      description: 'View all vendor risks at a glance',
      icon: <BarChart3 className="h-6 w-6" />,
      href: '/tools/vendor-risk-radar',
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.user_metadata?.full_name || profile?.full_name || 'User'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Here's an overview of your supply chain security posture
        </p>
      </div>

      {/* Onboarding Completion Banner */}
      <OnboardingCompletionBanner />

      {/* Get Started Widget for new users */}
      <GetStartedWidget 
        vendorCount={vendors.length}
        assessmentCount={assessments.length}
        sbomCount={analyses.length}
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{vendors.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Vendors</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {riskDistribution.critical + riskDistribution.high}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">High Risk Vendors</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <FileCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{assessments.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Assessments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalVulnerabilities}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Vulnerabilities</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-vendortal-purple" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.href} className="block">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-vendortal-purple hover:shadow-md transition-all">
                  <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3 text-white`}>
                    {action.icon}
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">{action.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                  <div className="mt-2 flex items-center text-vendortal-purple text-sm">
                    Get started <ArrowRight className="h-3 w-3 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Overview */}
      {vendors.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Risk Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Critical Risk</span>
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">{riskDistribution.critical}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${vendors.length > 0 ? (riskDistribution.critical / vendors.length) * 100 : 0}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">High Risk</span>
                  <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{riskDistribution.high}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full" 
                    style={{ width: `${vendors.length > 0 ? (riskDistribution.high / vendors.length) * 100 : 0}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Medium Risk</span>
                  <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">{riskDistribution.medium}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${vendors.length > 0 ? (riskDistribution.medium / vendors.length) * 100 : 0}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Low Risk</span>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">{riskDistribution.low}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${vendors.length > 0 ? (riskDistribution.low / vendors.length) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assessments.length > 0 && (
                  <div className="flex items-center">
                    <FileCheck className="h-5 w-5 text-green-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Latest Assessment</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {assessments[0]?.assessment_name || 'Supply Chain Assessment'}
                      </p>
                    </div>
                  </div>
                )}
                
                {analyses.length > 0 && (
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-purple-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">SBOM Analysis</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {analyses[0]?.filename || 'Recent analysis'}
                      </p>
                    </div>
                  </div>
                )}
                
                {vendors.length > 0 && (
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Latest Vendor</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {vendors[0]?.name}
                      </p>
                    </div>
                  </div>
                )}

                {vendors.length === 0 && assessments.length === 0 && analyses.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No recent activity. Start by adding a vendor or running an assessment.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Performance Optimized Dashboard for power users */}
      {vendors.length > 3 || assessments.length > 2 || analyses.length > 2 ? (
        <div className="mb-8">
          <PerformanceOptimizedDashboard />
        </div>
      ) : null}
    </div>
  );
};

export default DashboardPage;