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
    <div className="min-h-screen flex flex-col w-full">
      {activeBackground?.url && (
        <div 
          className="fixed inset-0 w-full h-full -z-10 bg-black"
          style={{ 
            position: 'fixed',
            overflow: 'hidden',
            touchAction: 'none',
            userSelect: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <img 
            src={activeBackground.url} 
            alt="Background" 
            className="w-full h-full object-cover"
            style={{ 
              opacity: activeBackground.opacity / 100,
              position: 'fixed',
              touchAction: 'none',
              userSelect: 'none',
              pointerEvents: 'none',
              maxWidth: '1920px',
              maxHeight: '1080px',
              margin: '0 auto',
              left: '50%',
              transform: 'translateX(-50%)',
              WebkitBackfaceVisibility: 'hidden',
              WebkitTransform: 'translateX(-50%) translateZ(0)',
              willChange: 'transform'
            }}
          />
        </div>
      )}
      <AppHeader />
      <main className="flex-1">
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}