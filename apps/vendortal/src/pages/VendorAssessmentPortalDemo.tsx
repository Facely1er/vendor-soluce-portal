import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Upload, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  Lock,
  Download,
  Play,
  ArrowRight
} from 'lucide-react';

interface AssessmentQuestion {
  id: string;
  section: string;
  question: string;
  type: 'yes_no' | 'yes_no_na' | 'text' | 'file_upload' | 'scale';
  required: boolean;
  guidance?: string;
}

const VendorAssessmentPortalDemo: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'overview' | 'questions' | 'submission'>('overview');
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentSection, setCurrentSection] = useState(0);

  const demoAssessment = {
    id: 'demo-assessment',
    vendorName: 'Demo Vendor Corp',
    organizationName: 'VendorTal™ Risk Review Customer',
    frameworkName: 'CMMC Level 2 Assessment',
    contactEmail: 'security@demovendor.com',
    dueDate: '2025-02-15',
    estimatedTime: '2-3 hours',
    questions: [
      {
        id: 'AC-1',
        section: 'Access Control',
        question: 'Does your organization maintain a formal access control policy?',
        type: 'yes_no_na' as const,
        required: true,
        guidance: 'This should include documented procedures for granting, modifying, and revoking access to systems and data.'
      },
      {
        id: 'AC-2',
        section: 'Access Control',
        question: 'Do you implement multi-factor authentication for administrative access?',
        type: 'yes_no' as const,
        required: true
      },
      {
        id: 'SI-1',
        section: 'System and Information Integrity',
        question: 'Describe your vulnerability management process',
        type: 'text' as const,
        required: true,
        guidance: 'Include details about scanning frequency, remediation timelines, and responsible parties.'
      },
      {
        id: 'SI-2',
        section: 'System and Information Integrity',
        question: 'Upload your most recent vulnerability scan report',
        type: 'file_upload' as const,
        required: false
      },
      {
        id: 'IR-1',
        section: 'Incident Response',
        question: 'Rate your incident response maturity level',
        type: 'scale' as const,
        required: true,
        guidance: '1 = Ad hoc, 5 = Optimized and continuously improved'
      }
    ]
  };

  const sections = [...new Set(demoAssessment.questions.map(q => q.section))];
  const currentSectionQuestions = demoAssessment.questions.filter(
    q => q.section === sections[currentSection]
  );

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const progressPercentage = Math.round(
    (Object.keys(answers).length / demoAssessment.questions.length) * 100
  );

  const renderQuestion = (question: AssessmentQuestion) => {
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
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Click to upload files or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, TXT up to 10MB each
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (currentStep === 'overview') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-vendortal-navy rounded-full mb-4">
              <Play className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Vendor Assessment Portal Demo
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Experience how vendors interact with your assessment requests. This demo shows the complete workflow from receiving an assessment to submitting responses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4">
                    <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Secure Access</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Vendors access assessments through secure, unique links. All data is encrypted and stored securely.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-4">
                    <CheckCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Auto-Save</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Responses are automatically saved as vendors answer questions, preventing data loss.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-4">
                    <Upload className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Evidence Upload</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Vendors can upload supporting documents and evidence files directly through the portal.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Demo Assessment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Assessment Name</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {demoAssessment.frameworkName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Requested By</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {demoAssessment.organizationName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Due Date</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {demoAssessment.dueDate}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Estimated Time</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {demoAssessment.estimatedTime}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Sections</p>
                <div className="flex flex-wrap gap-2">
                  {sections.map((section) => {
                    const sectionQuestions = demoAssessment.questions.filter(q => q.section === section);
                    return (
                      <span
                        key={section}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300"
                      >
                        {section} ({sectionQuestions.length} questions)
                      </span>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              Back to Home
            </Button>
            <Button variant="primary" onClick={() => setCurrentStep('questions')}>
              Start Demo
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'submission') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Assessment Submitted Successfully!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your responses have been saved and submitted. The requesting organization will be notified and can review your submission.
              </p>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Completion Summary</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {Object.keys(answers).length} of {demoAssessment.questions.length} questions answered
                  </p>
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-vendortal-purple h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {progressPercentage}% Complete
                    </p>
                  </div>
                </div>
                <div className="flex justify-center space-x-4 pt-4">
                  <Button variant="outline" onClick={() => {
                    setCurrentStep('questions');
                    setAnswers({});
                    setCurrentSection(0);
                  }}>
                    Try Again
                  </Button>
                  <Button variant="primary" onClick={() => {
                    setCurrentStep('overview');
                    setAnswers({});
                    setCurrentSection(0);
                  }}>
                    Back to Overview
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Demo Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center">
                <Lock className="h-5 w-5 text-purple-500 mr-2" />
                <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">Demo Mode</span>
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {demoAssessment.frameworkName}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Requested by {demoAssessment.organizationName}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Progress: {progressPercentage}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Due: {demoAssessment.dueDate}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-vendortal-purple h-2 rounded-full transition-all duration-300"
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
                    const sectionQuestions = demoAssessment.questions.filter(q => q.section === section);
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
                <div className="space-y-6">
                  {currentSectionQuestions.map(renderQuestion)}
                </div>
                
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
                      onClick={() => setCurrentStep('submission')}
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

export default VendorAssessmentPortalDemo;

