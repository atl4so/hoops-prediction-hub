import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://nuswsfxmaqyzfmpmbuky.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51c3dzZnhtYXF5emZtcG1idWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzNDAzMTIsImV4cCI6MjA1MDkxNjMxMn0.wNcFq7gZwSUQS6tV0v4njsqVvydWe9qsamLDSKnWEIY";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storage: localStorage,
      storageKey: 'supabase.auth.token',
    },
    realtime: {
      params: {
        eventsPerSecond: 2,
      },
      reconnectAfterMs: (retries) => {
        return Math.min(1000 + retries * 2000, 20000);
      },
      timeout: 30000,
    },
    global: {
      headers: {
        'x-application-name': 'euroleague.bet',
      },
    },
    db: {
      schema: 'public'
    },
  }
);