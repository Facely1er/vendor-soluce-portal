import { logger } from '../utils/logger';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Upload, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  Lock,
  Download
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { EmailNotificationService } from '../services/emailNotificationService';
import { uploadAssessmentEvidence } from '../utils/supabaseStorage';
import type { Database } from '../lib/database.types';

type AssessmentResponse = Database['public']['Tables']['vs_assessment_responses']['Row'];
type VendorAssessmentRow = Database['public']['Tables']['vs_vendor_assessments']['Row'];
type AssessmentQuestionRow = Database['public']['Tables']['vs_assessment_questions']['Row'];
type VendorRow = Database['public']['Tables']['vs_vendors']['Row'];
type FrameworkRow = Database['public']['Tables']['vs_assessment_frameworks']['Row'];
type ProfileRow = Database['public']['Tables']['vs_profiles']['Row'];

interface AssessmentWithRelations extends VendorAssessmentRow {
  vendor: Pick<VendorRow, 'id' | 'name' | 'contact_email'> | null;
  framework: Pick<FrameworkRow, 'id' | 'name' | 'description' | 'estimated_time'> | null;
}

interface AssessmentQuestionUI {
  id: string;
  section: string;
  question: string;
  type: 'yes_no' | 'yes_no_na' | 'text' | 'file_upload' | 'scale';
  required: boolean;
  guidance?: string;
  evidenceRequired?: boolean;
  currentResponse?: AssessmentResponse;
}

interface AssessmentData {
  id: string;
  user_id: string;
  vendorName: string;
  organizationName: string;
  frameworkName: string;
  contactEmail: string;
  dueDate: string;
  estimatedTime: string;
  questions: AssessmentQuestionUI[];
  isSecure: boolean;
  portalAccess: boolean;
  status: string;
}

const VendorAssessmentPortal: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | string[] | number>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});
  const [currentSection, setCurrentSection] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [vendorInfo, setVendorInfo] = useState({
    companyName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    securityContactName: '',
    securityContactEmail: ''
  });
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Fetch real assessment data from database
  useEffect(() => {
    const fetchAssessment = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch assessment with vendor and framework details
        const { data: assessmentData, error: assessmentError } = await supabase
          .from('vs_vendor_assessments')
          .select(`
            *,
            vendor:vs_vendors(id, name, contact_email),
            framework:vs_assessment_frameworks(id, name, description, estimated_time)
          `)
          .eq('id', id)
          .single<AssessmentWithRelations>();

        if (assessmentError || !assessmentData) {
          logger.error('Failed to fetch assessment:', assessmentError);
          setLoading(false);
          return;
        }

        // Check if assessment is accessible (should be sent or in_progress)
        if (!['sent', 'in_progress'].includes(assessmentData.status || '')) {
          logger.warn('Assessment not accessible:', assessmentData.status);
          setLoading(false);
          return;
        }

        // Fetch all questions for the framework
        const { data: questionsData, error: questionsError } = await supabase
          .from('vs_assessment_questions')
          .select('*')
          .eq('framework_id', assessmentData.framework_id)
          .order('order_index', { ascending: true })
          .returns<AssessmentQuestionRow[]>();

        if (questionsError) {
          logger.error('Failed to fetch questions:', questionsError);
          setLoading(false);
          return;
        }

        // Fetch existing responses
        const { data: responsesData, error: responsesError } = await supabase
          .from('vs_assessment_responses')
          .select('*')
          .eq('assessment_id', id)
          .returns<AssessmentResponse[]>();

        if (responsesError) {
          logger.error('Failed to fetch responses:', responsesError);
        }

        // Map responses to questions
        const responsesMap = new Map(
          (responsesData || []).map(r => [r.question_id, r])
        );

        // Map database questions to UI format
        const questionsWithResponses: AssessmentQuestionUI[] = (questionsData || []).map(q => {
          const response = responsesMap.get(q.id);
          
          // Map question type
          let questionType: 'yes_no' | 'yes_no_na' | 'text' | 'file_upload' | 'scale' = 'text';
          if (q.question_type === 'yes_no') questionType = 'yes_no';
          else if (q.question_type === 'multiple_choice') questionType = 'yes_no_na';
          else if (q.question_type === 'file_upload') questionType = 'file_upload';
          else if (q.question_type === 'text') questionType = 'text';

          return {
            id: q.id,
            section: q.section || 'General',
            question: q.question_text,
            type: questionType,
            required: q.is_required || false,
            guidance: undefined, // Could add guidance field to questions table
            evidenceRequired: questionType === 'file_upload',
            currentResponse: response
          };
        });

        // Load existing answers
        const existingAnswers: Record<string, string> = {};
        questionsWithResponses.forEach(q => {
          if (q.currentResponse) {
            existingAnswers[q.id] = q.currentResponse.answer || '';
            // Parse evidence URLs
            if (q.currentResponse.evidence_urls && q.currentResponse.evidence_urls.length > 0) {
              existingAnswers[q.id] = q.currentResponse.evidence_urls.join(',');
            }
          }
        });

        setAnswers(existingAnswers);

        // Update assessment status to 'in_progress' if it's 'sent'
        if (assessmentData.status === 'sent') {
          await supabase
            .from('vs_vendor_assessments')
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore - Supabase client type definitions return 'never' for update queries
            .update({ status: 'in_progress' })
            .eq('id', id);
        }

        // Fetch organization name from assessment owner's profile
        let organizationName = 'VendorTal™ Risk Review Customer';
        if (assessmentData.user_id) {
          const { data: ownerProfile } = await supabase
            .from('vs_profiles')
            .select('company, full_name')
            .eq('id', assessmentData.user_id)
            .single<Pick<ProfileRow, 'company' | 'full_name'>>();
          
          if (ownerProfile?.company) {
            organizationName = ownerProfile.company;
          } else if (ownerProfile?.full_name) {
            organizationName = ownerProfile.full_name;
          }
        }

        // Build assessment data object
        const assessmentObj: AssessmentData = {
          id: assessmentData.id,
          user_id: assessmentData.user_id,
          vendorName: assessmentData.vendor?.name || 'Unknown Vendor',
          organizationName: organizationName,
          frameworkName: assessmentData.framework?.name || 'Security Assessment',
          contactEmail: assessmentData.contact_email || '',
          dueDate: assessmentData.due_date ? new Date(assessmentData.due_date).toLocaleDateString() : 'No due date',
          estimatedTime: assessmentData.framework?.estimated_time || '2-3 hours',
          questions: questionsWithResponses,
          isSecure: true,
          portalAccess: true,
          status: assessmentData.status || 'in_progress'
        };

        setAssessment(assessmentObj);

        // Set vendor info if available
        if (assessmentData.vendor) {
          setVendorInfo(prev => ({
            ...prev,
            companyName: assessmentData.vendor?.name || '',
            contactEmail: assessmentData.vendor?.contact_email || ''
          }));
        }

      } catch (error) {
        logger.error('Error fetching assessment:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [id]);

  // Update progress bar width via ref to avoid inline styles
  const progressPercentage = assessment ? Math.round(
    (Object.keys(answers).length / assessment.questions.length) * 100
  ) : 0;

  useEffect(() => {
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${progressPercentage}%`;
    }
  }, [progressPercentage]);

  const sections = assessment ? [...new Set(assessment.questions.map(q => q.section))] : [];
  const currentSectionQuestions = assessment ? 
    assessment.questions.filter(q => q.section === sections[currentSection]) : [];

  // Save individual response to database
  const saveResponse = async (questionId: string, answer: string | string[] | number, evidenceUrls?: string[]) => {
    if (!assessment || !id) return;

    try {
      const responseData: Database['public']['Tables']['vs_assessment_responses']['Insert'] = {
        assessment_id: id,
        question_id: questionId,
        answer: typeof answer === 'string' ? answer : JSON.stringify(answer),
        answer_data: typeof answer !== 'string' ? answer : null,
        evidence_urls: evidenceUrls || []
      };

      // Upsert response (insert or update)
      const { error } = await supabase
        .from('vs_assessment_responses')
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - Supabase client type definitions return 'never' for upsert queries
        .upsert(responseData, {
          onConflict: 'assessment_id,question_id'
        });

      if (error) {
        throw error;
      }
    } catch (error) {
      logger.error('Failed to save response:', error);
      throw error;
    }
  };

  const handleAnswer = async (questionId: string, answer: string | string[] | number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    
    // Auto-save functionality
    setSaveStatus('saving');
    try {
      await saveResponse(questionId, answer);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      logger.error('Failed to auto-save answer:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleFileUpload = (questionId: string, files: FileList) => {
    const fileArray = Array.from(files);
    
    // Set uploading state
    setUploading(prev => ({ ...prev, [questionId]: true }));
    setUploadErrors(prev => ({ ...prev, [questionId]: '' }));
    
    const uploadFiles = async () => {
      try {
        const uploadPromises = fileArray.map(async (file) => {
          // Validate file size (limit to 10MB)
          if (file.size > 10 * 1024 * 1024) {
            throw new Error(`File ${file.name} is too large. Maximum size is 10MB.`);
          }
          
          // Validate file type
          const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'image/jpeg',
            'image/png',
            'text/plain'
          ];
          
          if (!allowedTypes.includes(file.type)) {
            throw new Error(`File ${file.name} has an unsupported format. Please use PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, or TXT files.`);
          }
          
          // Upload to Supabase Storage
          const result = await uploadAssessmentEvidence(file, assessment?.id || id || 'demo', questionId);
          return { file, url: result.url, path: result.path };
        });
        
        const uploadResults = await Promise.all(uploadPromises);
        
        // Update uploaded files state for UI display
        setUploadedFiles(prev => ({
          ...prev,
          [questionId]: fileArray
        }));
        
        // Store file URLs in answers and save to database
        const fileUrls = uploadResults.map(result => result.url);
        await saveResponse(questionId, '', fileUrls);
        handleAnswer(questionId, fileUrls.join(','));
        
        // Success feedback
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
        
      } catch (error) {
        logger.error('File upload error:', error);
        setUploadErrors(prev => ({
          ...prev,
          [questionId]: error instanceof Error ? error.message : 'Failed to upload files'
        }));
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } finally {
        setUploading(prev => ({ ...prev, [questionId]: false }));
      }
    };
    
    uploadFiles();
  };


  const handleSubmitAssessment = async () => {
    if (!assessment || !id) return;

    // Validate all required questions are answered
    const requiredQuestions = assessment.questions.filter(q => q.required);
    const unansweredRequired = requiredQuestions.filter(q => !answers[q.id]);

    if (unansweredRequired.length > 0) {
      alert(`Please answer all required questions. ${unansweredRequired.length} required question(s) are still unanswered.`);
      return;
    }

    setSubmitting(true);
    try {
      // Calculate scores (simplified - you may want more sophisticated scoring)
      const totalQuestions = assessment.questions.length;
      const answeredQuestions = Object.keys(answers).length;
      const overallScore = Math.round((answeredQuestions / totalQuestions) * 100);

      // Calculate section scores
      const sectionScores: Record<string, number> = {};
      sections.forEach(section => {
        const sectionQuestions = assessment.questions.filter(q => q.section === section);
        const answeredSectionQuestions = sectionQuestions.filter(q => answers[q.id]);
        sectionScores[section] = Math.round((answeredSectionQuestions.length / sectionQuestions.length) * 100);
      });

      // Update assessment status to completed
      const updateData = {
        status: 'completed',
        completed_at: new Date().toISOString(),
        overall_score: overallScore,
        section_scores: sectionScores
      };
      
      const { error } = await supabase
        .from('vs_vendor_assessments')
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - Supabase client type definitions return 'never' for update queries
        .update(updateData)
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Send notification email to assessment owner
      if (assessment.user_id) {
        const { data: ownerProfile } = await supabase
          .from('vs_profiles')
          .select('email')
          .eq('id', assessment.user_id)
          .single<Pick<ProfileRow, 'email'>>();
        
        if (ownerProfile?.email) {
          await EmailNotificationService.notifyAssessmentSubmitted(
            ownerProfile.email,
            assessment.vendorName,
            assessment.frameworkName,
            id || ''
          );
        }
      }
      
      // Show success message
      alert('Assessment submitted successfully! The requesting organization will be notified.');
      
      // Navigate to confirmation page or home
      navigate('/');
      
    } catch (error) {
      logger.error('Failed to submit assessment:', error);
      alert('Failed to submit assessment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (question: AssessmentQuestionUI) => {
    const currentAnswer = answers[question.id];
    
    return (
      <div key={question.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6 last:border-b-0">
        <div className="flex items-start mb-3">
          <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 font-medium px-2 py-1 rounded text-sm font-mono mr-3">
            {question.id}
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </h3>
            
            {question.guidance && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md mb-3 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-300">{question.guidance}</p>
              </div>
            )}
            
            {/* Answer Input */}
            <div className="mt-3">
              {question.type === 'yes_no' && (
                <div className="flex space-x-4">
                  <Button
                    variant={currentAnswer === 'yes' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleAnswer(question.id, 'yes')}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Yes
                  </Button>
                  <Button
                    variant={currentAnswer === 'no' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleAnswer(question.id, 'no')}
                  >
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    No
                  </Button>
                </div>
              )}
              
              {question.type === 'yes_no_na' && (
                <div className="flex space-x-4">
                  <Button
                    variant={currentAnswer === 'yes' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleAnswer(question.id, 'yes')}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Yes
                  </Button>
                  <Button
                    variant={currentAnswer === 'no' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleAnswer(question.id, 'no')}
                  >
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    No
                  </Button>
                  <Button
                    variant={currentAnswer === 'na' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleAnswer(question.id, 'na')}
                  >
                    N/A
                  </Button>
                </div>
              )}
              
              {question.type === 'text' && (
                <textarea
                  value={currentAnswer || ''}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  rows={4}
                  placeholder="Please provide detailed information..."
                />
              )}
              
              {question.type === 'scale' && (
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((value) => {
                    const answerValue = typeof currentAnswer === 'string' ? parseInt(currentAnswer, 10) : currentAnswer;
                    return (
                      <Button
                        key={value}
                        variant={answerValue === value ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => handleAnswer(question.id, value)}
                        className="w-12"
                      >
                        {value}
                      </Button>
                    );
                  })}
                </div>
              )}
              
              {question.type === 'file_upload' && (
                <div className="mt-3">
                  {uploadErrors[question.id] && (
                    <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                      <div className="flex items-start">
                        <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-red-700 dark:text-red-400 text-sm">{uploadErrors[question.id]}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                    <input
                      type="file"
                      id={`file-${question.id}`}
                      multiple
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt"
                      onChange={(e) => e.target.files && handleFileUpload(question.id, e.target.files)}
                      className="hidden"
                      disabled={uploading[question.id]}
                    />
                    <label htmlFor={`file-${question.id}`} className="cursor-pointer">
                      <div className="text-center">
                        {uploading[question.id] ? (
                          <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vendortal-navy mx-auto mb-2"></div>
                            <p className="text-sm text-vendortal-navy font-medium">Uploading files...</p>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Click to upload files or drag and drop
                            </p>
                          </>
                        )}
                      </div>
                      {!uploading[question.id] && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, TXT up to 10MB each
                          </span>
                        </p>
                      )}
                    </label>
                  </div>
                  
                  {uploadedFiles[question.id] && uploadedFiles[question.id].length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-sm font-medium text-purple-800 dark:text-purple-300">
                        Successfully uploaded files:
                      </p>
                      {uploadedFiles[question.id].map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 text-purple-600 mr-2" />
                            <span className="text-sm text-purple-800 dark:text-purple-300">{file.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-purple-600 dark:text-purple-400">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                            <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Show existing evidence URLs if any */}
                  {question.currentResponse?.evidence_urls && question.currentResponse.evidence_urls.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                        Previously uploaded files:
                      </p>
                      {question.currentResponse.evidence_urls.map((url, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 text-blue-600 mr-2" />
                            <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-800 dark:text-blue-300 hover:underline">
                              Evidence File {index + 1}
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vendortal-navy mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading assessment...</p>
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
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              The assessment link may be invalid or expired.
            </p>
            <Button variant="outline" onClick={() => navigate('/')}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Secure Portal Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center">
                <Lock className="h-5 w-5 text-purple-500 mr-2" />
                <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">Secure Portal</span>
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {assessment.frameworkName}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Requested by {assessment.organizationName}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Progress: {progressPercentage}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Due: {assessment.dueDate}
                </div>
              </div>
              <div className="w-16 h-16 relative">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    className="stroke-gray-200 dark:stroke-gray-700"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    className="stroke-vendortal-purple"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${progressPercentage * 1.76} 176`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-900 dark:text-white">
                    {progressPercentage}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                ref={progressBarRef}
                className="bg-vendortal-purple h-2 rounded-full progress-bar-fill"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Assessment Sections</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  {sections.map((section, index) => {
                    const sectionQuestions = assessment.questions.filter(q => q.section === section);
                    const answeredCount = sectionQuestions.filter(q => answers[q.id]).length;
                    const isComplete = answeredCount === sectionQuestions.length;
                    
                    return (
                      <button
                        key={section}
                        onClick={() => setCurrentSection(index)}
                        className={`w-full text-left p-3 rounded-md transition-colors ${
                          currentSection === index
                            ? 'bg-vendortal-navy text-white'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{section}</span>
                          <div className="flex items-center">
                            {isComplete && (
                              <CheckCircle className="h-4 w-4 text-purple-500 mr-1" />
                            )}
                            <span className="text-xs">
                              {answeredCount}/{sectionQuestions.length}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </nav>
                
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Auto-save status:</span>
                    <div className="flex items-center">
                      {saveStatus === 'saving' && (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-vendortal-navy mr-1"></div>
                      )}
                      {saveStatus === 'saved' && (
                        <CheckCircle className="h-3 w-3 text-purple-500 mr-1" />
                      )}
                      <span className={`text-xs ${
                        saveStatus === 'saved' ? 'text-purple-600' : 'text-gray-500'
                      }`}>
                        {saveStatus === 'saved' ? 'Saved' : 'Saving...'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">
                    {sections[currentSection]} ({currentSection + 1} of {sections.length})
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Vendor Information Section (only show on first section) */}
                {currentSection === 0 && (
                  <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-3">
                      Company Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={vendorInfo.companyName}
                          onChange={(e) => setVendorInfo(prev => ({ ...prev, companyName: e.target.value }))}
                          className="w-full p-2 border border-blue-300 dark:border-blue-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="Your Company Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                          Primary Contact
                        </label>
                        <input
                          type="text"
                          value={vendorInfo.contactName}
                          onChange={(e) => setVendorInfo(prev => ({ ...prev, contactName: e.target.value }))}
                          className="w-full p-2 border border-blue-300 dark:border-blue-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="Contact Name"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Questions */}
                <div className="space-y-6">
                  {currentSectionQuestions.map(renderQuestion)}
                </div>
                
                {/* Navigation */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentSection(prev => Math.max(0, prev - 1))}
                    disabled={currentSection === 0}
                  >
                    Previous Section
                  </Button>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Section {currentSection + 1} of {sections.length}
                  </div>
                  
                  {currentSection < sections.length - 1 ? (
                    <Button
                      variant="primary"
                      onClick={() => setCurrentSection(prev => prev + 1)}
                    >
                      Next Section
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={handleSubmitAssessment}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Submit Assessment
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorAssessmentPortal;