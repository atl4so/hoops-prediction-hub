import { supabase } from "@/integrations/supabase/client";
import type { Session } from '@supabase/supabase-js';

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