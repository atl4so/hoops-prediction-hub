import { useState, useEffect } from 'react';
import { QueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { clearAuthSession } from '@/utils/auth';

interface SessionHandlerProps {
  children: React.ReactNode;
  queryClient: QueryClient;
}

export const SessionHandler = ({ children, queryClient }: SessionHandlerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log('SessionHandler mounted'); // Debug log
    let mounted = true;

    const checkSession = async () => {
      try {
        console.log('Checking session...'); // Debug log
        
        if (!mounted) return;

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          if (mounted) {
            setIsAuthenticated(false);
            setIsLoading(false);
            await clearAuthSession();
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

        // Verify the session is valid
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error('User verification failed:', userError);
          if (mounted) {
            setIsAuthenticated(false);
            setIsLoading(false);
            await clearAuthSession();
          }
          return;
        }

        console.log('Session found and verified:', session.user.id); // Debug log
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
        await clearAuthSession();
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setIsAuthenticated(true);
        queryClient.invalidateQueries();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [queryClient]);

  console.log('SessionHandler state:', { isLoading, isAuthenticated }); // Debug log

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};