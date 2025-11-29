// Trial Notification Email Service
// Sends email notifications for trial events (started, ending soon, expired)
// File: supabase/functions/send-trial-notification/index.ts

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

interface NotificationRequest {
  userId: string;
  email: string;
  name: string;
  type: 'started' | 'ending_soon' | 'expired';
  subscriptionId?: string;
  daysRemaining?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body: NotificationRequest = await req.json();
    const { userId, email, name, type, daysRemaining } = body;

    if (!email || !type) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email, type' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Get trial details if needed
    let trialEnd: string | null = null;
    if (userId) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      const { data: subscription } = await supabase
        .from('vs_subscriptions')
        .select('trial_end')
        .eq('user_id', userId)
        .eq('status', 'trialing')
        .single();

      trialEnd = subscription?.trial_end || null;
    }

    // Generate email content based on type
    const emailContent = generateEmailContent(type, name, daysRemaining, trialEnd);

    // Send email using Resend (or your email service)
    const emailService = Deno.env.get('EMAIL_SERVICE') || 'resend';
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

    // Send email via Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${emailApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: Deno.env.get('EMAIL_FROM') || 'VendorSoluce <noreply@vendorsoluce.com>',
        to: email,
        subject: emailContent.subject,
        html: emailContent.html,
      }),
    });

    if (!emailResponse.ok) {
      const error = await emailResponse.text();
      console.error('Error sending email:', error);
      throw new Error(`Email service error: ${error}`);
    }

    const emailResult = await emailResponse.json();
    console.log('Email sent successfully:', emailResult);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Trial notification sent',
        emailId: emailResult.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in send-trial-notification:', error);
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

function generateEmailContent(
  type: 'started' | 'ending_soon' | 'expired',
  name: string,
  daysRemaining?: number,
  trialEnd?: string | null
): { subject: string; html: string } {
  const userName = name || 'there';
  const baseUrl = Deno.env.get('SITE_URL') || 'https://vendorsoluce.com';

  switch (type) {
    case 'started':
      return {
        subject: 'Welcome to Your 14-Day Free Trial - VendorSoluce',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">Your Free Trial Has Started!</h1>
            </div>
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <p>Hi ${userName},</p>
              <p>Great news! Your 14-day free trial of VendorSoluce Professional has started. You now have full access to:</p>
              <ul style="list-style: none; padding: 0;">
                <li style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">✓ Supply Chain Risk Assessment (NIST SP 800-161)</li>
                <li style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">✓ SBOM Analysis with vulnerability scanning</li>
                <li style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">✓ Vendor Risk Monitoring & Analytics</li>
                <li style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">✓ Up to 100 vendor risk profiles</li>
              </ul>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${baseUrl}/dashboard" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Go to Dashboard</a>
              </div>
              <p>No credit card required. Your trial ends in 14 days. You can upgrade anytime during your trial.</p>
              <p>Questions? Reply to this email or visit our <a href="${baseUrl}/support">support center</a>.</p>
              <p>Best regards,<br>The VendorSoluce Team</p>
            </div>
          </body>
          </html>
        `,
      };

    case 'ending_soon':
      const days = daysRemaining || 3;
      return {
        subject: `Your Free Trial Ends in ${days} Day${days > 1 ? 's' : ''} - VendorSoluce`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">Your Trial Ends Soon!</h1>
            </div>
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <p>Hi ${userName},</p>
              <p>Your 14-day free trial of VendorSoluce ends in <strong>${days} day${days > 1 ? 's' : ''}</strong>.</p>
              <p>Don't lose access to your vendor risk assessments and compliance data. Upgrade now to continue using VendorSoluce:</p>
              <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #10b981;">
                <h3 style="margin-top: 0;">Professional Plan - $129/month</h3>
                <ul style="list-style: none; padding: 0;">
                  <li style="padding: 5px 0;">✓ Up to 100 vendor assessments</li>
                  <li style="padding: 5px 0;">✓ NIST SP 800-161 + CMMC 2.0 compliance</li>
                  <li style="padding: 5px 0;">✓ Advanced risk analytics</li>
                  <li style="padding: 5px 0;">✓ Priority support</li>
                </ul>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${baseUrl}/pricing" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Upgrade Now</a>
              </div>
              <p>Save 20% with annual billing! <a href="${baseUrl}/pricing">View pricing →</a></p>
              <p>If you have questions, we're here to help. <a href="${baseUrl}/contact">Contact support</a>.</p>
              <p>Best regards,<br>The VendorSoluce Team</p>
            </div>
          </body>
          </html>
        `,
      };

    case 'expired':
      return {
        subject: 'Your Free Trial Has Ended - VendorSoluce',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">Your Trial Has Ended</h1>
            </div>
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <p>Hi ${userName},</p>
              <p>Your 14-day free trial of VendorSoluce has ended. You've been moved to our free tier, which includes limited features.</p>
              <p>To continue with full access to all features, upgrade to a paid plan:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${baseUrl}/pricing" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">View Plans & Pricing</a>
              </div>
              <p>Your data is safe and will be available when you upgrade. You have 30 days to export your data if needed.</p>
              <p>Questions? <a href="${baseUrl}/contact">Contact our support team</a> - we're here to help!</p>
              <p>Best regards,<br>The VendorSoluce Team</p>
            </div>
          </body>
          </html>
        `,
      };

    default:
      throw new Error(`Unknown notification type: ${type}`);
  }
}

