import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-react';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { MainLayout } from "./components/layout/MainLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import { RegisterForm } from "./components/auth/RegisterForm";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Leaderboard from "./pages/Leaderboard";
import { useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient({
    supabaseUrl: "https://nuswsfxmaqyzfmpmbuky.supabase.co",
    supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51c3dzZnhtYXF5emZtcG1idWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzNDAzMTIsImV4cCI6MjA1MDkxNjMxMn0.wNcFq7gZwSUQS6tV0v4njsqVvydWe9qsamLDSKnWEIY"
  }));

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </MainLayout>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </SessionContextProvider>
  );
};

export default App;