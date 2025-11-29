// Trial Management Cron Job
// Runs daily to check trial expiration and send warnings
// File: supabase/functions/trial-cron/index.ts

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const results = {
      expired: 0,
      warnings3Days: 0,
      warnings1Day: 0,
      errors: [] as string[],
    };

    // 1. Check for expired trials and process them
    try {
      const expirationResponse = await supabase.functions.invoke('manage-trial-expiration', {
        body: {},
      });

      if (expirationResponse.error) {
        results.errors.push(`Expiration check: ${expirationResponse.error.message}`);
      } else {
        const expirationData = await expirationResponse.data;
        results.expired = expirationData?.processed || 0;
      }
    } catch (error) {
      results.errors.push(`Expiration check failed: ${error.message}`);
    }

    // 2. Find trials ending in 3 days
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    const threeDaysStart = new Date(threeDaysFromNow);
    threeDaysStart.setHours(0, 0, 0, 0);
    const threeDaysEnd = new Date(threeDaysFromNow);
    threeDaysEnd.setHours(23, 59, 59, 999);

    const { data: trialsEndingIn3Days, error: error3Days } = await supabase
      .from('vs_subscriptions')
      .select(`
        id,
        user_id,
        trial_end,
        vs_profiles!inner(email, full_name)
      `)
      .eq('status', 'trialing')
      .gte('trial_end', threeDaysStart.toISOString())
      .lte('trial_end', threeDaysEnd.toISOString());

    if (error3Days) {
      results.errors.push(`3-day warning query: ${error3Days.message}`);
    } else {
      for (const trial of trialsEndingIn3Days || []) {
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
                type: 'ending_soon',
                daysRemaining: 3,
                subscriptionId: trial.id,
              },
            });
            results.warnings3Days++;
          }
        } catch (error) {
          results.errors.push(`3-day warning for user ${trial.user_id}: ${error.message}`);
        }
      }
    }

    // 3. Find trials ending in 1 day
    const oneDayFromNow = new Date();
    oneDayFromNow.setDate(oneDayFromNow.getDate() + 1);
    const oneDayStart = new Date(oneDayFromNow);
    oneDayStart.setHours(0, 0, 0, 0);
    const oneDayEnd = new Date(oneDayFromNow);
    oneDayEnd.setHours(23, 59, 59, 999);

    const { data: trialsEndingTomorrow, error: error1Day } = await supabase
      .from('vs_subscriptions')
      .select(`
        id,
        user_id,
        trial_end,
        vs_profiles!inner(email, full_name)
      `)
      .eq('status', 'trialing')
      .gte('trial_end', oneDayStart.toISOString())
      .lte('trial_end', oneDayEnd.toISOString());

    if (error1Day) {
      results.errors.push(`1-day warning query: ${error1Day.message}`);
    } else {
      for (const trial of trialsEndingTomorrow || []) {
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
                type: 'ending_soon',
                daysRemaining: 1,
                subscriptionId: trial.id,
              },
            });
            results.warnings1Day++;
          }
        } catch (error) {
          results.errors.push(`1-day warning for user ${trial.user_id}: ${error.message}`);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        results,
        message: `Processed: ${results.expired} expired, ${results.warnings3Days} 3-day warnings, ${results.warnings1Day} 1-day warnings`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in trial-cron:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

