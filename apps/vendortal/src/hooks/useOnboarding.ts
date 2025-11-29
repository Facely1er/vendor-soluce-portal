import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface OnboardingData {
  companyName: string;
  industry: string;
  companySize: string;
  complianceFrameworks: string[];
  primaryUseCase: string;
  vendorsCount: number;
  teamSize: number;
  budget: string;
  timeline: string;
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
    dataExport: boolean;
  };
}

interface OnboardingState {
  isCompleted: boolean;
  currentStep: number;
  totalSteps: number;
  data: OnboardingData | null;
  isLoading: boolean;
  error: string | null;
}

export function useOnboarding() {
  const [state, setState] = useState<OnboardingState>({
    isCompleted: false,
    currentStep: 0,
    totalSteps: 8,
    data: null,
    isLoading: true,
    error: null
  });

  const { user, profile } = useAuth();

  const checkOnboardingStatus = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Check if user has completed onboarding
      const isCompleted = (profile as any)?.onboarding_completed || false;
      const onboardingData = (profile as any)?.onboarding_data || null;

      setState(prev => ({
        ...prev,
        isCompleted,
        data: onboardingData,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to check onboarding status',
        isLoading: false
      }));
    }
  }, [profile]);

  useEffect(() => {
    if (user && profile) {
      checkOnboardingStatus();
    }
  }, [user, profile, checkOnboardingStatus]);

  const updateOnboardingData = async (_stepId: string, data: Partial<OnboardingData>) => {
    try {
      if (!user?.id) {
        return { success: false, error: 'User not authenticated' };
      }

      const updatedData = { ...state.data, ...data };

      // Update local state
      setState(prev => ({
        ...prev,
        data: updatedData as OnboardingData
      }));

      // Save to database
      const { error } = await (supabase
        .from('vs_profiles') as any)
        .update({
          onboarding_data: updatedData,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error updating onboarding data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  };

  const completeOnboarding = async () => {
    try {
      if (!user?.id) {
        return { success: false, error: 'User not authenticated' };
      }

      setState(prev => ({ ...prev, isLoading: true }));

      const { error } = await (supabase
        .from('vs_profiles') as any)
        .update({
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      setState(prev => ({
        ...prev,
        isCompleted: true,
        isLoading: false
      }));

      return { success: true };
    } catch (error) {
      console.error('Error completing onboarding:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({
        ...prev,
        error: 'Failed to complete onboarding',
        isLoading: false
      }));
      return { success: false, error: errorMessage };
    }
  };

  const resetOnboarding = async () => {
    try {
      if (!user?.id) {
        return { success: false, error: 'User not authenticated' };
      }

      setState(prev => ({ ...prev, isLoading: true }));

      const { error } = await (supabase
        .from('vs_profiles') as any)
        .update({
          onboarding_completed: false,
          onboarding_data: null,
          onboarding_completed_at: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      setState(prev => ({
        ...prev,
        isCompleted: false,
        data: null,
        currentStep: 0,
        isLoading: false
      }));

      return { success: true };
    } catch (error) {
      console.error('Error resetting onboarding:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  };

  const getOnboardingProgress = () => {
    if (!state.data) return 0;
    
    const fields = [
      'companyName',
      'industry', 
      'companySize',
      'complianceFrameworks',
      'primaryUseCase',
      'vendorsCount',
      'teamSize',
      'budget',
      'timeline',
      'preferences'
    ];

    const completedFields = fields.filter(field => {
      const value = state.data?.[field as keyof OnboardingData];
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object') return Object.keys(value).length > 0;
      return value !== '' && value !== null && value !== undefined;
    });

    return (completedFields.length / fields.length) * 100;
  };

  const getRecommendedPlan = () => {
    if (!state.data) return 'starter';

    const { companySize, vendorsCount, teamSize, budget } = state.data;

    // Enterprise criteria
    if (companySize === 'enterprise' || vendorsCount > 100 || teamSize > 10) {
      return 'enterprise';
    }

    // Professional criteria
    if (companySize === 'large' || vendorsCount > 25 || teamSize > 3 || budget === '5k-10k' || budget === '10k-plus') {
      return 'professional';
    }

    // Default to starter
    return 'starter';
  };

  const getOnboardingInsights = () => {
    if (!state.data) return null;

    const { industry, complianceFrameworks, primaryUseCase: _primaryUseCase, vendorsCount, teamSize } = state.data;

    const insights = [];

    // Industry insights
    if (industry === 'government' || industry === 'finance') {
      insights.push({
        type: 'security',
        message: 'High-security industry detected. Consider Enterprise plan for advanced compliance features.',
        priority: 'high'
      });
    }

    // Compliance insights
    if (complianceFrameworks.includes('fedramp') || complianceFrameworks.includes('fisma')) {
      insights.push({
        type: 'compliance',
        message: 'Federal compliance requirements detected. Enterprise plan recommended for full audit support.',
        priority: 'high'
      });
    }

    // Scale insights
    if (vendorsCount > 50) {
      insights.push({
        type: 'scale',
        message: 'Large vendor portfolio detected. Consider Professional or Enterprise plan for unlimited assessments.',
        priority: 'medium'
      });
    }

    // Team insights
    if (teamSize > 5) {
      insights.push({
        type: 'team',
        message: 'Large team detected. Professional plan includes 5 users, Enterprise includes unlimited users.',
        priority: 'medium'
      });
    }

    return insights;
  };

  return {
    ...state,
    updateOnboardingData,
    completeOnboarding,
    resetOnboarding,
    getOnboardingProgress,
    getRecommendedPlan,
    getOnboardingInsights
  };
}
