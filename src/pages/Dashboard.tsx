import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { GameCard } from "@/components/games/GameCard";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FollowingSection } from "@/components/dashboard/FollowingSection";

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

  const { data: userProfile } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userId
  });

  // Fetch all-time rank
  const { data: allTimeRank } = useQuery({
    queryKey: ['allTimeRank', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .gt('total_points', userProfile?.total_points || 0);

      if (error) throw error;
      return data.length + 1; // Add 1 because we're counting positions ahead
    },
    enabled: !!userId && !!userProfile
  });

  // Fetch current round rank
  const { data: currentRoundRank } = useQuery({
    queryKey: ['currentRoundRank', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      // First get the latest round
      const { data: rounds, error: roundError } = await supabase
        .from('rounds')
        .select('id')
        .order('start_date', { ascending: false })
        .limit(1);

      if (roundError) throw roundError;
      if (!rounds?.length) return null;

      const { data, error } = await supabase
        .rpc('get_round_rankings', { round_id: rounds[0].id });

      if (error) throw error;

      const userRank = data.findIndex(user => user.user_id === userId) + 1;
      return userRank || null;
    },
    enabled: !!userId
  });

  const { data: predictions, isLoading } = useQuery({
    queryKey: ['predictions', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('predictions')
        .select(`
          id,
          prediction_home_score,
          prediction_away_score,
          points_earned,
          game:games (
            id,
            game_date,
            home_team:teams!games_home_team_id_fkey (
              id,
              name,
              logo_url
            ),
            away_team:teams!games_away_team_id_fkey (
              id,
              name,
              logo_url
            ),
            round:rounds (
              id,
              name
            ),
            game_results!game_results_game_id_fkey (
              home_score,
              away_score,
              is_final
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching predictions:', error);
        throw error;
      }

      // Transform the data to ensure game_results is always an array
      return data.map(prediction => ({
        ...prediction,
        game: {
          ...prediction.game,
          game_results: Array.isArray(prediction.game.game_results) 
            ? prediction.game.game_results 
            : [prediction.game.game_results].filter(Boolean)
        }
      }));
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

  // Filter predictions to only count those with points (finished games)
  const finishedPredictions = predictions?.filter(pred => pred.points_earned !== null) || [];
  const totalPredictions = finishedPredictions.length;
  const totalPoints = finishedPredictions.reduce((sum, pred) => sum + (pred.points_earned || 0), 0);
  const pointsPerGame = totalPredictions > 0 ? totalPoints / totalPredictions : 0;

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
      <DashboardHeader />
      
      <StatsOverview
        totalPoints={totalPoints}
        pointsPerGame={pointsPerGame}
        totalPredictions={totalPredictions}
        highestGamePoints={userProfile?.highest_game_points}
        lowestGamePoints={userProfile?.lowest_game_points}
        highestRoundPoints={userProfile?.highest_round_points}
        lowestRoundPoints={userProfile?.lowest_round_points}
        allTimeRank={allTimeRank}
        currentRoundRank={currentRoundRank}
      />

      <FollowingSection />

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
                  prediction={{
                    prediction_home_score: prediction.prediction_home_score,
                    prediction_away_score: prediction.prediction_away_score,
                    points_earned: prediction.points_earned
                  }}
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
}

export default Dashboard;
