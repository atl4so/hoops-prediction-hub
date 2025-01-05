import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GamesList } from "@/components/games/GamesList";
import { PageHeader } from "@/components/shared/PageHeader";

export default function Predict() {
  const session = useSession();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/login");
          return;
        }
        setUserId(session.user.id);
      } catch (error) {
        console.error('Session check error:', error);
        toast.error("Session error. Please try logging in again.");
        navigate("/login");
      }
    };

    checkSession();
  }, [navigate]);

  return (
    <div className="container max-w-5xl mx-auto py-8 animate-fade-in">
      <PageHeader title="Predict">
        <p className="text-muted-foreground">Make your predictions for upcoming games</p>
      </PageHeader>
      <GamesList isAuthenticated={!!session} userId={userId || undefined} />
    </div>
  );
}