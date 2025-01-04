import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { MainLayout } from "./components/layout/MainLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import { RegisterForm } from "./components/auth/RegisterForm";
import Overview from "./pages/Overview";
import Admin from "./pages/Admin";
import Leaderboard from "./pages/Leaderboard";
import Predict from "./pages/Predict";
import Following from "./pages/Following";
import Rules from "./pages/Rules";
import Terms from "./pages/Terms";
import MyPredictions from "./pages/MyPredictions";
import { supabase } from "./integrations/supabase/client";
import { toast } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 5,
    },
  },
});

const SessionHandler = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const cleanupSession = async () => {
      try {
        console.log('Cleaning up session...');
        await supabase.auth.signOut();
        localStorage.clear();
        sessionStorage.clear();
        queryClient.clear();
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
          await cleanupSession();
          return;
        }

        if (!session) {
          console.log('No session found');
          await cleanupSession();
          return;
        }

        // Verify the session is still valid
        const { data: { user }, error: refreshError } = await supabase.auth.getUser();
        
        if (refreshError || !user) {
          console.error('User verification failed:', refreshError);
          await cleanupSession();
          return;
        }

        setIsAuthenticated(true);
        console.log('Session verified for user:', user.id);
      } catch (error) {
        console.error('Session verification error:', error);
        toast.error("Session error. Please try logging in again.");
        await cleanupSession();
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, !!session);
      
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        console.log('User signed out or deleted, cleaning up...');
        await cleanupSession();
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setIsAuthenticated(true);
        queryClient.invalidateQueries();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return null;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <SessionContextProvider 
      supabaseClient={supabase}
      initialSession={null}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SessionHandler>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<RegisterForm />} />
                  <Route path="/overview" element={<Overview />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/predict" element={<Predict />} />
                  <Route path="/following" element={<Following />} />
                  <Route path="/my-predictions" element={<MyPredictions />} />
                  <Route path="/rules" element={<Rules />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </MainLayout>
            </SessionHandler>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </SessionContextProvider>
  );
};

export default App;