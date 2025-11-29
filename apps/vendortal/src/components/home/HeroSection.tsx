 import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Zap, Eye, Shield } from 'lucide-react';
import Button from '../ui/Button';
import { useTranslation } from 'react-i18next';
import TextCarousel from '../common/TextCarousel';

const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  
  // Define rotating texts for the carousel
  const carouselTexts = [
    t('home.hero.carousel.text1'),
    t('home.hero.carousel.text2'),
    t('home.hero.carousel.text3'),
    t('home.hero.carousel.text4'),
    t('home.hero.carousel.text5')
  ];
  
  return (
    <section className="relative text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 min-h-screen hero-background-image"></div>
      
      {/* Dynamic Theme Overlay */}
      <div className="absolute inset-0 z-1 min-h-screen hero-theme-overlay"></div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto">
        <div className="relative z-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
            </div>
            
            <h1 className="text-4xl md:text-3xl font-bold mb-6 opacity-0 animate-fade-in-up animate-delay-100">
              {t('home.hero.title_line1')} <br />
              {t('home.hero.title_line2')}
            </h1>
            
            <p className="text-2xl md:text-3xl text-gray-100 mb-8 max-w-4xl mx-auto opacity-0 animate-fade-in-up animate-delay-300">
              {t('home.hero.subtitle')}
            </p>
            
            <div className="text-xl text-gray-100 mb-10 max-w-3xl mx-auto opacity-0 animate-fade-in-up animate-delay-500">
              <TextCarousel 
                texts={carouselTexts}
                interval={4000}
                className="min-h-[3.5rem] flex items-center justify-center"
                textClassName="text-center leading-relaxed"
              />
            </div>
            
         <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12 opacity-0 animate-fade-in-up animate-delay-700">
              <Link to="/vendor-assessments">
                <Button variant="secondary" size="lg" className="bg-white text-vendortal-purple hover:bg-gray-100 hover:scale-105 transition-all duration-300 hover:shadow-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 mr-2" />
                  {t('home.hero.cta1')}
                </Button>
              </Link>
              <Link to="/vendor-assessments-demo">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 hover:shadow-lg flex items-center justify-center">
                  <Eye className="h-5 w-5 mr-2" />
                  {t('home.hero.cta2')}
                </Button>
              </Link>
            </div>
            
            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 opacity-0 animate-fade-in-up animate-delay-900 hover:bg-white/15 hover:scale-105 transition-all duration-300 hover:shadow-xl cursor-pointer">
                <div className="flex items-center justify-center mb-4">
                  <Zap className="h-8 w-8 text-yellow-300" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{t('home.hero.benefits.section1.title')}</h3>
                <div className="text-gray-100 text-m space-y-2">
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 text-purple-300 mt-0.5 flex-shrink-0" />
                    <span>{t('home.hero.benefits.section1.benefit1')}</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 text-purple-300 mt-0.5 flex-shrink-0" />
                    <span>{t('home.hero.benefits.section1.benefit2')}</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 text-purple-300 mt-0.5 flex-shrink-0" />
                    <span>{t('home.hero.benefits.section1.benefit3')}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 opacity-0 animate-fade-in-up animate-delay-1100 hover:bg-white/15 hover:scale-105 transition-all duration-300 hover:shadow-xl cursor-pointer">
                <div className="flex items-center justify-center mb-4">
                  <Eye className="h-8 w-8 text-blue-300" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{t('home.hero.benefits.section2.title')}</h3>
                <div className="text-gray-100 text-m space-y-2">
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 text-purple-300 mt-0.5 flex-shrink-0" />
                    <span>{t('home.hero.benefits.section2.benefit1')}</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 text-purple-300 mt-0.5 flex-shrink-0" />
                    <span>{t('home.hero.benefits.section2.benefit2')}</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 text-purple-300 mt-0.5 flex-shrink-0" />
                    <span>{t('home.hero.benefits.section2.benefit3')}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 opacity-0 animate-fade-in-up animate-delay-1300 hover:bg-white/15 hover:scale-105 transition-all duration-300 hover:shadow-xl cursor-pointer">
                <div className="flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-purple-300" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{t('home.hero.benefits.section3.title')}</h3>
                <div className="text-gray-100 text-m space-y-2">
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 text-purple-300 mt-0.5 flex-shrink-0" />
                    <span>{t('home.hero.benefits.section3.benefit1')}</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 text-purple-300 mt-0.5 flex-shrink-0" />
                    <span>{t('home.hero.benefits.section3.benefit2')}</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 text-purple-300 mt-0.5 flex-shrink-0" />
                    <span>{t('home.hero.benefits.section3.benefit3')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;