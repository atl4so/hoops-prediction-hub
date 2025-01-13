import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from "./integrations/supabase/client";
import { SessionHandler } from "./components/auth/SessionHandler";
import { AppRoutes } from "./components/routing/AppRoutes";
import { ThemeProvider } from "./components/theme/ThemeProvider";

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

const App = () => {
  console.log('App component rendering'); // Debug log

  return (
    <ThemeProvider defaultTheme="system" storageKey="euroleague-theme">
      <SessionContextProvider 
        supabaseClient={supabase}
        initialSession={null}
      >
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <BrowserRouter>
              <SessionHandler queryClient={queryClient}>
                <AppRoutes />
                <Toaster />
                <Sonner />
              </SessionHandler>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </SessionContextProvider>
    </ThemeProvider>
  );
};

export default App;