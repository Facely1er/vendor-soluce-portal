// @ts-expect-error - Deno global is available in Supabase Edge Functions
declare const Deno: {
  serve: (handler: (req: Request) => Promise<Response>) => void;
  env: {
    get: (key: string) => string | undefined;
  };
};

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@13.10.0?target=deno';

const stripe = new Stripe(
  // @ts-expect-error - Deno global is available in Supabase Edge Functions
  Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    
    // Create Supabase client
    const supabaseClient = createClient(
      // @ts-expect-error - Deno global is available in Supabase Edge Functions
      Deno.env.get('SUPABASE_URL') ?? '',
      // @ts-expect-error - Deno global is available in Supabase Edge Functions
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    const { priceId, customerEmail, userId, plan, metadata } = requestBody;

    // Validate required fields
    if (!priceId || !customerEmail || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if customer exists in Stripe
    let customer;
    const { data: customerData } = await supabaseClient
      .from('vs_customers')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    if (customerData?.stripe_customer_id) {
      // Retrieve existing customer
      customer = await stripe.customers.retrieve(customerData.stripe_customer_id);
    } else {
      // Create new customer
      customer = await stripe.customers.create({
        email: customerEmail,
        metadata: {
          userId,
          plan,
        },
      });

      // Save customer ID to database
      await supabaseClient
        .from('vs_customers')
        .insert({
          user_id: userId,
          stripe_customer_id: customer.id,
          email: customerEmail,
        });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${Deno.env.get('APP_URL')}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${Deno.env.get('APP_URL')}/pricing`,
      subscription_data: {
        trial_period_days: plan === 'free' ? 0 : 14,
        metadata: {
          userId,
          plan,
          ...metadata,
        },
      },
      metadata: {
        userId,
        plan,
        ...metadata,
      },
    });

    return new Response(
      JSON.stringify({ 
        sessionId: session.id,
        url: session.url,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Checkout session error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to create checkout session',
        details: error.message,
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});