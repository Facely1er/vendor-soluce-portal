import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, PlayCircle, FileText, Users, Shield, BarChart } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const GettingStartedPage: React.FC = () => {
  const steps = [
    {
      number: 1,
      title: 'Create Your Account',
      description: 'Sign up for a free 14-day trial. No credit card required.',
      icon: <Users className="h-6 w-6" />,
      action: { label: 'Sign Up', path: '/signin' },
      details: [
        'Complete your profile',
        'Verify your email address',
        'Set up your organization',
      ],
    },
    {
      number: 2,
      title: 'Complete Onboarding',
      description: 'Take a quick tour of the platform and configure your settings.',
      icon: <PlayCircle className="h-6 w-6" />,
      action: { label: 'Start Onboarding', path: '/onboarding' },
      details: [
        'Watch platform overview video',
        'Configure your preferences',
        'Set up your first vendor',
      ],
    },
      {
        number: 3,
        title: 'Send Your First Security Questionnaire',
        description: 'Select a vendor and questionnaire template, then send the security questionnaire for due diligence.',
        icon: <FileText className="h-6 w-6" />,
        action: { label: 'Send Questionnaire', path: '/vendor-assessments' },
        details: [
          'Select a vendor to send questionnaire to',
          'Choose a questionnaire template (NIST, CMMC, SOC2, etc.)',
          'Send questionnaire link to vendor',
        ],
      },
      {
        number: 4,
        title: 'Review Vendor Responses',
        description: 'Vendor completes questionnaire in portal. Review responses for due diligence.',
        icon: <BarChart className="h-6 w-6" />,
        action: { label: 'View Dashboard', path: '/dashboard' },
        details: [
          'Vendor completes questionnaire in secure portal',
          'Review vendor responses and compliance scores',
          'Generate due diligence reports',
        ],
      },
  ];

  const quickLinks = [
    { title: 'Platform Overview Video', path: '/resources/videos/platform-overview', icon: <PlayCircle className="h-5 w-5" /> },
    { title: 'Getting Started Guide', path: '/resources/guides/getting-started', icon: <FileText className="h-5 w-5" /> },
    { title: 'Help Center', path: '/help', icon: <Shield className="h-5 w-5" /> },
    { title: 'Contact Support', path: '/contact', icon: <Users className="h-5 w-5" /> },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Getting Started with VendorTal
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Send security questionnaires to vendors for due diligence. Follow these simple steps to get started.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8 mb-16">
          {steps.map((step, index) => (
            <Card key={index} className="p-8 hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl font-bold">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <div className="text-blue-600 dark:text-blue-400 mr-3">
                      {step.icon}
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {step.title}
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {step.description}
                  </p>
                  <ul className="space-y-2 mb-4">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start text-gray-600 dark:text-gray-400">
                        <CheckCircle className="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to={step.action.path}>
                    <Button variant="primary" size="md">
                      {step.action.label}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Links */}
        <Card className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Quick Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link, index) => (
              <Link key={index} to={link.path}>
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer text-center">
                  <div className="flex justify-center mb-3 text-blue-600 dark:text-blue-400">
                    {link.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {link.title}
                  </h3>
                </Card>
              </Link>
            ))}
          </div>
        </Card>

        {/* CTA Section */}
        <Card className="p-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center mt-12">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start your 14-day free trial today. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signin">
              <Button variant="secondary" size="lg">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                Schedule Demo
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default GettingStartedPage;

