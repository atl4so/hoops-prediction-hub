import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { CollapsibleRoundSection } from "@/components/dashboard/CollapsibleRoundSection";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { RoundSelector } from "@/components/dashboard/predictions/RoundSelector";

export default function MyPredictions() {
  const session = useSession();
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRound, setSelectedRound] = useState("");

  useEffect(() => {
    const fetchPredictions = async () => {
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const query = supabase
          .from("predictions")
          .select(`
            id,
            prediction_home_score,
            prediction_away_score,
            points_earned,
            game:games (
              id,
              game_date,
              round:rounds (
                id,
                name
              ),
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
              game_results (
                home_score,
                away_score,
                is_final
              )
            )
          `)
          .eq("user_id", session.user.id)
          .order('created_at', { ascending: false });

        if (selectedRound) {
          query.eq('game.round_id', selectedRound);
        }

        const { data, error } = await query;

        if (error) throw error;

        const transformedPredictions = (data || []).map(pred => ({
          id: pred.id,
          game: {
            ...pred.game,
            game_results: Array.isArray(pred.game.game_results) 
              ? pred.game.game_results 
              : pred.game.game_results 
                ? [pred.game.game_results] 
                : []
          },
          prediction: {
            prediction_home_score: pred.prediction_home_score,
            prediction_away_score: pred.prediction_away_score,
            points_earned: pred.points_earned
          }
        }));

        setPredictions(transformedPredictions);
      } catch (error) {
        console.error('Error fetching predictions:', error);
        toast.error("Failed to load predictions. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPredictions();
  }, [session, selectedRound]);

  if (!session) {
    return (
      <div className="container max-w-5xl mx-auto py-8 animate-fade-in">
        <PageHeader title="My Predictions">
          <p className="text-muted-foreground">Track your predictions and their outcomes</p>
        </PageHeader>
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-muted-foreground">Please log in to view your predictions</p>
            <Button onClick={() => navigate('/login')} className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Log In
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container max-w-5xl mx-auto py-8 animate-fade-in">
        <PageHeader title="My Predictions">
          <p className="text-muted-foreground">Track your predictions and their outcomes</p>
        </PageHeader>
        <Card className="p-6">
          <p className="text-muted-foreground">Loading predictions...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-8 animate-fade-in space-y-6">
      <PageHeader title="My Predictions">
        <p className="text-muted-foreground">Track your predictions and their outcomes</p>
      </PageHeader>

      <div className="w-full max-w-xs">
        <RoundSelector
          selectedRound={selectedRound}
          onRoundChange={setSelectedRound}
          className="w-full"
        />
      </div>

      {!predictions || predictions.length === 0 ? (
        <Card className="p-6">
          <p className="text-muted-foreground">
            {selectedRound 
              ? "No predictions found for this round" 
              : "No predictions found"}
          </p>
        </Card>
      ) : (
        <CollapsibleRoundSection
          roundId={predictions[0]?.game?.round?.id || ""}
          roundName={predictions[0]?.game?.round?.name || ""}
          predictions={predictions}
          userName={session?.user?.email || ""}
        />
      )}
    </div>
  );
}