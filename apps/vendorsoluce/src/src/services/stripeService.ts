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

      const session = await stripe.createCheckoutSession({
        payment_method_types: ['card'],
        line_items: [
          {
            price: product.stripePriceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        customer_email: customerEmail,
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          productId: product.id,
          productName: product.name,
          tenantId: tenantId || 'default',
          billingModel: product.billingModel,
          productType: product.productType
        },
        subscription_data: {
          metadata: {
            productId: product.id,
            tenantId: tenantId || 'default',
            billingModel: product.billingModel
          }
        }
      });

      return session;
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

      const session = await stripe.createCheckoutSession({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'subscription',
        customer_email: customerEmail,
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          tenantId: tenantId || 'default',
          hasAddons: 'true'
        },
        subscription_data: {
          metadata: {
            tenantId: tenantId || 'default',
            hasAddons: 'true'
          }
        }
      });

      return session;
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

      const session = await stripe.createCustomerPortalSession({
        customer: customerId,
        return_url: returnUrl,
      });

      return session;
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

      const newSubscription = await stripe.createSubscription({
        customer: customerId,
        items: lineItems.map(item => ({
          price: item.price,
          quantity: item.quantity
        })),
        metadata: {
          mainProductId: mainProductId,
          addonProductIds: addonProductIds.join(','),
          tenantId: tenantId || 'default'
        }
      });

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

      // Get current subscription
      const _currentSubscription = await stripe.retrieveSubscription(subscriptionId);
      
      // Create new subscription items
      const items = [
        { price: mainProduct.stripePriceId, quantity: 1 }
      ];

      for (const addonId of addonProductIds) {
        const addonProduct = getProductById(addonId);
        if (addonProduct) {
          items.push({ price: addonProduct.stripePriceId, quantity: 1 });
        }
      }

      // Update subscription
      const updatedSubscription = await stripe.updateSubscription(subscriptionId, {
        items: items.map(item => ({
          price: item.price,
          quantity: item.quantity
        })),
        metadata: {
          mainProductId: mainProductId,
          addonProductIds: addonProductIds.join(','),
          updatedAt: new Date().toISOString()
        }
      });

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

      const existingSubscription = await stripe.retrieveSubscription(subscriptionId);
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

      const existingSubscription = await stripe.retrieveSubscription(subscriptionId);
      const newProduct = getProductById(newProductId);
      
      if (!newProduct) {
        throw new StripeError('New product not found', 'product_not_found', { newProductId }, 'proration');
      }

      // Calculate proration (simplified - in production, use Stripe's proration API)
      const currentPrice = existingSubscription.items.data[0]?.price.unit_amount || 0;
      const newPrice = newProduct.price;
      const prorationAmount = newPrice - currentPrice;

      return prorationAmount;
    } catch (error) {
      const stripeError = handleStripeError(error);
      logError(stripeError, 'calculateProratedAmount');
      throw stripeError;
    }
  }

  // Handle webhook events
  async handleWebhook(payload: string, signature: string) {
    try {
      const stripe = await this.stripe;
      if (!stripe) {
        throw new StripeError('Stripe not initialized', 'stripe_not_initialized', {}, 'webhook');
      }

      const webhookSecret = import.meta.env.VITE_STRIPE_WEBHOOK_SECRET;
      if (!webhookSecret) {
        throw new StripeError('Webhook secret not configured', 'webhook_secret_missing', {}, 'webhook');
      }

      const event = stripe.constructWebhookEvent(payload, signature, webhookSecret);

      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutCompleted(event.data.object);
          break;
        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(event.data.object);
          break;
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object);
          break;
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object);
          break;
        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(event.data.object);
          break;
        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object);
          break;
        default:
          logger.info(`Unhandled webhook event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      const stripeError = handleStripeError(error);
      logError(stripeError, 'handleWebhook');
      throw stripeError;
    }
  }

  // Webhook event handlers
  private async handleCheckoutCompleted(session: Record<string, unknown>) {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: session.metadata.userId,
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
          status: 'active',
          product_id: session.metadata.productId,
          tenant_id: session.metadata.tenantId || 'default',
          created_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      logError(error as Error, 'handleCheckoutCompleted');
      throw error;
    }
  }

  private async handleSubscriptionCreated(subscription: Record<string, unknown>) {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .insert({
          stripe_customer_id: subscription.customer,
          stripe_subscription_id: subscription.id,
          status: subscription.status,
          product_id: subscription.metadata.productId,
          tenant_id: subscription.metadata.tenantId || 'default',
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          created_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      logError(error as Error, 'handleSubscriptionCreated');
      throw error;
    }
  }

  private async handleSubscriptionUpdated(subscription: Record<string, unknown>) {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('stripe_subscription_id', subscription.id);

      if (error) throw error;
    } catch (error) {
      logError(error as Error, 'handleSubscriptionUpdated');
      throw error;
    }
  }

  private async handleSubscriptionDeleted(subscription: Record<string, unknown>) {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'canceled',
          canceled_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('stripe_subscription_id', subscription.id);

      if (error) throw error;
    } catch (error) {
      logError(error as Error, 'handleSubscriptionDeleted');
      throw error;
    }
  }

  private async handlePaymentSucceeded(invoice: Record<string, unknown>) {
    try {
      const { error } = await supabase
        .from('invoices')
        .insert({
          subscription_id: invoice.subscription,
          stripe_invoice_id: invoice.id,
          amount: invoice.amount_paid,
          currency: invoice.currency,
          status: 'paid',
          paid_at: new Date(invoice.status_transitions.paid_at * 1000).toISOString(),
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update subscription last payment date
      await supabase
        .from('subscriptions')
        .update({
          last_payment_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('stripe_subscription_id', invoice.subscription);
    } catch (error) {
      logError(error as Error, 'handlePaymentSucceeded');
      throw error;
    }
  }

  private async handlePaymentFailed(invoice: Record<string, unknown>) {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({
          last_payment_failed: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('stripe_subscription_id', invoice.subscription);

      if (error) throw error;
    } catch (error) {
      logError(error as Error, 'handlePaymentFailed');
      throw error;
    }
  }
}

export default StripeService;
