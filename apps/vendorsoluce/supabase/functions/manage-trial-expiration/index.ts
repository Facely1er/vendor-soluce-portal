// Trial Expiration Management Edge Function
// Automatically expires trials and reverts users to free tier
// File: supabase/functions/manage-trial-expiration/index.ts

declare const Deno: {
  serve: (handler: (req: Request) => Promise<Response>) => void;
  env: {
    get: (key: string) => string | undefined;
  };
};

// @ts-expect-error - URL imports are valid in Deno/Supabase Edge Functions
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
// @ts-expect-error - URL imports are valid in Deno/Supabase Edge Functions
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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find all expired trials
    const now = new Date().toISOString();
    const { data: expiredTrials, error: fetchError } = await supabase
      .from('vs_subscriptions')
      .select(`
        id,
        user_id,
        trial_end,
        metadata,
        vs_profiles!inner(email, full_name)
      `)
      .eq('status', 'trialing')
      .lte('trial_end', now);

    if (fetchError) {
      console.error('Error fetching expired trials:', fetchError);
      throw fetchError;
    }

    if (!expiredTrials || expiredTrials.length === 0) {
      return new Response(
        JSON.stringify({ 
          processed: 0,
          message: 'No expired trials found'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let processedCount = 0;
    const errors: string[] = [];

    // Process each expired trial
    for (const trial of expiredTrials) {
      try {
        // Update subscription status
        const { error: updateError } = await supabase
          .from('vs_subscriptions')
          .update({
            status: 'expired',
            cancel_at: now,
            updated_at: now,
          })
          .eq('id', trial.id);

        if (updateError) {
          console.error(`Error updating subscription ${trial.id}:`, updateError);
          errors.push(`Subscription ${trial.id}: ${updateError.message}`);
          continue;
        }

        // Revert user to free tier
        const { error: tierError } = await supabase
          .from('vs_profiles')
          .update({ 
            subscription_tier: 'free',
            updated_at: now,
          })
          .eq('id', trial.user_id);

        if (tierError) {
          console.error(`Error reverting tier for user ${trial.user_id}:`, tierError);
          errors.push(`User ${trial.user_id}: ${tierError.message}`);
          continue;
        }

        // Send expiration email notification
        try {
          const profile = Array.isArray(trial.vs_profiles) 
            ? trial.vs_profiles[0] 
            : trial.vs_profiles;
          
          if (profile?.email) {
            await supabase.functions.invoke('send-trial-notification', {
              body: {
                userId: trial.user_id,
                email: profile.email,
                name: profile.full_name || 'User',
                type: 'expired',
                subscriptionId: trial.id,
              },
            });
          }
        } catch (emailError) {
          console.error(`Error sending expiration email for user ${trial.user_id}:`, emailError);
          // Don't fail the whole process if email fails
        }

        processedCount++;
        console.log(`Trial expired for user ${trial.user_id}`);
      } catch (error) {
        console.error(`Error processing trial ${trial.id}:`, error);
        errors.push(`Trial ${trial.id}: ${error.message}`);
      }
    }

    return new Response(
      JSON.stringify({ 
        processed: processedCount,
        total: expiredTrials.length,
        errors: errors.length > 0 ? errors : undefined,
        message: `Processed ${processedCount} of ${expiredTrials.length} expired trials`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in manage-trial-expiration:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        processed: 0
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

