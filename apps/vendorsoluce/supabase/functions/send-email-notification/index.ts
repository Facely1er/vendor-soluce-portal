// Generic Email Notification Service
// Sends email notifications for various subscription events
// File: supabase/functions/send-email-notification/index.ts

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

interface EmailNotificationRequest {
  to: string;
  subject: string;
  html: string;
  type?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body: EmailNotificationRequest = await req.json();
    const { to, subject, html } = body;

    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, subject, html' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

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
        to: to,
        subject: subject,
        html: html,
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
        message: 'Email notification sent',
        emailId: emailResult.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in send-email-notification:', error);
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

