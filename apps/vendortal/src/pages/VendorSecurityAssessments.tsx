import { logger } from '../utils/logger';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
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
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useVendors } from '../hooks/useVendors';
import { useVendorAssessments } from '../hooks/useVendorAssessments';
import CreateAssessmentModal from '../components/vendor-assessments/CreateAssessmentModal';
import AssessmentProgressTracker from '../components/vendor-assessments/AssessmentProgressTracker';
import BackToDashboardLink from '../components/common/BackToDashboardLink';

const VendorSecurityAssessments: React.FC = () => {
  const { t } = useTranslation();
  const { vendors, loading: vendorsLoading } = useVendors();
  const { 
    assessments, 
    frameworks, 
    loading: assessmentsLoading, 
    error: assessmentsError,
    frameworksError,
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
      case 'completed': return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20';
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
    const vendorName = assessment.vendor?.name || '';
    const frameworkName = assessment.framework?.name || '';
    const matchesSearch = vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         frameworkName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || assessment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateSuccess = async (assessmentData: { vendorId: string; frameworkId: string; dueDate: string; instructions?: string }) => {
    try {
      // Find the vendor to get the assessment name
      const vendor = (vendors || []).find(v => v.id === assessmentData.vendorId);
      const framework = (frameworks || []).find(f => f.id === assessmentData.frameworkId);
      
      const assessmentName = `${framework?.name || 'Security'} Assessment - ${vendor?.name || 'Vendor'}`;
      
      // Transform the data to match the hook's expected format
      await createAssessment({
        vendor_id: assessmentData.vendorId,
        framework_id: assessmentData.frameworkId,
        assessment_name: assessmentName,
        due_date: assessmentData.dueDate,
        contact_email: vendor?.contact_email || '',
        custom_message: assessmentData.instructions || null,
        send_reminders: true,
        allow_save_progress: true
      });
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vendortal-purple"></div>
        </div>
      </div>
    );
  }

  if (assessmentsError) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <BackToDashboardLink />
        <Card className="mt-8 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600 dark:text-red-400">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Error Loading Assessments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-red-600 dark:text-red-400">{assessmentsError}</p>
              
              {frameworksError && (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    <strong>Note:</strong> {frameworksError}. You can still view existing assessments, but creating new ones may be limited.
                  </p>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Troubleshooting Steps:</p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
                  <li>Check your browser console (F12) for detailed error information</li>
                  <li>Verify database tables exist in Supabase</li>
                  <li>Check Row Level Security (RLS) policies are configured correctly</li>
                  <li>Ensure you're signed in with a valid account</li>
                </ul>
              </div>

              <div className="flex gap-3 mt-6">
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="primary"
                >
                  Retry
                </Button>
                <Button 
                  onClick={() => {
                    console.error('Assessment Error:', assessmentsError);
                    console.error('Framework Error:', frameworksError);
                    alert('Error details logged to console. Open DevTools (F12) to view.');
                  }} 
                  variant="outline"
                >
                  View Error Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <BackToDashboardLink />
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-2">
              <Shield className="h-6 w-6 text-vendortal-purple mr-2" />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                Due Diligence Portal
              </span>
            </div>
            
            {/* Framework Error Warning */}
            {frameworksError && (
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                <div className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800 dark:text-yellow-300">
                    <strong>Warning:</strong> {frameworksError}. You can view and manage existing assessments, but creating new assessments may be limited until this is resolved.
                  </div>
                </div>
              </div>
            )}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('vendorAssessments.title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl">
              {t('vendorAssessments.description')}
            </p>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Due Diligence Workflow:</strong> Send security questionnaires to vendors → Vendors complete in portal → Review responses for compliance
              </p>
            </div>
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

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-8">
            <div className="flex items-center mb-4 mt-4">
              <BarChart3 className="h-8 w-8 text-purple-500 mr-3" />
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
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              <span onClick={() => {
                alert('Export Report functionality will generate a comprehensive PDF report including assessment status, completion rates, compliance scores, and vendor risk summaries. The report will include executive dashboard views and detailed findings.');
              }}>
                {t('vendorAssessments.actions.exportReport')}
              </span>
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
                              {assessment.vendor?.name || 'Unknown Vendor'}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {assessment.vendor?.contact_email || assessment.contact_email || '-'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900 dark:text-white">
                            {assessment.framework?.name || 'Unknown Framework'}
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
                              <div 
                                className="bg-vendortal-purple h-2 rounded-full" 
                                style={{ width: `${progress}%` }}
                              />
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
                            {assessment.status === 'completed' && (
                              <Link to={`/vendor-assessments/${assessment.id}/review`}>
                                <Button variant="outline" size="sm" title="Review Assessment">
                                  Review
                                </Button>
                              </Link>
                            )}
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
          vendors={(vendors || []).map(v => ({
            id: v.id,
            name: v.name,
            contact_email: v.contact_email || undefined
          }))}
          frameworks={(frameworks || []).map(f => ({
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
    </main>
  );
};

export default VendorSecurityAssessments;