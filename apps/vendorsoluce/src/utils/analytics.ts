/**
 * Production analytics and tracking utilities
 */

import { logger, devConsole } from './monitoring';

interface TrackingEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  customProperties?: Record<string, any>;
}

class Analytics {
  private isInitialized = false;
  private isDevelopment = import.meta.env.DEV;

  initialize() {
    if (this.isInitialized || this.isDevelopment) return;

    // Initialize tracking services in production
    this.isInitialized = true;
    
    // Example: Initialize Google Analytics
    // gtag('config', 'GA_MEASUREMENT_ID');
    
    logger.info('Analytics initialized for production');
  }

  track(event: TrackingEvent) {
    if (this.isDevelopment) {
      devConsole.log('Analytics (dev):', event);
      return;
    }

    // Send to analytics service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        custom_map: event.customProperties
      });
    }
  }

  trackPageView(path: string, title?: string) {
    this.track({
      action: 'page_view',
      category: 'navigation',
      label: path,
      customProperties: {
        page_path: path,
        page_title: title || document.title
      }
    });
  }

  trackUserAction(action: string, details?: Record<string, any>) {
    this.track({
      action,
      category: 'user_interaction',
      customProperties: details
    });
  }

  trackFeatureUsage(feature: string, success: boolean = true) {
    this.track({
      action: 'feature_used',
      category: 'features',
      label: feature,
      value: success ? 1 : 0
    });
  }

  trackError(error: string, details?: Record<string, any>) {
    this.track({
      action: 'error',
      category: 'errors',
      label: error,
      customProperties: details
    });
  }

  trackAssessmentCompletion(assessmentType: string, score: number) {
    this.track({
      action: 'assessment_completed',
      category: 'assessments',
      label: assessmentType,
      value: score
    });
  }

  trackVendorAction(action: string, vendorCount?: number) {
    this.track({
      action,
      category: 'vendor_management',
      value: vendorCount
    });
  }
}

export const analytics = new Analytics();

// Initialize analytics when the module loads
if (!import.meta.env.DEV) {
  analytics.initialize();
}