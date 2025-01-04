import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SessionHandlerProps {
  children: React.ReactNode;
}

export const SessionHandler = ({ children }: SessionHandlerProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out, cleaning up...');
        queryClient.clear();
        localStorage.clear();
        sessionStorage.clear();
        navigate('/login');
      } else if (event === 'SIGNED_IN') {
        console.log('User signed in:', session?.user?.id);
        queryClient.invalidateQueries();
        navigate('/predict');
      } else if (event === 'USER_UPDATED') {
        console.log('User updated:', session?.user?.id);
        queryClient.invalidateQueries();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, navigate]);

  return <>{children}</>;
};