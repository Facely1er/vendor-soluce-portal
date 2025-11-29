/**
 * SBOM Integration Service
 * 
 * This service provides integration with the external SBOM-Analyzer API.
 * It handles authentication, API calls, and result polling while preserving
 * the standalone nature of SBOM-Analyzer.
 */

import { UsageService } from './usageService';
import { logger } from '../utils/logger';

export interface SBOMAnalyzerConfig {
  apiBaseUrl: string;
  apiKey?: string;
  timeout?: number;
}

export interface AnalyzeSBOMRequest {
  file: File;
  options?: {
    includeDependencies?: boolean;
    maxComponents?: number;
    severityThreshold?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    generateReport?: boolean;
  };
  vendorId?: string;
  assessmentId?: string;
}

export interface AnalysisJob {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress?: {
    stage: 'parsing' | 'vulnerability_check' | 'report_generation' | 'complete';
    percentage: number;
    message: string;
    currentComponent?: string;
  };
  result?: AnalysisResult['result'];
  error?: string;
  estimatedTime?: number;
}

export interface AnalysisResult {
  id: string;
  userId: string;
  vendorId?: string;
  assessmentId?: string;
  metadata: {
    filename: string;
    totalComponents: number;
    totalVulnerabilities: number;
    criticalVulnerabilities: number;
    highVulnerabilities: number;
    mediumVulnerabilities: number;
    lowVulnerabilities: number;
    averageCVSS: number;
    analysisDate: string;
  };
  result: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface AnalysisHistory {
  analyses: Array<{
    id: string;
    filename: string;
    metadata: {
      totalComponents: number;
      totalVulnerabilities: number;
      analysisDate: string;
    };
    createdAt: string;
    vendorId?: string;
    assessmentId?: string;
  }>;
  total: number;
  limit: number;
  offset: number;
}

export class SBOMIntegrationService {
  private config: SBOMAnalyzerConfig;
  private authToken: string | null = null;
  private usageService: UsageService;

  constructor(config: SBOMAnalyzerConfig) {
    this.config = config;
    this.usageService = new UsageService();
  }

  /**
   * Set authentication token from VendorSoluce session
   */
  setAuthToken(token: string) {
    this.authToken = token;
  }

  setCurrentUserId(_userId: string) {
    // User ID is passed directly to methods that need it
    // This method exists for API compatibility but the value isn't stored
  }

  /**
   * Analyze SBOM file via SBOM-Analyzer API
   */
  async analyzeSBOM(
    request: AnalyzeSBOMRequest,
    userId: string
  ): Promise<{ jobId: string; status: string }> {
    // Check usage limit first (VendorSoluce side)
    const limitCheck = await this.usageService.canPerformAction(
      userId,
      'sbom_scans'
    );

    if (!limitCheck.canPerform) {
      throw new Error(limitCheck.message || 'SBOM scan limit reached');
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', request.file);
    
    if (request.options) {
      formData.append('options', JSON.stringify(request.options));
    }
    
    const metadata: { vendorId?: string; assessmentId?: string } = {};
    if (request.vendorId) {
      metadata.vendorId = request.vendorId;
    }
    if (request.assessmentId) {
      metadata.assessmentId = request.assessmentId;
    }
    if (Object.keys(metadata).length > 0) {
      formData.append('metadata', JSON.stringify(metadata));
    }

    // Call SBOM-Analyzer API
    const response = await fetch(`${this.config.apiBaseUrl}/api/v1/analyze`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.authToken || ''}`,
        ...(this.config.apiKey ? { 'X-API-Key': this.config.apiKey } : {})
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`SBOM analysis failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();

    // Track usage in VendorSoluce after successful submission
    try {
      await this.usageService.incrementUsage(userId, 'sbom_scans', 1);
    } catch (usageError) {
      logger.error('Failed to track usage:', usageError);
      // Don't throw - usage tracking failure shouldn't break the analysis
    }

    return data;
  }

  /**
   * Poll for analysis results
   */
  async pollAnalysisResult(
    jobId: string,
    onProgress?: (progress: AnalysisJob['progress']) => void,
    maxAttempts: number = 60,
    pollInterval: number = 5000
  ): Promise<AnalysisResult['result']> {
    let attempts = 0;

    while (attempts < maxAttempts) {
      const response = await fetch(
        `${this.config.apiBaseUrl}/api/v1/analyze/${jobId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.authToken || ''}`,
            ...(this.config.apiKey ? { 'X-API-Key': this.config.apiKey } : {})
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get analysis status: ${response.statusText}`);
      }

      const job: AnalysisJob = await response.json();

      if (onProgress && job.progress) {
        onProgress(job.progress);
      }

      if (job.status === 'completed') {
        return job.result || {};
      }

      if (job.status === 'failed') {
        throw new Error(job.error || 'Analysis failed');
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, pollInterval));
      attempts++;
    }

    throw new Error('Analysis timeout - maximum polling attempts reached');
  }

  /**
   * Get analysis result by ID
   */
  async getAnalysisResult(analysisId: string): Promise<AnalysisResult> {
    const response = await fetch(
      `${this.config.apiBaseUrl}/api/v1/results/${analysisId}`,
      {
        headers: {
          'Authorization': `Bearer ${this.authToken || ''}`,
          ...(this.config.apiKey ? { 'X-API-Key': this.config.apiKey } : {})
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get analysis result: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * List analysis history
   */
  async getAnalysisHistory(
    userId: string,
    options?: {
      vendorId?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<AnalysisHistory> {
    const params = new URLSearchParams({
      userId,
      limit: (options?.limit || 20).toString(),
      offset: (options?.offset || 0).toString()
    });

    if (options?.vendorId) {
      params.append('vendorId', options.vendorId);
    }

    const response = await fetch(
      `${this.config.apiBaseUrl}/api/v1/history?${params}`,
      {
        headers: {
          'Authorization': `Bearer ${this.authToken || ''}`,
          ...(this.config.apiKey ? { 'X-API-Key': this.config.apiKey } : {})
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get analysis history: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Delete analysis
   */
  async deleteAnalysis(analysisId: string): Promise<void> {
    const response = await fetch(
      `${this.config.apiBaseUrl}/api/v1/results/${analysisId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.authToken || ''}`,
          ...(this.config.apiKey ? { 'X-API-Key': this.config.apiKey } : {})
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete analysis: ${response.statusText}`);
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string; version: string; timestamp: string }> {
    const response = await fetch(`${this.config.apiBaseUrl}/api/v1/health`, {
      headers: {
        ...(this.config.apiKey ? { 'X-API-Key': this.config.apiKey } : {})
      }
    });

    if (!response.ok) {
      throw new Error('SBOM-Analyzer service unavailable');
    }

    return response.json();
  }
}

