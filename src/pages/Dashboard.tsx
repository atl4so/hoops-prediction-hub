import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FollowingSection } from "@/components/dashboard/FollowingSection";
import { CollapsibleRoundSection } from "@/components/dashboard/CollapsibleRoundSection";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const session = useSession();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      toast.error("Please sign in to access the dashboard");
      navigate('/login');
      return;
    }
    setUserId(session.user.id);
  }, [session, navigate]);

  // Query for user profile and all-time rank
  const { data: userProfileData, isError: profileError } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      // Get user profile and calculate all-time rank
      const { data: rankings } = await supabase
        .from('profiles')
        .select('id, total_points')
        .order('total_points', { ascending: false });

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!profile || !rankings) return null;

      // Calculate all-time rank
      const allTimeRank = rankings.findIndex(r => r.id === userId) + 1;

      return {
        ...profile,
        allTimeRank
      };
    },
    enabled: !!userId && !!session
  });

  // Query for current round rank
  const { data: currentRoundRank } = useQuery({
    queryKey: ['currentRoundRank', userId],
    queryFn: async () => {
      if (!userId) return null;

      // Get the current round
      const { data: currentRound } = await supabase
        .from('rounds')
        .select('id')
        .gte('end_date', new Date().toISOString())
        .order('start_date', { ascending: true })
        .limit(1)
        .single();

      if (!currentRound) return null;

      // Get rankings for the current round
      const { data: roundRankings } = await supabase
        .rpc('get_round_rankings', {
          round_id: currentRound.id
        });

      if (!roundRankings) return null;

      // Find user's rank in the current round
      const rank = roundRankings.findIndex(r => r.user_id === userId) + 1;
      return rank || null;
    },
    enabled: !!userId && !!session
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
        toast.error("Failed to load predictions");
        throw error;
      }

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
    enabled: !!userId && !!session
  });

  // Don't render anything if there's no session
  if (!session) {
    return null;
  }

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
        highestGamePoints={userProfileData?.highest_game_points}
        lowestGamePoints={userProfileData?.lowest_game_points}
        highestRoundPoints={userProfileData?.highest_round_points}
        lowestRoundPoints={userProfileData?.lowest_round_points}
        allTimeRank={userProfileData?.allTimeRank}
        currentRoundRank={currentRoundRank}
      />

      <FollowingSection />

      <div className="space-y-12">
        {Object.entries(predictionsByRound).map(([roundId, { name, predictions }]) => (
          <CollapsibleRoundSection
            key={roundId}
            roundId={roundId}
            roundName={name}
            predictions={predictions}
            userId={userId}
          />
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