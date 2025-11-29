import { supabase } from '../lib/supabase';
import { logger } from '../utils/logger';

interface AssessmentIntegrationResult {
  success: boolean;
  vendorId: string;
  updatedRiskScore?: number;
  updatedRiskLevel?: string;
  updatedComplianceStatus?: string;
  error?: string;
}

/**
 * Assessment Integration Service
 * 
 * Ensures that VendorIQ and Risk Radar assessments are fully integrated with
 * vendor profiles, automatically updating risk scores, compliance status, and metadata.
 */
class AssessmentIntegrationService {
  
  /**
   * Complete Assessment Integration
   * 
   * When an assessment is completed, this method:
   * 1. Updates vendor risk score based on assessment results
   * 2. Updates vendor risk level (Low, Medium, High, Critical)
   * 3. Updates compliance status based on assessment score
   * 4. Links assessment to vendor profile
   * 5. Updates Risk Radar dimensions if applicable
   * 
   * @param vendorId - The vendor ID
   * @param assessmentScore - The assessment score (0-100)
   * @param assessmentMetadata - Additional assessment data (dimensions, frameworks, etc.)
   * @returns Integration result with updated vendor data
   */
  async integrateAssessmentWithVendor(
    vendorId: string,
    assessmentScore: number,
    assessmentMetadata?: {
      framework?: string;
      dimensions?: Array<{ name: string; score: number }>;
      complianceGaps?: string[];
      riskFactors?: Array<{ factor: string; impact: number }>;
    }
  ): Promise<AssessmentIntegrationResult> {
    try {
      logger.info('Starting assessment integration', { vendorId, assessmentScore });

      // 1. Get current vendor data
      const { data: vendor, error: vendorError } = await supabase
        .from('vs_vendors')
        .select('*')
        .eq('id', vendorId)
        .single();

      if (vendorError || !vendor) {
        throw new Error(`Vendor not found: ${vendorId}`);
      }

      // 2. Calculate risk level from assessment score
      const riskLevel = this.calculateRiskLevel(assessmentScore);

      // 3. Determine compliance status based on score and gaps
      const complianceStatus = this.determineComplianceStatus(
        assessmentScore,
        assessmentMetadata?.complianceGaps
      );

      // 4. Update vendor profile with new assessment data
      const updateData: any = {
        risk_score: assessmentScore,
        risk_level: riskLevel,
        compliance_status: complianceStatus,
        last_assessment_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Add metadata if provided
      if (assessmentMetadata) {
        updateData.notes = this.buildNotesFromMetadata(vendor.notes, assessmentMetadata);
      }

      // 5. Update vendor in database
      const { data: updatedVendor, error: updateError } = await supabase
        .from('vs_vendors')
        .update(updateData)
        .eq('id', vendorId)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      // 6. Update vendor profile if it exists (for VendorIQ)
      await this.updateVendorProfileIfExists(vendorId, {
        risk_score: assessmentScore,
        compliance_status: complianceStatus as any,
      });

      // 7. Create assessment history record
      await this.createAssessmentHistory(vendorId, {
        assessment_score: assessmentScore,
        risk_level: riskLevel,
        compliance_status: complianceStatus,
        framework: assessmentMetadata?.framework,
        dimensions: assessmentMetadata?.dimensions,
        metadata: assessmentMetadata,
      });

      logger.info('Assessment integration complete', { 
        vendorId, 
        riskScore: assessmentScore, 
        riskLevel,
        complianceStatus 
      });

      return {
        success: true,
        vendorId,
        updatedRiskScore: assessmentScore,
        updatedRiskLevel: riskLevel,
        updatedComplianceStatus: complianceStatus,
      };

    } catch (error) {
      logger.error('Assessment integration failed', error);
      return {
        success: false,
        vendorId,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Calculate Risk Level from Score
   * 0-20: Critical
   * 21-40: High
   * 41-60: Medium
   * 61-80: Low
   * 81-100: Low (Excellent)
   */
  private calculateRiskLevel(score: number): string {
    if (score >= 80) return 'Low';
    if (score >= 60) return 'Medium';
    if (score >= 40) return 'High';
    return 'Critical';
  }

  /**
   * Determine Compliance Status from Score and Gaps
   */
  private determineComplianceStatus(
    score: number,
    complianceGaps?: string[]
  ): string {
    const hasGaps = complianceGaps && complianceGaps.length > 0;
    
    if (score >= 80 && !hasGaps) return 'Compliant';
    if (score >= 60 && hasGaps) return 'Partial';
    return 'Non-Compliant';
  }

  /**
   * Build vendor notes from assessment metadata
   */
  private buildNotesFromMetadata(
    existingNotes: string | null,
    metadata: {
      framework?: string;
      dimensions?: Array<{ name: string; score: number }>;
      complianceGaps?: string[];
    }
  ): string {
    const noteParts: string[] = [];
    
    if (existingNotes) {
      noteParts.push(existingNotes);
    }

    const dateStr = new Date().toLocaleDateString();
    noteParts.push(`\n\n[Assessment ${dateStr}]`);

    if (metadata.framework) {
      noteParts.push(`Framework: ${metadata.framework}`);
    }

    if (metadata.dimensions && metadata.dimensions.length > 0) {
      const dimensionSummary = metadata.dimensions
        .map(d => `${d.name}: ${d.score}`)
        .join(', ');
      noteParts.push(`Dimensions: ${dimensionSummary}`);
    }

    if (metadata.complianceGaps && metadata.complianceGaps.length > 0) {
      noteParts.push(`Compliance Gaps: ${metadata.complianceGaps.join(', ')}`);
    }

    return noteParts.join('\n');
  }

  /**
   * Update vendor profile if it exists (for VendorIQ integration)
   */
  private async updateVendorProfileIfExists(
    vendorId: string,
    data: {
      risk_score: number;
      compliance_status: string;
    }
  ): Promise<void> {
    try {
      // Check if vendor profile exists
      const { data: profile, error: checkError } = await supabase
        .from('vs_vendor_profiles')
        .select('id')
        .eq('vendor_id', vendorId)
        .maybeSingle();

      if (checkError || !profile) {
        // Profile doesn't exist, that's okay
        return;
      }

      // Update vendor profile
      const { error: updateError } = await supabase
        .from('vs_vendor_profiles')
        .update({
          risk_score: data.risk_score,
          compliance_status: data.compliance_status as any,
          updated_at: new Date().toISOString(),
        })
        .eq('vendor_id', vendorId);

      if (updateError) {
        logger.error('Failed to update vendor profile', updateError);
      }
    } catch (error) {
      logger.error('Error updating vendor profile', error);
      // Don't throw - this is optional enhancement
    }
  }

  /**
   * Create assessment history record
   */
  private async createAssessmentHistory(
    vendorId: string,
    data: {
      assessment_score: number;
      risk_level: string;
      compliance_status: string;
      framework?: string;
      dimensions?: Array<{ name: string; score: number }>;
      metadata?: any;
    }
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('vs_vendor_assessments')
        .insert({
          vendor_id: vendorId,
          title: `${data.framework || 'Assessment'} - ${new Date().toLocaleDateString()}`,
          type: 'guided-assessment',
          framework: data.framework || 'general',
          status: 'completed',
          progress: 100,
          score: data.assessment_score,
          due_date: new Date().toISOString(),
          metadata: {
            risk_level: data.risk_level,
            compliance_status: data.compliance_status,
            dimensions: data.dimensions,
            ...data.metadata,
          },
        });

      if (error) {
        logger.error('Failed to create assessment history', error);
      }
    } catch (error) {
      logger.error('Error creating assessment history', error);
      // Don't throw - this is optional enhancement
    }
  }

  /**
   * Get vendor with integrated assessment data
   * Returns vendor with latest assessment data
   */
  async getVendorWithAssessments(vendorId: string) {
    try {
      // Get vendor
      const { data: vendor, error: vendorError } = await supabase
        .from('vs_vendors')
        .select('*')
        .eq('id', vendorId)
        .single();

      if (vendorError || !vendor) {
        throw new Error('Vendor not found');
      }

      // Get latest assessment
      const { data: assessments, error: assessmentError } = await supabase
        .from('vs_vendor_assessments')
        .select('*')
        .eq('vendor_id', vendorId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (assessmentError) {
        logger.error('Failed to fetch assessments', assessmentError);
      }

      return {
        vendor,
        latestAssessment: assessments && assessments.length > 0 ? assessments[0] : null,
      };
    } catch (error) {
      logger.error('Failed to get vendor with assessments', error);
      throw error;
    }
  }

  /**
   * Update Risk Radar visualization data
   * Ensures Risk Radar has current vendor data
   */
  async updateRiskRadarData(vendorId: string, dimensionScores: Array<{ name: string; score: number }>) {
    try {
      // Get vendor
      const { data: vendor } = await supabase
        .from('vs_vendors')
        .select('*')
        .eq('id', vendorId)
        .single();

      if (!vendor) {
        throw new Error('Vendor not found');
      }

      // Update Risk Radar data (this would be stored in vendor metadata)
      const radarData = this.convertDimensionsToRadarFormat(dimensionScores);
      
      const { error } = await supabase
        .from('vs_vendors')
        .update({
          notes: this.buildRadarDataNotes(vendor.notes, radarData),
          updated_at: new Date().toISOString(),
        })
        .eq('id', vendorId);

      if (error) {
        logger.error('Failed to update Risk Radar data', error);
      }

      return radarData;
    } catch (error) {
      logger.error('Error updating Risk Radar data', error);
      throw error;
    }
  }

  /**
   * Convert dimension scores to Risk Radar format
   */
  private convertDimensionsToRadarFormat(
    dimensions: Array<{ name: string; score: number }>
  ): Record<string, number> {
    const radarData: Record<string, number> = {};
    
    dimensions.forEach(dim => {
      // Map dimension names to Risk Radar format
      const radarKey = dim.name
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '');
      
      radarData[radarKey] = dim.score;
    });

    return radarData;
  }

  /**
   * Build Risk Radar data notes
   */
  private buildRadarDataNotes(existingNotes: string | null, radarData: Record<string, number>): string {
    const noteParts: string[] = [];
    
    if (existingNotes) {
      noteParts.push(existingNotes);
    }

    noteParts.push('\n\n[Risk Radar Data]');
    Object.entries(radarData).forEach(([key, value]) => {
      noteParts.push(`${key}: ${value}`);
    });

    return noteParts.join('\n');
  }

  /**
   * Sync VendorIQ assessment with Risk Radar
   * Ensures both systems stay in sync
   */
  async syncAssessmentSystems(vendorId: string, assessmentData: any) {
    try {
      // 1. Update vendor profile (VendorIQ)
      await this.integrateAssessmentWithVendor(
        vendorId,
        assessmentData.score,
        {
          framework: assessmentData.framework,
          dimensions: assessmentData.dimensions,
          complianceGaps: assessmentData.complianceGaps,
          riskFactors: assessmentData.riskFactors,
        }
      );

      // 2. Update Risk Radar data if dimensions exist
      if (assessmentData.dimensions) {
        await this.updateRiskRadarData(vendorId, assessmentData.dimensions);
      }

      logger.info('Assessment systems synced successfully', { vendorId });
      
      return {
        success: true,
        vendorId,
        synced: {
          vendorIQ: true,
          riskRadar: !!assessmentData.dimensions,
        },
      };
    } catch (error) {
      logger.error('Failed to sync assessment systems', error);
      throw error;
    }
  }
}

export const assessmentIntegrationService = new AssessmentIntegrationService();

