// Marketing Event Tracker Component
// Automatically tracks user events for marketing automation
// File: src/components/marketing/MarketingEventTracker.tsx

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useMarketingAutomation } from '../../hooks/useMarketingAutomation';

/**
 * Component that automatically tracks user events for marketing automation
 * Add this to your App.tsx or main layout component
 */
export function MarketingEventTracker() {
  const { user, profile } = useAuth();
  const { events, triggerWelcomeWorkflow } = useMarketingAutomation();
  const location = useLocation();

  // Track page views
  useEffect(() => {
    if (user?.id) {
      if (location.pathname === '/dashboard') {
        events.dashboardViewed();
      }
    }
  }, [location.pathname, user?.id, events]);

  // Track feature usage
  useEffect(() => {
    if (user?.id) {
      const path = location.pathname;
      
      if (path.includes('/vendors')) {
        events.featureUsed('vendor_management');
      } else if (path.includes('/assessments')) {
        events.featureUsed('assessments');
      } else if (path.includes('/sbom')) {
        events.featureUsed('sbom_analyzer');
      } else if (path.includes('/pricing')) {
        events.featureUsed('pricing_page');
      }
    }
  }, [location.pathname, user?.id, events]);

  // This component doesn't render anything
  return null;
}

