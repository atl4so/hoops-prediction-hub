import { supabase } from "@/integrations/supabase/client";

export const clearAuthSession = async () => {
  try {
    // Clear local storage first
    localStorage.clear();
    sessionStorage.clear();

    // Attempt to sign out, but don't throw on session_not_found
    const { error } = await supabase.auth.signOut();
    if (error && !error.message.includes('session_not_found')) {
      console.error('Error clearing session:', error);
      throw error;
    }
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

    return session;
  } catch (error) {
    console.error('Session verification error:', error);
    return null;
  }
};