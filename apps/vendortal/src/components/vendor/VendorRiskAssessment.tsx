import { logger } from '../../utils/logger';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  BarChart3,
  FileText,
  RefreshCw,
  Save
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { VendorProfile, VendorAssessment } from '../../services/vendorService';

interface RiskAssessmentProps {
  vendor: VendorProfile;
  onAssessmentComplete?: (assessment: VendorAssessment) => void;
  onClose?: () => void;
}

interface RiskFactor {
  id: string;
  name: string;
  category: 'security' | 'financial' | 'operational' | 'compliance';
  weight: number;
  score: number;
  maxScore: number;
  description: string;
  evidence: string[];
  recommendations: string[];
}

const VendorRiskAssessment: React.FC<RiskAssessmentProps> = ({
  vendor,
  onAssessmentComplete,
  onClose
}) => {
  const { t: _t } = useTranslation();
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([]);
  const [overallScore, setOverallScore] = useState<number>(0);
  const [riskLevel, setRiskLevel] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Low');
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState<'assessment' | 'review' | 'recommendations'>('assessment');

  useEffect(() => {
    initializeRiskFactors();
  }, [vendor]);

  const initializeRiskFactors = () => {
    const factors: RiskFactor[] = [
      {
        id: 'security_posture',
        name: 'Security Posture',
        category: 'security',
        weight: 0.25,
        score: 0,
        maxScore: 100,
        description: 'Overall security maturity and controls',
        evidence: [],
        recommendations: []
      },
      {
        id: 'financial_stability',
        name: 'Financial Stability',
        category: 'financial',
        weight: 0.20,
        score: 0,
        maxScore: 100,
        description: 'Financial health and stability indicators',
        evidence: [],
        recommendations: []
      },
      {
        id: 'operational_reliability',
        name: 'Operational Reliability',
        category: 'operational',
        weight: 0.20,
        score: 0,
        maxScore: 100,
        description: 'Service delivery and operational excellence',
        evidence: [],
        recommendations: []
      },
      {
        id: 'compliance_status',
        name: 'Compliance Status',
        category: 'compliance',
        weight: 0.15,
        score: 0,
        maxScore: 100,
        description: 'Regulatory compliance and certifications',
        evidence: [],
        recommendations: []
      },
      {
        id: 'data_protection',
        name: 'Data Protection',
        category: 'security',
        weight: 0.10,
        score: 0,
        maxScore: 100,
        description: 'Data handling and privacy controls',
        evidence: [],
        recommendations: []
      },
      {
        id: 'incident_response',
        name: 'Incident Response',
        category: 'operational',
        weight: 0.10,
        score: 0,
        maxScore: 100,
        description: 'Incident response capabilities and procedures',
        evidence: [],
        recommendations: []
      }
    ];
    setRiskFactors(factors);
  };

  const calculateOverallScore = () => {
    const totalWeight = riskFactors.reduce((sum, factor) => sum + factor.weight, 0);
    const weightedScore = riskFactors.reduce((sum, factor) => {
      return sum + (factor.score * factor.weight);
    }, 0);
    
    const finalScore = totalWeight > 0 ? weightedScore / totalWeight : 0;
    setOverallScore(Math.round(finalScore));
    
    // Determine risk level
    if (finalScore >= 80) setRiskLevel('Low');
    else if (finalScore >= 60) setRiskLevel('Medium');
    else if (finalScore >= 40) setRiskLevel('High');
    else setRiskLevel('Critical');
  };

  const updateRiskFactor = (factorId: string, score: number, evidence: string[], recommendations: string[]) => {
    setRiskFactors(prev => prev.map(factor => 
      factor.id === factorId 
        ? { ...factor, score, evidence, recommendations }
        : factor
    ));
  };

  const handleCalculateScore = async () => {
    setIsCalculating(true);
    try {
      // Simulate AI-powered risk assessment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Auto-populate some risk factors based on vendor data
      const updatedFactors = riskFactors.map(factor => {
        let score = factor.score;
        let evidence: string[] = [];
        let recommendations: string[] = [];

        switch (factor.id) {
          case 'security_posture':
            score = vendor.risk_score || 50;
            evidence = ['Security assessment completed', 'Vulnerability scan results'];
            recommendations = ['Implement additional security controls', 'Regular security training'];
            break;
          case 'compliance_status':
            score = vendor.compliance_status === 'compliant' ? 90 : 
                   vendor.compliance_status === 'partial' ? 60 : 30;
            evidence = ['Compliance audit results', 'Certification status'];
            recommendations = ['Maintain compliance certifications', 'Regular compliance reviews'];
            break;
          case 'financial_stability':
            score = 75; // Default score
            evidence = ['Financial statements', 'Credit rating'];
            recommendations = ['Monitor financial health', 'Regular financial reviews'];
            break;
          case 'operational_reliability':
            score = 70; // Default score
            evidence = ['Service level agreements', 'Performance metrics'];
            recommendations = ['Improve service delivery', 'Enhanced monitoring'];
            break;
          case 'data_protection':
            score = 65; // Default score
            evidence = ['Data protection policies', 'Privacy controls'];
            recommendations = ['Strengthen data protection', 'Privacy impact assessments'];
            break;
          case 'incident_response':
            score = 60; // Default score
            evidence = ['Incident response plan', 'Response procedures'];
            recommendations = ['Test incident response', 'Improve response times'];
            break;
        }

        return { ...factor, score, evidence, recommendations };
      });

      setRiskFactors(updatedFactors);
      calculateOverallScore();
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSaveAssessment = async () => {
    setIsSaving(true);
    try {
      const assessment: VendorAssessment = {
        id: '',
        vendor_id: vendor.id,
        assessment_name: `Risk Assessment - ${vendor.company_name}`,
        assessment_type: 'self-assessment',
        status: 'completed',
        overall_score: overallScore,
        risk_level: riskLevel.toLowerCase() as 'low' | 'medium' | 'high' | 'critical',
        assessment_date: new Date().toISOString(),
        next_assessment_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        assessor: 'System',
        findings: riskFactors.map(factor => ({
          factor: factor.name,
          score: factor.score,
          evidence: factor.evidence,
          recommendations: factor.recommendations
        })),
        recommendations: riskFactors.flatMap(factor => factor.recommendations),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Here you would save to the database
      logger.info('Saving assessment:', assessment);
      
      if (onAssessmentComplete) {
        onAssessmentComplete(assessment);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      case 'Medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
      case 'High': return 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-300';
      case 'Critical': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security': return <Shield className="h-4 w-4" />;
      case 'financial': return <TrendingUp className="h-4 w-4" />;
      case 'operational': return <BarChart3 className="h-4 w-4" />;
      case 'compliance': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                Vendor Risk Assessment
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Comprehensive risk evaluation for {vendor.company_name}
              </p>
            </div>
            {onClose && (
              <Button variant="ghost" onClick={onClose}>
                ×
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Assessment Steps */}
      <div className="flex space-x-4 mb-6">
        <Button
          variant={currentStep === 'assessment' ? 'primary' : 'ghost'}
          onClick={() => setCurrentStep('assessment')}
        >
          <FileText className="h-4 w-4 mr-2" />
          Assessment
        </Button>
        <Button
          variant={currentStep === 'review' ? 'primary' : 'ghost'}
          onClick={() => setCurrentStep('review')}
          disabled={overallScore === 0}
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Review
        </Button>
        <Button
          variant={currentStep === 'recommendations' ? 'primary' : 'ghost'}
          onClick={() => setCurrentStep('recommendations')}
          disabled={overallScore === 0}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Recommendations
        </Button>
      </div>

      {/* Assessment Step */}
      {currentStep === 'assessment' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Risk Factors Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskFactors.map((factor) => (
                  <div key={factor.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(factor.category)}
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {factor.name}
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ({factor.category})
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Weight: {(factor.weight * 100).toFixed(0)}%
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {factor.description}
                    </p>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Risk Score: {factor.score}/100
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={factor.score}
                          onChange={(e) => updateRiskFactor(factor.id, parseInt(e.target.value), factor.evidence, factor.recommendations)}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                      </div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {factor.score}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-center">
                <Button
                  onClick={handleCalculateScore}
                  disabled={isCalculating}
                  className="px-8"
                >
                  {isCalculating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Calculate Risk Score
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Review Step */}
      {currentStep === 'review' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Risk Assessment Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {overallScore}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Overall Score</div>
                </div>
                <div className="text-center">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(riskLevel)}`}>
                    {riskLevel} Risk
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Risk Level</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {riskFactors.length}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Factors Assessed</div>
                </div>
              </div>

              <div className="space-y-4">
                {riskFactors.map((factor) => (
                  <div key={factor.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {factor.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          {factor.score}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">/100</span>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div
                        className={`h-2 rounded-full ${
                          factor.score >= 80 ? 'bg-green-500' :
                          factor.score >= 60 ? 'bg-yellow-500' :
                          factor.score >= 40 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${factor.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recommendations Step */}
      {currentStep === 'recommendations' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Risk Mitigation Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskFactors
                  .filter(factor => factor.recommendations.length > 0)
                  .map((factor) => (
                    <div key={factor.id} className="border rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                        {factor.name} Recommendations
                      </h3>
                      <ul className="space-y-2">
                        {factor.recommendations.map((recommendation, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {recommendation}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={() => setCurrentStep('assessment')}
          disabled={currentStep === 'assessment'}
        >
          Previous
        </Button>
        
        <div className="flex space-x-2">
          {currentStep === 'recommendations' && (
            <Button
              onClick={handleSaveAssessment}
              disabled={isSaving}
              className="px-6"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Assessment
                </>
              )}
            </Button>
          )}
          
          <Button
            onClick={() => {
              if (currentStep === 'assessment') setCurrentStep('review');
              else if (currentStep === 'review') setCurrentStep('recommendations');
            }}
            disabled={currentStep === 'recommendations' || overallScore === 0}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VendorRiskAssessment;
