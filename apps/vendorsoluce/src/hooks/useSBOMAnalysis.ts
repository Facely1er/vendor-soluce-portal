/**
 * useSBOMAnalysis Hook
 * 
 * React hook for integrating with SBOM-Analyzer API.
 * Handles authentication, file upload, progress tracking, and result management.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { SBOMIntegrationService, AnalyzeSBOMRequest, AnalysisResult } from '../services/sbomIntegrationService';
import { supabase } from '../lib/supabase';
import { logger } from '../utils/logger';

interface UseSBOMAnalysisOptions {
  vendorId?: string;
  assessmentId?: string;
  onComplete?: (result: AnalysisResult['result']) => void;
  onError?: (error: Error) => void;
}

export function useSBOMAnalysis(options?: UseSBOMAnalysisOptions) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{
    stage: string;
    percentage: number;
    message: string;
    currentComponent?: string;
  } | null>(null);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);

  // Initialize SBOM service - use ref to avoid recreating on every render
  const sbomServiceRef = useRef<SBOMIntegrationService | null>(null);
  if (!sbomServiceRef.current) {
    sbomServiceRef.current = new SBOMIntegrationService({
      apiBaseUrl: import.meta.env.VITE_SBOM_ANALYZER_API_URL || '',
      apiKey: import.meta.env.VITE_SBOM_ANALYZER_API_KEY,
      timeout: 300000 // 5 minutes
    });
  }
  const sbomService = sbomServiceRef.current;

  // Set auth token and user ID when user is available
  useEffect(() => {
    let isMounted = true;

    const setAuth = async () => {
      if (user && isMounted) {
        // Get session token from Supabase
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          sbomService.setAuthToken(session.access_token);
        }
        sbomService.setCurrentUserId(user.id);
      }
    };

    setAuth();

    return () => {
      isMounted = false;
    };
  }, [user, sbomService]);

  /**
   * Analyze SBOM file
   */
  const analyzeSBOM = useCallback(async (
    file: File,
    analysisOptions?: AnalyzeSBOMRequest['options']
  ) => {
    if (!user) {
      throw new Error('User must be authenticated to analyze SBOM files');
    }

    setLoading(true);
    setError(null);
    setProgress(null);
    setCurrentJobId(null);

    try {
      // Start analysis
      const { jobId } = await sbomService.analyzeSBOM(
        {
          file,
          options: analysisOptions,
          vendorId: options?.vendorId,
          assessmentId: options?.assessmentId
        },
        user.id
      );

      setCurrentJobId(jobId);

      // Poll for results with progress updates
      const result = await sbomService.pollAnalysisResult(
        jobId,
        (progressUpdate) => {
          if (progressUpdate) {
            setProgress(progressUpdate);
          }
        }
      );

      setProgress({
        stage: 'complete',
        percentage: 100,
        message: 'Analysis complete'
      });

      // Call onComplete callback if provided
      if (options?.onComplete) {
        options.onComplete(result);
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
      setError(errorMessage);
      
      if (options?.onError) {
        options.onError(err instanceof Error ? err : new Error(errorMessage));
      }
      
      throw err;
    } finally {
      setLoading(false);
      setCurrentJobId(null);
    }
  }, [user, options, sbomService]);

  /**
   * Get analysis result by ID
   */
  const getAnalysisResult = useCallback(async (analysisId: string): Promise<AnalysisResult> => {
    if (!user) {
      throw new Error('User must be authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const result = await sbomService.getAnalysisResult(analysisId);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get analysis result';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, sbomService]);

  /**
   * Get analysis history
   */
  const getAnalysisHistory = useCallback(async (
    historyOptions?: {
      vendorId?: string;
      limit?: number;
      offset?: number;
    }
  ) => {
    if (!user) {
      throw new Error('User must be authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const history = await sbomService.getAnalysisHistory(user.id, historyOptions);
      return history;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get analysis history';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, sbomService]);

  /**
   * Delete analysis
   */
  const deleteAnalysis = useCallback(async (analysisId: string): Promise<void> => {
    if (!user) {
      throw new Error('User must be authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      await sbomService.deleteAnalysis(analysisId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete analysis';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, sbomService]);

  /**
   * Check service health
   */
  const checkHealth = useCallback(async () => {
    try {
      const health = await sbomService.healthCheck();
      return health;
    } catch (err) {
      logger.error('SBOM-Analyzer health check failed:', err);
      return null;
    }
  }, [sbomService]);

  /**
   * Cancel current analysis (if polling)
   */
  const cancelAnalysis = useCallback(() => {
    setCurrentJobId(null);
    setLoading(false);
    setProgress(null);
  }, []);

  return {
    analyzeSBOM,
    getAnalysisResult,
    getAnalysisHistory,
    deleteAnalysis,
    checkHealth,
    cancelAnalysis,
    loading,
    error,
    progress,
    currentJobId,
    isAnalyzing: loading && currentJobId !== null
  };
}

