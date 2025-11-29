import { logger } from './utils/logger';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initSentry } from './utils/sentry';
import { validateProductionEnvironment } from './utils/environmentValidator';

// SAFEGUARD: Detect multiple React instances
try {
  // @ts-ignore - Accessing window for React instance check
  const reactInstance = window.__REACT_DEVTOOLS_GLOBAL_HOOK__?.renderers;
  if (reactInstance && Object.keys(reactInstance).length > 1) {
    console.warn('⚠️ Multiple React instances detected! This can cause "Cannot set properties of undefined" errors.');
    console.warn('Please check your build configuration to ensure React is bundled as a single chunk.');
  }
} catch (e) {
  // Ignore in production
}

// SAFEGUARD: Check for undefined React exports
try {
  const React = require('react');
  if (!React.createElement || !React.useState || !React.createContext) {
    throw new Error('React is missing critical exports! This indicates bundling issues.');
  }
} catch (error) {
  console.error('❌ CRITICAL: React bundling issue detected:', error);
  logger.error('React bundling issue:', error);
}

try {
  // Validate environment configuration
  validateProductionEnvironment();
} catch (error) {
  logger.error('Environment validation failed:', error);
}

// Initialize Sentry error tracking (non-blocking)
try {
  initSentry();
} catch (error) {
  logger.warn('Sentry initialization failed:', error);
}

// Initialize performance monitoring (non-blocking)
if (import.meta.env.PROD) {
  import('./hooks/usePerformanceMonitoring').then(() => {
    // Performance monitoring will be initialized when components mount
  }).catch((error) => {
    logger.warn('Performance monitoring initialization failed:', error);
  });
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);