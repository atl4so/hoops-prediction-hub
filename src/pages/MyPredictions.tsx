import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { DashboardPredictions } from "@/components/dashboard/sections/DashboardPredictions";
import { useUserPredictions } from "@/components/dashboard/useUserPredictions";
import { toast } from "sonner";
import { useUserProfile } from "@/components/dashboard/UserProfile";
import { RoundSelector } from "@/components/dashboard/predictions/RoundSelector";

export default function MyPredictions() {
  const session = useSession();
  const navigate = useNavigate();
  const userId = session?.user?.id;
  const { data: predictions, isError: predictionsError } = useUserPredictions(userId);
  const { data: profile } = useUserProfile(userId);
  const [selectedRound, setSelectedRound] = useState<string>("");

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
      game: prediction.game,
      prediction: {
        prediction_home_score: prediction.prediction_home_score,
        prediction_away_score: prediction.prediction_away_score,
        points_earned: prediction.points_earned
      }
    });
    return acc;
  }, {} as Record<string, { roundId: string; roundName: string; predictions: Array<any> }>) || {};

  // Filter predictions by selected round
  const filteredPredictions = selectedRound
    ? { [selectedRound]: predictionsByRound[selectedRound] }
    : predictionsByRound;

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="text-center space-y-3 sm:space-y-4">
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
          My Predictions
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
          Track your predictions and their outcomes
        </p>
      </section>

      <div className="w-[240px] mx-auto">
        <RoundSelector
          selectedRound={selectedRound}
          onRoundChange={setSelectedRound}
          className="w-full"
        />
      </div>

      <DashboardPredictions
        predictionsByRound={filteredPredictions}
        userName={profile?.display_name || "User"}
      />
    </div>
  );
}