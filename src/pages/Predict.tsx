import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GamesList } from "@/components/games/GamesList";
import { PageHeader } from "@/components/shared/PageHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

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
    <div className="container max-w-5xl mx-auto py-8 animate-fade-in space-y-6">
      <PageHeader title="Predict">
        <p>Make your predictions for upcoming games</p>
      </PageHeader>

      <Alert variant="destructive" className="bg-white/95 backdrop-blur-sm border-red-500/50 shadow-lg">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="font-medium text-black/80">
          Important: Predictions must be submitted at least 1 hour before the game starts. Late predictions will not be accepted.
        </AlertDescription>
      </Alert>

      <GamesList userId={userId} isAuthenticated={!!session} />
    </div>
  );
}