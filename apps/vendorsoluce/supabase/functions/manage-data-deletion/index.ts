// Manage Data Deletion Edge Function
// Handles grace period tracking and scheduled data deletion
// File: supabase/functions/manage-data-deletion/index.ts

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

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const now = new Date().toISOString();
    const deletedUsers: string[] = [];
    const errors: string[] = [];

    // Find subscriptions with expired grace periods that haven't been deleted yet
    const { data: expiredSubscriptions, error: fetchError } = await supabase
      .from('vs_subscriptions')
      .select('id, user_id, grace_period_end, data_deleted_at')
      .not('grace_period_end', 'is', null)
      .lte('grace_period_end', now)
      .is('data_deleted_at', null);

    if (fetchError) {
      console.error('Error fetching expired subscriptions:', fetchError);
      throw fetchError;
    }

    if (!expiredSubscriptions || expiredSubscriptions.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'No expired subscriptions found',
          deleted: 0
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    console.log(`Found ${expiredSubscriptions.length} subscriptions with expired grace periods`);

    // Delete data for each expired subscription
    for (const subscription of expiredSubscriptions) {
      try {
        const userId = subscription.user_id;

        // Delete user data from all relevant tables
        // Note: Using CASCADE where possible, but explicitly deleting for clarity

        // Delete vendor assessments and related data
        const { error: assessmentError } = await supabase
          .from('vs_vendor_assessments')
          .delete()
          .eq('user_id', userId);

        if (assessmentError) {
          console.error(`Error deleting assessments for user ${userId}:`, assessmentError);
          errors.push(`User ${userId}: assessments deletion failed`);
          continue;
        }

        // Delete SBOM analyses
        const { error: sbomError } = await supabase
          .from('vs_sbom_analyses')
          .delete()
          .eq('user_id', userId);

        if (sbomError) {
          console.error(`Error deleting SBOM analyses for user ${userId}:`, sbomError);
          errors.push(`User ${userId}: SBOM analyses deletion failed`);
          continue;
        }

        // Delete vendors
        const { error: vendorError } = await supabase
          .from('vs_vendors')
          .delete()
          .eq('user_id', userId);

        if (vendorError) {
          console.error(`Error deleting vendors for user ${userId}:`, vendorError);
          errors.push(`User ${userId}: vendors deletion failed`);
          continue;
        }

        // Delete usage records
        const { error: usageError } = await supabase
          .from('vs_usage_records')
          .delete()
          .eq('user_id', userId);

        if (usageError) {
          console.error(`Error deleting usage records for user ${userId}:`, usageError);
          // Don't fail on usage records - not critical
        }

        // Mark subscription as deleted
        const { error: updateError } = await supabase
          .from('vs_subscriptions')
          .update({
            data_deleted_at: now,
            is_read_only: false, // No longer needed after deletion
            status: 'canceled',
            updated_at: now
          })
          .eq('id', subscription.id);

        if (updateError) {
          console.error(`Error updating subscription ${subscription.id}:`, updateError);
          errors.push(`User ${userId}: subscription update failed`);
          continue;
        }

        deletedUsers.push(userId);
        console.log(`Successfully deleted data for user ${userId}`);

      } catch (error) {
        console.error(`Error processing subscription ${subscription.id}:`, error);
        errors.push(`Subscription ${subscription.id}: ${error.message}`);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Processed ${expiredSubscriptions.length} expired subscriptions`,
        deleted: deletedUsers.length,
        deletedUsers: deletedUsers,
        errors: errors.length > 0 ? errors : undefined
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in manage-data-deletion:', error);
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

