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
      '3 SBOM scans per month',
      '1 supply chain assessment',
      '1 user account',
      'Basic dashboard',
      'Community support',
    ],
    limits: {
      vendors: 5,
      sbom_scans: 3,
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
    priceId: import.meta.env.VITE_STRIPE_PRICE_STARTER || 'price_1SDebCIUB3FoXZdh8dp42ehe',
    productId: import.meta.env.VITE_STRIPE_PRODUCT_STARTER || 'prod_starter_monthly',
    price: 39, // $39/month - aligned with stripeProducts.ts
    interval: 'month' as const,
    description: 'Suitable for small teams getting started',
    features: [
      'Up to 5 team members',
      'Up to 25 vendor assessments',
      'NIST SP 800-161 compliance',
      'Basic risk scoring',
      'Email support',
      '2GB document storage',
      'PDF report generation',
    ],
    limits: {
      vendors: 25,
      sbom_scans: 10,
      assessments: 100,
      users: 5,
      api_calls: 100,
      data_export: true,
      custom_branding: false,
      sso: false,
      priority_support: false,
    },
  },
  professional: {
    name: 'Professional',
    priceId: import.meta.env.VITE_STRIPE_PRICE_PROFESSIONAL || 'price_1SDebBIUB3FoXZdhcPdM4wpJ',
    productId: import.meta.env.VITE_STRIPE_PRODUCT_PROFESSIONAL || 'prod_professional_monthly',
    price: 129, // $129/month - aligned with stripeProducts.ts
    interval: 'month' as const,
    description: 'Additional features for growing organizations',
    features: [
      'Up to 25 team members',
      'Up to 100 vendor assessments',
      'NIST SP 800-161 + CMMC 2.0 compliance',
      'Advanced risk analytics',
      'Priority support',
      '15GB document storage',
      'API access (10,000 calls/month)',
      'White-label options',
      'Advanced threat intelligence',
      'Workflow automation',
      'Custom templates',
    ],
    limits: {
      vendors: 100,
      sbom_scans: 50,
      assessments: 500,
      users: 25,
      api_calls: 10000,
      data_export: true,
      custom_branding: true,
      sso: false,
      priority_support: true,
    },
  },
  enterprise: {
    name: 'Enterprise',
    priceId: import.meta.env.VITE_STRIPE_PRICE_ENTERPRISE || 'price_1SDebAIUB3FoXZdhVCNrKzTl',
    productId: import.meta.env.VITE_STRIPE_PRODUCT_ENTERPRISE || 'prod_enterprise_monthly',
    price: 399, // $399/month - aligned with stripeProducts.ts
    interval: 'month' as const,
    description: 'Comprehensive solution for large organizations',
    features: [
      'Unlimited vendors',
      'Unlimited SBOM scans',
      'Unlimited assessments',
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
    ],
    limits: {
      vendors: -1, // -1 means unlimited
      sbom_scans: -1,
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
    priceId: import.meta.env.VITE_STRIPE_PRICE_FEDERAL || 'price_1SEW7LIUB3FoXZdhCMLRq822',
    productId: import.meta.env.VITE_STRIPE_PRODUCT_FEDERAL || 'prod_federal_monthly',
    price: 0, // Custom pricing - contact sales (aligned with stripeProducts.ts)
    interval: 'month' as const,
    description: 'Government-grade compliance for federal contractors - Custom pricing',
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
      sbom_scans: -1,
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
    starter: 5, // $5 per additional scan
    professional: 3, // $3 per additional scan
    enterprise: 0, // Unlimited
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
    'basic_sbom_scan',
    'basic_vendor_management',
    'basic_reporting',
  ],
  starter: [
    'basic_dashboard',
    'basic_sbom_scan',
    'basic_vendor_management',
    'basic_reporting',
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
  
  // Validate flags array exists
  if (!flags || !Array.isArray(flags)) {
    return false;
  }
  
  // Check if user has 'all_features' flag
  if (flags.includes('all_features')) return true;
  
  // Check if user has specific feature
  if (flags.includes(feature)) return true;
  
  // Check inherited features
  if (userTier === 'professional' && flags.includes('all_starter_features')) {
    const starterFlags = FEATURE_FLAGS.starter;
    return Array.isArray(starterFlags) && starterFlags.includes(feature);
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