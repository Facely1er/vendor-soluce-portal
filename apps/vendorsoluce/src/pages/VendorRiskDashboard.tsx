import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import VendorRiskTable from '../components/vendor/VendorRiskTable';
import { VendorRisk } from '../types';
import Button from '../components/ui/Button';
import { useTranslation } from 'react-i18next';
import { useVendors } from '../hooks/useVendors';
import { Plus, RefreshCw, BarChart3, Zap, Shield, Brain } from 'lucide-react';
import AddVendorModal from '../components/vendor/AddVendorModal';
// import { generateRecommendationsPdf } from '../utils/generatePdf';
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
import { logger } from '../utils/logger';

const VendorRiskDashboard: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { vendors, loading, error, refetch } = useVendors();
  const { analyses } = useSBOMAnalyses();
  const { assessments } = useSupplyChainAssessments();
  const { stats: threatStats, loading: threatLoading, refresh: refreshThreats } = useThreatIntelligence();
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'workflows' | 'intelligence' | 'analytics'>('dashboard');
  const [isRefreshing, setIsRefreshing] = useState(false);
  // const workflowStats = {
  //   activeTasks: 0,
  //   completedTasks: 0,
  //   overdueTasks: 0,
  //   automationRules: 3
  // };

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
    name: vendor.name,
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

  const handleViewChange = (view: 'dashboard' | 'workflows' | 'intelligence' | 'analytics') => {
    setActiveView(view);
  };

  // const handleExportDashboard = async () => {
  //   const recommendations = [
  //     {
  //       id: 'vendor-1',
  //       title: 'Implement Enhanced Vendor Monitoring',
  //       description: 'Establish continuous monitoring for high-risk vendors with automated alerts.',
  //       priority: 'high' as const,
  //       category: 'Vendor Management',
  //       effort: 'moderate' as const,
  //       timeframe: 'short-term' as const,
  //       impact: 'Reduces response time to vendor incidents and improves overall risk visibility.',
  //       steps: [
  //         'Set up automated vendor monitoring dashboard',
  //         'Configure risk threshold alerts',
  //         'Establish escalation procedures',
  //         'Train team on new monitoring tools'
  //       ],
  //       references: [
  //         { title: 'NIST SP 800-161 Vendor Monitoring', url: 'https://csrc.nist.gov/publications/detail/sp/800-161/rev-1/final' }
  //       ]
  //     }
  //   ];
  //   
  //   await generateRecommendationsPdf(
  //     'Vendor Risk Management Recommendations',
  //     recommendations,
  //     new Date().toLocaleDateString(),
  //     'vendor-risk-dashboard-recommendations.pdf'
  //   );
  // };

  // const handleExportDashboard = async () => {
  //   const recommendations = [
  //     {
  //       id: 'vendor-1',
  //       title: 'Implement Enhanced Vendor Monitoring',
  //       description: 'Establish continuous monitoring for high-risk vendors with automated alerts.',
  //       priority: 'high' as const,
  //       category: 'Vendor Management',
  //       effort: 'moderate' as const,
  //       timeframe: 'short-term' as const,
  //       impact: 'Reduces response time to vendor incidents and improves overall risk visibility.',
  //       steps: [
  //         'Set up automated vendor monitoring dashboard',
  //         'Configure risk threshold alerts',
  //         'Establish escalation procedures',
  //         'Train team on new monitoring tools'
  //       ],
  //       references: [
  //         { title: 'NIST SP 800-161 Vendor Monitoring', url: 'https://csrc.nist.gov/publications/detail/sp/800-161/rev-1/final' }
  //       ]
  //     }
  //   ];
  //   
  //   await generateRecommendationsPdf(
  //     'Vendor Risk Management Recommendations',
  //     recommendations,
  //     new Date().toLocaleDateString(),
  //     'vendor-risk-dashboard-recommendations.pdf'
  //   );
  // };

  const handleExportDashboard = async () => {
    try {
      const { generateRecommendationsPdf } = await import('../utils/generatePdf');
      
      const recommendations = [
        {
          id: 'vendor-1',
          title: 'Vendor Risk Management Summary',
          description: `Comprehensive risk assessment for ${vendorRiskData.length} vendors. Risk distribution: ${riskCounts.high} high-risk, ${riskCounts.medium} medium-risk, ${riskCounts.low} low-risk vendors.`,
          priority: 'high' as const,
          category: 'Vendor Management',
          effort: 'moderate' as const,
          timeframe: 'short-term' as const,
          impact: 'Improves overall vendor risk visibility and enables proactive risk management.',
          steps: [
            'Review high-risk vendor assessments',
            'Implement enhanced monitoring for critical vendors',
            'Schedule follow-up assessments',
            'Update vendor risk profiles'
          ],
          references: [
            { title: 'NIST SP 800-161 Vendor Risk Management', url: 'https://csrc.nist.gov/publications/detail/sp/800-161/rev-1/final' }
          ]
        }
      ];
      
      await generateRecommendationsPdf(
        'Vendor Risk Dashboard Report',
        recommendations,
        new Date().toLocaleDateString(),
        `vendor-risk-dashboard-report-${new Date().toISOString().split('T')[0]}.pdf`
      );
    } catch (error) {
      logger.error('Error exporting dashboard:', error);
      alert('Error generating report. Please try again.');
    }
  };

  const handleCreateWorkflow = () => {
    logger.log('Create workflow functionality');
  };

  const handleManageAutomation = () => {
    logger.log('Manage automation functionality');
  };

  const workflowStats = {
    activeTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    automationRules: 3
  };

  if (loading) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vendorsoluce-green"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Error loading vendors: {error}</p>
          <Button 
            onClick={handleRefresh} 
            variant="outline"
            disabled={isRefreshing}
            aria-label="Retry loading vendors"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Retrying...' : 'Retry'}
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <BackToDashboardLink />
      
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('vendorRisk.title')}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl">
          {t('vendorRisk.description')}
        </p>
      </div>
      
      {/* Enhanced Navigation */}
      <div className="mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700" role="tablist" aria-label="Dashboard sections">
          <div className="flex flex-wrap -mb-px">
            {[
              { id: 'dashboard', label: 'Overview Dashboard', icon: BarChart3 },
              { id: 'workflows', label: 'Workflow Automation', icon: Zap },
              { id: 'intelligence', label: 'Threat Intelligence', icon: Shield },
              { id: 'analytics', label: 'Predictive Analytics', icon: Brain }
            ].map(({ id, label, icon: Icon }) => {
              const isSelected = activeView === id;
              const panelId: string = `${id}-panel`;
              const ariaProps: React.AriaAttributes = {
                'aria-selected': isSelected,
                'aria-controls': panelId,
              };
              return (
              <button
                key={id}
                onClick={() => handleViewChange(id as 'dashboard' | 'workflows' | 'intelligence' | 'analytics')}
                className={`flex items-center px-4 py-3 mr-2 text-sm font-medium border-b-2 rounded-t-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-vendorsoluce-navy focus:ring-offset-2 ${
                  isSelected
                    ? 'border-vendorsoluce-green text-vendorsoluce-green'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
                role="tab"
                {...ariaProps}
              >
                <Icon className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{label.split(' ')[0]}</span>
              </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Sections with consistent spacing */}
      <div className="space-y-8">
        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <div id="dashboard-panel" role="tabpanel" aria-labelledby="dashboard-tab" className="space-y-8">
            <GetStartedWidget 
              vendorCount={vendors.length}
              assessmentCount={assessments.length}
              sbomCount={analyses.length}
            />

            {/* Enhanced Dashboard Widget */}
            {(vendors.length > 3 || assessments.length > 2 || analyses.length > 2) && (
              <Card className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Advanced Dashboard</h2>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={handleExportDashboard}>
                      <Plus className="h-4 w-4 mr-2" />
                      Export Dashboard
                    </Button>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      View Full Dashboard
                    </Button>
                  </div>
                </div>
                <CustomizableDashboard />
              </Card>
            )}

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('vendorRisk.totalVendors')}</h2>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{vendorRiskData.length}</p>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t('vendorRisk.monitoredVendors')}</div>
              </Card>
              
              <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('vendorRisk.riskOverview')}</h2>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-2 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <span className="text-xl font-bold text-red-600 dark:text-red-400">{riskCounts.high}</span>
                    <div className="text-xs text-red-600 dark:text-red-400">{t('vendorRisk.highRisk')}</div>
                  </div>
                  <div className="text-center p-2 rounded-md bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                    <span className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{riskCounts.medium}</span>
                    <div className="text-xs text-yellow-600 dark:text-yellow-400">{t('vendorRisk.mediumRisk')}</div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('vendorRisk.complianceStatus')}</h2>
                <div className="grid grid-cols-3 gap-1">
                  <div className="text-center p-2 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">{complianceCounts.compliant}</span>
                    <div className="text-xs text-green-600 dark:text-green-400 leading-tight">{t('vendorRisk.compliant')}</div>
                  </div>
                  <div className="text-center p-2 rounded-md bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                    <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{complianceCounts.partial}</span>
                    <div className="text-xs text-yellow-600 dark:text-yellow-400 leading-tight">{t('vendorRisk.partial')}</div>
                  </div>
                  <div className="text-center p-2 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <span className="text-lg font-bold text-red-600 dark:text-red-400">{complianceCounts.nonCompliant}</span>
                    <div className="text-xs text-red-600 dark:text-red-400 leading-tight">{t('vendorRisk.nonCompliant')}</div>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Vendor Table Section */}
            <Card className="overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('vendorRisk.vendorOverview')}</h2>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <DataImportExport
                      dataType="vendors"
                      data={vendors}
                      onImportComplete={(result) => {
                        if (result.success) {
                          handleRefresh();
                        }
                      }}
                      onRefresh={handleRefresh}
                    />
                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={() => setShowAddModal(true)}
                      className="w-full sm:w-auto"
                      aria-label="Add new vendor"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('vendorRisk.addNewVendor')}
                    </Button>
                  </div>
                </div>
              </div>
              
              {vendorRiskData.length > 0 ? (
                <VendorRiskTable 
                  vendors={vendorRiskData}
                  onRefresh={handleRefresh}
                />
              ) : (
                <div className="p-12 text-center bg-gray-50 dark:bg-gray-800/30">
                  <div className="max-w-sm mx-auto">
                    <div className="mb-4">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No vendors added yet. Start by adding your first vendor.</p>
                    <Button 
                      variant="primary" 
                      onClick={() => setShowAddModal(true)}
                      className="w-full sm:w-auto"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Vendor
                    </Button>
                  </div>
                </div>
              )}
            </Card>
            
            {/* Risk Information Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t('vendorRisk.riskScoring.title')}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {t('vendorRisk.riskScoring.description')}
                </p>
                <div className="space-y-4">
                  {[
                    { level: 'lowRisk', color: 'green', widthClass: 'w-full', status: 'excellent' },
                    { level: 'mediumRisk', color: 'yellow', widthClass: 'w-3/4', status: 'acceptable' },
                    { level: 'highRisk', color: 'orange', widthClass: 'w-1/2', status: 'concerning' },
                    { level: 'criticalRisk', color: 'red', widthClass: 'w-1/4', status: 'unacceptable' }
                  ].map(({ level, color, widthClass, status }) => (
                    <div key={level}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t(`vendorRisk.riskScoring.${level}`)}
                        </span>
                        <span className={`text-sm font-medium text-${color}-600 dark:text-${color}-400`}>
                          {t(`vendorRisk.riskScoring.${status}`)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`bg-${color}-500 h-3 rounded-full transition-all duration-500 ease-out ${widthClass}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t('vendorRisk.actions.title')}</h2>
                <div className="space-y-4">
                  {[
                    { type: 'criticalRisk', color: 'red', icon: '!' },
                    { type: 'highRisk', color: 'orange', icon: '!' },
                    { type: 'mediumRisk', color: 'yellow', icon: '!' },
                    { type: 'lowRisk', color: 'green', icon: '✓' }
                  ].map(({ type, color, icon }) => (
                    <div key={type} className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 h-6 w-6 rounded-full bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center mt-0.5`}>
                        <span className={`text-${color}-600 dark:text-${color}-400 text-sm font-medium`}>{icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {t(`vendorRisk.actions.${type}.title`)}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {t(`vendorRisk.actions.${type}.description`)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Workflow Automation View */}
        {activeView === 'workflows' && (
          <div id="workflows-panel" role="tabpanel" aria-labelledby="workflows-tab" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Workflow Automation</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">Automate your vendor risk management processes</p>
                  
                  {/* Workflow Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{workflowStats.activeTasks}</div>
                      <div className="text-sm text-blue-600 dark:text-blue-400">Active Tasks</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{workflowStats.completedTasks}</div>
                      <div className="text-sm text-green-600 dark:text-green-400">Completed</div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">{workflowStats.overdueTasks}</div>
                      <div className="text-sm text-red-600 dark:text-red-400">Overdue</div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{workflowStats.automationRules}</div>
                      <div className="text-sm text-purple-600 dark:text-purple-400">Automation Rules</div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="primary" size="sm" onClick={handleCreateWorkflow}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Workflow
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleManageAutomation}>
                    <Shield className="h-4 w-4 mr-2" />
                    Manage Automation
                  </Button>
                </div>
              </div>
              <WorkflowAutomation />
            </Card>
          </div>
        )}

        {/* Threat Intelligence View */}
        {activeView === 'intelligence' && (
          <div id="intelligence-panel" role="tabpanel" aria-labelledby="intelligence-tab" className="space-y-6">
            <Card className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Threat Intelligence</h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">Monitor security threats affecting your vendors</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={refreshThreats}
                    disabled={threatLoading}
                    aria-label="Refresh threat data"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${threatLoading ? 'animate-spin' : ''}`} />
                    {threatLoading ? 'Refreshing...' : 'Refresh'}
                  </Button>
                </div>
                
                {/* Real-time Threat Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{threatStats.activeSources}</div>
                    <div className="text-sm text-green-600 dark:text-green-400">Active Sources</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Last updated: {new Date(threatStats.lastUpdated).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{threatStats.threatsToday}</div>
                    <div className="text-sm text-orange-600 dark:text-orange-400">Threats Today</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Real-time monitoring
                    </div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{threatStats.coverage}%</div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">Coverage</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Multi-source intelligence
                    </div>
                  </div>
                </div>
              </div>
              <ThreatIntelligenceFeed vendorIds={vendorRiskData.map(v => v.id)} />
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Threat Intelligence Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{threatStats.activeSources}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Active Sources</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      CVE Database, ThreatFox, MISP
                    </div>
                  </div>
                  <div className="text-center p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{threatStats.threatsToday}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Threats Today</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Real-time threat indicators
                    </div>
                  </div>
                  <div className="text-center p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{threatStats.coverage}%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Coverage</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Comprehensive threat landscape
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Predictive Analytics View */}
        {activeView === 'analytics' && (
          <div id="analytics-panel" role="tabpanel" aria-labelledby="analytics-tab" className="space-y-6">
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Predictive Analytics</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">AI-powered insights and risk predictions</p>
              </div>
              <PredictiveAnalytics />
            </Card>
            
            {/* Export Dashboard Button */}
            <Card className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Export Analytics Report</h3>
                  <p className="text-gray-600 dark:text-gray-300">Generate a comprehensive report of your analytics insights</p>
                </div>
                <Button variant="primary" onClick={handleExportDashboard}>
                  <Plus className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
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
    </div>
  );
};

export default VendorRiskDashboard;