import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { verifySession, refreshSession } from "@/utils/auth";
import { QueryClient } from "@tanstack/react-query";

interface SessionHandlerProps {
  children: React.ReactNode;
  queryClient: QueryClient;
}

export function SessionHandler({ children, queryClient }: SessionHandlerProps) {
  const session = useSession();
  const navigate = useNavigate();
  const refreshIntervalRef = useRef<number>();
  const isLoading = useRef(true);

  // Initial session verification
  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentSession = await verifySession();
        if (!currentSession && !window.location.pathname.startsWith('/login')) {
          console.log('No session found, redirecting to login...');
          navigate("/login");
        }
      } catch (error) {
        console.error('Session verification failed:', error);
        navigate("/login");
      } finally {
        isLoading.current = false;
      }
    };

    checkSession();
  }, [navigate]);

  // Prevent rendering until initial session check is complete
  useEffect(() => {
    if (!isLoading.current && !session && !window.location.pathname.startsWith('/login')) {
      navigate("/login");
    }
  }, [navigate, session]);

  // Session refresh handling
  useEffect(() => {
    const setupSessionRefresh = async () => {
      if (refreshIntervalRef.current) {
        window.clearInterval(refreshIntervalRef.current);
      }

      // Initial session refresh
      if (session) {
        try {
          await refreshSession();
          console.log('Initial session refresh successful');
        } catch (error) {
          console.error('Initial session refresh failed:', error);
          navigate("/login");
        }
      }

      // Set up new refresh interval if we have a session
      if (session) {
        refreshIntervalRef.current = window.setInterval(async () => {
          try {
            const refreshedSession = await refreshSession();
            if (!refreshedSession) {
              console.log('Session refresh failed, redirecting to login...');
              navigate("/login");
              return;
            }
            console.log('Session refreshed successfully');
          } catch (error) {
            console.error('Failed to refresh session:', error);
            navigate("/login");
          }
        }, 10 * 60 * 1000); // Refresh every 10 minutes
      }
    };

    setupSessionRefresh();

    return () => {
      if (refreshIntervalRef.current) {
        window.clearInterval(refreshIntervalRef.current);
      }
    };
  }, [session, navigate]);

  // Auth state change handler
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          queryClient.invalidateQueries();
        } else if (event === 'SIGNED_OUT') {
          queryClient.clear();
          navigate("/login");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, queryClient]);

  return <>{children}</>;
}