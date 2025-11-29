// Onboarding Completion Email Service
// Sends email when user completes onboarding
// File: supabase/functions/send-onboarding-complete-email/index.ts

// @ts-expect-error - Deno global is available in Supabase Edge Functions
declare const Deno: {
  serve: (handler: (req: Request) => Promise<Response>) => void;
  env: {
    get: (key: string) => string | undefined;
  };
};

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing userId' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('vs_profiles')
      .select('email, full_name, subscription_tier')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      throw new Error(`User not found: ${profileError?.message}`);
    }

    const baseUrl = Deno.env.get('SITE_URL') || 'https://vendorsoluce.com';
    const userName = profile.full_name || 'there';
    const isTrialing = profile.subscription_tier === 'professional' || profile.subscription_tier === 'trialing';

    // Send email via Resend
    const emailApiKey = Deno.env.get('RESEND_API_KEY') || Deno.env.get('EMAIL_API_KEY');

    if (!emailApiKey) {
      console.warn('Email API key not configured, skipping email send');
      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Email service not configured, notification logged only'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">🎉 You're All Set!</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
          <p>Hi ${userName},</p>
          <p>Congratulations! You've completed the onboarding process and are ready to start managing your vendor risk.</p>
          ${isTrialing ? `
            <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <p style="margin: 0;"><strong>Your 14-day free trial is active!</strong> You have full access to all Professional features.</p>
            </div>
          ` : ''}
          <h3 style="color: #10b981;">What's Next?</h3>
          <ul style="list-style: none; padding: 0;">
            <li style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
              <strong>1. Add Your First Vendor</strong><br>
              Create vendor risk profiles to track your suppliers
            </li>
            <li style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
              <strong>2. Run a Supply Chain Assessment</strong><br>
              Complete a NIST SP 800-161 compliance assessment
            </li>
            <li style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
              <strong>3. Analyze an SBOM</strong><br>
              Upload and analyze Software Bills of Materials
            </li>
            <li style="padding: 10px 0;">
              <strong>4. Explore Your Dashboard</strong><br>
              Review risk metrics and analytics
            </li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${baseUrl}/dashboard" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Go to Dashboard</a>
          </div>
          <p>Need help getting started? Check out our <a href="${baseUrl}/how-it-works">How It Works</a> guide or <a href="${baseUrl}/contact">contact support</a>.</p>
          <p>Best regards,<br>The VendorSoluce Team</p>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${emailApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: Deno.env.get('EMAIL_FROM') || 'VendorSoluce <noreply@vendorsoluce.com>',
        to: profile.email,
        subject: 'Welcome to VendorSoluce - You\'re All Set!',
        html: emailHtml,
      }),
    });

    if (!emailResponse.ok) {
      const error = await emailResponse.text();
      throw new Error(`Email service error: ${error}`);
    }

    const emailResult = await emailResponse.json();

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Onboarding completion email sent',
        emailId: emailResult.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in send-onboarding-complete-email:', error);
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

