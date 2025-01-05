import { supabase } from "@/integrations/supabase/client";
import { normalizeEmail } from "./validation";

export const clearAuthSession = async () => {
  try {
    // Clear specific auth tokens instead of all localStorage
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.clear();
    
    // Force sign out
    await supabase.auth.signOut({ scope: 'global' });
    
    // Verify session is cleared
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.auth.signOut();
    }
  } catch (error) {
    console.error('Session cleanup error:', error);
  }
};

export const verifySession = async () => {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    throw new Error("Failed to establish session");
  }
  return session;
};

export const loginWithEmail = async (email: string, password: string) => {
  // Ensure clean session before login
  await supabase.auth.signOut();

  const { data, error: signInError } = await supabase.auth.signInWithPassword({
    email: normalizeEmail(email),
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
  await verifySession();
  return data.user;
};