import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PredictionDialog } from "@/components/predictions/PredictionDialog";
import { TeamDisplay } from "./TeamDisplay";
import { GameDateTime } from "./GameDateTime";
import { PredictionDisplay } from "./PredictionDisplay";
import { PredictionButton } from "./PredictionButton";

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

          {prediction && (
            <PredictionDisplay
              homeScore={prediction.prediction_home_score}
              awayScore={prediction.prediction_away_score}
              pointsEarned={prediction.points_earned}
            />
          )}

          {!prediction && (
            <PredictionButton
              isAuthenticated={isAuthenticated}
              gameDate={game.game_date}
              onPrediction={() => setIsPredictionOpen(true)}
            />
          )}
        </CardContent>
      </Card>

      {isAuthenticated && userId && (
        <PredictionDialog
          game={game}
          isOpen={isPredictionOpen}
          onClose={() => setIsPredictionOpen(false)}
          userId={userId}
        />
      )}
    </>
  );
}