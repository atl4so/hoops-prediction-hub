import { useEffect, useState } from "react";
import { AppHeader } from "./AppHeader";
import { supabase } from "@/integrations/supabase/client";

interface BackgroundSettings {
  url: string;
  opacity: number;
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [activeBackground, setActiveBackground] = useState<BackgroundSettings | null>(null);

  useEffect(() => {
    const fetchBackground = async () => {
      const { data, error } = await supabase
        .from("background_settings")
        .select("*")
        .eq("is_active", true)
        .maybeSingle();

      if (!error && data) {
        setActiveBackground(data);
      }
    };

    fetchBackground();
  }, []);

  return (
    <div className="min-h-screen flex flex-col w-full relative">
      {activeBackground?.url && (
        <div 
          className="fixed inset-0 w-full h-full -z-10 bg-black"
          style={{ 
            touchAction: 'none', 
            userSelect: 'none',
          }}
        >
          <img 
            src={activeBackground.url} 
            alt="Background" 
            className="absolute w-full h-full object-cover"
            style={{ 
              opacity: activeBackground.opacity / 100,
              maxWidth: '1920px',
              maxHeight: '1080px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>
      )}
      <AppHeader />
      <main className="flex-1 relative z-10">
        {children}
      </main>
    </div>
  );
}