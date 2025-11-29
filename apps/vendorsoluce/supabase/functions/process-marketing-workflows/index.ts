// Process Marketing Workflows - Cron Job
// Processes scheduled emails and executes marketing automation workflows
// File: supabase/functions/process-marketing-workflows/index.ts

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

interface EmailSend {
  id: string;
  workflow_id?: string;
  template_id?: string;
  user_id: string;
  campaign_id?: string;
  email: string;
  subject: string;
  scheduled_for: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get pending emails that are due to be sent
    const now = new Date().toISOString();
    const { data: pendingEmails, error: fetchError } = await supabase
      .from('vs_email_sends')
      .select(`
        *,
        vs_email_templates(*),
        vs_profiles(email, full_name, subscription_tier)
      `)
      .eq('status', 'pending')
      .lte('scheduled_for', now)
      .limit(50); // Process in batches

    if (fetchError) {
      throw new Error(`Error fetching pending emails: ${fetchError.message}`);
    }

    if (!pendingEmails || pendingEmails.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'No pending emails to process',
          processed: 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const emailApiKey = Deno.env.get('RESEND_API_KEY') || Deno.env.get('EMAIL_API_KEY');
    const emailFrom = Deno.env.get('EMAIL_FROM') || 'VendorSoluce <noreply@vendorsoluce.com>';
    const baseUrl = Deno.env.get('SITE_URL') || 'https://vendorsoluce.com';

    let processed = 0;
    let failed = 0;
    const errors: string[] = [];

    // Process each email
    for (const emailSend of pendingEmails) {
      try {
        const template = emailSend.vs_email_templates;
        const profile = emailSend.vs_profiles;

        if (!profile || !profile.email) {
          throw new Error(`User profile not found for email send ${emailSend.id}`);
        }

        // Use template HTML or fallback to subject
        let htmlContent = template?.html_content || `<p>${emailSend.subject}</p>`;
        
        // Replace template variables
        htmlContent = htmlContent
          .replace(/\{\{name\}\}/g, profile.full_name || 'there')
          .replace(/\{\{email\}\}/g, profile.email)
          .replace(/\{\{dashboardUrl\}\}/g, `${baseUrl}/dashboard`)
          .replace(/\{\{pricingUrl\}\}/g, `${baseUrl}/pricing`)
          .replace(/\{\{baseUrl\}\}/g, baseUrl);

        // Send email via Resend
        if (!emailApiKey) {
          console.warn('Email API key not configured, skipping email send');
          // Mark as failed
          await supabase
            .from('vs_email_sends')
            .update({
              status: 'failed',
              error_message: 'Email API key not configured'
            })
            .eq('id', emailSend.id);
          failed++;
          continue;
        }

        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${emailApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: emailFrom,
            to: profile.email,
            subject: emailSend.subject,
            html: htmlContent,
          }),
        });

        if (!emailResponse.ok) {
          const errorText = await emailResponse.text();
          throw new Error(`Email service error: ${errorText}`);
        }

        const emailResult = await emailResponse.json();

        // Update email send status
        await supabase
          .from('vs_email_sends')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
            email_provider_id: emailResult.id,
          })
          .eq('id', emailSend.id);

        // Update campaign analytics
        if (emailSend.campaign_id) {
          const date = new Date().toISOString().split('T')[0];
          const { data: existing } = await supabase
            .from('vs_campaign_analytics')
            .select('*')
            .eq('campaign_id', emailSend.campaign_id)
            .eq('date', date)
            .single();

          if (existing) {
            await supabase
              .from('vs_campaign_analytics')
              .update({ emails_sent: (existing.emails_sent || 0) + 1 })
              .eq('id', existing.id);
          } else {
            await supabase
              .from('vs_campaign_analytics')
              .insert({
                campaign_id: emailSend.campaign_id,
                date,
                emails_sent: 1,
              });
          }
        }

        // Schedule next email in workflow if applicable
        if (emailSend.workflow_id) {
          // Call the schedule-next-email function
          await supabase.functions.invoke('schedule-next-email', {
            body: { workflow_id: emailSend.workflow_id },
          });
        }

        processed++;
      } catch (error) {
        console.error(`Error processing email ${emailSend.id}:`, error);
        errors.push(`Email ${emailSend.id}: ${error.message}`);
        
        // Mark as failed
        await supabase
          .from('vs_email_sends')
          .update({
            status: 'failed',
            error_message: error.message,
          })
          .eq('id', emailSend.id);
        
        failed++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed,
        failed,
        errors: errors.length > 0 ? errors : undefined,
        message: `Processed ${processed} emails, ${failed} failed`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in process-marketing-workflows:', error);
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

