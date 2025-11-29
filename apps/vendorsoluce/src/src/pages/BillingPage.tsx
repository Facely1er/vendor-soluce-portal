import React from 'react';
import { CreditCard, Package, TrendingUp, FileText } from 'lucide-react';
import { SubscriptionManager } from '../components/billing/SubscriptionManager';
import { InvoiceList } from '../components/billing/InvoiceList';
import { UsageIndicator } from '../components/billing/FeatureGate';
import { useSubscription } from '../hooks/useSubscription';
import { PRODUCTS } from '../config/stripe';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

const BillingPage: React.FC = () => {
  const { tier, loading } = useSubscription();
  const product = PRODUCTS[tier as keyof typeof PRODUCTS];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vendorsoluce-green"></div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Billing & Subscription
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your subscription, billing details, and usage
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main subscription section */}
        <div className="lg:col-span-2 space-y-6">
          <SubscriptionManager />
          <InvoiceList />
        </div>

        {/* Sidebar with quick actions and info */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tier !== 'enterprise' && (
                <Link to="/pricing" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Upgrade Plan
                  </Button>
                </Link>
              )}
              <Link to="/billing#invoices" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  View Invoices
                </Button>
              </Link>
              <Link to="/support" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Payment Support
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Feature Usage Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Feature Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">SBOM Scans</span>
                    <UsageIndicator feature="sbom_scans" />
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-vendorsoluce-green h-2 rounded-full"
                      style={{ width: '30%' }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Vendors</span>
                    <UsageIndicator feature="vendors" />
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-vendorsoluce-green h-2 rounded-full"
                      style={{ width: '20%' }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Assessments</span>
                    <UsageIndicator feature="assessments" />
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-vendorsoluce-green h-2 rounded-full"
                      style={{ width: '50%' }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">API Calls</span>
                    <UsageIndicator feature="api_calls" />
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-vendorsoluce-green h-2 rounded-full"
                      style={{ width: '0%' }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link to="/account/usage" className="text-sm text-vendorsoluce-green hover:text-vendorsoluce-dark-green">
                  View detailed usage →
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Plan Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Your {product.name} Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {product.features.slice(0, 5).map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg 
                      className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                  </li>
                ))}
              </ul>
              {product.features.length > 5 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                  + {product.features.length - 5} more features
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;