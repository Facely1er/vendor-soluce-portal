import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export interface PageContext {
  page: string;
  feature?: string;
  section?: string;
}

export const usePageContext = (): PageContext => {
  const location = useLocation();
  const [context, setContext] = useState<PageContext>({ page: 'home' });

  useEffect(() => {
    const pathname = location.pathname;
    
    // Map routes to page contexts
    const pageMap: Record<string, PageContext> = {
      '/': { page: 'home' },
      '/dashboard': { page: 'dashboard', feature: 'overview' },
      '/vendors': { page: 'vendor-risk-dashboard', feature: 'vendor-management' },
      '/vendor-risk-dashboard': { page: 'vendor-risk-dashboard', feature: 'vendor-management' },
      '/sbom-analyzer': { page: 'sbom-analyzer', feature: 'sbom-analysis' },
      '/supply-chain-assessment': { page: 'supply-chain-assessment', feature: 'assessment' },
      '/supply-chain-results': { page: 'supply-chain-results', feature: 'assessment-results' },
      '/vendor-assessments': { page: 'vendor-assessments', feature: 'vendor-assessment-management' },
      '/templates': { page: 'templates', feature: 'template-library' },
      '/pricing': { page: 'pricing', feature: 'subscription' },
      '/contact': { page: 'contact', feature: 'support' },
      '/api-docs': { page: 'api-docs', feature: 'api-documentation' },
      '/integration-guides': { page: 'integration-guides', feature: 'integrations' },
      '/profile': { page: 'profile', feature: 'user-settings' },
      '/account': { page: 'account', feature: 'account-management' },
      '/billing': { page: 'billing', feature: 'billing-management' },
      '/onboarding': { page: 'onboarding', feature: 'user-onboarding' },
      '/tools/nist-checklist': { page: 'nist-checklist', feature: 'compliance-tool' },
      '/tools/sbom-quick-scan': { page: 'sbom-quick-scan', feature: 'quick-analysis' },
      '/tools/vendor-risk-radar': { page: 'vendor-risk-radar', feature: 'risk-visualization' },
      '/tools/vendor-risk-calculator': { page: 'vendor-risk-calculator', feature: 'risk-calculation' }
    };

    // Find exact match or closest match
    let pageContext = pageMap[pathname];
    
    if (!pageContext) {
      // Try to match by prefix for dynamic routes
      for (const [route, ctx] of Object.entries(pageMap)) {
        if (pathname.startsWith(route) && route !== '/') {
          pageContext = ctx;
          break;
        }
      }
    }

    // Default to home if no match found
    if (!pageContext) {
      pageContext = { page: 'home' };
    }

    setContext(pageContext);
  }, [location.pathname]);

  return context;
};
