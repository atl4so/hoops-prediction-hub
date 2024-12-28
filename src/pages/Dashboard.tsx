import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { GameCard } from "@/components/games/GameCard";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      } else {
        setUserId(session.user.id);
      }
    };
    
    checkAuth();
  }, [navigate]);

  const { data: predictions, isLoading } = useQuery({
    queryKey: ['predictions', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('predictions')
        .select(`
          *,
          game:games (
            id,
            game_date,
            home_team:teams!games_home_team_id_fkey (name, logo_url),
            away_team:teams!games_away_team_id_fkey (name, logo_url),
            round:rounds(id, name)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[200px]" />
          ))}
        </div>
      </div>
    );
  }

  // Group predictions by round
  const predictionsByRound = predictions?.reduce((acc, prediction) => {
    const roundId = prediction.game.round.id;
    if (!acc[roundId]) {
      acc[roundId] = {
        name: prediction.game.round.name,
        predictions: []
      };
    }
    acc[roundId].predictions.push(prediction);
    return acc;
  }, {} as Record<string, { name: string; predictions: typeof predictions }>) || {};

  return (
    <div className="space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Your Predictions</h1>
        <p className="text-muted-foreground">
          Track your predictions and their outcomes
        </p>
      </section>

      <div className="space-y-12">
        {Object.entries(predictionsByRound).map(([roundId, { name, predictions }]) => (
          <section key={roundId} className="space-y-6">
            <h2 className="text-2xl font-display font-semibold tracking-tight">
              Round {name}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {predictions.map((prediction) => (
                <GameCard
                  key={prediction.game.id}
                  game={prediction.game}
                  isAuthenticated={true}
                  userId={userId}
                  prediction={prediction}
                />
              ))}
            </div>
          </section>
        ))}

        {!predictions?.length && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">You haven't made any predictions yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;