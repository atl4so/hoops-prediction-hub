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

  const { data: userProfile, isError: profileError } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        toast.error("Failed to load profile");
        throw error;
      }
      return data;
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
    enabled: !!userId
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
        highestGamePoints={userProfile?.highest_game_points}
        lowestGamePoints={userProfile?.lowest_game_points}
        highestRoundPoints={userProfile?.highest_round_points}
        lowestRoundPoints={userProfile?.lowest_round_points}
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