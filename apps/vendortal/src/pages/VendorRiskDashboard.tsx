import { logger } from '../utils/logger';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import VendorRiskTable from '../components/vendor/VendorRiskTable';
import VendorRiskAssessment from '../components/vendor/VendorRiskAssessment';
import VendorRiskMonitoring from '../components/vendor/VendorRiskMonitoring';
import VendorRiskReporting from '../components/vendor/VendorRiskReporting';
import { VendorRisk } from '../types';
import Button from '../components/ui/Button';
import { useTranslation } from 'react-i18next';
import { useVendors } from '../hooks/useVendors';
import { Plus, RefreshCw, BarChart3, Zap, Shield, Brain, Activity, FileText, Bell } from 'lucide-react';
import AddVendorModal from '../components/vendor/AddVendorModal';
import ThreatIntelligenceFeed from '../components/vendor/ThreatIntelligenceFeed';
import WorkflowAutomation from '../components/vendor/WorkflowAutomation';
import CustomizableDashboard from '../components/dashboard/CustomizableDashboard';
import PredictiveAnalytics from '../components/analytics/PredictiveAnalytics';
import DataImportExport from '../components/data/DataImportExport';
import GetStartedWidget from '../components/onboarding/GetStartedWidget';
import { useSBOMAnalyses } from '../hooks/useSBOMAnalyses';
import { useSupplyChainAssessments } from '../hooks/useSupplyChainAssessments';
import BackToDashboardLink from '../components/common/BackToDashboardLink';
import { useThreatIntelligence } from '../hooks/useThreatIntelligence';
import { VendorProfile } from '../services/vendorService';

const VendorRiskDashboard: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { vendors, loading, error, refetch } = useVendors();
  const { analyses } = useSBOMAnalyses();
  const { assessments } = useSupplyChainAssessments();
  const { stats: threatStats, loading: threatLoading, refresh: refreshThreats } = useThreatIntelligence();
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'assessment' | 'monitoring' | 'reporting' | 'workflows' | 'intelligence' | 'analytics'>('dashboard');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<VendorProfile | null>(null);
  const [showAssessment, setShowAssessment] = useState(false);

  // Auto-open Add Vendor modal if navigated from Get Started widget
  React.useEffect(() => {
    if (location.state?.openAddVendorModal) {
      setShowAddModal(true);
      // Clear the state to prevent modal from reopening on subsequent visits
      window.history.replaceState({}, '', location.pathname);
    }
  }, [location]);

  // Transform vendors data to match VendorRisk interface
  const vendorRiskData: VendorRisk[] = vendors.map(vendor => ({
    id: vendor.id,
    name: vendor.company_name,
    industry: vendor.industry || 'Unknown',
    riskScore: vendor.risk_score || 0,
    lastAssessment: vendor.last_assessment_date || 'Never',
    complianceStatus: (vendor.compliance_status as 'Compliant' | 'Partial' | 'Non-Compliant') || 'Non-Compliant',
    riskLevel: (vendor.risk_level as 'Low' | 'Medium' | 'High' | 'Critical') || 'Medium'
  }));

  const riskCounts = {
    high: vendorRiskData.filter(v => v.riskLevel === 'Critical' || v.riskLevel === 'High').length,
    medium: vendorRiskData.filter(v => v.riskLevel === 'Medium').length,
    low: vendorRiskData.filter(v => v.riskLevel === 'Low').length,
  };

  const complianceCounts = {
    compliant: vendorRiskData.filter(v => v.complianceStatus === 'Compliant').length,
    partial: vendorRiskData.filter(v => v.complianceStatus === 'Partial').length,
    nonCompliant: vendorRiskData.filter(v => v.complianceStatus === 'Non-Compliant').length,
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetch(), refreshThreats()]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleViewChange = (view: 'dashboard' | 'assessment' | 'monitoring' | 'reporting' | 'workflows' | 'intelligence' | 'analytics') => {
    setActiveView(view);
  };

  const handleVendorSelect = (vendor: VendorProfile) => {
    setSelectedVendor(vendor);
    setShowAssessment(true);
  };

  const handleAssessmentComplete = (assessment: any) => {
    logger.info('Assessment completed:', assessment);
    setShowAssessment(false);
    setSelectedVendor(null);
    // Refresh data
    handleRefresh();
  };

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    logger.info(`Exporting in ${format} format`);
    // Implement export functionality
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400">Error loading vendors: {error}</p>
        <Button onClick={handleRefresh} className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackToDashboardLink />
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Vendor Risk Management
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Comprehensive vendor risk assessment, monitoring, and reporting
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="ghost"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={() => window.location.href = '/tools/vendor-iq'}
                variant="secondary"
              >
                <Shield className="h-4 w-4 mr-2" />
                New VendorIQ Assessment
              </Button>
              <Button
                onClick={() => setShowAddModal(true)}
                variant="primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Vendor
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
                { id: 'assessment', name: 'Risk Assessment', icon: Shield },
                { id: 'monitoring', name: 'Monitoring', icon: Activity },
                { id: 'reporting', name: 'Reporting', icon: FileText },
                { id: 'workflows', name: 'Workflows', icon: Zap },
                { id: 'intelligence', name: 'Intelligence', icon: Brain },
                { id: 'analytics', name: 'Analytics', icon: BarChart3 }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleViewChange(tab.id as any)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeView === tab.id
                        ? 'border-vendortal-purple text-vendortal-purple'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <div id="dashboard-panel" role="tabpanel" aria-labelledby="dashboard-tab" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Vendors</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {vendors.length}
                      </p>
                    </div>
                    <Shield className="h-8 w-8 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">High Risk</p>
                      <p className="text-2xl font-bold text-red-600">
                        {riskCounts.high}
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-red-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Compliant</p>
                      <p className="text-2xl font-bold text-green-600">
                        {complianceCounts.compliant}
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Assessments</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {assessments.length}
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Risk Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600 mb-2">
                      {riskCounts.high}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">High Risk</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2 dark:bg-gray-700">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${vendors.length > 0 ? (riskCounts.high / vendors.length) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600 mb-2">
                      {riskCounts.medium}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Medium Risk</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2 dark:bg-gray-700">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${vendors.length > 0 ? (riskCounts.medium / vendors.length) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {riskCounts.low}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Low Risk</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2 dark:bg-gray-700">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${vendors.length > 0 ? (riskCounts.low / vendors.length) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vendor Risk Table */}
            <Card>
              <CardHeader>
                <CardTitle>Vendor Risk Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <VendorRiskTable
                  vendors={vendorRiskData}
                  onView={(vendor) => {
                    const vendorProfile = vendors.find(v => v.id === vendor.id);
                    if (vendorProfile) {
                      handleVendorSelect(vendorProfile);
                    }
                  }}
                  onRefresh={handleRefresh}
                />
              </CardContent>
            </Card>

            {/* Get Started Widget for new users */}
            {(vendors.length === 0 || assessments.length === 0) && (
              <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600">
                <CardContent className="p-6">
                  <GetStartedWidget
                    title="Get Started with Vendor Risk Management"
                    description="Begin by adding vendors and conducting risk assessments to build a comprehensive risk management program."
                    features={[
                      'Add and manage vendor profiles',
                      'Conduct comprehensive risk assessments',
                      'Monitor risk trends and alerts',
                      'Generate detailed reports'
                    ]}
                    onGetStarted={() => setShowAddModal(true)}
                    assessmentCount={assessments.length}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Risk Assessment View */}
        {activeView === 'assessment' && (
          <div id="assessment-panel" role="tabpanel" aria-labelledby="assessment-tab" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Risk Assessment Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vendors.map((vendor) => (
                    <div
                      key={vendor.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                      onClick={() => handleVendorSelect(vendor)}
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {vendor.company_name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {vendor.industry}
                      </p>
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          (vendor.risk_score || 0) >= 70 ? 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300' :
                          (vendor.risk_score || 0) >= 40 ? 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300' :
                          'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300'
                        }`}>
                          Risk Score: {vendor.risk_score || 0}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Monitoring View */}
        {activeView === 'monitoring' && (
          <div id="monitoring-panel" role="tabpanel" aria-labelledby="monitoring-tab">
            <VendorRiskMonitoring
              vendors={vendors}
              onVendorSelect={handleVendorSelect}
            />
          </div>
        )}

        {/* Reporting View */}
        {activeView === 'reporting' && (
          <div id="reporting-panel" role="tabpanel" aria-labelledby="reporting-tab">
            <VendorRiskReporting
              vendors={vendors}
              onExport={handleExport}
            />
          </div>
        )}

        {/* Workflows View */}
        {activeView === 'workflows' && (
          <div id="workflows-panel" role="tabpanel" aria-labelledby="workflows-tab" className="space-y-6">
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Workflow Automation</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">Automate vendor risk management processes</p>
              </div>
              <WorkflowAutomation />
            </Card>
          </div>
        )}

        {/* Intelligence View */}
        {activeView === 'intelligence' && (
          <div id="intelligence-panel" role="tabpanel" aria-labelledby="intelligence-tab" className="space-y-6">
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Threat Intelligence</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">Real-time threat intelligence and security feeds</p>
              </div>
              <ThreatIntelligenceFeed />
            </Card>
          </div>
        )}

        {/* Analytics View */}
        {activeView === 'analytics' && (
          <div id="analytics-panel" role="tabpanel" aria-labelledby="analytics-tab" className="space-y-6">
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Predictive Analytics</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">AI-powered insights and risk predictions</p>
              </div>
              <PredictiveAnalytics />
            </Card>
          </div>
        )}
      </div>

      {/* Add Vendor Modal */}
      {showAddModal && (
        <AddVendorModal 
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            handleRefresh();
          }}
        />
      )}

      {/* Risk Assessment Modal */}
      {showAssessment && selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <VendorRiskAssessment
              vendor={selectedVendor}
              onAssessmentComplete={handleAssessmentComplete}
              onClose={() => {
                setShowAssessment(false);
                setSelectedVendor(null);
              }}
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default VendorRiskDashboard;
