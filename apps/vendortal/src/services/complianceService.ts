import { logger } from '../utils/logger';
import { supabase } from '../lib/supabase';

interface ComplianceFramework {
  id: string;
  name: string;
  version: string;
  description: string;
  category: 'security' | 'privacy' | 'industry' | 'regulatory';
  controls: ComplianceControl[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ComplianceControl {
  id: string;
  framework_id: string;
  control_id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  requirements: string[];
  implementation_guidance: string[];
  testing_procedures: string[];
  evidence_requirements: string[];
  created_at: string;
  updated_at: string;
}

interface ComplianceAssessment {
  id: string;
  framework_id: string;
  vendor_id?: string;
  asset_id?: string;
  assessment_name: string;
  status: 'draft' | 'in_progress' | 'completed' | 'reviewed' | 'approved';
  overall_score: number;
  compliance_percentage: number;
  control_scores: Record<string, number>;
  gaps: ComplianceGap[];
  recommendations: ComplianceRecommendation[];
  assessor_id: string;
  assessment_date: string;
  due_date: string;
  created_at: string;
  updated_at: string;
}

interface ComplianceGap {
  id: string;
  control_id: string;
  gap_type: 'implementation' | 'documentation' | 'testing' | 'evidence';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  current_state: string;
  target_state: string;
  remediation_plan: string;
  estimated_effort: number; // hours
  estimated_cost: number;
  due_date: string;
  assigned_to?: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

interface ComplianceRecommendation {
  id: string;
  assessment_id: string;
  control_id: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  implementation_steps: string[];
  estimated_effort: number;
  estimated_cost: number;
  business_impact: string;
  risk_if_not_implemented: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed';
  assigned_to?: string;
  due_date: string;
  created_at: string;
  updated_at: string;
}

interface RemediationWorkflow {
  id: string;
  name: string;
  description: string;
  trigger_conditions: {
    gap_severity: string[];
    gap_types: string[];
    compliance_frameworks: string[];
  };
  steps: RemediationStep[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface RemediationStep {
  id: string;
  step_type: 'assign_task' | 'send_notification' | 'escalate' | 'approve' | 'create_ticket';
  name: string;
  description: string;
  order: number;
  parameters: Record<string, any>;
  conditions?: Record<string, any>;
  timeout_hours?: number;
  assignee_role?: string;
  notifications: NotificationConfig[];
}

interface AuditTrail {
  id: string;
  entity_type: 'assessment' | 'control' | 'gap' | 'recommendation' | 'workflow';
  entity_id: string;
  action: string;
  description: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  user_id: string;
  user_name: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

interface ComplianceDashboard {
  total_frameworks: number;
  active_assessments: number;
  completed_assessments: number;
  critical_gaps: number;
  high_priority_recommendations: number;
  compliance_trends: Array<{
    date: string;
    overall_compliance: number;
    framework_compliance: Record<string, number>;
  }>;
  recent_activities: AuditTrail[];
  upcoming_deadlines: Array<{
    type: 'assessment' | 'gap_remediation' | 'recommendation';
    title: string;
    due_date: string;
    priority: string;
  }>;
}

class ComplianceService {
  // Get compliance frameworks
  async getFrameworks(): Promise<ComplianceFramework[]> {
    const { data, error } = await supabase
      .from('vs_compliance_frameworks')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data || [];
  }

  // Get framework by ID
  async getFramework(frameworkId: string): Promise<ComplianceFramework | null> {
    const { data, error } = await supabase
      .from('vs_compliance_frameworks')
      .select(`
        *,
        controls:vs_compliance_controls(*)
      `)
      .eq('id', frameworkId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }

  // Create compliance assessment
  async createAssessment(assessmentData: Omit<ComplianceAssessment, 'id' | 'created_at' | 'updated_at'>): Promise<ComplianceAssessment> {
    const { data, error } = await supabase
      .from('vs_compliance_assessments')
      .insert(assessmentData)
      .select()
      .single();

    if (error) throw error;

    // Audit log for federal extended assessments
    try {
      await this.logAuditTrail({
        entity_type: 'assessment',
        entity_id: data.id,
        action: 'create',
        description: `Created compliance assessment ${data.assessment_name}`,
        new_values: data as any,
        user_id: assessmentData.assessor_id,
        user_name: 'system',
      });
    } catch {}

    return data;
  }

  // Get assessments
  async getAssessments(filters?: {
    framework_id?: string;
    vendor_id?: string;
    asset_id?: string;
    status?: string;
  }): Promise<ComplianceAssessment[]> {
    let query = supabase
      .from('vs_compliance_assessments')
      .select(`
        *,
        framework:vs_compliance_frameworks(*),
        vendor:vs_vendors(*),
        asset:vs_assets(*)
      `)
      .order('created_at', { ascending: false });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) query = query.eq(key, value);
      });
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // Get assessment by ID
  async getAssessment(assessmentId: string): Promise<ComplianceAssessment | null> {
    const { data, error } = await supabase
      .from('vs_compliance_assessments')
      .select(`
        *,
        framework:vs_compliance_frameworks(*),
        vendor:vs_vendors(*),
        asset:vs_assets(*),
        gaps:vs_compliance_gaps(*),
        recommendations:vs_compliance_recommendations(*)
      `)
      .eq('id', assessmentId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }

  // Calculate compliance score
  async calculateComplianceScore(assessmentId: string): Promise<{
    overall_score: number;
    compliance_percentage: number;
    control_scores: Record<string, number>;
    gaps: ComplianceGap[];
    recommendations: ComplianceRecommendation[];
  }> {
    const assessment = await this.getAssessment(assessmentId);
    if (!assessment) {
      throw new Error('Assessment not found');
    }

    const framework = await this.getFramework(assessment.framework_id);
    if (!framework) {
      throw new Error('Framework not found');
    }

    // Calculate control scores
    const controlScores: Record<string, number> = {};
    const gaps: ComplianceGap[] = [];
    const recommendations: ComplianceRecommendation[] = [];

    for (const control of framework.controls) {
      // Simulate control scoring based on evidence and implementation
      const score = this.calculateControlScore(control, assessment);
      controlScores[control.id] = score;

      // Identify gaps
      if (score < 70) {
        const gap = await this.createGap(assessmentId, control.id, score);
        gaps.push(gap);
      }

      // Generate recommendations
      if (score < 90) {
        const recommendation = await this.createRecommendation(assessmentId, control.id, score);
        recommendations.push(recommendation);
      }
    }

    // Calculate overall score
    const overallScore = Object.values(controlScores).reduce((sum, score) => sum + score, 0) / Object.keys(controlScores).length;
    const compliancePercentage = (overallScore / 100) * 100;

    // Update assessment
    await supabase
      .from('vs_compliance_assessments')
      .update({
        overall_score: Math.round(overallScore),
        compliance_percentage: Math.round(compliancePercentage),
        control_scores: controlScores,
        status: 'completed'
      })
      .eq('id', assessmentId);

    return {
      overall_score: Math.round(overallScore),
      compliance_percentage: Math.round(compliancePercentage),
      control_scores: controlScores,
      gaps,
      recommendations
    };
  }

  // Calculate control score
  private calculateControlScore(_control: ComplianceControl, _assessment: ComplianceAssessment): number {
    // Simulate control scoring logic
    let score = 0;
    
    // Base score from implementation
    score += 40;
    
    // Add points for documentation
    score += 20;
    
    // Add points for testing
    score += 20;
    
    // Add points for evidence
    score += 20;
    
    // Add some randomness for simulation
    score += (Math.random() - 0.5) * 20;
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  // --- Extended: Client control results ---
  async upsertControlResult(params: {
    assessment_id: string;
    control_id: string;
    status: 'not_started' | 'in_progress' | 'implemented' | 'partially_implemented' | 'not_applicable';
    score?: number;
    evidence?: Array<{ type: string; ref: string; note?: string }>;
    notes?: string;
  }): Promise<void> {
    const payload = {
      assessment_id: params.assessment_id,
      control_id: params.control_id,
      status: params.status,
      score: typeof params.score === 'number' ? params.score : null,
      evidence: params.evidence ? params.evidence : [],
      notes: params.notes || null,
      last_reviewed_at: new Date().toISOString(),
    } as any;

    const { error } = await supabase
      .from('vs_assessment_control_results')
      .upsert(payload, { onConflict: 'assessment_id,control_id' });

    if (error) throw error;

    await this.logAuditTrail({
      entity_type: 'control',
      entity_id: params.control_id,
      action: 'upsert_result',
      description: 'Updated client control result',
      new_values: payload,
      user_id: '',
      user_name: 'system',
    });
  }

  async getControlResults(assessment_id: string): Promise<Array<{ id: string; control_id: string; status: string; score: number | null; evidence: any }>> {
    const { data, error } = await supabase
      .from('vs_assessment_control_results')
      .select('id, control_id, status, score, evidence')
      .eq('assessment_id', assessment_id);

    if (error) throw error;
    return data || [];
  }

  // --- Extended: Client control -> vendor mapping ---
  async getVendorMappings(client_control_id: string): Promise<Array<{ id: string; vendor_framework_id: string | null; vendor_question_ref: string | null; mapping_notes: string | null }>> {
    const { data, error } = await supabase
      .from('vs_control_mappings')
      .select('id, vendor_framework_id, vendor_question_ref, mapping_notes')
      .eq('client_control_id', client_control_id);

    if (error) throw error;
    return data || [];
  }

  async upsertVendorMapping(mapping: { client_control_id: string; vendor_framework_id?: string | null; vendor_question_ref?: string | null; mapping_notes?: string | null }): Promise<void> {
    const { error } = await supabase
      .from('vs_control_mappings')
      .upsert({
        client_control_id: mapping.client_control_id,
        vendor_framework_id: mapping.vendor_framework_id || null,
        vendor_question_ref: mapping.vendor_question_ref || null,
        mapping_notes: mapping.mapping_notes || null,
      });

    if (error) throw error;
  }

  // --- Crosslink: Create vendor requests for a client control
  async createVendorRequestsForControl(params: {
    assessor_id: string;
    vendor_ids: string[];
    control_id: string;
    assessment_id: string;
    due_date?: string;
    contact_email?: string | null;
  }): Promise<void> {
    const mappings = await this.getVendorMappings(params.control_id);

    const frameworkId = mappings[0]?.vendor_framework_id || null;
    const due = params.due_date || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

    for (const vendorId of params.vendor_ids) {
      const customMessage = {
        client_assessment_id: params.assessment_id,
        client_control_id: params.control_id,
        hint: 'This assessment request originates from client NIST SP 800-161 Extended control mapping.',
      };

      const { error } = await supabase
        .from('vs_vendor_assessments')
        .insert({
          user_id: params.assessor_id,
          vendor_id: vendorId,
          framework_id: frameworkId,
          assessment_name: 'Compliance Evidence Request',
          status: 'sent',
          due_date: due,
          contact_email: params.contact_email || null,
          custom_message: JSON.stringify(customMessage),
          send_reminders: true,
          allow_save_progress: true,
        } as any);

      if (error) throw error;
    }
  }

  // Create compliance gap
  async createGap(assessmentId: string, controlId: string, currentScore: number): Promise<ComplianceGap> {
    const gapData: Omit<ComplianceGap, 'id' | 'created_at' | 'updated_at'> = {
      control_id: controlId,
      gap_type: 'implementation',
      severity: currentScore < 30 ? 'critical' : currentScore < 50 ? 'high' : currentScore < 70 ? 'medium' : 'low',
      description: `Gap identified in control implementation. Current score: ${currentScore}`,
      current_state: `Current implementation level: ${currentScore}%`,
      target_state: 'Target implementation level: 90%',
      remediation_plan: 'Implement additional controls and documentation',
      estimated_effort: Math.round((100 - currentScore) * 0.5), // hours
      estimated_cost: Math.round((100 - currentScore) * 100), // dollars
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      status: 'open'
    };

    const { data, error } = await supabase
      .from('vs_compliance_gaps')
      .insert(gapData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Create compliance recommendation
  async createRecommendation(assessmentId: string, controlId: string, currentScore: number): Promise<ComplianceRecommendation> {
    const recommendationData: Omit<ComplianceRecommendation, 'id' | 'created_at' | 'updated_at'> = {
      assessment_id: assessmentId,
      control_id: controlId,
      priority: currentScore < 30 ? 'critical' : currentScore < 50 ? 'high' : currentScore < 70 ? 'medium' : 'low',
      title: `Improve control implementation for ${controlId}`,
      description: `Current score of ${currentScore}% indicates room for improvement`,
      implementation_steps: [
        'Review current implementation',
        'Identify specific gaps',
        'Develop improvement plan',
        'Implement changes',
        'Test and validate'
      ],
      estimated_effort: Math.round((100 - currentScore) * 0.3),
      estimated_cost: Math.round((100 - currentScore) * 50),
      business_impact: 'Improved compliance posture and reduced risk',
      risk_if_not_implemented: 'Continued compliance gaps and potential regulatory issues',
      status: 'pending',
      due_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString() // 60 days
    };

    const { data, error } = await supabase
      .from('vs_compliance_recommendations')
      .insert(recommendationData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get compliance gaps
  async getGaps(filters?: {
    assessment_id?: string;
    control_id?: string;
    severity?: string;
    status?: string;
  }): Promise<ComplianceGap[]> {
    let query = supabase
      .from('vs_compliance_gaps')
      .select(`
        *,
        control:vs_compliance_controls(*),
        assessment:vs_compliance_assessments(*)
      `)
      .order('created_at', { ascending: false });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) query = query.eq(key, value);
      });
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // Get compliance recommendations
  async getRecommendations(filters?: {
    assessment_id?: string;
    control_id?: string;
    priority?: string;
    status?: string;
  }): Promise<ComplianceRecommendation[]> {
    let query = supabase
      .from('vs_compliance_recommendations')
      .select(`
        *,
        control:vs_compliance_controls(*),
        assessment:vs_compliance_assessments(*)
      `)
      .order('created_at', { ascending: false });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) query = query.eq(key, value);
      });
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // Update gap status
  async updateGapStatus(gapId: string, status: string, assignedTo?: string): Promise<ComplianceGap> {
    const updates: Partial<ComplianceGap> = { status: status as any };
    if (assignedTo) updates.assigned_to = assignedTo;

    const { data, error } = await supabase
      .from('vs_compliance_gaps')
      .update(updates)
      .eq('id', gapId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update recommendation status
  async updateRecommendationStatus(recommendationId: string, status: string, assignedTo?: string): Promise<ComplianceRecommendation> {
    const updates: Partial<ComplianceRecommendation> = { status: status as any };
    if (assignedTo) updates.assigned_to = assignedTo;

    const { data, error } = await supabase
      .from('vs_compliance_recommendations')
      .update(updates)
      .eq('id', recommendationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Create remediation workflow
  async createRemediationWorkflow(workflowData: Omit<RemediationWorkflow, 'id' | 'created_at' | 'updated_at'>): Promise<RemediationWorkflow> {
    const { data, error } = await supabase
      .from('vs_remediation_workflows')
      .insert(workflowData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get remediation workflows
  async getRemediationWorkflows(): Promise<RemediationWorkflow[]> {
    const { data, error } = await supabase
      .from('vs_remediation_workflows')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Execute remediation workflow
  async executeRemediationWorkflow(workflowId: string, gapId: string): Promise<void> {
    const workflow = await this.getRemediationWorkflow(workflowId);
    if (!workflow) {
      throw new Error('Workflow not found');
    }

    const gap = await this.getGap(gapId);
    if (!gap) {
      throw new Error('Gap not found');
    }

    // Check if workflow should be triggered
    if (this.shouldTriggerWorkflow(workflow, gap)) {
      // Execute workflow steps
      for (const step of workflow.steps) {
        await this.executeRemediationStep(step, gap);
      }
    }
  }

  // Get remediation workflow by ID
  private async getRemediationWorkflow(workflowId: string): Promise<RemediationWorkflow | null> {
    const { data, error } = await supabase
      .from('vs_remediation_workflows')
      .select('*')
      .eq('id', workflowId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }

  // Get gap by ID
  private async getGap(gapId: string): Promise<ComplianceGap | null> {
    const { data, error } = await supabase
      .from('vs_compliance_gaps')
      .select('*')
      .eq('id', gapId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }

  // Check if workflow should be triggered
  private shouldTriggerWorkflow(workflow: RemediationWorkflow, gap: ComplianceGap): boolean {
    const conditions = workflow.trigger_conditions;
    
    // Check severity
    if (conditions.gap_severity.length > 0 && !conditions.gap_severity.includes(gap.severity)) {
      return false;
    }
    
    // Check gap type
    if (conditions.gap_types.length > 0 && !conditions.gap_types.includes(gap.gap_type)) {
      return false;
    }
    
    return true;
  }

  // Execute remediation step
  private async executeRemediationStep(step: RemediationStep, gap: ComplianceGap): Promise<void> {
    switch (step.step_type) {
      case 'assign_task':
        await this.assignRemediationTask(step, gap);
        break;
      case 'send_notification':
        await this.sendRemediationNotification(step, gap);
        break;
      case 'escalate':
        await this.escalateRemediation(step, gap);
        break;
      case 'approve':
        await this.approveRemediation(step, gap);
        break;
      case 'create_ticket':
        await this.createRemediationTicket(step, gap);
        break;
    }
  }

  // Assign remediation task
  private async assignRemediationTask(step: RemediationStep, gap: ComplianceGap): Promise<void> {
    const { assignee_role, due_days } = step.parameters;
    
    // Update gap with assignment
    await this.updateGapStatus(gap.id, 'in_progress', assignee_role);
    
    logger.info(`Assigned remediation task for gap ${gap.id} to ${assignee_role}`);
  }

  // Send remediation notification
  private async sendRemediationNotification(step: RemediationStep, gap: ComplianceGap): Promise<void> {
    const { recipients, template } = step.parameters;
    
    logger.info(`Sending remediation notification to ${recipients.join(', ')} for gap ${gap.id}`);
  }

  // Escalate remediation
  private async escalateRemediation(step: RemediationStep, gap: ComplianceGap): Promise<void> {
    const { escalation_role } = step.parameters;
    
    logger.info(`Escalating gap ${gap.id} to ${escalation_role}`);
  }

  // Approve remediation
  private async approveRemediation(step: RemediationStep, gap: ComplianceGap): Promise<void> {
    logger.info(`Approving remediation for gap ${gap.id}`);
  }

  // Create remediation ticket
  private async createRemediationTicket(step: RemediationStep, gap: ComplianceGap): Promise<void> {
    const { ticket_system, priority } = step.parameters;
    
    logger.info(`Creating ${ticket_system} ticket for gap ${gap.id} with priority ${priority}`);
  }

  // Get compliance dashboard data
  async getComplianceDashboard(): Promise<ComplianceDashboard> {
    // Get basic counts
    const { data: frameworks } = await supabase
      .from('vs_compliance_frameworks')
      .select('id')
      .eq('is_active', true);

    const { data: assessments } = await supabase
      .from('vs_compliance_assessments')
      .select('id, status, overall_score');

    const { data: gaps } = await supabase
      .from('vs_compliance_gaps')
      .select('id, severity')
      .eq('status', 'open');

    const { data: recommendations } = await supabase
      .from('vs_compliance_recommendations')
      .select('id, priority')
      .eq('status', 'pending');

    // Calculate metrics
    const totalFrameworks = frameworks?.length || 0;
    const activeAssessments = assessments?.filter(a => a.status === 'in_progress').length || 0;
    const completedAssessments = assessments?.filter(a => a.status === 'completed').length || 0;
    const criticalGaps = gaps?.filter(g => g.severity === 'critical').length || 0;
    const highPriorityRecommendations = recommendations?.filter(r => r.priority === 'high' || r.priority === 'critical').length || 0;

    // Generate compliance trends (simulated)
    const complianceTrends = this.generateComplianceTrends();

    // Get recent activities
    const recentActivities = await this.getRecentActivities();

    // Get upcoming deadlines
    const upcomingDeadlines = await this.getUpcomingDeadlines();

    return {
      total_frameworks: totalFrameworks,
      active_assessments: activeAssessments,
      completed_assessments: completedAssessments,
      critical_gaps: criticalGaps,
      high_priority_recommendations: highPriorityRecommendations,
      compliance_trends: complianceTrends,
      recent_activities: recentActivities,
      upcoming_deadlines: upcomingDeadlines
    };
  }

  // Generate compliance trends
  private generateComplianceTrends(): Array<{
    date: string;
    overall_compliance: number;
    framework_compliance: Record<string, number>;
  }> {
    const trends = [];
    const frameworks = ['NIST', 'ISO27001', 'SOC2', 'PCI-DSS'];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const overallCompliance = 75 + Math.sin(i / 10) * 10 + Math.random() * 5;
      const frameworkCompliance: Record<string, number> = {};
      
      frameworks.forEach(framework => {
        frameworkCompliance[framework] = overallCompliance + (Math.random() - 0.5) * 10;
      });
      
      trends.push({
        date: date.toISOString().split('T')[0],
        overall_compliance: Math.round(overallCompliance),
        framework_compliance: frameworkCompliance
      });
    }
    
    return trends;
  }

  // Get recent activities
  private async getRecentActivities(): Promise<AuditTrail[]> {
    const { data, error } = await supabase
      .from('vs_audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    return data || [];
  }

  // Get upcoming deadlines
  private async getUpcomingDeadlines(): Promise<Array<{
    type: 'assessment' | 'gap_remediation' | 'recommendation';
    title: string;
    due_date: string;
    priority: string;
  }>> {
    const deadlines = [];
    
    // Get upcoming assessments
    const { data: assessments } = await supabase
      .from('vs_compliance_assessments')
      .select('assessment_name, due_date')
      .eq('status', 'in_progress')
      .lte('due_date', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString());

    assessments?.forEach(assessment => {
      deadlines.push({
        type: 'assessment',
        title: assessment.assessment_name,
        due_date: assessment.due_date,
        priority: 'medium'
      });
    });

    // Get upcoming gap remediations
    const { data: gaps } = await supabase
      .from('vs_compliance_gaps')
      .select('description, due_date, severity')
      .eq('status', 'open')
      .lte('due_date', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString());

    gaps?.forEach(gap => {
      deadlines.push({
        type: 'gap_remediation',
        title: gap.description,
        due_date: gap.due_date,
        priority: gap.severity
      });
    });

    return deadlines.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
  }

  // Log audit trail
  async logAuditTrail(auditData: Omit<AuditTrail, 'id' | 'created_at'>): Promise<void> {
    const { error } = await supabase
      .from('vs_audit_logs')
      .insert(auditData);

    if (error) throw error;
  }

  // Get audit trail
  async getAuditTrail(filters?: {
    entity_type?: string;
    entity_id?: string;
    user_id?: string;
    action?: string;
  }): Promise<AuditTrail[]> {
    let query = supabase
      .from('vs_audit_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) query = query.eq(key, value);
      });
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }
}

export const complianceService = new ComplianceService();