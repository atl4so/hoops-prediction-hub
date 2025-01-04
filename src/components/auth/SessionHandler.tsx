import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
        queryClient.clear();
        localStorage.clear();
        sessionStorage.clear();
        setIsAuthenticated(false);
      } catch (error) {
        console.error('Session cleanup error:', error);
      }
    };

    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          if (error.message.includes('invalid_credentials')) {
            toast.error("Invalid login credentials");
          }
          await cleanupSession();
          return;
        }
        
        if (session) {
          console.log('Valid session found for user:', session.user.id);
          setIsAuthenticated(true);
        } else {
          console.log('No active session found');
          await cleanupSession();
        }
      } catch (error) {
        console.error('Session check error:', error);
        await cleanupSession();
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        console.log('User signed out or deleted, cleaning up...');
        await cleanupSession();
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        console.log('User signed in or token refreshed:', session?.user?.id);
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