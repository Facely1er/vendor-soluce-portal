import { logger } from '../utils/logger';
import { supabase } from '../lib/supabase';
import { AssessmentWorkflow, WorkflowTrigger, WorkflowStep, _NotificationConfig } from '../types';

interface WorkflowExecution {
  id: string;
  workflow_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  current_step: number;
  started_at: string;
  completed_at?: string;
  error_message?: string;
  context: Record<string, any>;
  results: Record<string, any>;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'vendor_onboarding' | 'risk_assessment' | 'compliance_review' | 'incident_response' | 'custom';
  triggers: WorkflowTrigger[];
  steps: WorkflowStep[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ScheduledWorkflow {
  id: string;
  workflow_id: string;
  name: string;
  schedule: string; // Cron expression
  is_active: boolean;
  last_run?: string;
  next_run?: string;
  context: Record<string, any>;
  created_at: string;
}

class WorkflowService {
  private templates: Map<string, WorkflowTemplate> = new Map();

  constructor() {
    this.initializeTemplates();
  }

  // Initialize default workflow templates
  private initializeTemplates(): void {
    // Vendor Onboarding Workflow
    this.templates.set('vendor_onboarding', {
      id: 'vendor_onboarding',
      name: 'Vendor Onboarding',
      description: 'Automated vendor onboarding process with risk assessment and approval',
      category: 'vendor_onboarding',
      triggers: [
        {
          id: 'vendor_created',
          type: 'vendor_added',
          conditions: { auto_approve: false },
          enabled: true
        }
      ],
      steps: [
        {
          id: 'initial_assessment',
          step_type: 'create_assessment',
          name: 'Create Initial Assessment',
          description: 'Create initial security assessment for new vendor',
          order: 1,
          parameters: {
            framework_id: 'nist_privacy',
            due_days: 30,
            auto_send: true
          },
          notifications: [
            {
              type: 'email',
              recipients: ['vendor_manager@company.com'],
              template: 'vendor_assessment_created'
            }
          ]
        },
        {
          id: 'risk_evaluation',
          step_type: 'assign_task',
          name: 'Risk Evaluation',
          description: 'Assign risk evaluation task to security team',
          order: 2,
          parameters: {
            assignee_role: 'security_manager',
            due_days: 7,
            priority: 'high'
          },
          conditions: {
            assessment_completed: true
          },
          notifications: [
            {
              type: 'slack',
              recipients: ['#security-team'],
              template: 'risk_evaluation_assigned'
            }
          ]
        },
        {
          id: 'approval_decision',
          step_type: 'approve',
          name: 'Approval Decision',
          description: 'Approve or reject vendor based on assessment results',
          order: 3,
          parameters: {
            approver_role: 'org_admin',
            auto_approve_threshold: 70,
            escalation_hours: 48
          },
          conditions: {
            risk_evaluation_completed: true
          },
          notifications: [
            {
              type: 'email',
              recipients: ['org_admin@company.com'],
              template: 'vendor_approval_required'
            }
          ]
        }
      ],
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    // Risk Assessment Workflow
    this.templates.set('risk_assessment', {
      id: 'risk_assessment',
      name: 'Automated Risk Assessment',
      description: 'Scheduled risk assessments with escalation for high-risk vendors',
      category: 'risk_assessment',
      triggers: [
        {
          id: 'scheduled_assessment',
          type: 'assessment_overdue',
          conditions: { days_overdue: 7 },
          enabled: true
        }
      ],
      steps: [
        {
          id: 'create_assessment',
          step_type: 'create_assessment',
          name: 'Create Risk Assessment',
          description: 'Create new risk assessment for vendor',
          order: 1,
          parameters: {
            framework_id: 'nist_privacy',
            due_days: 14,
            priority: 'high'
          },
          notifications: [
            {
              type: 'email',
              recipients: ['vendor_manager@company.com'],
              template: 'risk_assessment_created'
            }
          ]
        },
        {
          id: 'escalate_if_high_risk',
          step_type: 'escalate',
          name: 'Escalate High Risk',
          description: 'Escalate to security team if vendor is high risk',
          order: 2,
          parameters: {
            risk_threshold: 70,
            escalation_role: 'security_manager'
          },
          conditions: {
            risk_score: { '>': 70 }
          },
          notifications: [
            {
              type: 'slack',
              recipients: ['#security-team'],
              template: 'high_risk_escalation'
            }
          ]
        }
      ],
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    // Compliance Review Workflow
    this.templates.set('compliance_review', {
      id: 'compliance_review',
      name: 'Compliance Review',
      description: 'Quarterly compliance review with gap analysis',
      category: 'compliance_review',
      triggers: [
        {
          id: 'quarterly_review',
          type: 'contract_expiring',
          conditions: { days_until_expiry: 30 },
          enabled: true
        }
      ],
      steps: [
        {
          id: 'compliance_check',
          step_type: 'create_assessment',
          name: 'Compliance Check',
          description: 'Create compliance assessment',
          order: 1,
          parameters: {
            framework_id: 'cmmc_level_2',
            due_days: 21
          },
          notifications: [
            {
              type: 'email',
              recipients: ['compliance@company.com'],
              template: 'compliance_review_created'
            }
          ]
        },
        {
          id: 'gap_analysis',
          step_type: 'assign_task',
          name: 'Gap Analysis',
          description: 'Perform compliance gap analysis',
          order: 2,
          parameters: {
            assignee_role: 'compliance_officer',
            due_days: 14
          },
          conditions: {
            assessment_completed: true
          }
        }
      ],
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  // Create workflow
  async createWorkflow(workflowData: Omit<AssessmentWorkflow, 'id' | 'created_at' | 'updated_at'>): Promise<AssessmentWorkflow> {
    const { data, error } = await supabase
      .from('vs_workflows')
      .insert(workflowData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get workflow by ID
  async getWorkflow(workflowId: string): Promise<AssessmentWorkflow | null> {
    const { data, error } = await supabase
      .from('vs_workflows')
      .select('*')
      .eq('id', workflowId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }

  // Get all workflows
  async getWorkflows(): Promise<AssessmentWorkflow[]> {
    const { data, error } = await supabase
      .from('vs_workflows')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Execute workflow
  async executeWorkflow(workflowId: string, context: Record<string, any>): Promise<WorkflowExecution> {
    const workflow = await this.getWorkflow(workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    // Create workflow execution
    const execution: Omit<WorkflowExecution, 'id'> = {
      workflow_id: workflowId,
      status: 'pending',
      current_step: 0,
      started_at: new Date().toISOString(),
      context,
      results: {}
    };

    const { data: executionData, error: executionError } = await supabase
      .from('vs_workflow_executions')
      .insert(execution)
      .select()
      .single();

    if (executionError) throw executionError;

    // Start execution
    this.runWorkflowSteps(executionData.id, workflow);

    return executionData;
  }

  // Run workflow steps
  private async runWorkflowSteps(executionId: string, workflow: AssessmentWorkflow): Promise<void> {
    try {
      // Update status to running
      await supabase
        .from('vs_workflow_executions')
        .update({ status: 'running' })
        .eq('id', executionId);

      const steps = workflow.steps.sort((a, b) => a.order - b.order);
      
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        
        // Update current step
        await supabase
          .from('vs_workflow_executions')
          .update({ current_step: i + 1 })
          .eq('id', executionId);

        // Execute step
        const stepResult = await this.executeStep(step, executionId);
        
        // Store step result
        await supabase
          .from('vs_workflow_executions')
          .update({ 
            results: { ...workflow.results, [step.id]: stepResult }
          })
          .eq('id', executionId);

        // Check if step failed
        if (stepResult.status === 'failed') {
          await supabase
            .from('vs_workflow_executions')
            .update({ 
              status: 'failed',
              error_message: stepResult.error
            })
            .eq('id', executionId);
          return;
        }
      }

      // Mark as completed
      await supabase
        .from('vs_workflow_executions')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', executionId);

    } catch (error) {
      logger.error('Error running workflow steps:', error);
      await supabase
        .from('vs_workflow_executions')
        .update({ 
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error'
        })
        .eq('id', executionId);
    }
  }

  // Execute individual step
  private async executeStep(step: WorkflowStep, executionId: string): Promise<any> {
    try {
      switch (step.step_type) {
        case 'create_assessment':
          return await this.executeCreateAssessment(step, executionId);
        case 'send_notification':
          return await this.executeSendNotification(step, executionId);
        case 'assign_task':
          return await this.executeAssignTask(step, executionId);
        case 'escalate':
          return await this.executeEscalate(step, executionId);
        case 'approve':
          return await this.executeApprove(step, executionId);
        case 'reject':
          return await this.executeReject(step, executionId);
        default:
          throw new Error(`Unknown step type: ${step.step_type}`);
      }
    } catch (error) {
      return {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Execute create assessment step
  private async executeCreateAssessment(step: WorkflowStep, executionId: string): Promise<any> {
    const { vendor_id, framework_id, due_days, auto_send } = step.parameters;
    
    const { data, error } = await supabase
      .from('vs_vendor_assessments')
      .insert({
        vendor_id,
        framework_id,
        assessment_name: `Automated Assessment - ${new Date().toLocaleDateString()}`,
        due_date: new Date(Date.now() + (due_days || 30) * 24 * 60 * 60 * 1000).toISOString(),
        status: auto_send ? 'sent' : 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    return {
      status: 'completed',
      assessment_id: data.id,
      message: 'Assessment created successfully'
    };
  }

  // Execute send notification step
  private async executeSendNotification(step: WorkflowStep, executionId: string): Promise<any> {
    const { type, recipients, template } = step.parameters;
    
    // Simulate notification sending
    logger.info(`Sending ${type} notification to ${recipients.join(', ')} using template ${template}`);
    
    return {
      status: 'completed',
      message: 'Notification sent successfully'
    };
  }

  // Execute assign task step
  private async executeAssignTask(step: WorkflowStep, executionId: string): Promise<any> {
    const { assignee_role, due_days, priority } = step.parameters;
    
    // Simulate task assignment
    logger.info(`Assigning task to ${assignee_role} with priority ${priority}`);
    
    return {
      status: 'completed',
      message: 'Task assigned successfully'
    };
  }

  // Execute escalate step
  private async executeEscalate(step: WorkflowStep, executionId: string): Promise<any> {
    const { escalation_role, risk_threshold } = step.parameters;
    
    // Simulate escalation
    logger.info(`Escalating to ${escalation_role} for risk threshold ${risk_threshold}`);
    
    return {
      status: 'completed',
      message: 'Escalation completed successfully'
    };
  }

  // Execute approve step
  private async executeApprove(step: WorkflowStep, executionId: string): Promise<any> {
    const { approver_role, auto_approve_threshold } = step.parameters;
    
    // Simulate approval
    logger.info(`Approving with ${approver_role} for threshold ${auto_approve_threshold}`);
    
    return {
      status: 'completed',
      message: 'Approval completed successfully'
    };
  }

  // Execute reject step
  private async executeReject(step: WorkflowStep, executionId: string): Promise<any> {
    const { reason } = step.parameters;
    
    // Simulate rejection
    logger.info(`Rejecting with reason: ${reason}`);
    
    return {
      status: 'completed',
      message: 'Rejection completed successfully'
    };
  }

  // Get workflow templates
  getTemplates(): WorkflowTemplate[] {
    return Array.from(this.templates.values());
  }

  // Get template by ID
  getTemplate(templateId: string): WorkflowTemplate | null {
    return this.templates.get(templateId) || null;
  }

  // Create workflow from template
  async createWorkflowFromTemplate(
    templateId: string, 
    customizations?: Partial<AssessmentWorkflow>
  ): Promise<AssessmentWorkflow> {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const workflowData: Omit<AssessmentWorkflow, 'id' | 'created_at' | 'updated_at'> = {
      name: template.name,
      description: template.description,
      trigger_conditions: template.triggers,
      steps: template.steps,
      is_active: true,
      ...customizations
    };

    return await this.createWorkflow(workflowData);
  }

  // Schedule workflow
  async scheduleWorkflow(
    workflowId: string,
    schedule: string,
    context: Record<string, any> = {}
  ): Promise<ScheduledWorkflow> {
    const { data, error } = await supabase
      .from('vs_scheduled_workflows')
      .insert({
        workflow_id,
        name: `Scheduled ${workflowId}`,
        schedule,
        is_active: true,
        context,
        next_run: this.calculateNextRun(schedule)
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Calculate next run time from cron expression
  private calculateNextRun(schedule: string): string {
    // Simplified cron calculation (in real implementation, use a proper cron library)
    const now = new Date();
    const nextRun = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Default to next day
    return nextRun.toISOString();
  }

  // Get scheduled workflows
  async getScheduledWorkflows(): Promise<ScheduledWorkflow[]> {
    const { data, error } = await supabase
      .from('vs_scheduled_workflows')
      .select('*')
      .eq('is_active', true)
      .order('next_run');

    if (error) throw error;
    return data || [];
  }

  // Execute scheduled workflows
  async executeScheduledWorkflows(): Promise<void> {
    const scheduledWorkflows = await this.getScheduledWorkflows();
    const now = new Date();

    for (const scheduled of scheduledWorkflows) {
      if (scheduled.next_run && new Date(scheduled.next_run) <= now) {
        try {
          await this.executeWorkflow(scheduled.workflow_id, scheduled.context);
          
          // Update next run time
          const nextRun = this.calculateNextRun(scheduled.schedule);
          await supabase
            .from('vs_scheduled_workflows')
            .update({ 
              last_run: new Date().toISOString(),
              next_run: nextRun
            })
            .eq('id', scheduled.id);
        } catch (error) {
          logger.error(`Error executing scheduled workflow ${scheduled.id}:`, error);
        }
      }
    }
  }

  // Get workflow executions
  async getWorkflowExecutions(workflowId?: string): Promise<WorkflowExecution[]> {
    let query = supabase
      .from('vs_workflow_executions')
      .select('*')
      .order('started_at', { ascending: false });

    if (workflowId) {
      query = query.eq('workflow_id', workflowId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // Cancel workflow execution
  async cancelWorkflowExecution(executionId: string): Promise<void> {
    const { error } = await supabase
      .from('vs_workflow_executions')
      .update({ 
        status: 'cancelled',
        completed_at: new Date().toISOString()
      })
      .eq('id', executionId);

    if (error) throw error;
  }

  // Update workflow
  async updateWorkflow(workflowId: string, updates: Partial<AssessmentWorkflow>): Promise<AssessmentWorkflow> {
    const { data, error } = await supabase
      .from('vs_workflows')
      .update(updates)
      .eq('id', workflowId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete workflow
  async deleteWorkflow(workflowId: string): Promise<void> {
    const { error } = await supabase
      .from('vs_workflows')
      .delete()
      .eq('id', workflowId);

    if (error) throw error;
  }

  // Check workflow triggers
  async checkTriggers(eventType: string, context: Record<string, any>): Promise<void> {
    const workflows = await this.getWorkflows();
    
    for (const workflow of workflows) {
      if (!workflow.is_active) continue;
      
      for (const trigger of workflow.trigger_conditions) {
        if (trigger.type === eventType && trigger.enabled) {
          // Check if trigger conditions are met
          if (this.evaluateTriggerConditions(trigger.conditions, context)) {
            await this.executeWorkflow(workflow.id, context);
          }
        }
      }
    }
  }

  // Evaluate trigger conditions
  private evaluateTriggerConditions(conditions: Record<string, any>, context: Record<string, any>): boolean {
    for (const [key, value] of Object.entries(conditions)) {
      if (typeof value === 'object' && value !== null) {
        // Handle comparison operators
        for (const [op, expectedValue] of Object.entries(value)) {
          const actualValue = context[key];
          switch (op) {
            case '>':
              if (actualValue <= expectedValue) return false;
              break;
            case '<':
              if (actualValue >= expectedValue) return false;
              break;
            case '>=':
              if (actualValue < expectedValue) return false;
              break;
            case '<=':
              if (actualValue > expectedValue) return false;
              break;
            case '==':
              if (actualValue !== expectedValue) return false;
              break;
            case '!=':
              if (actualValue === expectedValue) return false;
              break;
          }
        }
      } else {
        // Direct comparison
        if (context[key] !== value) return false;
      }
    }
    return true;
  }
}

export const workflowService = new WorkflowService();