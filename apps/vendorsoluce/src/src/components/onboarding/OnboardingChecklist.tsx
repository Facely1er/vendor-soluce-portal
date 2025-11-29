// Onboarding Checklist - Guides users through key features during trial
// File: src/components/onboarding/OnboardingChecklist.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Check, Circle, ArrowRight, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { OnboardingService } from '../../services/onboardingService';
import { logger } from '../../utils/logger';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  route: string;
  completed: boolean;
}

export const OnboardingChecklist: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: 'add-vendor',
      title: 'Add Your First Vendor',
      description: 'Create a vendor risk profile',
      route: '/vendor-risk-dashboard',
      completed: false,
    },
    {
      id: 'run-assessment',
      title: 'Run Supply Chain Assessment',
      description: 'Complete a NIST SP 800-161 assessment',
      route: '/supply-chain-assessment',
      completed: false,
    },
    {
      id: 'analyze-sbom',
      title: 'Analyze an SBOM',
      description: 'Upload and analyze a Software Bill of Materials',
      route: '/sbom-analyzer',
      completed: false,
    },
    {
      id: 'view-dashboard',
      title: 'Explore Your Dashboard',
      description: 'Review your risk metrics and analytics',
      route: '/dashboard',
      completed: false,
    },
  ]);

  const checkCompletionStatus = useCallback(async () => {
    if (!user) return;

    try {
      // Check if user has vendors
      const { count: vendorCount } = await supabase
        .from('vs_vendors')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Check if user has assessments
      const { count: assessmentCount } = await supabase
        .from('vs_supply_chain_assessments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Check if user has SBOM analyses
      const { count: sbomCount } = await supabase
        .from('vs_sbom_analyses')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      setChecklist((prev) =>
        prev.map((item) => {
          if (item.id === 'add-vendor') {
            return { ...item, completed: (vendorCount || 0) > 0 };
          }
          if (item.id === 'run-assessment') {
            return { ...item, completed: (assessmentCount || 0) > 0 };
          }
          if (item.id === 'analyze-sbom') {
            return { ...item, completed: (sbomCount || 0) > 0 };
          }
          if (item.id === 'view-dashboard') {
            return { ...item, completed: true }; // Dashboard is always accessible
          }
          return item;
        })
      );
    } catch (error) {
      logger.error('Error checking completion status:', error);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    checkCompletionStatus();
  }, [user, checkCompletionStatus]);

  const completedCount = checklist.filter((item) => item.completed).length;
  const progress = (completedCount / checklist.length) * 100;

  // Auto-mark onboarding as completed when all items are done
  useEffect(() => {
    const markComplete = async () => {
      if (completedCount === checklist.length && user?.id) {
        try {
          await OnboardingService.markOnboardingCompleted(user.id);
        } catch (error) {
          logger.error('Error marking onboarding complete:', error);
        }
      }
    };

    markComplete();
  }, [completedCount, checklist.length, user?.id]);

  const handleItemClick = (route: string) => {
    navigate(route);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Target className="h-5 w-5 text-vendorsoluce-green mr-2" />
            <CardTitle>Getting Started Checklist</CardTitle>
          </div>
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
            {completedCount} of {checklist.length} completed
          </Badge>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            {/* Note: Inline style required for dynamic percentage width - cannot be moved to external CSS */}
            <div
              className="bg-vendorsoluce-green h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {checklist.map((item) => (
            <div
              key={item.id}
              className={`flex items-start p-4 rounded-lg border-2 transition-all cursor-pointer ${
                item.completed
                  ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                  : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-vendorsoluce-green'
              }`}
              onClick={() => handleItemClick(item.route)}
            >
              <div className="flex-shrink-0 mr-4 mt-1">
                {item.completed ? (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                ) : (
                  <Circle className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <h4
                  className={`font-medium mb-1 ${
                    item.completed
                      ? 'text-green-900 dark:text-green-100'
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {item.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
              <ArrowRight
                className={`h-5 w-5 ml-2 flex-shrink-0 ${
                  item.completed
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-400'
                }`}
              />
            </div>
          ))}
        </div>

        {completedCount === checklist.length && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
              <p className="text-sm text-green-800 dark:text-green-300">
                Great job! You've completed the onboarding checklist. Explore more features
                or upgrade to continue after your trial.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

