import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { useTranslation } from 'react-i18next';

const CTASection: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <section className="bg-gradient-to-r from-vendortal-purple to-vendortal-light-purple text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">
          {t('home.cta.title')}
        </h2>
        <p className="text-xl mb-8 text-gray-100">
          {t('home.cta.description')}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/vendor-assessments">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              {t('home.hero.cta1')}
            </Button>
          </Link>
          <Link to="/vendor-assessments-demo">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              {t('home.hero.cta2')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;