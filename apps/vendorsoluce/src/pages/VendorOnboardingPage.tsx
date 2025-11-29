import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Building, 
  ArrowRight, 
  CheckCircle, 
  Users, 
  Shield, 
  FileText,
  MessageCircle,
  HelpCircle,
  Clock,
  Award
} from 'lucide-react';
import VendorOnboardingWizard from '../components/vendor/VendorOnboardingWizard';
import VendorDashboard from '../components/vendor/VendorDashboard';
import ChatbotTrigger from '../components/chatbot/ChatbotTrigger';
import { useChatbot } from '../components/chatbot/ChatbotProvider';

type OnboardingStep = 'welcome' | 'wizard' | 'dashboard';

const VendorOnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [_isCompleted, setIsCompleted] = useState(false);
  const { openChatbot } = useChatbot();

  const handleStartOnboarding = () => {
    setCurrentStep('wizard');
  };

  const handleOnboardingComplete = () => {
    setIsCompleted(true);
    setCurrentStep('dashboard');
  };

  const handleGetHelp = () => {
    openChatbot('vendor-onboarding');
  };

  if (currentStep === 'wizard') {
    return <VendorOnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  if (currentStep === 'dashboard') {
    return <VendorDashboard />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-vendorsoluce-green/10 rounded-lg flex items-center justify-center mr-4">
                <Building className="h-6 w-6 text-vendorsoluce-green" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Vendor Onboarding
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Join our secure vendor ecosystem
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <ChatbotTrigger 
                context="vendor-onboarding" 
                variant="minimal"
                size="sm"
              />
              <Button variant="outline" size="sm" onClick={handleGetHelp}>
                <HelpCircle className="h-4 w-4 mr-2" />
                Help
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-vendorsoluce-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building className="h-12 w-12 text-vendorsoluce-green" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to VendorSoluce
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Complete your vendor registration to access our comprehensive supply chain risk management platform and start building secure partnerships.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Secure Assessment
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Complete NIST SP 800-161 aligned assessments to demonstrate your security posture and compliance.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Trusted Network
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Join a network of verified vendors and access opportunities with security-conscious organizations.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Compliance Ready
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Meet multiple compliance frameworks including ISO 27001, SOC 2, PCI DSS, and CMMC requirements.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Process Overview */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Onboarding Process</CardTitle>
            <p className="text-center text-gray-600 dark:text-gray-300">
              Simple steps to get you started
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-vendorsoluce-navy text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  1
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Company Info</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Provide basic company information and business details
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-vendorsoluce-navy text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  2
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Contacts</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Add primary, security, and billing contact information
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-vendorsoluce-navy text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  3
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Documents</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Upload required business and compliance documents
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-vendorsoluce-navy text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  4
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Review</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Review and submit your application for approval
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              What You'll Need
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Required Documents</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Business License or Registration
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Insurance Certificate
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Security Policy Document
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Compliance Certificates
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Information Required</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Company details and industry
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Contact information for key personnel
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Security measures and certifications
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Assessment preferences
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Timeline & Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-4">
                  <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Application Review</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Our team will review your application within 2-3 business days
                  </p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-4">
                  <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Security Assessment</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Complete your first security assessment within 7 days of approval
                  </p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-4">
                  <Award className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Full Access</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Gain access to all platform features and vendor network
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-vendorsoluce-navy rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-lg mb-6 opacity-90">
              Join thousands of vendors who trust VendorSoluce for their supply chain security needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleStartOnboarding}
                size="lg"
                className="bg-white text-vendorsoluce-navy hover:bg-gray-100"
              >
                Start Onboarding
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button
                onClick={handleGetHelp}
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Get Help
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chatbot Trigger */}
      <ChatbotTrigger context="vendor-onboarding" />
    </div>
  );
};

export default VendorOnboardingPage;