import { supabase } from "@/integrations/supabase/client";
import type { Session, Provider } from '@supabase/supabase-js';

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const loginWithProvider = async (provider: Provider) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
    });

    if (error) {
      console.error('OAuth login error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('OAuth login error:', error);
    throw error;
  }
};

let lastRefreshTime = 0;
const MIN_REFRESH_INTERVAL = 60000; // Minimum 1 minute between refreshes

export const verifySession = async (): Promise<Session | null> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Session verification error:', error);
      throw error;
    }
    
    return session;
  } catch (error) {
    console.error('Session verification error:', error);
    throw error;
  }
};

export const refreshSession = async (): Promise<Session | null> => {
  const now = Date.now();
  if (now - lastRefreshTime < MIN_REFRESH_INTERVAL) {
    console.log('Skipping refresh - too soon since last refresh');
    return null;
  }

  try {
    lastRefreshTime = now;
    const { data: { session }, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error('Session refresh error:', error);
      throw error;
    }
    
    return session;
  } catch (error) {
    console.error('Session refresh error:', error);
    throw error;
  }
};

export const clearAuthSession = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

export const isUserAdmin = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.email === 'likasvy@gmail.com';
  } catch (error) {
    console.error('Admin check error:', error);
    return false;
  }
};