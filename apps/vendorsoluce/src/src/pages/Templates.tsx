import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Shield, FileJson, BarChart3, Info, Eye, ExternalLink, FileText } from 'lucide-react';
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
    <div className="bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('resources.templates.title')}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
          {t('resources.templates.description')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
        <Card className="flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
          <div className="p-6 bg-gradient-to-br from-vendorsoluce-green to-vendorsoluce-dark-green text-white rounded-t-lg">
            <div className="flex items-center mb-3">
              <Shield className="h-7 w-7 mr-3" />
              <h2 className="text-xl font-bold text-white">{t('resources.templates.categories.vendorQuestionnaires.title')}</h2>
            </div>
            <p className="text-sm text-white/90 leading-relaxed">
              {t('resources.templates.categories.vendorQuestionnaires.description')}
            </p>
          </div>
          <div className="p-6 flex-1">
            <ul className="space-y-3">
              <li className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                <span className="text-gray-900 dark:text-white font-medium text-sm flex-1 pr-4">{t('resources.templates.categories.vendorQuestionnaires.items.nistComplete')}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1.5 whitespace-nowrap hover:bg-vendorsoluce-green hover:text-white hover:border-vendorsoluce-green transition-colors"
                  onClick={() => handlePreview('vendor-questionnaires/nist-800-161-complete-assessment.html', 'nist-800-161-complete-assessment.docx')}
                  title="Preview template"
                >
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </Button>
              </li>
              <li className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                <span className="text-gray-900 dark:text-white font-medium text-sm flex-1 pr-4">{t('resources.templates.categories.vendorQuestionnaires.items.vendorQuick')}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1.5 whitespace-nowrap hover:bg-vendorsoluce-green hover:text-white hover:border-vendorsoluce-green transition-colors"
                  onClick={() => handlePreview('vendor-questionnaires/vendor-security-quick-assessment.html', 'vendor-security-quick-assessment.docx')}
                  title="Preview template"
                >
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </Button>
              </li>
              <li className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                <span className="text-gray-900 dark:text-white font-medium text-sm flex-1 pr-4">{t('resources.templates.categories.vendorQuestionnaires.items.cloudProvider')}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1.5 whitespace-nowrap hover:bg-vendorsoluce-green hover:text-white hover:border-vendorsoluce-green transition-colors"
                  onClick={() => handlePreview('vendor-questionnaires/cloud-provider-assessment.html', 'cloud-provider-assessment.docx')}
                  title="Preview template"
                >
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </Button>
              </li>
              <li className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                <span className="text-gray-900 dark:text-white font-medium text-sm flex-1 pr-4">{t('resources.templates.categories.vendorQuestionnaires.items.softwareProvider')}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1.5 whitespace-nowrap hover:bg-vendorsoluce-green hover:text-white hover:border-vendorsoluce-green transition-colors"
                  onClick={() => handlePreview('vendor-questionnaires/software-provider-assessment.html', 'software-provider-assessment.docx')}
                  title="Preview template"
                >
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </Button>
              </li>
            </ul>
          </div>
        </Card>
        
        <Card className="flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
          <div className="p-6 bg-gradient-to-br from-vendorsoluce-teal to-vendorsoluce-blue text-white rounded-t-lg">
            <div className="flex items-center mb-3">
              <FileJson className="h-7 w-7 mr-3" />
              <h2 className="text-xl font-bold text-white">{t('resources.templates.categories.sbomTemplates.title')}</h2>
            </div>
            <p className="text-sm text-white/90 leading-relaxed">
              {t('resources.templates.categories.sbomTemplates.description')}
            </p>
          </div>
          <div className="p-6 flex-1">
            <ul className="space-y-3">
              <li className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                <span className="text-gray-900 dark:text-white font-medium text-sm flex-1 pr-4">{t('resources.templates.categories.sbomTemplates.items.spdx')}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1.5 whitespace-nowrap hover:bg-vendorsoluce-teal hover:text-white hover:border-vendorsoluce-teal transition-colors"
                  onClick={() => handlePreview('sbom/spdx-sbom-template.json', 'spdx-sbom-template.json')}
                  title="Preview template"
                >
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </Button>
              </li>
              <li className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                <span className="text-gray-900 dark:text-white font-medium text-sm flex-1 pr-4">{t('resources.templates.categories.sbomTemplates.items.cyclonedx')}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1.5 whitespace-nowrap hover:bg-vendorsoluce-teal hover:text-white hover:border-vendorsoluce-teal transition-colors"
                  onClick={() => handlePreview('sbom/cyclonedx-sbom-template.json', 'cyclonedx-sbom-template.json')}
                  title="Preview template"
                >
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </Button>
              </li>
              <li className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                <span className="text-gray-900 dark:text-white font-medium text-sm flex-1 pr-4">{t('resources.templates.categories.sbomTemplates.items.generator')}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1.5 whitespace-nowrap hover:bg-vendorsoluce-teal hover:text-white hover:border-vendorsoluce-teal transition-colors"
                  onClick={() => handlePreview('sbom/sbom-generator.sh', 'sbom-generator.sh')}
                  title="Preview template"
                >
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </Button>
              </li>
              <li className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                <span className="text-gray-900 dark:text-white font-medium text-sm flex-1 pr-4">{t('resources.templates.categories.sbomTemplates.items.report')}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1.5 whitespace-nowrap hover:bg-vendorsoluce-teal hover:text-white hover:border-vendorsoluce-teal transition-colors"
                  onClick={() => handlePreview('sbom/sbom-example-report.html', 'sbom-example-report.pdf')}
                  title="Preview template"
                >
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </Button>
              </li>
            </ul>
          </div>
        </Card>
        
        <Card className="flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
          <div className="p-6 bg-gradient-to-br from-vendorsoluce-navy to-vendorsoluce-blue text-white rounded-t-lg">
            <div className="flex items-center mb-3">
              <BarChart3 className="h-7 w-7 mr-3" />
              <h2 className="text-xl font-bold text-white">{t('resources.templates.categories.riskAssessment.title')}</h2>
            </div>
            <p className="text-sm text-white/90 leading-relaxed">
              {t('resources.templates.categories.riskAssessment.description')}
            </p>
          </div>
          <div className="p-6 flex-1">
            <ul className="space-y-3">
              <li className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                <span className="text-gray-900 dark:text-white font-medium text-sm flex-1 pr-4">{t('resources.templates.categories.riskAssessment.items.scoringMatrix')}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1.5 whitespace-nowrap hover:bg-vendorsoluce-navy hover:text-white hover:border-vendorsoluce-navy transition-colors"
                  onClick={() => handlePreview('risk-assessment/vendor-risk-scoring-matrix.csv', 'vendor-risk-scoring-matrix.xlsx')}
                  title="Preview template"
                >
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </Button>
              </li>
              <li className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                <span className="text-gray-900 dark:text-white font-medium text-sm flex-1 pr-4">{t('resources.templates.categories.riskAssessment.items.managementPlan')}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1.5 whitespace-nowrap hover:bg-vendorsoluce-navy hover:text-white hover:border-vendorsoluce-navy transition-colors"
                  onClick={() => handlePreview('risk-assessment/risk-management-plan-template.html', 'risk-management-plan-template.docx')}
                  title="Preview template"
                >
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </Button>
              </li>
              <li className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                <span className="text-gray-900 dark:text-white font-medium text-sm flex-1 pr-4">{t('resources.templates.categories.riskAssessment.items.riskRegister')}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1.5 whitespace-nowrap hover:bg-vendorsoluce-navy hover:text-white hover:border-vendorsoluce-navy transition-colors"
                  onClick={() => handlePreview('risk-assessment/supply-chain-risk-register.csv', 'supply-chain-risk-register.xlsx')}
                  title="Preview template"
                >
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </Button>
              </li>
              <li className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                <span className="text-gray-900 dark:text-white font-medium text-sm flex-1 pr-4">{t('resources.templates.categories.riskAssessment.items.execSummary')}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1.5 whitespace-nowrap hover:bg-vendorsoluce-navy hover:text-white hover:border-vendorsoluce-navy transition-colors"
                  onClick={() => handlePreview('risk-assessment/exec-summary-template.html', 'exec-summary-template.pptx')}
                  title="Preview template"
                >
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </Button>
              </li>
            </ul>
          </div>
        </Card>
      </div>
      
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('resources.templates.nistResources.title')}</h2>
        <div className="h-1 w-20 bg-vendorsoluce-green rounded-full"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16">
        <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center mb-6">
            <FileText className="h-6 w-6 text-vendorsoluce-navy dark:text-vendorsoluce-blue mr-2" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('resources.templates.nistResources.keyDocuments.title')}</h3>
          </div>
          <ul className="space-y-5">
            <li className="flex items-start pb-5 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-vendorsoluce-navy dark:bg-vendorsoluce-navy flex items-center justify-center mt-0.5">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">{t('resources.templates.nistResources.keyDocuments.items.nistRev1.title')}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                  {t('resources.templates.nistResources.keyDocuments.items.nistRev1.description')}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2 hover:bg-vendorsoluce-navy hover:text-white hover:border-vendorsoluce-navy transition-colors"
                  onClick={() => window.open('https://csrc.nist.gov/publications/detail/sp/800-161/rev-1/final', '_blank', 'noopener,noreferrer')}
                  title="Open NIST SP 800-161 Rev 1 in new tab"
                >
                  <ExternalLink size={16} />
                  <span>{t('resources.templates.download')} PDF</span>
                </Button>
              </div>
            </li>
            
            <li className="flex items-start pb-5 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-vendorsoluce-navy dark:bg-vendorsoluce-navy flex items-center justify-center mt-0.5">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">{t('resources.templates.nistResources.keyDocuments.items.quickStart.title')}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                  {t('resources.templates.nistResources.keyDocuments.items.quickStart.description')}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2 hover:bg-vendorsoluce-navy hover:text-white hover:border-vendorsoluce-navy transition-colors"
                  onClick={() => handlePreview('nist/nist-quickstart.html', 'nist-sp-800-161-quickstart.pdf')}
                  title="Preview quick start guide"
                >
                  <Eye size={16} />
                  <span>Preview</span>
                </Button>
              </div>
            </li>
            
            <li className="flex items-start pb-5 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-vendorsoluce-navy dark:bg-vendorsoluce-navy flex items-center justify-center mt-0.5">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">{t('resources.templates.nistResources.keyDocuments.items.controlMapping.title')}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                  {t('resources.templates.nistResources.keyDocuments.items.controlMapping.description')}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2 hover:bg-vendorsoluce-navy hover:text-white hover:border-vendorsoluce-navy transition-colors"
                  onClick={() => handlePreview('nist/nist-controls-mapping.csv', 'nist-controls-mapping.xlsx')}
                  title="Preview control mapping"
                >
                  <Eye size={16} />
                  <span>Preview</span>
                </Button>
              </div>
            </li>
          </ul>
        </Card>
        
        <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center mb-6">
            <BarChart3 className="h-6 w-6 text-vendorsoluce-teal dark:text-vendorsoluce-teal mr-2" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('resources.templates.implementationGuides.title')}</h3>
          </div>
          <ul className="space-y-5">
            <li className="flex items-start pb-5 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-vendorsoluce-teal dark:bg-vendorsoluce-teal flex items-center justify-center mt-0.5">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">{t('resources.templates.implementationGuides.items.federalCompliance.title')}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                  {t('resources.templates.implementationGuides.items.federalCompliance.description')}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2 hover:bg-vendorsoluce-teal hover:text-white hover:border-vendorsoluce-teal transition-colors"
                  onClick={() => handlePreview('nist/federal-compliance-guide.html', 'federal-compliance-guide.pdf')}
                  title="Preview federal compliance guide"
                >
                  <Eye size={16} />
                  <span>Preview</span>
                </Button>
              </div>
            </li>
            
            <li className="flex items-start pb-5 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-vendorsoluce-teal dark:bg-vendorsoluce-teal flex items-center justify-center mt-0.5">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">{t('resources.templates.implementationGuides.items.maturityModel.title')}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                  {t('resources.templates.implementationGuides.items.maturityModel.description')}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2 hover:bg-vendorsoluce-teal hover:text-white hover:border-vendorsoluce-teal transition-colors"
                  onClick={() => handlePreview('nist/supply-chain-maturity-model.html', 'supply-chain-maturity-model.pdf')}
                  title="Preview maturity model"
                >
                  <Eye size={16} />
                  <span>Preview</span>
                </Button>
              </div>
            </li>
            
            <li className="flex items-start pb-5 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-vendorsoluce-teal dark:bg-vendorsoluce-teal flex items-center justify-center mt-0.5">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">{t('resources.templates.implementationGuides.items.sbomGuide.title')}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                  {t('resources.templates.implementationGuides.items.sbomGuide.description')}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2 hover:bg-vendorsoluce-teal hover:text-white hover:border-vendorsoluce-teal transition-colors"
                  onClick={() => handlePreview('nist/sbom-implementation-guide.html', 'sbom-implementation-guide.pdf')}
                  title="Preview SBOM implementation guide"
                >
                  <Eye size={16} />
                  <span>Preview</span>
                </Button>
              </div>
            </li>
          </ul>
        </Card>
      </div>
      
      <Card className="p-8 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-2 border-vendorsoluce-green/20 dark:border-vendorsoluce-green/30 hover:shadow-xl transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-start mb-4 md:mb-0">
            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-vendorsoluce-green/10 dark:bg-vendorsoluce-green/20 flex items-center justify-center mr-4">
              <Info className="h-6 w-6 text-vendorsoluce-green dark:text-vendorsoluce-blue" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t('resources.templates.customization.title')}</h2>
              <p className="text-gray-700 dark:text-gray-300 max-w-2xl leading-relaxed">
                {t('resources.templates.customization.description')}
              </p>
            </div>
          </div>
          <div className="mt-6 md:mt-0 md:ml-6">
            <Link to="/contact">
              <Button 
                variant="primary" 
                size="lg"
                className="w-full md:w-auto flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-shadow"
              >
                <span>{t('resources.templates.customization.contactButton')}</span>
                <ExternalLink className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Templates;