import { supabase } from "@/integrations/supabase/client";

export const clearAuthSession = async () => {
  try {
    // First clear local storage and session storage
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.clear();
    
    // Then attempt to sign out from Supabase
    try {
      await supabase.auth.signOut({ scope: 'local' });
    } catch (error) {
      console.error('Supabase signout error:', error);
      // Continue with cleanup even if signout fails
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
      return false;
    }
    
    if (!session) {
      console.log('No active session found');
      return false;
    }

    // Verify the session is still valid by making a test request
    const { error: testError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
      .single();

    if (testError && testError.code === 'PGRST301') {
      console.error('Session invalid:', testError);
      return false;
    }

    return true;
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