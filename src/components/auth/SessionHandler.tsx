import { useState, useEffect } from 'react';
import { QueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { clearAuthSession } from '@/utils/auth';
import { toast } from "sonner";

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

    const checkSession = async () => {
      try {
        console.log('Checking session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          if (mounted) {
            setIsAuthenticated(false);
            setIsLoading(false);
            await clearAuthSession();
            // Don't show error toast for refresh token errors as they're expected when session expires
            if (!error.message.includes('refresh_token_not_found')) {
              toast.error("Session error. Please try logging in again.");
            }
          }
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

        console.log('Valid session found:', session.user.id);
        if (mounted) {
          setIsAuthenticated(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Session verification error:', error);
        if (mounted) {
          setIsAuthenticated(false);
          setIsLoading(false);
          await clearAuthSession();
          toast.error("Session verification failed. Please try logging in again.");
        }
      }
    };

    checkSession();

    const setupAuthListener = async () => {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          setIsAuthenticated(false);
          setIsLoading(false);
          queryClient.clear();
          
          if (event === 'TOKEN_REFRESHED' && !session) {
            await clearAuthSession();
          }
        } else if (event === 'SIGNED_IN') {
          if (session) {
            setIsAuthenticated(true);
            setIsLoading(false);
            queryClient.invalidateQueries();
          } else {
            setIsAuthenticated(false);
            setIsLoading(false);
            await clearAuthSession();
          }
        }
      });
      
      authListener = data;
    };

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