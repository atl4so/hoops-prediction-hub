import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { BackgroundSetting } from "@/types/background";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const location = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      if (!session) {
        const { data: { session: newSession } } = await supabase.auth.getSession();
        if (!newSession) {
          toast.error("You need to log in to access this page.");
        }
      }
    };

    checkSession();
  }, [session]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
