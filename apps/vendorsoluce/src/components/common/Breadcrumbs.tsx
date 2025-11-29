import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BreadcrumbItem {
  label: string;
  path: string;
}

const Breadcrumbs: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const routeLabels: Record<string, string> = {
    '/': t('navigation.home') || 'Home',
    '/dashboard': t('navigation.dashboard') || 'Dashboard',
    '/vendors': t('navigation.vendors') || 'Vendors',
    '/vendor-risk-dashboard': t('navigation.vendors') || 'Vendors',
    '/supply-chain-assessment': t('navigation.assessment') || 'Supply Chain Assessment',
    '/supply-chain-results': t('navigation.results') || 'Assessment Results',
    '/supply-chain-recommendations': t('navigation.recommendations') || 'Recommendations',
    '/sbom-analyzer': t('navigation.sbom') || 'SBOM Analyzer',
    '/sbom-analysis': 'SBOM Analysis',
    '/vendor-assessments': t('navigation.vendorAssessments') || 'Vendor Security Assessments (VendorTal)',
    '/templates': t('navigation.templates') || 'Templates',
    '/how-it-works': t('navigation.howItWorks') || 'How It Works',
    '/pricing': t('navigation.pricing') || 'Pricing',
    '/contact': 'Contact',
    '/profile': 'Profile',
    '/account': 'Account',
    '/onboarding': 'Onboarding',
    '/api-docs': 'API Documentation',
    '/integration-guides': 'Integration Guides',
    '/tools': 'Tools',
    '/tools/nist-checklist': 'NIST Checklist',
    '/tools/sbom-quick-scan': 'SBOM Quick Scan',
    '/tools/vendor-risk-radar': 'Vendor Risk Radar',
  };

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathnames = location.pathname.split('/').filter(x => x);

    if (pathnames.length === 0) {
      return [];
    }

    const breadcrumbs: BreadcrumbItem[] = [];
    let currentPath = '';

    pathnames.forEach((segment) => {
      currentPath += `/${segment}`;

      const label = routeLabels[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

      breadcrumbs.push({
        label,
        path: currentPath,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4" aria-label="Breadcrumb">
      <Link
        to="/"
        className="flex items-center hover:text-vendorsoluce-green dark:hover:text-vendorsoluce-blue transition-colors"
        aria-label="Home"
      >
        <Home className="h-4 w-4" />
      </Link>

      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return (
          <React.Fragment key={crumb.path}>
            <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-600" />
            {isLast ? (
              <span className="font-medium text-gray-900 dark:text-white" aria-current="page">
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.path}
                className="hover:text-vendorsoluce-green dark:hover:text-vendorsoluce-blue transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
