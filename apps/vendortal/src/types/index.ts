import React from 'react';

// Database types
export interface Database {
  public: {
    Tables: {
      vendors: {
        Row: Vendor;
        Insert: Omit<Vendor, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Vendor, 'id'>>;
      };
      sbom_analyses: {
        Row: SBOMAnalysis;
        Insert: Omit<SBOMAnalysis, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SBOMAnalysis, 'id'>>;
      };
      supply_chain_assessments: {
        Row: SupplyChainAssessment;
        Insert: Omit<SupplyChainAssessment, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SupplyChainAssessment, 'id'>>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id'>>;
      };
      assets: {
        Row: Asset;
        Insert: Omit<Asset, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Asset, 'id'>>;
      };
      asset_vendor_relationships: {
        Row: AssetVendorRelationship;
        Insert: Omit<AssetVendorRelationship, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<AssetVendorRelationship, 'id'>>;
      };
      vendor_assessments: {
        Row: VendorAssessment;
        Insert: Omit<VendorAssessment, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<VendorAssessment, 'id'>>;
      };
      due_diligence_requirements: {
        Row: DueDiligenceRequirement;
        Insert: Omit<DueDiligenceRequirement, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DueDiligenceRequirement, 'id'>>;
      };
    };
  };
}

// Core entity types
export interface Vendor {
  id: string;
  user_id: string;
  name: string;
  industry?: string;
  website?: string;
  contact_email?: string;
  risk_score?: number;
  risk_level?: 'Low' | 'Medium' | 'High' | 'Critical';
  compliance_status?: 'Compliant' | 'Partial' | 'Non-Compliant';
  last_assessment_date?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SBOMAnalysis {
  id: string;
  user_id: string;
  filename: string;
  file_type: string;
  total_components: number;
  total_vulnerabilities: number;
  risk_score?: number;
  analysis_data?: any;
  created_at?: string;
  updated_at?: string;
}

export interface SupplyChainAssessment {
  id: string;
  user_id: string;
  assessment_name?: string;
  overall_score?: number;
  section_scores?: any;
  answers?: any;
  status: 'in_progress' | 'completed' | 'archived';
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
  vendor_id?: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  company?: string;
  role?: string;
  company_size?: string;
  industry?: string;
  tour_completed?: boolean;
  onboarding_completed?: boolean;
  onboarding_completed_at?: string;
  onboarding_data?: any;
  created_at?: string;
  updated_at?: string;
  is_first_login?: boolean;
}

// UI and component types
export interface VendorRisk {
  id: string;
  name: string;
  industry: string;
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  complianceStatus: 'Compliant' | 'Partial' | 'Non-Compliant';
  lastAssessment: string;
}

export interface NISTControl {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Not Started' | 'In Progress' | 'Complete';
  evidence?: string;
  notes?: string;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
  lastModified: string;
  type: 'nist' | 'cmmc' | 'custom';
}

export interface QuickTool {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  category: 'assessment' | 'analysis' | 'reporting' | 'compliance';
}

// Navigation types
export interface MenuItem {
  title: string;
  path: string;
  icon?: string;
  children?: MenuItem[];
}

// Form types
export interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  topic?: string;
  message: string;
}

// Analytics and reporting types
export interface RiskMetrics {
  totalVendors: number;
  highRiskVendors: number;
  complianceRate: number;
  averageRiskScore: number;
  trendsData: {
    month: string;
    riskScore: number;
    compliance: number;
  }[];
}

export interface SBOMComponent {
  name: string;
  version: string;
  licenses: string[];
  vulnerabilities: Vulnerability[];
  riskScore: number;
}

export interface Vulnerability {
  id: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  cvssScore?: number;
  fixAvailable: boolean;
  exploitAvailable: boolean;
}

// Assessment framework types
export interface AssessmentFramework {
  id: string;
  name: string;
  description?: string;
  version?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FrameworkQuestion {
  id: string;
  framework_id: string;
  question_text: string;
  control_id?: string;
  guidance?: string;
  question_type: string;
  options?: any;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export interface VendorAssessment {
  id: string;
  user_id: string;
  vendor_id: string;
  framework_id: string;
  assessment_name: string;
  status: 'pending' | 'sent' | 'in_progress' | 'completed' | 'reviewed';
  due_date?: string;
  sent_at?: string;
  completed_at?: string;
  overall_score?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface VendorAssessmentResponse {
  id: string;
  vendor_assessment_id: string;
  question_id: string;
  response_value?: string;
  evidence_url?: string;
  vendor_notes?: string;
  submitted_at?: string;
  created_at?: string;
  updated_at?: string;
}

// Asset Inventory Types
export interface Asset {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  asset_type: 'software' | 'hardware' | 'service' | 'data' | 'infrastructure' | 'third_party';
  category: string;
  criticality_level: 'low' | 'medium' | 'high' | 'critical';
  business_impact: 'low' | 'medium' | 'high' | 'critical';
  data_classification: 'public' | 'internal' | 'confidential' | 'restricted';
  location?: string;
  owner: string;
  custodian: string;
  status: 'active' | 'inactive' | 'deprecated' | 'under_review';
  version?: string;
  vendor_id?: string;
  cost?: number;
  acquisition_date?: string;
  end_of_life_date?: string;
  compliance_requirements: string[];
  security_controls: string[];
  risk_score?: number;
  last_assessment_date?: string;
  next_assessment_due?: string;
  tags: string[];
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface AssetVendorRelationship {
  id: string;
  asset_id: string;
  vendor_id: string;
  relationship_type: 'primary_vendor' | 'secondary_vendor' | 'support_vendor' | 'licensing_vendor' | 'maintenance_vendor';
  contract_id?: string;
  contract_start_date?: string;
  contract_end_date?: string;
  service_level_agreement?: string;
  criticality_to_asset: 'low' | 'medium' | 'high' | 'critical';
  data_access_level: 'none' | 'read_only' | 'read_write' | 'full_access';
  integration_type: 'api' | 'database' | 'file_transfer' | 'web_service' | 'direct_access' | 'cloud_service';
  security_requirements: string[];
  compliance_requirements: string[];
  risk_factors: string[];
  mitigation_controls: string[];
  last_review_date?: string;
  next_review_due?: string;
  status: 'active' | 'inactive' | 'under_review' | 'terminated';
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DueDiligenceRequirement {
  id: string;
  asset_id: string;
  vendor_id: string;
  requirement_type: 'security_assessment' | 'compliance_certification' | 'financial_review' | 'legal_review' | 'operational_review';
  framework: 'nist' | 'cmmc' | 'iso27001' | 'soc2' | 'pci_dss' | 'custom';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue' | 'cancelled';
  due_date: string;
  assigned_to?: string;
  description: string;
  requirements: string[];
  evidence_required: string[];
  assessment_criteria: string[];
  auto_trigger_conditions: string[];
  escalation_rules: string[];
  completion_criteria: string[];
  risk_impact_if_not_met: string;
  created_at?: string;
  updated_at?: string;
}

// Enhanced Vendor Types with Asset Integration
export interface VendorWithAssets extends Vendor {
  assets: Asset[];
  asset_relationships: AssetVendorRelationship[];
  due_diligence_requirements: DueDiligenceRequirement[];
  overall_risk_score: number;
  critical_assets_count: number;
  high_risk_relationships_count: number;
  overdue_assessments_count: number;
}

export interface AssetWithVendors extends Asset {
  vendors: Vendor[];
  vendor_relationships: AssetVendorRelationship[];
  due_diligence_requirements: DueDiligenceRequirement[];
  overall_vendor_risk_score: number;
  primary_vendor?: Vendor;
  critical_vendor_relationships: AssetVendorRelationship[];
}

// Risk Assessment and Scoring Types
export interface RiskAssessment {
  id: string;
  asset_id?: string;
  vendor_id?: string;
  relationship_id?: string;
  assessment_type: 'asset_risk' | 'vendor_risk' | 'relationship_risk' | 'combined_risk';
  risk_factors: RiskFactor[];
  calculated_score: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  mitigation_recommendations: string[];
  next_assessment_due: string;
  assessed_by: string;
  assessment_date: string;
  status: 'draft' | 'pending_review' | 'approved' | 'rejected';
  created_at?: string;
  updated_at?: string;
}

export interface RiskFactor {
  id: string;
  name: string;
  category: 'security' | 'compliance' | 'operational' | 'financial' | 'reputational';
  weight: number;
  score: number;
  description: string;
  evidence: string[];
  mitigation_controls: string[];
}

// Dashboard and Analytics Types
export interface VendorRiskDashboard {
  total_vendors: number;
  high_risk_vendors: number;
  critical_assets_count: number;
  overdue_assessments: number;
  upcoming_renewals: number;
  risk_trends: RiskTrend[];
  vendor_risk_distribution: RiskDistribution[];
  asset_vendor_matrix: AssetVendorMatrix[];
  recent_assessments: RecentAssessment[];
  alerts: Alert[];
}

export interface RiskTrend {
  period: string;
  average_risk_score: number;
  high_risk_count: number;
  critical_risk_count: number;
}

export interface RiskDistribution {
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  count: number;
  percentage: number;
}

export interface AssetVendorMatrix {
  asset_id: string;
  asset_name: string;
  asset_criticality: string;
  vendor_id: string;
  vendor_name: string;
  vendor_risk_score: number;
  relationship_criticality: string;
  overall_risk_score: number;
  status: string;
}

export interface RecentAssessment {
  id: string;
  type: 'vendor' | 'asset' | 'relationship';
  name: string;
  risk_score: number;
  risk_level: string;
  assessment_date: string;
  status: string;
}

export interface Alert {
  id: string;
  type: 'overdue_assessment' | 'high_risk_detected' | 'contract_expiring' | 'compliance_violation' | 'security_incident';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  asset_id?: string;
  vendor_id?: string;
  relationship_id?: string;
  created_at: string;
  acknowledged: boolean;
  resolved: boolean;
}

// Workflow and Automation Types
export interface AssessmentWorkflow {
  id: string;
  name: string;
  description: string;
  trigger_conditions: WorkflowTrigger[];
  steps: WorkflowStep[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface WorkflowTrigger {
  id: string;
  type: 'asset_created' | 'vendor_added' | 'contract_expiring' | 'risk_threshold_exceeded' | 'assessment_overdue';
  conditions: Record<string, any>;
  enabled: boolean;
}

export interface WorkflowStep {
  id: string;
  step_type: 'create_assessment' | 'send_notification' | 'assign_task' | 'escalate' | 'approve' | 'reject';
  name: string;
  description: string;
  order: number;
  parameters: Record<string, any>;
  conditions?: Record<string, any>;
  timeout_hours?: number;
  assignee?: string;
  notifications: NotificationConfig[];
}

export interface NotificationConfig {
  type: 'email' | 'slack' | 'teams' | 'webhook';
  recipients: string[];
  template: string;
  conditions?: Record<string, any>;
}
