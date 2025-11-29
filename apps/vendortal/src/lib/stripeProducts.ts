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
    name: 'Starter (Monthly)',
    description: 'Perfect for small teams getting started with vendor compliance - billed monthly',
    price: 4900, // $49/month
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
      'PDF report generation',
      'Monthly billing - cancel anytime'
    ],
    limits: {
      users: 5,
      vendors: 25,
      assessments: 100,
      storage: '2GB'
    },
    stripePriceId: 'price_1SNXHFI8FTbdI7aVnas0xvWB',
    stripeProductId: 'prod_TKBeoDaAHdfomF',
    complianceFrameworks: ['NIST'],
    whiteLabel: false,
    productType: 'main',
    billingModel: 'monthly'
  },
  {
    id: 'professional-monthly',
    name: 'Professional (Monthly)',
    description: 'Advanced features for growing companies - billed monthly',
    price: 14900, // $149/month
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
    stripePriceId: 'price_1SNXHGI8FTbdI7aV5k9GrDZl',
    stripeProductId: 'prod_TKBeXVqbxNp3w9',
    complianceFrameworks: ['NIST', 'CMMC'],
    whiteLabel: true,
    productType: 'main',
    billingModel: 'monthly'
  },
  {
    id: 'enterprise-monthly',
    name: 'Enterprise (Monthly)',
    description: 'Full-featured solution for large organizations - billed monthly',
    price: 44900, // $449/month
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
    stripePriceId: 'price_1SNXHHI8FTbdI7aVbtl8vb28',
    stripeProductId: 'prod_TKBe44uioOd99j',
    complianceFrameworks: ['NIST', 'CMMC', 'SOC2', 'ISO27001', 'FEDRAMP', 'FISMA'],
    whiteLabel: true,
    productType: 'main',
    billingModel: 'monthly'
  },
  {
    id: 'federal-monthly',
    name: 'Federal (Monthly)',
    description: 'Government-grade compliance for federal contractors - custom pricing',
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
      'FedRAMP-ready tools'
    ],
    limits: {
      users: -1, // unlimited
      vendors: -1, // unlimited
      assessments: -1, // unlimited
      storage: '1TB'
    },
    stripePriceId: 'price_1SNXHII8FTbdI7aVqHsDVMmj',
    stripeProductId: 'prod_TKBeaETSt9EI3s',
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
    name: 'Starter (Annual)',
    description: 'Perfect for small teams getting started with vendor compliance - billed annually (Save 20%)',
    price: 47000, // $470/year (20% off $588)
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
    stripePriceId: 'price_1SNXHJI8FTbdI7aVMmaUtcNS',
    stripeProductId: 'prod_TKBetefHzzNOJW',
    complianceFrameworks: ['NIST'],
    whiteLabel: false,
    productType: 'main',
    billingModel: 'annual'
  },
  {
    id: 'professional-annual',
    name: 'Professional (Annual)',
    description: 'Advanced features for growing companies - billed annually (Save 20%)',
    price: 143000, // $1,430/year (20% off $1,788)
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
    stripePriceId: 'price_1SNXHKI8FTbdI7aVR8OOXzDT',
    stripeProductId: 'prod_TKBeWwr59ohAjD',
    complianceFrameworks: ['NIST', 'CMMC'],
    whiteLabel: true,
    productType: 'main',
    billingModel: 'annual'
  },
  {
    id: 'enterprise-annual',
    name: 'Enterprise (Annual)',
    description: 'Full-featured solution for large organizations - billed annually (Save 20%)',
    price: 431000, // $4,310/year (20% off $5,388)
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
    stripePriceId: 'price_1SNXHLI8FTbdI7aVyZGANRYg',
    stripeProductId: 'prod_TKBe6BQ3onMd92',
    complianceFrameworks: ['NIST', 'CMMC', 'SOC2', 'ISO27001', 'FEDRAMP', 'FISMA'],
    whiteLabel: true,
    productType: 'main',
    billingModel: 'annual'
  },
  {
    id: 'federal-annual',
    name: 'Federal (Annual)',
    description: 'Government-grade compliance for federal contractors - billed annually (Save 20%)',
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
      'FedRAMP-ready tools',
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
    stripePriceId: '', // Note: Custom pricing - contact sales (no Stripe product created)
    stripeProductId: '', // Note: Federal Annual uses custom pricing (no Stripe product created)
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
    name: 'Additional Users (Monthly)',
    description: 'Add more team members to your plan - billed monthly',
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
    stripePriceId: 'price_1SNXHMI8FTbdI7aVONYaVVW5',
    stripeProductId: 'prod_TKBeiQLqDrD7in',
    complianceFrameworks: [],
    whiteLabel: false,
    productType: 'addon',
    billingModel: 'monthly'
  },
  {
    id: 'additional-vendors-monthly',
    name: 'Additional Vendors (Monthly)',
    description: 'Add more vendor assessment capacity - billed monthly',
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
    stripePriceId: 'price_1SNXHNI8FTbdI7aVq2LBGsk0',
    stripeProductId: 'prod_TKBeU8q0hjf5BX',
    complianceFrameworks: [],
    whiteLabel: false,
    productType: 'addon',
    billingModel: 'monthly'
  },
  {
    id: 'compliance-consulting-monthly',
    name: 'Compliance Consulting (Monthly)',
    description: 'Expert compliance consulting services - billed monthly',
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
    stripePriceId: 'price_1SNXHOI8FTbdI7aVmUt6LSKW',
    stripeProductId: 'prod_TKBeITLDdqkXMC',
    complianceFrameworks: [],
    whiteLabel: false,
    productType: 'addon',
    billingModel: 'monthly'
  },
  {
    id: 'white-label-branding-monthly',
    name: 'White-Label Branding (Monthly)',
    description: 'Custom branding and white-label options - billed monthly',
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
    stripePriceId: 'price_1SNXHPI8FTbdI7aVejeVjBNL',
    stripeProductId: 'prod_TKBenRoNCgw40B',
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
    name: 'Additional Users (Annual)',
    description: 'Add more team members to your plan - billed annually (Save 20%)',
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
    stripePriceId: 'price_1SNXHQI8FTbdI7aVmxynWu33',
    stripeProductId: 'prod_TKBeOp4NLUPipS',
    complianceFrameworks: [],
    whiteLabel: false,
    productType: 'addon',
    billingModel: 'annual'
  },
  {
    id: 'additional-vendors-annual',
    name: 'Additional Vendors (Annual)',
    description: 'Add more vendor assessment capacity - billed annually (Save 20%)',
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
    stripePriceId: 'price_1SNXHRI8FTbdI7aVwrl9wyF3',
    stripeProductId: 'prod_TKBeLEYl1FG1Tr',
    complianceFrameworks: [],
    whiteLabel: false,
    productType: 'addon',
    billingModel: 'annual'
  },
  {
    id: 'compliance-consulting-annual',
    name: 'Compliance Consulting (Annual)',
    description: 'Expert compliance consulting services - billed annually (Save 20%)',
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
    stripePriceId: 'price_1SNXHSI8FTbdI7aVNYJAmCp3',
    stripeProductId: 'prod_TKBe0Ej9mhV3Qk',
    complianceFrameworks: [],
    whiteLabel: false,
    productType: 'addon',
    billingModel: 'annual'
  },
  {
    id: 'white-label-branding-annual',
    name: 'White-Label Branding (Annual)',
    description: 'Custom branding and white-label options - billed annually (Save 20%)',
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
    stripePriceId: 'price_1SNXHTI8FTbdI7aVqwaOX9ir',
    stripeProductId: 'prod_TKBeulN93WkNJF',
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
    name: 'Compliance Suite (Monthly)',
    description: 'Complete compliance package with NIST, CMMC, and SOC2 - billed monthly',
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
    stripePriceId: 'price_1SNXHUI8FTbdI7aVf3Chbq4a',
    stripeProductId: 'prod_TKBeR3kQQ1rsc9',
    complianceFrameworks: ['NIST', 'CMMC', 'SOC2'],
    whiteLabel: true,
    productType: 'bundle',
    billingModel: 'monthly'
  },
  {
    id: 'enterprise-plus-monthly',
    name: 'Enterprise Plus (Monthly)',
    description: 'Ultimate enterprise solution with all compliance frameworks - billed monthly',
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
    stripePriceId: 'price_1SNXHVI8FTbdI7aVycVfQ3Kc',
    stripeProductId: 'prod_TKBe498qXgTiju',
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
    name: 'Compliance Suite (Annual)',
    description: 'Complete compliance package with NIST, CMMC, and SOC2 - billed annually (Save 20%)',
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
    stripePriceId: 'price_1SNXHWI8FTbdI7aVq2JOGx7S',
    stripeProductId: 'prod_TKBegOfFuBBMhw',
    complianceFrameworks: ['NIST', 'CMMC', 'SOC2'],
    whiteLabel: true,
    productType: 'bundle',
    billingModel: 'annual'
  },
  {
    id: 'enterprise-plus-annual',
    name: 'Enterprise Plus (Annual)',
    description: 'Ultimate enterprise solution with all compliance frameworks - billed annually (Save 20%)',
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
    stripePriceId: 'price_1SNXHXI8FTbdI7aVa9j31PR4',
    stripeProductId: 'prod_TKBeMeK8IiKYaI',
    complianceFrameworks: ['NIST', 'CMMC', 'SOC2', 'ISO27001', 'FEDRAMP', 'FISMA'],
    whiteLabel: true,
    productType: 'bundle',
    billingModel: 'annual'
  }
];

// ONE-TIME PAYMENT PRODUCTS - PROFESSIONAL SERVICES
export const ONETIME_PRODUCTS: StripeProduct[] = [
  {
    id: 'quick-start-package',
    name: 'Quick Start Package',
    description: 'Get up and running with VendorTal in 5 days - one-time implementation service',
    price: 500000, // $5,000.00
    currency: 'usd',
    interval: 'one_time',
    features: [
      'Platform setup and configuration',
      'Initial vendor import (up to 10 vendors)',
      'Assessment framework setup (NIST/CMMC)',
      'Team training (up to 5 users)',
      '30-day support included',
      'Documentation and best practices'
    ],
    limits: {
      users: 5,
      vendors: 10,
      assessments: 0,
      storage: '0GB'
    },
    stripePriceId: 'price_1SNXHYI8FTbdI7aVQP9741yX',
    stripeProductId: 'prod_TKBeIIj8Q8unaE',
    complianceFrameworks: ['NIST', 'CMMC'],
    whiteLabel: false,
    productType: 'addon',
    billingModel: 'one_time'
  },
  {
    id: 'nist-compliance-audit',
    name: 'NIST Compliance Audit',
    description: 'Comprehensive NIST SP 800-161 compliance assessment - one-time consulting service',
    price: 1000000, // $10,000.00
    currency: 'usd',
    interval: 'one_time',
    features: [
      'Gap analysis against NIST SP 800-161',
      'Custom remediation roadmap',
      'Evidence collection assistance',
      'Compliance report generation',
      'Control mapping documentation',
      '3-month follow-up support'
    ],
    limits: {
      users: 0,
      vendors: 0,
      assessments: 0,
      storage: '0GB'
    },
    stripePriceId: 'price_1SNXHZI8FTbdI7aVXMFN2sne',
    stripeProductId: 'prod_TKBevaWvYnkiIY',
    complianceFrameworks: ['NIST'],
    whiteLabel: false,
    productType: 'addon',
    billingModel: 'one_time'
  },
  {
    id: 'custom-integration',
    name: 'Custom Integration',
    description: 'Connect VendorTal to your existing tools - one-time development service',
    price: 2500000, // $25,000.00
    currency: 'usd',
    interval: 'one_time',
    features: [
      'Custom API integration',
      'SIEM/workflow tool connection',
      'Custom reporting dashboards',
      'Dedicated developer time',
      'Documentation and training',
      '6-month support included'
    ],
    limits: {
      users: 0,
      vendors: 0,
      assessments: 0,
      storage: '0GB'
    },
    stripePriceId: 'price_1SNXHaI8FTbdI7aV1cpg7CtS',
    stripeProductId: 'prod_TKBeITIofnVRfC',
    complianceFrameworks: [],
    whiteLabel: false,
    productType: 'addon',
    billingModel: 'one_time'
  },
  {
    id: 'federal-compliance-package',
    name: 'Federal Compliance Package',
    description: 'FedRAMP and FISMA compliance readiness - one-time consulting service',
    price: 5000000, // $50,000.00
    currency: 'usd',
    interval: 'one_time',
    features: [
      'FedRAMP authorization support',
      'FISMA compliance framework',
      'NIST 800-53 control mapping',
      'ATO documentation preparation',
      'Federal security controls assessment',
      '12-month support included'
    ],
    limits: {
      users: 0,
      vendors: 0,
      assessments: 0,
      storage: '0GB'
    },
    stripePriceId: 'price_1SNXHbI8FTbdI7aVPf66yB4q',
    stripeProductId: 'prod_TKBee3R9JFW2Ag',
    complianceFrameworks: ['FEDRAMP', 'FISMA', 'NIST'],
    whiteLabel: false,
    productType: 'addon',
    billingModel: 'one_time'
  },
  {
    id: 'training-certification',
    name: 'Training & Certification Session',
    description: 'Comprehensive training program for your team - one-time training service',
    price: 250000, // $2,500.00 (base price, can be customized)
    currency: 'usd',
    interval: 'one_time',
    features: [
      'Comprehensive team training',
      'Best practices and workflows',
      'Compliance framework guidance',
      'Training materials and documentation',
      'Post-training Q&A session',
      '30-day follow-up support'
    ],
    limits: {
      users: 0,
      vendors: 0,
      assessments: 0,
      storage: '0GB'
    },
    stripePriceId: 'price_1SNXHcI8FTbdI7aVDLP5sdTJ',
    stripeProductId: 'prod_TKBeOL2IpOR2yZ',
    complianceFrameworks: [],
    whiteLabel: false,
    productType: 'addon',
    billingModel: 'one_time'
  },
  {
    id: 'consulting-hours-block',
    name: 'Compliance Consulting Hours (10-hour block)',
    description: 'Expert NIST compliance consulting - pre-paid hour block',
    price: 200000, // $2,000.00 (10 hours @ $200/hour)
    currency: 'usd',
    interval: 'one_time',
    features: [
      '10 hours of expert consulting',
      'NIST compliance guidance',
      'Risk assessment reviews',
      'Strategy development',
      'Implementation support',
      'Valid for 6 months from purchase'
    ],
    limits: {
      users: 0,
      vendors: 0,
      assessments: 0,
      storage: '0GB'
    },
    stripePriceId: 'price_1SNXHdI8FTbdI7aVNt1AWPcL',
    stripeProductId: 'prod_TKBecCsOYrafut',
    complianceFrameworks: ['NIST'],
    whiteLabel: false,
    productType: 'addon',
    billingModel: 'one_time'
  }
];

// COMBINED PRODUCT CATALOG
// Note: Monthly and Annual products are intentionally distinct products in Stripe
const _allProducts = [
  ...MONTHLY_PRODUCTS,
  ...ANNUAL_PRODUCTS,
  ...MONTHLY_ADDONS,
  ...ANNUAL_ADDONS,
  ...MONTHLY_BUNDLES,
  ...ANNUAL_BUNDLES,
  ...ONETIME_PRODUCTS
];

// Validate no duplicate IDs (excluding monthly/annual distinction)
const productIds = _allProducts.map(p => p.id);
const duplicateIds = productIds.filter((id, index) => productIds.indexOf(id) !== index);
if (duplicateIds.length > 0) {
  const uniqueDuplicates = [...new Set(duplicateIds)];
  logger.error('Duplicate product IDs found:', uniqueDuplicates);
  throw new Error(`Duplicate product IDs detected: ${uniqueDuplicates.join(', ')}`);
}

export const ALL_STRIPE_PRODUCTS: StripeProduct[] = _allProducts;

// Debug logging
logger.info('ALL_STRIPE_PRODUCTS loaded:', {
  total: ALL_STRIPE_PRODUCTS.length,
  monthly: MONTHLY_PRODUCTS.length,
  annual: ANNUAL_PRODUCTS.length,
  monthlyAddons: MONTHLY_ADDONS.length,
  annualAddons: ANNUAL_ADDONS.length,
  monthlyBundles: MONTHLY_BUNDLES.length,
  annualBundles: ANNUAL_BUNDLES.length,
  mainProducts: ALL_STRIPE_PRODUCTS.filter(p => p.productType === 'main').length,
  addonProducts: ALL_STRIPE_PRODUCTS.filter(p => p.productType === 'addon').length,
  bundleProducts: ALL_STRIPE_PRODUCTS.filter(p => p.productType === 'bundle').length,
  oneTimeProducts: ONETIME_PRODUCTS.length
});

// HELPER FUNCTIONS
export const getProductById = (id: string): StripeProduct | undefined => {
  return ALL_STRIPE_PRODUCTS.find(p => p.id === id);
};

export const getMainProducts = (interval: 'monthly' | 'annual') => {
  const products = ALL_STRIPE_PRODUCTS.filter(p => 
    p.productType === 'main' && p.billingModel === interval
  );
  logger.info(`getMainProducts(${interval}) returned:`, products.map(p => ({ id: p.id, name: p.name, price: p.price })));
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

export const getProductsByBillingModel = (billingModel: 'monthly' | 'annual' | 'one_time') => {
  return ALL_STRIPE_PRODUCTS.filter(p => p.billingModel === billingModel);
};

export const getOneTimeProducts = () => {
  return ALL_STRIPE_PRODUCTS.filter(p => p.billingModel === 'one_time');
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
