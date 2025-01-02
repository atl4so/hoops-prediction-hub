import { useEffect } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { GamesList } from "@/components/games/GamesList";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, InfoIcon } from "lucide-react";

export default function Predict() {
  const session = useSession();
  const navigate = useNavigate();
  const supabase = useSupabaseClient();

  useEffect(() => {
    const checkSession = async () => {
      if (!session) {
        navigate('/login');
        return;
      }

      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          console.error('Session error:', error);
          await supabase.auth.signOut();
          toast.error("Your session has expired. Please sign in again.");
          navigate('/login');
        }
      } catch (error) {
        console.error('Session check error:', error);
        await supabase.auth.signOut();
        toast.error("Your session has expired. Please sign in again.");
        navigate('/login');
      }
    };

    checkSession();
  }, [session, navigate, supabase.auth]);

  if (!session) {
    return null;
  }

  return (
    <div className="space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Make Predictions</h1>
        <p className="text-muted-foreground">
          Predict the outcomes of upcoming Euroleague games
        </p>
      </section>

      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          Points are calculated automatically after each game. Updates may take up to 6 hours.
        </AlertDescription>
      </Alert>

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