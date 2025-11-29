import { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AlertTriangle, CheckCircle, Circle, Info, ArrowLeft, ArrowRight, Clipboard, FileText, Shield } from 'lucide-react';
import { RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSupplyChainAssessments } from '../hooks/useSupplyChainAssessments';
import { useAuth } from '../context/AuthContext';
import DataImportExport from '../components/data/DataImportExport';
import BackToDashboardLink from '../components/common/BackToDashboardLink';
import { Card as UICard } from '../components/ui/Card';
import { logger } from '../utils/logger';

const SupplyChainAssessment = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { currentAssessment, createOrUpdateAssessment, loading, assessments, refetch } = useSupplyChainAssessments();
  
  // Assessment stage state ('startScreen', 'onboarding', 'assessment')
  const [assessmentStage, setAssessmentStage] = useState<'startScreen' | 'onboarding' | 'assessment'>('startScreen');
  const [assessmentName, setAssessmentName] = useState<string>('Supply Chain Risk Assessment');
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  
  // Reference to track if we've already initialized from currentAssessment
  const initializedRef = useRef(false);
  // Reference for progress bar to set CSS custom property
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Memoize sections to avoid recreating on every render
  const sections = useMemo(() => [
    {
      title: t('supplyChain.sections.supplier.title'),
      description: t('supplyChain.sections.supplier.description'),
      questions: [
        {
          id: "SR-1",
          question: t('supplyChain.sections.supplier.questions.sr1.question'),
          control: "NIST SP 800-161 2.2.1",
          guidance: t('supplyChain.sections.supplier.questions.sr1.guidance')
        },
        {
          id: "SR-2",
          question: t('supplyChain.sections.supplier.questions.sr2.question'),
          control: "NIST SP 800-161 2.2.5",
          guidance: t('supplyChain.sections.supplier.questions.sr2.guidance')
        },
        {
          id: "SR-3",
          question: t('supplyChain.sections.supplier.questions.sr3.question'),
          control: "NIST SP 800-161 2.2.2",
          guidance: t('supplyChain.sections.supplier.questions.sr3.guidance')
        },
        {
          id: "SR-4",
          question: t('supplyChain.sections.supplier.questions.sr4.question'),
          control: "NIST SP 800-161 2.2.6",
          guidance: t('supplyChain.sections.supplier.questions.sr4.guidance')
        }
      ]
    },
    {
      title: t('supplyChain.sections.threat.title'),
      description: t('supplyChain.sections.threat.description'),
      questions: [
        {
          id: "TM-1",
          question: t('supplyChain.sections.threat.questions.tm1.question'),
          control: "NIST SP 800-161 2.3.1",
          guidance: t('supplyChain.sections.threat.questions.tm1.guidance')
        },
        {
          id: "TM-2",
          question: t('supplyChain.sections.threat.questions.tm2.question'),
          control: "NIST SP 800-161 3.4.1",
          guidance: t('supplyChain.sections.threat.questions.tm2.guidance')
        },
        {
          id: "TM-3",
          question: t('supplyChain.sections.threat.questions.tm3.question'),
          control: "NIST SP 800-161 2.2.14",
          guidance: t('supplyChain.sections.threat.questions.tm3.guidance')
        },
        {
          id: "TM-4",
          question: t('supplyChain.sections.threat.questions.tm4.question'),
          control: "NIST SP 800-161 3.3.1",
          guidance: t('supplyChain.sections.threat.questions.tm4.guidance')
        }
      ]
    },
    {
      title: t('supplyChain.sections.vulnerability.title'),
      description: t('supplyChain.sections.vulnerability.description'),
      questions: [
        {
          id: "VM-1",
          question: t('supplyChain.sections.vulnerability.questions.vm1.question'),
          control: "NIST SP 800-161 3.4.2",
          guidance: t('supplyChain.sections.vulnerability.questions.vm1.guidance')
        },
        {
          id: "VM-2",
          question: t('supplyChain.sections.vulnerability.questions.vm2.question'),
          control: "NIST SP 800-161 2.7.1",
          guidance: t('supplyChain.sections.vulnerability.questions.vm2.guidance')
        },
        {
          id: "VM-3",
          question: t('supplyChain.sections.vulnerability.questions.vm3.question'),
          control: "NIST SP 800-161 2.7.3",
          guidance: t('supplyChain.sections.vulnerability.questions.vm3.guidance')
        },
        {
          id: "VM-4",
          question: t('supplyChain.sections.vulnerability.questions.vm4.question'),
          control: "NIST SP 800-161 3.6.2",
          guidance: t('supplyChain.sections.vulnerability.questions.vm4.guidance')
        }
      ]
    },
    {
      title: t('supplyChain.sections.information.title'),
      description: t('supplyChain.sections.information.description'),
      questions: [
        {
          id: "IS-1",
          question: t('supplyChain.sections.information.questions.is1.question'),
          control: "NIST SP 800-161 3.8.1",
          guidance: t('supplyChain.sections.information.questions.is1.guidance')
        },
        {
          id: "IS-2",
          question: t('supplyChain.sections.information.questions.is2.question'),
          control: "NIST SP 800-161 3.8.3",
          guidance: t('supplyChain.sections.information.questions.is2.guidance')
        },
        {
          id: "IS-3",
          question: t('supplyChain.sections.information.questions.is3.question'),
          control: "NIST SP 800-161 3.8.5",
          guidance: t('supplyChain.sections.information.questions.is3.guidance')
        },
        {
          id: "IS-4",
          question: t('supplyChain.sections.information.questions.is4.question'),
          control: "NIST SP 800-161 3.8.6",
          guidance: t('supplyChain.sections.information.questions.is4.guidance')
        }
      ]
    },
    {
      title: t('supplyChain.sections.incident.title'),
      description: t('supplyChain.sections.incident.description'),
      questions: [
        {
          id: "IR-1",
          question: t('supplyChain.sections.incident.questions.ir1.question'),
          control: "NIST SP 800-161 2.8.4",
          guidance: t('supplyChain.sections.incident.questions.ir1.guidance')
        },
        {
          id: "IR-2",
          question: t('supplyChain.sections.incident.questions.ir2.question'),
          control: "NIST SP 800-161 2.8.5",
          guidance: t('supplyChain.sections.incident.questions.ir2.guidance')
        },
        {
          id: "IR-3",
          question: t('supplyChain.sections.incident.questions.ir3.question'),
          control: "NIST SP 800-161 2.8.8",
          guidance: t('supplyChain.sections.incident.questions.ir3.guidance')
        },
        {
          id: "IR-4",
          question: t('supplyChain.sections.incident.questions.ir4.question'),
          control: "NIST SP 800-161 2.8.9",
          guidance: t('supplyChain.sections.incident.questions.ir4.guidance')
        }
      ]
    },
    {
      title: t('supplyChain.sections.lifecycle.title'),
      description: t('supplyChain.sections.lifecycle.description'),
      questions: [
        {
          id: "SL-1",
          question: t('supplyChain.sections.lifecycle.questions.sl1.question'),
          control: "NIST SP 800-161 2.2.16",
          guidance: t('supplyChain.sections.lifecycle.questions.sl1.guidance')
        },
        {
          id: "SL-2",
          question: t('supplyChain.sections.lifecycle.questions.sl2.question'),
          control: "NIST SP 800-161 2.2.17",
          guidance: t('supplyChain.sections.lifecycle.questions.sl2.guidance')
        },
        {
          id: "SL-3",
          question: t('supplyChain.sections.lifecycle.questions.sl3.question'),
          control: "NIST SP 800-161 2.6.3",
          guidance: t('supplyChain.sections.lifecycle.questions.sl3.guidance')
        },
        {
          id: "SL-4",
          question: t('supplyChain.sections.lifecycle.questions.sl4.question'),
          control: "NIST SP 800-161 2.6.4",
          guidance: t('supplyChain.sections.lifecycle.questions.sl4.guidance')
        }
      ]
    }
  ], [t]);

  // Load saved answers if available
  useEffect(() => {
    if (loading) return;
    
    if (currentAssessment?.answers && !initializedRef.current) {
      // If there's an existing assessment in progress, go directly to assessment
      setAnswers(currentAssessment.answers as Record<string, string>);
      setAssessmentName(currentAssessment.assessment_name || 'Supply Chain Risk Assessment');
      setAssessmentStage('assessment');
      initializedRef.current = true; // Mark as initialized so we don't set stage again
    }
  }, [currentAssessment, loading]);

  // Update progress bar width when answers or current section changes
  useEffect(() => {
    if (progressBarRef.current && assessmentStage === 'assessment') {
      const answeredCount = sections[currentSection].questions.filter(q => answers[q.id]).length;
      const totalCount = sections[currentSection].questions.length;
      const progress = totalCount > 0 ? (answeredCount / totalCount) * 100 : 0;
      progressBarRef.current.style.setProperty('--progress-width', `${progress}%`);
    }
  }, [answers, currentSection, assessmentStage, sections]);

  const handleAnswer = async (questionId: string, answer: string) => {
    const newAnswers = {
      ...answers,
      [questionId]: answer
    };
    
    setAnswers(newAnswers);
    
    // Save to database if user is authenticated
    if (isAuthenticated) {
      try {
        setSaveStatus('saving');
        await createOrUpdateAssessment({
          assessment_name: assessmentName
        }, newAnswers);
        setSaveStatus('saved');
        
        // Reset save status after a delay
        setTimeout(() => {
          setSaveStatus('idle');
        }, 2000);
      } catch (err) {
        logger.error('Error saving assessment:', err);
        setSaveStatus('error');
      }
    }
  };

  const calculateSectionScore = (sectionIndex: number) => {
    const sectionQuestions = sections[sectionIndex].questions;
    let score = 0;
    let answered = 0;

    sectionQuestions.forEach(question => {
      const answer = answers[question.id];
      if (answer === 'yes') {
        score += 2;
        answered++;
      } else if (answer === 'partial') {
        score += 1;
        answered++;
      } else if (answer === 'no') {
        answered++;
      }
    });

    return {
      score,
      total: sectionQuestions.length * 2,
      completed: answered === sectionQuestions.length,
      percentage: Math.round((score / (sectionQuestions.length * 2)) * 100)
    };
  };

  const getOverallScore = () => {
    let totalScore = 0;
    let totalPossible = 0;

    sections.forEach((_, index) => {
      const sectionScore = calculateSectionScore(index);
      totalScore += sectionScore.score;
      totalPossible += sectionScore.total;
    });

    return Math.round((totalScore / totalPossible) * 100);
  };

  const renderAnswerButtons = (questionId: string) => {
    const currentAnswer = answers[questionId];
    
    return (
      <div className="flex gap-2 mt-2">
        <Button
          variant={currentAnswer === 'yes' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => handleAnswer(questionId, 'yes')}
          className="flex items-center gap-1"
        >
          <CheckCircle className="w-4 h-4" />
          {t('components.yes')}
        </Button>
        <Button
          variant={currentAnswer === 'partial' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => handleAnswer(questionId, 'partial')}
          className="flex items-center gap-1"
        >
          <Circle className="w-4 h-4" />
          {t('components.partial')}
        </Button>
        <Button
          variant={currentAnswer === 'no' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => handleAnswer(questionId, 'no')}
          className="flex items-center gap-1"
        >
          <AlertTriangle className="w-4 h-4" />
          {t('components.no')}
        </Button>
      </div>
    );
  };

  const handleStartAssessment = () => {
    setAssessmentStage('onboarding');
  };

  const handleContinueToAssessment = async () => {
    // Save assessment name and initialize assessment
    if (isAuthenticated) {
      try {
        setSaveStatus('saving');
        await createOrUpdateAssessment({
          assessment_name: assessmentName,
          status: 'in_progress'
        }, answers);
        setSaveStatus('saved');
      } catch (err) {
        logger.error('Error initializing assessment:', err);
        setSaveStatus('error');
      }
    }
    
    setAssessmentStage('assessment');
  };

  // Determine if we have enough answers to show results
  const hasCompletedMinimumSections = () => {
    let completedSections = 0;
    sections.forEach((_, index) => {
      if (calculateSectionScore(index).completed) {
        completedSections++;
      }
    });
    return completedSections >= Math.ceil(sections.length / 2);
  };

  const handleViewResults = async () => {
    // Calculate section scores for all users
    const sectionScores = sections.map((section, index) => {
      const score = calculateSectionScore(index);
      return {
        title: section.title,
        percentage: score.percentage,
        completed: score.completed
      };
    });
    
    const overallScore = getOverallScore();
    
    // Save assessment if user is authenticated
    if (isAuthenticated) {
      try {
        await createOrUpdateAssessment({
          assessment_name: assessmentName,
          overall_score: overallScore,
          section_scores: sectionScores,
          status: 'completed',
          completed_at: new Date().toISOString()
        }, answers);
      } catch (err) {
        logger.error('Error completing assessment:', err);
        // Don't prevent navigation if save fails
      }
    }
    
    // Navigate to results page
    navigate('/supply-chain-results', { 
      state: { 
        overallScore,
        sectionScores,
        assessmentName,
        answers,
        completedAt: new Date().toISOString()
      }
    });
  };

  const handleBackToStart = () => {
    setAssessmentStage('startScreen');
    setCurrentSection(0);
  };

  const handleRestartAssessment = async () => {
    // Clear all answers and reset to beginning
    setAnswers({});
    setCurrentSection(0);
    setAssessmentStage('onboarding');
    setSaveStatus('idle');
    
    // If user is authenticated, we might want to create a new assessment
    // For now, we'll just reset the UI state
  };
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vendortal-navy"></div>
      </div>
    );
  }

  // Start Screen Component
  const StartScreen = () => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackToDashboardLink />

      <Card className="border-vendortal-navy dark:border-trust-blue border-l-4">
        <CardHeader className="text-center pb-0">
          <div className="mx-auto w-16 h-16 bg-vendorsoluce-navy/10 dark:bg-vendorsoluce-navy/30 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-vendorsoluce-navy dark:text-vendorsoluce-blue" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('assessment.title')}
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-xl mx-auto">
            {t('assessment.subtitle')}
          </p>
        </CardHeader>

        <CardContent className="pt-8 pb-8 px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-lg flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-vendorsoluce-navy/10 dark:bg-vendorsoluce-navy/30 rounded-full flex items-center justify-center mb-3">
                <Shield className="h-6 w-6 text-vendorsoluce-navy dark:text-vendorsoluce-blue" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">{t('assessment.startScreen.nistAligned')}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t('assessment.startScreen.nistDescription')}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-lg flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-vendorsoluce-navy/10 dark:bg-vendorsoluce-navy/30 rounded-full flex items-center justify-center mb-3">
                <Clipboard className="h-6 w-6 text-vendorsoluce-navy dark:text-vendorsoluce-blue" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">{t('assessment.startScreen.comprehensive')}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t('assessment.startScreen.comprehensiveDescription')}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-lg flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-vendorsoluce-navy/10 dark:bg-vendorsoluce-navy/30 rounded-full flex items-center justify-center mb-3">
                <FileText className="h-6 w-6 text-vendorsoluce-navy dark:text-vendorsoluce-blue" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">{t('assessment.startScreen.actionable')}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t('assessment.startScreen.actionableDescription')}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4 mb-8">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-blue-800 dark:text-blue-300 text-sm">
                  {t('assessment.startScreen.infoMessage')}
                </p>
              </div>
            </div>
          </div>
          
          <Button 
            variant="primary" 
            size="lg" 
            className="w-full"
            onClick={handleStartAssessment}
          >
            {t('assessment.startScreen.startAssessment')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  // Onboarding Component
  const OnboardingScreen = () => (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackToDashboardLink />

      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-gray-900 dark:text-white">
            {t('assessment.onboarding.nameYourAssessment')}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {t('assessment.onboarding.assessmentDescription')}
          </p>

          <div className="mb-6">
            <label htmlFor="assessmentName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('assessment.onboarding.assessmentNameLabel')}
            </label>
            <input
              type="text"
              id="assessmentName"
              value={assessmentName}
              onChange={(e) => setAssessmentName(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-vendortal-navy focus:border-vendortal-navy bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder={t('assessment.onboarding.assessmentNamePlaceholder')}
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md mb-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">{t('assessment.onboarding.whatToExpect')}</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>{t('assessment.onboarding.expectation1')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>{t('assessment.onboarding.expectation2')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>{t('assessment.onboarding.expectation3')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>{t('assessment.onboarding.expectation4')}</span>
              </li>
            </ul>
          </div>

          <Button 
            variant="primary"
            className="w-full"
            onClick={handleContinueToAssessment}
          >
            {t('assessment.onboarding.continueToAssessment')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  // Render the appropriate screen based on assessmentStage
  if (assessmentStage === 'startScreen') {
    return <StartScreen />;
  }

  if (assessmentStage === 'onboarding') {
    return <OnboardingScreen />;
  }

  // The main assessment UI (original code with minor adjustments)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackToDashboardLink />
      
      {/* Enhanced Navigation Header */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToStart}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('assessment.backToStart')}
            </Button>
            
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Assessment Progress Indicator */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t('assessment.progress.progressLabel', { 
                answered: Object.keys(answers).length, 
                total: sections.flatMap(s => s.questions).length 
              })}
            </div>
            
            {/* Restart Assessment Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRestartAssessment}
              className="flex items-center text-orange-600 dark:text-orange-400 border-orange-300 dark:border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              {t('assessment.restartAssessment')}
            </Button>
          </div>
        </div>
        
        {/* Assessment Title and Description */}
        <div className="mt-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{assessmentName}</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{t('assessment.subtitle')}</p>
        </div>
      </div>
      
      {/* Save Status Indicator */}
      {saveStatus !== 'idle' && (
        <UICard className="mb-4 border-l-4 border-l-vendorsoluce-green">
          <div className="p-3 flex items-center">
            {saveStatus === 'saving' && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-vendorsoluce-green mr-2"></div>
            )}
            {saveStatus === 'saved' && (
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
            )}
            {saveStatus === 'error' && (
              <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
            )}
            <span className={`text-sm font-medium ${
              saveStatus === 'saved' ? 'text-green-700 dark:text-green-400' :
              saveStatus === 'error' ? 'text-red-700 dark:text-red-400' :
              'text-gray-700 dark:text-gray-300'
            }`}>
              {saveStatus === 'saving' && t('assessment.saving')}
              {saveStatus === 'saved' && t('assessment.saved')}
              {saveStatus === 'error' && t('assessment.saveError')}
            </span>
          </div>
        </UICard>
      )}
      
      {/* Import/Export Section */}
      {isAuthenticated && assessments.length > 0 && (
        <div className="mb-6 flex justify-end">
          <DataImportExport
            dataType="assessments"
            data={assessments}
            onImportComplete={(result) => {
              if (result.success) {
                refetch();
              }
            }}
            onRefresh={refetch}
          />
        </div>
      )}
      
      {/* Remove old header elements since they're now in the enhanced navigation */}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        {sections.map((section, index) => {
          const score = calculateSectionScore(index);
          return (
            <Card key={index} className="p-4">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">{section.title}</h3>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t('assessment.score')}: {score.percentage}%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {score.completed ? t('assessment.complete') : t('assessment.incomplete')}
                  </p>
                </div>
                <Button
                  variant={currentSection === index ? 'primary' : 'outline'}
                  onClick={() => setCurrentSection(index)}
                  size="sm"
                >
                  {currentSection === index ? t('assessment.current') : t('assessment.view')}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{sections[currentSection].title}</h2>
              <span className="text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                {t('assessment.section')} {currentSection + 1} / {sections.length}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-2">{sections[currentSection].description}</p>
            
            {/* Section Progress Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span>{t('assessment.sectionProgress')}</span>
                <span>{t('assessment.progress.questionsAnswered', {
                  count: sections[currentSection].questions.filter(q => answers[q.id]).length,
                  total: sections[currentSection].questions.length
                })}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  ref={progressBarRef}
                  className="bg-vendorsoluce-green h-2 rounded-full transition-all duration-300 progress-width"
                ></div>
              </div>
            </div>
          </div>
          
          <div className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-vendorsoluce-green">{getOverallScore()}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('assessment.overallScore')}</div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {sections[currentSection].questions.map((question) => (
            <div key={question.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
              <div className="flex items-start gap-2 mb-2">
                <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 font-medium px-2 py-1 rounded text-sm font-mono">
                  {question.id}
                </div>
                <p className="font-medium text-gray-900 dark:text-white flex-1">{question.question}</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded mb-3">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{question.control}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{question.guidance}</p>
                  </div>
                </div>
              </div>
              
              {renderAnswerButtons(question.id)}
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentSection(prev => Math.max(0, prev - 1))}
            disabled={currentSection === 0}
          >
            {t('assessment.previousSection')}
          </Button>
          
          {currentSection < sections.length - 1 ? (
            <Button
              variant="primary"
              onClick={() => setCurrentSection(prev => prev + 1)}
            >
              {t('assessment.nextSection')}
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleViewResults}
              disabled={!hasCompletedMinimumSections()}
              className="flex items-center gap-2"
            >
              {t('assessment.viewResults')}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default SupplyChainAssessment;