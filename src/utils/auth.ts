import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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

export const clearAuthSession = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error clearing session:', error);
    throw error;
  }
};

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