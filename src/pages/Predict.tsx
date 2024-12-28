import { useEffect } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { GamesList } from "@/components/games/GamesList";
import { toast } from "sonner";

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
        // Verify the session is still valid
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

  console.log('Predict page - Session:', session);

  if (!session) {
    console.log('No session, returning null');
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

      <GamesList 
        isAuthenticated={!!session} 
        userId={session.user.id}
      />
    </div>
  );
}