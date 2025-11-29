// Trial Countdown Banner - Shows days remaining in trial
// File: src/components/onboarding/TrialCountdownBanner.tsx

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { TrialService } from '../../services/trialService';
import { useSubscription } from '../../hooks/useSubscription';
import { logger } from '../../utils/logger';

export const TrialCountdownBanner: React.FC = () => {
  const { user } = useAuth();
  const { isTrialing } = useSubscription();
  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !isTrialing()) {
      setIsLoading(false);
      return;
    }

    const fetchDaysRemaining = async () => {
      try {
        const days = await TrialService.getTrialDaysRemaining(user.id);
        setDaysRemaining(days);
      } catch (error) {
        logger.error('Error fetching trial days remaining:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDaysRemaining();

    // Update every hour
    const interval = setInterval(fetchDaysRemaining, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user, isTrialing]);

  if (!isTrialing() || isLoading) {
    return null;
  }

  const isUrgent = daysRemaining <= 3;
  const isWarning = daysRemaining <= 7;

  return (
    <Card
      className={`border-2 ${
        isUrgent
          ? 'border-red-200 dark:border-red-800 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20'
          : isWarning
          ? 'border-orange-200 dark:border-orange-800 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20'
          : 'border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                isUrgent
                  ? 'bg-red-100 dark:bg-red-900/30'
                  : isWarning
                  ? 'bg-orange-100 dark:bg-orange-900/30'
                  : 'bg-blue-100 dark:bg-blue-900/30'
              }`}
            >
              {isUrgent ? (
                <AlertCircle
                  className={`h-5 w-5 ${
                    isUrgent
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-orange-600 dark:text-orange-400'
                  }`}
                />
              ) : (
                <Clock
                  className={`h-5 w-5 ${
                    isWarning
                      ? 'text-orange-600 dark:text-orange-400'
                      : 'text-blue-600 dark:text-blue-400'
                  }`}
                />
              )}
            </div>
            <div className="flex-1">
              <h3
                className={`font-semibold mb-1 ${
                  isUrgent
                    ? 'text-red-900 dark:text-red-100'
                    : isWarning
                    ? 'text-orange-900 dark:text-orange-100'
                    : 'text-blue-900 dark:text-blue-100'
                }`}
              >
                {daysRemaining === 0
                  ? 'Trial ends today!'
                  : daysRemaining === 1
                  ? 'Trial ends tomorrow!'
                  : `${daysRemaining} days left in your trial`}
              </h3>
              <p
                className={`text-sm ${
                  isUrgent
                    ? 'text-red-700 dark:text-red-300'
                    : isWarning
                    ? 'text-orange-700 dark:text-orange-300'
                    : 'text-blue-700 dark:text-blue-300'
                }`}
              >
                {isUrgent
                  ? 'Upgrade now to keep your Professional tier access'
                  : isWarning
                  ? 'Upgrade to continue using all Professional features'
                  : 'Upgrade to keep your Professional tier access after trial'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 ml-4">
            <Badge
              className={
                isUrgent
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  : isWarning
                  ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
              }
            >
              {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}
            </Badge>
            <Link to="/pricing">
              <Button
                className={
                  isUrgent
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : isWarning
                    ? 'bg-orange-600 hover:bg-orange-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }
              >
                Upgrade Now
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

