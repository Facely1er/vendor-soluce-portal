import React from 'react';
import { Link } from 'react-router-dom';
import { FileJson, BarChart3, CheckCircle, Shield } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useTranslation } from 'react-i18next';

interface Assessment {
  id: string;
  title: string;
  description: string;
  frameworks: string[];
  features: string[];
  icon: string;
  path: string;
}

const AssessmentSection: React.FC = () => {
  const { t } = useTranslation();
  
  const assessments: Assessment[] = [
    {
      id: 'supply-chain-assessment',
      title: t('home.assessments.supplyChain.title'),
      description: t('home.assessments.supplyChain.description'),
      frameworks: ['NIST SP 800-161', 'ISO 28000'],
      features: [
        t('home.assessments.supplyChain.feature1'),
        t('home.assessments.supplyChain.feature2'),
        t('home.assessments.supplyChain.feature3'),
        t('home.assessments.supplyChain.feature4')
      ],
      icon: 'Shield',
      path: '/supply-chain-assessment'
    },
    {
      id: 'sbom-analyzer',
      title: t('home.assessments.sbom.title'),
      description: t('home.assessments.sbom.description'),
      frameworks: ['NIST SP 800-161 3.4.1', 'SPDX', 'CycloneDX'],
      features: [
        t('home.assessments.sbom.feature1'),
        t('home.assessments.sbom.feature2'),
        t('home.assessments.sbom.feature3'),
        t('home.assessments.sbom.feature4')
      ],
      icon: 'FileJson',
      path: '/sbom-analyzer'
    },
    {
      id: 'vendor-risk-dashboard',
      title: t('home.assessments.vendor.title'),
      description: t('home.assessments.vendor.description'),
      frameworks: ['NIST SP 800-161', 'ISO 31000'],
      features: [
        t('home.assessments.vendor.feature1'),
        t('home.assessments.vendor.feature2'),
        t('home.assessments.vendor.feature3'),
        t('home.assessments.vendor.feature4')
      ],
      icon: 'BarChart3',
      path: '/vendor-risk-dashboard'
    }
  ];

  const getIcon = (iconName: string) => {
    const icons = {
      Shield: <Shield className="h-8 w-8 text-vendorsoluce-green" />,
      FileJson: <FileJson className="h-8 w-8 text-vendorsoluce-teal" />,
      BarChart3: <BarChart3 className="h-8 w-8 text-vendorsoluce-blue" />
    };

    return icons[iconName as keyof typeof icons] || null;
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {t('home.assessments.title')}
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {t('home.assessments.description')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {assessments.map((assessment) => (
          <Card key={assessment.id} className="flex flex-col h-full">
            <div className="p-6 flex-1">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                {getIcon(assessment.icon)}
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                {assessment.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {assessment.description}
              </p>
              
              {/* Framework badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {assessment.frameworks.map((framework, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs font-medium"
                  >
                    {framework}
                  </span>
                ))}
              </div>
              
              {/* Features list */}
              <ul className="space-y-2 mb-6">
                {assessment.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-vendorsoluce-green mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-6 mt-auto">
              <Link to={assessment.path}>
                <Button variant="primary" className="w-full">
                  {t('home.assessments.cta')}
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default AssessmentSection;