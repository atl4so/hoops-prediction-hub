import { supabase } from "@/integrations/supabase/client";

export const clearAuthSession = async () => {
  try {
    // Check if there's an active session before attempting to sign out
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      await supabase.auth.signOut();
    }
    
    // Clear specific auth tokens
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.clear();
  } catch (error) {
    console.error('Session cleanup error:', error);
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

    // Additional verification of user data
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('User verification failed:', userError);
      return null;
    }

    return session;
  } catch (error) {
    console.error('Session verification error:', error);
    return null;
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  // Ensure clean session before login
  await clearAuthSession();

  const { data, error: signInError } = await supabase.auth.signInWithPassword({
    email: email.toLowerCase().trim(),
    password,
  });

  if (signInError) {
    let errorMessage = "Invalid email or password. Please check your credentials and try again.";
    if (signInError.message.includes("Email not confirmed")) {
      errorMessage = "Please confirm your email address before logging in.";
    }
    throw new Error(errorMessage);
  }

  if (!data.user) {
    throw new Error("No user data received");
  }

  // Verify session establishment
  const session = await verifySession();
  if (!session) {
    throw new Error("Failed to establish session");
  }
  
  return data.user;
};