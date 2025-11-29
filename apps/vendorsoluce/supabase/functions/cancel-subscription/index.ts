// Cancel Subscription Edge Function
// Handles subscription cancellation and sends confirmation email
// File: supabase/functions/cancel-subscription/index.ts

declare const Deno: {
  serve: (handler: (req: Request) => Promise<Response>) => void;
  env: {
    get: (key: string) => string | undefined;
  };
};

// @ts-expect-error - Deno imports are resolved at runtime
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
// @ts-expect-error - Deno imports are resolved at runtime
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// @ts-expect-error - Deno imports are resolved at runtime
import Stripe from 'https://esm.sh/stripe@13.10.0?target=deno';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const stripe = new Stripe(
  Deno.env.get('STRIPE_SECRET_KEY')!,
  { apiVersion: '2023-10-16' }
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { subscriptionId, userId } = await req.json();

    if (!subscriptionId || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: subscriptionId, userId' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get subscription details before cancellation
    const { data: subscription, error: subError } = await supabase
      .from('vs_subscriptions')
      .select('*')
      .eq('stripe_subscription_id', subscriptionId)
      .eq('user_id', userId)
      .single();

    if (subError || !subscription) {
      return new Response(
        JSON.stringify({ error: 'Subscription not found' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404 
        }
      );
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('vs_profiles')
      .select('email, full_name')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      console.error('Error fetching user profile:', profileError);
      // Continue without email - cancellation should still work
    }

    // Cancel subscription in Stripe (at period end)
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    // Calculate grace period dates
    // Policy: 30 days for paid accounts, 7 days for free trials
    const cancellationDate = new Date(subscription.current_period_end);
    const gracePeriodStart = cancellationDate;
    const gracePeriodEnd = new Date(cancellationDate);
    
    // Determine grace period based on subscription type
    const isTrial = subscription.status === 'trialing' || subscription.tier === 'free';
    const gracePeriodDays = isTrial ? 7 : 30;
    gracePeriodEnd.setDate(gracePeriodEnd.getDate() + gracePeriodDays);

    // Update subscription in database with grace period tracking
    const { error: updateError } = await supabase
      .from('vs_subscriptions')
      .update({
        cancel_at_period_end: true,
        cancel_at: subscription.current_period_end,
        grace_period_start: gracePeriodStart.toISOString(),
        grace_period_end: gracePeriodEnd.toISOString(),
        is_read_only: false, // Will be set to true when cancellation takes effect
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscriptionId);

    if (updateError) {
      console.error('Error updating subscription:', updateError);
      throw updateError;
    }

    // Send cancellation confirmation email
    const userEmail = profile?.email;
    const userName = profile?.full_name || 'there';

    if (userEmail) {
      const baseUrl = Deno.env.get('SITE_URL') || Deno.env.get('APP_URL') || 'https://vendorsoluce.com';
      const cancellationDate = new Date(subscription.current_period_end);
      const cancellationDateStr = cancellationDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      // Calculate grace period end date
      const isTrial = subscription.status === 'trialing' || subscription.tier === 'free';
      const gracePeriodDays = isTrial ? 7 : 30;
      const gracePeriodEnd = new Date(cancellationDate);
      gracePeriodEnd.setDate(gracePeriodEnd.getDate() + gracePeriodDays);
      const gracePeriodEndStr = gracePeriodEnd.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Subscription Cancellation Confirmed</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Hi ${userName},</p>
            <p>We've received your request to cancel your VendorSoluce subscription. Your subscription has been cancelled and will not renew.</p>
            <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #6b7280;">
              <h3 style="margin-top: 0;">Cancellation Details</h3>
              <p style="margin: 5px 0;"><strong>Cancellation Effective Date:</strong> ${cancellationDateStr}</p>
              <p style="margin: 5px 0;"><strong>Last Day of Access:</strong> ${cancellationDateStr}</p>
              <p style="margin: 5px 0;"><strong>Plan:</strong> ${subscription.tier || 'Current Plan'}</p>
            </div>
            <p><strong>What happens next?</strong></p>
            <ul style="line-height: 1.8;">
              <li>You will retain full access to your account until <strong>${cancellationDateStr}</strong></li>
              <li>No charges will be processed after the cancellation date</li>
              <li>You have a <strong>${gracePeriodDays}-day grace period</strong> (until ${gracePeriodEndStr}) to export your data</li>
              <li>After the grace period, your data will be permanently deleted</li>
              <li>During the grace period, your account will be in read-only mode (you can view and export data, but cannot make changes)</li>
            </ul>
            <div style="background: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <p style="margin: 0;"><strong>Important:</strong> Export your data before ${gracePeriodEndStr} to avoid data loss. You can export your data in JSON, CSV, or PDF format from your account settings.</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${baseUrl}/billing" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 5px;">Export My Data</a>
              <a href="${baseUrl}/pricing" style="background: #6b7280; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 5px;">Reactivate Subscription</a>
            </div>
            <p>If you change your mind, you can reactivate your subscription anytime before ${cancellationDateStr} from your billing settings.</p>
            <p>We're sorry to see you go. If you have feedback about your experience, we'd love to hear from you at <a href="mailto:contact@ermits.com">contact@ermits.com</a>.</p>
            <p>Questions? <a href="${baseUrl}/contact">Contact our support team</a> - we're here to help!</p>
            <p>Best regards,<br>The VendorSoluce Team</p>
          </div>
        </body>
        </html>
      `;

      // Send email notification
      const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-email-notification`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: userEmail,
          subject: 'Subscription Cancellation Confirmed - VendorSoluce',
          html: emailHtml,
          type: 'cancellation_confirmation'
        }),
      });

      if (!emailResponse.ok) {
        const error = await emailResponse.text();
        console.error('Error sending cancellation confirmation email:', error);
        // Don't throw - email failures shouldn't break cancellation
      } else {
        console.log('Cancellation confirmation email sent successfully');
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Subscription cancelled successfully',
        cancellationDate: subscription.current_period_end
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in cancel-subscription:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

