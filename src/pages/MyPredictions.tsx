import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { DashboardPredictions } from "@/components/dashboard/sections/DashboardPredictions";
import { useUserPredictions } from "@/components/dashboard/useUserPredictions";
import { toast } from "sonner";
import { useUserProfile } from "@/components/dashboard/UserProfile";
import { RoundSelector } from "@/components/dashboard/predictions/RoundSelector";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { supabase } from "@/integrations/supabase/client";

export default function MyPredictions() {
  const session = useSession();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const { data: predictions, isError: predictionsError, isLoading } = useUserPredictions(userId);
  const { data: profile } = useUserProfile(userId);
  const [selectedRound, setSelectedRound] = useState<string>("");

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/login");
          return;
        }
        setUserId(session.user.id);
      } catch (error) {
        console.error('Session check error:', error);
        toast.error("Session error. Please try logging in again.");
        navigate("/login");
      }
    };

    checkSession();
  }, [navigate]);

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
        <PageHeader title="My Predictions">
          <p className="text-muted-foreground">Track your predictions and their outcomes</p>
        </PageHeader>
        <Card className="p-6">
          <p className="text-muted-foreground">No predictions found</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader title="My Predictions">
        <p className="text-muted-foreground">Track your predictions and their outcomes</p>
      </PageHeader>

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
