import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card';

const Privacy: React.FC = () => {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('privacy.title')}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('privacy.lastUpdated')}
        </p>
      </div>
      
      <Card className="p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('privacy.section1.title')}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t('privacy.section1.paragraph1')}
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t('privacy.section1.paragraph2')}
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          {t('privacy.section1.paragraph3')}
        </p>
      </Card>
      
      <Card className="p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('privacy.section2.title')}</h2>
        
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('privacy.section2.personalInfo.title')}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t('privacy.section2.personalInfo.description')}
        </p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-6 pl-4">
          <li>{t('privacy.section2.personalInfo.items.contact')}</li>
          <li>{t('privacy.section2.personalInfo.items.billing')}</li>
          <li>{t('privacy.section2.personalInfo.items.employer')}</li>
          <li>{t('privacy.section2.personalInfo.items.preferences')}</li>
          <li>{t('privacy.section2.personalInfo.items.other')}</li>
        </ul>
        
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('privacy.section2.automaticData.title')}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t('privacy.section2.automaticData.description')}
        </p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-6 pl-4">
          <li>{t('privacy.section2.automaticData.items.device')}</li>
          <li>{t('privacy.section2.automaticData.items.tracking')}</li>
        </ul>
        
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('privacy.section2.thirdParty.title')}</h3>
        <p className="text-gray-600 dark:text-gray-300">
          {t('privacy.section2.thirdParty.description')}
        </p>
      </Card>
      
      <Card className="p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('privacy.section3.title')}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t('privacy.section3.description')}
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>{t('privacy.section3.items.provide')}</li>
          <li>{t('privacy.section3.items.improve')}</li>
          <li>{t('privacy.section3.items.understand')}</li>
          <li>{t('privacy.section3.items.develop')}</li>
          <li>{t('privacy.section3.items.communicate')}</li>
          <li>{t('privacy.section3.items.process')}</li>
          <li>{t('privacy.section3.items.fraud')}</li>
          <li>{t('privacy.section3.items.compliance')}</li>
        </ul>
      </Card>
      
      <Card className="p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('privacy.section4.title')}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t('privacy.section4.description')}
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-6 pl-4">
          <li><strong>{t('privacy.section4.items.serviceProviders.title')}:</strong> {t('privacy.section4.items.serviceProviders.description')}</li>
          <li><strong>{t('privacy.section4.items.businessTransfers.title')}:</strong> {t('privacy.section4.items.businessTransfers.description')}</li>
          <li><strong>{t('privacy.section4.items.affiliates.title')}:</strong> {t('privacy.section4.items.affiliates.description')}</li>
          <li><strong>{t('privacy.section4.items.businessPartners.title')}:</strong> {t('privacy.section4.items.businessPartners.description')}</li>
          <li><strong>{t('privacy.section4.items.consent.title')}:</strong> {t('privacy.section4.items.consent.description')}</li>
          <li><strong>{t('privacy.section4.items.otherUsers.title')}:</strong> {t('privacy.section4.items.otherUsers.description')}</li>
        </ul>
      </Card>
      
      <Card className="p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('privacy.section5.title')}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t('privacy.section5.description')}
        </p>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li>{t('privacy.section5.items.encryption')}</li>
          <li>{t('privacy.section5.items.assessments')}</li>
          <li>{t('privacy.section5.items.accessControls')}</li>
          <li>{t('privacy.section5.items.monitoring')}</li>
          <li>{t('privacy.section5.items.physical')}</li>
        </ul>
        <p className="text-gray-600 dark:text-gray-300">
          {t('privacy.section5.disclaimer')}
        </p>
      </Card>
      
      <Card className="p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('privacy.section6.title')}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t('privacy.section6.description')}
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-4 pl-4">
          <li><strong>{t('privacy.section6.rights.access.title')}:</strong> {t('privacy.section6.rights.access.description')}</li>
          <li><strong>{t('privacy.section6.rights.rectification.title')}:</strong> {t('privacy.section6.rights.rectification.description')}</li>
          <li><strong>{t('privacy.section6.rights.erasure.title')}:</strong> {t('privacy.section6.rights.erasure.description')}</li>
          <li><strong>{t('privacy.section6.rights.restrict.title')}:</strong> {t('privacy.section6.rights.restrict.description')}</li>
          <li><strong>{t('privacy.section6.rights.portability.title')}:</strong> {t('privacy.section6.rights.portability.description')}</li>
          <li><strong>{t('privacy.section6.rights.object.title')}:</strong> {t('privacy.section6.rights.object.description')}</li>
        </ul>
        <p className="text-gray-600 dark:text-gray-300">
          {t('privacy.section6.exercise')}
        </p>
      </Card>
      
      <Card className="p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('privacy.section7.title')}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t('privacy.section7.paragraph1')}
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t('privacy.section7.paragraph2')}
        </p>
      </Card>
      
      <Card className="p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('privacy.section8.title')}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t('privacy.section8.paragraph1')}
        </p>
      </Card>
      
      <Card className="p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('privacy.section9.title')}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t('privacy.section9.paragraph1')}
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          {t('privacy.section9.paragraph2')}
        </p>
      </Card>
      
      <Card className="p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('privacy.section10.title')}</h2>
        <p className="text-gray-600 dark:text-gray-300">
          {t('privacy.section10.description')}
        </p>
      </Card>
      
      <Card className="p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('privacy.section11.title')}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t('privacy.section11.description')}
        </p>
        <div className="text-gray-600 dark:text-gray-300">
          <p><strong className="text-gray-900 dark:text-white">{t('privacy.section11.contact.company')}</strong></p>
          <p>{t('privacy.section11.contact.address1')}</p>
          <p>{t('privacy.section11.contact.address2')}</p>
          <p>{t('privacy.section11.contact.email')}</p>
          <p>{t('privacy.section11.contact.phone')}</p>
        </div>
      </Card>
    </main>
  );
};

export default Privacy;