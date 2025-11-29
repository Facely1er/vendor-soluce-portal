/**
 * Stripe Configuration and Product Catalog
 * 
 * This file contains all Stripe-related configuration including:
 * - Product definitions
 * - Pricing tiers
 * - Feature limits
 * - Stripe keys configuration
 */

export const STRIPE_CONFIG = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  webhookSecret: import.meta.env.VITE_STRIPE_WEBHOOK_SECRET || '',
  apiVersion: '2023-10-16' as const,
  currency: 'usd',
  trialPeriodDays: 14,
};

// Product and pricing configuration
export const PRODUCTS = {
  free: {
    name: 'Free',
    priceId: null, // No Stripe price for free tier
    productId: null,
    price: 0,
    interval: null,
    description: 'Get started with basic features',
    features: [
      'Up to 5 vendors',
      '1 supply chain assessment',
      '1 user account',
      'Basic dashboard',
      'Basic compliance tracking',
      'Community support',
    ],
    limits: {
      vendors: 5,
      sbom_scans: 0, // SBOM is separate service
      assessments: 1,
      users: 1,
      api_calls: 0,
      data_export: false,
      custom_branding: false,
      sso: false,
      priority_support: false,
    },
  },
  starter: {
    name: 'Starter',
    priceId: import.meta.env.VITE_STRIPE_PRICE_STARTER || 'price_starter_monthly',
    productId: import.meta.env.VITE_STRIPE_PRODUCT_STARTER || 'prod_starter',
    price: 49,
    interval: 'month' as const,
    description: 'Suitable for small teams getting started',
    features: [
      'Up to 10 vendors',
      '5 vendor assessments per month',
      '1 user account',
      'NIST compliance tracking',
      'PDF report generation',
      'Email support',
      'Standard templates',
      'Basic risk monitoring',
    ],
    limits: {
      vendors: 10,
      sbom_scans: 0, // SBOM available as premium add-on
      assessments: 5,
      users: 1,
      api_calls: 100,
      data_export: true,
      custom_branding: false,
      sso: false,
      priority_support: false,
    },
  },
  professional: {
    name: 'Professional',
    priceId: import.meta.env.VITE_STRIPE_PRICE_PROFESSIONAL || 'price_professional_monthly',
    productId: import.meta.env.VITE_STRIPE_PRODUCT_PROFESSIONAL || 'prod_professional',
    price: 149,
    interval: 'month' as const,
    description: 'Additional features for growing organizations',
    features: [
      'Up to 50 vendors',
      '20 vendor assessments per month',
      'Up to 5 user accounts',
      'Advanced NIST compliance',
      'API access (10,000 calls/month)',
      'Priority support',
      'Custom templates',
      'Advanced analytics',
      'Threat intelligence feed',
      'Workflow automation',
      'SBOM Integration add-on available',
    ],
    limits: {
      vendors: 50,
      sbom_scans: 0, // Premium add-on for Professional+
      assessments: 20,
      users: 5,
      api_calls: 10000,
      data_export: true,
      custom_branding: true,
      sso: false,
      priority_support: true,
    },
  },
  enterprise: {
    name: 'Enterprise',
    priceId: import.meta.env.VITE_STRIPE_PRICE_ENTERPRISE || 'price_enterprise_monthly',
    productId: import.meta.env.VITE_STRIPE_PRODUCT_ENTERPRISE || 'prod_enterprise',
    price: 449,
    interval: 'month' as const,
    description: 'Comprehensive solution for large organizations',
    features: [
      'Unlimited vendors',
      'Unlimited vendor assessments',
      'Unlimited users',
      'NIST compliance tools',
      'Unlimited API access',
      'Dedicated account manager',
      'Custom integrations',
      'SSO/SAML authentication',
      'Advanced threat intelligence',
      'Professional services',
      'SLA guarantees',
      'Custom branding',
      'Multi-tenant support',
      'SBOM Integration add-on available',
    ],
    limits: {
      vendors: -1, // -1 means unlimited
      sbom_scans: 0, // Premium add-on for Enterprise
      assessments: -1,
      users: -1,
      api_calls: -1,
      data_export: true,
      custom_branding: true,
      sso: true,
      priority_support: true,
    },
  },
  federal: {
    name: 'Federal',
    priceId: import.meta.env.VITE_STRIPE_PRICE_FEDERAL || 'price_federal_monthly',
    productId: import.meta.env.VITE_STRIPE_PRODUCT_FEDERAL || 'prod_federal',
    price: 799,
    interval: 'month' as const,
    description: 'Premium compliance incl. NIST SP 800-161 Extended and full audit',
    features: [
      'All Enterprise features',
      'NIST SP 800-161 Extended assessment',
      'Enhanced audit logging',
      'Long-term evidence retention',
      'Compliance mappings to vendor portal',
      'SBOM Integration add-on available',
    ],
    limits: {
      vendors: -1,
      sbom_scans: 0, // Premium add-on for Federal
      assessments: -1,
      users: -1,
      api_calls: -1,
      data_export: true,
      custom_branding: true,
      sso: true,
      priority_support: true,
    },
  },
};

// Annual pricing discount (20% off)
export const ANNUAL_DISCOUNT = 0.20;

// Usage-based pricing for overages
export const USAGE_PRICING = {
  sbom_scans: {
    starter: 0, // SBOM not available for Starter
    professional: 99, // $99/month add-on (available separately at technosoluce.com)
    enterprise: 99, // $99/month add-on (available separately at technosoluce.com)
  },
  vendor_assessments: {
    starter: 10, // $10 per additional assessment
    professional: 5, // $5 per additional assessment
    enterprise: 0, // Unlimited
  },
  api_calls: {
    starter: 0.01, // $0.01 per call over limit
    professional: 0.005, // $0.005 per call over limit
    enterprise: 0, // Unlimited
  },
  additional_users: {
    starter: 0, // Not available
    professional: 20, // $20 per additional user
    enterprise: 0, // Unlimited
    federal: 0, // Unlimited
  },
};

// Feature flags based on subscription tier
export const FEATURE_FLAGS = {
  free: [
    'basic_dashboard',
    'basic_vendor_management',
    'basic_reporting',
    'basic_compliance_tracking',
  ],
  starter: [
    'basic_dashboard',
    'basic_vendor_management',
    'basic_reporting',
    'basic_compliance_tracking',
    'nist_compliance',
    'pdf_export',
    'email_support',
    'standard_templates',
  ],
  professional: [
    'all_starter_features',
    'advanced_analytics',
    'api_access',
    'threat_intelligence',
    'workflow_automation',
    'custom_templates',
    'priority_support',
    'custom_branding',
    'sbom_integration_addon',
  ],
  enterprise: [
    'all_features',
    'sso_saml',
    'multi_tenant',
    'custom_integrations',
    'dedicated_support',
    'sla_guarantees',
    'professional_services',
  ],
  federal: [
    'all_features',
    'sso_saml',
    'multi_tenant',
    'custom_integrations',
    'dedicated_support',
    'sla_guarantees',
    'professional_services',
    'nist_800_161_extended',
    'enhanced_audit_logging',
  ],
};

// Helper functions
export function getPlanByPriceId(priceId: string) {
  return Object.entries(PRODUCTS).find(
    ([, product]) => product.priceId === priceId
  )?.[0] as keyof typeof PRODUCTS | undefined;
}

export function canAccessFeature(userTier: keyof typeof PRODUCTS, feature: string): boolean {
  const flags = FEATURE_FLAGS[userTier];
  
  // Check if user has 'all_features' flag
  if (flags.includes('all_features')) return true;
  
  // Check if user has specific feature
  if (flags.includes(feature)) return true;
  
  // Check inherited features
  if (userTier === 'professional' && flags.includes('all_starter_features')) {
    return FEATURE_FLAGS.starter.includes(feature);
  }
  
  return false;
}

export function getUsageLimit(userTier: keyof typeof PRODUCTS, resource: keyof typeof PRODUCTS['free']['limits']): number {
  return PRODUCTS[userTier].limits[resource] as number;
}

export function calculateOveragePrice(
  userTier: keyof typeof PRODUCTS,
  resource: keyof typeof USAGE_PRICING,
  quantity: number
): number {
  const limit = getUsageLimit(userTier, resource as keyof typeof PRODUCTS['free']['limits']);
  if (limit === -1) return 0; // Unlimited
  
  const overage = Math.max(0, quantity - limit);
  const pricePerUnit = USAGE_PRICING[resource][userTier as keyof typeof USAGE_PRICING['sbom_scans']];
  
  return overage * (pricePerUnit || 0);
}

// Stripe checkout session configuration
export function getCheckoutConfig(plan: keyof typeof PRODUCTS) {
  const product = PRODUCTS[plan];
  
  if (!product.priceId) {
    throw new Error(`No price ID configured for plan: ${plan}`);
  }
  
  return {
    mode: 'subscription' as const,
    lineItems: [
      {
        price: product.priceId,
        quantity: 1,
      },
    ],
    customerEmail: undefined, // Will be set dynamically
    clientReferenceId: undefined, // Will be set to user ID
    successUrl: `${window.location.origin}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${window.location.origin}/pricing`,
    allowPromotionCodes: true,
    billingAddressCollection: 'required' as const,
    metadata: {
      plan,
      source: 'website',
    },
    subscriptionData: {
      trialPeriodDays: STRIPE_CONFIG.trialPeriodDays,
      metadata: {
        plan,
      },
    },
  };
}

// Customer portal configuration
export function getCustomerPortalUrl(): string {
  return `${import.meta.env.VITE_API_URL || ''}/api/create-portal-session`;
}

export default STRIPE_CONFIG;