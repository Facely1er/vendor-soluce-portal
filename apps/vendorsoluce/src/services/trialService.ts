// Trial Service - Handles trial creation and management without credit card
// File: src/services/trialService.ts

import { supabase } from '../lib/supabase';
import { getProductById } from '../lib/stripeProducts';
import { logger } from '../utils/monitoring';

export interface TrialSubscription {
  id: string;
  user_id: string;
  tier: string;
  status: 'trialing';
  trial_start: string;
  trial_end: string;
  current_period_end: string;
}

export class TrialService {
  /**
   * Start a free trial for a user without requiring credit card
   * Grants Professional tier access for 14 days
   */
  static async startTrial(
    userId: string,
    productId: string = 'professional-monthly'
  ): Promise<TrialSubscription> {
    try {
      const product = getProductById(productId);
      if (!product) {
        throw new Error(`Product not found: ${productId}`);
      }

      // Check if user already has an active subscription or trial
      const { data: existingSubscription } = await supabase
        .from('vs_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .in('status', ['active', 'trialing'])
        .single();

      if (existingSubscription) {
        throw new Error('User already has an active subscription or trial');
      }

      // Calculate trial dates
      const now = new Date();
      const trialStart = now.toISOString();
      const trialEnd = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString();
      const periodEnd = trialEnd;

      // Determine tier from product
      const tier = product.name.toLowerCase().includes('professional')
        ? 'professional'
        : product.name.toLowerCase().includes('starter')
        ? 'starter'
        : product.name.toLowerCase().includes('enterprise')
        ? 'enterprise'
        : 'professional'; // Default to professional for trial

      // Create trial subscription in database
      const { data: subscription, error } = await supabase
        .from('vs_subscriptions')
        .insert({
          user_id: userId,
          stripe_subscription_id: `trial_${userId}_${Date.now()}`, // Temporary ID
          stripe_customer_id: `trial_customer_${userId}`, // Temporary ID
          status: 'trialing',
          tier: tier,
          trial_start: trialStart,
          trial_end: trialEnd,
          current_period_start: trialStart,
          current_period_end: periodEnd,
          metadata: {
            product_id: productId,
            product_name: product.name,
            trial: true,
            no_credit_card: true,
          },
        })
        .select()
        .single();

      if (error) {
        logger.error('Error creating trial subscription:', error);
        throw error;
      }

      // Update user profile subscription tier
      await supabase
        .from('vs_profiles')
        .update({ subscription_tier: tier })
        .eq('id', userId);

      logger.info('Trial started successfully', {
        userId,
        productId,
        tier,
        trialEnd,
      });

      return subscription as TrialSubscription;
    } catch (error) {
      logger.error('Error starting trial:', error);
      throw error;
    }
  }

  /**
   * Check if user is eligible for a trial
   */
  static async isEligibleForTrial(userId: string): Promise<boolean> {
    try {
      const { data: subscription } = await supabase
        .from('vs_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .in('status', ['active', 'trialing', 'past_due'])
        .single();

      // User is eligible if they don't have any active subscription
      return !subscription;
    } catch (error) {
      // If no subscription found, user is eligible
      return true;
    }
  }

  /**
   * Get trial days remaining
   */
  static async getTrialDaysRemaining(userId: string): Promise<number> {
    try {
      const { data: subscription } = await supabase
        .from('vs_subscriptions')
        .select('trial_end')
        .eq('user_id', userId)
        .eq('status', 'trialing')
        .single();

      if (!subscription || !subscription.trial_end) {
        return 0;
      }

      const trialEnd = new Date(subscription.trial_end);
      const now = new Date();
      const diff = trialEnd.getTime() - now.getTime();
      const daysRemaining = Math.ceil(diff / (1000 * 60 * 60 * 24));

      return Math.max(0, daysRemaining);
    } catch (error) {
      return 0;
    }
  }

  /**
   * Convert trial to paid subscription
   * This will be called when user adds payment method
   */
  static async convertTrialToPaid(
    userId: string,
    stripeSubscriptionId: string,
    stripeCustomerId: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('vs_subscriptions')
        .update({
          stripe_subscription_id: stripeSubscriptionId,
          stripe_customer_id: stripeCustomerId,
          status: 'active',
          metadata: {
            ...(await supabase
              .from('vs_subscriptions')
              .select('metadata')
              .eq('user_id', userId)
              .single()
              .then(({ data }) => data?.metadata || {})),
            trial_converted: true,
            converted_at: new Date().toISOString(),
          },
        })
        .eq('user_id', userId)
        .eq('status', 'trialing');

      if (error) {
        logger.error('Error converting trial to paid:', error);
        throw error;
      }

      logger.info('Trial converted to paid subscription', {
        userId,
        stripeSubscriptionId,
      });
    } catch (error) {
      logger.error('Error converting trial:', error);
      throw error;
    }
  }

  /**
   * Cancel trial (user cancels before trial ends)
   */
  static async cancelTrial(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('vs_subscriptions')
        .update({
          status: 'canceled',
          cancel_at: new Date().toISOString(),
          cancel_at_period_end: true,
        })
        .eq('user_id', userId)
        .eq('status', 'trialing');

      if (error) {
        logger.error('Error canceling trial:', error);
        throw error;
      }

      // Revert user to free tier
      await supabase
        .from('vs_profiles')
        .update({ subscription_tier: 'free' })
        .eq('id', userId);

      logger.info('Trial canceled', { userId });
    } catch (error) {
      logger.error('Error canceling trial:', error);
      throw error;
    }
  }

  /**
   * Send trial notification emails
   */
  static async sendTrialNotification(
    userId: string,
    type: 'started' | 'ending_soon' | 'expired'
  ): Promise<void> {
    try {
      // Get user email
      const { data: profile } = await supabase
        .from('vs_profiles')
        .select('email, full_name')
        .eq('id', userId)
        .single();

      if (!profile || !profile.email) {
        logger.warn('User profile or email not found for notification', { userId });
        return;
      }

      // Get subscription details if needed
      const { data: subscription } = await supabase
        .from('vs_subscriptions')
        .select('id, trial_end')
        .eq('user_id', userId)
        .eq('status', 'trialing')
        .single();

      // Calculate days remaining if ending soon
      let daysRemaining: number | undefined;
      if (type === 'ending_soon' && subscription?.trial_end) {
        const trialEnd = new Date(subscription.trial_end);
        const now = new Date();
        const diff = trialEnd.getTime() - now.getTime();
        daysRemaining = Math.ceil(diff / (1000 * 60 * 60 * 24));
      }

      // Call Supabase Edge Function to send email
      const { error } = await supabase.functions.invoke('send-trial-notification', {
        body: {
          userId,
          email: profile.email,
          name: profile.full_name || 'User',
          type,
          subscriptionId: subscription?.id,
          daysRemaining,
        },
      });

      if (error) {
        logger.error('Error invoking trial notification function:', error);
        // Don't throw - email failures shouldn't break the flow
        return;
      }

      logger.info('Trial notification sent', { userId, type });
    } catch (error) {
      logger.error('Error sending trial notification:', error);
      // Don't throw - email failures shouldn't break the flow
    }
  }

  /**
   * Check and send trial end warnings (for manual triggering)
   */
  static async checkAndSendTrialWarnings(): Promise<void> {
    try {
      const now = new Date();
      const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      const oneDayFromNow = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);

      // Find trials ending in 3 days (within 24 hour window)
      const threeDaysStart = new Date(threeDaysFromNow);
      threeDaysStart.setHours(0, 0, 0, 0);
      const threeDaysEnd = new Date(threeDaysFromNow);
      threeDaysEnd.setHours(23, 59, 59, 999);

      const { data: trialsEndingSoon } = await supabase
        .from('vs_subscriptions')
        .select('user_id, trial_end')
        .eq('status', 'trialing')
        .gte('trial_end', threeDaysStart.toISOString())
        .lte('trial_end', threeDaysEnd.toISOString());

      // Find trials ending in 1 day (within 24 hour window)
      const oneDayStart = new Date(oneDayFromNow);
      oneDayStart.setHours(0, 0, 0, 0);
      const oneDayEnd = new Date(oneDayFromNow);
      oneDayEnd.setHours(23, 59, 59, 999);

      const { data: trialsEndingTomorrow } = await supabase
        .from('vs_subscriptions')
        .select('user_id, trial_end')
        .eq('status', 'trialing')
        .gte('trial_end', oneDayStart.toISOString())
        .lte('trial_end', oneDayEnd.toISOString());

      // Send notifications
      for (const trial of trialsEndingSoon || []) {
        await this.sendTrialNotification(trial.user_id, 'ending_soon');
      }

      for (const trial of trialsEndingTomorrow || []) {
        await this.sendTrialNotification(trial.user_id, 'ending_soon');
      }

      logger.info('Trial warnings checked', {
        threeDayWarnings: trialsEndingSoon?.length || 0,
        oneDayWarnings: trialsEndingTomorrow?.length || 0,
      });
    } catch (error) {
      logger.error('Error checking trial warnings:', error);
    }
  }
}

