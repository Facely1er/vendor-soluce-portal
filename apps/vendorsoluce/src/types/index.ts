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
  subscription_tier?: string | null;
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

import React from 'react';

// Navigation types
export interface MenuItem {
  label: string;
  href: string;
  icon?: React.ElementType | string;
  description?: string;
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

// Asset Management types
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
  cost?: number;
  acquisition_date?: string;
  end_of_life_date?: string;
  compliance_requirements?: string[];
  security_controls?: string[];
  tags?: string[];
  risk_score?: number;
  metadata?: any;
  created_at?: string;
  updated_at?: string;
}

export interface AssetVendorRelationship {
  id: string;
  asset_id: string;
  vendor_id: string;
  relationship_type: 'primary_vendor' | 'secondary_vendor' | 'support_vendor' | 'licensing_vendor' | 'maintenance_vendor';
  criticality_to_asset: 'low' | 'medium' | 'high' | 'critical';
  data_access_level: 'none' | 'read_only' | 'read_write' | 'full_access';
  integration_type?: 'api' | 'database' | 'file_transfer' | 'web_service' | 'direct_access' | 'cloud_service';
  contract_id?: string;
  contract_start_date?: string;
  contract_end_date?: string;
  security_requirements?: string[];
  compliance_requirements?: string[];
  risk_factors?: string[];
  mitigation_controls?: string[];
  notes?: string;
  metadata?: any;
  created_at?: string;
  updated_at?: string;
}

export interface DueDiligenceRequirement {
  id: string;
  asset_id: string;
  vendor_id: string;
  framework: 'nist' | 'cmmc' | 'iso27001' | 'soc2' | 'gdpr' | 'hipaa' | 'custom';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  requirements: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  due_date: string;
  completed_date?: string;
  metadata?: any;
  created_at?: string;
  updated_at?: string;
}

export interface Alert {
  id: string;
  user_id: string;
  asset_id?: string;
  vendor_id?: string;
  type: 'overdue_assessment' | 'high_risk_relationship' | 'contract_expiring' | 'compliance_issue' | 'security_incident';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  resolved: boolean;
  acknowledged: boolean;
  metadata?: any;
  created_at?: string;
  updated_at?: string;
}

// Extended types with relationships
export interface AssetWithVendors extends Asset {
  vendors?: Vendor[];
  vendor_count?: number;
  high_risk_vendors?: number;
}

export interface VendorWithAssets extends Vendor {
  assets?: Asset[];
  asset_count?: number;
  critical_assets?: number;
  overall_risk_score?: number;
}