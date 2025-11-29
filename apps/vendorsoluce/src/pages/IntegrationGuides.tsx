import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Shield, 
  Code, 
  Database, 
  Cloud, 
  Zap,
  Download,
  ExternalLink,
  Copy,
  CheckCircle,
  Book,
  Terminal,
  Globe,
  Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { logger } from '../utils/logger';

interface IntegrationGuide {
  id: string;
  title: string;
  description: string;
  category: 'api' | 'webhooks' | 'sso' | 'export' | 'automation';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  icon: React.ReactNode;
  steps: string[];
  codeExample?: string;
  documentation?: string;
}

const IntegrationGuides: React.FC = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const integrationGuides: IntegrationGuide[] = [
    {
      id: 'rest-api',
      title: t('integrationGuides.guides.restApi.title'),
      description: t('integrationGuides.guides.restApi.description'),
      category: 'api',
      difficulty: 'intermediate',
      estimatedTime: t('integrationGuides.guides.restApi.estimatedTime'),
      icon: <Code className="h-6 w-6 text-blue-600" />,
      steps: t('integrationGuides.guides.restApi.steps', { returnObjects: true }) as string[],
      codeExample: `// Example: Fetch vendor risk data
const response = await fetch('https://api.vendorsoluce.com/v1/vendors', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const vendors = await response.json();
console.log(vendors);`,
      documentation: '/api-docs'
    },
    {
      id: 'webhook-setup',
      title: t('integrationGuides.guides.webhookSetup.title'),
      description: t('integrationGuides.guides.webhookSetup.description'),
      category: 'webhooks',
      difficulty: 'intermediate',
      estimatedTime: t('integrationGuides.guides.webhookSetup.estimatedTime'),
      icon: <Zap className="h-6 w-6 text-yellow-600" />,
      steps: t('integrationGuides.guides.webhookSetup.steps', { returnObjects: true }) as string[],
      codeExample: `// Example: Webhook endpoint handler
app.post('/webhooks/vendorsoluce', (req, res) => {
  const { event, data } = req.body;
  
  switch(event) {
    case 'vendor.risk_changed':
      handleRiskChange(data);
      break;
    case 'assessment.completed':
      handleAssessmentComplete(data);
      break;
  }
  
  res.status(200).send('OK');
});`,
      documentation: '/api-docs#webhooks'
    },
    {
      id: 'sso-integration',
      title: t('integrationGuides.guides.ssoIntegration.title'),
      description: t('integrationGuides.guides.ssoIntegration.description'),
      category: 'sso',
      difficulty: 'advanced',
      estimatedTime: t('integrationGuides.guides.ssoIntegration.estimatedTime'),
      icon: <Lock className="h-6 w-6 text-green-600" />,
      steps: t('integrationGuides.guides.ssoIntegration.steps', { returnObjects: true }) as string[],
      documentation: '/api-docs#sso'
    },
    {
      id: 'data-export',
      title: t('integrationGuides.guides.dataExport.title'),
      description: t('integrationGuides.guides.dataExport.description'),
      category: 'export',
      difficulty: 'beginner',
      estimatedTime: t('integrationGuides.guides.dataExport.estimatedTime'),
      icon: <Download className="h-6 w-6 text-purple-600" />,
      steps: t('integrationGuides.guides.dataExport.steps', { returnObjects: true }) as string[],
      codeExample: `// Example: Automated export script
const exportData = async () => {
  const response = await fetch('/api/exports/vendors', {
    headers: { 'Authorization': 'Bearer ' + apiKey }
  });
  
  const csvData = await response.text();
  await uploadToS3(csvData, 'vendors-export.csv');
};

// Schedule daily exports
cron.schedule('0 2 * * *', exportData);`,
      documentation: '/api-docs#exports'
    },
    {
      id: 'workflow-automation',
      title: t('integrationGuides.guides.workflowAutomation.title'),
      description: t('integrationGuides.guides.workflowAutomation.description'),
      category: 'automation',
      difficulty: 'advanced',
      estimatedTime: t('integrationGuides.guides.workflowAutomation.estimatedTime'),
      icon: <Zap className="h-6 w-6 text-orange-600" />,
      steps: t('integrationGuides.guides.workflowAutomation.steps', { returnObjects: true }) as string[],
      codeExample: `// Example: Automated vendor onboarding
const onboardVendor = async (vendorData) => {
  // Create vendor record
  const vendor = await createVendor(vendorData);
  
  // Trigger risk assessment
  if (vendor.risk_score > 70) {
    await sendSecurityAssessment(vendor.id);
    await notifySecurityTeam(vendor);
  }
  
  return vendor;
};`,
      documentation: '/api-docs#automation'
    },
    {
      id: 'cloud-integration',
      title: t('integrationGuides.guides.cloudIntegration.title'),
      description: t('integrationGuides.guides.cloudIntegration.description'),
      category: 'api',
      difficulty: 'advanced',
      estimatedTime: t('integrationGuides.guides.cloudIntegration.estimatedTime'),
      icon: <Cloud className="h-6 w-6 text-blue-500" />,
      steps: t('integrationGuides.guides.cloudIntegration.steps', { returnObjects: true }) as string[],
      documentation: '/api-docs#cloud-integration'
    }
  ];

  const categories = [
    { id: 'all', label: t('integrationGuides.categories.all'), icon: <Globe className="h-4 w-4" /> },
    { id: 'api', label: t('integrationGuides.categories.api'), icon: <Code className="h-4 w-4" /> },
    { id: 'webhooks', label: t('integrationGuides.categories.webhooks'), icon: <Zap className="h-4 w-4" /> },
    { id: 'sso', label: t('integrationGuides.categories.sso'), icon: <Lock className="h-4 w-4" /> },
    { id: 'export', label: t('integrationGuides.categories.export'), icon: <Download className="h-4 w-4" /> },
    { id: 'automation', label: t('integrationGuides.categories.automation'), icon: <Terminal className="h-4 w-4" /> }
  ];

  const filteredGuides = selectedCategory === 'all' 
    ? integrationGuides 
    : integrationGuides.filter(guide => guide.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    return t(`integrationGuides.difficulty.${difficulty}`);
  };

  const copyToClipboard = async (code: string, guideId: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(guideId);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      logger.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {t('integrationGuides.title')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
          {t('integrationGuides.description')}
        </p>
      </div>

      {/* Quick Start Section */}
      <Card className="mb-8 border-l-4 border-l-vendorsoluce-green">
        <CardContent className="p-6">
          <div className="pt-2 flex items-start">
            <div className="w-12 h-12 bg-vendorsoluce-green/10 rounded-full flex items-center justify-center mr-2">
              <Book className="h-6 w-6 text-vendorsoluce-green" />
            </div>
            <div className="flex-1">
              <h2 className="pt-4 text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t('integrationGuides.quickStart.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                {t('integrationGuides.quickStart.description')}
              </p>
              <div className="flex space-x-3">
                <Link to="/api-docs">
                  <Button variant="primary" size="sm">
                    <Code className="h-4 w-4 mr-2" />
                    {t('integrationGuides.quickStart.viewApiDocs')}
                  </Button>
                </Link>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  {t('integrationGuides.quickStart.downloadSDKs')}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-vendorsoluce-green text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {category.icon}
              <span className="ml-2">{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Integration Guides */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredGuides.map((guide) => (
          <Card key={guide.id} className="h-full flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mr-3">
                    {guide.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg text-gray-900 dark:text-white">
                      {guide.title}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(guide.difficulty)}`}>
                        {getDifficultyLabel(guide.difficulty)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {guide.estimatedTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1 leading-relaxed">
                {guide.description}
              </p>
              
              {/* Steps */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  {t('integrationGuides.common.implementationSteps')}
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {guide.steps.slice(0, 3).map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                  {guide.steps.length > 3 && (
                    <li className="text-gray-500 dark:text-gray-400">
                      {t('integrationGuides.common.moreSteps', { count: guide.steps.length - 3 })}
                    </li>
                  )}
                </ol>
              </div>
              
              {/* Code Example */}
              {guide.codeExample && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {t('integrationGuides.common.codeExample')}
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(guide.codeExample!, guide.id)}
                      className="text-xs"
                    >
                      {copiedCode === guide.id ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {t('integrationGuides.common.copied')}
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" />
                          {t('integrationGuides.common.copy')}
                        </>
                      )}
                    </Button>
                  </div>
                  <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-xs font-mono overflow-x-auto border border-gray-200 dark:border-gray-700 leading-relaxed">
                    <code className="text-gray-800 dark:text-gray-200">
                      {guide.codeExample}
                    </code>
                  </pre>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex space-x-2 mt-auto">
                {guide.documentation && (
                  <Link to={guide.documentation} className="flex-1">
                    <Button variant="primary" size="sm" className="w-full">
                      <Book className="h-4 w-4 mr-2" />
                      {t('integrationGuides.common.viewGuide')}
                    </Button>
                  </Link>
                )}
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {t('integrationGuides.common.examples')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* SDK and Tools Section */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          {t('integrationGuides.sdks.title')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Database className="h-8 w-8 text-blue-600 mr-3" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {t('integrationGuides.sdks.javascript.title')}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              {t('integrationGuides.sdks.javascript.description')}
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                {t('integrationGuides.sdks.javascript.npmInstall')}
              </Button>
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                {t('integrationGuides.sdks.javascript.github')}
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Shield className="h-8 w-8 text-green-600 mr-3" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {t('integrationGuides.sdks.python.title')}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              {t('integrationGuides.sdks.python.description')}
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                {t('integrationGuides.sdks.python.pipInstall')}
              </Button>
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                {t('integrationGuides.sdks.python.pypi')}
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Terminal className="h-8 w-8 text-purple-600 mr-3" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {t('integrationGuides.sdks.cli.title')}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              {t('integrationGuides.sdks.cli.description')}
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                {t('integrationGuides.sdks.cli.download')}
              </Button>
              <Button variant="ghost" size="sm">
                <Book className="h-4 w-4 mr-2" />
                {t('integrationGuides.sdks.cli.docs')}
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Support Section */}
      <section className="mt-16">
        <Card className="bg-gradient-to-r from-vendorsoluce-navy to-vendorsoluce-teal text-white">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                <h2 className="text-2xl font-bold mb-2">
                  {t('integrationGuides.support.title')}
                </h2>
                <p className="text-gray-100 max-w-xl leading-relaxed">
                  {t('integrationGuides.support.description')}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact">
                  <Button variant="secondary" size="lg" className="bg-white text-vendorsoluce-navy hover:bg-gray-100">
                    {t('integrationGuides.support.contactSupport')}
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/20">
                  {t('integrationGuides.support.scheduleConsultation')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default IntegrationGuides;