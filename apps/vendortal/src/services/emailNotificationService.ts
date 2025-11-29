/**
 * Email Notification Service
 * Handles sending email notifications for assessment events
 */

import { supabase } from '../lib/supabase';
import { logger } from '../utils/logger';

export interface EmailNotificationParams {
  to: string;
  template: 'assessment_sent' | 'assessment_submitted' | 'assessment_approved' | 'assessment_revision';
  data: {
    vendorName?: string;
    organizationName?: string;
    assessmentName?: string;
    assessmentId?: string;
    portalUrl?: string;
    comments?: string;
    dueDate?: string;
  };
}

export class EmailNotificationService {
  /**
   * Send email notification via Edge Function
   */
  static async sendEmail(params: EmailNotificationParams): Promise<boolean> {
    try {
      const { to, template, data } = params;

      // Generate subject based on template
      let subject = '';
      switch (template) {
        case 'assessment_sent':
          subject = `New Assessment Request: ${data.assessmentName || 'Security Assessment'}`;
          break;
        case 'assessment_submitted':
          subject = `Assessment Submitted: ${data.assessmentName || 'Security Assessment'}`;
          break;
        case 'assessment_approved':
          subject = `Assessment Approved: ${data.assessmentName || 'Security Assessment'}`;
          break;
        case 'assessment_revision':
          subject = `Assessment Revision Requested: ${data.assessmentName || 'Security Assessment'}`;
          break;
      }

      // Call Edge Function to send email
      const { error } = await supabase.functions.invoke('send-assessment-email', {
        body: {
          to,
          subject,
          template,
          data
        }
      });

      if (error) {
        logger.error('Failed to send email notification:', error);
        return false;
      }

      logger.info('Email notification sent successfully:', { to, template });
      return true;
    } catch (error) {
      logger.error('Error sending email notification:', error);
      return false;
    }
  }

  /**
   * Send assessment sent notification
   */
  static async notifyAssessmentSent(
    vendorEmail: string,
    vendorName: string,
    organizationName: string,
    assessmentName: string,
    assessmentId: string,
    dueDate?: string
  ): Promise<boolean> {
    const siteUrl = import.meta.env.VITE_SITE_URL || 'https://vendortal.vercel.app';
    const portalUrl = `${siteUrl}/vendor-assessments/${assessmentId}`;

    return this.sendEmail({
      to: vendorEmail,
      template: 'assessment_sent',
      data: {
        vendorName,
        organizationName,
        assessmentName,
        assessmentId,
        portalUrl,
        dueDate
      }
    });
  }

  /**
   * Send assessment submitted notification
   */
  static async notifyAssessmentSubmitted(
    reviewerEmail: string,
    vendorName: string,
    assessmentName: string,
    assessmentId: string
  ): Promise<boolean> {
    return this.sendEmail({
      to: reviewerEmail,
      template: 'assessment_submitted',
      data: {
        vendorName,
        assessmentName,
        assessmentId
      }
    });
  }

  /**
   * Send assessment approved notification
   */
  static async notifyAssessmentApproved(
    vendorEmail: string,
    vendorName: string,
    organizationName: string,
    assessmentName: string
  ): Promise<boolean> {
    return this.sendEmail({
      to: vendorEmail,
      template: 'assessment_approved',
      data: {
        vendorName,
        organizationName,
        assessmentName
      }
    });
  }

  /**
   * Send assessment revision requested notification
   */
  static async notifyAssessmentRevision(
    vendorEmail: string,
    vendorName: string,
    organizationName: string,
    assessmentName: string,
    assessmentId: string,
    comments?: string
  ): Promise<boolean> {
    const siteUrl = import.meta.env.VITE_SITE_URL || 'https://vendortal.vercel.app';
    const portalUrl = `${siteUrl}/vendor-assessments/${assessmentId}`;

    return this.sendEmail({
      to: vendorEmail,
      template: 'assessment_revision',
      data: {
        vendorName,
        organizationName,
        assessmentName,
        assessmentId,
        portalUrl,
        comments
      }
    });
  }
}

