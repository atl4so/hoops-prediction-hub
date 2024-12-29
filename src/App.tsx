import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { useEffect } from 'react';
import { MainLayout } from "./components/layout/MainLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import { RegisterForm } from "./components/auth/RegisterForm";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Leaderboard from "./pages/Leaderboard";
import Predict from "./pages/Predict";
import Following from "./pages/Following";
import Rules from "./pages/Rules";
import Terms from "./pages/Terms";
import { supabase } from "./integrations/supabase/client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60, // Cache data for 1 minute
      gcTime: 1000 * 60 * 5, // Keep unused data in cache for 5 minutes (renamed from cacheTime)
    },
  },
});

// Session handler component to manage invalid sessions
const SessionHandler = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const handleInvalidSession = async () => {
      try {
        localStorage.clear();
        sessionStorage.clear();
        await supabase.auth.signOut();
        queryClient.clear();
        window.location.href = '/login';
      } catch (error) {
        console.error('Error handling invalid session:', error);
      }
    };

    // Subscribe to auth state changes with debounced handler
    let debounceTimeout: NodeJS.Timeout;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(async () => {
        console.log('Auth state changed:', event, !!session);
        
        if (event === 'SIGNED_OUT') {
          queryClient.clear();
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          const { data: { user }, error } = await supabase.auth.getUser();
          if (error || !user) {
            console.error('Session verification failed:', error);
            await handleInvalidSession();
          } else {
            console.log('Session verified successfully');
            queryClient.invalidateQueries();
          }
        }
      }, 100); // Debounce auth state changes
    });

    // Add response interceptor with error handling
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        if (response.status === 403) {
          const errorData = await response.clone().json();
          if (
            errorData.message?.includes('Session from session_id claim in JWT does not exist') ||
            errorData.code === 'session_not_found'
          ) {
            await handleInvalidSession();
          }
        }
        return response;
      } catch (error) {
        console.error('Fetch error:', error);
        throw error;
      }
    };

    // Initial session check
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login';
        }
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
      window.fetch = originalFetch;
      clearTimeout(debounceTimeout);
    };
  }, []);

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
                  <Route path="/" element={<Navigate to="/predict" replace />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<RegisterForm />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/predict" element={<Predict />} />
                  <Route path="/following" element={<Following />} />
                  <Route path="/rules" element={<Rules />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="*" element={<Navigate to="/predict" replace />} />
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