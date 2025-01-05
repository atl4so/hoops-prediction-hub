import { useState, useEffect } from 'react';
import { QueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { clearAuthSession, verifySession } from '@/utils/auth';
import { toast } from "sonner";

interface SessionHandlerProps {
  children: React.ReactNode;
  queryClient: QueryClient;
}

export const SessionHandler = ({ children, queryClient }: SessionHandlerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log('SessionHandler mounted');
    let mounted = true;

    const checkSession = async () => {
      try {
        console.log('Checking session...');
        
        if (!mounted) return;

        const session = await verifySession();
        
        if (!session) {
          console.log('No valid session found');
          if (mounted) {
            setIsAuthenticated(false);
            setIsLoading(false);
            await clearAuthSession();
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

    // Initial session check
    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setIsLoading(false);
        queryClient.clear();
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        try {
          const validSession = await verifySession();
          if (validSession) {
            setIsAuthenticated(true);
            setIsLoading(false);
            queryClient.invalidateQueries();
          } else {
            setIsAuthenticated(false);
            setIsLoading(false);
            await clearAuthSession();
          }
        } catch (error) {
          console.error('Session verification error:', error);
          setIsAuthenticated(false);
          setIsLoading(false);
          await clearAuthSession();
          toast.error("Session verification failed. Please try logging in again.");
        }
      }
    });

    // Cleanup function
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [queryClient]);

  console.log('SessionHandler state:', { isLoading, isAuthenticated });

  // Return children immediately if not loading, regardless of authentication state
  if (!isLoading) {
    return <>{children}</>;
  }

  // Show loading spinner only during initial load
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
};