// Marketing Automation Service
// Handles workflow creation, email scheduling, and campaign management
// File: src/services/marketingAutomationService.ts

import { supabase } from '../lib/supabase';
import { logger } from '../utils/monitoring';

export interface MarketingCampaign {
  id: string;
  name: string;
  description?: string;
  type: 'welcome' | 'trial' | 'abandoned_cart' | 'win_back' | 'feature_announcement' | 'educational' | 'upgrade_prompt' | 'custom';
  status: 'draft' | 'active' | 'paused' | 'archived';
  trigger_type: 'event' | 'schedule' | 'manual';
  trigger_config: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface EmailTemplate {
  id: string;
  campaign_id: string;
  name: string;
  subject: string;
  html_content: string;
  text_content?: string;
  delay_days: number;
  delay_hours: number;
  sequence_order: number;
  conditions: Record<string, any>;
  is_active: boolean;
}

export interface MarketingWorkflow {
  id: string;
  user_id: string;
  campaign_id: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  started_at: string;
  completed_at?: string;
  current_step: number;
  metadata: Record<string, any>;
}

export interface EmailSend {
  id: string;
  workflow_id?: string;
  template_id?: string;
  user_id: string;
  campaign_id?: string;
  email: string;
  subject: string;
  status: 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed';
  scheduled_for?: string;
  sent_at?: string;
  opened_at?: string;
  clicked_at?: string;
}

export class MarketingAutomationService {
  /**
   * Start a marketing workflow for a user
   */
  static async startWorkflow(
    userId: string,
    campaignId: string,
    metadata?: Record<string, any>
  ): Promise<MarketingWorkflow> {
    try {
      // Check if workflow already exists
      const { data: existing } = await supabase
        .from('vs_marketing_workflows')
        .select('*')
        .eq('user_id', userId)
        .eq('campaign_id', campaignId)
        .in('status', ['active', 'paused'])
        .single();

      if (existing) {
        // Resume paused workflow or return existing active workflow
        if (existing.status === 'paused') {
          const { data: resumed } = await supabase
            .from('vs_marketing_workflows')
            .update({ status: 'active' })
            .eq('id', existing.id)
            .select()
            .single();

          return resumed as MarketingWorkflow;
        }
        return existing as MarketingWorkflow;
      }

      // Create new workflow
      const { data: workflow, error } = await supabase
        .from('vs_marketing_workflows')
        .insert({
          user_id: userId,
          campaign_id: campaignId,
          status: 'active',
          current_step: 0,
          metadata: metadata || {},
        })
        .select()
        .single();

      if (error) throw error;

      // Schedule first email
      await this.scheduleNextEmail(workflow.id);

      logger.info('Marketing workflow started', { userId, campaignId, workflowId: workflow.id });
      return workflow as MarketingWorkflow;
    } catch (error) {
      logger.error('Error starting marketing workflow:', error);
      throw error;
    }
  }

  /**
   * Schedule the next email in a workflow sequence
   */
  static async scheduleNextEmail(workflowId: string): Promise<void> {
    try {
      const { data: workflow } = await supabase
        .from('vs_marketing_workflows')
        .select('*, vs_marketing_campaigns(*)')
        .eq('id', workflowId)
        .single();

      if (!workflow) throw new Error('Workflow not found');

      const campaign = workflow.vs_marketing_campaigns as MarketingCampaign;
      const currentStep = workflow.current_step || 0;

      // Get next template in sequence
      const { data: templates } = await supabase
        .from('vs_email_templates')
        .select('*')
        .eq('campaign_id', campaign.id)
        .eq('is_active', true)
        .order('sequence_order', { ascending: true });

      if (!templates || templates.length === 0) {
        logger.warn('No templates found for campaign', { campaignId: campaign.id });
        return;
      }

      const nextTemplate = templates.find(t => t.sequence_order > currentStep);

      if (!nextTemplate) {
        // Workflow complete
        await supabase
          .from('vs_marketing_workflows')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
          })
          .eq('id', workflowId);
        return;
      }

      // Get user details
      const { data: user } = await supabase
        .from('vs_profiles')
        .select('email, full_name')
        .eq('id', workflow.user_id)
        .single();

      if (!user || !user.email) {
        logger.warn('User email not found', { userId: workflow.user_id });
        return;
      }

      // Calculate scheduled time
      const delayMs = (nextTemplate.delay_days * 24 * 60 * 60 * 1000) +
                      (nextTemplate.delay_hours * 60 * 60 * 1000);
      const scheduledFor = new Date(Date.now() + delayMs);

      // Create email send record
      const { error } = await supabase
        .from('vs_email_sends')
        .insert({
          workflow_id: workflowId,
          template_id: nextTemplate.id,
          user_id: workflow.user_id,
          campaign_id: campaign.id,
          email: user.email,
          subject: nextTemplate.subject,
          status: 'pending',
          scheduled_for: scheduledFor.toISOString(),
        });

      if (error) throw error;

      // Update workflow step
      await supabase
        .from('vs_marketing_workflows')
        .update({ current_step: nextTemplate.sequence_order })
        .eq('id', workflowId);

      logger.info('Next email scheduled', {
        workflowId,
        templateId: nextTemplate.id,
        scheduledFor: scheduledFor.toISOString(),
      });
    } catch (error) {
      logger.error('Error scheduling next email:', error);
      throw error;
    }
  }

  /**
   * Log a user event (triggers event-based campaigns)
   */
  static async logUserEvent(
    userId: string,
    eventType: string,
    eventData?: Record<string, any>
  ): Promise<void> {
    try {
      const { error } = await supabase.rpc('log_user_event', {
        p_user_id: userId,
        p_event_type: eventType,
        p_event_data: eventData || {},
      });

      if (error) throw error;

      // Check for event-triggered campaigns
      await this.checkEventTriggers(userId, eventType, eventData);
    } catch (error) {
      logger.error('Error logging user event:', error);
      // Don't throw - event logging shouldn't break the app
    }
  }

  /**
   * Check for campaigns that should be triggered by an event
   */
  static async checkEventTriggers(
    userId: string,
    eventType: string,
    eventData?: Record<string, any>
  ): Promise<void> {
    try {
      const { data: campaigns } = await supabase
        .from('vs_marketing_campaigns')
        .select('*')
        .eq('status', 'active')
        .eq('trigger_type', 'event');

      if (!campaigns) return;

      for (const campaign of campaigns) {
        const triggerConfig = campaign.trigger_config as Record<string, any>;
        const triggerEvent = triggerConfig.event_type;

        if (triggerEvent === eventType) {
          // Check conditions if any
          const conditions = triggerConfig.conditions || {};
          let shouldTrigger = true;

          if (conditions.subscription_tier) {
            const { data: profile } = await supabase
              .from('vs_profiles')
              .select('subscription_tier')
              .eq('id', userId)
              .single();

            if (profile?.subscription_tier !== conditions.subscription_tier) {
              shouldTrigger = false;
            }
          }

          if (shouldTrigger) {
            await this.startWorkflow(userId, campaign.id, { triggered_by: eventType });
          }
        }
      }
    } catch (error) {
      logger.error('Error checking event triggers:', error);
    }
  }

  /**
   * Get active campaigns
   */
  static async getActiveCampaigns(): Promise<MarketingCampaign[]> {
    const { data, error } = await supabase
      .from('vs_marketing_campaigns')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as MarketingCampaign[];
  }

  /**
   * Get user's active workflows
   */
  static async getUserWorkflows(userId: string): Promise<MarketingWorkflow[]> {
    const { data, error } = await supabase
      .from('vs_marketing_workflows')
      .select('*, vs_marketing_campaigns(*)')
      .eq('user_id', userId)
      .in('status', ['active', 'paused'])
      .order('started_at', { ascending: false });

    if (error) throw error;
    return (data || []) as MarketingWorkflow[];
  }

  /**
   * Cancel a workflow
   */
  static async cancelWorkflow(workflowId: string): Promise<void> {
    const { error } = await supabase
      .from('vs_marketing_workflows')
      .update({ status: 'cancelled' })
      .eq('id', workflowId);

    if (error) throw error;

    // Cancel pending emails
    await supabase
      .from('vs_email_sends')
      .update({ status: 'failed', error_message: 'Workflow cancelled' })
      .eq('workflow_id', workflowId)
      .eq('status', 'pending');
  }

  /**
   * Update email send status (for webhooks)
   */
  static async updateEmailStatus(
    emailSendId: string,
    status: EmailSend['status'],
    metadata?: Record<string, any>
  ): Promise<void> {
    const updateData: any = { status };

    if (status === 'sent') {
      updateData.sent_at = new Date().toISOString();
    } else if (status === 'opened') {
      updateData.opened_at = new Date().toISOString();
    } else if (status === 'clicked') {
      updateData.clicked_at = new Date().toISOString();
    }

    if (metadata) {
      updateData.metadata = metadata;
    }

    const { error } = await supabase
      .from('vs_email_sends')
      .update(updateData)
      .eq('id', emailSendId);

    if (error) throw error;

    // Update campaign analytics
    if (status === 'sent' || status === 'opened' || status === 'clicked') {
      await this.updateCampaignAnalytics(emailSendId, status);
    }
  }

  /**
   * Update campaign analytics
   */
  static async updateCampaignAnalytics(
    emailSendId: string,
    event: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced'
  ): Promise<void> {
    try {
      const { data: emailSend } = await supabase
        .from('vs_email_sends')
        .select('campaign_id, sent_at')
        .eq('id', emailSendId)
        .single();

      if (!emailSend || !emailSend.campaign_id) return;

      const date = new Date(emailSend.sent_at || Date.now()).toISOString().split('T')[0];

      // Get or create analytics record
      const { data: existing } = await supabase
        .from('vs_campaign_analytics')
        .select('*')
        .eq('campaign_id', emailSend.campaign_id)
        .eq('date', date)
        .single();

      const fieldMap: Record<string, string> = {
        sent: 'emails_sent',
        delivered: 'emails_delivered',
        opened: 'emails_opened',
        clicked: 'emails_clicked',
        bounced: 'emails_bounced',
      };

      const field = fieldMap[event];
      if (!field) return;

      if (existing) {
        await supabase
          .from('vs_campaign_analytics')
          .update({ [field]: (existing[field] || 0) + 1 })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('vs_campaign_analytics')
          .insert({
            campaign_id: emailSend.campaign_id,
            date,
            [field]: 1,
          });
      }
    } catch (error) {
      logger.error('Error updating campaign analytics:', error);
    }
  }
}

