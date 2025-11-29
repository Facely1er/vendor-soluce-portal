import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';
import { AssessmentResults } from '../components/assessments/AssessmentResults';
import { generateResultsPdf } from '../utils/generatePdf';
import { useSupplyChainAssessments } from '../hooks/useSupplyChainAssessments';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

interface SectionScore {
  title: string;
  percentage: number;
  completed: boolean;
}

interface ResultData {
  overallScore: number;
  sectionScores: SectionScore[];
}

const SupplyChainResults = () => {
  const { t } = useTranslation();
  // const navigate = useNavigate();
  // const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { assessments, loading } = useSupplyChainAssessments();
  const [results, setResults] = useState<ResultData | null>(null);
  const [assessmentMetadata, setAssessmentMetadata] = useState<{
    assessmentName?: string;
    completedAt?: string;
    answers?: Record<string, string>;
    assessmentId?: string;
  }>({});
  
  // Get results from location state or fetch from most recent completed assessment
  // Mock results for demo purposes
  const getMockResults = (): ResultData => {
    return {
      overallScore: 62,
      sectionScores: [
        { title: "Supplier Risk Management", percentage: 70, completed: true },
        { title: "Supply Chain Threat Management", percentage: 55, completed: true },
        { title: "Vulnerability Management", percentage: 60, completed: true },
        { title: "Information Sharing", percentage: 75, completed: true },
        { title: "Incident Response", percentage: 50, completed: true },
        { title: "Supplier Lifecycle Management", percentage: 65, completed: true }
      ]
    };
  };

  useEffect(() => {
    if (location.state?.overallScore && location.state?.sectionScores) {
      // Use results from location state (from assessment page)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults({
        overallScore: location.state.overallScore,
        sectionScores: location.state.sectionScores
      });
      
      // Store metadata for PDF generation and display
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAssessmentMetadata({
        assessmentName: location.state.assessmentName || 'Supply Chain Risk Assessment',
        completedAt: location.state.completedAt || new Date().toISOString(),
        answers: location.state.answers || {},
        assessmentId: location.state.assessmentId || 'demo'
      });
      return; // Early return to prevent further processing
    } else if (isAuthenticated && !loading && assessments.length > 0) {
      // Find the most recent completed assessment
      const completedAssessments = assessments.filter(a => a.status === 'completed');
      const completedAssessment = completedAssessments.length > 0 ? completedAssessments[0] : null;
      
      if (completedAssessment) {
        setResults({
          overallScore: completedAssessment.overall_score || 0,
          sectionScores: completedAssessment.section_scores as SectionScore[] || []
        });
        
        setAssessmentMetadata({
          assessmentName: completedAssessment.assessment_name || 'Supply Chain Risk Assessment',
          completedAt: completedAssessment.completed_at || new Date().toISOString(),
          answers: completedAssessment.answers as Record<string, string> || {},
          assessmentId: completedAssessment.id
        });
      } else {
        // If no completed assessment found, use mock data
        setResults(getMockResults());
        setAssessmentMetadata({
          assessmentName: 'Supply Chain Risk Assessment (Demo)',
          completedAt: new Date().toISOString(),
          answers: {},
          assessmentId: 'demo'
        });
      }
    } else if (!isAuthenticated || !loading) {
      // If no assessments found, use mock data
      setResults(getMockResults());
      setAssessmentMetadata({
        assessmentName: 'Supply Chain Risk Assessment (Demo)',
        completedAt: new Date().toISOString(),
        answers: {},
        assessmentId: 'demo'
      });
    }
  }, [location.state, assessments, loading, isAuthenticated]);
  
  const handleExport = async () => {
    if (!results) return;
    
    await generateResultsPdf(
      `${assessmentMetadata.assessmentName || 'Supply Chain Risk Assessment'} - Results`,
      results.overallScore,
      results.sectionScores,
      new Date(assessmentMetadata.completedAt || Date.now()).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      `${(assessmentMetadata.assessmentName || 'supply-chain-assessment').toLowerCase().replace(/\s+/g, '-')}-results.pdf`
    );
  };

  if (loading || !results) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vendortal-navy"></div>
      </div>
    );
  }

  // Prepare data for AssessmentResults component
  const resultData = {
    overallScore: results.overallScore,
    sectionScores: results.sectionScores,
    assessmentType: 'supplychain' as const,
    frameworkName: "NIST SP 800-161 Supply Chain Risk Management",
    completedDate: new Date(assessmentMetadata.completedAt || new Date().toISOString()).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    assessmentId: assessmentMetadata.assessmentId
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        {assessmentMetadata.assessmentName || t('supplyChainResults.defaultTitle')} - {t('supplyChainResults.resultsTitle')}
      </h1>
      
      {/* Show info message for non-authenticated users */}
      {!isAuthenticated && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                {t('supplyChainResults.accountPrompt.title')}
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">
                {t('supplyChainResults.accountPrompt.description')}
              </p>
              <div className="flex space-x-3">
                <Link to="/signup">
                  <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors">
                    {t('supplyChainResults.accountPrompt.createAccount')}
                  </button>
                </Link>
                <Link to="/signin">
                  <button className="px-3 py-1.5 border border-blue-300 text-blue-600 rounded-md text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                    {t('supplyChainResults.accountPrompt.signIn')}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <AssessmentResults 
        data={resultData}
        onExport={handleExport}
      />
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t('supplyChainResults.keyFindings.title')}</h2>
        <div className="space-y-4">
          <div className="p-4 bg-gray-100/30 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-medium mb-2 text-gray-900 dark:text-white">{t('supplyChainResults.keyFindings.primaryRiskAreas')}</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
              {results.sectionScores
                .filter(s => s.percentage < 60)
                .map((section, index) => (
                  <li key={index}>{section.title} ({section.percentage}% {t('supplyChainResults.keyFindings.compliance')})</li>
                ))}
              {results.sectionScores.filter(s => s.percentage < 60).length === 0 && (
                <li>{t('supplyChainResults.keyFindings.noCriticalRisks')}</li>
              )}
            </ul>
          </div>
          
          <div className="p-4 bg-gray-100/30 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-medium mb-2 text-gray-900 dark:text-white">{t('supplyChainResults.keyFindings.strengths')}</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
              {results.sectionScores
                .filter(s => s.percentage >= 70)
                .map((section, index) => (
                  <li key={index}>{section.title} ({section.percentage}% {t('supplyChainResults.keyFindings.compliance')})</li>
                ))}
              {results.sectionScores.filter(s => s.percentage >= 70).length === 0 && (
                <li>{t('supplyChainResults.keyFindings.noSignificantStrengths')}</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Link to={`/supply-chain-recommendations/${assessmentMetadata.assessmentId || 'demo'}`}>
          <button
            className="px-4 py-2 bg-vendortal-navy text-white rounded hover:bg-vendortal-navy/90 transition-colors"
          >
            {t('supplyChainResults.viewDetailedRecommendations')}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SupplyChainResults;