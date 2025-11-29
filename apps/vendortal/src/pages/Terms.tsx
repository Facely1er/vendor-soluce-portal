import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card';

const Terms: React.FC = () => {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('terms.title')}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('terms.lastUpdated')}
        </p>
      </div>
      
      <Card className="p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('terms.section1.title')}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t('terms.section1.paragraph1')}
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t('terms.section1.paragraph2')}
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          {t('terms.section1.paragraph3')}
        </p>
      </Card>
      
      <Card className="p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('terms.section2.title')}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t('terms.section2.description')}
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>{t('terms.section2.items.assessment')}</li>
          <li>{t('terms.section2.items.sbom')}</li>
          <li>{t('terms.section2.items.vendor')}</li>
          <li>{t('terms.section2.items.reporting')}</li>
          <li>{t('terms.section2.items.api')}</li>
        </ul>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-yellow-800 dark:text-yellow-200 font-medium mb-2">{t('terms.section2.disclaimer.title')}</p>
          <p className="text-yellow-700 dark:text-yellow-300 text-sm">
            {t('terms.section2.disclaimer.text')}
          </p>
        </div>
      </Card>
      
      <Card className="p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('terms.section3.title')}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t('terms.section3.description')}
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>{t('terms.section3.items.accurate')}</li>
          <li>{t('terms.section3.items.compliance')}</li>
          <li>{t('terms.section3.items.security')}</li>
          <li>{t('terms.section3.items.professional')}</li>
          <li>{t('terms.section3.items.unauthorized')}</li>
        </ul>
      </Card>
      
      <Card className="p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('terms.section4.title')}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t('terms.section4.description')}
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>{t('terms.section4.items.illegal')}</li>
          <li>{t('terms.section4.items.reverse')}</li>
          <li>{t('terms.section4.items.interfere')}</li>
          <li>{t('terms.section4.items.violate')}</li>
          <li>{t('terms.section4.items.resell')}</li>
        </ul>
      </Card>
      
      <Card className="p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('terms.section5.title')}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t('terms.section5.description')}
        </p>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200 font-medium mb-2">{t('terms.section5.disclaimer.title')}</p>
          <p className="text-red-700 dark:text-red-300 text-sm">
            {t('terms.section5.disclaimer.text')}
          </p>
        </div>
      </Card>
      
      <Card className="p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('terms.section6.title')}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t('terms.section6.description')}
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>{t('terms.section6.items.termination')}</li>
          <li>{t('terms.section6.items.suspension')}</li>
          <li>{t('terms.section6.items.effect')}</li>
        </ul>
      </Card>
      
      <Card className="p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('terms.section7.title')}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t('terms.section7.description')}
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          {t('terms.section7.contact')}
        </p>
      </Card>
      
      <Card className="p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('terms.section8.title')}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t('terms.section8.description')}
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          {t('terms.section8.governing')}
        </p>
      </Card>
    </main>
  );
};

export default Terms;
