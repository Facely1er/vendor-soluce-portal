import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  FileCheck,
  Plus,
  ArrowRight,
  CheckCircle,
  Target,
  FileJson,
  HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface GetStartedItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  completed: boolean;
  completedText?: string;
}

interface GetStartedWidgetProps {
  vendorCount?: number;
  assessmentCount?: number;
  sbomCount?: number;
  onDismiss?: () => void;
  onHelpClick?: () => void;
}

const GetStartedWidget: React.FC<GetStartedWidgetProps> = ({
  vendorCount = 0,
  assessmentCount = 0,
  sbomCount = 0,
  onDismiss,
  onHelpClick
}) => {
  const startedItems: GetStartedItem[] = [
    {
      id: 'first-vendor',
      title: 'Add Your First Vendor',
      description: 'Start building your vendor risk portfolio by adding your first vendor.',
      icon: <Plus className="h-6 w-6" />,
      href: '/vendors',
      completed: vendorCount > 0,
      completedText: `${vendorCount} vendors added`
    },
    {
      id: 'run-assessment',
      title: 'Run Supply Chain Assessment',
      description: 'Evaluate your organization\'s supply chain security posture.',
      icon: <FileCheck className="h-6 w-6" />,
      href: '/supply-chain-assessment',
      completed: assessmentCount > 0,
      completedText: `${assessmentCount} assessments completed`
    },
    {
      id: 'analyze-sbom',
      title: 'Analyze Software Components',
      description: 'Upload and analyze a Software Bill of Materials for vulnerabilities.',
      icon: <FileJson className="h-6 w-6" />,
      href: '/sbom-analyzer',
      completed: sbomCount > 0,
      completedText: `${sbomCount} SBOMs analyzed`
    }
  ];

  const completedCount = startedItems.filter(item => item.completed).length;
  const progressPercentage = (completedCount / startedItems.length) * 100;

  // Don't show if all items are completed
  if (completedCount === startedItems.length) {
    return null;
  }

  return (
    <Card className="border-l-4 border-l-vendorsoluce-green mb-8" data-tour="get-started-widget">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center text-xl text-gray-900 dark:text-white">
              <Target className="h-6 w-6 text-vendorsoluce-green mr-2" />
              Get Started with VendorSoluce
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Complete these essential steps to set up your supply chain risk management
            </p>
          </div>
          {onDismiss && (
            <Button variant="ghost" size="sm" onClick={onDismiss}>
              Dismiss
            </Button>
          )}
        </div>
        
        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Progress</span>
            <span>{completedCount} of {startedItems.length} completed</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-vendorsoluce-green h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {startedItems.map((item) => (
            <div key={item.id} className="relative">
              {item.completed ? (
                <div className="border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <div className="flex items-center text-green-600 dark:text-green-400 mb-2">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium text-sm">Completed</span>
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {item.completedText}
                  </p>
                </div>
              ) : (
                <Link to={item.href} className="block h-full">
                  <div 
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-vendorsoluce-green hover:shadow-md transition-all h-full"
                    data-tour={item.id === 'first-vendor' ? 'add-vendor' : item.id === 'run-assessment' ? 'run-assessment' : item.id === 'analyze-sbom' ? 'analyze-sbom' : undefined}
                  >
                    <div className="flex items-center text-vendorsoluce-green mb-3">
                      {item.icon}
                      <ArrowRight className="h-4 w-4 ml-auto" />
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {item.description}
                    </p>
                  </div>
                </Link>
              )}
            </div>
          ))}
        </div>
        
        {/* Additional resources */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Need Help Getting Started?</h4>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onHelpClick}
              className="flex items-center"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Ask Assistant
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('/templates', '_blank')}
            >
              Download Templates
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('/api-docs', '_blank')}
            >
              View Documentation
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('/contact', '_blank')}
            >
              Contact Support
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GetStartedWidget;