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
      storageKey: 'supabase.auth.token',
      storage: {
        getItem: (key) => {
          try {
            const item = localStorage.getItem(key);
            return item;
          } catch (error) {
            console.error('Error accessing localStorage:', error);
            return null;
          }
        },
        setItem: (key, value) => {
          try {
            localStorage.setItem(key, value);
          } catch (error) {
            console.error('Error setting localStorage:', error);
          }
        },
        removeItem: (key) => {
          try {
            localStorage.removeItem(key);
          } catch (error) {
            console.error('Error removing from localStorage:', error);
          }
        },
      },
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
      reconnectAfterMs: (retries) => {
        // Exponential backoff for reconnection attempts
        return Math.min(1000 + retries * 1000, 10000);
      },
      timeout: 60000, // Increase timeout to 60 seconds
    },
    global: {
      headers: {
        'x-application-name': 'euroleague.bet',
      },
    },
  }
);