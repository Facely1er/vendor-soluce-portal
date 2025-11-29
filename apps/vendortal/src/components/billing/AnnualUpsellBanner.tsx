import React, { useState } from 'react';
import { Calendar, DollarSign, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { PRODUCTS } from '../../config/stripe';
import { ANNUAL_DISCOUNT } from '../../config/stripe';

interface AnnualUpsellBannerProps {
  currentTier: string;
  onSwitch?: () => void;
}

interface SubscriptionData {
  stripe_subscription_id: string;
}

export const AnnualUpsellBanner: React.FC<AnnualUpsellBannerProps> = ({ currentTier, onSwitch }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const currentPlan = PRODUCTS[currentTier as keyof typeof PRODUCTS];
  
  if (!currentPlan || currentPlan.price === 0) return null; // Free tier - no upsell

  // Calculate annual pricing
  const monthlyPrice = currentPlan.price;
  const annualPrice = Math.round(monthlyPrice * 12 * (1 - ANNUAL_DISCOUNT)); // 20% discount
  const monthlyEquivalent = Math.round(annualPrice / 12);
  const savingsAmount = (monthlyPrice * 12) - annualPrice;
  const savingsPercent = Math.round((savingsAmount / (monthlyPrice * 12)) * 100);

  const handleSwitchToAnnual = async () => {
    if (!user) {
      setError('Please sign in to switch to annual billing');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get Stripe subscription ID
      const { data: subscription, error: subError } = await supabase
        .from('vs_subscriptions')
        .select('stripe_subscription_id')
        .eq('user_id', user.id)
        .single<SubscriptionData>();

      if (subError) throw subError;

      if (!subscription?.stripe_subscription_id) {
        throw new Error('No active subscription found');
      }

      // Call Supabase Edge Function to switch to annual
      const { error: switchError } = await supabase.functions.invoke('switch-to-annual', {
        body: {
          subscriptionId: subscription.stripe_subscription_id,
          userId: user.id,
          newPriceId: getAnnualPriceId(currentTier),
        },
      });

      if (switchError) throw switchError;

      // Show success and reload
      setError(null);
      if (onSwitch) {
        onSwitch();
      } else {
        window.location.reload();
      }
    } catch (err: unknown) {
      console.error('Error switching to annual:', err);
      setError(err instanceof Error ? err.message : 'Failed to switch to annual billing');
    } finally {
      setLoading(false);
    }
  };

  const getAnnualPriceId = (tier: string): string => {
    // Map to annual price IDs (these would need to be created in Stripe)
    const annualPriceMap: Record<string, string> = {
      starter: 'price_starter_annual',
      professional: 'price_professional_annual',
      enterprise: 'price_enterprise_annual',
      federal: 'price_federal_annual',
    };
    return annualPriceMap[tier] || '';
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Save ${savingsAmount.toLocaleString()} with Annual Billing
              </h3>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                {savingsPercent}% OFF
              </span>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Switch to annual billing and get 2 months free. That's only <strong className="text-gray-900 dark:text-white">${monthlyEquivalent}</strong> per month instead of ${monthlyPrice}.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>12 months</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <DollarSign className="w-4 h-4" />
                <span>${savingsAmount.toLocaleString()} saved</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Sparkles className="w-4 h-4" />
                <span>Same features</span>
              </div>
            </div>

            {error && (
              <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleSwitchToAnnual}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Switching...
                </>
              ) : (
                <>
                  Switch to Annual Billing
                </>
              )}
            </button>
          </div>
        </div>

        <button
          onClick={() => {/* Close banner logic */}}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Dismiss"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

