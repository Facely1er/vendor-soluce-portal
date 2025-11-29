import { supabase } from '../lib/supabase';
import { PRODUCTS, USAGE_PRICING, getUsageLimit } from '../config/stripe';
import { logger } from '../utils/logger';

export interface UsageRecord {
  feature: 'sbom_scans' | 'vendor_assessments' | 'api_calls' | 'additional_users';
  quantity: number;
  period_start: string;
  period_end: string;
}

export class UsageService {
  // Track usage increment
  async incrementUsage(
    userId: string,
    feature: UsageRecord['feature'],
    quantity: number = 1
  ): Promise<{ success: boolean; overLimit: boolean; overageAmount?: number }> {
    try {
      // Get user's subscription tier
      const { data: profile, error: profileError } = await supabase
        .from('vs_profiles')
        .select('subscription_tier')
        .eq('id', userId)
        .single();

      if (profileError || !profile) {
        throw new Error('User not found');
      }

      const profileData = profile as { subscription_tier: string | null };
      const tier = (profileData.subscription_tier || 'free') as keyof typeof PRODUCTS;
      // Map feature name for getUsageLimit
      const limitFeature = feature === 'vendor_assessments' ? 'assessments' : 
                          feature === 'additional_users' ? 'users' : feature;
      const limit = getUsageLimit(tier, limitFeature as keyof typeof PRODUCTS['free']['limits']);

      // Map feature name to database feature name
      const dbFeature = feature === 'vendor_assessments' ? 'assessments' : 
                       feature === 'additional_users' ? 'users' : feature;
      
      // Check current usage
      const { data: currentUsage, error: usageError } = await supabase
        .rpc('check_usage_limit', {
          p_user_id: userId,
          p_feature: dbFeature as 'sbom_scans' | 'api_calls' | 'vendors' | 'assessments' | 'users' | 'data_export' | 'custom_branding' | 'sso' | 'priority_support'
        } as never);

      if (usageError) {
        throw usageError;
      }

      const usageData = currentUsage?.[0] as { used: number; limit_value: number; can_use: boolean } | undefined;
      const used = usageData?.used || 0;
      const canUse = usageData?.can_use || false;

      // Increment usage
      const { error: incrementError } = await supabase.rpc('increment_usage', {
        p_user_id: userId,
        p_feature: dbFeature as 'sbom_scans' | 'api_calls' | 'vendors' | 'assessments' | 'users' | 'data_export' | 'custom_branding' | 'sso' | 'priority_support',
        p_quantity: quantity
      } as never);

      if (incrementError) {
        throw incrementError;
      }

      // Check if over limit
      const newUsed = used + quantity;
      const overLimit = limit !== -1 && newUsed > limit;
      let overageAmount = 0;

      if (overLimit && limit !== -1) {
        const overage = newUsed - limit;
        const pricingTier = tier === 'free' || tier === 'federal' ? 'enterprise' : tier;
        const pricePerUnit = (USAGE_PRICING[feature as keyof typeof USAGE_PRICING] as Record<string, number>)?.[pricingTier] || 0;
        overageAmount = overage * pricePerUnit;
        
        // NOTE: Overage billing is handled via Stripe webhook
        // When usage exceeds limits, the overage is tracked and billed at the end of the billing period
        // Implementation: Create Stripe invoice item via Edge Function (stripe-webhook) when period ends
        // This requires backend integration with Stripe Billing API
        logger.warn(`Overage detected: ${overage} units of ${feature} - $${overageAmount} will be charged`);
      }

      return {
        success: true,
        overLimit: !canUse || overLimit,
        overageAmount: overageAmount > 0 ? overageAmount : undefined
      };
    } catch (error) {
      logger.error('Error incrementing usage:', error);
      throw error;
    }
  }

  // Get current usage for a feature
  async getUsage(
    userId: string,
    feature: UsageRecord['feature']
  ): Promise<{ used: number; limit: number; percentage: number }> {
    try {
      const { data: profile } = await supabase
        .from('vs_profiles')
        .select('subscription_tier')
        .eq('id', userId)
        .single();

      if (!profile) {
        throw new Error('User not found');
      }

      // Map feature name to database feature name
      const dbFeature = feature === 'vendor_assessments' ? 'assessments' : 
                       feature === 'additional_users' ? 'users' : feature;
      
      const { data, error } = await supabase
        .rpc('check_usage_limit', {
          p_user_id: userId,
          p_feature: dbFeature as 'sbom_scans' | 'api_calls' | 'vendors' | 'assessments' | 'users' | 'data_export' | 'custom_branding' | 'sso' | 'priority_support'
        } as never);

      if (error) {
        throw error;
      }

      const usageData = data?.[0] as { used: number; limit_value: number; can_use: boolean } | undefined;
      const used = usageData?.used || 0;
      const limit = usageData?.limit_value || 0;
      const percentage = limit === -1 || limit === 0 ? 0 : Math.min(100, (used / limit) * 100);

      return { used, limit, percentage };
    } catch (error) {
      logger.error('Error getting usage:', error);
      throw error;
    }
  }

  // Get usage summary for all features
  async getUsageSummary(userId: string) {
    try {
      const features: UsageRecord['feature'][] = [
        'sbom_scans',
        'vendor_assessments',
        'api_calls',
        'additional_users'
      ];

      const summary = await Promise.all(
        features.map(async (feature) => {
          const usage = await this.getUsage(userId, feature);
          return {
            feature,
            ...usage
          };
        })
      );

      return summary;
    } catch (error) {
      logger.error('Error getting usage summary:', error);
      throw error;
    }
  }

  // Check if user can perform an action
  async canPerformAction(
    userId: string,
    feature: UsageRecord['feature']
  ): Promise<{ canPerform: boolean; used: number; limit: number; message?: string }> {
    try {
      // Map feature name to database feature name
      const dbFeature = feature === 'vendor_assessments' ? 'assessments' : 
                       feature === 'additional_users' ? 'users' : feature;
      
      const { data, error } = await supabase
        .rpc('check_usage_limit', {
          p_user_id: userId,
          p_feature: dbFeature as 'sbom_scans' | 'api_calls' | 'vendors' | 'assessments' | 'users' | 'data_export' | 'custom_branding' | 'sso' | 'priority_support'
        } as never);

      if (error) {
        throw error;
      }

      const used = (data?.[0] as { used: number; limit_value: number; can_use: boolean } | undefined)?.used || 0;
      const limit = (data?.[0] as { used: number; limit_value: number; can_use: boolean } | undefined)?.limit_value || 0;
      const canUse = (data?.[0] as { used: number; limit_value: number; can_use: boolean } | undefined)?.can_use || false;

      let message: string | undefined;
      if (!canUse && limit !== -1) {
        message = `You've reached your limit of ${limit} ${feature.replace('_', ' ')}. Please upgrade your plan or purchase additional capacity.`;
      }

      return {
        canPerform: canUse,
        used,
        limit,
        message
      };
    } catch (error) {
      logger.error('Error checking usage limit:', error);
      throw error;
    }
  }
}

