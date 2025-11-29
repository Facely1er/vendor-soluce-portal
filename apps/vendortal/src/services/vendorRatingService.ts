import { supabase } from '../lib/supabase';
import { logger } from '../utils/logger';

export interface VendorRating {
  id: string;
  vendor_id: string;
  overall_rating: number;
  assessment_score: number;
  compliance_score: number;
  response_time_score: number;
  completion_rate: number;
  security_posture_score: number;
  rating_breakdown: Record<string, any>;
  calculated_at: string;
}

export interface RatingBreakdown {
  assessment_score: number;
  compliance_score: number;
  response_time_score: number;
  completion_rate: number;
  security_posture_score: number;
  weights: {
    assessment: number;
    compliance: number;
    response_time: number;
    completion_rate: number;
    security_posture: number;
  };
}

export interface IndustryBenchmark {
  industry: string;
  average_rating: number;
  median_rating: number;
  percentile_25: number;
  percentile_75: number;
  vendor_count: number;
}

class VendorRatingService {
  /**
   * Calculate overall vendor rating based on multiple factors
   */
  async calculateVendorRating(vendorId: string): Promise<VendorRating> {
    try {
      // Get vendor profile
      const { data: vendorProfile, error: profileError } = await supabase
        .from('vs_vendor_profiles')
        .select('*')
        .eq('id', vendorId)
        .single();

      if (profileError) throw profileError;
      if (!vendorProfile) {
        throw new Error('Vendor profile not found');
      }

      // Calculate rating components
      const breakdown = await this.calculateRatingBreakdown(vendorId, vendorProfile);

      // Calculate weighted overall rating
      const overallRating = this.calculateWeightedRating(breakdown);

      // Get or create rating record
      const { data: existingRating, error: ratingError } = await supabase
        .from('vs_vendor_ratings')
        .select('*')
        .eq('vendor_id', vendorId)
        .single();

      let ratingData: VendorRating;

      if (existingRating) {
        // Update existing rating
        const { data, error } = await supabase
          .from('vs_vendor_ratings')
          .update({
            overall_rating: overallRating,
            assessment_score: breakdown.assessment_score,
            compliance_score: breakdown.compliance_score,
            response_time_score: breakdown.response_time_score,
            completion_rate: breakdown.completion_rate,
            security_posture_score: breakdown.security_posture_score,
            rating_breakdown: breakdown,
            calculated_at: new Date().toISOString(),
          })
          .eq('vendor_id', vendorId)
          .select()
          .single();

        if (error) throw error;
        ratingData = data as VendorRating;
      } else {
        // Create new rating
        const { data, error } = await supabase
          .from('vs_vendor_ratings')
          .insert({
            vendor_id: vendorId,
            overall_rating: overallRating,
            assessment_score: breakdown.assessment_score,
            compliance_score: breakdown.compliance_score,
            response_time_score: breakdown.response_time_score,
            completion_rate: breakdown.completion_rate,
            security_posture_score: breakdown.security_posture_score,
            rating_breakdown: breakdown,
          })
          .select()
          .single();

        if (error) throw error;
        ratingData = data as VendorRating;
      }

      // Update vendor profile with rating
      await supabase
        .from('vs_vendor_profiles')
        .update({
          vendor_rating: overallRating,
          security_posture_score: breakdown.security_posture_score,
        })
        .eq('id', vendorId);

      return ratingData;
    } catch (error) {
      logger.error('Error calculating vendor rating:', error);
      throw error;
    }
  }

  /**
   * Update rating after assessment completion
   */
  async updateRating(vendorId: string): Promise<VendorRating> {
    return this.calculateVendorRating(vendorId);
  }

  /**
   * Get detailed rating breakdown
   */
  async getRatingBreakdown(vendorId: string): Promise<RatingBreakdown> {
    try {
      const { data, error } = await supabase
        .from('vs_vendor_ratings')
        .select('rating_breakdown')
        .eq('vendor_id', vendorId)
        .single();

      if (error) throw error;
      if (!data || !data.rating_breakdown) {
        // Calculate if not exists
        const { data: vendorProfile } = await supabase
          .from('vs_vendor_profiles')
          .select('*')
          .eq('id', vendorId)
          .single();

        if (!vendorProfile) {
          throw new Error('Vendor profile not found');
        }

        return await this.calculateRatingBreakdown(vendorId, vendorProfile);
      }

      return data.rating_breakdown as RatingBreakdown;
    } catch (error) {
      logger.error('Error fetching rating breakdown:', error);
      throw error;
    }
  }

  /**
   * Get industry benchmark for comparison
   */
  async getIndustryBenchmark(industry: string): Promise<IndustryBenchmark> {
    try {
      // Get all vendors in the same industry
      const { data: vendors, error: vendorsError } = await supabase
        .from('vs_vendor_profiles')
        .select('id, vendor_rating, industry')
        .eq('industry', industry)
        .eq('status', 'approved')
        .not('vendor_rating', 'is', null);

      if (vendorsError) throw vendorsError;

      if (!vendors || vendors.length === 0) {
        return {
          industry,
          average_rating: 0,
          median_rating: 0,
          percentile_25: 0,
          percentile_75: 0,
          vendor_count: 0,
        };
      }

      const ratings = vendors
        .map((v) => v.vendor_rating)
        .filter((r): r is number => r !== null && r !== undefined)
        .sort((a, b) => a - b);

      const sum = ratings.reduce((acc, r) => acc + r, 0);
      const average = sum / ratings.length;
      const median = this.calculateMedian(ratings);
      const percentile25 = this.calculatePercentile(ratings, 25);
      const percentile75 = this.calculatePercentile(ratings, 75);

      return {
        industry,
        average_rating: Math.round(average * 100) / 100,
        median_rating: Math.round(median * 100) / 100,
        percentile_25: Math.round(percentile25 * 100) / 100,
        percentile_75: Math.round(percentile75 * 100) / 100,
        vendor_count: ratings.length,
      };
    } catch (error) {
      logger.error('Error fetching industry benchmark:', error);
      throw error;
    }
  }

  // Private helper methods

  private async calculateRatingBreakdown(
    vendorId: string,
    vendorProfile: any
  ): Promise<RatingBreakdown> {
    // Calculate assessment score (weighted average of all assessments)
    const assessmentScore = await this.calculateAssessmentScore(vendorId);

    // Calculate compliance score
    const complianceScore = await this.calculateComplianceScore(vendorId);

    // Calculate response time score
    const responseTimeScore = await this.calculateResponseTimeScore(vendorId);

    // Calculate completion rate
    const completionRate = await this.calculateCompletionRate(vendorId);

    // Calculate security posture score
    const securityPostureScore = await this.calculateSecurityPostureScore(
      vendorId,
      vendorProfile
    );

    return {
      assessment_score: assessmentScore,
      compliance_score: complianceScore,
      response_time_score: responseTimeScore,
      completion_rate: completionRate,
      security_posture_score: securityPostureScore,
      weights: {
        assessment: 0.4, // 40% weight
        compliance: 0.25, // 25% weight
        response_time: 0.15, // 15% weight
        completion_rate: 0.1, // 10% weight
        security_posture: 0.1, // 10% weight
      },
    };
  }

  private async calculateAssessmentScore(vendorId: string): Promise<number> {
    try {
      // Get all assessments for this vendor (both proactive and regular)
      const { data: proactiveAssessments } = await supabase
        .from('vs_proactive_assessments')
        .select('overall_score')
        .eq('vendor_profile_id', vendorId)
        .eq('status', 'completed')
        .not('overall_score', 'is', null);

      const { data: vendorAssessments } = await supabase
        .from('vs_vendor_assessments')
        .select('overall_score')
        .eq('vendor_id', vendorId)
        .eq('status', 'completed')
        .not('overall_score', 'is', null);

      const allScores = [
        ...(proactiveAssessments?.map((a) => a.overall_score) || []),
        ...(vendorAssessments?.map((a) => a.overall_score) || []),
      ].filter((s): s is number => s !== null && s !== undefined);

      if (allScores.length === 0) {
        return 0;
      }

      const sum = allScores.reduce((acc, s) => acc + s, 0);
      return Math.round((sum / allScores.length) * 100) / 100;
    } catch (error) {
      logger.error('Error calculating assessment score:', error);
      return 0;
    }
  }

  private async calculateComplianceScore(vendorId: string): Promise<number> {
    try {
      const { data: vendorProfile } = await supabase
        .from('vs_vendor_profiles')
        .select('compliance_status')
        .eq('id', vendorId)
        .single();

      if (!vendorProfile) return 0;

      // Map compliance status to score
      const statusMap: Record<string, number> = {
        compliant: 100,
        'partial': 60,
        'non-compliant': 20,
      };

      // Get compliance status from vendor profile or assessments
      const complianceStatus = vendorProfile.compliance_status || 'non-compliant';
      return statusMap[complianceStatus] || 0;
    } catch (error) {
      logger.error('Error calculating compliance score:', error);
      return 0;
    }
  }

  private async calculateResponseTimeScore(vendorId: string): Promise<number> {
    try {
      // Get average response time for assessments
      const { data: assessments } = await supabase
        .from('vs_vendor_assessments')
        .select('sent_at, completed_at')
        .eq('vendor_id', vendorId)
        .eq('status', 'completed')
        .not('sent_at', 'is', null)
        .not('completed_at', 'is', null);

      if (!assessments || assessments.length === 0) {
        return 50; // Default score if no data
      }

      const responseTimes = assessments
        .map((a) => {
          if (!a.sent_at || !a.completed_at) return null;
          const sent = new Date(a.sent_at).getTime();
          const completed = new Date(a.completed_at).getTime();
          return (completed - sent) / (1000 * 60 * 60 * 24); // Days
        })
        .filter((t): t is number => t !== null);

      if (responseTimes.length === 0) {
        return 50;
      }

      const avgResponseTime = responseTimes.reduce((acc, t) => acc + t, 0) / responseTimes.length;

      // Score based on response time (faster = higher score)
      // 0-3 days = 100, 4-7 days = 80, 8-14 days = 60, 15-30 days = 40, >30 days = 20
      if (avgResponseTime <= 3) return 100;
      if (avgResponseTime <= 7) return 80;
      if (avgResponseTime <= 14) return 60;
      if (avgResponseTime <= 30) return 40;
      return 20;
    } catch (error) {
      logger.error('Error calculating response time score:', error);
      return 50;
    }
  }

  private async calculateCompletionRate(vendorId: string): Promise<number> {
    try {
      const { data: assessments } = await supabase
        .from('vs_vendor_assessments')
        .select('status')
        .eq('vendor_id', vendorId);

      if (!assessments || assessments.length === 0) {
        return 0;
      }

      const total = assessments.length;
      const completed = assessments.filter((a) => a.status === 'completed').length;

      return Math.round((completed / total) * 100 * 100) / 100;
    } catch (error) {
      logger.error('Error calculating completion rate:', error);
      return 0;
    }
  }

  private async calculateSecurityPostureScore(
    vendorId: string,
    vendorProfile: any
  ): Promise<number> {
    try {
      // Use security_posture_score from profile if available
      if (vendorProfile.security_posture_score !== null && vendorProfile.security_posture_score !== undefined) {
        return vendorProfile.security_posture_score;
      }

      // Otherwise calculate based on assessments and compliance
      const assessmentScore = await this.calculateAssessmentScore(vendorId);
      const complianceScore = await this.calculateComplianceScore(vendorId);

      // Average of assessment and compliance scores
      return Math.round(((assessmentScore + complianceScore) / 2) * 100) / 100;
    } catch (error) {
      logger.error('Error calculating security posture score:', error);
      return 0;
    }
  }

  private calculateWeightedRating(breakdown: RatingBreakdown): number {
    const { weights } = breakdown;
    const weightedSum =
      breakdown.assessment_score * weights.assessment +
      breakdown.compliance_score * weights.compliance +
      breakdown.response_time_score * weights.response_time +
      breakdown.completion_rate * weights.completion_rate +
      breakdown.security_posture_score * weights.security_posture;

    return Math.round(weightedSum * 100) / 100;
  }

  private calculateMedian(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  private calculatePercentile(numbers: number[], percentile: number): number {
    if (numbers.length === 0) return 0;
    const sorted = [...numbers].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }
}

export const vendorRatingService = new VendorRatingService();

