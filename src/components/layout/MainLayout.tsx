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

      if (error) {
        console.error("Error fetching background:", error);
        throw error;
      }
      return data as BackgroundSetting;
    },
  });

  return (
    <div className="min-h-screen flex flex-col w-full relative bg-background">
      {activeBackground?.url && (
        <div 
          className="fixed inset-0 w-full h-full -z-10"
          style={{ 
            position: 'fixed',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            touchAction: 'none',
            userSelect: 'none',
          }}
        >
          <div className="absolute inset-0 bg-black">
            <img 
              src={activeBackground.url} 
              alt="Background" 
              className="w-full h-full object-cover"
              style={{ 
                opacity: activeBackground.opacity / 100,
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                touchAction: 'none',
                userSelect: 'none',
                pointerEvents: 'none',
                objectFit: 'cover',
              }}
              loading="eager"
              crossOrigin="anonymous"
            />
          </div>
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