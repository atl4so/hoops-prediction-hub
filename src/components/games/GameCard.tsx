import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PredictionDialog } from "@/components/predictions/PredictionDialog";
import { TeamDisplay } from "./TeamDisplay";
import { GameDateTime } from "./GameDateTime";
import { PointsBreakdownDialog } from "./PointsBreakdownDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface GameCardProps {
  game: {
    id: string;
    game_date: string;
    home_team: { name: string; logo_url: string };
    away_team: { name: string; logo_url: string };
    round: { name: string };
  };
  isAuthenticated: boolean;
  userId?: string;
  prediction?: {
    prediction_home_score: number;
    prediction_away_score: number;
    points_earned?: number;
  };
}

export function GameCard({ game, isAuthenticated, userId, prediction }: GameCardProps) {
  const [isPredictionOpen, setIsPredictionOpen] = useState(false);
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);

  // Fetch game result
  const { data: gameResult } = useQuery({
    queryKey: ['game-result', game.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('game_results')
        .select('*')
        .eq('game_id', game.id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const isGameFinished = !!gameResult?.is_final;

  return (
    <>
      <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-primary/5 hover:border-primary/10 transition-all duration-300">
        <CardContent className="p-4 space-y-4">
          {/* Teams Section */}
          <div className="flex items-center justify-between gap-2">
            <TeamDisplay 
              name={game.home_team.name}
              logoUrl={game.home_team.logo_url}
            />

            {/* VS Badge */}
            <div className="px-3 py-1 rounded-full text-xs font-medium bg-primary/5 text-primary/80">
              VS
            </div>

            <TeamDisplay 
              name={game.away_team.name}
              logoUrl={game.away_team.logo_url}
            />
          </div>

          <GameDateTime date={game.game_date} />

          {isGameFinished && (
            <div className="text-center space-y-1">
              <div className="text-sm font-medium">Final Result</div>
              <div className="text-lg font-semibold">
                {gameResult.home_score} - {gameResult.away_score}
              </div>
            </div>
          )}

          {prediction && (
            <div className="space-y-2 text-center">
              <div className="text-sm text-muted-foreground">
                Your Prediction: {prediction.prediction_home_score} - {prediction.prediction_away_score}
              </div>
              {prediction.points_earned !== undefined && (
                <div className="text-sm">
                  Points: {prediction.points_earned}{" "}
                  <button
                    onClick={() => setIsBreakdownOpen(true)}
                    className="text-[#8B5CF6] hover:text-[#7C3AED] font-medium hover:underline"
                  >
                    (See breakdown)
                  </button>
                </div>
              )}
            </div>
          )}

          {!prediction && (
            <div className="flex justify-center">
              <button
                onClick={() => setIsPredictionOpen(true)}
                disabled={!isAuthenticated}
                className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50"
              >
                Make Prediction
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {isAuthenticated && userId && (
        <>
          <PredictionDialog
            game={game}
            isOpen={isPredictionOpen}
            onClose={() => setIsPredictionOpen(false)}
            userId={userId}
          />
          
          {prediction && gameResult && (
            <PointsBreakdownDialog
              isOpen={isBreakdownOpen}
              onClose={() => setIsBreakdownOpen(false)}
              prediction={prediction}
              result={{
                home_score: gameResult.home_score,
                away_score: gameResult.away_score,
              }}
            />
          )}
        </>
      )}
    </>
  );
}