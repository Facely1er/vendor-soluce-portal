 import React from 'react';
import { Link } from 'react-router-dom';
import { FileJson, BarChart3, Zap, Shield } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTranslation } from 'react-i18next';

const FeatureSection: React.FC = () => {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: <Shield className="h-8 w-8 text-vendorsoluce-green" />,
      title: t('home.features.feature1.title'),
      description: t('home.features.feature1.description'),
      path: '/supply-chain-assessment'
    },
    {
      icon: <FileJson className="h-8 w-8 text-vendorsoluce-light-green" />,
      title: t('home.features.feature2.title'),
      description: t('home.features.feature2.description'),
      path: '/sbom-analyzer'
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-vendorsoluce-green" />,
      title: t('home.features.feature3.title'),
      description: t('home.features.feature3.description'),
      path: '/tools/vendor-iq'
    },
    {
      icon: <Zap className="h-8 w-8 text-vendorsoluce-light-green" />,
      title: t('home.features.feature4.title'),
      description: t('home.features.feature4.description'),
      path: '/vendors'
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {t('home.features.title')}
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {t('home.features.description')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
            <div className="mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1">{feature.description}</p>
            <Link to={feature.path}>
              <Button 
                variant="outline" 
                size="sm"
                className="group-hover:bg-vendorsoluce-green group-hover:text-white group-hover:border-vendorsoluce-green transition-all duration-300"
              >
                {t('home.features.learnMore')}
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;