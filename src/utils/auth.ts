import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Session } from '@supabase/supabase-js';

export const clearAuthSession = async () => {
  try {
    const { error: signOutError } = await supabase.auth.signOut({
      scope: 'local'
    });
    
    if (signOutError) {
      console.error('Error signing out:', signOutError);
      throw signOutError;
    }
  } catch (error) {
    console.error('Session cleanup error:', error);
    throw error;
  }
};

export const verifySession = async (): Promise<Session | null> => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session verification error:', sessionError);
      return null;
    }
    
    if (!session) {
      console.log('No active session found');
      return null;
    }

    return session;
  } catch (error) {
    console.error('Session verification error:', error);
    return null;
  }
};

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

export const refreshSession = async () => {
  try {
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