// Trial Start Banner - Shown during onboarding to start trial
// File: src/components/onboarding/TrialStartBanner.tsx

import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Check, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TrialService } from '../../services/trialService';
import { useSubscription } from '../../hooks/useSubscription';
import { logger } from '../../utils/logger';

export const TrialStartBanner: React.FC = () => {
  const { user } = useAuth();
  const { isTrialing, refetch } = useSubscription();
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartTrial = async () => {
    if (!user) return;

    setIsStarting(true);
    setError(null);

    try {
      // Check if eligible
      const eligible = await TrialService.isEligibleForTrial(user.id);
      if (!eligible) {
        setError('You already have an active subscription or trial');
        setIsStarting(false);
        return;
      }

      // Start trial
      await TrialService.startTrial(user.id, 'professional-monthly');
      
      // Refresh subscription data
      await refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start trial');
      logger.error('Error starting trial:', err);
    } finally {
      setIsStarting(false);
    }
  };

  // Don't show if already trialing
  if (isTrialing()) {
    return null;
  }

  return (
    <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-3">
                <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Start Your 14-Day Free Trial
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No credit card required • Full Professional tier access
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <Check className="h-4 w-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                Supply Chain Risk Assessment
              </div>
              <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <Check className="h-4 w-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                SBOM Analysis with vulnerability scanning
              </div>
              <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <Check className="h-4 w-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                Vendor Risk Monitoring & Analytics
              </div>
              <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <Check className="h-4 w-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                Up to 100 vendor risk profiles
              </div>
            </div>

            {error && (
              <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
              </div>
            )}

            <Button
              onClick={handleStartTrial}
              disabled={isStarting}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isStarting ? (
                <>Starting Trial...</>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start Free Trial Now
                </>
              )}
            </Button>
          </div>

          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 ml-4">
            14 Days Free
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

