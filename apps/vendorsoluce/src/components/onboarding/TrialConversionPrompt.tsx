// Trial Conversion Prompt - Prompts users to convert trial to paid
// File: src/components/onboarding/TrialConversionPrompt.tsx

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { X, Crown, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../hooks/useSubscription';
import { TrialService } from '../../services/trialService';
import { logger } from '../../utils/logger';

interface TrialConversionPromptProps {
  onDismiss?: () => void;
  showAfterDays?: number; // Show prompt after X days of trial
}

export const TrialConversionPrompt: React.FC<TrialConversionPromptProps> = ({
  onDismiss,
  showAfterDays = 7,
}) => {
  const { user } = useAuth();
  const { isTrialing } = useSubscription();
  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!user || !isTrialing() || dismissed) return;

    const fetchDaysRemaining = async () => {
      try {
        const days = await TrialService.getTrialDaysRemaining(user.id);
        setDaysRemaining(days);
      } catch (error) {
        logger.error('Error fetching trial days remaining:', error);
      }
    };

    fetchDaysRemaining();
  }, [user, isTrialing, dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) {
      onDismiss();
    }
  };

  // Don't show if:
  // - Not trialing
  // - Dismissed
  // - Less than showAfterDays days have passed
  // - Less than 3 days remaining (use countdown banner instead)
  if (
    !isTrialing() ||
    dismissed ||
    daysRemaining > 14 - showAfterDays ||
    daysRemaining <= 3
  ) {
    return null;
  }

  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 relative">
      <CardContent className="p-6">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Dismiss trial conversion prompt"
          title="Dismiss"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
            <Crown className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Love what you're seeing?
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Upgrade now to keep your Professional tier access after your trial ends.
              You'll continue with all the features you've been using.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <Check className="h-4 w-4 text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0" />
                Keep all your data and assessments
              </div>
              <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <Check className="h-4 w-4 text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0" />
                No interruption to your workflow
              </div>
              <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <Check className="h-4 w-4 text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0" />
                Priority support included
              </div>
              <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <Check className="h-4 w-4 text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0" />
                Cancel anytime
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/pricing" className="flex-1">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Professional
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={handleDismiss}
                className="sm:w-auto"
              >
                Maybe Later
              </Button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              {daysRemaining} days remaining in your trial
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

