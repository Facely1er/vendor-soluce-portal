import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Shield, FileJson, BarChart3, Info, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Templates: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handlePreview = (templatePath: string, filename: string) => {
    navigate('/templates/preview', {
      state: { templatePath, filename }
    });
  };
  
  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('resources.templates.title')}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl">
          {t('resources.templates.description')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card className="flex flex-col h-full">
          <div className="p-6 bg-vendortal-purple text-white rounded-t-lg">
            <div className="flex items-center mb-3">
              <Shield className="h-6 w-6 mr-2" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('resources.templates.categories.vendorQuestionnaires.title')}</h2>
            </div>
            <p className="text-sm text-gray-900 dark:text-white">
              {t('resources.templates.categories.vendorQuestionnaires.description')}
            </p>
          </div>
          <div className="p-6 flex-1">
            <ul className="space-y-4">
              <li className="flex justify-between items-center">
                <span className="text-gray-900 dark:text-white">{t('resources.templates.categories.vendorQuestionnaires.items.nistComplete')}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => handlePreview('vendor-questionnaires/nist-800-161-complete-assessment.html', 'nist-800-161-complete-assessment.docx')}
                >
                  <span>Preview</span>
                </Button>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-900 dark:text-white">{t('resources.templates.categories.vendorQuestionnaires.items.vendorQuick')}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => handlePreview('vendor-questionnaires/vendor-security-quick-assessment.html', 'vendor-security-quick-assessment.docx')}
                >
                  <span>Preview</span>
                </Button>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-900 dark:text-white">{t('resources.templates.categories.vendorQuestionnaires.items.cloudProvider')}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => handlePreview('vendor-questionnaires/cloud-provider-assessment.html', 'cloud-provider-assessment.docx')}
                >
                  <span>Preview</span>
                </Button>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-900 dark:text-white">{t('resources.templates.categories.vendorQuestionnaires.items.softwareProvider')}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => handlePreview('vendor-questionnaires/software-provider-assessment.html', 'software-provider-assessment.docx')}
                >
                  <span>Preview</span>
                </Button>
              </li>
            </ul>
          </div>
        </Card>
        
        <Card className="flex flex-col h-full">
          <div className="p-6 bg-vendortal-purple text-white rounded-t-lg">
            <div className="flex items-center mb-3">
              <FileJson className="h-6 w-6 mr-2" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('resources.templates.categories.sbomTemplates.title')}</h2>
            </div>
            <p className="text-sm text-gray-900 dark:text-white">
              {t('resources.templates.categories.sbomTemplates.description')}
            </p>
          </div>
          <div className="p-6 flex-1">
            <ul className="space-y-4">
              <li className="flex justify-between items-center">
                <span className="text-gray-900 dark:text-white">{t('resources.templates.categories.sbomTemplates.items.spdx')}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => handlePreview('sbom/spdx-sbom-template.json', 'spdx-sbom-template.json')}
                >
                  <span>Preview</span>
                </Button>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-900 dark:text-white">{t('resources.templates.categories.sbomTemplates.items.cyclonedx')}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => handlePreview('sbom/cyclonedx-sbom-template.json', 'cyclonedx-sbom-template.json')}
                >
                  <span>Preview</span>
                </Button>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-900 dark:text-white">{t('resources.templates.categories.sbomTemplates.items.generator')}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => handlePreview('sbom/sbom-generator.sh', 'sbom-generator.sh')}
                >
                  <span>Preview</span>
                </Button>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-900 dark:text-white">{t('resources.templates.categories.sbomTemplates.items.report')}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => handlePreview('sbom/sbom-example-report.html', 'sbom-example-report.pdf')}
                >
                  <span>Preview</span>
                </Button>
              </li>
            </ul>
          </div>
        </Card>
        
        <Card className="flex flex-col h-full">
          <div className="p-6 bg-vendortal-purple text-white rounded-t-lg">
            <div className="flex items-center mb-3">
              <BarChart3 className="h-6 w-6 mr-2" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('resources.templates.categories.riskAssessment.title')}</h2>
            </div>
            <p className="text-sm text-gray-900 dark:text-white">
              {t('resources.templates.categories.riskAssessment.description')}
            </p>
          </div>
          <div className="p-6 flex-1">
            <ul className="space-y-4">
              <li className="flex justify-between items-center">
                <span className="text-gray-900 dark:text-white">{t('resources.templates.categories.riskAssessment.items.scoringMatrix')}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => handlePreview('risk-assessment/vendor-risk-scoring-matrix.csv', 'vendor-risk-scoring-matrix.xlsx')}
                >
                  <span>Preview</span>
                </Button>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-900 dark:text-white">{t('resources.templates.categories.riskAssessment.items.managementPlan')}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => handlePreview('risk-assessment/risk-management-plan-template.html', 'risk-management-plan-template.docx')}
                >
                  <span>Preview</span>
                </Button>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-900 dark:text-white">{t('resources.templates.categories.riskAssessment.items.riskRegister')}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => handlePreview('risk-assessment/supply-chain-risk-register.csv', 'supply-chain-risk-register.xlsx')}
                >
                  <span>Preview</span>
                </Button>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-900 dark:text-white">{t('resources.templates.categories.riskAssessment.items.execSummary')}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => handlePreview('risk-assessment/exec-summary-template.html', 'exec-summary-template.pptx')}
                >
                  <span>Preview</span>
                </Button>
              </li>
            </ul>
          </div>
        </Card>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('resources.templates.nistResources.title')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t('resources.templates.nistResources.keyDocuments.title')}</h3>
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-vendortal-navy flex items-center justify-center mt-0.5">
                <span className="text-white text-xs">↓</span>
              </div>
              <div className="ml-3">
                <h4 className="text-base font-medium text-gray-900 dark:text-white">{t('resources.templates.nistResources.keyDocuments.items.nistRev1.title')}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {t('resources.templates.nistResources.keyDocuments.items.nistRev1.description')}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => window.open('https://csrc.nist.gov/publications/detail/sp/800-161/rev-1/final', '_blank')}
                >
                  <Download size={16} />
                  <span>{t('resources.templates.download')} PDF</span>
                </Button>
              </div>
            </li>
            
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-vendortal-navy flex items-center justify-center mt-0.5">
                <span className="text-white text-xs">↓</span>
              </div>
              <div className="ml-3">
                <h4 className="text-base font-medium text-gray-900 dark:text-white">{t('resources.templates.nistResources.keyDocuments.items.quickStart.title')}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {t('resources.templates.nistResources.keyDocuments.items.quickStart.description')}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => handlePreview('nist/nist-quickstart.html', 'nist-sp-800-161-quickstart.pdf')}
                >
                  <Download size={16} />
                  <span>Preview</span>
                </Button>
              </div>
            </li>
            
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-vendortal-navy flex items-center justify-center mt-0.5">
                <span className="text-white text-xs">↓</span>
              </div>
              <div className="ml-3">
                <h4 className="text-base font-medium text-gray-900 dark:text-white">{t('resources.templates.nistResources.keyDocuments.items.controlMapping.title')}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {t('resources.templates.nistResources.keyDocuments.items.controlMapping.description')}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => handlePreview('nist/nist-controls-mapping.csv', 'nist-controls-mapping.xlsx')}
                >
                  <Download size={16} />
                  <span>Preview</span>
                </Button>
              </div>
            </li>
          </ul>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t('resources.templates.implementationGuides.title')}</h3>
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-supply-chain-teal flex items-center justify-center mt-0.5">
                <span className="text-white text-xs">↓</span>
              </div>
              <div className="ml-3">
                <h4 className="text-base font-medium text-gray-900 dark:text-white">{t('resources.templates.implementationGuides.items.federalCompliance.title')}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {t('resources.templates.implementationGuides.items.federalCompliance.description')}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => handlePreview('nist/federal-compliance-guide.html', 'federal-compliance-guide.pdf')}
                >
                  <Download size={16} />
                  <span>Preview</span>
                </Button>
              </div>
            </li>
            
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-supply-chain-teal flex items-center justify-center mt-0.5">
                <span className="text-white text-xs">↓</span>
              </div>
              <div className="ml-3">
                <h4 className="text-base font-medium text-gray-900 dark:text-white">{t('resources.templates.implementationGuides.items.maturityModel.title')}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {t('resources.templates.implementationGuides.items.maturityModel.description')}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => handlePreview('nist/supply-chain-maturity-model.html', 'supply-chain-maturity-model.pdf')}
                >
                  <Download size={16} />
                  <span>Preview</span>
                </Button>
              </div>
            </li>
            
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-supply-chain-teal flex items-center justify-center mt-0.5">
                <span className="text-white text-xs">↓</span>
              </div>
              <div className="ml-3">
                <h4 className="text-base font-medium text-gray-900 dark:text-white">{t('resources.templates.implementationGuides.items.sbomGuide.title')}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {t('resources.templates.implementationGuides.items.sbomGuide.description')}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => handlePreview('nist/sbom-implementation-guide.html', 'sbom-implementation-guide.pdf')}
                >
                  <Download size={16} />
                  <span>Preview</span>
                </Button>
              </div>
            </li>
          </ul>
        </Card>
      </div>
      
      <Card className="p-6 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex">
            <Info className="h-6 w-6 text-vendortal-navy dark:text-trust-blue mt-1 mr-3 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('resources.templates.customization.title')}</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
                {t('resources.templates.customization.description')}
              </p>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/contact">
              <Button variant="primary" size="lg">{t('resources.templates.customization.contactButton')}</Button>
            </Link>
          </div>
        </div>
      </Card>
    </main>
  );
};

export default Templates;