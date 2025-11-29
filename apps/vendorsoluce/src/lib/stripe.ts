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
      const error = new Error('Stripe publishable key not configured. Please configure VITE_STRIPE_PUBLISHABLE_KEY environment variable.');
      logger.error(error.message);
      return Promise.reject(error);
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
    // Validate baseUrl
    if (!baseUrl || (typeof baseUrl === 'string' && !baseUrl.startsWith('http') && !baseUrl.startsWith('/'))) {
      throw new Error('Invalid baseUrl: must be a valid URL or path starting with /');
    }
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
        let errorMessage = 'Failed to create checkout session';
        try {
          const error = await response.json();
          errorMessage = error.message || error.error || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      try {
        return await response.json();
      } catch (error) {
        logger.error('Failed to parse checkout session response', { error });
        throw new Error('Invalid JSON response from checkout session endpoint');
      }
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
        let errorMessage = 'Failed to create portal session';
        try {
          const error = await response.json();
          errorMessage = error.message || error.error || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      try {
        return await response.json();
      } catch (error) {
        logger.error('Failed to parse portal session response', { error });
        throw new Error('Invalid JSON response from portal session endpoint');
      }
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
        let errorMessage = 'Failed to retrieve subscription';
        try {
          const error = await response.json();
          errorMessage = error.message || error.error || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      try {
        return await response.json();
      } catch (error) {
        logger.error('Failed to parse subscription response', { error });
        throw new Error('Invalid JSON response from subscription endpoint');
      }
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
        let errorMessage = 'Failed to cancel subscription';
        try {
          const error = await response.json();
          errorMessage = error.message || error.error || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      try {
        return await response.json();
      } catch (error) {
        logger.error('Failed to parse cancel subscription response', { error });
        throw new Error('Invalid JSON response from cancel subscription endpoint');
      }
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
        let errorMessage = 'Failed to update subscription';
        try {
          const error = await response.json();
          errorMessage = error.message || error.error || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      try {
        return await response.json();
      } catch (error) {
        logger.error('Failed to parse update subscription response', { error });
        throw new Error('Invalid JSON response from update subscription endpoint');
      }
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
        let errorMessage = 'Failed to retrieve payment methods';
        try {
          const error = await response.json();
          errorMessage = error.message || error.error || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      try {
        return await response.json();
      } catch (error) {
        logger.error('Failed to parse payment methods response', { error });
        throw new Error('Invalid JSON response from payment methods endpoint');
      }
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
        let errorMessage = 'Failed to retrieve invoices';
        try {
          const error = await response.json();
          errorMessage = error.message || error.error || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      try {
        return await response.json();
      } catch (error) {
        logger.error('Failed to parse invoices response', { error });
        throw new Error('Invalid JSON response from invoices endpoint');
      }
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
      if (startDate && startDate instanceof Date && !isNaN(startDate.getTime())) {
        params.append('start', startDate.toISOString());
      }
      if (endDate && endDate instanceof Date && !isNaN(endDate.getTime())) {
        params.append('end', endDate.toISOString());
      }

      const response = await fetch(`${this.baseUrl}/usage/${subscriptionId}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        let errorMessage = 'Failed to retrieve usage records';
        try {
          const error = await response.json();
          errorMessage = error.message || error.error || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      try {
        return await response.json();
      } catch (error) {
        logger.error('Failed to parse usage records response', { error });
        throw new Error('Invalid JSON response from usage records endpoint');
      }
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
        let errorMessage = 'Failed to report usage';
        try {
          const error = await response.json();
          errorMessage = error.message || error.error || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      try {
        return await response.json();
      } catch (error) {
        logger.error('Failed to parse report usage response', { error });
        throw new Error('Invalid JSON response from report usage endpoint');
      }
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