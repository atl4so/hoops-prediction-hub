import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface SessionHandlerProps {
  children: React.ReactNode;
}

export const SessionHandler = ({ children }: SessionHandlerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const cleanupSession = async () => {
      try {
        localStorage.clear();
        sessionStorage.clear();
        
        try {
          await supabase.auth.signOut({ scope: 'global' });
        } catch (error) {
          console.log('Global sign out error (expected if no session):', error);
        }
        
        setIsAuthenticated(false);
      } catch (error) {
        console.error('Session cleanup error:', error);
      }
    };

    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          if (error.message.includes('session_not_found')) {
            console.log('Session not found, cleaning up...');
            await cleanupSession();
            return;
          }
          throw error;
        }
        
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error('Session check error:', error);
        await cleanupSession();
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, !!session);
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out, cleaning up...');
        queryClient.clear();
        localStorage.clear();
        sessionStorage.clear();
        setIsAuthenticated(false);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setIsAuthenticated(true);
        queryClient.invalidateQueries();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  if (isLoading) {
    return null;
  }

  return <>{children}</>;
};