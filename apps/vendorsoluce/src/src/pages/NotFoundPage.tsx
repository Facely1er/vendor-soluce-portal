import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Home, ArrowLeft, Search, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleContactSupport = () => {
    navigate('/contact');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <Card className="text-center">
          <CardContent className="p-8">
            {/* 404 Icon */}
            <div className="mb-6">
              <div className="text-8xl font-bold text-vendorsoluce-green mb-4">404</div>
              <div className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                {t('errors.pageNotFound') || 'Page Not Found'}
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {t('errors.pageNotFoundDescription') || 'The page you are looking for does not exist.'}
              </p>
            </div>

            {/* Current URL */}
            <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {t('errors.requestedUrl') || 'Requested URL:'}
              </p>
              <code className="text-sm font-mono text-gray-900 dark:text-white break-all">
                {location.pathname}
              </code>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                onClick={handleGoBack}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('common.goBack') || 'Go Back'}
              </Button>
              <Button
                onClick={handleGoHome}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                {t('common.goHome') || 'Go Home'}
              </Button>
            </div>

            {/* Helpful Suggestions */}
            <div className="text-left mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('errors.whatYouCanDo') || 'What you can do:'}
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-vendorsoluce-green" />
                  {t('errors.checkUrlTypos') || 'Check the URL for typos'}
                </li>
                <li className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4 text-vendorsoluce-green" />
                  {t('errors.goBackPrevious') || 'Go back to the previous page'}
                </li>
                <li className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-vendorsoluce-green" />
                  {t('errors.returnHomepage') || 'Return to the homepage'}
                </li>
              </ul>
            </div>

            {/* Contact Support */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t('errors.needHelp') || 'Need help?'}
              </p>
              <Button
                onClick={handleContactSupport}
                variant="outline"
                className="flex items-center gap-2 mx-auto"
              >
                <Mail className="h-4 w-4" />
                {t('common.contactSupport') || 'Contact Support'}
              </Button>
            </div>

            {/* Quick Links */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {t('errors.popularPages') || 'Popular pages:'}
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  onClick={() => navigate('/dashboard')}
                  variant="ghost"
                  size="sm"
                >
                  Dashboard
                </Button>
                <Button
                  onClick={() => navigate('/supply-chain-assessment')}
                  variant="ghost"
                  size="sm"
                >
                  Assessment
                </Button>
                <Button
                  onClick={() => navigate('/sbom-analyzer')}
                  variant="ghost"
                  size="sm"
                >
                  SBOM Analyzer
                </Button>
                <Button
                  onClick={() => navigate('/vendors')}
                  variant="ghost"
                  size="sm"
                >
                  Vendors
                </Button>
                <Button
                  onClick={() => navigate('/pricing')}
                  variant="ghost"
                  size="sm"
                >
                  Pricing
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFoundPage;
