import { supabase } from '../lib/supabase';

export interface VendorProfile {
  id: string;
  company_name: string;
  legal_name: string;
  website?: string;
  industry: string;
  company_size: string;
  founded_year?: number;
  headquarters: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected' | 'under-review';
  risk_score?: number;
  compliance_status: 'compliant' | 'non-compliant' | 'partial';
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface VendorContact {
  id: string;
  vendor_id: string;
  type: 'primary' | 'security' | 'billing';
  name: string;
  title: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface VendorDocument {
  id: string;
  vendor_id: string;
  type: 'business_license' | 'insurance_certificate' | 'security_policy' | 'compliance_certificate' | 'financial_statement' | 'other';
  title: string;
  file_url: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  status: 'pending' | 'approved' | 'rejected';
  uploaded_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

export interface VendorAssessment {
  id: string;
  vendor_id: string;
  title: string;
  type: 'self-assessment' | 'guided-assessment' | 'third-party-audit' | 'hybrid';
  framework: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
  progress: number;
  score?: number;
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface VendorCertification {
  id: string;
  vendor_id: string;
  name: string;
  issuer: string;
  issued_date: string;
  expiry_date?: string;
  certificate_url?: string;
  status: 'active' | 'expired' | 'pending';
  created_at: string;
  updated_at: string;
}

class VendorService {
  // Vendor Profile Management
  async createVendorProfile(profileData: Partial<VendorProfile>): Promise<VendorProfile> {
    const { data, error } = await supabase
      .from('vs_vendor_profiles')
      .insert([profileData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getVendorProfile(vendorId: string): Promise<VendorProfile | null> {
    const { data, error } = await supabase
      .from('vs_vendor_profiles')
      .select('*')
      .eq('id', vendorId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }

  async getVendorProfileByUserId(userId: string): Promise<VendorProfile | null> {
    const { data, error } = await supabase
      .from('vs_vendor_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }

  async updateVendorProfile(vendorId: string, updates: Partial<VendorProfile>): Promise<VendorProfile> {
    const { data, error } = await supabase
      .from('vs_vendor_profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', vendorId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteVendorProfile(vendorId: string): Promise<void> {
    const { error } = await supabase
      .from('vs_vendor_profiles')
      .delete()
      .eq('id', vendorId);

    if (error) throw error;
  }

  // Vendor Contacts Management
  async createVendorContact(contactData: Omit<VendorContact, 'id' | 'created_at' | 'updated_at'>): Promise<VendorContact> {
    const { data, error } = await supabase
      .from('vs_vendor_contacts')
      .insert([contactData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getVendorContacts(vendorId: string): Promise<VendorContact[]> {
    const { data, error } = await supabase
      .from('vs_vendor_contacts')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('type', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async updateVendorContact(contactId: string, updates: Partial<VendorContact>): Promise<VendorContact> {
    const { data, error } = await supabase
      .from('vs_vendor_contacts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', contactId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteVendorContact(contactId: string): Promise<void> {
    const { error } = await supabase
      .from('vs_vendor_contacts')
      .delete()
      .eq('id', contactId);

    if (error) throw error;
  }

  // Vendor Documents Management
  async createVendorDocument(documentData: Omit<VendorDocument, 'id' | 'uploaded_at' | 'reviewed_at'>): Promise<VendorDocument> {
    const { data, error } = await supabase
      .from('vs_vendor_documents')
      .insert([documentData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getVendorDocuments(vendorId: string): Promise<VendorDocument[]> {
    const { data, error } = await supabase
      .from('vs_vendor_documents')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('uploaded_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async updateVendorDocument(documentId: string, updates: Partial<VendorDocument>): Promise<VendorDocument> {
    const { data, error } = await supabase
      .from('vs_vendor_documents')
      .update({ ...updates, reviewed_at: updates.status ? new Date().toISOString() : undefined })
      .eq('id', documentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteVendorDocument(documentId: string): Promise<void> {
    const { error } = await supabase
      .from('vs_vendor_documents')
      .delete()
      .eq('id', documentId);

    if (error) throw error;
  }

  // Vendor Assessments Management
  async createVendorAssessment(assessmentData: Omit<VendorAssessment, 'id' | 'created_at' | 'updated_at'>): Promise<VendorAssessment> {
    const { data, error } = await supabase
      .from('vs_vendor_assessments')
      .insert([assessmentData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getVendorAssessments(vendorId: string): Promise<VendorAssessment[]> {
    const { data, error } = await supabase
      .from('vs_vendor_assessments')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async updateVendorAssessment(assessmentId: string, updates: Partial<VendorAssessment>): Promise<VendorAssessment> {
    const { data, error } = await supabase
      .from('vs_vendor_assessments')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', assessmentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteVendorAssessment(assessmentId: string): Promise<void> {
    const { error } = await supabase
      .from('vs_vendor_assessments')
      .delete()
      .eq('id', assessmentId);

    if (error) throw error;
  }

  // Vendor Certifications Management
  async createVendorCertification(certificationData: Omit<VendorCertification, 'id' | 'created_at' | 'updated_at'>): Promise<VendorCertification> {
    const { data, error } = await supabase
      .from('vs_vendor_certifications')
      .insert([certificationData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getVendorCertifications(vendorId: string): Promise<VendorCertification[]> {
    const { data, error } = await supabase
      .from('vs_vendor_certifications')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('issued_date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async updateVendorCertification(certificationId: string, updates: Partial<VendorCertification>): Promise<VendorCertification> {
    const { data, error } = await supabase
      .from('vs_vendor_certifications')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', certificationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteVendorCertification(certificationId: string): Promise<void> {
    const { error } = await supabase
      .from('vs_vendor_certifications')
      .delete()
      .eq('id', certificationId);

    if (error) throw error;
  }

  // Verification and Status Management
  async verifyVendor(vendorId: string, status: 'approved' | 'rejected', notes?: string): Promise<VendorProfile> {
    const { data, error } = await supabase
      .from('vs_vendor_profiles')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', vendorId)
      .select()
      .single();

    if (error) throw error;

    // Log verification action
    await this.logVendorAction(vendorId, 'verification', {
      status,
      notes,
      timestamp: new Date().toISOString()
    });

    return data;
  }

  async updateRiskScore(vendorId: string, riskScore: number): Promise<VendorProfile> {
    const { data, error } = await supabase
      .from('vs_vendor_profiles')
      .update({ 
        risk_score: riskScore,
        updated_at: new Date().toISOString()
      })
      .eq('id', vendorId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateComplianceStatus(vendorId: string, complianceStatus: 'compliant' | 'non-compliant' | 'partial'): Promise<VendorProfile> {
    const { data, error } = await supabase
      .from('vs_vendor_profiles')
      .update({ 
        compliance_status: complianceStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', vendorId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Analytics and Reporting
  async getVendorStats(): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    averageRiskScore: number;
    complianceBreakdown: Record<string, number>;
  }> {
    const { data: profiles, error: profilesError } = await supabase
      .from('vs_vendor_profiles')
      .select('status, risk_score, compliance_status');

    if (profilesError) throw profilesError;

    const total = profiles.length;
    const pending = profiles.filter(p => p.status === 'pending').length;
    const approved = profiles.filter(p => p.status === 'approved').length;
    const rejected = profiles.filter(p => p.status === 'rejected').length;
    
    const riskScores = profiles.filter(p => p.risk_score !== null).map(p => p.risk_score);
    const averageRiskScore = riskScores.length > 0 
      ? riskScores.reduce((sum, score) => sum + score, 0) / riskScores.length 
      : 0;

    const complianceBreakdown = profiles.reduce((acc, profile) => {
      const status = profile.compliance_status || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      pending,
      approved,
      rejected,
      averageRiskScore: Math.round(averageRiskScore * 100) / 100,
      complianceBreakdown
    };
  }

  // Action Logging
  async logVendorAction(vendorId: string, action: string, metadata: Record<string, any>): Promise<void> {
    const { error } = await supabase
      .from('vs_vendor_action_logs')
      .insert([{
        vendor_id: vendorId,
        action,
        metadata,
        timestamp: new Date().toISOString()
      }]);

    if (error) throw error;
  }

  async getVendorActionLogs(vendorId: string): Promise<Array<{
    id: string;
    action: string;
    metadata: Record<string, any>;
    timestamp: string;
  }>> {
    const { data, error } = await supabase
      .from('vs_vendor_action_logs')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}

export const vendorService = new VendorService();