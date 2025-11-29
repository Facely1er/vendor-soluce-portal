import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';
import { config } from '../utils/config';

export const supabase = createClient<Database>(config.supabase.url, config.supabase.anonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': `${config.app.name}-web@${config.app.version}`
    }
  },
  db: {
    schema: 'public'
  }
});