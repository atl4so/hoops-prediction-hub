import { useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { DashboardPredictions } from "@/components/dashboard/sections/DashboardPredictions";
import { useUserPredictions } from "@/components/dashboard/useUserPredictions";
import { toast } from "sonner";

export default function MyPredictions() {
  const session = useSession();
  const navigate = useNavigate();
  const userId = session?.user?.id;
  const { data: predictions, isError: predictionsError } = useUserPredictions(userId);

  useEffect(() => {
    if (!session) {
      navigate("/login");
      return;
    }
  }, [session, navigate]);

  if (predictionsError) {
    toast.error("Failed to load predictions");
    return null;
  }

  // Group predictions by round
  const predictionsByRound = predictions?.reduce((acc, prediction) => {
    const roundId = prediction.game.round.id;
    if (!acc[roundId]) {
      acc[roundId] = {
        roundId,
        roundName: prediction.game.round.name,
        predictions: []
      };
    }
    acc[roundId].predictions.push({
      id: prediction.id,
      game: {
        id: prediction.game.id,
        game_date: prediction.game.game_date,
        round: prediction.game.round,
        home_team: prediction.game.home_team,
        away_team: prediction.game.away_team,
        game_results: prediction.game.game_results
      },
      prediction: {
        prediction_home_score: prediction.prediction_home_score,
        prediction_away_score: prediction.prediction_away_score,
        points_earned: prediction.points_earned
      }
    });
    return acc;
  }, {} as Record<string, { roundId: string; roundName: string; predictions: Array<any> }>) || {};

  return (
    <div className="space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">My Predictions</h1>
        <p className="text-muted-foreground">
          Track your predictions and their outcomes
        </p>
      </section>

      <DashboardPredictions
        predictionsByRound={predictionsByRound}
        userName={session?.user?.email?.split('@')[0] || "User"}
      />
    </div>
  );
}