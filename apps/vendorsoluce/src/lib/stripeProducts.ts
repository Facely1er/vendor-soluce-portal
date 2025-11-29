// Enhanced Stripe Product Catalog with Distinctive Monthly/Annual Itemization
// File: src/lib/stripeProducts.ts

import { logger } from '../utils/logger';

export interface StripeProduct {
  id: string;
  name: string;
  description: string;
  price: number; // in cents
  currency: string;
  interval: 'month' | 'year' | 'one_time';
  features: string[];
  limits: {
    users: number;
    vendors: number;
    assessments: number;
    storage: string;
  };
  stripePriceId: string; // Actual Stripe Price ID
  stripeProductId: string; // Actual Stripe Product ID
  complianceFrameworks: string[];
  whiteLabel: boolean;
  productType: 'main' | 'addon' | 'bundle';
  billingModel: 'monthly' | 'annual' | 'one_time';
}

// MAIN PRODUCTS - MONTHLY PLANS
export const MONTHLY_PRODUCTS: StripeProduct[] = [
  {
    id: 'starter-monthly',
    name: 'Starter Monthly',
    description: 'Perfect for small teams getting started with vendor compliance - Monthly billing',
    price: 3900, // $39/month (reduced from $49)
    currency: 'usd',
    interval: 'month',
    features: [
      'Up to 5 team members',
      'Up to 25 vendor assessments',
      'NIST SP 800-161 compliance',
      'Basic risk scoring',
      'Email support',
      '2GB document storage',
      'Standard reporting',
      'Basic dashboard',
      'PDF report generation'
    ],
    limits: {
      users: 5,
      vendors: 25,
      assessments: 100,
      storage: '2GB'
    },
    stripePriceId: 'price_1SDebCIUB3FoXZdh8dp42ehe',
    stripeProductId: 'prod_starter_monthly',
    complianceFrameworks: ['NIST'],
    whiteLabel: false,
    productType: 'main',
    billingModel: 'monthly'
  },
  {
    id: 'professional-monthly',
    name: 'Professional Monthly',
    description: 'Advanced features for growing companies - Monthly billing',
    price: 12900, // $129/month (reduced from $149)
    currency: 'usd',
    interval: 'month',
    features: [
      'Up to 25 team members',
      'Up to 100 vendor assessments',
      'NIST SP 800-161 + CMMC 2.0 compliance',
      'Advanced risk analytics',
      'Priority support',
      '15GB document storage',
      'Custom reporting & dashboards',
      'API access (10,000 calls/month)',
      'White-label options',
      'Advanced threat intelligence',
      'Workflow automation',
      'Custom templates'
    ],
    limits: {
      users: 25,
      vendors: 100,
      assessments: 500,
      storage: '15GB'
    },
    stripePriceId: 'price_1SDebBIUB3FoXZdhcPdM4wpJ',
    stripeProductId: 'prod_professional_monthly',
    complianceFrameworks: ['NIST', 'CMMC'],
    whiteLabel: true,
    productType: 'main',
    billingModel: 'monthly'
  },
  {
    id: 'enterprise-monthly',
    name: 'Enterprise Monthly',
    description: 'Full-featured solution for large organizations - Monthly billing',
    price: 39900, // $399/month (reduced from $449)
    currency: 'usd',
    interval: 'month',
    features: [
      'Unlimited team members',
      'Unlimited vendor assessments',
      'All compliance frameworks (NIST, CMMC, SOC2, ISO27001)',
      'AI-powered risk insights',
      '24/7 dedicated support',
      '200GB document storage',
      'Advanced analytics & BI',
      'Full API access',
      'Custom integrations',
      'White-label branding',
      'SLA guarantee',
      'SSO/SAML authentication',
      'Multi-tenant support',
      'Dedicated account manager'
    ],
    limits: {
      users: -1, // unlimited
      vendors: -1, // unlimited
      assessments: -1, // unlimited
      storage: '200GB'
    },
    stripePriceId: 'price_1SDebAIUB3FoXZdhVCNrKzTl',
    stripeProductId: 'prod_enterprise_monthly',
    complianceFrameworks: ['NIST', 'CMMC', 'SOC2', 'ISO27001', 'FEDRAMP', 'FISMA'],
    whiteLabel: true,
    productType: 'main',
    billingModel: 'monthly'
  },
  {
    id: 'federal-monthly',
    name: 'Federal Monthly',
    description: 'Government-grade compliance for federal contractors - Monthly billing',
    price: 0, // Custom pricing - contact sales
    currency: 'usd',
    interval: 'month',
    features: [
      'Unlimited team members',
      'Unlimited vendor assessments',
      'FedRAMP + FISMA compliance',
      'Government security standards',
      'Dedicated federal support team',
      '1TB secure document storage',
      'FedRAMP reporting',
      'FISMA compliance tracking',
      'Government API access',
      'Custom federal integrations',
      'White-label government branding',
      'FedRAMP SLA guarantee'
    ],
    limits: {
      users: -1, // unlimited
      vendors: -1, // unlimited
      assessments: -1, // unlimited
      storage: '1TB'
    },
    stripePriceId: 'price_1SEW7LIUB3FoXZdhCMLRq822',
    stripeProductId: 'prod_federal_monthly',
    complianceFrameworks: ['FEDRAMP', 'FISMA', 'NIST', 'CMMC'],
    whiteLabel: true,
    productType: 'main',
    billingModel: 'monthly'
  }
];

// MAIN PRODUCTS - ANNUAL PLANS (20% DISCOUNT)
export const ANNUAL_PRODUCTS: StripeProduct[] = [
  {
    id: 'starter-annual',
    name: 'Starter Annual',
    description: 'Perfect for small teams getting started with vendor compliance - Annual billing (Save 20%)',
    price: 37400, // $374/year (20% off $468)
    currency: 'usd',
    interval: 'year',
    features: [
      'Up to 5 team members',
      'Up to 25 vendor assessments',
      'NIST SP 800-161 compliance',
      'Basic risk scoring',
      'Email support',
      '2GB document storage',
      'Standard reporting',
      'Basic dashboard',
      'PDF report generation',
      '20% annual discount',
      'Priority feature requests'
    ],
    limits: {
      users: 5,
      vendors: 25,
      assessments: 100,
      storage: '2GB'
    },
    stripePriceId: 'price_1SDebCIUB3FoXZdhoTWIonmT',
    stripeProductId: 'prod_starter_annual',
    complianceFrameworks: ['NIST'],
    whiteLabel: false,
    productType: 'main',
    billingModel: 'annual'
  },
  {
    id: 'professional-annual',
    name: 'Professional Annual',
    description: 'Advanced features for growing companies - Annual billing (Save 20%)',
    price: 123800, // $1,238/year (20% off $1,548)
    currency: 'usd',
    interval: 'year',
    features: [
      'Up to 25 team members',
      'Up to 100 vendor assessments',
      'NIST SP 800-161 + CMMC 2.0 compliance',
      'Advanced risk analytics',
      'Priority support',
      '15GB document storage',
      'Custom reporting & dashboards',
      'API access (10,000 calls/month)',
      'White-label options',
      'Advanced threat intelligence',
      'Workflow automation',
      'Custom templates',
      '20% annual discount',
      'Priority feature requests',
      'Quarterly business reviews'
    ],
    limits: {
      users: 25,
      vendors: 100,
      assessments: 500,
      storage: '15GB'
    },
    stripePriceId: 'price_1SDebBIUB3FoXZdhkYjMHNtc',
    stripeProductId: 'prod_professional_annual',
    complianceFrameworks: ['NIST', 'CMMC'],
    whiteLabel: true,
    productType: 'main',
    billingModel: 'annual'
  },
  {
    id: 'enterprise-annual',
    name: 'Enterprise Annual',
    description: 'Full-featured solution for large organizations - Annual billing (Save 20%)',
    price: 383200, // $3,832/year (20% off $4,788)
    currency: 'usd',
    interval: 'year',
    features: [
      'Unlimited team members',
      'Unlimited vendor assessments',
      'All compliance frameworks (NIST, CMMC, SOC2, ISO27001)',
      'AI-powered risk insights',
      '24/7 dedicated support',
      '200GB document storage',
      'Advanced analytics & BI',
      'Full API access',
      'Custom integrations',
      'White-label branding',
      'SLA guarantee',
      'SSO/SAML authentication',
      'Multi-tenant support',
      'Dedicated account manager',
      '20% annual discount',
      'Priority feature requests',
      'Quarterly business reviews',
      'Dedicated success manager'
    ],
    limits: {
      users: -1, // unlimited
      vendors: -1, // unlimited
      assessments: -1, // unlimited
      storage: '200GB'
    },
    stripePriceId: 'price_1SDebAIUB3FoXZdhxCMBROTw',
    stripeProductId: 'prod_enterprise_annual',
    complianceFrameworks: ['NIST', 'CMMC', 'SOC2', 'ISO27001', 'FEDRAMP', 'FISMA'],
    whiteLabel: true,
    productType: 'main',
    billingModel: 'annual'
  },
  {
    id: 'federal-annual',
    name: 'Federal Annual',
    description: 'Government-grade compliance for federal contractors - Annual billing (Save 20%)',
    price: 0, // Custom pricing - contact sales
    currency: 'usd',
    interval: 'year',
    features: [
      'Unlimited team members',
      'Unlimited vendor assessments',
      'FedRAMP + FISMA compliance',
      'Government security standards',
      'Dedicated federal support team',
      '1TB secure document storage',
      'FedRAMP reporting',
      'FISMA compliance tracking',
      'Government API access',
      'Custom federal integrations',
      'White-label government branding',
      'FedRAMP SLA guarantee',
      '20% annual discount',
      'Priority feature requests',
      'Quarterly business reviews',
      'Dedicated federal success manager'
    ],
    limits: {
      users: -1, // unlimited
      vendors: -1, // unlimited
      assessments: -1, // unlimited
      storage: '1TB'
    },
    stripePriceId: 'price_1SEW7MIUB3FoXZdhbOONitHb',
    stripeProductId: 'prod_federal_annual',
    complianceFrameworks: ['FEDRAMP', 'FISMA', 'NIST', 'CMMC'],
    whiteLabel: true,
    productType: 'main',
    billingModel: 'annual'
  }
];

// ADD-ON PRODUCTS - MONTHLY
export const MONTHLY_ADDONS: StripeProduct[] = [
  {
    id: 'additional-users-monthly',
    name: 'Additional Users Monthly',
    description: 'Add more team members to your plan - Monthly billing',
    price: 1000, // $10/month per user
    currency: 'usd',
    interval: 'month',
    features: [
      'Additional team member access',
      'Same permissions as base plan',
      'Monthly billing flexibility'
    ],
    limits: {
      users: 1,
      vendors: 0,
      assessments: 0,
      storage: '0GB'
    },
    stripePriceId: 'price_1SEW7NIUB3FoXZdhkqaB5Qd5',
    stripeProductId: 'prod_additional_users_monthly',
    complianceFrameworks: [],
    whiteLabel: false,
    productType: 'addon',
    billingModel: 'monthly'
  },
  {
    id: 'additional-vendors-monthly',
    name: 'Additional Vendors Monthly',
    description: 'Add more vendor assessment capacity - Monthly billing',
    price: 500, // $5/month per vendor
    currency: 'usd',
    interval: 'month',
    features: [
      'Additional vendor assessment slots',
      'Same assessment features as base plan',
      'Monthly billing flexibility'
    ],
    limits: {
      users: 0,
      vendors: 1,
      assessments: 0,
      storage: '0GB'
    },
    stripePriceId: 'price_1SDeb7IUB3FoXZdhZy1NxkUb',
    stripeProductId: 'prod_additional_vendors_monthly',
    complianceFrameworks: [],
    whiteLabel: false,
    productType: 'addon',
    billingModel: 'monthly'
  },
  {
    id: 'compliance-consulting-monthly',
    name: 'Compliance Consulting Monthly',
    description: 'Expert compliance consulting services - Monthly billing',
    price: 20000, // $200/month
    currency: 'usd',
    interval: 'month',
    features: [
      '2 hours monthly consulting',
      'Compliance strategy guidance',
      'Risk assessment reviews',
      'Implementation support'
    ],
    limits: {
      users: 0,
      vendors: 0,
      assessments: 0,
      storage: '0GB'
    },
    stripePriceId: 'price_1SDeb6IUB3FoXZdhvMWpC2wD',
    stripeProductId: 'prod_compliance_consulting_monthly',
    complianceFrameworks: [],
    whiteLabel: false,
    productType: 'addon',
    billingModel: 'monthly'
  },
  {
    id: 'white-label-branding-monthly',
    name: 'White-Label Branding Monthly',
    description: 'Custom branding and white-label options - Monthly billing',
    price: 50000, // $500/month
    currency: 'usd',
    interval: 'month',
    features: [
      'Custom logo and branding',
      'White-label domain setup',
      'Custom email templates',
      'Branded reports and dashboards'
    ],
    limits: {
      users: 0,
      vendors: 0,
      assessments: 0,
      storage: '0GB'
    },
    stripePriceId: 'price_1SDeb5IUB3FoXZdhhyykch2G',
    stripeProductId: 'prod_white_label_branding_monthly',
    complianceFrameworks: [],
    whiteLabel: true,
    productType: 'addon',
    billingModel: 'monthly'
  }
];

// ADD-ON PRODUCTS - ANNUAL (20% DISCOUNT)
export const ANNUAL_ADDONS: StripeProduct[] = [
  {
    id: 'additional-users-annual',
    name: 'Additional Users Annual',
    description: 'Add more team members to your plan - Annual billing (Save 20%)',
    price: 9600, // $96/year per user (20% off $120)
    currency: 'usd',
    interval: 'year',
    features: [
      'Additional team member access',
      'Same permissions as base plan',
      '20% annual discount',
      'Priority support for add-on users'
    ],
    limits: {
      users: 1,
      vendors: 0,
      assessments: 0,
      storage: '0GB'
    },
    stripePriceId: 'price_1SEW7OIUB3FoXZdha3XuErNl',
    stripeProductId: 'prod_additional_users_annual',
    complianceFrameworks: [],
    whiteLabel: false,
    productType: 'addon',
    billingModel: 'annual'
  },
  {
    id: 'additional-vendors-annual',
    name: 'Additional Vendors Annual',
    description: 'Add more vendor assessment capacity - Annual billing (Save 20%)',
    price: 4800, // $48/year per vendor (20% off $60)
    currency: 'usd',
    interval: 'year',
    features: [
      'Additional vendor assessment slots',
      'Same assessment features as base plan',
      '20% annual discount',
      'Priority support for add-on vendors'
    ],
    limits: {
      users: 0,
      vendors: 1,
      assessments: 0,
      storage: '0GB'
    },
    stripePriceId: 'price_1SDeb7IUB3FoXZdhIIop7wuC',
    stripeProductId: 'prod_additional_vendors_annual',
    complianceFrameworks: [],
    whiteLabel: false,
    productType: 'addon',
    billingModel: 'annual'
  },
  {
    id: 'compliance-consulting-annual',
    name: 'Compliance Consulting Annual',
    description: 'Expert compliance consulting services - Annual billing (Save 20%)',
    price: 192000, // $1,920/year (20% off $2,400)
    currency: 'usd',
    interval: 'year',
    features: [
      '24 hours annual consulting',
      'Compliance strategy guidance',
      'Risk assessment reviews',
      'Implementation support',
      '20% annual discount',
      'Quarterly compliance reviews'
    ],
    limits: {
      users: 0,
      vendors: 0,
      assessments: 0,
      storage: '0GB'
    },
    stripePriceId: 'price_1SDeb6IUB3FoXZdhx3gbyyVI',
    stripeProductId: 'prod_compliance_consulting_annual',
    complianceFrameworks: [],
    whiteLabel: false,
    productType: 'addon',
    billingModel: 'annual'
  },
  {
    id: 'white-label-branding-annual',
    name: 'White-Label Branding Annual',
    description: 'Custom branding and white-label options - Annual billing (Save 20%)',
    price: 480000, // $4,800/year (20% off $6,000)
    currency: 'usd',
    interval: 'year',
    features: [
      'Custom logo and branding',
      'White-label domain setup',
      'Custom email templates',
      'Branded reports and dashboards',
      '20% annual discount',
      'Priority branding support'
    ],
    limits: {
      users: 0,
      vendors: 0,
      assessments: 0,
      storage: '0GB'
    },
    stripePriceId: 'price_1SDeb5IUB3FoXZdhPQReXHuc',
    stripeProductId: 'prod_white_label_branding_annual',
    complianceFrameworks: [],
    whiteLabel: true,
    productType: 'addon',
    billingModel: 'annual'
  }
];

// BUNDLE PRODUCTS - MONTHLY
export const MONTHLY_BUNDLES: StripeProduct[] = [
  {
    id: 'compliance-suite-monthly',
    name: 'Compliance Suite Monthly',
    description: 'Complete compliance package with NIST, CMMC, and SOC2 - Monthly billing',
    price: 29900, // $299/month
    currency: 'usd',
    interval: 'month',
    features: [
      'Up to 50 team members',
      'Up to 200 vendor assessments',
      'NIST SP 800-161 + CMMC 2.0 + SOC2 compliance',
      'Advanced risk analytics',
      'Priority support',
      '25GB document storage',
      'Custom reporting & dashboards',
      'API access',
      'White-label options',
      'Compliance consulting included'
    ],
    limits: {
      users: 50,
      vendors: 200,
      assessments: 1000,
      storage: '25GB'
    },
    stripePriceId: 'price_1SDeb4IUB3FoXZdhfm0xRNs7',
    stripeProductId: 'prod_compliance_suite_monthly',
    complianceFrameworks: ['NIST', 'CMMC', 'SOC2'],
    whiteLabel: true,
    productType: 'bundle',
    billingModel: 'monthly'
  },
  {
    id: 'enterprise-plus-monthly',
    name: 'Enterprise Plus Monthly',
    description: 'Ultimate enterprise solution with all compliance frameworks - Monthly billing',
    price: 59900, // $599/month
    currency: 'usd',
    interval: 'month',
    features: [
      'Unlimited team members',
      'Unlimited vendor assessments',
      'All compliance frameworks (NIST, CMMC, SOC2, ISO27001, FedRAMP, FISMA)',
      'AI-powered risk insights',
      '24/7 dedicated support',
      '500GB document storage',
      'Advanced analytics & BI',
      'Full API access',
      'Custom integrations',
      'White-label branding',
      'SLA guarantee',
      'Compliance consulting included',
      'Dedicated success manager'
    ],
    limits: {
      users: -1, // unlimited
      vendors: -1, // unlimited
      assessments: -1, // unlimited
      storage: '500GB'
    },
    stripePriceId: 'price_1SDeb3IUB3FoXZdhAiZ0Cryw',
    stripeProductId: 'prod_enterprise_plus_monthly',
    complianceFrameworks: ['NIST', 'CMMC', 'SOC2', 'ISO27001', 'FEDRAMP', 'FISMA'],
    whiteLabel: true,
    productType: 'bundle',
    billingModel: 'monthly'
  }
];

// BUNDLE PRODUCTS - ANNUAL (20% DISCOUNT)
export const ANNUAL_BUNDLES: StripeProduct[] = [
  {
    id: 'compliance-suite-annual',
    name: 'Compliance Suite Annual',
    description: 'Complete compliance package with NIST, CMMC, and SOC2 - Annual billing (Save 20%)',
    price: 287000, // $2,870/year (20% off $3,588)
    currency: 'usd',
    interval: 'year',
    features: [
      'Up to 50 team members',
      'Up to 200 vendor assessments',
      'NIST SP 800-161 + CMMC 2.0 + SOC2 compliance',
      'Advanced risk analytics',
      'Priority support',
      '25GB document storage',
      'Custom reporting & dashboards',
      'API access',
      'White-label options',
      'Compliance consulting included',
      '20% annual discount',
      'Priority feature requests',
      'Quarterly business reviews'
    ],
    limits: {
      users: 50,
      vendors: 200,
      assessments: 1000,
      storage: '25GB'
    },
    stripePriceId: 'price_1SDeb4IUB3FoXZdheg2gbYTo',
    stripeProductId: 'prod_compliance_suite_annual',
    complianceFrameworks: ['NIST', 'CMMC', 'SOC2'],
    whiteLabel: true,
    productType: 'bundle',
    billingModel: 'annual'
  },
  {
    id: 'enterprise-plus-annual',
    name: 'Enterprise Plus Annual',
    description: 'Ultimate enterprise solution with all compliance frameworks - Annual billing (Save 20%)',
    price: 575000, // $5,750/year (20% off $7,188)
    currency: 'usd',
    interval: 'year',
    features: [
      'Unlimited team members',
      'Unlimited vendor assessments',
      'All compliance frameworks (NIST, CMMC, SOC2, ISO27001, FedRAMP, FISMA)',
      'AI-powered risk insights',
      '24/7 dedicated support',
      '500GB document storage',
      'Advanced analytics & BI',
      'Full API access',
      'Custom integrations',
      'White-label branding',
      'SLA guarantee',
      'Compliance consulting included',
      'Dedicated success manager',
      '20% annual discount',
      'Priority feature requests',
      'Quarterly business reviews'
    ],
    limits: {
      users: -1, // unlimited
      vendors: -1, // unlimited
      assessments: -1, // unlimited
      storage: '500GB'
    },
    stripePriceId: 'price_1SDeb3IUB3FoXZdhQHPKzfEy',
    stripeProductId: 'prod_enterprise_plus_annual',
    complianceFrameworks: ['NIST', 'CMMC', 'SOC2', 'ISO27001', 'FEDRAMP', 'FISMA'],
    whiteLabel: true,
    productType: 'bundle',
    billingModel: 'annual'
  }
];

// COMBINED PRODUCT CATALOG
export const ALL_STRIPE_PRODUCTS: StripeProduct[] = [
  ...MONTHLY_PRODUCTS,
  ...ANNUAL_PRODUCTS,
  ...MONTHLY_ADDONS,
  ...ANNUAL_ADDONS,
  ...MONTHLY_BUNDLES,
  ...ANNUAL_BUNDLES
];

// Debug logging
logger.log('ALL_STRIPE_PRODUCTS loaded:', {
  total: ALL_STRIPE_PRODUCTS.length,
  monthly: MONTHLY_PRODUCTS.length,
  annual: ANNUAL_PRODUCTS.length,
  monthlyAddons: MONTHLY_ADDONS.length,
  annualAddons: ANNUAL_ADDONS.length,
  monthlyBundles: MONTHLY_BUNDLES.length,
  annualBundles: ANNUAL_BUNDLES.length,
  mainProducts: ALL_STRIPE_PRODUCTS.filter(p => p.productType === 'main').length,
  addonProducts: ALL_STRIPE_PRODUCTS.filter(p => p.productType === 'addon').length,
  bundleProducts: ALL_STRIPE_PRODUCTS.filter(p => p.productType === 'bundle').length
});

// HELPER FUNCTIONS
export const getProductById = (id: string): StripeProduct | undefined => {
  return ALL_STRIPE_PRODUCTS.find(p => p.id === id);
};

export const getMainProducts = (interval: 'monthly' | 'annual') => {
  const products = ALL_STRIPE_PRODUCTS.filter(p => 
    p.productType === 'main' && p.billingModel === interval
  );
  logger.log(`getMainProducts(${interval}) returned:`, products.map(p => ({ id: p.id, name: p.name, price: p.price })));
  return products;
};

export const getAddonProducts = (interval: 'monthly' | 'annual') => {
  return ALL_STRIPE_PRODUCTS.filter(p => 
    p.productType === 'addon' && p.billingModel === interval
  );
};

export const getBundleProducts = (interval: 'monthly' | 'annual') => {
  return ALL_STRIPE_PRODUCTS.filter(p => 
    p.productType === 'bundle' && p.billingModel === interval
  );
};

export const getProductsByBillingModel = (billingModel: 'monthly' | 'annual') => {
  return ALL_STRIPE_PRODUCTS.filter(p => p.billingModel === billingModel);
};

export const getProductsByType = (productType: 'main' | 'addon' | 'bundle') => {
  return ALL_STRIPE_PRODUCTS.filter(p => p.productType === productType);
};

// PRICING COMPARISON HELPERS
export const calculateAnnualSavings = (monthlyPrice: number): number => {
  const annualPrice = monthlyPrice * 12;
  const discountedAnnualPrice = annualPrice * 0.8; // 20% discount
  return annualPrice - discountedAnnualPrice;
};

export const getSavingsPercentage = (): number => {
  return 20; // 20% discount for annual plans
};
