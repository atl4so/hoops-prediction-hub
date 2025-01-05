import { useState, useEffect } from 'react';
import { QueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { clearAuthSession, verifySession } from '@/utils/auth';

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
        const validSession = await verifySession();
        if (validSession) {
          setIsAuthenticated(true);
          queryClient.invalidateQueries();
        } else {
          setIsAuthenticated(false);
          await clearAuthSession();
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [queryClient]);

  console.log('SessionHandler state:', { isLoading, isAuthenticated });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};