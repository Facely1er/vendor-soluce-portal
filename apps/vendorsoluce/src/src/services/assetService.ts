import { supabase } from '../lib/supabase';
import { 
  Asset, 
  AssetVendorRelationship, 
  DueDiligenceRequirement, 
  Alert,
  AssetWithVendors,
  Vendor 
} from '../types';
import { logger } from '../utils/logger';

/**
 * Asset Service
 * Handles all asset management operations including CRUD, vendor relationships, and due diligence
 */

// ============================================================================
// Constants
// ============================================================================

/** Risk score threshold for high-risk vendors */
const HIGH_RISK_THRESHOLD = 70;

/** Default risk score when vendor risk is unknown */
const DEFAULT_RISK_SCORE = 50;

/** Criticality weight multipliers for risk calculation */
const CRITICALITY_WEIGHTS = {
  low: 0.5,
  medium: 1.0,
  high: 1.5,
  critical: 2.0
} as const;

/** Data access level weight multipliers for risk calculation */
const ACCESS_WEIGHTS = {
  none: 0.5,
  read_only: 0.75,
  read_write: 1.25,
  full_access: 1.5
} as const;

// ============================================================================
// Asset CRUD Operations
// ============================================================================

/**
 * Get all assets for the current user
 * 
 * @param userId - The ID of the user to fetch assets for
 * @returns Promise resolving to an array of assets with vendor information
 * @throws Error if the database query fails
 */
export async function getAssets(userId: string): Promise<AssetWithVendors[]> {
  try {
    const { data, error } = await supabase
      .from('assets')
      .select(`
        *,
        asset_vendor_relationships (
          id,
          vendor_id,
          relationship_type,
          criticality_to_asset
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Enrich assets with vendor information
    const enrichedAssets = await Promise.all(
      (data || []).map(async (asset: any) => {
        const relationships = Array.isArray(asset.asset_vendor_relationships) 
          ? asset.asset_vendor_relationships 
          : [];
        const vendorIds = relationships
          .filter((r: any) => r && r.vendor_id)
          .map((r: any) => r.vendor_id);
        
        let vendors: Vendor[] = [];
        let high_risk_vendors = 0;

        if (vendorIds.length > 0) {
          const { data: vendorData, error: vendorError } = await supabase
            .from('vendors')
            .select('*')
            .in('id', vendorIds);
          
          if (vendorError) {
            logger.warn('Error fetching vendors for asset', { assetId: asset.id, error: vendorError });
          }
          
          vendors = Array.isArray(vendorData) ? vendorData : [];
          high_risk_vendors = vendors.filter(v => v && (v.risk_score ?? 0) >= HIGH_RISK_THRESHOLD).length;
        }

        return {
          ...asset,
          vendors,
          vendor_count: vendors.length,
          high_risk_vendors,
        };
      })
    );

    return enrichedAssets;
  } catch (error) {
    logger.error('Error fetching assets:', error);
    throw error;
  }
}

/**
 * Get a single asset by ID with full vendor relationships
 * 
 * @param assetId - The ID of the asset to fetch
 * @returns Promise resolving to the asset with vendor information
 * @throws Error if the asset is not found or the database query fails
 */
export async function getAssetById(assetId: string): Promise<AssetWithVendors> {
  try {
    const { data, error } = await supabase
      .from('assets')
      .select(`
        *,
        asset_vendor_relationships (
          id,
          vendor_id,
          relationship_type,
          criticality_to_asset,
          data_access_level,
          integration_type,
          contract_id,
          contract_start_date,
          contract_end_date,
          notes
        )
      `)
      .eq('id', assetId)
      .single();

    if (error) throw error;

    // Get vendor details
    const relationships = Array.isArray(data.asset_vendor_relationships) 
      ? data.asset_vendor_relationships 
      : [];
    const vendorIds = relationships
      .filter((r: any) => r && r.vendor_id)
      .map((r: any) => r.vendor_id);
    
    let vendors: Vendor[] = [];
    let high_risk_vendors = 0;

    if (vendorIds.length > 0) {
      const { data: vendorData, error: vendorError } = await supabase
        .from('vendors')
        .select('*')
        .in('id', vendorIds);
      
      if (vendorError) {
        logger.warn('Error fetching vendors for asset', { assetId, error: vendorError });
      }
      
      vendors = Array.isArray(vendorData) ? vendorData : [];
      high_risk_vendors = vendors.filter(v => v && (v.risk_score ?? 0) >= HIGH_RISK_THRESHOLD).length;
    }

    return {
      ...data,
      vendors,
      vendor_count: vendors.length,
      high_risk_vendors,
    };
  } catch (error) {
    logger.error('Error fetching asset:', error);
    throw error;
  }
}

/**
 * Create a new asset
 */
export async function createAsset(
  userId: string,
  asset: Omit<Asset, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<Asset> {
  try {
    const { data, error } = await supabase
      .from('assets')
      .insert([{ ...asset, user_id: userId }])
      .select()
      .single();

    if (error) throw error;

    logger.info('Asset created:', data.id);
    return data;
  } catch (error) {
    logger.error('Error creating asset:', error);
    throw error;
  }
}

/**
 * Update an asset
 */
export async function updateAsset(
  assetId: string,
  updates: Partial<Asset>
): Promise<Asset> {
  try {
    const { data, error } = await supabase
      .from('assets')
      .update(updates)
      .eq('id', assetId)
      .select()
      .single();

    if (error) throw error;

    logger.info('Asset updated:', assetId);
    return data;
  } catch (error) {
    logger.error('Error updating asset:', error);
    throw error;
  }
}

/**
 * Delete an asset
 */
export async function deleteAsset(assetId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('assets')
      .delete()
      .eq('id', assetId);

    if (error) throw error;

    logger.info('Asset deleted:', assetId);
  } catch (error) {
    logger.error('Error deleting asset:', error);
    throw error;
  }
}

// ============================================================================
// Asset-Vendor Relationship Operations
// ============================================================================

/**
 * Get all relationships for an asset
 */
export async function getAssetVendorRelationships(
  assetId: string
): Promise<AssetVendorRelationship[]> {
  try {
    const { data, error } = await supabase
      .from('asset_vendor_relationships')
      .select('*')
      .eq('asset_id', assetId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    logger.error('Error fetching asset-vendor relationships:', error);
    throw error;
  }
}

/**
 * Create an asset-vendor relationship
 */
export async function createAssetVendorRelationship(
  relationship: Omit<AssetVendorRelationship, 'id' | 'created_at' | 'updated_at'>
): Promise<AssetVendorRelationship> {
  try {
    const { data, error } = await supabase
      .from('asset_vendor_relationships')
      .insert([relationship])
      .select()
      .single();

    if (error) throw error;

    // Auto-generate due diligence requirements
    await generateDueDiligenceRequirements(relationship.asset_id, relationship.vendor_id);

    logger.info('Asset-vendor relationship created:', data.id);
    return data;
  } catch (error) {
    logger.error('Error creating asset-vendor relationship:', error);
    throw error;
  }
}

/**
 * Update an asset-vendor relationship
 */
export async function updateAssetVendorRelationship(
  relationshipId: string,
  updates: Partial<AssetVendorRelationship>
): Promise<AssetVendorRelationship> {
  try {
    const { data, error } = await supabase
      .from('asset_vendor_relationships')
      .update(updates)
      .eq('id', relationshipId)
      .select()
      .single();

    if (error) throw error;

    logger.info('Asset-vendor relationship updated:', relationshipId);
    return data;
  } catch (error) {
    logger.error('Error updating asset-vendor relationship:', error);
    throw error;
  }
}

/**
 * Delete an asset-vendor relationship
 */
export async function deleteAssetVendorRelationship(relationshipId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('asset_vendor_relationships')
      .delete()
      .eq('id', relationshipId);

    if (error) throw error;

    logger.info('Asset-vendor relationship deleted:', relationshipId);
  } catch (error) {
    logger.error('Error deleting asset-vendor relationship:', error);
    throw error;
  }
}

// ============================================================================
// Due Diligence Operations
// ============================================================================

/**
 * Generate due diligence requirements based on asset-vendor relationship
 */
async function generateDueDiligenceRequirements(
  assetId: string,
  vendorId: string
): Promise<void> {
  try {
    // Get asset details
    const { data: asset } = await supabase
      .from('assets')
      .select('*')
      .eq('id', assetId)
      .single();

    if (!asset) return;

    // Get relationship details
    const { data: relationship } = await supabase
      .from('asset_vendor_relationships')
      .select('*')
      .eq('asset_id', assetId)
      .eq('vendor_id', vendorId)
      .single();

    if (!relationship) return;

    const requirements: Omit<DueDiligenceRequirement, 'id' | 'created_at' | 'updated_at'>[] = [];

    // Generate requirements based on asset criticality and data classification
    if (asset.criticality_level === 'critical' || asset.criticality_level === 'high') {
      requirements.push({
        asset_id: assetId,
        vendor_id: vendorId,
        framework: 'nist',
        priority: 'high',
        description: 'NIST SP 800-161 Supply Chain Risk Assessment',
        requirements: [
          'Complete NIST C-SCRM assessment',
          'Provide supply chain risk management plan',
          'Document critical supplier dependencies'
        ],
        status: 'pending',
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days
      });
    }

    if (asset.data_classification === 'restricted' || asset.data_classification === 'confidential') {
      requirements.push({
        asset_id: assetId,
        vendor_id: vendorId,
        framework: 'soc2',
        priority: 'high',
        description: 'SOC 2 Type II Compliance Verification',
        requirements: [
          'Provide current SOC 2 Type II report',
          'Document data handling procedures',
          'Verify encryption standards'
        ],
        status: 'pending',
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    }

    if (relationship.data_access_level === 'full_access' || relationship.data_access_level === 'read_write') {
      requirements.push({
        asset_id: assetId,
        vendor_id: vendorId,
        framework: 'custom',
        priority: 'medium',
        description: 'Data Access Control Review',
        requirements: [
          'Document access control mechanisms',
          'Provide audit log capabilities',
          'Verify MFA implementation'
        ],
        status: 'pending',
        due_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 45 days
      });
    }

    // Insert all requirements
    if (requirements.length > 0) {
      const { error } = await supabase
        .from('due_diligence_requirements')
        .insert(requirements);

      if (error) throw error;

      logger.info('Generated due diligence requirements:', requirements.length);
    }
  } catch (error) {
    logger.error('Error generating due diligence requirements:', error);
    // Don't throw - this is a background operation
  }
}

/**
 * Get due diligence requirements for an asset-vendor relationship
 */
export async function getDueDiligenceRequirements(
  assetId: string,
  vendorId: string
): Promise<DueDiligenceRequirement[]> {
  try {
    const { data, error } = await supabase
      .from('due_diligence_requirements')
      .select('*')
      .eq('asset_id', assetId)
      .eq('vendor_id', vendorId)
      .order('priority', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    logger.error('Error fetching due diligence requirements:', error);
    throw error;
  }
}

/**
 * Update a due diligence requirement
 */
export async function updateDueDiligenceRequirement(
  requirementId: string,
  updates: Partial<DueDiligenceRequirement>
): Promise<DueDiligenceRequirement> {
  try {
    const { data, error } = await supabase
      .from('due_diligence_requirements')
      .update(updates)
      .eq('id', requirementId)
      .select()
      .single();

    if (error) throw error;

    logger.info('Due diligence requirement updated:', requirementId);
    return data;
  } catch (error) {
    logger.error('Error updating due diligence requirement:', error);
    throw error;
  }
}

// ============================================================================
// Alert Operations
// ============================================================================

/**
 * Get alerts for the current user
 */
export async function getAlerts(userId: string, resolved?: boolean): Promise<Alert[]> {
  try {
    let query = supabase
      .from('alerts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (resolved !== undefined) {
      query = query.eq('resolved', resolved);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data || [];
  } catch (error) {
    logger.error('Error fetching alerts:', error);
    throw error;
  }
}

/**
 * Create an alert
 */
export async function createAlert(
  alert: Omit<Alert, 'id' | 'created_at' | 'updated_at'>
): Promise<Alert> {
  try {
    const { data, error } = await supabase
      .from('alerts')
      .insert([alert])
      .select()
      .single();

    if (error) throw error;

    logger.info('Alert created:', data.id);
    return data;
  } catch (error) {
    logger.error('Error creating alert:', error);
    throw error;
  }
}

/**
 * Update an alert
 */
export async function updateAlert(
  alertId: string,
  updates: Partial<Alert>
): Promise<Alert> {
  try {
    const { data, error } = await supabase
      .from('alerts')
      .update(updates)
      .eq('id', alertId)
      .select()
      .single();

    if (error) throw error;

    logger.info('Alert updated:', alertId);
    return data;
  } catch (error) {
    logger.error('Error updating alert:', error);
    throw error;
  }
}

// ============================================================================
// Asset Analytics and Reporting
// ============================================================================

/**
 * Get asset statistics for dashboard
 */
export async function getAssetStatistics(userId: string) {
  try {
    const { data: assets, error } = await supabase
      .from('assets')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    const total = assets?.length || 0;
    const critical = assets?.filter(a => a.criticality_level === 'critical').length || 0;
    const high = assets?.filter(a => a.criticality_level === 'high').length || 0;
    const active = assets?.filter(a => a.status === 'active').length || 0;

    return {
      total,
      critical,
      high,
      active,
      byType: {
        software: assets?.filter(a => a.asset_type === 'software').length || 0,
        hardware: assets?.filter(a => a.asset_type === 'hardware').length || 0,
        service: assets?.filter(a => a.asset_type === 'service').length || 0,
        data: assets?.filter(a => a.asset_type === 'data').length || 0,
        infrastructure: assets?.filter(a => a.asset_type === 'infrastructure').length || 0,
        third_party: assets?.filter(a => a.asset_type === 'third_party').length || 0,
      },
      byCriticality: {
        low: assets?.filter(a => a.criticality_level === 'low').length || 0,
        medium: assets?.filter(a => a.criticality_level === 'medium').length || 0,
        high: high,
        critical: critical,
      }
    };
  } catch (error) {
    logger.error('Error fetching asset statistics:', error);
    throw error;
  }
}

/**
 * Calculate asset risk score based on vendor relationships
 * 
 * The risk score is calculated as a weighted average of vendor risk scores,
 * where weights are determined by:
 * - Criticality to asset (low: 0.5x, medium: 1.0x, high: 1.5x, critical: 2.0x)
 * - Data access level (none: 0.5x, read_only: 0.75x, read_write: 1.25x, full_access: 1.5x)
 * 
 * @param assetId - The ID of the asset to calculate risk for
 * @returns Promise resolving to the calculated risk score (0-100)
 */
export async function calculateAssetRiskScore(assetId: string): Promise<number> {
  try {
    // Get asset details
    const { data: asset } = await supabase
      .from('assets')
      .select('criticality_level, data_classification')
      .eq('id', assetId)
      .single();

    if (!asset) return 0;

    // Get vendor relationships
    const { data: relationships } = await supabase
      .from('asset_vendor_relationships')
      .select('vendor_id, criticality_to_asset, data_access_level')
      .eq('asset_id', assetId);

    if (!relationships || relationships.length === 0) return 0;

    // Get vendor risk scores
    const vendorIds = relationships.map(r => r.vendor_id);
    const { data: vendors } = await supabase
      .from('vendors')
      .select('id, risk_score')
      .in('id', vendorIds);

    // Calculate weighted risk score
    let totalRisk = 0;
    let totalWeight = 0;

    relationships.forEach(rel => {
      const vendor = vendors?.find(v => v.id === rel.vendor_id);
      const vendorRisk = vendor?.risk_score || DEFAULT_RISK_SCORE;

      // Weight based on criticality to asset
      const criticalityWeight = CRITICALITY_WEIGHTS[rel.criticality_to_asset as keyof typeof CRITICALITY_WEIGHTS] || 1.0;

      // Weight based on data access level
      const accessWeight = ACCESS_WEIGHTS[rel.data_access_level as keyof typeof ACCESS_WEIGHTS] || 1.0;

      const weight = criticalityWeight * accessWeight;
      totalRisk += vendorRisk * weight;
      totalWeight += weight;
    });

    const averageRisk = totalWeight > 0 ? totalRisk / totalWeight : 0;

    // Update asset risk score
    await updateAsset(assetId, { risk_score: Math.round(averageRisk) });

    return Math.round(averageRisk);
  } catch (error) {
    logger.error('Error calculating asset risk score:', error);
    return 0;
  }
}

// Export all functions
export const assetService = {
  // Assets
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  
  // Relationships
  getAssetVendorRelationships,
  createAssetVendorRelationship,
  updateAssetVendorRelationship,
  deleteAssetVendorRelationship,
  
  // Due Diligence
  getDueDiligenceRequirements,
  updateDueDiligenceRequirement,
  
  // Alerts
  getAlerts,
  createAlert,
  updateAlert,
  
  // Analytics
  getAssetStatistics,
  calculateAssetRiskScore,
};

