import { useQuery } from "@tanstack/react-query";
import { AppHeader } from "./AppHeader";
import { Footer } from "./Footer";
import { supabase } from "@/integrations/supabase/client";
import type { BackgroundSetting } from "@/types/supabase";
import { useEffect } from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { data: activeBackground, refetch } = useQuery({
    queryKey: ["active-background"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("background_settings")
        .select("*")
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;
      return data as BackgroundSetting | null;
    },
  });

  // Subscribe to changes in background_settings table
  useEffect(() => {
    const channel = supabase
      .channel('background_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'background_settings'
        },
        () => {
          // Refetch the active background when any changes occur
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  return (
    <div className="min-h-screen flex flex-col w-full relative overflow-hidden">
      {activeBackground?.url && (
        <div 
          className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none"
          style={{
            zIndex: 0,
          }}
        >
          {/* Black overlay with fixed opacity */}
          <div className="absolute inset-0 bg-black opacity-40" />
          {/* Background image with adjustable opacity */}
          <img 
            src={activeBackground.url} 
            alt="Background" 
            className="absolute w-full h-full object-cover"
            style={{ 
              opacity: activeBackground.opacity / 100,
            }}
          />
        </div>
      )}
      <div className="relative z-10 flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-1 relative">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}