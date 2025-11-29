import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Book, FileText, MessageCircle, ChevronRight, Shield, Settings, BarChart } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

const HelpCenterPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    {
      id: 'assessments',
      name: 'Sending Questionnaires',
      icon: <FileText className="h-6 w-6" />,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      articles: [
        { title: 'How to Send a Security Questionnaire', path: '/help/assessments/create' },
        { title: 'Sending Questionnaires to Vendors', path: '/help/assessments/sending' },
        { title: 'Reviewing Vendor Responses', path: '/help/assessments/reviewing' },
        { title: 'Questionnaire Templates', path: '/help/assessments/templates' },
      ],
    },
    {
      id: 'getting-started',
      name: 'Getting Started',
      icon: <Book className="h-6 w-6" />,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      articles: [
        { title: 'Sending Your First Security Questionnaire', path: '/help/getting-started/first-assessment' },
        { title: 'Setting Up Your Account', path: '/help/getting-started/account-setup' },
        { title: 'Understanding Vendor Risk Scores', path: '/help/getting-started/risk-scores' },
        { title: 'Navigating the Dashboard', path: '/help/getting-started/dashboard' },
      ],
    },
    {
      id: 'compliance',
      name: 'Compliance',
      icon: <Shield className="h-6 w-6" />,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      articles: [
        { title: 'NIST SP 800-161 Compliance', path: '/help/compliance/nist-800-161' },
        { title: 'CMMC 2.0 Requirements', path: '/help/compliance/cmmc' },
        { title: 'SOC 2 Compliance', path: '/help/compliance/soc2' },
        { title: 'Generating Compliance Reports', path: '/help/compliance/reports' },
      ],
    },
    {
      id: 'billing',
      name: 'Billing & Subscription',
      icon: <BarChart className="h-6 w-6" />,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      articles: [
        { title: 'Managing Your Subscription', path: '/help/billing/subscription' },
        { title: 'Upgrading Your Plan', path: '/help/billing/upgrade' },
        { title: 'Understanding Usage Limits', path: '/help/billing/limits' },
        { title: 'Billing & Invoices', path: '/help/billing/invoices' },
      ],
    },
    {
      id: 'settings',
      name: 'Settings & Configuration',
      icon: <Settings className="h-6 w-6" />,
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-50 dark:bg-gray-800',
      articles: [
        { title: 'Account Settings', path: '/help/settings/account' },
        { title: 'Team Management', path: '/help/settings/team' },
        { title: 'API Configuration', path: '/help/settings/api' },
        { title: 'Integration Setup', path: '/help/settings/integrations' },
      ],
    },
  ];

  const popularArticles = [
    { title: 'How to Send a Security Questionnaire', category: 'Sending Questionnaires', path: '/help/assessments/create' },
    { title: 'Sending Questionnaires to Vendors', category: 'Sending Questionnaires', path: '/help/assessments/sending' },
    { title: 'Reviewing Vendor Responses for Due Diligence', category: 'Sending Questionnaires', path: '/help/assessments/reviewing' },
    { title: 'NIST SP 800-161 Compliance Guide', category: 'Compliance', path: '/help/compliance/nist-800-161' },
    { title: 'Upgrading Your Subscription', category: 'Billing', path: '/help/billing/upgrade' },
  ];

  const filteredCategories = selectedCategory
    ? categories.filter(cat => cat.id === selectedCategory)
    : categories;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Help Center
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Find answers to common questions about sending security questionnaires to vendors for due diligence
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg"
              />
            </div>
          </div>
        </div>

        {/* Popular Articles */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Popular Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularArticles.map((article, index) => (
              <Link key={index} to={article.path}>
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {article.category}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 ml-2" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredCategories.map((category) => (
            <Card key={category.id} className="p-6">
              <div className={`${category.bgColor} ${category.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                {category.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {category.name}
              </h3>
              <ul className="space-y-2">
                {category.articles.map((article, index) => (
                  <li key={index}>
                    <Link
                      to={article.path}
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center group"
                    >
                      <span className="group-hover:underline">{article.title}</span>
                      <ChevronRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        {/* Contact Support */}
        <Card className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="text-center">
            <MessageCircle className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Still Need Help?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Our support team is here to help you
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="primary" size="lg">
                  Contact Support
                </Button>
              </Link>
              <Link to="/resources">
                <Button variant="outline" size="lg">
                  View Resources
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default HelpCenterPage;

