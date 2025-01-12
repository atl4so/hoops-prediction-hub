import { supabase } from "@/integrations/supabase/client";

export const clearAuthSession = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error clearing session:', error);
      throw error;
    }
    
    // Clear any local storage items
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('supabase.auth.expires_at');
    localStorage.removeItem('supabase.auth.refresh_token');
    sessionStorage.clear();
  } catch (error) {
    console.error('Session cleanup error:', error);
    throw error;
  }
};

export const verifySession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Session verification error:', error);
      return null;
    }
    
    if (!session) {
      console.log('No active session found');
      return null;
    }

    // Try to refresh the session
    const { error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError) {
      console.error('Session refresh error:', refreshError);
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