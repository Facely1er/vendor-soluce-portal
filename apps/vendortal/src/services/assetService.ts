import { logger } from '../utils/logger';
import { supabase } from '../lib/supabase';
import { 
  Asset, 
  AssetVendorRelationship, 
  DueDiligenceRequirement, 
  RiskAssessment, 
  RiskFactor,
  AssetWithVendors,
  VendorWithAssets,
  Alert
} from '../types';

class AssetService {
  // Asset Management
  async createAsset(assetData: Omit<Asset, 'id' | 'created_at' | 'updated_at'>): Promise<Asset> {
    const { data, error } = await supabase
      .from('vs_assets')
      .insert([assetData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getAsset(assetId: string): Promise<Asset | null> {
    const { data, error } = await supabase
      .from('vs_assets')
      .select('*')
      .eq('id', assetId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }

  async getAssets(userId: string): Promise<Asset[]> {
    const { data, error } = await supabase
      .from('vs_assets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async updateAsset(assetId: string, updates: Partial<Asset>): Promise<Asset> {
    const { data, error } = await supabase
      .from('vs_assets')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', assetId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteAsset(assetId: string): Promise<void> {
    const { error } = await supabase
      .from('vs_assets')
      .delete()
      .eq('id', assetId);

    if (error) throw error;
  }

  // Asset-Vendor Relationships
  async createAssetVendorRelationship(relationshipData: Omit<AssetVendorRelationship, 'id' | 'created_at' | 'updated_at'>): Promise<AssetVendorRelationship> {
    const { data, error } = await supabase
      .from('vs_asset_vendor_relationships')
      .insert([relationshipData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getAssetVendorRelationships(assetId: string): Promise<AssetVendorRelationship[]> {
    const { data, error } = await supabase
      .from('vs_asset_vendor_relationships')
      .select('*')
      .eq('asset_id', assetId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getVendorAssetRelationships(vendorId: string): Promise<AssetVendorRelationship[]> {
    const { data, error } = await supabase
      .from('vs_asset_vendor_relationships')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async updateAssetVendorRelationship(relationshipId: string, updates: Partial<AssetVendorRelationship>): Promise<AssetVendorRelationship> {
    const { data, error } = await supabase
      .from('vs_asset_vendor_relationships')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', relationshipId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteAssetVendorRelationship(relationshipId: string): Promise<void> {
    const { error } = await supabase
      .from('vs_asset_vendor_relationships')
      .delete()
      .eq('id', relationshipId);

    if (error) throw error;
  }

  // Due Diligence Requirements
  async createDueDiligenceRequirement(requirementData: Omit<DueDiligenceRequirement, 'id' | 'created_at' | 'updated_at'>): Promise<DueDiligenceRequirement> {
    const { data, error } = await supabase
      .from('vs_due_diligence_requirements')
      .insert([requirementData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getDueDiligenceRequirements(assetId?: string, vendorId?: string): Promise<DueDiligenceRequirement[]> {
    let query = supabase
      .from('vs_due_diligence_requirements')
      .select('*');

    if (assetId) {
      query = query.eq('asset_id', assetId);
    }
    if (vendorId) {
      query = query.eq('vendor_id', vendorId);
    }

    const { data, error } = await query.order('due_date', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async updateDueDiligenceRequirement(requirementId: string, updates: Partial<DueDiligenceRequirement>): Promise<DueDiligenceRequirement> {
    const { data, error } = await supabase
      .from('vs_due_diligence_requirements')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', requirementId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteDueDiligenceRequirement(requirementId: string): Promise<void> {
    const { error } = await supabase
      .from('vs_due_diligence_requirements')
      .delete()
      .eq('id', requirementId);

    if (error) throw error;
  }

  // Risk Assessments
  async createRiskAssessment(assessmentData: Omit<RiskAssessment, 'id' | 'created_at' | 'updated_at'>): Promise<RiskAssessment> {
    const { data, error } = await supabase
      .from('vs_risk_assessments')
      .insert([assessmentData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getRiskAssessments(assetId?: string, vendorId?: string, relationshipId?: string): Promise<RiskAssessment[]> {
    let query = supabase
      .from('vs_risk_assessments')
      .select('*');

    if (assetId) {
      query = query.eq('asset_id', assetId);
    }
    if (vendorId) {
      query = query.eq('vendor_id', vendorId);
    }
    if (relationshipId) {
      query = query.eq('relationship_id', relationshipId);
    }

    const { data, error } = await query.order('assessment_date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async updateRiskAssessment(assessmentId: string, updates: Partial<RiskAssessment>): Promise<RiskAssessment> {
    const { data, error } = await supabase
      .from('vs_risk_assessments')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', assessmentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Risk Factors
  async createRiskFactor(factorData: Omit<RiskFactor, 'id' | 'created_at' | 'updated_at'>): Promise<RiskFactor> {
    const { data, error } = await supabase
      .from('vs_risk_factors')
      .insert([factorData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getRiskFactors(assessmentId: string): Promise<RiskFactor[]> {
    const { data, error } = await supabase
      .from('vs_risk_factors')
      .select('*')
      .eq('risk_assessment_id', assessmentId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async updateRiskFactor(factorId: string, updates: Partial<RiskFactor>): Promise<RiskFactor> {
    const { data, error } = await supabase
      .from('vs_risk_factors')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', factorId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Enhanced Queries with Relationships
  async getAssetWithVendors(assetId: string): Promise<AssetWithVendors | null> {
    const { data: asset, error: assetError } = await supabase
      .from('vs_assets')
      .select('*')
      .eq('id', assetId)
      .single();

    if (assetError) {
      if (assetError.code === 'PGRST116') return null;
      throw assetError;
    }

    // Get vendor relationships
    const { data: relationships, error: relError } = await supabase
      .from('vs_asset_vendor_relationships')
      .select(`
        *,
        vendors:vendor_id (
          id, name, industry, risk_score, compliance_status
        )
      `)
      .eq('asset_id', assetId);

    if (relError) throw relError;

    // Get due diligence requirements
    const { data: requirements, error: reqError } = await supabase
      .from('vs_due_diligence_requirements')
      .select('*')
      .eq('asset_id', assetId);

    if (reqError) throw reqError;

    // Calculate overall vendor risk score
    const vendorRiskScores = relationships?.map(r => r.vendors?.risk_score).filter(Boolean) || [];
    const overallVendorRiskScore = vendorRiskScores.length > 0 
      ? vendorRiskScores.reduce((sum, score) => sum + score, 0) / vendorRiskScores.length 
      : 0;

    return {
      ...asset,
      vendors: relationships?.map(r => r.vendors).filter(Boolean) || [],
      vendor_relationships: relationships || [],
      due_diligence_requirements: requirements || [],
      overall_vendor_risk_score: Math.round(overallVendorRiskScore),
      primary_vendor: relationships?.find(r => r.relationship_type === 'primary_vendor')?.vendors,
      critical_vendor_relationships: relationships?.filter(r => r.criticality_to_asset === 'critical') || []
    };
  }

  async getVendorWithAssets(vendorId: string): Promise<VendorWithAssets | null> {
    const { data: vendor, error: vendorError } = await supabase
      .from('vs_vendors')
      .select('*')
      .eq('id', vendorId)
      .single();

    if (vendorError) {
      if (vendorError.code === 'PGRST116') return null;
      throw vendorError;
    }

    // Get asset relationships
    const { data: relationships, error: relError } = await supabase
      .from('vs_asset_vendor_relationships')
      .select(`
        *,
        assets:asset_id (
          id, name, asset_type, criticality_level, business_impact, risk_score
        )
      `)
      .eq('vendor_id', vendorId);

    if (relError) throw relError;

    // Get due diligence requirements
    const { data: requirements, error: reqError } = await supabase
      .from('vs_due_diligence_requirements')
      .select('*')
      .eq('vendor_id', vendorId);

    if (reqError) throw reqError;

    // Calculate metrics
    const assets = relationships?.map(r => r.assets).filter(Boolean) || [];
    const criticalAssetsCount = assets.filter(a => a.criticality_level === 'critical').length;
    const highRiskRelationshipsCount = relationships?.filter(r => r.criticality_to_asset === 'high' || r.criticality_to_asset === 'critical').length || 0;
    const overdueAssessmentsCount = requirements?.filter(r => new Date(r.due_date) < new Date() && r.status !== 'completed').length || 0;

    // Calculate overall risk score
    const assetRiskScores = assets.map(a => a.risk_score).filter(Boolean);
    const relationshipRiskScores = relationships?.map(r => {
      // Simple risk calculation based on criticality and data access
      let score = 0;
      if (r.criticality_to_asset === 'critical') score += 40;
      else if (r.criticality_to_asset === 'high') score += 30;
      else if (r.criticality_to_asset === 'medium') score += 20;
      else score += 10;

      if (r.data_access_level === 'full_access') score += 30;
      else if (r.data_access_level === 'read_write') score += 20;
      else if (r.data_access_level === 'read_only') score += 10;

      return score;
    }) || [];

    const allRiskScores = [...assetRiskScores, ...relationshipRiskScores, vendor.risk_score || 0];
    const overallRiskScore = allRiskScores.length > 0 
      ? allRiskScores.reduce((sum, score) => sum + score, 0) / allRiskScores.length 
      : 0;

    return {
      ...vendor,
      assets,
      asset_relationships: relationships || [],
      due_diligence_requirements: requirements || [],
      overall_risk_score: Math.round(overallRiskScore),
      critical_assets_count: criticalAssetsCount,
      high_risk_relationships_count: highRiskRelationshipsCount,
      overdue_assessments_count: overdueAssessmentsCount
    };
  }

  // Risk Scoring Engine
  async calculateAssetRiskScore(assetId: string): Promise<number> {
    const asset = await this.getAsset(assetId);
    if (!asset) return 0;

    let score = 0;

    // Base score from criticality level
    switch (asset.criticality_level) {
      case 'critical': score += 40; break;
      case 'high': score += 30; break;
      case 'medium': score += 20; break;
      case 'low': score += 10; break;
    }

    // Business impact factor
    switch (asset.business_impact) {
      case 'critical': score += 30; break;
      case 'high': score += 20; break;
      case 'medium': score += 10; break;
      case 'low': score += 5; break;
    }

    // Data classification factor
    switch (asset.data_classification) {
      case 'restricted': score += 20; break;
      case 'confidential': score += 15; break;
      case 'internal': score += 10; break;
      case 'public': score += 5; break;
    }

    // Vendor risk factor
    if (asset.vendor_id) {
      const relationships = await this.getAssetVendorRelationships(assetId);
      const vendorRiskScores = relationships.map(r => {
        let vendorScore = 0;
        if (r.criticality_to_asset === 'critical') vendorScore += 20;
        else if (r.criticality_to_asset === 'high') vendorScore += 15;
        else if (r.criticality_to_asset === 'medium') vendorScore += 10;
        else vendorScore += 5;

        if (r.data_access_level === 'full_access') vendorScore += 15;
        else if (r.data_access_level === 'read_write') vendorScore += 10;
        else if (r.data_access_level === 'read_only') vendorScore += 5;

        return vendorScore;
      });

      if (vendorRiskScores.length > 0) {
        score += vendorRiskScores.reduce((sum, s) => sum + s, 0) / vendorRiskScores.length;
      }
    }

    return Math.min(Math.round(score), 100);
  }

  async calculateVendorRiskScore(vendorId: string): Promise<number> {
    const relationships = await this.getVendorAssetRelationships(vendorId);
    if (relationships.length === 0) return 0;

    let totalScore = 0;
    let totalWeight = 0;

    for (const relationship of relationships) {
      const asset = await this.getAsset(relationship.asset_id);
      if (!asset) continue;

      // Weight based on asset criticality
      let weight = 1;
      switch (asset.criticality_level) {
        case 'critical': weight = 4; break;
        case 'high': weight = 3; break;
        case 'medium': weight = 2; break;
        case 'low': weight = 1; break;
      }

      // Calculate relationship risk
      let relationshipScore = 0;
      if (relationship.criticality_to_asset === 'critical') relationshipScore += 40;
      else if (relationship.criticality_to_asset === 'high') relationshipScore += 30;
      else if (relationship.criticality_to_asset === 'medium') relationshipScore += 20;
      else relationshipScore += 10;

      if (relationship.data_access_level === 'full_access') relationshipScore += 30;
      else if (relationship.data_access_level === 'read_write') relationshipScore += 20;
      else if (relationship.data_access_level === 'read_only') relationshipScore += 10;

      totalScore += relationshipScore * weight;
      totalWeight += weight;
    }

    return totalWeight > 0 ? Math.min(Math.round(totalScore / totalWeight), 100) : 0;
  }

  // Alerts Management
  async createAlert(alertData: Omit<Alert, 'id' | 'created_at' | 'updated_at'>): Promise<Alert> {
    const { data, error } = await supabase
      .from('vs_alerts')
      .insert([alertData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getAlerts(userId: string): Promise<Alert[]> {
    const { data, error } = await supabase
      .from('vs_alerts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async updateAlert(alertId: string, updates: Partial<Alert>): Promise<Alert> {
    const { data, error } = await supabase
      .from('vs_alerts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', alertId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Analytics and Reporting
  async getAssetAnalytics(userId: string): Promise<{
    totalAssets: number;
    criticalAssets: number;
    highRiskAssets: number;
    assetsByType: Record<string, number>;
    assetsByCriticality: Record<string, number>;
    averageRiskScore: number;
    overdueAssessments: number;
  }> {
    const assets = await this.getAssets(userId);
    const requirements = await this.getDueDiligenceRequirements();

    const totalAssets = assets.length;
    const criticalAssets = assets.filter(a => a.criticality_level === 'critical').length;
    const highRiskAssets = assets.filter(a => (a.risk_score || 0) >= 70).length;
    
    const assetsByType = assets.reduce((acc, asset) => {
      acc[asset.asset_type] = (acc[asset.asset_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const assetsByCriticality = assets.reduce((acc, asset) => {
      acc[asset.criticality_level] = (acc[asset.criticality_level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const riskScores = assets.map(a => a.risk_score).filter(Boolean);
    const averageRiskScore = riskScores.length > 0 
      ? riskScores.reduce((sum, score) => sum + score, 0) / riskScores.length 
      : 0;

    const overdueAssessments = requirements.filter(r => 
      new Date(r.due_date) < new Date() && r.status !== 'completed'
    ).length;

    return {
      totalAssets,
      criticalAssets,
      highRiskAssets,
      assetsByType,
      assetsByCriticality,
      averageRiskScore: Math.round(averageRiskScore * 100) / 100,
      overdueAssessments
    };
  }

  // Automated Due Diligence Generation
  async generateDueDiligenceRequirements(assetId: string, vendorId: string): Promise<DueDiligenceRequirement[]> {
    const asset = await this.getAsset(assetId);
    const relationship = await this.getAssetVendorRelationships(assetId)
      .then(rels => rels.find(r => r.vendor_id === vendorId));

    if (!asset || !relationship) return [];

    const requirements: Omit<DueDiligenceRequirement, 'id' | 'created_at' | 'updated_at'>[] = [];

    // Security assessment requirement
    if (asset.criticality_level === 'critical' || relationship.criticality_to_asset === 'critical') {
      requirements.push({
        asset_id: assetId,
        vendor_id: vendorId,
        requirement_type: 'security_assessment',
        framework: 'nist',
        priority: 'critical',
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        description: `Annual security assessment required for critical asset ${asset.name}`,
        requirements: ['SOC 2 Type II', 'Penetration Testing', 'Security Questionnaire'],
        evidence_required: ['SOC 2 Report', 'Pen Test Results', 'Completed Questionnaire'],
        assessment_criteria: ['Score > 80%', 'No critical findings', 'All controls implemented'],
        auto_trigger_conditions: ['asset_criticality_critical', 'vendor_relationship_critical'],
        escalation_rules: ['escalate_after_7_days', 'notify_security_team'],
        completion_criteria: ['assessment_completed', 'score_acceptable', 'evidence_provided'],
        risk_impact_if_not_met: 'High risk of security breach and compliance violation'
      });
    }

    // Compliance certification requirement
    if (asset.compliance_requirements.length > 0) {
      requirements.push({
        asset_id: assetId,
        vendor_id: vendorId,
        requirement_type: 'compliance_certification',
        framework: 'custom',
        priority: asset.criticality_level === 'critical' ? 'critical' : 'high',
        due_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days
        description: `Compliance certification required for ${asset.compliance_requirements.join(', ')}`,
        requirements: asset.compliance_requirements,
        evidence_required: ['Compliance Certificates', 'Audit Reports', 'Policy Documents'],
        assessment_criteria: ['Certificates current', 'Audit passed', 'Policies implemented'],
        auto_trigger_conditions: ['compliance_requirements_present'],
        escalation_rules: ['escalate_after_14_days', 'notify_compliance_team'],
        completion_criteria: ['certificates_provided', 'audit_passed', 'policies_verified'],
        risk_impact_if_not_met: 'Compliance violation and potential regulatory penalties'
      });
    }

    // Financial review requirement
    if (asset.cost && asset.cost > 100000) { // High value assets
      requirements.push({
        asset_id: assetId,
        vendor_id: vendorId,
        requirement_type: 'financial_review',
        framework: 'custom',
        priority: 'high',
        due_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
        description: `Financial review required for high-value asset ${asset.name}`,
        requirements: ['Financial Statements', 'Credit Check', 'Insurance Verification'],
        evidence_required: ['Audited Financials', 'Credit Report', 'Insurance Certificate'],
        assessment_criteria: ['Financial stability', 'Credit rating acceptable', 'Insurance adequate'],
        auto_trigger_conditions: ['asset_cost_high'],
        escalation_rules: ['escalate_after_21_days', 'notify_finance_team'],
        completion_criteria: ['financials_reviewed', 'credit_acceptable', 'insurance_verified'],
        risk_impact_if_not_met: 'Financial risk and potential loss'
      });
    }

    // Create the requirements
    const createdRequirements: DueDiligenceRequirement[] = [];
    for (const req of requirements) {
      try {
        const created = await this.createDueDiligenceRequirement(req);
        createdRequirements.push(created);
      } catch (error) {
        logger.error('Error creating due diligence requirement:', error);
      }
    }

    return createdRequirements;
  }
}

export const assetService = new AssetService();