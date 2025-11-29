import React, { useState, useEffect } from 'react';
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
import { uploadAssessmentEvidence } from '../utils/supabaseStorage';
import { logger } from '../utils/logger';

interface AssessmentQuestion {
  id: string;
  section: string;
  question: string;
  type: 'yes_no' | 'yes_no_na' | 'text' | 'file_upload' | 'scale';
  required: boolean;
  guidance?: string;
  evidenceRequired?: boolean;
}

interface AssessmentData {
  id: string;
  vendorName: string;
  organizationName: string;
  frameworkName: string;
  contactEmail: string;
  dueDate: string;
  estimatedTime: string;
  questions: AssessmentQuestion[];
  isSecure: boolean;
  portalAccess: boolean;
}

type AnswerValue = string | number | boolean | null;

const VendorAssessmentPortal: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});
  const [currentSection, setCurrentSection] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [vendorInfo, setVendorInfo] = useState({
    companyName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    securityContactName: '',
    securityContactEmail: ''
  });

  // Mock assessment data - in real app this would be fetched from API
  useEffect(() => {
    const mockAssessment: AssessmentData = {
      id: id || 'demo',
      vendorName: 'Example Vendor Corp',
      organizationName: 'VendorSoluce Customer',
      frameworkName: 'CMMC Level 2 Assessment',
      contactEmail: 'security@examplevendor.com',
      dueDate: '2025-02-15',
      estimatedTime: '2-3 hours',
      isSecure: true,
      portalAccess: true,
      questions: [
        {
          id: 'AC-1',
          section: 'Access Control',
          question: 'Does your organization maintain a formal access control policy?',
          type: 'yes_no_na',
          required: true,
          guidance: 'This should include documented procedures for granting, modifying, and revoking access to systems and data.',
          evidenceRequired: true
        },
        {
          id: 'AC-2',
          section: 'Access Control',
          question: 'Do you implement multi-factor authentication for administrative access?',
          type: 'yes_no',
          required: true,
          evidenceRequired: true
        },
        {
          id: 'SI-1',
          section: 'System and Information Integrity',
          question: 'Describe your vulnerability management process',
          type: 'text',
          required: true,
          guidance: 'Include details about scanning frequency, remediation timelines, and responsible parties.'
        },
        {
          id: 'SI-2',
          section: 'System and Information Integrity',
          question: 'Upload your most recent vulnerability scan report',
          type: 'file_upload',
          required: false,
          evidenceRequired: true
        },
        {
          id: 'IR-1',
          section: 'Incident Response',
          question: 'Rate your incident response maturity level',
          type: 'scale',
          required: true,
          guidance: '1 = Ad hoc, 5 = Optimized and continuously improved'
        }
      ]
    };

    setTimeout(() => {
      setAssessment(mockAssessment);
      setLoading(false);
    }, 1000);
  }, [id]);

  const sections = assessment ? [...new Set(assessment.questions.map(q => q.section))] : [];
  const currentSectionQuestions = assessment ? 
    assessment.questions.filter(q => q.section === sections[currentSection]) : [];

  const handleAnswer = (questionId: string, answer: AnswerValue) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    
    // Auto-save functionality
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
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
          const result = await uploadAssessmentEvidence(file, assessment?.id || 'demo', questionId);
          return { file, url: result.url, path: result.path };
        });
        
        const uploadResults = await Promise.all(uploadPromises);
        
        // Update uploaded files state for UI display
        setUploadedFiles(prev => ({
          ...prev,
          [questionId]: fileArray
        }));
        
        // Store file URLs in answers (comma-separated string)
        const fileUrls = uploadResults.map(result => result.url).join(',');
        handleAnswer(questionId, fileUrls);
        
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


  const renderQuestion = (question: AssessmentQuestion) => {
    const currentAnswer = answers[question.id];
    const answerValue = typeof currentAnswer === 'string' ? currentAnswer : 
                       typeof currentAnswer === 'number' ? String(currentAnswer) : 
                       currentAnswer === true ? 'true' :
                       currentAnswer === false ? 'false' : '';
    
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
                  value={answerValue}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  rows={4}
                  placeholder="Please provide detailed information..."
                />
              )}
              
              {question.type === 'scale' && (
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Button
                      key={value}
                      variant={currentAnswer === value ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => handleAnswer(question.id, value)}
                      className="w-12"
                    >
                      {value}
                    </Button>
                  ))}
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
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vendorsoluce-navy mx-auto mb-2"></div>
                            <p className="text-sm text-vendorsoluce-navy font-medium">Uploading files...</p>
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
                      <p className="text-sm font-medium text-green-800 dark:text-green-300">
                        Successfully uploaded files:
                      </p>
                      {uploadedFiles[question.id].map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 text-green-600 mr-2" />
                            <span className="text-sm text-green-800 dark:text-green-300">{file.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-green-600 dark:text-green-400">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vendorsoluce-navy mx-auto mb-4"></div>
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

  const progressPercentage = Math.round(
    (Object.keys(answers).length / assessment.questions.length) * 100
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Secure Portal Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center">
                <Lock className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">Secure Portal</span>
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
                    className="stroke-vendorsoluce-green"
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
              {/* Note: Inline style required for dynamic percentage width - cannot be moved to external CSS */}
              <div 
                className="bg-vendorsoluce-green h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
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
                            ? 'bg-vendorsoluce-navy text-white'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{section}</span>
                          <div className="flex items-center">
                            {isComplete && (
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
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
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-vendorsoluce-navy mr-1"></div>
                      )}
                      {saveStatus === 'saved' && (
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                      )}
                      <span className={`text-xs ${
                        saveStatus === 'saved' ? 'text-green-600' : 'text-gray-500'
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
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Submit Assessment
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