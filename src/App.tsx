import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { MainLayout } from "./components/layout/MainLayout";
import { SessionHandler } from "./components/auth/SessionHandler";
import { AppRoutes } from "./components/routing/AppRoutes";
import { supabase } from "./integrations/supabase/client";

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
  return (
    <SessionContextProvider 
      supabaseClient={supabase}
      initialSession={null}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner
            position="top-center"
            duration={1500}
            closeButton={false}
            richColors
            theme="light"
            onClick={(e) => {
              e.toast.dismiss();
            }}
          />
          <BrowserRouter>
            <SessionHandler>
              <MainLayout>
                <AppRoutes />
              </MainLayout>
            </SessionHandler>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </SessionContextProvider>
  );
};

export default App;