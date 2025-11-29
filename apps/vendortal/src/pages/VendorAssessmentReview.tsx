import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  CheckCircle, 
  AlertTriangle,
  FileText,
  Download,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAssessmentResponses } from '../hooks/useAssessmentResponses';
import { useAuth } from '../context/AuthContext';
import { EmailNotificationService } from '../services/emailNotificationService';
import type { Database } from '../lib/database.types';
import { logger } from '../utils/logger';

type VendorAssessment = Database['public']['Tables']['vs_vendor_assessments']['Row'];
type VendorAssessmentUpdate = Database['public']['Tables']['vs_vendor_assessments']['Update'];
type AssessmentCommentInsert = Database['public']['Tables']['vs_assessment_comments']['Insert'];

type Vendor = {
  id: string;
  name: string;
  contact_email: string | null;
};

type Framework = {
  id: string;
  name: string;
  description: string | null;
};

type VendorAssessmentWithRelations = VendorAssessment & {
  vendor: Vendor | null;
  framework: Framework | null;
};

const VendorAssessmentReview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [assessment, setAssessment] = useState<VendorAssessmentWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);
  const [comments, setComments] = useState<Record<string, string>>({});
  const [savingComments, setSavingComments] = useState<Record<string, boolean>>({});
  
  const { responses, loading: responsesLoading, refetch } = useAssessmentResponses(id || null);

  useEffect(() => {
    const fetchAssessment = async () => {
      if (!id) return;

      try {
        setLoading(true);

        const { data, error } = await supabase
          .from('vs_vendor_assessments')
          .select(`
            *,
            vendor:vs_vendors(id, name, contact_email),
            framework:vs_assessment_frameworks(id, name, description)
          `)
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        setAssessment(data as VendorAssessmentWithRelations);
      } catch (error) {
        logger.error('Failed to fetch assessment:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [id]);

  // Save comment for a specific question
  const saveComment = async (questionId: string, commentText: string) => {
    if (!id || !user || !commentText.trim()) return;

    setSavingComments(prev => ({ ...prev, [questionId]: true }));
    try {
      const commentData: AssessmentCommentInsert = {
        assessment_id: id,
        question_id: questionId,
        user_id: user.id,
        comment_text: commentText.trim(),
        is_reviewer_comment: true
      };
      
      const { error } = await supabase
        .from('vs_assessment_comments')
        // @ts-expect-error - Supabase type inference issue with vs_assessment_comments table
        .insert(commentData);

      if (error) throw error;

      logger.info('Comment saved successfully:', { questionId, assessmentId: id });
    } catch (error) {
      logger.error('Failed to save comment:', error);
      throw error;
    } finally {
      setSavingComments(prev => ({ ...prev, [questionId]: false }));
    }
  };

  const handleApprove = async () => {
    if (!id || !assessment) return;

    setReviewing(true);
    try {
      // Save all comments before approving
      const commentPromises = Object.entries(comments)
        .filter(([_, text]) => text.trim())
        .map(([questionId, text]) => saveComment(questionId, text));

      await Promise.all(commentPromises);

      const updateData: VendorAssessmentUpdate = {
        status: 'reviewed',
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('vs_vendor_assessments')
        // @ts-expect-error - Supabase type inference issue with vs_vendor_assessments table
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      // Send notification email to vendor
      const vendor = assessment.vendor;
      const framework = assessment.framework;
      const organizationName = profile?.company || 'VendorTal™ Risk Review Customer';

      if (vendor?.contact_email) {
        await EmailNotificationService.notifyAssessmentApproved(
          vendor.contact_email,
          vendor.name || 'Vendor',
          organizationName,
          framework?.name || 'Security Assessment'
        );
      }
      
      alert('Assessment approved successfully! Vendor has been notified.');
      navigate('/vendor-assessments');
    } catch (error) {
      logger.error('Failed to approve assessment:', error);
      alert('Failed to approve assessment. Please try again.');
    } finally {
      setReviewing(false);
    }
  };

  const handleRequestRevision = async () => {
    if (!id || !assessment) return;

    setReviewing(true);
    try {
      // Save all comments before requesting revision
      const commentPromises = Object.entries(comments)
        .filter(([_, text]) => text.trim())
        .map(([questionId, text]) => saveComment(questionId, text));

      await Promise.all(commentPromises);

      // Collect all comments into a single message
      const allComments = Object.entries(comments)
        .filter(([_, text]) => text.trim())
        .map(([questionId, text]) => {
          const question = responses.find(r => r.question_id === questionId)?.question;
          return `Question: ${question?.question_text || questionId}\nComment: ${text}`;
        })
        .join('\n\n');

      // Update status back to in_progress
      const updateData: VendorAssessmentUpdate = {
        status: 'in_progress',
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('vs_vendor_assessments')
        // @ts-expect-error - Supabase type inference issue with vs_vendor_assessments table
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      // Send notification email to vendor with comments
      const vendor = assessment.vendor;
      const framework = assessment.framework;
      const organizationName = profile?.company || 'VendorTal™ Risk Review Customer';

      if (vendor?.contact_email) {
        await EmailNotificationService.notifyAssessmentRevision(
          vendor.contact_email,
          vendor.name || 'Vendor',
          organizationName,
          framework?.name || 'Security Assessment',
          id,
          allComments || undefined
        );
      }
      
      alert('Revision requested. Vendor has been notified with your comments.');
      navigate('/vendor-assessments');
    } catch (error) {
      logger.error('Failed to request revision:', error);
      alert('Failed to request revision. Please try again.');
    } finally {
      setReviewing(false);
    }
  };

  const groupedResponses = responses.reduce((acc, response) => {
    const section = response.question?.section || 'General';
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(response);
    return acc;
  }, {} as Record<string, typeof responses>);

  if (loading || responsesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vendortal-navy mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading assessment review...</p>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Assessment Not Found</h2>
            <Button variant="outline" onClick={() => navigate('/vendor-assessments')}>
              Return to Assessments
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const vendor = assessment.vendor;
  const framework = assessment.framework;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/vendor-assessments">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Review Vendor Assessment
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {framework?.name || 'Security Assessment'} - {vendor?.name || 'Unknown Vendor'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Assessment Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Assessment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                  {assessment.status}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Overall Score</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {assessment.overall_score || 'N/A'}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {assessment.completed_at 
                    ? new Date(assessment.completed_at).toLocaleDateString()
                    : 'Not completed'}
                </p>
              </div>
            </div>
            {assessment.section_scores && typeof assessment.section_scores === 'object' && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Section Scores:</p>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(assessment.section_scores as Record<string, number>).map(([section, score]) => (
                    <div key={section} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                      <span className="text-xs text-gray-600 dark:text-gray-400">{section}:</span>
                      <span className="text-sm font-semibold text-blue-700 dark:text-blue-300 ml-1">{score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Responses by Section */}
        {Object.keys(groupedResponses).length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Responses Yet</h3>
              <p className="text-gray-600 dark:text-gray-400">
                The vendor has not submitted any responses to this assessment.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedResponses).map(([section, sectionResponses]) => (
              <Card key={section}>
                <CardHeader>
                  <CardTitle>{section}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {sectionResponses.map((response) => (
                      <div
                        key={response.id}
                        className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                              {response.question?.question_text || 'Question'}
                              {response.question?.is_required && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </h3>
                            
                            {/* Answer */}
                            <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                              <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                                {response.answer || 'No answer provided'}
                              </p>
                            </div>

                            {/* Evidence Files */}
                            {response.evidence_urls && response.evidence_urls.length > 0 && (
                              <div className="mt-3">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Evidence Files:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {response.evidence_urls.map((url, index) => (
                                    <a
                                      key={index}
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30"
                                    >
                                      <FileText className="h-4 w-4 mr-2" />
                                      Evidence {index + 1}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Comment Section */}
                            <div className="mt-4">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Add Comment / Feedback
                                {savingComments[response.question_id] && (
                                  <span className="ml-2 text-xs text-gray-500">Saving...</span>
                                )}
                              </label>
                              <textarea
                                value={comments[response.question_id] || ''}
                                onChange={(e) =>
                                  setComments(prev => ({
                                    ...prev,
                                    [response.question_id]: e.target.value
                                  }))
                                }
                                onBlur={async () => {
                                  const commentText = comments[response.question_id];
                                  if (commentText && commentText.trim()) {
                                    try {
                                      await saveComment(response.question_id, commentText);
                                    } catch {
                                      // Error already logged in saveComment
                                    }
                                  }
                                }}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                rows={3}
                                placeholder="Add your review comments or feedback for the vendor..."
                              />
                              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Comments are saved automatically and will be sent to the vendor when you request revisions.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Review Actions */}
        {assessment.status === 'completed' && (
          <Card className="mt-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Review Actions
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Approve this assessment or request revisions from the vendor.
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    className="border-orange-300 text-orange-700 hover:bg-orange-50"
                    onClick={handleRequestRevision}
                    disabled={reviewing}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Request Revision
                  </Button>
                  <Button
                    variant="primary"
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={handleApprove}
                    disabled={reviewing}
                  >
                    {reviewing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Assessment
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VendorAssessmentReview;

