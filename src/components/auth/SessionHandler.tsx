import { useState, useEffect } from 'react';
import { QueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { clearAuthSession } from '@/utils/auth';
import { toast } from "sonner";
import type { AuthError } from '@supabase/supabase-js';

interface SessionHandlerProps {
  children: React.ReactNode;
  queryClient: QueryClient;
}

export const SessionHandler = ({ children, queryClient }: SessionHandlerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;
    let authListener: { subscription: { unsubscribe: () => void } } | null = null;

    const handleSessionError = async (error?: AuthError) => {
      console.log('Handling session error...', error);
      if (!mounted) return;

      setIsAuthenticated(false);
      setIsLoading(false);
      
      try {
        await clearAuthSession();
        queryClient.clear();
        toast.error("Session expired. Please log in again.");
      } catch (clearError) {
        console.error('Error clearing session:', clearError);
        // Even if clearing fails, we want to ensure the user is logged out in the UI
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    const verifySession = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        return !!user;
      } catch (error) {
        console.error('Session verification error:', error);
        return false;
      }
    };

    const checkSession = async () => {
      try {
        console.log('Checking session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          await handleSessionError(error);
          return;
        }

        if (!session) {
          console.log('No session found');
          if (mounted) {
            setIsAuthenticated(false);
            setIsLoading(false);
          }
          return;
        }

        // Additional verification step
        const isValid = await verifySession();
        if (!isValid) {
          console.error('Session verification failed');
          await handleSessionError();
          return;
        }

        console.log('Valid session found:', session.user.id);
        if (mounted) {
          setIsAuthenticated(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Session verification error:', error);
        await handleSessionError();
      }
    };

    const setupAuthListener = async () => {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.id);
        
        switch (event) {
          case 'SIGNED_OUT':
            setIsAuthenticated(false);
            setIsLoading(false);
            queryClient.clear();
            break;
          
          case 'SIGNED_IN':
          case 'TOKEN_REFRESHED':
            if (session) {
              const isValid = await verifySession();
              if (isValid) {
                setIsAuthenticated(true);
                setIsLoading(false);
                queryClient.invalidateQueries();
              } else {
                await handleSessionError();
              }
            } else {
              await handleSessionError();
            }
            break;
          
          default:
            // Handle other events if needed
            break;
        }
      });
      
      authListener = data;
    };

    // Initial session check
    checkSession();
    setupAuthListener();

    return () => {
      mounted = false;
      if (authListener) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [queryClient]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
};