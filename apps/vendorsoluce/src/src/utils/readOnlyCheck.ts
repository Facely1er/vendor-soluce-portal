// Read-Only Mode Check Utility
// Checks if user account is in read-only mode during grace period
// File: src/utils/readOnlyCheck.ts

import { supabase } from '../lib/supabase';
import { logger } from './logger';

export interface ReadOnlyStatus {
  isReadOnly: boolean;
  reason?: string;
  gracePeriodEnd?: Date;
  daysUntilDeletion?: number;
}

/**
 * Check if the current user's account is in read-only mode
 * @param userId - User ID to check
 * @returns Read-only status information
 */
interface SubscriptionData {
  is_read_only?: boolean;
  cancel_at_period_end?: boolean;
  current_period_end?: string;
  grace_period_end?: string;
  data_deleted_at?: string;
}

export async function checkReadOnlyStatus(userId: string): Promise<ReadOnlyStatus> {
  try {
    const { data: subscription, error } = await supabase
      .from('vs_subscriptions')
      .select('is_read_only, cancel_at_period_end, current_period_end, grace_period_end, data_deleted_at')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      logger.error('Error checking read-only status:', error);
      return { isReadOnly: false };
    }

    if (!subscription) {
      return { isReadOnly: false };
    }

    const sub = subscription as SubscriptionData;

    // Check if data already deleted
    if (sub.data_deleted_at) {
      return {
        isReadOnly: true,
        reason: 'Account data has been permanently deleted',
      };
    }

    // Check if explicitly marked as read-only
    if (sub.is_read_only === true) {
      const graceEnd = sub.grace_period_end 
        ? new Date(sub.grace_period_end)
        : null;
      const daysUntilDeletion = graceEnd
        ? Math.ceil((graceEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : undefined;

      return {
        isReadOnly: true,
        reason: 'Account is in grace period - read-only mode for data export',
        gracePeriodEnd: graceEnd || undefined,
        daysUntilDeletion: daysUntilDeletion && daysUntilDeletion > 0 ? daysUntilDeletion : undefined,
      };
    }

    // Check if in grace period (cancelled and past period end)
    if (sub.cancel_at_period_end && sub.current_period_end) {
      const periodEnd = new Date(sub.current_period_end);
      const now = new Date();

      if (periodEnd <= now && sub.grace_period_end) {
        const graceEnd = new Date(sub.grace_period_end);
        if (now <= graceEnd) {
          const daysUntilDeletion = Math.ceil((graceEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          return {
            isReadOnly: true,
            reason: 'Account is in grace period - read-only mode for data export',
            gracePeriodEnd: graceEnd,
            daysUntilDeletion: daysUntilDeletion > 0 ? daysUntilDeletion : undefined,
          };
        }
      }
    }

    return { isReadOnly: false };
  } catch (error) {
    logger.error('Error checking read-only status:', error);
    return { isReadOnly: false };
  }
}

/**
 * Check if user can perform write operations
 * Throws error if in read-only mode
 */
export async function assertWriteAccess(userId: string): Promise<void> {
  const status = await checkReadOnlyStatus(userId);
  if (status.isReadOnly) {
    throw new Error(
      status.reason || 'Account is in read-only mode. Data export is available, but modifications are not allowed.'
    );
  }
}

