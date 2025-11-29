import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import BackToDashboardLink from '../../components/common/BackToDashboardLink';
import { 
  BarChart3, 
  FileText, 
  Shield, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  Database,
  Zap
} from 'lucide-react';

interface AssessmentModule {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
}

const VendorIQ: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [activeModule, setActiveModule] = useState<string | null>(null);

  const modules: AssessmentModule[] = [
    {
      id: 'dashboard',
      name: t('vendorIQ.modules.dashboard.title'),
      description: t('vendorIQ.modules.dashboard.description'),
      icon: <BarChart3 className="h-6 w-6 text-vendorsoluce-green" />,
      features: [
        t('vendorIQ.modules.dashboard.features.realTimeMetrics'),
        t('vendorIQ.modules.dashboard.features.riskDistribution'),
        t('vendorIQ.modules.dashboard.features.trendAnalysis'),
        t('vendorIQ.modules.dashboard.features.quickStats')
      ]
    },
    {
      id: 'assessment',
      name: t('vendorIQ.modules.assessment.title'),
      description: t('vendorIQ.modules.assessment.description'),
      icon: <Shield className="h-6 w-6 text-vendorsoluce-navy" />,
      features: [
        t('vendorIQ.modules.assessment.features.multiDimensional'),
        t('vendorIQ.modules.assessment.features.templates'),
        t('vendorIQ.modules.assessment.features.history'),
        t('vendorIQ.modules.assessment.features.automatedScoring')
      ]
    },
    {
      id: 'dataManagement',
      name: t('vendorIQ.modules.dataManagement.title'),
      description: t('vendorIQ.modules.dataManagement.description'),
      icon: <Database className="h-6 w-6 text-vendorsoluce-teal" />,
      features: [
        t('vendorIQ.modules.dataManagement.features.importExport'),
        t('vendorIQ.modules.dataManagement.features.backupRestore'),
        t('vendorIQ.modules.dataManagement.features.csvJson'),
        t('vendorIQ.modules.dataManagement.features.versionControl')
      ]
    },
    {
      id: 'nistMapping',
      name: t('vendorIQ.modules.nistMapping.title'),
      description: t('vendorIQ.modules.nistMapping.description'),
      icon: <FileText className="h-6 w-6 text-vendorsoluce-blue" />,
      features: [
        t('vendorIQ.modules.nistMapping.features.nist800161'),
        t('vendorIQ.modules.nistMapping.features.complianceMapping'),
        t('vendorIQ.modules.nistMapping.features.requirementTracking'),
        t('vendorIQ.modules.nistMapping.features.frameworkAlignment')
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackToDashboardLink />
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('vendorIQ.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {t('vendorIQ.description')}
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {t('vendorIQ.stats.totalVendors')}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">-</p>
                </div>
                <Users className="h-8 w-8 text-vendorsoluce-green" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {t('vendorIQ.stats.totalAssessments')}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">-</p>
                </div>
                <FileText className="h-8 w-8 text-vendorsoluce-navy" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {t('vendorIQ.stats.highRisk')}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">-</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-risk-high" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {t('vendorIQ.stats.averageRisk')}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">-</p>
                </div>
                <TrendingUp className="h-8 w-8 text-vendorsoluce-teal" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {modules.map((module) => (
            <div
              key={module.id}
              tabIndex={0}
              role="button"
              onKeyPress={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setActiveModule(activeModule === module.id ? null : module.id);
                }
              }}
              onClick={() => setActiveModule(activeModule === module.id ? null : module.id)}
            >
            <Card 
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      {module.icon}
                    </div>
                    <div>
                      <CardTitle className="text-gray-900 dark:text-white mb-1">
                        {module.name}
                      </CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {module.description}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              {activeModule === module.id && (
                <CardContent>
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      {t('vendorIQ.modules.features')}
                    </h4>
                    <ul className="space-y-2">
                      {module.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                          <CheckCircle className="h-4 w-4 text-vendorsoluce-green mr-2 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              )}
            </Card>
            </div>
          ))}
        </div>

        {/* Key Features Section */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              {t('vendorIQ.keyFeatures.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Zap className="h-5 w-5 text-vendorsoluce-green mr-2" />
                  {t('vendorIQ.keyFeatures.riskScoring.title')}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {t('vendorIQ.keyFeatures.riskScoring.description')}
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-6 list-disc">
                  <li>{t('vendorIQ.keyFeatures.riskScoring.categoryWeight')}</li>
                  <li>{t('vendorIQ.keyFeatures.riskScoring.dataSensitivity')}</li>
                  <li>{t('vendorIQ.keyFeatures.riskScoring.contractValue')}</li>
                  <li>{t('vendorIQ.keyFeatures.riskScoring.assessmentRecency')}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Shield className="h-5 w-5 text-vendorsoluce-navy mr-2" />
                  {t('vendorIQ.keyFeatures.multiDimensional.title')}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {t('vendorIQ.keyFeatures.multiDimensional.description')}
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-6 list-disc">
                  <li>{t('vendorIQ.keyFeatures.multiDimensional.security')}</li>
                  <li>{t('vendorIQ.keyFeatures.multiDimensional.compliance')}</li>
                  <li>{t('vendorIQ.keyFeatures.multiDimensional.financial')}</li>
                  <li>{t('vendorIQ.keyFeatures.multiDimensional.operational')}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        {!isAuthenticated && (
          <Card className="bg-gradient-to-r from-vendorsoluce-green to-vendorsoluce-light-green border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {t('vendorIQ.cta.title')}
                  </h3>
                  <p className="text-white/90">
                    {t('vendorIQ.cta.description')}
                  </p>
                </div>
                <Button
                  variant="primary"
                  className="bg-white text-vendorsoluce-green hover:bg-gray-100"
                  onClick={() => window.location.href = '/signin'}
                >
                  {t('vendorIQ.cta.getStarted')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VendorIQ;

