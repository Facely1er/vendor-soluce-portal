import { logger } from '../utils/logger';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { PRODUCTS, canAccessFeature, getUsageLimit } from '../config/stripe';

interface Subscription {
  id: string;
  tier: keyof typeof PRODUCTS;
  status: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
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
          logger.info('Subscription changed:', payload);
          fetchSubscription();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, fetchSubscription]);

  const checkFeatureAccess = (feature: string): boolean => {
    const tier = subscription?.tier || profile?.subscription_tier || 'free';
    return canAccessFeature(tier as keyof typeof PRODUCTS, feature);
  };

  const getLimit = (resource: string): number => {
    const tier = subscription?.tier || profile?.subscription_tier || 'free';
    return getUsageLimit(tier as keyof typeof PRODUCTS, resource as keyof typeof PRODUCTS[keyof typeof PRODUCTS]['limits']);
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
    daysUntilRenewal,
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

      const used = data?.reduce((sum, record) => sum + (record.quantity || 0), 0) || 0;
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
  }, [user, feature, tier, getLimit]);

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
      // Call RPC function to increment usage
      const { error } = await supabase.rpc('increment_usage', {
        p_user_id: user.id,
        p_feature: feature,
        p_quantity: quantity,
      });

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