import React, { useState } from 'react';
import { useOnboarding } from '../../hooks/useOnboarding';
import { X, ArrowRight, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';

const OnboardingCompletionBanner: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(false);
  const { isCompleted, getOnboardingProgress, getOnboardingInsights } = useOnboarding();

  if (isCompleted || isDismissed) {
    return null;
  }

  const progress = getOnboardingProgress();
  const insights = getOnboardingInsights();

  const getProgressMessage = () => {
    if (progress === 0) {
      return "Complete your setup to unlock all features";
    } else if (progress < 50) {
      return "You're making great progress! Complete setup to get the most out of VendorTal";
    } else if (progress < 100) {
      return "Almost there! Complete the final steps to unlock all features";
    } else {
      return "Setup complete! You're ready to secure your supply chain";
    }
  };

  const getNextSteps = () => {
    const steps = [];
    
    if (progress < 30) {
      steps.push("Add company information");
    }
    if (progress < 60) {
      steps.push("Select compliance frameworks");
    }
    if (progress < 80) {
      steps.push("Choose your subscription plan");
    }
    if (progress < 100) {
      steps.push("Complete team setup");
    }

    return steps.slice(0, 2); // Show max 2 next steps
  };

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <Settings className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                  Complete Your Setup
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {getProgressMessage()}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Setup Progress
                </span>
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Next Steps */}
            {getNextSteps().length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Next Steps:
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  {getNextSteps().map((step, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <ArrowRight className="h-3 w-3" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Insights */}
            {insights && insights.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Recommendations:
                </h4>
                <div className="space-y-2">
                  {insights.slice(0, 2).map((insight, index) => (
                    <div
                      key={index}
                      className={`text-sm p-2 rounded ${
                        insight.priority === 'high'
                          ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
                          : 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                      }`}
                    >
                      {insight.message}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => window.location.href = '/onboarding'}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Complete Setup
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsDismissed(true)}
                className="text-blue-600 hover:text-blue-700"
              >
                Dismiss
              </Button>
            </div>
          </div>

          <button
            onClick={() => setIsDismissed(true)}
            className="flex-shrink-0 text-blue-400 hover:text-blue-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OnboardingCompletionBanner;
