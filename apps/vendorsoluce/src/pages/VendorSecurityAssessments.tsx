import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  Shield, 
  Users, 
  Plus,
  FileCheck,
  Clock,
  AlertTriangle,
  CheckCircle,
  Send,
  Eye,
  Search,
  Download,
  BarChart3,
  Crown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useVendors } from '../hooks/useVendors.mock';
import { useVendorAssessments } from '../hooks/useVendorAssessments.mock';
import CreateAssessmentModal from '../components/vendor-assessments/CreateAssessmentModal';
import AssessmentProgressTracker from '../components/vendor-assessments/AssessmentProgressTracker';
import BackToDashboardLink from '../components/common/BackToDashboardLink';
import { logger } from '../utils/logger';

// Component to handle progress bar fill without inline styles
const ProgressBarFill: React.FC<{ progress: number }> = ({ progress }) => {
  const fillRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (fillRef.current) {
      fillRef.current.style.setProperty('--progress-width', `${progress}%`);
    }
  }, [progress]);

  return (
    <div 
      ref={fillRef}
      className="bg-vendorsoluce-green h-2 rounded-full progress-width" 
    />
  );
};

const VendorSecurityAssessments: React.FC = () => {
  const { t } = useTranslation();
  const { vendors, loading: vendorsLoading } = useVendors();
  const { 
    assessments, 
    frameworks, 
    loading: assessmentsLoading, 
    error: assessmentsError,
    createAssessment,
    sendAssessment,
    deleteAssessment,
    getAssessmentProgress,
  } = useVendorAssessments();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'in_progress': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
      case 'sent': return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20';
      case 'pending': return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
      case 'reviewed': return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'sent': return <Send className="h-4 w-4" />;
      case 'pending': return <FileCheck className="h-4 w-4" />;
      case 'reviewed': return <Eye className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assessment.framework.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || assessment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateSuccess = async (assessmentData: { vendorId: string; frameworkId: string; dueDate: string; instructions?: string }) => {
    try {
      await createAssessment(assessmentData);
      setShowCreateModal(false);
    } catch (error) {
      logger.error('Failed to create assessment:', error);
    }
  };

  const handleSendAssessment = async (assessmentId: string) => {
    try {
      await sendAssessment(assessmentId);
      // Show success message or notification
    } catch (error) {
      logger.error('Failed to send assessment:', error);
    }
  };

  const handleDeleteAssessment = async (assessmentId: string) => {
    if (window.confirm('Are you sure you want to delete this assessment?')) {
      try {
        await deleteAssessment(assessmentId);
      } catch (error) {
        logger.error('Failed to delete assessment:', error);
      }
    }
  };

  const loading = vendorsLoading || assessmentsLoading;

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vendorsoluce-green"></div>
        </div>
      </div>
    );
  }

  if (assessmentsError) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Error loading assessments: {assessmentsError}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <BackToDashboardLink />
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-6 w-6 text-yellow-500" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                {t('vendorAssessments.premiumFeature')}
              </span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                VendorTal
              </Badge>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('vendorAssessments.title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mb-2">
              {t('vendorAssessments.description')}
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-3xl italic">
              <strong>VendorTal</strong> is our premium external project offering comprehensive vendor security assessment capabilities.
            </p>
          </div>
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            {t('vendorAssessments.buttons.newAssessment')}
          </Button>
        </div>
      </div>

      {/* Premium Features Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-8">
            <div className="flex items-center mb-4 mt-4">
              <Shield className="h-8 w-8 text-yellow-500 mr-3" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {t('vendorAssessments.features.cmmcAssessments.title')}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t('vendorAssessments.features.cmmcAssessments.description')}
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• {t('vendorAssessments.features.cmmcAssessments.feature1')}</li>
              <li>• {t('vendorAssessments.features.cmmcAssessments.feature2')}</li>
              <li>• {t('vendorAssessments.features.cmmcAssessments.feature3')}</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-8">
            <div className="flex items-center mb-4 mt-4">
              <Users className="h-8 w-8 text-blue-500 mr-3" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {t('vendorAssessments.features.vendorPortal.title')}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t('vendorAssessments.features.vendorPortal.description')}
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• {t('vendorAssessments.features.vendorPortal.feature1')}</li>
              <li>• {t('vendorAssessments.features.vendorPortal.feature2')}</li>
              <li>• {t('vendorAssessments.features.vendorPortal.feature3')}</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-8">
            <div className="flex items-center mb-4 mt-4">
              <BarChart3 className="h-8 w-8 text-green-500 mr-3" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {t('vendorAssessments.features.analytics.title')}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t('vendorAssessments.features.analytics.description')}
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• {t('vendorAssessments.features.analytics.feature1')}</li>
              <li>• {t('vendorAssessments.features.analytics.feature2')}</li>
              <li>• {t('vendorAssessments.features.analytics.feature3')}</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Progress Tracker */}
      <AssessmentProgressTracker assessments={assessments} />

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('vendorAssessments.search.placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-full md:w-64"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by assessment status"
                title="Filter by assessment status"
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">{t('vendorAssessments.filters.allStatuses')}</option>
                <option value="pending">{t('vendorAssessments.status.pending')}</option>
                <option value="sent">{t('vendorAssessments.status.sent')}</option>
                <option value="in_progress">{t('vendorAssessments.status.inProgress')}</option>
                <option value="completed">{t('vendorAssessments.status.completed')}</option>
                <option value="reviewed">{t('vendorAssessments.status.reviewed')}</option>
              </select>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={async () => {
                try {
                  const { generateRecommendationsPdf } = await import('../utils/generatePdf');
                  
                  const recommendations = assessments.map(assessment => ({
                    id: assessment.id,
                    title: `Assessment: ${assessment.vendor.name} - ${assessment.framework.name}`,
                    description: `Status: ${assessment.status || 'pending'}, Progress: ${getAssessmentProgress(assessment)}%, Score: ${assessment.overall_score || 'N/A'}%`,
                    priority: assessment.overall_score && assessment.overall_score < 60 ? 'high' as const : 
                              assessment.overall_score && assessment.overall_score < 80 ? 'medium' as const : 'low' as const,
                    category: 'Vendor Assessment',
                    effort: 'moderate' as const,
                    timeframe: 'short-term' as const,
                    impact: `Assessment for ${assessment.vendor.name} using ${assessment.framework.name} framework.`,
                    steps: [
                      'Review assessment responses',
                      'Validate compliance requirements',
                      'Schedule follow-up if needed',
                      'Update vendor risk profile'
                    ],
                    references: []
                  }));
                  
                  await generateRecommendationsPdf(
                    'Vendor Security Assessments Report',
                    recommendations,
                    new Date().toLocaleDateString(),
                    `vendor-assessments-report-${new Date().toISOString().split('T')[0]}.pdf`
                  );
                } catch (error) {
                  logger.error('Error exporting report:', error);
                  alert('Error generating report. Please try again.');
                }
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              {t('vendorAssessments.actions.exportReport')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Assessments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t('vendorAssessments.table.title')}</span>
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              {t('vendorAssessments.table.count', { count: filteredAssessments.length })}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAssessments.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {t('vendorAssessments.emptyState.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? t('vendorAssessments.emptyState.noMatches')
                  : t('vendorAssessments.emptyState.noAssessments')}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('vendorAssessments.buttons.createFirstAssessment')}
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('vendorAssessments.table.headers.vendor')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('vendorAssessments.table.headers.framework')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('vendorAssessments.table.headers.status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('vendorAssessments.table.headers.progress')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('vendorAssessments.table.headers.dueDate')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('vendorAssessments.table.headers.score')}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('vendorAssessments.table.headers.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredAssessments.map((assessment) => {
                    const progress = getAssessmentProgress(assessment);
                    return (
                      <tr key={assessment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {assessment.vendor.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {assessment.vendor.contact_email || assessment.contact_email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900 dark:text-white">
                            {assessment.framework.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(assessment.status || 'pending')}`}>
                            {getStatusIcon(assessment.status || 'pending')}
                            <span className="ml-1">{t(`vendorAssessments.status.${assessment.status || 'pending'}`)}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                              <ProgressBarFill progress={progress} />
                            </div>
                            <span className="text-sm text-gray-900 dark:text-white font-medium">
                              {progress}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {assessment.due_date ? new Date(assessment.due_date).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {assessment.overall_score ? (
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {assessment.overall_score}%
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Link to={`/vendor-assessments/${assessment.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            {assessment.status === 'pending' && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleSendAssessment(assessment.id)}
                                title="Send Assessment"
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteAssessment(assessment.id)}
                              className="text-red-500 hover:text-red-700"
                              title="Delete Assessment"
                            >
                              <AlertTriangle className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Assessment Modal */}
      {showCreateModal && (
        <CreateAssessmentModal
          vendors={vendors.map(v => ({
            id: v.id,
            name: v.name,
            contact_email: v.contact_email ?? undefined
          }))}
          frameworks={frameworks.map(f => ({
            id: f.id,
            name: f.name,
            description: f.description || '',
            questionCount: f.question_count || 0,
            estimatedTime: f.estimated_time || '',
            framework_type: f.framework_type
          }))}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
};

export default VendorSecurityAssessments;