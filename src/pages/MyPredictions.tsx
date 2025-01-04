import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { DashboardPredictions } from "@/components/dashboard/sections/DashboardPredictions";
import { useUserPredictions } from "@/components/dashboard/useUserPredictions";
import { toast } from "sonner";
import { useUserProfile } from "@/components/dashboard/UserProfile";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

export default function MyPredictions() {
  const session = useSession();
  const navigate = useNavigate();
  const userId = session?.user?.id;
  const { data: predictions, isError: predictionsError, isLoading } = useUserPredictions(userId);
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

  // Get unique rounds for the selector
  const rounds = Object.values(predictionsByRound)
    .sort((a, b) => parseInt(b.roundName) - parseInt(a.roundName));

  // Filter predictions by selected round
  const filteredPredictions = selectedRound
    ? { [selectedRound]: predictionsByRound[selectedRound] }
    : predictionsByRound;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-2xl font-bold">Loading predictions...</h1>
        </div>
      </div>
    );
  }

  if (!predictions || predictions.length === 0) {
    return (
      <div className="space-y-8">
        <section className="text-center space-y-3">
          <h1 className="text-2xl font-bold">My Predictions</h1>
          <Card className="p-6">
            <p className="text-muted-foreground">No predictions found</p>
          </Card>
        </section>
      </div>
    );
  }

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
        <Select value={selectedRound} onValueChange={setSelectedRound}>
          <SelectTrigger>
            <SelectValue placeholder="Select a round" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Rounds</SelectItem>
            {rounds.map((round) => (
              <SelectItem key={round.roundId} value={round.roundId}>
                Round {round.roundName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DashboardPredictions
        predictionsByRound={filteredPredictions}
        userName={profile?.display_name || "User"}
      />
    </div>
  );
}