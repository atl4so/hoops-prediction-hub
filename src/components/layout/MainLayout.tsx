import { useQuery } from "@tanstack/react-query";
import { AppHeader } from "./AppHeader";
import { Footer } from "./Footer";
import { supabase } from "@/integrations/supabase/client";
import type { BackgroundSetting } from "@/types/supabase";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { data: activeBackground } = useQuery({
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

  return (
    <div className="min-h-screen flex flex-col w-full relative">
      {activeBackground?.url && (
        <div 
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: -1,
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            perspective: 1000,
            willChange: 'transform',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'black',
            }}
          />
          <img 
            src={activeBackground.url} 
            alt="Background" 
            style={{ 
              position: 'fixed',
              top: '-20vh',
              left: '-20vw',
              width: '140vw',
              height: '140vh',
              objectFit: 'cover',
              opacity: activeBackground.opacity / 100,
              pointerEvents: 'none',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              willChange: 'transform',
            }}
          />
        </div>
      )}
      <AppHeader />
      <main className="flex-1 relative">
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}