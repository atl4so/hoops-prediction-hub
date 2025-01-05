import { useState, useEffect } from 'react';
import { QueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SessionHandlerProps {
  children: React.ReactNode;
  queryClient: QueryClient;
}

export const SessionHandler = ({ children, queryClient }: SessionHandlerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          if (mounted) {
            setIsAuthenticated(false);
            setIsLoading(false);
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

        // Verify the session is still valid
        const { data: { user }, error: refreshError } = await supabase.auth.getUser();
        
        if (refreshError || !user) {
          console.error('User verification failed:', refreshError);
          if (mounted) {
            setIsAuthenticated(false);
            setIsLoading(false);
          }
          return;
        }

        if (mounted) {
          setIsAuthenticated(true);
          setIsLoading(false);
        }
        console.log('Session verified for user:', user.id);
      } catch (error) {
        console.error('Session verification error:', error);
        if (mounted) {
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        queryClient.clear();
        await supabase.auth.signOut(); // Ensure complete sign out
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (!error && user) {
          setIsAuthenticated(true);
          queryClient.invalidateQueries();
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [queryClient]);

  if (isLoading) {
    return null;
  }

  return <>{children}</>;
};