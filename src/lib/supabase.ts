import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nuswsfxmaqyzfmpmbuky.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51c3dzZnhtYXF5emZtcG1idWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY4OTMzMzAsImV4cCI6MjAyMjQ2OTMzMH0.qDj5YKxvUxdnHxqeV-RFEjZWUuHzZ8SZ8sCxEg7Kxwc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'euroleague-auth',
    storage: window.localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});