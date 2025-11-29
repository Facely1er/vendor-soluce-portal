import { supabase } from '../lib/supabase';
import { logger } from '../utils/logger';

export interface VendorDirectoryFilters {
  search?: string;
  industry?: string;
  service_types?: string[];
  data_types?: string[];
  min_rating?: number;
  max_rating?: number;
  compliance_status?: string;
  location?: string;
  company_size?: string;
  sort_by?: 'rating' | 'name' | 'recent' | 'relevance';
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface PublicVendorProfile {
  id: string;
  company_name: string;
  legal_name?: string;
  website?: string;
  industry?: string;
  company_size?: string;
  headquarters?: string;
  description?: string;
  logo_url?: string;
  service_types: string[];
  data_types_accessed: string[];
  vendor_rating?: number;
  security_posture_score?: number;
  rating?: {
    overall_rating: number;
    assessment_score: number;
    compliance_score: number;
    response_time_score: number;
    completion_rate: number;
    security_posture_score: number;
  };
  // Asset integration
  asset_count?: number;
  critical_assets_count?: number;
  // SBOM integration
  sbom_compliance_status?: 'compliant' | 'non-compliant' | 'partial' | 'not-assessed';
  sbom_risk_score?: number;
  sbom_analyses_count?: number;
  created_at: string;
}

export interface VendorDirectoryStats {
  total_vendors: number;
  by_industry: Record<string, number>;
  by_service_type: Record<string, number>;
  average_rating: number;
  top_rated_count: number;
}

class VendorDirectoryService {
  /**
   * Search public vendors in the directory
   */
  async searchVendors(filters: VendorDirectoryFilters = {}): Promise<{
    vendors: PublicVendorProfile[];
    total: number;
  }> {
    try {
      let query = supabase
        .from('vs_vendor_profiles')
        .select('*, vs_vendor_ratings(*)', { count: 'exact' })
        .eq('is_public', true)
        .eq('directory_listing_enabled', true)
        .eq('status', 'approved');

      // Apply filters
      if (filters.search) {
        query = query.or(
          `company_name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,industry.ilike.%${filters.search}%`
        );
      }

      if (filters.industry) {
        query = query.eq('industry', filters.industry);
      }

      if (filters.service_types && filters.service_types.length > 0) {
        query = query.overlaps('service_types', filters.service_types);
      }

      if (filters.data_types && filters.data_types.length > 0) {
        query = query.overlaps('data_types_accessed', filters.data_types);
      }

      if (filters.min_rating !== undefined) {
        query = query.gte('vendor_rating', filters.min_rating);
      }

      if (filters.max_rating !== undefined) {
        query = query.lte('vendor_rating', filters.max_rating);
      }

      if (filters.company_size) {
        query = query.eq('company_size', filters.company_size);
      }

      // Apply sorting
      const sortBy = filters.sort_by || 'rating';
      const sortOrder = filters.sort_order || 'desc';

      if (sortBy === 'rating') {
        query = query.order('vendor_rating', { ascending: sortOrder === 'asc' });
      } else if (sortBy === 'name') {
        query = query.order('company_name', { ascending: sortOrder === 'asc' });
      } else if (sortBy === 'recent') {
        query = query.order('created_at', { ascending: sortOrder === 'asc' });
      }

      // Apply pagination
      const limit = filters.limit || 20;
      const offset = filters.offset || 0;
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      // Fetch asset and SBOM data for all vendors in parallel
      const vendorIds = (data || []).map((v: any) => v.id);
      
      // Get asset relationships for all vendors
      // Note: asset relationships link to vs_vendors, not vs_vendor_profiles
      // For now, we'll show 0 as asset relationships are organization-specific
      const allAssetRelationships: any[] = [];

      // Get SBOM analyses for all vendors
      // Handle case where vendor_id column might not exist yet
      let allSbomAnalyses: any[] = [];
      try {
        const { data, error } = await supabase
          .from('vs_sbom_analyses')
          .select('vendor_id, risk_score')
          .in('vendor_id', vendorIds);
        
        if (!error && data) {
          allSbomAnalyses = data;
        }
      } catch (err) {
        // Column might not exist yet, ignore error
        logger.warn('SBOM vendor_id column might not exist yet:', err);
      }

      // Group asset relationships by vendor
      const assetRelationshipsByVendor: Record<string, any[]> = {};
      allAssetRelationships?.forEach((rel: any) => {
        if (!assetRelationshipsByVendor[rel.vendor_id]) {
          assetRelationshipsByVendor[rel.vendor_id] = [];
        }
        assetRelationshipsByVendor[rel.vendor_id].push(rel);
      });

      // Group SBOM analyses by vendor
      const sbomAnalysesByVendor: Record<string, any[]> = {};
      allSbomAnalyses?.forEach((sbom: any) => {
        if (!sbomAnalysesByVendor[sbom.vendor_id]) {
          sbomAnalysesByVendor[sbom.vendor_id] = [];
        }
        sbomAnalysesByVendor[sbom.vendor_id].push(sbom);
      });

      // Transform data to include rating, asset, and SBOM information
      const vendors: PublicVendorProfile[] = (data || []).map((vendor: any) => {
        const assetRelationships = assetRelationshipsByVendor[vendor.id] || [];
        const assetCount = assetRelationships.length;
        const criticalAssetsCount = assetRelationships.filter(
          (rel: any) => rel.asset?.criticality_level === 'critical'
        ).length;

        const sbomAnalyses = sbomAnalysesByVendor[vendor.id] || [];
        const sbomCount = sbomAnalyses.length;
        const avgSbomRiskScore = sbomCount > 0
          ? sbomAnalyses.reduce((sum: number, sbom: any) => sum + (sbom.risk_score || 100), 0) / sbomCount
          : undefined;

        // Determine SBOM compliance status
        let sbomComplianceStatus: 'compliant' | 'non-compliant' | 'partial' | 'not-assessed' = 'not-assessed';
        if (sbomCount > 0 && avgSbomRiskScore !== undefined) {
          if (avgSbomRiskScore < 30) {
            sbomComplianceStatus = 'compliant';
          } else if (avgSbomRiskScore < 70) {
            sbomComplianceStatus = 'partial';
          } else {
            sbomComplianceStatus = 'non-compliant';
          }
        }

        return {
          id: vendor.id,
          company_name: vendor.company_name,
          legal_name: vendor.legal_name,
          website: vendor.website,
          industry: vendor.industry,
          company_size: vendor.company_size,
          headquarters: vendor.headquarters,
          description: vendor.description,
          logo_url: vendor.logo_url,
          service_types: vendor.service_types || [],
          data_types_accessed: vendor.data_types_accessed || [],
          vendor_rating: vendor.vendor_rating,
          security_posture_score: vendor.security_posture_score,
          rating: vendor.vs_vendor_ratings?.[0]
            ? {
                overall_rating: vendor.vs_vendor_ratings[0].overall_rating,
                assessment_score: vendor.vs_vendor_ratings[0].assessment_score,
                compliance_score: vendor.vs_vendor_ratings[0].compliance_score,
                response_time_score: vendor.vs_vendor_ratings[0].response_time_score,
                completion_rate: vendor.vs_vendor_ratings[0].completion_rate,
                security_posture_score: vendor.vs_vendor_ratings[0].security_posture_score,
              }
            : undefined,
          // Asset integration
          asset_count: assetCount,
          critical_assets_count: criticalAssetsCount,
          // SBOM integration
          sbom_compliance_status: sbomComplianceStatus,
          sbom_risk_score: avgSbomRiskScore,
          sbom_analyses_count: sbomCount,
          created_at: vendor.created_at,
        };
      });

      return {
        vendors,
        total: count || 0,
      };
    } catch (error) {
      logger.error('Error searching vendors:', error);
      throw error;
    }
  }

  /**
   * Get public vendor profile by ID
   */
  async getPublicVendorProfile(vendorId: string): Promise<PublicVendorProfile | null> {
    try {
      const { data, error } = await supabase
        .from('vs_vendor_profiles')
        .select('*, vs_vendor_ratings(*)')
        .eq('id', vendorId)
        .eq('is_public', true)
        .eq('directory_listing_enabled', true)
        .eq('status', 'approved')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        throw error;
      }

      if (!data) return null;

      // Fetch asset relationships (note: asset relationships link to vs_vendors, not vs_vendor_profiles)
      // For now, we'll show 0 as asset relationships are organization-specific
      // TODO: Create mapping between vs_vendors and vs_vendor_profiles to show asset relationships
      const assetCount = 0;
      const criticalAssetsCount = 0;

      // Fetch SBOM analyses (if vendor_id is linked)
      // Handle case where vendor_id column might not exist yet
      let sbomAnalyses: any[] = [];
      try {
        const { data, error } = await supabase
          .from('vs_sbom_analyses')
          .select('risk_score')
          .eq('vendor_id', vendorId)
          .order('created_at', { ascending: false });
        
        if (!error && data) {
          sbomAnalyses = data;
        }
      } catch (err) {
        // Column might not exist yet, ignore error
        logger.warn('SBOM vendor_id column might not exist yet:', err);
      }

      const sbomCount = sbomAnalyses?.length || 0;
      const avgSbomRiskScore = sbomAnalyses && sbomAnalyses.length > 0
        ? sbomAnalyses.reduce((sum: number, sbom: any) => sum + (sbom.risk_score || 100), 0) / sbomAnalyses.length
        : undefined;

      // Determine SBOM compliance status
      let sbomComplianceStatus: 'compliant' | 'non-compliant' | 'partial' | 'not-assessed' = 'not-assessed';
      if (sbomCount > 0 && avgSbomRiskScore !== undefined) {
        if (avgSbomRiskScore < 30) {
          sbomComplianceStatus = 'compliant';
        } else if (avgSbomRiskScore < 70) {
          sbomComplianceStatus = 'partial';
        } else {
          sbomComplianceStatus = 'non-compliant';
        }
      }

      return {
        id: data.id,
        company_name: data.company_name,
        legal_name: data.legal_name,
        website: data.website,
        industry: data.industry,
        company_size: data.company_size,
        headquarters: data.headquarters,
        description: data.description,
        logo_url: data.logo_url,
        service_types: data.service_types || [],
        data_types_accessed: data.data_types_accessed || [],
        vendor_rating: data.vendor_rating,
        security_posture_score: data.security_posture_score,
        rating: data.vs_vendor_ratings?.[0]
          ? {
              overall_rating: data.vs_vendor_ratings[0].overall_rating,
              assessment_score: data.vs_vendor_ratings[0].assessment_score,
              compliance_score: data.vs_vendor_ratings[0].compliance_score,
              response_time_score: data.vs_vendor_ratings[0].response_time_score,
              completion_rate: data.vs_vendor_ratings[0].completion_rate,
              security_posture_score: data.vs_vendor_ratings[0].security_posture_score,
            }
          : undefined,
        // Asset integration
        asset_count: assetCount,
        critical_assets_count: criticalAssetsCount,
        // SBOM integration
        sbom_compliance_status: sbomComplianceStatus,
        sbom_risk_score: avgSbomRiskScore,
        sbom_analyses_count: sbomCount,
        created_at: data.created_at,
      };
    } catch (error) {
      logger.error('Error fetching public vendor profile:', error);
      throw error;
    }
  }

  /**
   * Get vendor directory statistics
   */
  async getVendorDirectoryStats(): Promise<VendorDirectoryStats> {
    try {
      const { data: vendors, error } = await supabase
        .from('vs_vendor_profiles')
        .select('industry, service_types, vendor_rating')
        .eq('is_public', true)
        .eq('directory_listing_enabled', true)
        .eq('status', 'approved');

      if (error) throw error;

      if (!vendors || vendors.length === 0) {
        return {
          total_vendors: 0,
          by_industry: {},
          by_service_type: {},
          average_rating: 0,
          top_rated_count: 0,
        };
      }

      // Calculate statistics
      const byIndustry: Record<string, number> = {};
      const byServiceType: Record<string, number> = {};
      let totalRating = 0;
      let ratingCount = 0;
      let topRatedCount = 0;

      vendors.forEach((vendor) => {
        // Count by industry
        if (vendor.industry) {
          byIndustry[vendor.industry] = (byIndustry[vendor.industry] || 0) + 1;
        }

        // Count by service type
        if (vendor.service_types && Array.isArray(vendor.service_types)) {
          vendor.service_types.forEach((st: string) => {
            byServiceType[st] = (byServiceType[st] || 0) + 1;
          });
        }

        // Calculate average rating
        if (vendor.vendor_rating !== null && vendor.vendor_rating !== undefined) {
          totalRating += vendor.vendor_rating;
          ratingCount++;
          if (vendor.vendor_rating >= 80) {
            topRatedCount++;
          }
        }
      });

      const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0;

      return {
        total_vendors: vendors.length,
        by_industry: byIndustry,
        by_service_type: byServiceType,
        average_rating: Math.round(averageRating * 100) / 100,
        top_rated_count: topRatedCount,
      };
    } catch (error) {
      logger.error('Error fetching directory stats:', error);
      throw error;
    }
  }

  /**
   * Request assessment from directory vendor
   */
  async requestAssessmentFromDirectory(
    vendorId: string,
    organizationId: string,
    frameworkId: string,
    assessmentName: string,
    dueDate?: string,
    customMessage?: string
  ): Promise<string> {
    try {
      // Verify vendor is in directory
      const { data: vendor, error: vendorError } = await supabase
        .from('vs_vendor_profiles')
        .select('id, company_name, contact_email')
        .eq('id', vendorId)
        .eq('is_public', true)
        .eq('directory_listing_enabled', true)
        .eq('status', 'approved')
        .single();

      if (vendorError) throw vendorError;
      if (!vendor) {
        throw new Error('Vendor not found in directory');
      }

      // Create vendor record in vs_vendors if it doesn't exist
      let { data: existingVendor } = await supabase
        .from('vs_vendors')
        .select('id')
        .eq('user_id', organizationId)
        .eq('name', vendor.company_name)
        .single();

      let vendorRecordId: string;

      if (!existingVendor) {
        // Create new vendor record
        const { data: newVendor, error: createError } = await supabase
          .from('vs_vendors')
          .insert({
            user_id: organizationId,
            name: vendor.company_name,
            contact_email: vendor.contact_email || undefined,
            industry: vendor.industry || undefined,
          })
          .select('id')
          .single();

        if (createError) throw createError;
        vendorRecordId = newVendor.id;
      } else {
        vendorRecordId = existingVendor.id;
      }

      // Create assessment
      const { data: assessment, error: assessmentError } = await supabase
        .from('vs_vendor_assessments')
        .insert({
          user_id: organizationId,
          vendor_id: vendorRecordId,
          framework_id: frameworkId,
          assessment_name: assessmentName,
          status: 'pending',
          due_date: dueDate || undefined,
          custom_message: customMessage || undefined,
          contact_email: vendor.contact_email || undefined,
        })
        .select('id')
        .single();

      if (assessmentError) throw assessmentError;

      return assessment.id;
    } catch (error) {
      logger.error('Error requesting assessment from directory:', error);
      throw error;
    }
  }
}

export const vendorDirectoryService = new VendorDirectoryService();

