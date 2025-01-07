import { supabase } from "@/integrations/supabase/client";
import { AuthError, AuthApiError } from '@supabase/supabase-js';

export const clearAuthSession = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error clearing session:', error);
      throw error;
    }
    
    localStorage.removeItem('supabase.auth.token');
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

    return session;
  } catch (error) {
    console.error('Session verification error:', error);
    return null;
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  try {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password: password.trim()
    });

    if (error) {
      if (error instanceof AuthApiError) {
        switch (error.status) {
          case 400:
            if (error.message.includes('Invalid login credentials')) {
              throw new Error('Invalid email or password. Please check your credentials and try again.');
            }
            throw new Error(error.message);
          case 422:
            throw new Error('Email format is invalid. Please enter a valid email address.');
          default:
            throw new Error(error.message);
        }
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getErrorMessage = (error: Error | AuthError): string => {
  if (error instanceof AuthApiError) {
    switch (error.status) {
      case 400:
        if (error.message.includes('Invalid login credentials')) {
          return 'Invalid email or password. Please check your credentials and try again.';
        }
        return error.message;
      case 422:
        return 'Email format is invalid. Please enter a valid email address.';
      default:
        return error.message;
    }
  }
  return error.message || 'An unexpected error occurred. Please try again.';
};