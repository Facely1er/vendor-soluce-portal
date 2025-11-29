import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../hooks/useSubscription';
import { supabase } from '../../lib/supabase';
import { 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Building2, 
  Users, 
  Shield, 
  Settings,
  CreditCard,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Progress } from '../ui/Progress';
import { Badge } from '../ui/Badge';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  component: React.ComponentType<any>;
  required: boolean;
  estimatedTime: string;
}

interface OnboardingData {
  companyName: string;
  industry: string;
  companySize: string;
  complianceFrameworks: string[];
  primaryUseCase: string;
  vendorsCount: number;
  teamSize: number;
  budget: string;
  timeline: string;
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
    dataExport: boolean;
  };
}

const OnboardingWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    companyName: '',
    industry: '',
    companySize: '',
    complianceFrameworks: [],
    primaryUseCase: '',
    vendorsCount: 0,
    teamSize: 1,
    budget: '',
    timeline: '',
    preferences: {
      notifications: true,
      emailUpdates: true,
      dataExport: false
    }
  });
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { subscription, tier } = useSubscription();
  const navigate = useNavigate();

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to VendorTal',
      description: 'Let\'s get you set up for success',
      icon: <Zap className="h-6 w-6" />,
      component: WelcomeStep,
      required: true,
      estimatedTime: '1 min'
    },
    {
      id: 'company',
      title: 'Company Information',
      description: 'Tell us about your organization',
      icon: <Building2 className="h-6 w-6" />,
      component: CompanyStep,
      required: true,
      estimatedTime: '2 min'
    },
    {
      id: 'compliance',
      title: 'Compliance Requirements',
      description: 'What frameworks do you need?',
      icon: <Shield className="h-6 w-6" />,
      component: ComplianceStep,
      required: true,
      estimatedTime: '3 min'
    },
    {
      id: 'use-case',
      title: 'Primary Use Case',
      description: 'How will you use VendorTal?',
      icon: <Target className="h-6 w-6" />,
      component: UseCaseStep,
      required: true,
      estimatedTime: '2 min'
    },
    {
      id: 'team',
      title: 'Team Setup',
      description: 'Configure your team and permissions',
      icon: <Users className="h-6 w-6" />,
      component: TeamStep,
      required: false,
      estimatedTime: '3 min'
    },
    {
      id: 'preferences',
      title: 'Preferences',
      description: 'Customize your experience',
      icon: <Settings className="h-6 w-6" />,
      component: PreferencesStep,
      required: false,
      estimatedTime: '1 min'
    },
    {
      id: 'subscription',
      title: 'Choose Your Plan',
      description: 'Select the plan that fits your needs',
      icon: <CreditCard className="h-6 w-6" />,
      component: SubscriptionStep,
      required: true,
      estimatedTime: '2 min'
    },
    {
      id: 'complete',
      title: 'You\'re All Set!',
      description: 'Welcome to VendorTal',
      icon: <TrendingUp className="h-6 w-6" />,
      component: CompleteStep,
      required: true,
      estimatedTime: '1 min'
    }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const updateOnboardingData = (stepId: string, data: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
    setCompletedSteps(prev => new Set([...prev, stepId]));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const completeOnboarding = async () => {
    setIsLoading(true);
    try {
      // Save onboarding data to user profile
      const { error } = await supabase
        .from('vs_profiles')
        .update({
          onboarding_completed: true,
          onboarding_data: onboardingData,
          company_name: onboardingData.companyName,
          industry: onboardingData.industry,
          company_size: onboardingData.companySize,
          compliance_frameworks: onboardingData.complianceFrameworks,
          primary_use_case: onboardingData.primaryUseCase,
          vendors_count: onboardingData.vendorsCount,
          team_size: onboardingData.teamSize,
          budget: onboardingData.budget,
          timeline: onboardingData.timeline,
          preferences: onboardingData.preferences,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (error) throw error;

      // Navigate to dashboard
      navigate('/dashboard?onboarding=complete');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to VendorTal
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Let's get you set up for success with supply chain risk management
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {steps[currentStep].estimatedTime}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Navigation */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center space-x-2 ${
                  index <= currentStep ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'
                }`}
              >
                <div className={`p-2 rounded-full ${
                  index < currentStep ? 'bg-green-100 dark:bg-green-900' :
                  index === currentStep ? 'bg-blue-100 dark:bg-blue-900' :
                  'bg-gray-100 dark:bg-gray-700'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : (
                    step.icon
                  )}
                </div>
                <span className="text-sm font-medium hidden sm:block">
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Content */}
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                {steps[currentStep].icon}
                <div>
                  <h2 className="text-xl font-semibold">{steps[currentStep].title}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {steps[currentStep].description}
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CurrentStepComponent
                data={onboardingData}
                updateData={(data) => updateOnboardingData(steps[currentStep].id, data)}
                onNext={nextStep}
                onPrev={prevStep}
                onSkip={skipStep}
                onComplete={completeOnboarding}
                isLoading={isLoading}
                subscription={subscription}
                tier={tier}
              />
            </CardContent>
          </Card>
        </div>

        {/* Navigation Buttons */}
        <div className="max-w-2xl mx-auto mt-8 flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>

          <div className="flex space-x-2">
            {!steps[currentStep].required && (
              <Button variant="ghost" onClick={skipStep}>
                Skip
              </Button>
            )}
            
            {currentStep === steps.length - 1 ? (
              <Button
                onClick={completeOnboarding}
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                <span>{isLoading ? 'Completing...' : 'Complete Setup'}</span>
                <CheckCircle className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                disabled={!completedSteps.has(steps[currentStep].id) && steps[currentStep].required}
                className="flex items-center space-x-2"
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Step Components
const WelcomeStep: React.FC<any> = ({ onNext }) => (
  <div className="text-center space-y-6">
    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
      <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
    </div>
    <div>
      <h3 className="text-lg font-semibold mb-2">Welcome to VendorTal!</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        We're excited to help you secure your supply chain. This quick setup will help us personalize your experience.
      </p>
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>What we'll cover:</strong> Company info, compliance needs, team setup, and plan selection.
        </p>
      </div>
    </div>
    <Button onClick={onNext} className="w-full">
      Let's Get Started
    </Button>
  </div>
);

const CompanyStep: React.FC<any> = ({ data, updateData }) => {
  const [formData, setFormData] = useState({
    companyName: data.companyName || '',
    industry: data.industry || '',
    companySize: data.companySize || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateData(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Company Name *
        </label>
        <input
          type="text"
          value={formData.companyName}
          onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="Enter your company name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Industry *
        </label>
        <select
          value={formData.industry}
          onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          required
        >
          <option value="">Select your industry</option>
          <option value="technology">Technology</option>
          <option value="healthcare">Healthcare</option>
          <option value="finance">Finance</option>
          <option value="manufacturing">Manufacturing</option>
          <option value="government">Government</option>
          <option value="education">Education</option>
          <option value="retail">Retail</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Company Size *
        </label>
        <select
          value={formData.companySize}
          onChange={(e) => setFormData(prev => ({ ...prev, companySize: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          required
        >
          <option value="">Select company size</option>
          <option value="startup">Startup (1-10 employees)</option>
          <option value="small">Small (11-50 employees)</option>
          <option value="medium">Medium (51-200 employees)</option>
          <option value="large">Large (201-1000 employees)</option>
          <option value="enterprise">Enterprise (1000+ employees)</option>
        </select>
      </div>

      <Button type="submit" className="w-full">
        Continue
      </Button>
    </form>
  );
};

const ComplianceStep: React.FC<any> = ({ data, updateData }) => {
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>(data.complianceFrameworks || []);

  const frameworks = [
    { id: 'nist', name: 'NIST Cybersecurity Framework', description: 'Core security controls' },
    { id: 'cmmc', name: 'CMMC', description: 'Defense contractor requirements' },
    { id: 'iso27001', name: 'ISO 27001', description: 'Information security management' },
    { id: 'soc2', name: 'SOC 2', description: 'Service organization controls' },
    { id: 'fedramp', name: 'FedRAMP', description: 'Federal cloud security' },
    { id: 'fisma', name: 'FISMA', description: 'Federal information security' }
  ];

  const toggleFramework = (frameworkId: string) => {
    setSelectedFrameworks(prev => 
      prev.includes(frameworkId) 
        ? prev.filter(id => id !== frameworkId)
        : [...prev, frameworkId]
    );
  };

  const handleSubmit = () => {
    updateData({ complianceFrameworks: selectedFrameworks });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Which compliance frameworks do you need?</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Select all that apply. You can change these later.
        </p>
      </div>

      <div className="grid gap-3">
        {frameworks.map((framework) => (
          <label
            key={framework.id}
            className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedFrameworks.includes(framework.id)
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
            }`}
          >
            <input
              type="checkbox"
              checked={selectedFrameworks.includes(framework.id)}
              onChange={() => toggleFramework(framework.id)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {framework.name}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {framework.description}
              </div>
            </div>
          </label>
        ))}
      </div>

      <Button onClick={handleSubmit} className="w-full" disabled={selectedFrameworks.length === 0}>
        Continue ({selectedFrameworks.length} selected)
      </Button>
    </div>
  );
};

const UseCaseStep: React.FC<any> = ({ data, updateData }) => {
  const [formData, setFormData] = useState({
    primaryUseCase: data.primaryUseCase || '',
    vendorsCount: data.vendorsCount || 0,
    budget: data.budget || '',
    timeline: data.timeline || ''
  });

  const useCases = [
    { id: 'vendor-assessment', name: 'Vendor Security Assessments', description: 'Evaluate vendor security posture' },
    { id: 'sbom-analysis', name: 'SBOM Analysis', description: 'Analyze software bill of materials' },
    { id: 'compliance-tracking', name: 'Compliance Tracking', description: 'Monitor compliance status' },
    { id: 'risk-management', name: 'Risk Management', description: 'Identify and mitigate risks' },
    { id: 'audit-preparation', name: 'Audit Preparation', description: 'Prepare for compliance audits' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateData(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Primary Use Case *
        </label>
        <select
          value={formData.primaryUseCase}
          onChange={(e) => setFormData(prev => ({ ...prev, primaryUseCase: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          required
        >
          <option value="">Select your primary use case</option>
          {useCases.map((useCase) => (
            <option key={useCase.id} value={useCase.id}>
              {useCase.name} - {useCase.description}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          How many vendors do you typically assess?
        </label>
        <input
          type="number"
          value={formData.vendorsCount}
          onChange={(e) => setFormData(prev => ({ ...prev, vendorsCount: parseInt(e.target.value) || 0 }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="Enter number of vendors"
          min="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Budget Range
        </label>
        <select
          value={formData.budget}
          onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">Select budget range</option>
          <option value="under-1k">Under $1,000/month</option>
          <option value="1k-5k">$1,000 - $5,000/month</option>
          <option value="5k-10k">$5,000 - $10,000/month</option>
          <option value="10k-plus">$10,000+/month</option>
          <option value="enterprise">Enterprise pricing</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Implementation Timeline
        </label>
        <select
          value={formData.timeline}
          onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">Select timeline</option>
          <option value="immediate">Immediate (within 1 month)</option>
          <option value="short">Short term (1-3 months)</option>
          <option value="medium">Medium term (3-6 months)</option>
          <option value="long">Long term (6+ months)</option>
        </select>
      </div>

      <Button type="submit" className="w-full">
        Continue
      </Button>
    </form>
  );
};

const TeamStep: React.FC<any> = ({ data, updateData }) => {
  const [teamSize, setTeamSize] = useState(data.teamSize || 1);

  const handleSubmit = () => {
    updateData({ teamSize });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Team Setup</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          How many team members will be using VendorTal?
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Team Size
        </label>
        <input
          type="number"
          value={teamSize}
          onChange={(e) => setTeamSize(parseInt(e.target.value) || 1)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          min="1"
          max="100"
        />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          You can add more team members later
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
          Team Features
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Role-based access control</li>
          <li>• Collaborative vendor assessments</li>
          <li>• Shared dashboards and reports</li>
          <li>• Team activity tracking</li>
        </ul>
      </div>

      <Button onClick={handleSubmit} className="w-full">
        Continue
      </Button>
    </div>
  );
};

const PreferencesStep: React.FC<any> = ({ data, updateData }) => {
  const [preferences, setPreferences] = useState(data.preferences || {
    notifications: true,
    emailUpdates: true,
    dataExport: false
  });

  const handleSubmit = () => {
    updateData({ preferences });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Preferences</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Customize your VendorTal experience
        </p>
      </div>

      <div className="space-y-4">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={preferences.notifications}
            onChange={(e) => setPreferences(prev => ({ ...prev, notifications: e.target.checked }))}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              Push Notifications
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Get notified about assessment updates and deadlines
            </div>
          </div>
        </label>

        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={preferences.emailUpdates}
            onChange={(e) => setPreferences(prev => ({ ...prev, emailUpdates: e.target.checked }))}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              Email Updates
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Receive weekly reports and important updates
            </div>
          </div>
        </label>

        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={preferences.dataExport}
            onChange={(e) => setPreferences(prev => ({ ...prev, dataExport: e.target.checked }))}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              Data Export Access
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Allow exporting assessment data and reports
            </div>
          </div>
        </label>
      </div>

      <Button onClick={handleSubmit} className="w-full">
        Continue
      </Button>
    </div>
  );
};

const SubscriptionStep: React.FC<any> = ({ data: _data, updateData, tier }) => {
  const [selectedPlan, setSelectedPlan] = useState(tier || 'starter');

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '$49',
      period: 'month',
      description: 'Perfect for small teams',
      features: ['10 vendors', '10 SBOM scans', '5 assessments', '1 user', 'Email support'],
      recommended: false
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '$149',
      period: 'month',
      description: 'Advanced features for growing teams',
      features: ['50 vendors', '50 SBOM scans', '20 assessments', '5 users', 'Priority support', 'API access'],
      recommended: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$449',
      period: 'month',
      description: 'Unlimited everything',
      features: ['Unlimited vendors', 'Unlimited scans', 'Unlimited assessments', 'Unlimited users', 'Dedicated support', 'SSO'],
      recommended: false
    }
  ];

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = () => {
    updateData({ selectedPlan });
    // Redirect to Stripe checkout integration
    window.location.href = `/checkout?plan=${selectedPlan}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Choose Your Plan</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Based on your needs, we recommend the Professional plan
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative p-6 border rounded-lg cursor-pointer transition-all ${
              selectedPlan === plan.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
            } ${plan.recommended ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => handlePlanSelect(plan.id)}
          >
            {plan.recommended && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white">
                Recommended
              </Badge>
            )}
            
            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                {plan.name}
              </h4>
              <div className="mt-2">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {plan.price}
                </span>
                <span className="text-gray-600 dark:text-gray-400">/{plan.period}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {plan.description}
              </p>
            </div>

            <ul className="mt-4 space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
        <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
          🎉 Free Trial Available
        </h4>
        <p className="text-sm text-green-800 dark:text-green-200">
          Start with a 14-day free trial. No credit card required for the trial period.
        </p>
      </div>

      <Button onClick={handleSubscribe} className="w-full" size="lg">
        Start Free Trial - {plans.find(p => p.id === selectedPlan)?.name} Plan
      </Button>
    </div>
  );
};

const CompleteStep: React.FC<any> = ({ onComplete, isLoading }) => (
  <div className="text-center space-y-6">
    <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
      <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
    </div>
    
    <div>
      <h3 className="text-lg font-semibold mb-2">You're All Set!</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Welcome to VendorTal! Your account is ready and you can start securing your supply chain.
      </p>
    </div>

    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
      <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
        What's Next?
      </h4>
      <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 text-left">
        <li>• Complete your first vendor assessment</li>
        <li>• Upload your first SBOM for analysis</li>
        <li>• Invite team members to collaborate</li>
        <li>• Explore compliance frameworks</li>
      </ul>
    </div>

    <Button 
      onClick={onComplete} 
      disabled={isLoading}
      className="w-full"
      size="lg"
    >
      {isLoading ? 'Completing Setup...' : 'Go to Dashboard'}
    </Button>
  </div>
);

export default OnboardingWizard;
