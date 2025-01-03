import { useEffect } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { GamesList } from "@/components/games/GamesList";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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
        if (error) {
          console.error('Session error:', error);
          throw error;
        }
        
        if (!user) {
          throw new Error('No user found');
        }

        // Test the connection
        const { error: testError } = await supabase
          .from('rounds')
          .select('id')
          .limit(1);

        if (testError) {
          console.error('Database connection error:', testError);
          throw testError;
        }

      } catch (error) {
        console.error('Session check error:', error);
        await supabase.auth.signOut();
        toast.error("There was an error with your session. Please sign in again.");
        navigate('/login');
      }
    };

    checkSession();
  }, [session, navigate, supabase.auth]);

  if (!session) {
    return null;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="text-center space-y-3 sm:space-y-4">
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
          Make Predictions
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
          Predict the outcomes of upcoming Euroleague games
        </p>
      </section>

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