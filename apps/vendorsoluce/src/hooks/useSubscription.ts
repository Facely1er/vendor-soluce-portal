import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { PRODUCTS, canAccessFeature, getUsageLimit } from '../config/stripe';
import { logger } from '../utils/logger';

interface Subscription {
  id: string;
  tier: keyof typeof PRODUCTS;
  status: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  grace_period_start?: string | null;
  grace_period_end?: string | null;
  data_deleted_at?: string | null;
  is_read_only?: boolean | null;
}

interface UsageData {
  feature: string;
  used: number;
  limit: number;
  canUse: boolean;
  percentageUsed: number;
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, profile } = useAuth();

  const fetchSubscription = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vs_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setSubscription(data || {
        id: '',
        tier: 'free',
        status: 'active',
        current_period_end: '',
        cancel_at_period_end: false,
      });
    } catch (err: unknown) {
      logger.error('Error fetching subscription:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchSubscription();

    // Subscribe to subscription changes
    const subscription = supabase
      .channel('subscription_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vs_subscriptions',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          logger.log('Subscription changed:', payload);
          fetchSubscription();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, fetchSubscription]);

  const checkFeatureAccess = (feature: string): boolean => {
    const tier = (subscription?.tier || profile?.subscription_tier || 'free') as keyof typeof PRODUCTS;
    return canAccessFeature(tier, feature);
  };

  const getLimit = (resource: string): number => {
    const tier = (subscription?.tier || profile?.subscription_tier || 'free') as keyof typeof PRODUCTS;
    return getUsageLimit(tier, resource as keyof typeof PRODUCTS['free']['limits']);
  };

  const isActive = (): boolean => {
    return subscription?.status === 'active' || subscription?.status === 'trialing';
  };

  const isTrialing = (): boolean => {
    return subscription?.status === 'trialing';
  };

  const isCanceled = (): boolean => {
    return subscription?.cancel_at_period_end === true;
  };

  const daysUntilRenewal = (): number => {
    if (!subscription?.current_period_end) return 0;
    const end = new Date(subscription.current_period_end);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const isReadOnly = (): boolean => {
    if (!subscription) return false;
    
    // Check if explicitly marked as read-only
    if (subscription.is_read_only === true) return true;
    
    // Check if in grace period (cancelled and past period end)
    if (subscription.cancel_at_period_end && subscription.current_period_end) {
      const periodEnd = new Date(subscription.current_period_end);
      const now = new Date();
      if (periodEnd <= now && subscription.grace_period_end) {
        const graceEnd = new Date(subscription.grace_period_end);
        // In grace period if past period end but before grace period end
        if (now <= graceEnd) return true;
      }
    }
    
    return false;
  };

  const daysUntilDataDeletion = (): number | null => {
    if (!subscription?.grace_period_end) return null;
    const graceEnd = new Date(subscription.grace_period_end);
    const now = new Date();
    const diff = graceEnd.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return {
    subscription,
    loading,
    error,
    tier: subscription?.tier || 'free',
    checkFeatureAccess,
    getLimit,
    isActive,
    isTrialing,
    isCanceled,
    isReadOnly,
    daysUntilRenewal,
    daysUntilDataDeletion,
    refetch: fetchSubscription,
  };
}

export function useUsageTracking(feature: string) {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { tier, getLimit } = useSubscription();

  const fetchUsage = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get current period dates
      const now = new Date();
      const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      // Fetch usage for current period
      const { data, error } = await supabase
        .from('vs_usage_records')
        .select('quantity')
        .eq('user_id', user.id)
        .eq('feature', feature)
        .gte('period_start', periodStart.toISOString())
        .lte('period_end', periodEnd.toISOString());

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      const used = data?.reduce((sum, record) => {
        const recordData = record as { quantity: number };
        return sum + (recordData.quantity || 0);
      }, 0) || 0;
      const limit = getLimit(feature);
      const canUse = limit === -1 || used < limit;
      const percentageUsed = limit === -1 ? 0 : (used / limit) * 100;

      setUsage({
        feature,
        used,
        limit,
        canUse,
        percentageUsed,
      });
    } catch (err: unknown) {
      logger.error('Error fetching usage:', err);
    } finally {
      setLoading(false);
    }
  }, [user, feature, getLimit]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchUsage();
  }, [user, feature, tier, fetchUsage]);

  const trackUsage = async (quantity: number = 1): Promise<boolean> => {
    if (!user || !usage) return false;

    // Check if user can use the feature
    if (!usage.canUse) {
      return false;
    }

    try {
      // Map feature name to database feature name
      const dbFeature = feature === 'vendor_assessments' ? 'assessments' : 
                       feature === 'additional_users' ? 'users' : feature;
      
      // Call RPC function to increment usage
      const { error } = await supabase.rpc('increment_usage', {
        p_user_id: user.id,
        p_feature: dbFeature as 'sbom_scans' | 'api_calls' | 'vendors' | 'assessments' | 'users' | 'data_export' | 'custom_branding' | 'sso' | 'priority_support',
        p_quantity: quantity,
      } as never);

      if (error) throw error;

      // Refresh usage data
      await fetchUsage();
      
      return true;
    } catch (err: unknown) {
      logger.error('Error tracking usage:', err);
      return false;
    }
  };

  return {
    usage,
    loading,
    trackUsage,
    refetch: fetchUsage,
  };
}