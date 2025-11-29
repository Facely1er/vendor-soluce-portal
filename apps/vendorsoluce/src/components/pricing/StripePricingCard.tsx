// Enhanced Stripe Pricing Card Component
// File: src/components/pricing/StripePricingCard.tsx

import React, { useState } from 'react';
import { Check, Loader2, Plus, Minus, Crown, Shield, Users, Building } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { StripeProduct } from '../../lib/stripeProducts';
import { useAuth } from '../../context/AuthContext';
import { logger } from '../../utils/logger';
// import { StripeService } from '../../services/stripeService';

interface StripePricingCardProps {
  product: StripeProduct;
  isAnnual?: boolean;
  showAddons?: boolean;
  onSubscribe?: (productId: string) => void;
}

export const StripePricingCard: React.FC<StripePricingCardProps> = ({
  product,
  showAddons = false,
  onSubscribe
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState<Record<string, number>>({});
  const { user } = useAuth();
  // const stripeService = new StripeService();

  // Debug logging
  logger.log('StripePricingCard rendered with product:', {
    id: product.id,
    name: product.name,
    price: product.price,
    billingModel: product.billingModel,
    productType: product.productType
  });

  const getProductIcon = (productType: string) => {
    switch (productType) {
      case 'main': return <Shield className="h-6 w-6" />;
      case 'addon': return <Plus className="h-6 w-6" />;
      case 'bundle': return <Building className="h-6 w-6" />;
      default: return <Users className="h-6 w-6" />;
    }
  };

  const getBillingBadge = () => {
    if (product.billingModel === 'annual') {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700">
          <Crown className="h-3 w-3 mr-1" />
          Save 20%
        </Badge>
      );
    }
    return (
      <Badge className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700">
        Monthly
      </Badge>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price / 100);
  };

  const getMonthlyEquivalent = () => {
    if (product.billingModel === 'annual') {
      return formatPrice(product.price / 12);
    }
    return formatPrice(product.price);
  };

  const handleSubscribe = async () => {
    if (!user) {
      window.location.href = '/signin?redirect=/pricing';
      return;
    }

    setIsLoading(true);
    
    try {
      if (onSubscribe) {
        onSubscribe(product.id);
        return;
      }

      // Extract plan name from product ID (e.g., 'starter-monthly' -> 'starter')
      const planMatch = product.id.match(/^(starter|professional|enterprise|federal)/);
      const plan = planMatch ? planMatch[1] : 'professional';
      
      // Redirect to checkout page
      window.location.href = `/checkout?plan=${plan}`;
    } catch (error) {
      logger.error('Error redirecting to checkout:', error);
      alert('Error redirecting to checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateAddonQuantity = (addonId: string, change: number) => {
    setSelectedAddons(prev => ({
      ...prev,
      [addonId]: Math.max(0, (prev[addonId] || 0) + change)
    }));
  };

  const calculateTotalPrice = () => {
    let total = product.price;
    
    Object.entries(selectedAddons).forEach(([, quantity]) => {
      if (quantity > 0) {
        // In a real implementation, you'd fetch the addon price
        total += quantity * 1000; // Placeholder: $10 per addon
      }
    });
    
    return total;
  };

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 hover:shadow-xl">

      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
              {getProductIcon(product.productType)}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white ml-3">
              {product.name}
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            {product.description}
          </p>
          <div className="flex items-center justify-center space-x-2 mb-4">
            {getBillingBadge()}
            {product.billingModel === 'annual' && (
              <Badge className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                {getMonthlyEquivalent()}/month
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="text-center mb-6">
          {product.price === 0 ? (
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
              Custom
            </div>
          ) : (
            <>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                {formatPrice(product.price)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {product.billingModel === 'annual' ? 'per year' : 'per month'}
              </div>
              {product.billingModel === 'annual' && product.price > 0 && (
                <div className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">
                  Save {formatPrice(product.price * 0.2)} annually
                </div>
              )}
            </>
          )}
        </div>

        {/* Features */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Features:</h4>
          <ul className="space-y-2">
            {product.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Limits */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Limits:</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div className="flex flex-col">
              <span className="text-gray-600 dark:text-gray-400 mb-1">Users:</span>
              <span className="font-medium text-gray-900 dark:text-white break-words">
                {product.limits.users === -1 ? 'Unlimited' : product.limits.users}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-600 dark:text-gray-400 mb-1">Vendors:</span>
              <span className="font-medium text-gray-900 dark:text-white break-words">
                {product.limits.vendors === -1 ? 'Unlimited' : product.limits.vendors}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-600 dark:text-gray-400 mb-1">Assessments:</span>
              <span className="font-medium text-gray-900 dark:text-white break-words">
                {product.limits.assessments === -1 ? 'Unlimited' : product.limits.assessments}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-600 dark:text-gray-400 mb-1">Storage:</span>
              <span className="font-medium text-gray-900 dark:text-white break-words">{product.limits.storage}</span>
            </div>
          </div>
        </div>

        {/* Compliance Frameworks */}
        {product.complianceFrameworks.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Compliance:</h4>
            <div className="flex flex-wrap gap-1">
              {product.complianceFrameworks.map((framework) => (
                <Badge key={framework} className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300 text-xs">
                  {framework}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Add-ons Section */}
        {showAddons && product.productType === 'main' && (
          <div className="mb-6 p-4 border rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Add-ons:</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Additional Users</span>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateAddonQuantity('additional-users', -1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-sm font-medium w-8 text-center">
                    {selectedAddons['additional-users'] || 0}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateAddonQuantity('additional-users', 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Additional Vendors</span>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateAddonQuantity('additional-vendors', -1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-sm font-medium w-8 text-center">
                    {selectedAddons['additional-vendors'] || 0}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateAddonQuantity('additional-vendors', 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
            {Object.values(selectedAddons).some(qty => qty > 0) && (
              <div className="mt-3 pt-3 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-medium">{formatPrice(calculateTotalPrice())}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CTA Button */}
        <Button
          onClick={handleSubscribe}
          disabled={isLoading}
          className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              {(() => {
                if (product.price === 0) {
                  // Custom pricing plans (e.g., Federal/Government)
                  return 'Schedule Consultation';
                }
                if (product.productType === 'main') {
                  // Extract plan name from product name (e.g., "Starter Monthly" -> "Get Starter")
                  const planMatch = product.name.match(/^(Starter|Professional|Enterprise|Federal)/i);
                  if (planMatch) {
                    return `Get ${planMatch[1]}`;
                  }
                  return 'Start Free Trial';
                }
                return 'Get Started';
              })()}
              {product.billingModel === 'annual' && product.price > 0 && (
                <Crown className="h-4 w-4 ml-2" />
              )}
            </>
          )}
        </Button>

        {/* Trial Badge for Main Products */}
        {product.price > 0 && product.productType === 'main' && (
          <div className="mt-3 text-center">
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 text-xs">
              <Check className="h-3 w-3 mr-1" />
              14-Day Free Trial • No Credit Card Required
            </Badge>
          </div>
        )}

        {/* White Label Badge */}
        {product.whiteLabel && (
          <div className="mt-3 text-center">
            <Badge className="bg-orange-100 text-orange-800 text-xs">
              White-Label Available
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};

export default StripePricingCard;
