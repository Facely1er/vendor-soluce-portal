import React from 'react';
import HeroSection from '../components/home/HeroSection';
import ValuePropositionSection from '../components/home/ValuePropositionSection';
import FeatureSection from '../components/home/FeatureSection';
import CTASection from '../components/home/CTASection';
import NotificationManager from '../components/common/NotificationManager';

const HomePage: React.FC = () => {
  
  return (
    <>
      <NotificationManager />
      <HeroSection />
      {/*<AssessmentSection /> */}
       <ValuePropositionSection />
       <FeatureSection /> 
      {/*  <QuickToolsSection /> */}
      <CTASection />
    </>
  );
};

export default HomePage;