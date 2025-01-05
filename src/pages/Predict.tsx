import { useEffect } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { GamesList } from "@/components/games/GamesList";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";

export default function Predict() {
  const session = useSession();
  const navigate = useNavigate();
  const supabase = useSupabaseClient();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/login");
          return;
        }
      } catch (error) {
        console.error('Session check error:', error);
        toast.error("Session error. Please try logging in again.");
        navigate("/login");
      }
    };

    checkSession();
  }, [navigate, supabase.auth]);

  if (!session) {
    return null;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader title="Make Predictions">
        <p className="text-muted-foreground">Predict the outcomes of upcoming Euroleague games</p>
      </PageHeader>

      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Important: Predictions close 1 hour before each game starts. Make sure to submit your predictions on time!
        </AlertDescription>
      </Alert>

      <GamesList 
        isAuthenticated={!!session} 
        userId={session.user.id}
      />
    </div>
  );
}