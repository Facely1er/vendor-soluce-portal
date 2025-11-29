// Marketing Automation Hook
// React hook for managing marketing automation workflows
// File: src/hooks/useMarketingAutomation.ts

import { useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { MarketingAutomationService } from '../services/marketingAutomationService';
import { logger } from '../utils/monitoring';

export function useMarketingAutomation() {
  const { user, profile } = useAuth();

  /**
   * Log a user event (triggers event-based campaigns)
   */
  const logEvent = useCallback(async (
    eventType: string,
    eventData?: Record<string, any>
  ) => {
    if (!user?.id) return;

    try {
      await MarketingAutomationService.logUserEvent(user.id, eventType, eventData);
    } catch (error) {
      logger.error('Error logging marketing event:', error);
    }
  }, [user?.id]);

  /**
   * Trigger welcome workflow for new users
   */
  const triggerWelcomeWorkflow = useCallback(async () => {
    if (!user?.id) return;

    try {
      // Find welcome campaign
      const campaigns = await MarketingAutomationService.getActiveCampaigns();
      const welcomeCampaign = campaigns.find(c => c.type === 'welcome');

      if (welcomeCampaign) {
        await MarketingAutomationService.startWorkflow(user.id, welcomeCampaign.id, {
          triggered_by: 'user_signup',
        });
      }
    } catch (error) {
      logger.error('Error triggering welcome workflow:', error);
    }
  }, [user?.id]);

  /**
   * Trigger abandoned cart workflow
   */
  const triggerAbandonedCartWorkflow = useCallback(async () => {
    if (!user?.id) return;

    try {
      const campaigns = await MarketingAutomationService.getActiveCampaigns();
      const abandonedCartCampaign = campaigns.find(c => c.type === 'abandoned_cart');

      if (abandonedCartCampaign) {
        await MarketingAutomationService.startWorkflow(user.id, abandonedCartCampaign.id, {
          triggered_by: 'checkout_started',
        });
      }
    } catch (error) {
      logger.error('Error triggering abandoned cart workflow:', error);
    }
  }, [user?.id]);

  /**
   * Common event triggers
   */
  const events = {
    // User lifecycle
    signup: () => logEvent('user_signup', { timestamp: new Date().toISOString() }),
    login: () => logEvent('user_login', { timestamp: new Date().toISOString() }),
    onboardingComplete: () => logEvent('onboarding_complete', { timestamp: new Date().toISOString() }),
    
    // Product usage
    firstVendorAdded: () => logEvent('first_vendor_added', { timestamp: new Date().toISOString() }),
    firstAssessmentCompleted: () => logEvent('first_assessment_completed', { timestamp: new Date().toISOString() }),
    firstSBOMAnalyzed: () => logEvent('first_sbom_analyzed', { timestamp: new Date().toISOString() }),
    
    // Engagement
    dashboardViewed: () => logEvent('dashboard_viewed', { timestamp: new Date().toISOString() }),
    featureUsed: (featureName: string) => logEvent('feature_used', { feature: featureName, timestamp: new Date().toISOString() }),
    
    // Conversion
    checkoutStarted: (planId?: string) => logEvent('checkout_started', { plan_id: planId, timestamp: new Date().toISOString() }),
    subscriptionCreated: (planId: string, amount: number) => logEvent('subscription_created', { plan_id: planId, amount, timestamp: new Date().toISOString() }),
    trialStarted: () => logEvent('trial_started', { timestamp: new Date().toISOString() }),
    trialExpiring: (daysRemaining: number) => logEvent('trial_expiring', { days_remaining: daysRemaining, timestamp: new Date().toISOString() }),
    
    // Churn risk
    usageLimitReached: (feature: string) => logEvent('usage_limit_reached', { feature, timestamp: new Date().toISOString() }),
    inactiveUser: (daysInactive: number) => logEvent('user_inactive', { days_inactive: daysInactive, timestamp: new Date().toISOString() }),
  };

  return {
    logEvent,
    triggerWelcomeWorkflow,
    triggerAbandonedCartWorkflow,
    events,
  };
}

