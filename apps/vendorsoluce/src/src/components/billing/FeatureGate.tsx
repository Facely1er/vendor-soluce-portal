import React from 'react';
import { Lock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useSubscription } from '../../hooks/useSubscription';
import { PRODUCTS } from '../../config/stripe';

interface FeatureGateProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
  requiredTier?: keyof typeof PRODUCTS;
}

export const FeatureGate: React.FC<FeatureGateProps> = ({
  feature,
  children,
  fallback,
  showUpgradePrompt = true,
  requiredTier,
}) => {
  const { checkFeatureAccess, loading } = useSubscription();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vendorsoluce-green"></div>
      </div>
    );
  }

  const hasAccess = checkFeatureAccess(feature);

  if (hasAccess) {
    return <>{children}</>;
  }

  // Find the minimum tier that has this feature
  const getRequiredTier = (): keyof typeof PRODUCTS => {
    if (requiredTier) return requiredTier;

    const tiers: Array<keyof typeof PRODUCTS> = ['starter', 'professional', 'enterprise'];
    
    for (const t of tiers) {
      const product = PRODUCTS[t];
      if (product.limits && Object.keys(product.limits).includes(feature)) {
        const limit = product.limits[feature as keyof typeof product.limits];
        if (limit && limit !== 0) {
          return t;
        }
      }
    }
    
    return 'professional'; // Default to professional if not found
  };

  const recommendedTier = getRequiredTier();
  const recommendedProduct = PRODUCTS[recommendedTier];

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgradePrompt) {
    return null;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-vendorsoluce-pale-green rounded-full flex items-center justify-center">
          <Lock className="h-8 w-8 text-vendorsoluce-green" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Upgrade to Access This Feature
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        This feature is available on the {recommendedProduct.name} plan and above.
        Upgrade your subscription to unlock this and many other premium features.
      </p>

      <div className="bg-white dark:bg-gray-700 rounded-lg p-4 mb-6 max-w-sm mx-auto">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Starting at</div>
        <div className="text-3xl font-bold text-gray-900 dark:text-white">
          ${recommendedProduct.price}
          <span className="text-base font-normal text-gray-600 dark:text-gray-400">/month</span>
        </div>
      </div>

      <div className="space-y-3 mb-6 max-w-md mx-auto text-left">
        {recommendedProduct.features.slice(0, 5).map((feat, index) => (
          <div key={index} className="flex items-start">
            <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">{feat}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-3 justify-center">
        <Link to="/pricing">
          <Button variant="primary">
            View All Plans
          </Button>
        </Link>
        <Link to="/pricing#compare">
          <Button variant="outline">
            Compare Features
          </Button>
        </Link>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
        14-day free trial • Cancel anytime • No credit card required for trial
      </p>
    </div>
  );
};

interface UsageLimitGateProps {
  feature: string;
  children: React.ReactNode;
  onLimitReached?: () => void;
  customMessage?: string;
}

export const UsageLimitGate: React.FC<UsageLimitGateProps> = ({
  feature,
  children,
  onLimitReached,
  customMessage,
}) => {
  const { tier } = useSubscription();
  const { usage, loading } = useUsageTracking(feature);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vendorsoluce-green"></div>
      </div>
    );
  }

  if (!usage || usage.canUse) {
    return <>{children}</>;
  }

  // User has reached their limit
  if (onLimitReached) {
    onLimitReached();
  }

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
            Usage Limit Reached
          </h4>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
            {customMessage || `You've used ${usage.used} out of ${usage.limit} ${feature} available in your ${tier} plan this month.`}
          </p>
          
          <div className="w-full bg-yellow-200 dark:bg-yellow-800 rounded-full h-2 mb-4">
            <div 
              className="bg-yellow-600 dark:bg-yellow-400 h-2 rounded-full"
              style={{ width: `${Math.min(usage.percentageUsed, 100)}%` }}
            />
          </div>

          <div className="flex gap-3">
            <Link to="/pricing">
              <Button variant="primary" size="sm">
                Upgrade Plan
              </Button>
            </Link>
            <Link to="/account/usage">
              <Button variant="outline" size="sm">
                View Usage Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for showing remaining usage
export const UsageIndicator: React.FC<{ feature: string; className?: string }> = ({ 
  feature, 
  className = '' 
}) => {
  const { usage, loading } = useUsageTracking(feature);

  if (loading || !usage) return null;

  if (usage.limit === -1) {
    return (
      <span className={`text-xs text-gray-500 dark:text-gray-400 ${className}`}>
        Unlimited
      </span>
    );
  }

  const remaining = usage.limit - usage.used;
  const isLow = usage.percentageUsed > 80;

  return (
    <span className={`text-xs ${isLow ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400'} ${className}`}>
      {remaining} remaining of {usage.limit}
    </span>
  );
};

import { useUsageTracking } from '../../hooks/useSubscription';