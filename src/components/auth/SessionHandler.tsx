import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { verifySession, refreshSession } from "@/utils/auth";
import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface SessionHandlerProps {
  children: React.ReactNode;
  queryClient: QueryClient;
}

export function SessionHandler({ children, queryClient }: SessionHandlerProps) {
  const session = useSession();
  const navigate = useNavigate();
  const refreshIntervalRef = useRef<number>();
  const isLoading = useRef(true);
  const isRefreshing = useRef(false);

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
        toast.error("Session verification failed. Please log in again.");
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
      if (session && !isRefreshing.current) {
        isRefreshing.current = true;
        try {
          await refreshSession();
          console.log('Initial session refresh successful');
        } catch (error) {
          console.error('Initial session refresh failed:', error);
          if (error.message?.includes('rate_limit')) {
            toast.error("Too many refresh attempts. Please wait a moment.");
          } else {
            toast.error("Session refresh failed. Please log in again.");
            navigate("/login");
          }
        } finally {
          isRefreshing.current = false;
        }

        // Set up new refresh interval
        refreshIntervalRef.current = window.setInterval(async () => {
          if (isRefreshing.current) return;
          isRefreshing.current = true;
          
          try {
            const refreshedSession = await refreshSession();
            if (!refreshedSession) {
              console.log('Session refresh failed, redirecting to login...');
              toast.error("Session expired. Please log in again.");
              navigate("/login");
              return;
            }
            console.log('Session refreshed successfully');
          } catch (error) {
            console.error('Failed to refresh session:', error);
            if (error.message?.includes('rate_limit')) {
              toast.error("Too many refresh attempts. Please wait a moment.");
            } else {
              toast.error("Failed to refresh session. Please log in again.");
              navigate("/login");
            }
          } finally {
            isRefreshing.current = false;
          }
        }, 240000); // Refresh every 4 minutes
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
        console.log('Auth state changed:', event, session?.user?.id);
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