# VendorSoluce Integration Guide

## Table of Contents

1. [Overview](#overview)
2. [Stripe Integration](#stripe-integration)
3. [Sentry Integration](#sentry-integration)
4. [Supabase Integration](#supabase-integration)
5. [Threat Intelligence APIs](#threat-intelligence-apis)
6. [SBOM Analysis Services](#sbom-analysis-services)
7. [Email Services](#email-services)
8. [Webhook Configuration](#webhook-configuration)
9. [Custom Integrations](#custom-integrations)
10. [Troubleshooting](#troubleshooting)

## Overview

VendorSoluce integrates with various third-party services to provide comprehensive supply chain risk management capabilities. This guide covers all supported integrations and how to configure them.

## Stripe Integration

### Setup

1. **Create Stripe Account**: Sign up at [stripe.com](https://stripe.com)
2. **Get API Keys**: Retrieve publishable and secret keys from dashboard
3. **Configure Webhooks**: Set up webhook endpoints for subscription events

### Configuration

#### Environment Variables

```env
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

#### Product Configuration

```typescript
// src/config/stripe.ts
export const STRIPE_CONFIG = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  secretKey: import.meta.env.STRIPE_SECRET_KEY,
  webhookSecret: import.meta.env.STRIPE_WEBHOOK_SECRET,
};

export const PRODUCTS = {
  starter: {
    name: 'Starter Plan',
    description: 'Basic features for small teams',
    priceId: 'price_starter_monthly',
    features: ['Up to 10 vendors', 'Basic assessments', 'Email support']
  },
  professional: {
    name: 'Professional Plan',
    description: 'Advanced features for growing organizations',
    priceId: 'price_professional_monthly',
    features: ['Up to 100 vendors', 'Advanced assessments', 'Priority support']
  },
  enterprise: {
    name: 'Enterprise Plan',
    description: 'Full features with custom support',
    priceId: 'price_enterprise_monthly',
    features: ['Unlimited vendors', 'Custom assessments', 'Dedicated support']
  }
};
```

### Implementation

#### Checkout Session Creation

```typescript
// src/services/stripeService.ts
import Stripe from 'stripe';
import { STRIPE_CONFIG } from '../config/stripe';

export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(STRIPE_CONFIG.secretKey);
  }

  async createCheckoutSession(
    priceId: string,
    customerEmail: string,
    successUrl: string,
    cancelUrl: string
  ) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      customer_email: customerEmail,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return session;
  }

  async createCustomerPortalSession(customerId: string, returnUrl: string) {
    const session = await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return session;
  }
}
```

#### Webhook Handling

```typescript
// supabase/functions/stripe-webhook/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  const body = await req.text();
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

  try {
    const event = stripe.webhooks.constructEvent(body, signature!, webhookSecret!);

    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
```

## Sentry Integration

### Setup

1. **Create Sentry Project**: Sign up at [sentry.io](https://sentry.io)
2. **Get DSN**: Retrieve Data Source Name from project settings
3. **Configure Environment**: Set up environment-specific configurations

### Configuration

#### Environment Variables

```env
# Sentry Configuration
VITE_SENTRY_DSN=https://your_dsn@sentry.io/project_id
VITE_SENTRY_ENVIRONMENT=production
VITE_SENTRY_RELEASE=1.0.0
```

#### Sentry Setup

```typescript
// src/config/sentry.ts
export const getSentryConfig = () => {
  const environment = import.meta.env.VITE_SENTRY_ENVIRONMENT || 'development';
  const dsn = import.meta.env.VITE_SENTRY_DSN;

  return {
    dsn,
    environment,
    tracesSampleRate: environment === 'production' ? 0.1 : 1.0,
    sampleRate: environment === 'production' ? 0.1 : 1.0,
    debug: environment === 'development',
    beforeSend: (event: any) => {
      // Filter out sensitive data
      if (event.user) {
        delete event.user.ip_address;
      }
      return event;
    },
  };
};
```

#### Error Tracking Implementation

```typescript
// src/utils/sentry.ts
import * as Sentry from '@sentry/react';
import { getSentryConfig } from '../config/sentry';

export const initSentry = () => {
  const config = getSentryConfig();

  Sentry.init({
    dsn: config.dsn,
    environment: config.environment,
    tracesSampleRate: config.tracesSampleRate,
    sampleRate: config.sampleRate,
    debug: config.debug,
    beforeSend: config.beforeSend,
  });
};

export const reportError = (error: Error, context?: Record<string, any>) => {
  Sentry.withScope((scope) => {
    if (context) {
      Object.keys(context).forEach((key) => {
        scope.setContext(key, context[key]);
      });
    }
    Sentry.captureException(error);
  });
};

export const setUserContext = (user: {
  id: string;
  email?: string;
  name?: string;
}) => {
  Sentry.setUser(user);
};
```

## Supabase Integration

### Setup

1. **Create Supabase Project**: Sign up at [supabase.com](https://supabase.com)
2. **Configure Database**: Set up tables and relationships
3. **Enable Authentication**: Configure auth providers
4. **Deploy Edge Functions**: Deploy serverless functions

### Configuration

#### Environment Variables

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### Client Setup

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
```

#### Authentication Integration

```typescript
// src/context/AuthContext.tsx
import { supabase } from '../lib/supabase';
import { setUserContext, clearUserContext } from '../utils/sentry';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setUserContext({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name,
        });
      } else {
        clearUserContext();
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          setUserContext({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name,
          });
        } else {
          clearUserContext();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ... rest of the component
}
```

## Threat Intelligence APIs

### Integration with External Threat Feeds

#### Configuration

```typescript
// src/config/threatIntelligence.ts
export const THREAT_INTELLIGENCE_CONFIG = {
  virustotal: {
    apiKey: import.meta.env.VITE_VIRUSTOTAL_API_KEY,
    baseUrl: 'https://www.virustotal.com/vtapi/v2',
  },
  shodan: {
    apiKey: import.meta.env.VITE_SHODAN_API_KEY,
    baseUrl: 'https://api.shodan.io',
  },
  censys: {
    apiId: import.meta.env.VITE_CENSYS_API_ID,
    apiSecret: import.meta.env.VITE_CENSYS_API_SECRET,
    baseUrl: 'https://search.censys.io/api/v1',
  },
};
```

#### Implementation

```typescript
// src/services/threatIntelligenceService.ts
export class ThreatIntelligenceService {
  async checkDomainReputation(domain: string) {
    const response = await fetch(
      `${THREAT_INTELLIGENCE_CONFIG.virustotal.baseUrl}/domain/report`,
      {
        method: 'GET',
        headers: {
          'X-Apikey': THREAT_INTELLIGENCE_CONFIG.virustotal.apiKey,
        },
        params: new URLSearchParams({ domain }),
      }
    );

    return response.json();
  }

  async checkIPReputation(ip: string) {
    const response = await fetch(
      `${THREAT_INTELLIGENCE_CONFIG.shodan.baseUrl}/shodan/host/${ip}`,
      {
        method: 'GET',
        headers: {
          'X-API-Key': THREAT_INTELLIGENCE_CONFIG.shodan.apiKey,
        },
      }
    );

    return response.json();
  }
}
```

## SBOM Analysis Services

### Integration with Vulnerability Databases

#### Configuration

```typescript
// src/config/sbomAnalysis.ts
export const SBOM_ANALYSIS_CONFIG = {
  nvd: {
    baseUrl: 'https://services.nvd.nist.gov/rest/json/cves/2.0',
  },
  osv: {
    baseUrl: 'https://api.osv.dev/v1',
  },
  github: {
    baseUrl: 'https://api.github.com',
    token: import.meta.env.VITE_GITHUB_TOKEN,
  },
};
```

#### Implementation

```typescript
// src/services/sbomAnalysisService.ts
export class SBOMAnalysisService {
  async analyzeSBOM(sbomData: any) {
    const vulnerabilities = [];

    // Extract components from SBOM
    const components = this.extractComponents(sbomData);

    // Check each component for vulnerabilities
    for (const component of components) {
      const vulns = await this.checkComponentVulnerabilities(component);
      vulnerabilities.push(...vulns);
    }

    return {
      totalVulnerabilities: vulnerabilities.length,
      criticalVulnerabilities: vulnerabilities.filter(v => v.severity === 'critical').length,
      highVulnerabilities: vulnerabilities.filter(v => v.severity === 'high').length,
      mediumVulnerabilities: vulnerabilities.filter(v => v.severity === 'medium').length,
      lowVulnerabilities: vulnerabilities.filter(v => v.severity === 'low').length,
      vulnerabilities,
    };
  }

  private async checkComponentVulnerabilities(component: any) {
    const vulnerabilities = [];

    // Check NVD database
    const nvdVulns = await this.checkNVD(component);
    vulnerabilities.push(...nvdVulns);

    // Check OSV database
    const osvVulns = await this.checkOSV(component);
    vulnerabilities.push(...osvVulns);

    return vulnerabilities;
  }
}
```

## Email Services

### Integration with Email Providers

#### Configuration

```typescript
// src/config/email.ts
export const EMAIL_CONFIG = {
  sendgrid: {
    apiKey: import.meta.env.VITE_SENDGRID_API_KEY,
    fromEmail: 'noreply@vendorsoluce.com',
  },
  resend: {
    apiKey: import.meta.env.VITE_RESEND_API_KEY,
    fromEmail: 'noreply@vendorsoluce.com',
  },
};
```

#### Implementation

```typescript
// src/services/emailService.ts
export class EmailService {
  async sendAssessmentInvitation(
    vendorEmail: string,
    assessmentName: string,
    assessmentUrl: string
  ) {
    const emailData = {
      to: vendorEmail,
      from: EMAIL_CONFIG.sendgrid.fromEmail,
      subject: `Assessment Invitation: ${assessmentName}`,
      html: `
        <h2>Assessment Invitation</h2>
        <p>You have been invited to complete an assessment: ${assessmentName}</p>
        <p>Click the link below to access the assessment:</p>
        <a href="${assessmentUrl}">Start Assessment</a>
      `,
    };

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${EMAIL_CONFIG.sendgrid.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    return response.ok;
  }
}
```

## Webhook Configuration

### Setting Up Webhooks

#### Stripe Webhooks

1. **Configure Webhook Endpoint**: Set up endpoint in Stripe dashboard
2. **Select Events**: Choose relevant events to monitor
3. **Test Webhooks**: Use Stripe CLI for local testing

```bash
# Install Stripe CLI
npm install -g stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to local development
stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook
```

#### Custom Webhooks

```typescript
// src/services/webhookService.ts
export class WebhookService {
  async sendWebhook(url: string, payload: any, secret?: string) {
    const signature = secret ? this.generateSignature(payload, secret) : undefined;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(signature && { 'X-Webhook-Signature': signature }),
      },
      body: JSON.stringify(payload),
    });

    return response.ok;
  }

  private generateSignature(payload: any, secret: string): string {
    const crypto = require('crypto');
    return crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex');
  }
}
```

## Custom Integrations

### Building Custom Integrations

#### Integration Template

```typescript
// src/services/customIntegrationService.ts
export interface CustomIntegrationConfig {
  apiKey: string;
  baseUrl: string;
  timeout?: number;
}

export class CustomIntegrationService {
  private config: CustomIntegrationConfig;

  constructor(config: CustomIntegrationConfig) {
    this.config = config;
  }

  async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: AbortSignal.timeout(this.config.timeout || 10000),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }
}
```

#### Integration Registry

```typescript
// src/services/integrationRegistry.ts
export class IntegrationRegistry {
  private integrations: Map<string, any> = new Map();

  register(name: string, integration: any) {
    this.integrations.set(name, integration);
  }

  get(name: string) {
    return this.integrations.get(name);
  }

  list() {
    return Array.from(this.integrations.keys());
  }
}

export const integrationRegistry = new IntegrationRegistry();
```

## Troubleshooting

### Common Integration Issues

#### Authentication Errors

```typescript
// Check API key validity
const testAuth = async (apiKey: string, baseUrl: string) => {
  try {
    const response = await fetch(`${baseUrl}/auth/test`, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    });
    return response.ok;
  } catch (error) {
    console.error('Auth test failed:', error);
    return false;
  }
};
```

#### Rate Limiting

```typescript
// Implement rate limiting
export class RateLimitedService {
  private requests: number[] = [];
  private maxRequests: number;
  private timeWindow: number;

  constructor(maxRequests: number, timeWindowMs: number) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindowMs;
  }

  async makeRequest(requestFn: () => Promise<any>) {
    await this.waitForRateLimit();
    this.requests.push(Date.now());
    return requestFn();
  }

  private async waitForRateLimit() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.timeWindow);

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...this.requests);
      const waitTime = this.timeWindow - (now - oldestRequest);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}
```

#### Error Handling

```typescript
// Comprehensive error handling
export const handleIntegrationError = (error: any, context: string) => {
  console.error(`Integration error in ${context}:`, error);
  
  // Report to Sentry
  reportError(error, { context });
  
  // Return user-friendly error
  return {
    success: false,
    error: 'Integration temporarily unavailable',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined,
  };
};
```

### Testing Integrations

#### Mock Services

```typescript
// src/test/mocks/integrationMocks.ts
export const mockStripeService = {
  createCheckoutSession: vi.fn().mockResolvedValue({
    id: 'cs_test_123',
    url: 'https://checkout.stripe.com/test',
  }),
  createCustomerPortalSession: vi.fn().mockResolvedValue({
    id: 'bps_test_123',
    url: 'https://billing.stripe.com/test',
  }),
};

export const mockSentryService = {
  captureException: vi.fn(),
  setUser: vi.fn(),
  addBreadcrumb: vi.fn(),
};
```

#### Integration Tests

```typescript
// src/test/integration/stripeIntegration.test.ts
describe('Stripe Integration', () => {
  it('should create checkout session', async () => {
    const stripeService = new StripeService();
    const session = await stripeService.createCheckoutSession(
      'price_test_123',
      'test@example.com',
      'https://app.vendorsoluce.com/success',
      'https://app.vendorsoluce.com/cancel'
    );

    expect(session.id).toBeDefined();
    expect(session.url).toBeDefined();
  });
});
```

---

*This integration guide is regularly updated. For the latest version, visit our documentation site.*
