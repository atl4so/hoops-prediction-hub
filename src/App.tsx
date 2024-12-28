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
    },
  },
});

// Session handler component to manage invalid sessions
const SessionHandler = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const handleAuthError = async (error: any) => {
      if (error?.status === 403 && error?.message?.includes('User from sub claim in JWT does not exist')) {
        // Clear local storage and session storage
        localStorage.clear();
        sessionStorage.clear();
        // Force clear the Supabase session
        await supabase.auth.signOut({ scope: 'local' });
        // Reload the page to reset all states
        window.location.reload();
      }
    };

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        queryClient.clear();
      }
    });

    // Add error handler to Supabase client
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        if (!response.ok && response.status === 403) {
          const errorData = await response.clone().json();
          await handleAuthError(errorData);
        }
        return response;
      } catch (error) {
        await handleAuthError(error);
        throw error;
      }
    };

    return () => {
      subscription.unsubscribe();
      window.fetch = originalFetch;
    };
  }, []);

  return <>{children}</>;
};

const App = () => {
  return (
    <SessionContextProvider supabaseClient={supabase} initialSession={null}>
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