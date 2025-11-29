// Complete Stripe Integration Service
// File: src/services/stripeService.ts

import { getStripe } from '../lib/stripe';
import { getProductById } from '../lib/stripeProducts';
import { supabase } from '../lib/supabase';
import type { Stripe } from '@stripe/stripe-js';

// Custom Error Classes
export class StripeError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, unknown>,
    public operation?: string
  ) {
    super(message);
    this.name = 'StripeError';
  }
}

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'NetworkError';
  }
}

// Error Handling Functions
export const handleStripeError = (error: unknown): StripeError => {
  const stripeError = error as Record<string, unknown>;
  
  if (stripeError.type === 'StripeCardError') {
    return new StripeError(
      String(stripeError.message),
      String(stripeError.code),
      { cardError: stripeError },
      'card_processing'
    );
  } else if (stripeError.type === 'StripeInvalidRequestError') {
    return new StripeError(
      'Invalid request to Stripe',
      'invalid_request',
      { originalError: stripeError },
      'api_request'
    );
  } else if (stripeError.type === 'StripeAPIError') {
    return new StripeError(
      'Stripe API error',
      'api_error',
      { originalError: stripeError },
      'api_request'
    );
  } else if (stripeError.type === 'StripeConnectionError') {
    return new StripeError(
      'Network error connecting to Stripe',
      'connection_error',
      { originalError: stripeError },
      'network'
    );
  } else if (stripeError.type === 'StripeAuthenticationError') {
    return new StripeError(
      'Stripe authentication failed',
      'authentication_error',
      { originalError: stripeError },
      'authentication'
    );
  }
  
  return new StripeError(
    String(stripeError.message) || 'Unknown Stripe error',
    'unknown_error',
    { originalError: stripeError },
    'unknown'
  );
};

export const handleSupabaseError = (error: unknown): Error => {
  const supabaseError = error as Record<string, unknown>;
  return new Error(`Supabase error: ${String(supabaseError.message)}`);
};

import { logger } from '../utils/monitoring';

export const logError = (error: Error, operation: string) => {
  logger.error(`[${operation}] Error`, {
    name: error.name,
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
};

export class StripeService {
  private stripe: Promise<Stripe | null>;

  constructor() {
    this.stripe = getStripe();
  }

  // Create checkout session for single product
  async createCheckoutSession(
    productId: string,
    customerEmail: string,
    successUrl: string,
    cancelUrl: string,
    tenantId?: string
  ) {
    try {
      const product = getProductById(productId);
      if (!product) {
        throw new StripeError('Product not found', 'product_not_found', { productId }, 'checkout');
      }

      const stripe = await this.stripe;
      if (!stripe) {
        throw new StripeError('Stripe not initialized', 'stripe_not_initialized', {}, 'checkout');
      }

      // For frontend, we need to redirect to Stripe Checkout
      // This should be handled by the backend API
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: product.stripePriceId,
          customerEmail,
          successUrl,
          cancelUrl,
          metadata: {
            productId: product.id,
            productName: product.name,
            tenantId: tenantId || 'default',
            billingModel: product.billingModel,
            productType: product.productType
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId, url } = await response.json();
      return { sessionId, url };
    } catch (error) {
      const stripeError = handleStripeError(error);
      logError(stripeError, 'createCheckoutSession');
      throw stripeError;
    }
  }

  // Create checkout session with add-ons
  async createCheckoutSessionWithAddons(
    lineItems: Array<{ price: string; quantity: number }>,
    customerEmail: string,
    successUrl: string,
    cancelUrl: string,
    tenantId?: string
  ) {
    try {
      const stripe = await this.stripe;
      if (!stripe) {
        throw new StripeError('Stripe not initialized', 'stripe_not_initialized', {}, 'checkout');
      }

      // For frontend, we need to redirect to Stripe Checkout
      // This should be handled by the backend API
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lineItems,
          customerEmail,
          successUrl,
          cancelUrl,
          metadata: {
            tenantId: tenantId || 'default',
            hasAddons: 'true'
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId, url } = await response.json();
      return { sessionId, url };
    } catch (error) {
      const stripeError = handleStripeError(error);
      logError(stripeError, 'createCheckoutSessionWithAddons');
      throw stripeError;
    }
  }

  // Create customer portal session
  async createCustomerPortalSession(customerId: string, returnUrl: string) {
    try {
      const stripe = await this.stripe;
      if (!stripe) {
        throw new StripeError('Stripe not initialized', 'stripe_not_initialized', {}, 'portal');
      }

      // For frontend, we need to redirect to Stripe Customer Portal
      // This should be handled by the backend API
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          returnUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create portal session');
      }

      const { url } = await response.json();
      return { url };
    } catch (error) {
      const stripeError = handleStripeError(error);
      logError(stripeError, 'createCustomerPortalSession');
      throw stripeError;
    }
  }

  // Create subscription with add-ons
  async createSubscriptionWithAddons(
    customerId: string,
    mainProductId: string,
    addonProductIds: string[],
    tenantId?: string
  ) {
    try {
      const mainProduct = getProductById(mainProductId);
      if (!mainProduct) {
        throw new StripeError('Main product not found', 'product_not_found', { mainProductId }, 'subscription');
      }

      const lineItems = [
        { price: mainProduct.stripePriceId, quantity: 1 }
      ];

      // Add add-on products
      for (const addonId of addonProductIds) {
        const addonProduct = getProductById(addonId);
        if (addonProduct) {
          lineItems.push({ price: addonProduct.stripePriceId, quantity: 1 });
        }
      }

      const stripe = await this.stripe;
      if (!stripe) {
        throw new StripeError('Stripe not initialized', 'stripe_not_initialized', {}, 'subscription');
      }

      // For frontend, subscription creation should be handled by backend API
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          lineItems: lineItems.map(item => ({
            price: item.price,
            quantity: item.quantity
          })),
          metadata: {
            mainProductId: mainProductId,
            addonProductIds: addonProductIds.join(','),
            tenantId: tenantId || 'default'
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }

      const newSubscription = await response.json();

      return newSubscription;
    } catch (error) {
      const stripeError = handleStripeError(error);
      logError(stripeError, 'createSubscriptionWithAddons');
      throw stripeError;
    }
  }

  // Update subscription with add-ons
  async updateSubscriptionWithAddons(
    subscriptionId: string,
    mainProductId: string,
    addonProductIds: string[]
  ) {
    try {
      const mainProduct = getProductById(mainProductId);
      if (!mainProduct) {
        throw new StripeError('Main product not found', 'product_not_found', { mainProductId }, 'subscription_update');
      }

      const stripe = await this.stripe;
      if (!stripe) {
        throw new StripeError('Stripe not initialized', 'stripe_not_initialized', {}, 'subscription_update');
      }

      // For frontend, subscription update should be handled by backend API
      const items = [
        { price: mainProduct.stripePriceId, quantity: 1 }
      ];

      for (const addonId of addonProductIds) {
        const addonProduct = getProductById(addonId);
        if (addonProduct) {
          items.push({ price: addonProduct.stripePriceId, quantity: 1 });
        }
      }

      const response = await fetch('/api/update-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId,
          items: items.map(item => ({
            price: item.price,
            quantity: item.quantity
          })),
          metadata: {
            mainProductId: mainProductId,
            addonProductIds: addonProductIds.join(','),
            updatedAt: new Date().toISOString()
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update subscription');
      }

      const updatedSubscription = await response.json();

      return updatedSubscription;
    } catch (error) {
      const stripeError = handleStripeError(error);
      logError(stripeError, 'updateSubscriptionWithAddons');
      throw stripeError;
    }
  }

  // Get subscription details
  async getSubscriptionDetails(subscriptionId: string) {
    try {
      const stripe = await this.stripe;
      if (!stripe) {
        throw new StripeError('Stripe not initialized', 'stripe_not_initialized', {}, 'subscription_details');
      }

      // For frontend, subscription retrieval should be handled by backend API
      const response = await fetch(`/api/subscription/${subscriptionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to retrieve subscription');
      }

      const existingSubscription = await response.json();
      return existingSubscription;
    } catch (error) {
      const stripeError = handleStripeError(error);
      logError(stripeError, 'getSubscriptionDetails');
      throw stripeError;
    }
  }

  // Calculate prorated amount for subscription changes
  async calculateProratedAmount(
    subscriptionId: string,
    newProductId: string
  ): Promise<number> {
    try {
      const stripe = await this.stripe;
      if (!stripe) {
        throw new StripeError('Stripe not initialized', 'stripe_not_initialized', {}, 'proration');
      }

      // For frontend, proration calculation should be handled by backend API
      const response = await fetch('/api/calculate-proration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId,
          newProductId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate proration');
      }

      const { prorationAmount } = await response.json();
      return prorationAmount;
    } catch (error) {
      const stripeError = handleStripeError(error);
      logError(stripeError, 'calculateProratedAmount');
      throw stripeError;
    }
  }

  // Handle webhook events - This should be done on the backend
  // Frontend should not handle webhooks directly
  async handleWebhook(payload: string, signature: string) {
    throw new Error('Webhook handling should be done on the backend, not frontend');
  }

  // Webhook event handlers are now handled on the backend
  // These methods are kept for reference but should not be used in frontend
}

export default StripeService;
