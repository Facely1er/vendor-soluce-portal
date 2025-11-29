import { logger } from '../../utils/logger';
import React, { useState, useEffect, useCallback } from 'react';
import { CreditCard, Calendar, AlertCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { PRODUCTS } from '../../config/stripe';
import { AnnualUpsellBanner } from './AnnualUpsellBanner';

interface Subscription {
  id: string;
  tier: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  stripe_subscription_id: string;
}

export const SubscriptionManager: React.FC = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

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

      setSubscription(data);
    } catch (err: unknown) {
      logger.error('Error fetching subscription:', err);
      setError('Failed to load subscription details');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleManageBilling = async () => {
    try {
      setActionLoading(true);
      setError(null);

      // Call Supabase Edge Function to create portal session
      const { data, error } = await supabase.functions.invoke('create-portal-session', {
        body: {
          userId: user?.id,
          returnUrl: window.location.href,
        },
      });

      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Failed to create billing portal session');
      }
    } catch (err: unknown) {
      logger.error('Error opening billing portal:', err);
      setError(err instanceof Error ? err.message : 'Failed to open billing portal');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription?.stripe_subscription_id) return;

    const confirmed = window.confirm(
      'Are you sure you want to cancel your subscription? You will retain access until the end of your billing period.'
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError(null);

      const { error } = await supabase.functions.invoke('cancel-subscription', {
        body: {
          subscriptionId: subscription.stripe_subscription_id,
          userId: user?.id,
        },
      });

      if (error) throw error;

      setSuccessMessage('Your subscription has been cancelled. You will retain access until the end of your billing period.');
      await fetchSubscription();
    } catch (err: unknown) {
      logger.error('Error cancelling subscription:', err);
      setError(err instanceof Error ? err.message : 'Failed to cancel subscription');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivateSubscription = async () => {
    if (!subscription?.stripe_subscription_id) return;

    try {
      setActionLoading(true);
      setError(null);

      const { error } = await supabase.functions.invoke('reactivate-subscription', {
        body: {
          subscriptionId: subscription.stripe_subscription_id,
          userId: user?.id,
        },
      });

      if (error) throw error;

      setSuccessMessage('Your subscription has been reactivated.');
      await fetchSubscription();
    } catch (err: unknown) {
      logger.error('Error reactivating subscription:', err);
      setError(err instanceof Error ? err.message : 'Failed to reactivate subscription');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  const currentPlan = subscription?.tier || 'free';
  const product = PRODUCTS[currentPlan as keyof typeof PRODUCTS];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
      case 'trialing':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            {status === 'trialing' ? 'Trial' : 'Active'}
          </span>
        );
      case 'canceled':
      case 'incomplete':
      case 'past_due':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="w-3 h-3 mr-1" />
            {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            {status}
          </span>
        );
    }
  };

  // const currentTier = subscription?.tier || 'free'; // Reserved for future use

  return (
    <div className="space-y-6">
      {/* Annual Prepay Upsell Banner - Show for monthly subscribers */}
      {subscription && subscription.tier !== 'free' && (
        <AnnualUpsellBanner 
          currentTier={subscription.tier} 
          onSwitch={fetchSubscription}
        />
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg flex items-start">
          <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Subscription Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Current Plan</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {product.name}
                </p>
                {product.price > 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ${product.price}/month
                  </p>
                )}
              </div>
              {subscription && getStatusBadge(subscription.status)}
            </div>

            {subscription && (
              <>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    {subscription.cancel_at_period_end ? (
                      <span>
                        Cancels on {new Date(subscription.current_period_end).toLocaleDateString()}
                      </span>
                    ) : (
                      <span>
                        Renews on {new Date(subscription.current_period_end).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleManageBilling}
                    disabled={actionLoading}
                    className="flex-1"
                  >
                    {actionLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CreditCard className="w-4 h-4 mr-2" />
                    )}
                    Manage Billing
                  </Button>

                  {subscription.cancel_at_period_end ? (
                    <Button
                      variant="primary"
                      onClick={handleReactivateSubscription}
                      disabled={actionLoading}
                      className="flex-1"
                    >
                      Reactivate
                    </Button>
                  ) : subscription.tier !== 'free' && (
                    <Button
                      variant="outline"
                      onClick={handleCancelSubscription}
                      disabled={actionLoading}
                      className="flex-1 text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </>
            )}

            {!subscription || subscription.tier === 'free' && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Upgrade to unlock more features
                </p>
                <Button
                  variant="primary"
                  onClick={() => window.location.href = '/pricing'}
                  className="w-full"
                >
                  View Plans
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Usage Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Usage This Month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">SBOM Scans</span>
              <span className="text-sm font-medium">
                3 / {product.limits.sbom_scans === -1 ? '∞' : product.limits.sbom_scans}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Vendors</span>
              <span className="text-sm font-medium">
                2 / {product.limits.vendors === -1 ? '∞' : product.limits.vendors}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Assessments</span>
              <span className="text-sm font-medium">
                1 / {product.limits.assessments === -1 ? '∞' : product.limits.assessments}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">API Calls</span>
              <span className="text-sm font-medium">
                0 / {product.limits.api_calls === -1 ? '∞' : product.limits.api_calls}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};