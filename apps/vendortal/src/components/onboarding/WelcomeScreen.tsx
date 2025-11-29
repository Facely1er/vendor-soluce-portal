import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  FileCheck,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Target,
  Users,
  BookOpen,
  Shield,
  FileJson
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface WelcomeScreenProps {
  onComplete: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const { user, markOnboardingComplete } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState({
    role: '',
    company_size: '',
    industry: ''
  });

  const handleProfileDataChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleComplete = async () => {
    await markOnboardingComplete(profileData);
    onComplete();
  };

  const steps = [
    {
      title: t('onboarding.welcome.title', 'Welcome to VendorTal'),
      subtitle: t('onboarding.welcome.subtitle', 'Your complete supply chain risk management platform'),
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-vendortal-purple/10 rounded-full flex items-center justify-center mx-auto">
            <Shield className="h-12 w-12 text-vendortal-purple" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('onboarding.welcome.greeting', 'Welcome, {{name}}!', { name: user?.user_metadata?.full_name || user?.email })}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
              {t('onboarding.welcome.description', 'VendorTal helps you assess, monitor, and mitigate third-party risks across your supply chain with tools aligned with NIST SP 800-161.')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <FileCheck className="h-8 w-8 text-vendortal-purple mx-auto mb-2" />
                <div className="font-medium text-gray-900 dark:text-white">{t('onboarding.welcome.cards.assessVendors.title', 'Assess Vendors')}</div>
                <div className="text-gray-600 dark:text-gray-400">{t('onboarding.welcome.cards.assessVendors.desc', 'NIST 800-161 compliant assessments')}</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <BarChart3 className="h-8 w-8 text-vendortal-purple mx-auto mb-2" />
                <div className="font-medium text-gray-900 dark:text-white">{t('onboarding.welcome.cards.monitorRisks.title', 'Monitor Risks')}</div>
                <div className="text-gray-600 dark:text-gray-400">{t('onboarding.welcome.cards.monitorRisks.desc', 'Real-time risk dashboards')}</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <FileJson className="h-8 w-8 text-vendortal-purple mx-auto mb-2" />
                <div className="font-medium text-gray-900 dark:text-white">{t('onboarding.welcome.cards.analyzeSboms.title', 'Analyze SBOMs')}</div>
                <div className="text-gray-600 dark:text-gray-400">{t('onboarding.welcome.cards.analyzeSboms.desc', 'Software bill of materials analysis')}</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: t('onboarding.profile.title', 'Your Role & Organization'),
      subtitle: t('onboarding.profile.subtitle', 'Help us tailor your experience'),
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <Users className="h-16 w-16 text-vendortal-purple mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {t('onboarding.profile.header', 'Tell us about yourself')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t('onboarding.profile.helper', 'This helps us show you the most relevant features and content')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('onboarding.profile.roleLabel', 'Your Primary Role')}
              </label>
              <select 
                value={profileData.role}
                onChange={(e) => handleProfileDataChange('role', e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">{t('onboarding.profile.role.placeholder', 'Select your role')}</option>
                <option value="security">{t('onboarding.profile.role.security', 'Security Professional')}</option>
                <option value="procurement">{t('onboarding.profile.role.procurement', 'Procurement Manager')}</option>
                <option value="compliance">{t('onboarding.profile.role.compliance', 'Compliance Officer')}</option>
                <option value="risk">{t('onboarding.profile.role.risk', 'Risk Manager')}</option>
                <option value="it">{t('onboarding.profile.role.it', 'IT Manager')}</option>
                <option value="executive">{t('onboarding.profile.role.executive', 'Executive')}</option>
                <option value="other">{t('common.other', 'Other')}</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('onboarding.profile.sizeLabel', 'Organization Size')}
              </label>
              <select 
                value={profileData.company_size}
                onChange={(e) => handleProfileDataChange('company_size', e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">{t('onboarding.profile.size.placeholder', 'Select size')}</option>
                <option value="startup">{t('onboarding.profile.size.startup', 'Startup (1-50 employees)')}</option>
                <option value="small">{t('onboarding.profile.size.small', 'Small Business (51-200 employees)')}</option>
                <option value="medium">{t('onboarding.profile.size.medium', 'Medium Business (201-1000 employees)')}</option>
                <option value="large">{t('onboarding.profile.size.large', 'Large Enterprise (1000+ employees)')}</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('onboarding.profile.industryLabel', 'Industry')}
              </label>
              <select 
                value={profileData.industry}
                onChange={(e) => handleProfileDataChange('industry', e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">{t('onboarding.profile.industry.placeholder', 'Select industry')}</option>
                <option value="technology">{t('onboarding.profile.industry.technology', 'Technology')}</option>
                <option value="healthcare">{t('onboarding.profile.industry.healthcare', 'Healthcare')}</option>
                <option value="financial">{t('onboarding.profile.industry.financial', 'Financial Services')}</option>
                <option value="manufacturing">{t('onboarding.profile.industry.manufacturing', 'Manufacturing')}</option>
                <option value="government">{t('onboarding.profile.industry.government', 'Government/Public Sector')}</option>
                <option value="defense">{t('onboarding.profile.industry.defense', 'Defense/Aerospace')}</option>
                <option value="energy">{t('onboarding.profile.industry.energy', 'Energy/Utilities')}</option>
                <option value="retail">{t('onboarding.profile.industry.retail', 'Retail/E-commerce')}</option>
                <option value="other">{t('common.other', 'Other')}</option>
              </select>
            </div>
          </div>
        </div>
      )
    },
    {
      title: t('onboarding.getStarted.title', 'Get Started'),
      subtitle: t('onboarding.getStarted.subtitle', 'Choose your first action'),
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <Target className="h-16 w-16 text-vendortal-purple mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {t('onboarding.getStarted.question', 'What would you like to do first?')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t('onboarding.getStarted.helper', 'Choose an action to get started with VendorTal')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <Link to="/vendor-assessments" className="block">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-vendortal-purple transition-colors cursor-pointer">
                <div className="flex items-center">
                  <FileCheck className="h-8 w-8 text-vendortal-purple mr-4" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">{t('onboarding.getStarted.assessment.title', 'Run Supply Chain Assessment')}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t('onboarding.getStarted.assessment.desc', "Evaluate your organization's supply chain security posture")}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </Link>
            
            <Link to="/vendor-risk-dashboard" className="block">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-vendortal-purple transition-colors cursor-pointer">
                <div className="flex items-center">
                  <BarChart3 className="h-8 w-8 text-vendortal-purple mr-4" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">{t('onboarding.getStarted.vendor.title', 'Add Your First Vendor')}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t('onboarding.getStarted.vendor.desc', 'Start building your vendor risk portfolio')}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </Link>
            
            <Link to="/sbom-analyzer" className="block">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-vendortal-purple transition-colors cursor-pointer">
                <div className="flex items-center">
                  <FileJson className="h-8 w-8 text-vendortal-purple mr-4" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">{t('onboarding.getStarted.sbom.title', 'Analyze Software Components')}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t('onboarding.getStarted.sbom.desc', 'Upload and analyze a Software Bill of Materials')}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </Link>
            
            <div 
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-vendortal-purple transition-colors cursor-pointer"
              onClick={() => {
                handleComplete();
                // Tour will be started after onboarding completion
              }}
            >
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-vendortal-purple mr-4" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">{t('onboarding.getStarted.tour.title', 'Take a Quick Tour')}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {t('onboarding.getStarted.tour.desc', 'Learn about key features with a guided walkthrough')}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: t('onboarding.tour.title', 'Quick Tour'),
      subtitle: t('onboarding.tour.subtitle', 'Key features overview'),
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <BookOpen className="h-16 w-16 text-vendortal-purple mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {t('onboarding.tour.header', 'VendorTal Key Features')}
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-vendortal-purple/10 rounded-full flex items-center justify-center mr-4 mt-1">
                <FileCheck className="h-4 w-4 text-vendortal-purple" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">{t('onboarding.tour.assessments.title', 'Supply Chain Assessments')}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t('onboarding.tour.assessments.desc', 'Comprehensive NIST SP 800-161 aligned assessments to evaluate your supply chain security posture across 6 key domains.')}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-vendortal-purple/10 rounded-full flex items-center justify-center mr-4 mt-1">
                <BarChart3 className="h-4 w-4 text-vendortal-purple" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">{t('onboarding.tour.vendorRisk.title', 'Vendor Risk Management')}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t('onboarding.tour.vendorRisk.desc', 'Track and monitor vendor risks with automated scoring, compliance tracking, and customizable dashboards.')}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-vendortal-purple/10 rounded-full flex items-center justify-center mr-4 mt-1">
                <FileJson className="h-4 w-4 text-vendortal-purple" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">{t('onboarding.tour.sbom.title', 'SBOM Analysis')}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t('onboarding.tour.sbom.desc', 'Analyze Software Bills of Materials for vulnerabilities, license compliance, and component risks with support for SPDX and CycloneDX formats.')}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-vendortal-purple/10 rounded-full flex items-center justify-center mr-4 mt-1">
                <Target className="h-4 w-4 text-vendortal-purple" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">{t('onboarding.tour.quickTools.title', 'Quick Tools')}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t('onboarding.tour.quickTools.desc', 'Access rapid assessment tools like the Vendor Risk Calculator, SBOM Quick Scan, and NIST 800-161 Checklist.')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {
    await markOnboardingComplete();
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl text-gray-900 dark:text-white">
                {steps[currentStep].title}
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {steps[currentStep].subtitle}
              </p>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="mt-4">
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 flex-1 rounded-full ${
                    index <= currentStep
                      ? 'bg-vendortal-purple'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="min-h-[400px]">
            {steps[currentStep].content}
          </div>
          
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div>
              {currentStep > 0 && (
                <Button variant="outline" onClick={handlePrevious}>
                  {t('common.previous', 'Previous')}
                </Button>
              )}
            </div>
            
            <div className="flex space-x-3">
              <Button variant="ghost" onClick={handleSkip}>
                {t('onboarding.actions.skipTour', 'Skip Tour')}
              </Button>
              
              {currentStep < steps.length - 1 ? (
                <Button variant="primary" onClick={handleNext}>
                  {t('common.next', 'Next')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button variant="primary" onClick={handleComplete}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {t('onboarding.actions.getStarted', 'Get Started')}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeScreen;