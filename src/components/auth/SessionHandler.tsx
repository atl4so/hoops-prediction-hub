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
          console.error('Session check error:', error);
          if (error.message.includes('invalid_credentials')) {
            toast.error("Invalid login credentials. Please try again.");
          } else if (error.message.includes('session_not_found')) {
            console.log('Session not found, cleaning up...');
            await cleanupSession();
          } else {
            toast.error("Authentication error. Please try logging in again.");
          }
          return;
        }
        
        if (session) {
          console.log('Valid session found for user:', session.user.id);
          setIsAuthenticated(true);
        } else {
          console.log('No active session found');
          setIsAuthenticated(false);
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
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out, cleaning up...');
        queryClient.clear();
        localStorage.clear();
        sessionStorage.clear();
        setIsAuthenticated(false);
        toast.success("Successfully signed out");
      } else if (event === 'SIGNED_IN') {
        console.log('User signed in:', session?.user?.id);
        setIsAuthenticated(true);
        queryClient.invalidateQueries();
        toast.success("Successfully signed in");
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed for user:', session?.user?.id);
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