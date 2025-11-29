import { logger } from '../utils/logger';
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Inbox, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Send,
  FileCheck,
  Eye,
  Search,
  Calendar,
  Shield,
  Filter
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type VendorAssessmentRow = Database['public']['Tables']['vs_vendor_assessments']['Row'];
type VendorRow = Database['public']['Tables']['vs_vendors']['Row'];
type FrameworkRow = Database['public']['Tables']['vs_assessment_frameworks']['Row'];

interface AssessmentWithRelations extends VendorAssessmentRow {
  vendor: Pick<VendorRow, 'id' | 'name' | 'contact_email'> | null;
  framework: Pick<FrameworkRow, 'id' | 'name' | 'description' | 'estimated_time'> | null;
}

const VendorQuestionnaireInbox: React.FC = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  
  const [assessments, setAssessments] = useState<AssessmentWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchAssessments = async () => {
      if (!email) {
        setLoading(false);
        setError('Email parameter is required. Please access this page with ?email=your@email.com');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Query assessments where vendor email matches
        const { data, error: queryError } = await supabase
          .from('vs_vendor_assessments')
          .select(`
            *,
            vendor:vs_vendors(id, name, contact_email),
            framework:vs_assessment_frameworks(id, name, description, estimated_time)
          `)
          .eq('contact_email', email)
          .order('created_at', { ascending: false });

        if (queryError) {
          throw queryError;
        }

        setAssessments(data || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch questionnaires';
        logger.error('Error fetching vendor questionnaires:', err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [email]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20';
      case 'in_progress': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
      case 'sent': return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20';
      case 'pending': return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
      case 'reviewed': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
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

  const isOverdue = (dueDate: string | null, status: string) => {
    if (!dueDate || status === 'completed' || status === 'reviewed') return false;
    return new Date(dueDate) < new Date();
  };

  const filteredAssessments = assessments.filter(assessment => {
    const vendorName = assessment.vendor?.name || '';
    const frameworkName = assessment.framework?.name || '';
    const assessmentName = assessment.assessment_name || '';
    
    const matchesSearch = vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         frameworkName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assessmentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || assessment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vendortal-purple"></div>
        </div>
      </div>
    );
  }

  if (error && !email) {
    return (
      <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <Card className="mt-8 border-l-4 border-l-red-500">
          <CardContent className="p-8">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Email Required
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {error}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Please access this page with your email address: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">/vendor/questionnaires?email=your@email.com</code>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <Inbox className="h-6 w-6 text-vendortal-purple mr-2" />
          <span className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            Vendor Portal
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          My Questionnaires
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          View and complete security questionnaires sent to you
        </p>
        {email && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Accessing as: <strong>{email}</strong>
          </p>
        )}
      </div>

      {error && (
        <Card className="mb-6 border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800 dark:text-red-300">
                <strong>Error:</strong> {error}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      {assessments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{assessments.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {assessments.filter(a => a.status === 'sent' || a.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {assessments.filter(a => a.status === 'in_progress').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {assessments.filter(a => a.status === 'completed' || a.status === 'reviewed').length}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      {assessments.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex flex-col md:flex-row gap-4 flex-1">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search questionnaires..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-full md:w-64"
                  />
                </div>
                <div className="relative">
                  <Filter className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="sent">Sent</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="reviewed">Reviewed</option>
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Questionnaires List */}
      {filteredAssessments.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Inbox className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {assessments.length === 0 ? 'No Questionnaires Found' : 'No Matching Questionnaires'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {assessments.length === 0 
                ? 'You don\'t have any questionnaires yet. Questionnaires will appear here once they are sent to your email address.'
                : 'Try adjusting your search or filter criteria.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssessments.map((assessment) => {
            const overdue = isOverdue(assessment.due_date, assessment.status || 'pending');
            
            return (
              <Card 
                key={assessment.id} 
                className={`hover:shadow-lg transition-shadow ${
                  overdue ? 'border-l-4 border-l-red-500' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">
                        {assessment.assessment_name || `${assessment.framework?.name || 'Security'} Assessment`}
                      </CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(assessment.status || 'pending')}`}>
                          {getStatusIcon(assessment.status || 'pending')}
                          <span className="ml-1 capitalize">{assessment.status || 'pending'}</span>
                        </span>
                        {overdue && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Overdue
                          </span>
                        )}
                      </div>
                    </div>
                    <Shield className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">From</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {assessment.vendor?.name || 'Unknown Company'}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Framework</div>
                      <div className="text-sm text-gray-900 dark:text-white">
                        {assessment.framework?.name || 'Unknown Framework'}
                      </div>
                    </div>

                    {assessment.framework?.estimated_time && (
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Estimated Time</div>
                        <div className="text-sm text-gray-900 dark:text-white">
                          {assessment.framework.estimated_time}
                        </div>
                      </div>
                    )}

                    {assessment.due_date && (
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Due Date</div>
                        <div className={`text-sm flex items-center ${overdue ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-900 dark:text-white'}`}>
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(assessment.due_date).toLocaleDateString()}
                        </div>
                      </div>
                    )}

                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                      <Link to={`/vendor-assessments/${assessment.id}`}>
                        <Button 
                          variant="primary" 
                          className="w-full"
                          disabled={assessment.status === 'completed' || assessment.status === 'reviewed'}
                        >
                          {assessment.status === 'completed' || assessment.status === 'reviewed' ? (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              View Completed
                            </>
                          ) : assessment.status === 'in_progress' ? (
                            <>
                              <Clock className="h-4 w-4 mr-2" />
                              Continue
                            </>
                          ) : (
                            <>
                              <FileCheck className="h-4 w-4 mr-2" />
                              Start Assessment
                            </>
                          )}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default VendorQuestionnaireInbox;

