/**
 * Stripe Client Library
 * Handles all Stripe-related operations
 */

import { loadStripe, Stripe } from '@stripe/stripe-js';
import { STRIPE_CONFIG } from '../config/stripe';
import { logger } from '../utils/monitoring';

// Type definitions
interface Subscription {
  id: string;
  status: string;
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
  items: {
    data: Array<{
      id: string;
      price: {
        id: string;
        unit_amount: number;
        currency: string;
        recurring: {
          interval: string;
        };
      };
    }>;
  };
}


// Initialize Stripe
let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    if (!STRIPE_CONFIG.publishableKey) {
      logger.error('Stripe publishable key not configured');
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);
  }
  return stripePromise;
};

// Types for Stripe operations
export interface CreateCheckoutSessionParams {
  priceId: string;
  customerId?: string;
  customerEmail: string;
  userId: string;
  successUrl?: string;
  cancelUrl?: string;
  trialPeriodDays?: number;
  metadata?: Record<string, string>;
}

export interface CreatePortalSessionParams {
  customerId: string;
  returnUrl?: string;
}

export interface StripeError {
  type: string;
  message: string;
  code?: string;
}

// Stripe API client for server-side operations
export class StripeClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  /**
   * Create a Stripe Checkout session
   */
  async createCheckoutSession(params: CreateCheckoutSessionParams): Promise<{ sessionId: string; url: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create checkout session');
      }

      return await response.json();
    } catch (error) {
      logger.error('Error creating checkout session', { error });
      throw error;
    }
  }

  /**
   * Create a Stripe Customer Portal session
   */
  async createPortalSession(params: CreatePortalSessionParams): Promise<{ url: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/create-portal-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create portal session');
      }

      return await response.json();
    } catch (error) {
      logger.error('Error creating portal session', { error });
      throw error;
    }
  }

  /**
   * Retrieve subscription details
   */
  async getSubscription(subscriptionId: string): Promise<Subscription> {
    try {
      const response = await fetch(`${this.baseUrl}/subscription/${subscriptionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to retrieve subscription');
      }

      return await response.json();
    } catch (error) {
      logger.error('Error retrieving subscription', { error });
      throw error;
    }
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId: string, immediately: boolean = false): Promise<{ success: boolean; subscription?: Record<string, unknown> }> {
    try {
      const response = await fetch(`${this.baseUrl}/cancel-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId,
          immediately,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to cancel subscription');
      }

      return await response.json();
    } catch (error) {
      logger.error('Error canceling subscription', { error });
      throw error;
    }
  }

  /**
   * Update subscription (upgrade/downgrade)
   */
  async updateSubscription(subscriptionId: string, newPriceId: string): Promise<{ success: boolean; subscription?: Record<string, unknown> }> {
    try {
      const response = await fetch(`${this.baseUrl}/update-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId,
          newPriceId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update subscription');
      }

      return await response.json();
    } catch (error) {
      logger.error('Error updating subscription', { error });
      throw error;
    }
  }

  /**
   * Get customer's payment methods
   */
  async getPaymentMethods(customerId: string): Promise<Record<string, unknown>[]> {
    try {
      const response = await fetch(`${this.baseUrl}/payment-methods/${customerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to retrieve payment methods');
      }

      return await response.json();
    } catch (error) {
      logger.error('Error retrieving payment methods', { error });
      throw error;
    }
  }

  /**
   * Get customer's invoices
   */
  async getInvoices(customerId: string, limit: number = 10): Promise<Record<string, unknown>[]> {
    try {
      const response = await fetch(`${this.baseUrl}/invoices/${customerId}?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to retrieve invoices');
      }

      return await response.json();
    } catch (error) {
      logger.error('Error retrieving invoices', { error });
      throw error;
    }
  }

  /**
   * Get usage records for metered billing
   */
  async getUsageRecords(subscriptionId: string, startDate?: Date, endDate?: Date): Promise<Record<string, unknown>> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('start', startDate.toISOString());
      if (endDate) params.append('end', endDate.toISOString());

      const response = await fetch(`${this.baseUrl}/usage/${subscriptionId}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to retrieve usage records');
      }

      return await response.json();
    } catch (error) {
      logger.error('Error retrieving usage records', { error });
      throw error;
    }
  }

  /**
   * Report usage for metered billing
   */
  async reportUsage(subscriptionId: string, feature: string, quantity: number): Promise<Record<string, unknown>> {
    try {
      const response = await fetch(`${this.baseUrl}/report-usage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId,
          feature,
          quantity,
          timestamp: Math.floor(Date.now() / 1000),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to report usage');
      }

      return await response.json();
    } catch (error) {
      logger.error('Error reporting usage', { error });
      throw error;
    }
  }
}

// Create default client instance
export const stripeClient = new StripeClient();

// Utility functions
export function formatAmount(amount: number, currency: string = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

export function formatInterval(interval: string, intervalCount: number = 1): string {
  if (intervalCount === 1) {
    return `per ${interval}`;
  }
  return `every ${intervalCount} ${interval}s`;
}

export default getStripe;