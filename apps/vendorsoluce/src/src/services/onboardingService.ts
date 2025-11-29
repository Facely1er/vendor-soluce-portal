// Onboarding Service - Handles automated onboarding flow
// File: src/services/onboardingService.ts

import { supabase } from '../lib/supabase';
import { TrialService } from './trialService';
import { logger } from '../utils/monitoring';

export class OnboardingService {
  /**
   * Complete onboarding automation
   * Called when user first signs up or starts onboarding
   */
  static async completeOnboarding(userId: string): Promise<void> {
    try {
      // 1. Auto-start trial if eligible
      const eligible = await TrialService.isEligibleForTrial(userId);
      if (eligible) {
        try {
          await TrialService.startTrial(userId, 'professional-monthly');
          await TrialService.sendTrialNotification(userId, 'started');
          logger.info('Trial auto-started during onboarding', { userId });
        } catch (error) {
          logger.error('Failed to auto-start trial during onboarding:', error);
          // Don't block onboarding if trial start fails
        }
      }

      // 2. Create default workspace/team if needed
      await this.createDefaultWorkspace(userId);

      // 3. Send welcome email
      await this.sendWelcomeEmail(userId);

      // 4. Mark onboarding as started
      await this.markOnboardingStarted(userId);

      logger.info('Onboarding automation completed', { userId });
    } catch (error) {
      logger.error('Error completing onboarding:', error);
      // Don't throw - onboarding should continue even if automation fails
    }
  }

  /**
   * Create default workspace for new user
   */
  private static async createDefaultWorkspace(userId: string): Promise<void> {
    try {
      // Check if user already has a workspace
      const { count } = await supabase
        .from('vs_workspaces')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (count && count > 0) {
        // User already has workspace(s)
        return;
      }

      // Create default workspace
      const { error } = await supabase
        .from('vs_workspaces')
        .insert({
          user_id: userId,
          name: 'My Workspace',
          is_default: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (error) {
        // If workspace table doesn't exist or insert fails, log and continue
        logger.warn('Could not create default workspace:', error);
      }
    } catch (error) {
      logger.warn('Error creating default workspace:', error);
      // Don't throw - workspace creation is optional
    }
  }

  /**
   * Send welcome email
   */
  private static async sendWelcomeEmail(userId: string): Promise<void> {
    try {
      await supabase.functions.invoke('send-onboarding-complete-email', {
        body: { userId },
      });
    } catch (error) {
      logger.warn('Error sending welcome email:', error);
      // Don't throw - email failures shouldn't block onboarding
    }
  }

  /**
   * Mark onboarding as started
   */
  private static async markOnboardingStarted(userId: string): Promise<void> {
    try {
      await supabase
        .from('vs_profiles')
        .update({
          onboarding_started: true,
          onboarding_started_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);
    } catch (error) {
      logger.warn('Error marking onboarding as started:', error);
      // Don't throw - this is just tracking
    }
  }

  /**
   * Mark onboarding as completed
   */
  static async markOnboardingCompleted(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('vs_profiles')
        .update({
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        logger.error('Error marking onboarding as completed:', error);
        throw error;
      }

      // Send completion email
      await supabase.functions.invoke('send-onboarding-complete-email', {
        body: { userId },
      });

      logger.info('Onboarding marked as completed', { userId });
    } catch (error) {
      logger.error('Error completing onboarding:', error);
      throw error;
    }
  }

  /**
   * Check if user has completed onboarding
   */
  static async isOnboardingCompleted(userId: string): Promise<boolean> {
    try {
      const { data: profile } = await supabase
        .from('vs_profiles')
        .select('onboarding_completed')
        .eq('id', userId)
        .single();

      return profile?.onboarding_completed === true;
    } catch (error) {
      logger.error('Error checking onboarding status:', error);
      return false;
    }
  }

  /**
   * Get onboarding progress
   */
  static async getOnboardingProgress(userId: string): Promise<{
    completed: boolean;
    checklistItems: {
      addVendor: boolean;
      runAssessment: boolean;
      analyzeSbom: boolean;
      viewDashboard: boolean;
    };
  }> {
    try {
      // Check checklist items
      const [vendorCount, assessmentCount, sbomCount] = await Promise.all([
        supabase
          .from('vs_vendors')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId),
        supabase
          .from('vs_supply_chain_assessments')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId),
        supabase
          .from('vs_sbom_analyses')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId),
      ]);

      const checklistItems = {
        addVendor: (vendorCount.count || 0) > 0,
        runAssessment: (assessmentCount.count || 0) > 0,
        analyzeSbom: (sbomCount.count || 0) > 0,
        viewDashboard: true, // Dashboard is always accessible
      };

      const completed = Object.values(checklistItems).every(item => item === true);

      return {
        completed,
        checklistItems,
      };
    } catch (error) {
      logger.error('Error getting onboarding progress:', error);
      return {
        completed: false,
        checklistItems: {
          addVendor: false,
          runAssessment: false,
          analyzeSbom: false,
          viewDashboard: false,
        },
      };
    }
  }
}

