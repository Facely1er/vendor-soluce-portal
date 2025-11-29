import React from 'react';
import { Link } from 'react-router-dom';
import { Book, FileText, Download, FileCheck, Award } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const ResourcesPage: React.FC = () => {
  const resources = {
    guides: [
      {
        title: 'How to Send Security Questionnaires to Vendors',
        description: 'Guide to sending security questionnaires to vendors for due diligence',
        type: 'Guide',
        icon: <Book className="h-6 w-6" />,
        link: '/help/assessments/create',
        download: false,
      },
      {
        title: 'Reviewing Vendor Responses for Due Diligence',
        description: 'How to review vendor questionnaire responses and generate due diligence reports',
        type: 'Guide',
        icon: <FileCheck className="h-6 w-6" />,
        link: '/help/assessments/reviewing',
        download: false,
      },
      {
        title: 'Questionnaire Templates Guide',
        description: 'Overview of available questionnaire templates (NIST, CMMC, SOC2, etc.)',
        type: 'Guide',
        icon: <FileText className="h-6 w-6" />,
        link: '/help/assessments/templates',
        download: false,
      },
      {
        title: 'NIST SP 800-161 Questionnaire Guide',
        description: 'How to use NIST SP 800-161 questionnaire templates for due diligence',
        type: 'Guide',
        icon: <Award className="h-6 w-6" />,
        link: '/help/compliance/nist-800-161',
        download: false,
      },
    ],
    templates: [
      {
        title: 'NIST SP 800-161 Questionnaire Template',
        description: 'Ready-to-use questionnaire template aligned with NIST SP 800-161 for due diligence',
        type: 'Template',
        link: '/templates/nist-800-161',
      },
      {
        title: 'CMMC Level 2 Questionnaire Template',
        description: 'CMMC 2.0 Level 2 compliance questionnaire template for sending to vendors',
        type: 'Template',
        link: '/templates/cmmc-level-2',
      },
      {
        title: 'SOC 2 Type II Questionnaire Template',
        description: 'SOC 2 Type II control questionnaire template for vendor due diligence',
        type: 'Template',
        link: '/templates/soc2-type-ii',
      },
      {
        title: 'ISO 27001 Questionnaire Template',
        description: 'ISO 27001 information security questionnaire template for vendor assessments',
        type: 'Template',
        link: '/templates/iso-27001',
      },
    ],
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Resources & Learning Center
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Access guides, questionnaire templates, and best practices for sending security questionnaires to vendors for due diligence
          </p>
        </div>

        {/* Guides Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white flex items-center">
              <Book className="h-8 w-8 mr-3 text-blue-600 dark:text-blue-400" />
              Guides & Documentation
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.guides.map((guide, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="text-blue-600 dark:text-blue-400 mr-3">
                    {guide.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {guide.type}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {guide.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {guide.description}
                </p>
                <div className="flex items-center justify-between">
                  <Link
                    to={guide.link}
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                  >
                    Read More
                  </Link>
                  {guide.download && (
                    <Download className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Templates Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white flex items-center">
              <FileText className="h-8 w-8 mr-3 text-purple-600 dark:text-purple-400" />
              Assessment Templates
            </h2>
            <Link to="/templates">
              <Button variant="outline">View All Templates</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.templates.map((template, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <span className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-2 block">
                  {template.type}
                </span>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {template.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {template.description}
                </p>
                <Link
                  to={template.link}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                >
                  Use Template
                </Link>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <Card className="p-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Need More Help?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Our team is here to help you succeed
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/help">
              <Button variant="secondary" size="lg">
                Visit Help Center
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                Contact Support
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default ResourcesPage;

