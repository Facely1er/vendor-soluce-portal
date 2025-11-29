import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Target,
  FileSearch,
  TrendingUp,
  Users,
  Crown,
  FileText,
  Code,
  Building,
  MessageSquare,
  DollarSign,
  ArrowRight,
  HelpCircle,
  Shield
} from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Company Info - Back on the left */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-3">
              <img src="/vendortal.png" alt={t('footer.company.name', 'VendorTal™ Risk Review')} className="h-12 w-12 mr-2" />

              <span className="ml-2">
                <span className="block text-xl font-bold text-vendortal-purple dark:text-white">VendorTal™</span>
                <span className="block text-xs text-gray-600 dark:text-gray-400 font-normal">Risk Review</span>
                <span className="block text-xs text-gray-600 dark:text-gray-400 font-normal">by ERMITS</span>
              </span>
            </div>
            <p className="text-gray-300 mb-3 text-sm">
              {t('footer.company.description', 'Comprehensive vendor portal assessment platform for managing vendor risk reviews, security assessments, and compliance evaluations.')}
            </p>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              {t('footer.sections.solutions', 'Solutions')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/vendor-assessments" className="text-gray-300 hover:text-white flex items-center group text-sm">
                  <Target className="h-4 w-4 mr-2 text-vendortal-purple" />
                  <span>{t('footer.links.solutions.supplyChainAssessment', 'Supply Chain Assessment')}</span>
                  <ArrowRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/sbom-analyzer" className="text-gray-300 hover:text-white flex items-center group text-sm">
                  <FileSearch className="h-4 w-4 mr-2 text-vendortal-purple" />
                  <span>{t('footer.links.solutions.sbomAnalysis', 'SBOM Analysis')}</span>
                  <ArrowRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/vendor-risk-dashboard" className="text-gray-300 hover:text-white flex items-center group text-sm">
                  <TrendingUp className="h-4 w-4 mr-2 text-vendortal-purple" />
                  <span>{t('footer.links.solutions.vendorRiskDashboard', 'Vendor Risk Dashboard')}</span>
                  <ArrowRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/vendor-assessments" className="text-gray-300 hover:text-white flex items-center group text-sm">
                  <Users className="h-4 w-4 mr-2 text-vendortal-navy" />
                  <span>{t('footer.links.solutions.vendorAssessments', 'Vendor Security Assessments')}</span>
                  <Crown className="h-3 w-3 ml-1 text-yellow-500" />
                  <ArrowRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              {t('footer.sections.resources', 'Resources')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/templates" className="text-gray-300 hover:text-white flex items-center group text-sm">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>{t('footer.links.resources.templates', 'Templates & Downloads')}</span>
                  <ArrowRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/api-docs" className="text-gray-300 hover:text-white flex items-center group text-sm">
                  <Code className="h-4 w-4 mr-2" />
                  <span>{t('footer.links.resources.apiDocs', 'API Documentation')}</span>
                  <ArrowRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/integration-guides" className="text-gray-300 hover:text-white flex items-center group text-sm">
                  <Code className="h-4 w-4 mr-2" />
                  <span>{t('footer.links.resources.integrationGuides', 'Integration Guides')}</span>
                  <ArrowRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-300 hover:text-white flex items-center group text-sm">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  <span>{t('footer.links.resources.howItWorks', 'How It Works')}</span>
                  <ArrowRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              {t('footer.sections.company', 'Company')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white flex items-center group text-sm">
                  <Building className="h-4 w-4 mr-2" />
                  <span>{t('footer.links.company.about', 'About Us')}</span>
                  <ArrowRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white flex items-center group text-sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <span>{t('footer.links.company.contact', 'Contact')}</span>
                  <ArrowRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-300 hover:text-white flex items-center group text-sm">
                  <DollarSign className="h-4 w-4 mr-2" />
                  <span>{t('footer.links.company.pricing', 'Pricing')}</span>
                  <ArrowRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white flex items-center group text-sm">
                  <Shield className="h-4 w-4 mr-2" />
                  <span>{t('footer.links.company.privacy', 'Privacy Policy')}</span>
                  <ArrowRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-4 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              {t('footer.copyright', '© 2025 ERMITS LLC. All rights reserved.')}
            </div>
            <div className="mt-2 md:mt-0">
              <Link to="/vendor-assessments" className="inline-flex items-center px-4 py-2 bg-vendortal-purple text-white rounded-md hover:bg-vendortal-dark-purple transition-colors text-sm">
                <Target className="h-4 w-4 mr-2" />
                {t('footer.cta.text', 'Start Free Assessment')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;