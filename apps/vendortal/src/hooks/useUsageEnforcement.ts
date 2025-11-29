import { useState } from 'react';
import { useSubscription, useUsageTracking } from './useSubscription';

interface UseUsageEnforcementOptions {
  feature: 'vendors' | 'assessments' | 'users' | 'sbom_scans';
  onUpgrade?: () => void;
}

export function useUsageEnforcement(options: UseUsageEnforcementOptions) {
  const { feature, onUpgrade } = options;
  const { tier } = useSubscription();
  const { usage } = useUsageTracking(feature);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const canPerformAction = (): boolean => {
    if (!usage) return false;
    return usage.canUse;
  };

  const enforceUsage = (): boolean => {
    if (canPerformAction()) {
      return true;
    }

    // Show upgrade modal if limit reached
    setShowUpgradeModal(true);
    return false;
  };

  const handleUpgrade = () => {
    setShowUpgradeModal(false);
    if (onUpgrade) {
      onUpgrade();
    } else {
      // Default: redirect to pricing
      window.location.href = '/pricing';
    }
  };

  return {
    canPerformAction,
    enforceUsage,
    usage,
    showUpgradeModal,
    setShowUpgradeModal,
    handleUpgrade,
    tier,
    feature,
  };
}

// Convenience hooks for specific features
export function useVendorEnforcement() {
  return useUsageEnforcement({ feature: 'vendors' });
}

export function useAssessmentEnforcement() {
  return useUsageEnforcement({ feature: 'assessments' });
}

export function useUserEnforcement() {
  return useUsageEnforcement({ feature: 'users' });
}

