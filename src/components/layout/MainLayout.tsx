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
        .single();

      if (error) throw error;
      return data as BackgroundSetting;
    },
  });

  return (
    <div className="min-h-screen flex flex-col w-full relative">
      {activeBackground?.url && (
        <div 
          style={{ 
            position: 'fixed',
            top: '-10vh', // Extend beyond viewport
            left: '-10vw', // Extend beyond viewport
            right: '-10vw', // Extend beyond viewport
            bottom: '-10vh', // Extend beyond viewport
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: -1,
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
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '120vw', // Larger than viewport
              height: '120vh', // Larger than viewport
              transform: 'translate(-50%, -50%)',
              objectFit: 'cover',
              opacity: activeBackground.opacity / 100,
              pointerEvents: 'none',
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