import React, { useState, useEffect } from 'react';
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
import { TrialStartBanner } from './TrialStartBanner';
import { OnboardingService } from '../../services/onboardingService';
import { logger } from '../../utils/logger';

interface WelcomeScreenProps {
  onComplete: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const { user, profile, markOnboardingComplete } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [trialAutoStarted, setTrialAutoStarted] = useState(false);
  const [profileData, setProfileData] = useState({
    role: '',
    company_size: '',
    industry: ''
  });

  // Auto-start trial and onboarding automation when component mounts
  useEffect(() => {
    const autoStartOnboarding = async () => {
      if (!user?.id || trialAutoStarted) return;

      try {
        // Complete onboarding automation (includes trial start)
        await OnboardingService.completeOnboarding(user.id);
        setTrialAutoStarted(true);
        logger.log('Onboarding automation completed, trial auto-started');
      } catch (error) {
        logger.error('Error in onboarding automation:', error);
        // Don't block onboarding if automation fails
      }
    };

    // Auto-start on first step
    if (currentStep === 0 && user?.id) {
      autoStartOnboarding();
    }
  }, [user, currentStep, trialAutoStarted]);

  const handleProfileDataChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const steps = [
    {
      title: 'Welcome to VendorSoluce',
      subtitle: 'Your complete supply chain risk management platform',
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-vendorsoluce-green/10 rounded-full flex items-center justify-center mx-auto">
            <Shield className="h-12 w-12 text-vendorsoluce-green" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {`Welcome${profile?.full_name ? `, ${profile.full_name}` : ''}!`}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
              VendorSoluce helps you assess, monitor, and mitigate third-party risks 
              across your supply chain with tools aligned with NIST SP 800-161.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <FileCheck className="h-8 w-8 text-vendorsoluce-green mx-auto mb-2" />
                <div className="font-medium text-gray-900 dark:text-white">Assess Vendors</div>
                <div className="text-gray-600 dark:text-gray-400">NIST 800-161 compliant assessments</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <BarChart3 className="h-8 w-8 text-vendorsoluce-green mx-auto mb-2" />
                <div className="font-medium text-gray-900 dark:text-white">Monitor Risks</div>
                <div className="text-gray-600 dark:text-gray-400">Real-time risk dashboards</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <FileJson className="h-8 w-8 text-vendorsoluce-green mx-auto mb-2" />
                <div className="font-medium text-gray-900 dark:text-white">Analyze SBOMs</div>
                <div className="text-gray-600 dark:text-gray-400">Software bill of materials analysis</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Your Role & Organization',
      subtitle: 'Help us tailor your experience',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <Users className="h-16 w-16 text-vendorsoluce-green mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Tell us about yourself
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              This helps us show you the most relevant features and content
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Primary Role
              </label>
              <select 
                value={profileData.role}
                onChange={(e) => handleProfileDataChange('role', e.target.value)}
                aria-label="Select your primary role"
                title="Select your primary role"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">Select your role</option>
                <option value="security">Security Professional</option>
                <option value="procurement">Procurement Manager</option>
                <option value="compliance">Compliance Officer</option>
                <option value="risk">Risk Manager</option>
                <option value="it">IT Manager</option>
                <option value="executive">Executive</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Organization Size
              </label>
              <select 
                value={profileData.company_size}
                onChange={(e) => handleProfileDataChange('company_size', e.target.value)}
                aria-label="Select organization size"
                title="Select organization size"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">Select size</option>
                <option value="startup">Startup (1-50 employees)</option>
                <option value="small">Small Business (51-200 employees)</option>
                <option value="medium">Medium Business (201-1000 employees)</option>
                <option value="large">Large Enterprise (1000+ employees)</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Industry
              </label>
              <select 
                value={profileData.industry}
                onChange={(e) => handleProfileDataChange('industry', e.target.value)}
                aria-label="Select industry"
                title="Select industry"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">Select industry</option>
                <option value="technology">Technology</option>
                <option value="healthcare">Healthcare</option>
                <option value="financial">Financial Services</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="government">Government/Public Sector</option>
                <option value="defense">Defense/Aerospace</option>
                <option value="energy">Energy/Utilities</option>
                <option value="retail">Retail/E-commerce</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Get Started',
      subtitle: 'Choose your first action',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <Target className="h-16 w-16 text-vendorsoluce-green mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              What would you like to do first?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Choose an action to get started with VendorSoluce
            </p>
          </div>

          {/* Trial Start Banner */}
          <TrialStartBanner />
          
          <div className="grid grid-cols-1 gap-4">
            <Link to="/supply-chain-assessment" className="block">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-vendorsoluce-green transition-colors cursor-pointer">
                <div className="flex items-center">
                  <FileCheck className="h-8 w-8 text-vendorsoluce-green mr-4" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">Run Supply Chain Assessment</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Evaluate your organization's supply chain security posture
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </Link>
            
            <Link to="/vendor-risk-dashboard" className="block">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-vendorsoluce-green transition-colors cursor-pointer">
                <div className="flex items-center">
                  <BarChart3 className="h-8 w-8 text-vendorsoluce-green mr-4" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">Add Your First Vendor</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Start building your vendor risk portfolio
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </Link>
            
            <Link to="/sbom-analyzer" className="block">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-vendorsoluce-green transition-colors cursor-pointer">
                <div className="flex items-center">
                  <FileJson className="h-8 w-8 text-vendorsoluce-green mr-4" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">Analyze Software Components</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Upload and analyze a Software Bill of Materials
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </Link>
            
            <div 
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-vendorsoluce-green transition-colors cursor-pointer"
              onClick={() => {
                handleComplete();
                // Tour will be started after onboarding completion
              }}
            >
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-vendorsoluce-green mr-4" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">Take a Quick Tour</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Learn about key features with a guided walkthrough
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
      title: 'Quick Tour',
      subtitle: 'Key features overview',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <BookOpen className="h-16 w-16 text-vendorsoluce-green mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              VendorSoluce Key Features
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-vendorsoluce-green/10 rounded-full flex items-center justify-center mr-4 mt-1">
                <FileCheck className="h-4 w-4 text-vendorsoluce-green" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">Supply Chain Assessments</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Comprehensive NIST SP 800-161 aligned assessments to evaluate your supply chain security posture across 6 key domains.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-vendorsoluce-green/10 rounded-full flex items-center justify-center mr-4 mt-1">
                <BarChart3 className="h-4 w-4 text-vendorsoluce-green" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">Vendor Risk Management</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Track and monitor vendor risks with automated scoring, compliance tracking, and customizable dashboards.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-vendorsoluce-green/10 rounded-full flex items-center justify-center mr-4 mt-1">
                <FileJson className="h-4 w-4 text-vendorsoluce-green" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">SBOM Analysis</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Analyze Software Bills of Materials for vulnerabilities, license compliance, and component risks with support for SPDX and CycloneDX formats.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-vendorsoluce-green/10 rounded-full flex items-center justify-center mr-4 mt-1">
                <Target className="h-4 w-4 text-vendorsoluce-green" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">Quick Tools</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Access rapid assessment tools like the Vendor Risk Calculator, SBOM Quick Scan, and NIST 800-161 Checklist.
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

  const completeOnboardingFlow = async () => {
    try {
      // Mark onboarding as completed
      await markOnboardingComplete({
        ...profileData
      });

      // Mark onboarding as completed in service
      if (user?.id) {
        await OnboardingService.markOnboardingCompleted(user.id);
      }

      onComplete();
    } catch (error) {
      logger.error('Error completing onboarding:', error);
      // Still call onComplete even if marking fails
      onComplete();
    }
  };

  const handleComplete = () => {
    completeOnboardingFlow();
  };

  const handleSkip = () => {
    completeOnboardingFlow();
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
                      ? 'bg-vendorsoluce-green'
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
                  Previous
                </Button>
              )}
            </div>
            
            <div className="flex space-x-3">
              <Button variant="ghost" onClick={handleSkip}>
                Skip Tour
              </Button>
              
              {currentStep < steps.length - 1 ? (
                <Button variant="primary" onClick={handleNext}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button variant="primary" onClick={handleComplete}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Get Started
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