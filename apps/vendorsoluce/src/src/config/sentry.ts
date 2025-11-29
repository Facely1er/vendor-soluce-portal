// Sentry Configuration
// This file contains environment-specific Sentry settings

interface SentryEvent {
  exception?: {
    values?: Array<{
      type?: string;
    }>;
  };
}

interface SentryConfig {
  dsn: string;
  environment: string;
  tracesSampleRate: number;
  sampleRate: number;
  debug: boolean;
  beforeSend: (event: SentryEvent) => SentryEvent | null;
}

export const sentryConfig: Record<string, SentryConfig> = {
  // Development settings
  development: {
    dsn: import.meta.env.VITE_SENTRY_DSN_DEV || '',
    environment: 'development',
    tracesSampleRate: 1.0,
    sampleRate: 1.0,
    debug: true,
    beforeSend: (event: SentryEvent) => {
      // In development, log all events to console
      if (import.meta.env.DEV) {
        console.log('Sentry Event:', event);
      }
      return event;
    },
  },

  // Production settings
  production: {
    dsn: import.meta.env.VITE_SENTRY_DSN_PROD || '',
    environment: 'production',
    tracesSampleRate: 0.1,
    sampleRate: 0.1,
    debug: false,
    beforeSend: (event: SentryEvent) => {
      // Filter out non-critical errors in production
      if (event.exception) {
        const error = event.exception.values?.[0];
        if (error?.type === 'NetworkError' || error?.type === 'ChunkLoadError') {
          return null;
        }
      }
      return event;
    },
  },

  // Test settings
  test: {
    dsn: '',
    environment: 'test',
    tracesSampleRate: 0,
    sampleRate: 0,
    debug: false,
    beforeSend: () => null, // Don't send events in tests
  },
};

export const getSentryConfig = (): SentryConfig => {
  const env = import.meta.env.MODE || 'development';
  return sentryConfig[env] || sentryConfig.development;
};

// Initialize Sentry if DSN is available
export const initializeSentry = () => {
  const config = getSentryConfig();
  
  if (config.dsn) {
    // In a real implementation, you would initialize Sentry here
    // import * as Sentry from '@sentry/react';
    // Sentry.init(config);
    
    if (import.meta.env.DEV) {
      console.log('Sentry would be initialized with config:', config);
    }
  }
};