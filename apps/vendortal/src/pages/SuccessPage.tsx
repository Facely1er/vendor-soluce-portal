import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Mail, ArrowRight, Download, FileText, Shield } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const SuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'default';
  const title = searchParams.get('title') || 'Success!';
  const message = searchParams.get('message') || 'Your action was completed successfully.';

  const getSuccessContent = () => {
    switch (type) {
      case 'signup':
        return {
          icon: <CheckCircle className="h-16 w-16 text-purple-500" />,
          title: 'Welcome to VendorTal!',
          message: 'Your account has been created successfully. Check your email to verify your account.',
          actions: [
            { label: 'Go to Dashboard', path: '/dashboard', variant: 'primary' as const },
            { label: 'Explore Features', path: '/how-it-works', variant: 'outline' as const },
          ],
          nextSteps: [
            'Verify your email address',
            'Complete your profile',
            'Start your first vendor assessment',
          ],
        };
      case 'assessment':
        return {
          icon: <FileText className="h-16 w-16 text-blue-500" />,
          title: 'Assessment Submitted!',
          message: 'Your vendor assessment has been submitted successfully. The vendor will be notified.',
          actions: [
            { label: 'View Assessment', path: '/vendor-assessments', variant: 'primary' as const },
            { label: 'Create Another', path: '/vendor-assessments', variant: 'outline' as const },
          ],
          nextSteps: [
            'Monitor assessment progress',
            'Review vendor responses',
            'Generate compliance reports',
          ],
        };
      case 'subscription':
        return {
          icon: <Shield className="h-16 w-16 text-purple-500" />,
          title: 'Subscription Activated!',
          message: 'Your subscription has been activated. You now have access to all premium features.',
          actions: [
            { label: 'Go to Dashboard', path: '/dashboard', variant: 'primary' as const },
            { label: 'View Billing', path: '/billing', variant: 'outline' as const },
          ],
          nextSteps: [
            'Explore premium features',
            'Invite team members',
            'Set up integrations',
          ],
        };
      case 'contact':
        return {
          icon: <Mail className="h-16 w-16 text-indigo-500" />,
          title: 'Message Sent!',
          message: 'Thank you for contacting us. We\'ll get back to you within 24 hours.',
          actions: [
            { label: 'Return Home', path: '/', variant: 'primary' as const },
            { label: 'View Resources', path: '/resources', variant: 'outline' as const },
          ],
          nextSteps: [
            'Check your email for confirmation',
            'Explore our help center',
            'Schedule a demo if needed',
          ],
        };
      default:
        return {
          icon: <CheckCircle className="h-16 w-16 text-purple-500" />,
          title,
          message,
          actions: [
            { label: 'Go to Dashboard', path: '/dashboard', variant: 'primary' as const },
            { label: 'Return Home', path: '/', variant: 'outline' as const },
          ],
          nextSteps: [],
        };
    }
  };

  const content = getSuccessContent();

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card className="p-8 md:p-12 text-center">
          <div className="flex justify-center mb-6">
            {content.icon}
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {content.title}
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            {content.message}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {content.actions.map((action, index) => (
              <Link key={index} to={action.path}>
                <Button variant={action.variant} size="lg">
                  {action.label}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ))}
          </div>

          {content.nextSteps.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                What's Next?
              </h2>
              <ul className="space-y-3 text-left max-w-md mx-auto">
                {content.nextSteps.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-400">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Need Help?
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/help" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                Visit Help Center
              </Link>
              <Link to="/resources" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                View Resources
              </Link>
              <Link to="/contact" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                Contact Support
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default SuccessPage;

