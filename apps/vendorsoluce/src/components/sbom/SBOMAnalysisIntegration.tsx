/**
 * SBOM Analysis Integration Component
 * 
 * This component integrates with the external SBOM-Analyzer API
 * while preserving the standalone nature of SBOM-Analyzer.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useSBOMAnalysis } from '../../hooks/useSBOMAnalysis';
import SBOMUploader from './SBOMUploader';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { AlertCircle, CheckCircle, Loader2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import { logger } from '../../utils/logger';
import './SBOMAnalysisIntegration.css';

interface SBOMAnalysisResult {
  metadata?: {
    totalComponents?: number;
    totalVulnerabilities?: number;
    criticalVulnerabilities?: number;
    highVulnerabilities?: number;
  };
  [key: string]: unknown;
}

interface SBOMAnalysisIntegrationProps {
  vendorId?: string;
  assessmentId?: string;
  onAnalysisComplete?: (result: SBOMAnalysisResult) => void;
  onCancel?: () => void;
}

const SBOMAnalysisIntegration: React.FC<SBOMAnalysisIntegrationProps> = ({
  vendorId,
  assessmentId,
  onAnalysisComplete,
  onCancel
}) => {
  const { t } = useTranslation();
  const {
    analyzeSBOM,
    loading,
    error,
    progress,
    isAnalyzing,
    cancelAnalysis
  } = useSBOMAnalysis({
    vendorId,
    assessmentId,
    onComplete: (result) => {
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    },
    onError: (err) => {
      logger.error('SBOM analysis error:', err);
    }
  });

  const [analysisResult, setAnalysisResult] = useState<SBOMAnalysisResult | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = async (file: File) => {
    try {
      const result = await analyzeSBOM(file, {
        includeDependencies: true,
        severityThreshold: 'LOW',
        generateReport: true
      });
      setAnalysisResult(result);
    } catch (err) {
      // Error is handled by the hook
      logger.error('Analysis failed:', err);
    }
  };

  const handleCancel = () => {
    cancelAnalysis();
    if (onCancel) {
      onCancel();
    }
  };

  // Set CSS custom property for progress width to avoid inline styles
  useEffect(() => {
    if (progressBarRef.current && progress) {
      progressBarRef.current.style.setProperty('--sbom-progress-width', `${progress.percentage}%`);
    }
  }, [progress]);

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      {!analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle>{t('sbom.analysis.title', 'SBOM Analysis')}</CardTitle>
          </CardHeader>
          <CardContent>
            <SBOMUploader
              onUpload={handleFileUpload}
              isLoading={loading}
            />
          </CardContent>
        </Card>
      )}

      {/* Progress Section */}
      {isAnalyzing && progress && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              {t('sbom.analysis.progress', 'Analysis in Progress')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    {progress.message || progress.stage}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {progress.percentage}%
                  </span>
                </div>
                <div className="sbom-progress-bar-container">
                  <div
                    ref={progressBarRef}
                    className="sbom-progress-bar-fill"
                  />
                </div>
              </div>

              {progress.currentComponent && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('sbom.analysis.currentComponent', 'Analyzing')}: {progress.currentComponent}
                </p>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={!isAnalyzing}
                >
                  {t('common.cancel', 'Cancel')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Section */}
      {error && !isAnalyzing && (
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-red-900 dark:text-red-200 mb-1">
                  {t('sbom.analysis.error', 'Analysis Error')}
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                aria-label="Close error message"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Section */}
      {analysisResult && (
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              {t('sbom.analysis.complete', 'Analysis Complete')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysisResult.metadata && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('sbom.results.components', 'Components')}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {analysisResult.metadata.totalComponents || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('sbom.results.vulnerabilities', 'Vulnerabilities')}
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {analysisResult.metadata.totalVulnerabilities || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('sbom.results.critical', 'Critical')}
                    </p>
                    <p className="text-2xl font-bold text-red-700 dark:text-red-500">
                      {analysisResult.metadata.criticalVulnerabilities || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('sbom.results.high', 'High')}
                    </p>
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {analysisResult.metadata.highVulnerabilities || 0}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="primary"
                  onClick={() => {
                    // Navigate to detailed results page when analysis ID is available
                    // For now, log the result for debugging
                    logger.log('View detailed results:', analysisResult);
                    // TODO: Navigate to /sbom-analysis/:id when analysis ID tracking is implemented
                  }}
                >
                  {t('sbom.results.viewDetails', 'View Detailed Results')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setAnalysisResult(null);
                    if (onCancel) {
                      onCancel();
                    }
                  }}
                >
                  {t('sbom.analysis.newAnalysis', 'New Analysis')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SBOMAnalysisIntegration;

