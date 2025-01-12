import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { clearAuthSession } from '@/utils/auth';
import { toast } from "sonner";

interface SessionHandlerProps {
  children: React.ReactNode;
  queryClient: QueryClient;
}

export const SessionHandler = ({ children, queryClient }: SessionHandlerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    let authListener: { subscription: { unsubscribe: () => void } } | null = null;

    const checkSession = async () => {
      try {
        console.log('Checking session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          if (mounted) {
            setIsAuthenticated(false);
            setIsLoading(false);
            await clearAuthSession();
            navigate('/login');
            toast.error("Session error. Please try logging in again.");
          }
          return;
        }

        if (!session) {
          console.log('No session found');
          if (mounted) {
            setIsAuthenticated(false);
            setIsLoading(false);
            navigate('/login');
          }
          return;
        }

        // Verify the session is still valid
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          console.error('Session refresh error:', refreshError);
          if (mounted) {
            setIsAuthenticated(false);
            setIsLoading(false);
            await clearAuthSession();
            navigate('/login');
            toast.error("Session expired. Please log in again.");
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
          navigate('/login');
          toast.error("Session verification failed. Please try logging in again.");
        }
      }
    };

    // Initial session check
    checkSession();

    // Set up auth state change listener
    const setupAuthListener = async () => {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          setIsAuthenticated(false);
          setIsLoading(false);
          queryClient.clear();
          navigate('/login');
        } else if (event === 'SIGNED_IN') {
          if (session) {
            setIsAuthenticated(true);
            setIsLoading(false);
            queryClient.invalidateQueries();
          } else {
            setIsAuthenticated(false);
            setIsLoading(false);
            await clearAuthSession();
            navigate('/login');
          }
        }
      });
      
      authListener = data;
    };

    setupAuthListener();

    // Cleanup function
    return () => {
      mounted = false;
      if (authListener) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [queryClient, navigate]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
};