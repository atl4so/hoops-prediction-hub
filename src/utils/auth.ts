import { supabase } from "@/integrations/supabase/client";

export const clearAuthSession = async () => {
  try {
    // First try to sign out normally
    const { error: signOutError } = await supabase.auth.signOut({
      scope: 'local' // Use local scope to avoid the body stream error
    });
    
    if (signOutError) {
      console.error('Error signing out:', signOutError);
    }
    
    // Clear local storage regardless of signout success
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.clear();
    
    // If there was an error signing out, we still want to clear the session
    if (signOutError) {
      throw signOutError;
    }
  } catch (error) {
    console.error('Session cleanup error:', error);
    throw error;
  }
};

export const verifySession = async () => {
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

    // Additional verification step
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('User verification error:', userError);
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