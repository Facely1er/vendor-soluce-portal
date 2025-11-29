import React from 'react';
import { Link } from 'react-router-dom';
import { FileDigit, Calculator, CheckSquare } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { QuickTool } from '../../types';
import { useTranslation } from 'react-i18next';

const QuickToolsSection: React.FC = () => {
  const { t } = useTranslation();
  
  const quickTools: QuickTool[] = [
    {
      id: 'sbom-quick-scan',
      title: t('quickTools.sbomScan.title'),
      description: t('quickTools.sbomScan.description'),
      icon: 'FileDigit',
      action: t('quickTools.sbomScan.action')
    },
    {
      id: 'vendor-risk-radar',
      title: t('quickTools.riskRadar.title'),
      description: t('quickTools.riskRadar.description'),
      icon: 'Calculator',
      action: t('quickTools.riskRadar.action')
    },
    {
      id: 'nist-checklist',
      title: t('quickTools.nistChecklist.title'),
      description: t('quickTools.nistChecklist.description'),
      icon: 'CheckSquare',
      action: t('quickTools.nistChecklist.action')
    }
  ];

  const getIcon = (iconName: string) => {
    const icons = {
      FileDigit: <FileDigit size={24} className="text-vendorsoluce-light-green" />,
      Calculator: <Calculator size={24} className="text-vendorsoluce-green" />,
      CheckSquare: <CheckSquare size={24} className="text-vendorsoluce-green" />
    };
    
    return icons[iconName as keyof typeof icons] || null;
  };

  // Function to get the correct path for each quick tool
  const getToolPath = (id: string) => {
    switch (id) {
      case 'sbom-quick-scan':
        return '/tools/sbom-quick-scan';
      case 'vendor-risk-radar':
        return '/tools/vendor-risk-radar';
      case 'nist-checklist':
        return '/tools/nist-checklist';
      default:
        return '/';
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t('home.quickTools.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('home.quickTools.description')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {quickTools.map((tool) => (
            <Card key={tool.id} className="flex flex-col h-full">
              <div className="p-6 flex-1">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                  {getIcon(tool.icon)}
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{tool.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{tool.description}</p>
              </div>
              
              <div className="p-6 mt-auto">
                <Link to={getToolPath(tool.id)}>
                  <Button
                    variant={tool.id === 'sbom-quick-scan' ? 'secondary' :
                             tool.id === 'vendor-risk-radar' ? 'primary' : 'outline'}
                    className="w-full"
                  >
                    {tool.action}
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickToolsSection;