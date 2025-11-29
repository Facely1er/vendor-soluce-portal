import React from 'react';
import { AlertCircle, X, ArrowRight, Shield, Check } from 'lucide-react';
import { PRODUCTS } from '../../config/stripe';
import { USAGE_PRICING } from '../../config/stripe';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  feature: string;
  currentTier: string;
  used: number;
  limit: number;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
  feature,
  currentTier,
  used,
  limit,
}) => {
  if (!isOpen) return null;

  const currentPlan = PRODUCTS[currentTier as keyof typeof PRODUCTS];
  const featureLabels: Record<string, string> = {
    vendors: 'Vendors',
    assessments: 'Assessments',
    users: 'Team Members',
    sbom_scans: 'SBOM Scans',
  };

  const featureLabel = featureLabels[feature] || feature;

  // Calculate overage pricing
  const overagePricing = USAGE_PRICING[feature as keyof typeof USAGE_PRICING];
  const overagePrice = overagePricing?.[currentTier as keyof typeof overagePricing] || 0;

  // Get upgrade options
  const upgradeOptions = Object.entries(PRODUCTS).filter(
    ([tier]) => tier !== 'free' && tier !== currentTier
  ).map(([tier, plan]) => ({
    tier,
    plan,
  }));

  const upgradeFeatures = (tier: string) => {
    const plan = PRODUCTS[tier as keyof typeof PRODUCTS];
    const limits = plan.limits;
    const label = featureLabels[feature] || feature;
    const newLimit = limits[feature as keyof typeof limits];

    if (newLimit === -1) return `Unlimited ${label}`;
    return `${newLimit} ${label}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
          onClick={onClose}
        />

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-6 pt-6 pb-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    You've Reached Your Limit
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    You've used all {limit} of your {featureLabel} on the {currentPlan.name} plan
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Current Usage: {used} / {limit} {featureLabel}
              </p>
              {overagePrice > 0 && (
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  Overage pricing: ${overagePrice} per additional {featureLabel.toLowerCase()}
                </p>
              )}
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Upgrade to unlock more {featureLabel}
              </h4>

              <div className="space-y-3">
                {upgradeOptions.map(({ tier, plan }) => (
                  <div
                    key={tier}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer"
                    onClick={onUpgrade}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h5 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {plan.name}
                        </h5>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          ${plan.price}/month
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        <Shield className="w-3 h-3 mr-1" />
                        Upgrade
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>{upgradeFeatures(tier)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {overagePrice > 0 && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Or pay for overage
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Continue using your current plan and pay ${overagePrice} per additional {featureLabel.toLowerCase()}. Bills monthly.
                </p>
              </div>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={onUpgrade}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg inline-flex items-center"
            >
              View Plans
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

