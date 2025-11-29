import { logger } from '../../utils/logger';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { getStripe } from '../../lib/stripe';
import { supabase } from '../../lib/supabase';
import { PRODUCTS } from '../../config/stripe';

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
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const product = PRODUCTS[plan];

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is authenticated
      if (!user) {
        navigate('/signin', { state: { from: '/pricing', plan } });
        return;
      }

      // Don't process checkout for free tier
      if (plan === 'free') {
        // Just update the user's subscription tier to free
        const { error: updateError } = await supabase
          .from('vs_profiles')
          .update({ subscription_tier: 'free' })
          .eq('id', user.id);

        if (updateError) throw updateError;
        
        navigate('/dashboard');
        return;
      }

      // Check if price ID is configured
      if (!product.priceId) {
        throw new Error('Product price not configured. Please contact support.');
      }

      // Call Supabase Edge Function to create Stripe checkout session
      const { data, error: sessionError } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          priceId: product.priceId,
          customerEmail: user.email,
          userId: user.id,
          plan,
          metadata: {
            userId: user.id,
            plan,
            source: 'website',
          },
        },
      });

      if (sessionError) throw sessionError;
      
      if (!data?.sessionId) {
        throw new Error('Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Stripe not initialized');
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (stripeError) throw stripeError;

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