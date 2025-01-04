import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface SessionHandlerProps {
  children: React.ReactNode;
}

export const SessionHandler = ({ children }: SessionHandlerProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    // Check current session on mount
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('No active session found, redirecting to login...');
        queryClient.clear();
        localStorage.clear();
        sessionStorage.clear();
        navigate('/login');
      } else {
        console.log('Session found:', session.user.id);
        // Prefetch user data when session exists
        queryClient.invalidateQueries();
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
        await supabase.auth.signOut({ scope: 'global' });
        navigate('/login');
      } else if (event === 'SIGNED_IN') {
        console.log('User signed in:', session?.user?.id);
        queryClient.invalidateQueries();
        navigate('/predict');
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed for user:', session?.user?.id);
        queryClient.invalidateQueries();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, navigate]);

  return <>{children}</>;
};