/**
 * Configuration management for the application
 */

interface AppConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  app: {
    env: string;
    version: string;
    name: string;
    isDemo: boolean;
    isTrial: boolean;
  };
  api: {
    baseUrl: string;
    timeout: number;
    retries: number;
  };
  features: {
    vendorAssessments: boolean;
    advancedAnalytics: boolean;
    performanceMonitoring: boolean;
  };
  analytics: {
    gaId?: string;
    enabled: boolean;
  };
  rateLimiting: {
    maxRequests: number;
    windowMs: number;
  };
}

// Validate required environment variables
const requiredEnvVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
const missingEnvVars = requiredEnvVars.filter(envVar => !import.meta.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

// Detect demo/trial mode
const appEnv = import.meta.env.VITE_APP_ENV || 'development';
const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
const isDemo = appEnv === 'demo' || hostname.includes('demo.') || hostname.includes('trial.');
const isTrial = appEnv === 'trial' || hostname.includes('trial.');

export const config: AppConfig = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
  app: {
    env: appEnv,
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    name: isDemo ? 'VendorSoluce (Demo)' : 'VendorSoluce',
    isDemo,
    isTrial,
  },
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.vendorsoluce.com',
    timeout: 30000,
    retries: 3,
  },
  features: {
    vendorAssessments: import.meta.env.VITE_ENABLE_VENDOR_ASSESSMENTS === 'true',
    advancedAnalytics: import.meta.env.VITE_ENABLE_ADVANCED_ANALYTICS === 'true',
    performanceMonitoring: import.meta.env.PROD && !isDemo,
  },
  analytics: {
    gaId: import.meta.env.VITE_GA_MEASUREMENT_ID,
    enabled: (import.meta.env.PROD || isDemo) && !!import.meta.env.VITE_GA_MEASUREMENT_ID,
  },
  rateLimiting: {
    maxRequests: parseInt(import.meta.env.VITE_API_RATE_LIMIT || (isDemo ? '50' : '100'), 10) || (isDemo ? 50 : 100),
    windowMs: parseInt(import.meta.env.VITE_API_RATE_WINDOW || '60000', 10) || 60000,
  },
};

// Expose config in development for debugging
if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as any).__APP_CONFIG__ = config;
}