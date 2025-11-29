import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { PRODUCTS } from '../../config/stripe';
import { logger } from '../../utils/logger';

interface CheckoutButtonProps {
  plan: keyof typeof PRODUCTS;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  children?: React.ReactNode;
}

export const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  plan,
  className = '',
  variant = 'primary',
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const product = PRODUCTS[plan];

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError(null);

      // Navigate to checkout page to review policies first
      navigate(`/checkout?plan=${plan}`);
    } catch (err: unknown) {
      logger.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Failed to start checkout process');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <Button
        variant={variant}
        className={`w-full ${className}`}
        onClick={handleCheckout}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            {children || (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                {plan === 'free' ? 'Get Started' : `Subscribe - $${product.price}/month`}
              </>
            )}
          </>
        )}
      </Button>
    </div>
  );
};