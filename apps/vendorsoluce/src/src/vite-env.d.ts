/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
  
  // App Configuration
  readonly VITE_APP_ENV?: string;
  readonly VITE_APP_VERSION?: string;
  readonly VITE_APP_URL?: string;
  
  // Supabase Configuration
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  
  // API Configuration
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_API_URL?: string;
  readonly VITE_API_RATE_LIMIT?: string;
  readonly VITE_API_RATE_WINDOW?: string;
  
  // Feature Flags
  readonly VITE_ENABLE_VENDOR_ASSESSMENTS?: string;
  readonly VITE_ENABLE_ADVANCED_ANALYTICS?: string;
  readonly VITE_ENABLE_ERROR_REPORTING?: string;
  readonly VITE_ENABLE_OFFLINE_MODE?: string;
  readonly VITE_ENABLE_ANALYTICS?: string;
  readonly VITE_ENABLE_PWA?: string;
  readonly VITE_ENABLE_REAL_TIME?: string;
  readonly VITE_DEBUG_MODE?: string;
  
  // Analytics
  readonly VITE_GA_MEASUREMENT_ID?: string;
  
  // Sentry
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_SENTRY_DSN_DEV?: string;
  readonly VITE_SENTRY_DSN_PROD?: string;
  
  // Stripe
  readonly VITE_STRIPE_PUBLISHABLE_KEY?: string;
  readonly VITE_STRIPE_WEBHOOK_SECRET?: string;
  readonly VITE_STRIPE_PRICE_STARTER?: string;
  readonly VITE_STRIPE_PRODUCT_STARTER?: string;
  readonly VITE_STRIPE_PRICE_PROFESSIONAL?: string;
  readonly VITE_STRIPE_PRODUCT_PROFESSIONAL?: string;
  readonly VITE_STRIPE_PRICE_ENTERPRISE?: string;
  readonly VITE_STRIPE_PRODUCT_ENTERPRISE?: string;
  readonly VITE_STRIPE_PRICE_FEDERAL?: string;
  readonly VITE_STRIPE_PRODUCT_FEDERAL?: string;
  
  // SBOM Analyzer
  readonly VITE_SBOM_ANALYZER_API_URL?: string;
  readonly VITE_SBOM_ANALYZER_API_KEY?: string;
  
  // Additional environment variables
  [key: string]: any;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}