import React from 'react';
import { Award, UserCheck, FileDigit, Network, Building, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card';

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {t('about.title')}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {t('about.subtitle')}
        </p>
      </section>
      
      <section className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {t('about.story.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t('about.story.paragraph1')}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t('about.story.paragraph2')}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              {t('about.story.paragraph3')}
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-vendortal-navy to-vendortal-purple p-8 rounded-lg text-white">
            <h3 className="text-2xl font-bold mb-4">
              {t('about.mission.title')}
            </h3>
            <p className="text-gray-100 mb-6">
              {t('about.mission.description')}
            </p>
            
            <h3 className="text-2xl font-bold mb-4">
              {t('about.vision.title')}
            </h3>
            <p className="text-gray-100">
              {t('about.vision.description')}
            </p>
          </div>
        </div>
      </section>
      
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          {t('about.values.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-vendortal-navy/10 dark:bg-vendortal-navy/30 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-vendortal-navy dark:text-vendortal-purple" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {t('about.values.securityFirst.title')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t('about.values.securityFirst.description')}
            </p>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-vendortal-navy/10 dark:bg-vendortal-navy/30 rounded-full flex items-center justify-center mb-4">
              <Award className="h-6 w-6 text-vendortal-navy dark:text-vendortal-purple" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {t('about.values.excellence.title')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t('about.values.excellence.description')}
            </p>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-vendortal-navy/10 dark:bg-vendortal-navy/30 rounded-full flex items-center justify-center mb-4">
              <UserCheck className="h-6 w-6 text-vendortal-navy dark:text-vendortal-purple" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {t('about.values.integrity.title')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t('about.values.integrity.description')}
            </p>
          </Card>
        </div>
      </section>
      
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          {t('about.whyChoose.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex">
            <div className="flex-shrink-0 mt-1">
              <div className="h-10 w-10 rounded-full bg-vendortal-navy/10 dark:bg-vendortal-navy/30 flex items-center justify-center">
                <FileDigit className="h-5 w-5 text-vendortal-navy dark:text-vendortal-purple" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t('about.whyChoose.nistAlignment.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t('about.whyChoose.nistAlignment.description')}
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 mt-1">
              <div className="h-10 w-10 rounded-full bg-vendortal-navy/10 dark:bg-vendortal-navy/30 flex items-center justify-center">
                <Building className="h-5 w-5 text-vendortal-navy dark:text-vendortal-purple" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t('about.whyChoose.federalExperience.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t('about.whyChoose.federalExperience.description')}
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 mt-1">
              <div className="h-10 w-10 rounded-full bg-vendortal-navy/10 dark:bg-vendortal-navy/30 flex items-center justify-center">
                <Shield className="h-5 w-5 text-vendortal-navy dark:text-vendortal-purple" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t('about.whyChoose.comprehensiveSolution.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t('about.whyChoose.comprehensiveSolution.description')}
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 mt-1">
              <div className="h-10 w-10 rounded-full bg-vendortal-navy/10 dark:bg-vendortal-navy/30 flex items-center justify-center">
                <Network className="h-5 w-5 text-vendortal-navy dark:text-vendortal-purple" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t('about.whyChoose.apiFirst.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t('about.whyChoose.apiFirst.description')}
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t('about.careers.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('about.careers.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {t('about.careers.positions.securityEngineer.title')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              {t('about.careers.positions.securityEngineer.description')}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {t('about.careers.positions.securityEngineer.type')}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {t('about.careers.positions.productManager.title')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              {t('about.careers.positions.productManager.description')}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {t('about.careers.positions.productManager.type')}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {t('about.careers.positions.customerSuccess.title')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              {t('about.careers.positions.customerSuccess.description')}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {t('about.careers.positions.customerSuccess.type')}
            </p>
          </div>
        </div>
        
        <div className="text-center">
          <a href="/careers" className="inline-block bg-vendortal-navy text-white px-5 py-3 rounded-md font-medium hover:bg-vendortal-navy/90 transition-colors">
            {t('about.careers.viewAllPositions')}
          </a>
        </div>
      </section>
    </main>
  );
};

export default About;