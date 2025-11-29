// Enhanced Pricing Page with Complete Stripe Integration
// File: src/pages/Pricing.tsx

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Crown, Calculator, Shield, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Link } from 'react-router-dom';
import { StripePricingCard } from '../components/pricing/StripePricingCard';
import { 
  getMainProducts, 
  getAddonProducts, 
  getBundleProducts,
  MONTHLY_PRODUCTS,
  ANNUAL_PRODUCTS
} from '../lib/stripeProducts';
import { useAuth } from '../context/AuthContext';

const Pricing: React.FC = () => {
  const { t: _t } = useTranslation();
  const [isAnnual, setIsAnnual] = useState(false);
  const [showAddons, setShowAddons] = useState(false);
  const { user } = useAuth();

  const billingInterval = isAnnual ? 'annual' : 'monthly';
  const mainProducts = getMainProducts(billingInterval);
  const addonProducts = getAddonProducts(billingInterval);
  const bundleProducts = getBundleProducts(billingInterval);



  // Calculate annual savings dynamically
  const calculateAnnualSavings = (productName: string): number => {
    const monthlyProduct = MONTHLY_PRODUCTS.find(p => 
      p.name.toLowerCase().includes(productName.toLowerCase())
    );
    const annualProduct = ANNUAL_PRODUCTS.find(p => 
      p.name.toLowerCase().includes(productName.toLowerCase())
    );
    
    if (!monthlyProduct || !annualProduct) return 0;
    
    const monthlyTotal = monthlyProduct.price * 12;
    const savings = monthlyTotal - annualProduct.price;
    return Math.round(savings / 100); // Convert cents to dollars
  };

  const formatCurrency = (cents: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(cents / 100);
  };

  // Get product data for comparison table
  const getProductData = (tier: 'starter' | 'professional' | 'enterprise' | 'federal') => {
    const product = MONTHLY_PRODUCTS.find(p => 
      p.name.toLowerCase().includes(tier.toLowerCase())
    );
    return product;
  };

  const starterProduct = getProductData('starter');
  const professionalProduct = getProductData('professional');
  const enterpriseProduct = getProductData('enterprise');
  const federalProduct = getProductData('federal');

  // Helper to format limits
  const formatLimit = (value: number | string): string => {
    if (typeof value === 'string') return value;
    if (value === -1) return 'Unlimited';
    return value.toString();
  };

  // Helper to check if framework is included
  const hasFramework = (product: typeof starterProduct, framework: string): boolean => {
    if (!product) return false;
    return product.complianceFrameworks.some(f => 
      f.toLowerCase().includes(framework.toLowerCase())
    );
  };

  // Helper to render table cell content
  const renderTableCell = (value: string) => {
    if (value === '✓') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
          {value}
        </span>
      );
    }
    if (value === '✗') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
          {value}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
        {value}
      </span>
    );
  };

  const handleSubscribe = async (productId: string) => {
    if (!user) {
      window.location.href = '/signin?redirect=/checkout';
      return;
    }

    // Extract plan name from product ID (e.g., 'starter-monthly' -> 'starter')
    const planMatch = productId.match(/^(starter|professional|enterprise|federal)/);
    const plan = planMatch ? planMatch[1] : 'professional';
    
    // Navigate to checkout page to review policies first
    window.location.href = `/checkout?plan=${plan}`;
  };

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
          <Shield className="h-4 w-4 mr-2" />
          Enterprise-grade security and compliance
        </div>
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Choose Your Compliance Solution
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
          Streamline vendor risk management with our comprehensive compliance platform. 
          Get started with a 14-day free trial - no credit card required.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            aria-label={isAnnual ? 'Switch to monthly billing' : 'Switch to annual billing'}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isAnnual ? 'bg-green-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isAnnual ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
            Annual
          </span>
          {isAnnual && (
            <Badge className="bg-green-100 text-green-800">
              <Crown className="h-3 w-3 mr-1" />
              Save 20%
            </Badge>
          )}
        </div>

        {/* Savings Calculator */}
        {isAnnual && (
          <Card className="max-w-2xl mx-auto mb-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400 mb-4">
                <Calculator className="h-6 w-6" />
                <span className="font-semibold text-lg">Annual Savings Calculator</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(calculateAnnualSavings('starter') * 100)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Starter Annual Savings</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(calculateAnnualSavings('professional') * 100)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Professional Annual Savings</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(calculateAnnualSavings('enterprise') * 100)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Enterprise Annual Savings</div>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
                Switch to annual billing and save up to 20% on all plans
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Value Proposition */}
      <div className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Enterprise Security</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Built with enterprise-grade security measures and encryption standards
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Easy Setup</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get started in minutes with our intuitive interface and guided onboarding
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Value Pricing</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Save up to 20% with annual billing and access more features
            </p>
          </div>
        </div>
      </div>

      {/* Main Products */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Choose Your Plan
        </h2>
        {mainProducts.length === 0 ? (
          <div className="text-center text-red-500">
            <p>No products found for {billingInterval} billing</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mainProducts.map((product) => (
              <StripePricingCard
                key={product.id}
                product={product}
                isAnnual={isAnnual}
                showAddons={showAddons}
                onSubscribe={handleSubscribe}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add-ons Section */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Add-on Services
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Enhance your plan with additional features
          </p>
          <Button
            variant="outline"
            onClick={() => setShowAddons(!showAddons)}
            className="mb-4"
          >
            {showAddons ? 'Hide' : 'Show'} Add-ons
          </Button>
        </div>
        
        {showAddons && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addonProducts.map((product) => (
              <StripePricingCard
                key={product.id}
                product={product}
                isAnnual={isAnnual}
                onSubscribe={handleSubscribe}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bundle Deals */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Bundle Deals
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Complete compliance packages with multiple frameworks
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {bundleProducts.map((product) => (
            <StripePricingCard
              key={product.id}
              product={product}
              isAnnual={isAnnual}
              onSubscribe={handleSubscribe}
            />
          ))}
        </div>
      </div>

      {/* Premium Features - External Projects */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Premium Features
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Advanced solutions available as premium add-ons
          </p>
        </div>
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <Crown className="h-12 w-12 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Vendor Security Assessments
                  </h3>
                  <Badge variant="default" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    Premium
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                    VendorTal
                  </Badge>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  <strong>VendorTal</strong> is our premium external project offering comprehensive vendor security assessment capabilities. 
                  Send CMMC and NIST Privacy Framework assessments to your vendors through a secure portal. 
                  Track progress, collect evidence, and automate compliance scoring.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">CMMC Assessments</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Pre-built CMMC Level 1 & 2 assessment templates with automated scoring
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Vendor Portal</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Secure assessment portal for vendors to complete questionnaires and upload evidence
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Analytics & Reporting</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Advanced analytics and executive reporting for vendor compliance status
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Link to="/vendor-assessments">
                    <Button variant="primary" className="bg-purple-600 hover:bg-purple-700 text-white">
                      Learn More
                    </Button>
                  </Link>
                  <Link to="/checkout?plan=professional">
                    <Button variant="outline">
                      Get Professional
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Comparison */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Features Comparison
        </h2>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Features
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                      Starter
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                      Professional
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                      Enterprise
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                      Federal
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {[
                    { 
                      feature: 'Team Members', 
                      starter: formatLimit(starterProduct?.limits.users || 0), 
                      professional: formatLimit(professionalProduct?.limits.users || 0), 
                      enterprise: formatLimit(enterpriseProduct?.limits.users || 0), 
                      federal: formatLimit(federalProduct?.limits.users || 0) 
                    },
                    { 
                      feature: 'Vendor Assessments', 
                      starter: formatLimit(starterProduct?.limits.vendors || 0), 
                      professional: formatLimit(professionalProduct?.limits.vendors || 0), 
                      enterprise: formatLimit(enterpriseProduct?.limits.vendors || 0), 
                      federal: formatLimit(federalProduct?.limits.vendors || 0) 
                    },
                    { 
                      feature: 'Storage', 
                      starter: starterProduct?.limits.storage || 'N/A', 
                      professional: professionalProduct?.limits.storage || 'N/A', 
                      enterprise: enterpriseProduct?.limits.storage || 'N/A', 
                      federal: federalProduct?.limits.storage || 'N/A' 
                    },
                    { 
                      feature: 'NIST SP 800-161', 
                      starter: hasFramework(starterProduct, 'NIST') ? '✓' : '✗', 
                      professional: hasFramework(professionalProduct, 'NIST') ? '✓' : '✗', 
                      enterprise: hasFramework(enterpriseProduct, 'NIST') ? '✓' : '✗', 
                      federal: hasFramework(federalProduct, 'NIST') ? '✓' : '✗' 
                    },
                    { 
                      feature: 'CMMC 2.0', 
                      starter: hasFramework(starterProduct, 'CMMC') ? '✓' : '✗', 
                      professional: hasFramework(professionalProduct, 'CMMC') ? '✓' : '✗', 
                      enterprise: hasFramework(enterpriseProduct, 'CMMC') ? '✓' : '✗', 
                      federal: hasFramework(federalProduct, 'CMMC') ? '✓' : '✗' 
                    },
                    { 
                      feature: 'SOC2 Support', 
                      starter: hasFramework(starterProduct, 'SOC2') ? '✓' : '✗', 
                      professional: hasFramework(professionalProduct, 'SOC2') ? '✓' : '✗', 
                      enterprise: hasFramework(enterpriseProduct, 'SOC2') ? '✓' : '✗', 
                      federal: hasFramework(federalProduct, 'SOC2') ? '✓' : '✗' 
                    },
                    { 
                      feature: 'ISO 27001 Support', 
                      starter: hasFramework(starterProduct, 'ISO27001') ? '✓' : '✗', 
                      professional: hasFramework(professionalProduct, 'ISO27001') ? '✓' : '✗', 
                      enterprise: hasFramework(enterpriseProduct, 'ISO27001') ? '✓' : '✗', 
                      federal: hasFramework(federalProduct, 'ISO27001') ? '✓' : '✗' 
                    },
                    { 
                      feature: 'FedRAMP Support', 
                      starter: hasFramework(starterProduct, 'FEDRAMP') ? '✓' : '✗', 
                      professional: hasFramework(professionalProduct, 'FEDRAMP') ? '✓' : '✗', 
                      enterprise: hasFramework(enterpriseProduct, 'FEDRAMP') ? '✓' : '✗', 
                      federal: hasFramework(federalProduct, 'FEDRAMP') ? '✓' : '✗' 
                    },
                    { 
                      feature: 'FISMA Support', 
                      starter: hasFramework(starterProduct, 'FISMA') ? '✓' : '✗', 
                      professional: hasFramework(professionalProduct, 'FISMA') ? '✓' : '✗', 
                      enterprise: hasFramework(enterpriseProduct, 'FISMA') ? '✓' : '✗', 
                      federal: hasFramework(federalProduct, 'FISMA') ? '✓' : '✗' 
                    },
                    { 
                      feature: 'API Access', 
                      starter: starterProduct?.features.some(f => f.toLowerCase().includes('api')) ? '✓' : '✗', 
                      professional: professionalProduct?.features.some(f => f.toLowerCase().includes('api')) ? '✓' : '✗', 
                      enterprise: enterpriseProduct?.features.some(f => f.toLowerCase().includes('api')) ? '✓' : '✗', 
                      federal: federalProduct?.features.some(f => f.toLowerCase().includes('api')) ? '✓' : '✗' 
                    },
                    { 
                      feature: 'White-Label', 
                      starter: starterProduct?.whiteLabel ? '✓' : '✗', 
                      professional: professionalProduct?.whiteLabel ? '✓' : '✗', 
                      enterprise: enterpriseProduct?.whiteLabel ? '✓' : '✗', 
                      federal: federalProduct?.whiteLabel ? '✓' : '✗' 
                    },
                    { 
                      feature: 'SSO/SAML', 
                      starter: starterProduct?.features.some(f => f.toLowerCase().includes('sso') || f.toLowerCase().includes('saml')) ? '✓' : '✗', 
                      professional: professionalProduct?.features.some(f => f.toLowerCase().includes('sso') || f.toLowerCase().includes('saml')) ? '✓' : '✗', 
                      enterprise: enterpriseProduct?.features.some(f => f.toLowerCase().includes('sso') || f.toLowerCase().includes('saml')) ? '✓' : '✗', 
                      federal: federalProduct?.features.some(f => f.toLowerCase().includes('sso') || f.toLowerCase().includes('saml')) ? '✓' : '✗' 
                    },
                    { 
                      feature: 'Custom Integrations', 
                      starter: starterProduct?.features.some(f => f.toLowerCase().includes('integration')) ? '✓' : '✗', 
                      professional: professionalProduct?.features.some(f => f.toLowerCase().includes('integration')) ? '✓' : '✗', 
                      enterprise: enterpriseProduct?.features.some(f => f.toLowerCase().includes('integration')) ? '✓' : '✗', 
                      federal: federalProduct?.features.some(f => f.toLowerCase().includes('integration')) ? '✓' : '✗' 
                    },
                    { 
                      feature: 'Dedicated Support', 
                      starter: starterProduct?.features.some(f => f.toLowerCase().includes('dedicated') || f.toLowerCase().includes('account manager')) ? '✓' : '✗', 
                      professional: professionalProduct?.features.some(f => f.toLowerCase().includes('dedicated') || f.toLowerCase().includes('account manager')) ? '✓' : '✗', 
                      enterprise: enterpriseProduct?.features.some(f => f.toLowerCase().includes('dedicated') || f.toLowerCase().includes('account manager')) ? '✓' : '✗', 
                      federal: federalProduct?.features.some(f => f.toLowerCase().includes('dedicated') || f.toLowerCase().includes('account manager')) ? '✓' : '✗' 
                    },
                    { 
                      feature: 'SLA Support', 
                      starter: starterProduct?.features.some(f => f.toLowerCase().includes('sla')) ? '✓' : '✗', 
                      professional: professionalProduct?.features.some(f => f.toLowerCase().includes('sla')) ? '✓' : '✗', 
                      enterprise: enterpriseProduct?.features.some(f => f.toLowerCase().includes('sla')) ? '✓' : '✗', 
                      federal: federalProduct?.features.some(f => f.toLowerCase().includes('sla')) ? '✓' : '✗' 
                    }
                  ].map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {row.feature}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900 dark:text-white">
                        {renderTableCell(row.starter)}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900 dark:text-white">
                        {renderTableCell(row.professional)}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900 dark:text-white">
                        {renderTableCell(row.enterprise)}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900 dark:text-white">
                        {renderTableCell(row.federal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">What's included in each plan?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Each plan includes vendor assessment tools, compliance frameworks, 
                risk scoring, and reporting. Higher tiers include more users, 
                vendors, storage, and advanced features like API access and white-labeling.
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Can I change plans later?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Yes! You can upgrade or downgrade your plan at any time. 
                Changes are prorated, so you only pay the difference for the 
                remaining billing period.
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">What compliance frameworks are supported?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                We support NIST SP 800-161, CMMC 2.0, SOC2 Type II, ISO 27001, FedRAMP, 
                and FISMA. Different plans include different frameworks - 
                check the features comparison above.
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Is there a free trial?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Yes! All plans come with a 14-day free trial with full Professional tier access. No credit card 
                required to start. You can cancel anytime during the trial period.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                <strong>Trial includes:</strong> Supply Chain Risk Assessment (NIST SP 800-161), SBOM Analysis, 
                Vendor Risk Monitoring, Risk Scoring, and Compliance Tracking.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Can I try before I buy?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Yes! All plans come with a 14-day free trial with full Professional tier access. No credit card 
                required to start. You can explore all features, run assessments, and analyze SBOM files during your trial.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                <strong>Trial includes:</strong> Full dashboard access, Supply Chain Risk Assessment, SBOM Analysis, 
                Vendor Risk Monitoring, and all Professional tier features. Start your 14-day free trial today.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">How does annual billing work?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Annual billing offers a 20% discount compared to monthly billing. 
                You'll be charged once per year and can cancel anytime. 
                Changes to your plan are prorated.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Do you offer custom pricing?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Yes! For large organizations with specific needs, we offer custom 
                pricing and enterprise solutions. Contact our sales team to discuss 
                your requirements.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">What support do you provide?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Starter plans include email support. Professional plans get priority 
                support. Enterprise and Federal plans include 24/7 dedicated support 
                and account managers.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Is my data secure?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                We implement enterprise-grade security measures including encryption at rest and in transit, 
                regular security audits, and access controls. Our platform is designed to support 
                various compliance frameworks including SOC2 and FedRAMP requirements.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">What about Vendor Risk Assessments?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Vendor Risk Assessments and Due Diligence Portal features are available through <strong>VendorTal</strong>, 
                our separate assessment platform. VendorRiskRadar focuses on supply chain risk assessment, SBOM analysis, 
                and vendor risk monitoring. Contact sales to learn about VendorTal integration options.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Transform Your Compliance?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Join organizations worldwide using our platform to streamline vendor risk management 
            and achieve compliance more efficiently.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/checkout?plan=professional">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                Get Professional
              </Button>
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Check className="h-4 w-4 mr-2 text-green-500" />
              No credit card required
            </div>
            <div className="flex items-center">
              <Check className="h-4 w-4 mr-2 text-green-500" />
              14-day free trial
            </div>
            <div className="flex items-center">
              <Check className="h-4 w-4 mr-2 text-green-500" />
              Cancel anytime
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Pricing;
