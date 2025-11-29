import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { UsageService } from '../services/usageService';
import { logger } from '../utils/logger';

export function useUsageTracking(feature: 'sbom_scans' | 'vendor_assessments' | 'api_calls') {
  const { user } = useAuth();
  const [usage, setUsage] = useState({ used: 0, limit: 0, percentage: 0 });
  const [loading, setLoading] = useState(true);
  const usageServiceRef = useRef<UsageService | null>(null);
  if (!usageServiceRef.current) {
    usageServiceRef.current = new UsageService();
  }
  const usageService = usageServiceRef.current;

  const loadUsage = useCallback(async () => {
    if (!user) return;
    try {
      const data = await usageService.getUsage(user.id, feature);
      setUsage(data);
    } catch (error) {
      logger.error('Error loading usage:', error);
    } finally {
      setLoading(false);
    }
  }, [user, feature, usageService]);

  useEffect(() => {
    if (user) {
      loadUsage();
    }
  }, [user, loadUsage]);

  const trackUsage = async (quantity: number = 1) => {
    if (!user) return { success: false };
    try {
      const result = await usageService.incrementUsage(user.id, feature, quantity);
      await loadUsage();
      return result;
    } catch (error) {
      logger.error('Error tracking usage:', error);
      return { success: false, error };
    }
  };

  const checkLimit = async () => {
    if (!user) return { canPerform: false, used: 0, limit: 0 };
    try {
      return await usageService.canPerformAction(user.id, feature);
    } catch (error) {
      logger.error('Error checking limit:', error);
      return { canPerform: false, used: 0, limit: 0 };
    }
  };

  return {
    usage,
    loading,
    trackUsage,
    checkLimit,
    refresh: loadUsage,
    isAtLimit: usage.limit !== -1 && usage.used >= usage.limit,
    isNearLimit: usage.limit !== -1 && usage.percentage >= 80
  };
}

