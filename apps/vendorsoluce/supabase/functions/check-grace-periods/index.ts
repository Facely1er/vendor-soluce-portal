// Check Grace Periods Edge Function
// Sets accounts to read-only mode when grace period starts
// File: supabase/functions/check-grace-periods/index.ts

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
    const updated: string[] = [];

    // Find subscriptions that should be in grace period (cancelled, past period end, but not deleted)
    const { data: gracePeriodSubscriptions, error: fetchError } = await supabase
      .from('vs_subscriptions')
      .select('id, user_id, current_period_end, grace_period_start, grace_period_end, is_read_only, data_deleted_at')
      .eq('cancel_at_period_end', true)
      .not('grace_period_start', 'is', null)
      .not('grace_period_end', 'is', null)
      .is('data_deleted_at', null)
      .lte('current_period_end', now);

    if (fetchError) {
      console.error('Error fetching grace period subscriptions:', fetchError);
      throw fetchError;
    }

    if (!gracePeriodSubscriptions || gracePeriodSubscriptions.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'No subscriptions in grace period found',
          updated: 0
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    console.log(`Found ${gracePeriodSubscriptions.length} subscriptions in grace period`);

    // Update subscriptions to read-only mode if not already set
    for (const subscription of gracePeriodSubscriptions) {
      // Check if grace period has started (current_period_end has passed)
      const periodEnd = new Date(subscription.current_period_end);
      const nowDate = new Date(now);

      if (periodEnd <= nowDate && !subscription.is_read_only) {
        const { error: updateError } = await supabase
          .from('vs_subscriptions')
          .update({
            is_read_only: true,
            updated_at: now
          })
          .eq('id', subscription.id);

        if (updateError) {
          console.error(`Error updating subscription ${subscription.id}:`, updateError);
          continue;
        }

        updated.push(subscription.user_id);
        console.log(`Set subscription ${subscription.id} to read-only mode`);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Processed ${gracePeriodSubscriptions.length} subscriptions`,
        updated: updated.length,
        updatedUsers: updated
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in check-grace-periods:', error);
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

