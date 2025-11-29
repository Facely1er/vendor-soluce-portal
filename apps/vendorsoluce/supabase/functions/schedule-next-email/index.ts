// Schedule Next Email in Workflow
// Schedules the next email in a marketing workflow sequence
// File: supabase/functions/schedule-next-email/index.ts

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
    const { workflow_id } = await req.json();

    if (!workflow_id) {
      return new Response(
        JSON.stringify({ error: 'Missing workflow_id' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get workflow details
    const { data: workflow, error: workflowError } = await supabase
      .from('vs_marketing_workflows')
      .select('*, vs_marketing_campaigns(*)')
      .eq('id', workflow_id)
      .single();

    if (workflowError || !workflow) {
      throw new Error(`Workflow not found: ${workflowError?.message}`);
    }

    const currentStep = workflow.current_step || 0;

    // Get next template in sequence
    const { data: templates, error: templatesError } = await supabase
      .from('vs_email_templates')
      .select('*')
      .eq('campaign_id', workflow.campaign_id)
      .eq('is_active', true)
      .order('sequence_order', { ascending: true });

    if (templatesError) {
      throw new Error(`Error fetching templates: ${templatesError.message}`);
    }

    if (!templates || templates.length === 0) {
      // Workflow complete
      await supabase
        .from('vs_marketing_workflows')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', workflow_id);

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Workflow completed - no more emails',
          workflow_completed: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const nextTemplate = templates.find((t: any) => t.sequence_order > currentStep);

    if (!nextTemplate) {
      // Workflow complete
      await supabase
        .from('vs_marketing_workflows')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', workflow_id);

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Workflow completed - no more templates',
          workflow_completed: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user details
    const { data: user, error: userError } = await supabase
      .from('vs_profiles')
      .select('email, full_name')
      .eq('id', workflow.user_id)
      .single();

    if (userError || !user || !user.email) {
      throw new Error(`User not found: ${userError?.message}`);
    }

    // Calculate scheduled time
    const delayMs = (nextTemplate.delay_days * 24 * 60 * 60 * 1000) +
                    (nextTemplate.delay_hours * 60 * 60 * 1000);
    const scheduledFor = new Date(Date.now() + delayMs);

    // Create email send record
    const { data: emailSend, error: emailSendError } = await supabase
      .from('vs_email_sends')
      .insert({
        workflow_id: workflow_id,
        template_id: nextTemplate.id,
        user_id: workflow.user_id,
        campaign_id: workflow.campaign_id,
        email: user.email,
        subject: nextTemplate.subject,
        status: 'pending',
        scheduled_for: scheduledFor.toISOString(),
      })
      .select()
      .single();

    if (emailSendError) {
      throw new Error(`Error creating email send: ${emailSendError.message}`);
    }

    // Update workflow step
    await supabase
      .from('vs_marketing_workflows')
      .update({ current_step: nextTemplate.sequence_order })
      .eq('id', workflow_id);

    return new Response(
      JSON.stringify({
        success: true,
        email_send_id: emailSend.id,
        scheduled_for: scheduledFor.toISOString(),
        template_id: nextTemplate.id,
        message: 'Next email scheduled successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in schedule-next-email:', error);
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

