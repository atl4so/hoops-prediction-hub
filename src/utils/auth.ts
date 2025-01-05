import { supabase } from "@/integrations/supabase/client";

export const clearAuthSession = async () => {
  try {
    // First try to sign out properly
    const { error } = await supabase.auth.signOut({
      scope: 'local'  // Only clear the local session
    });
    
    if (error && !error.message.includes('session_not_found')) {
      console.error('Error signing out:', error);
    }
    
    // Clear any local storage items
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('sb-nuswsfxmaqyzfmpmbuky-auth-token');
    sessionStorage.clear();
  } catch (error) {
    console.error('Session cleanup error:', error);
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