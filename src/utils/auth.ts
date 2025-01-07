import { supabase } from "@/integrations/supabase/client";

export const clearAuthSession = async () => {
  try {
    // First clear local storage and session storage
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.clear();
    
    // Then attempt to sign out from Supabase with local scope only
    try {
      await supabase.auth.signOut({ scope: 'local' });
    } catch (error) {
      console.error('Supabase signout error:', error);
      // Continue with cleanup even if signout fails
    }
  } catch (error) {
    console.error('Session cleanup error:', error);
    // Don't throw the error to prevent cascading failures
  }
};

export const verifySession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Session verification error:', error);
      return false;
    }
    
    if (!session) {
      console.log('No active session found');
      return false;
    }

    // Simple session check without making additional requests
    return session.expires_at ? new Date(session.expires_at * 1000) > new Date() : false;
  } catch (error) {
    console.error('Session verification error:', error);
    return false;
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