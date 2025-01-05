import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { verifySession, refreshSession } from "@/utils/auth";
import { supabase } from "@/integrations/supabase/client";

interface SessionHandlerProps {
  children: React.ReactNode;
  queryClient: QueryClient;
}

export function SessionHandler({ children, queryClient }: SessionHandlerProps) {
  const navigate = useNavigate();
  const { session, isLoading } = useSessionContext();
  const refreshIntervalRef = useRef<number>();

  useEffect(() => {
    console.log('Checking session...');
    
    const checkSession = async () => {
      try {
        const currentSession = await verifySession();
        if (!currentSession) {
          console.log('No active session, redirecting to login...');
          navigate("/login");
        }
      } catch (error) {
        console.error('Session check error:', error);
        toast.error("Session error. Please try logging in again.");
        navigate("/login");
      }
    };

    if (!isLoading) {
      checkSession();
    }
  }, [navigate, isLoading]);

  useEffect(() => {
    const setupSessionRefresh = () => {
      // Clear any existing interval
      if (refreshIntervalRef.current) {
        window.clearInterval(refreshIntervalRef.current);
      }

      // Set up new refresh interval if we have a session
      if (session) {
        refreshIntervalRef.current = window.setInterval(async () => {
          try {
            await refreshSession();
            console.log('Session refreshed successfully');
          } catch (error) {
            console.error('Failed to refresh session:', error);
          }
        }, 30 * 60 * 1000); // Refresh every 30 minutes
      }
    };

    setupSessionRefresh();

    // Cleanup function
    return () => {
      if (refreshIntervalRef.current) {
        window.clearInterval(refreshIntervalRef.current);
      }
    };
  }, [session]);

  useEffect(() => {
    const handleAuthChange = (event: string, session: any) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN') {
        queryClient.invalidateQueries();
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  if (isLoading) {
    return null;
  }

  return <>{children}</>;
}