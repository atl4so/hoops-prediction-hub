import { Card, CardContent } from "@/components/ui/card";
import { TeamDisplay } from "./TeamDisplay";
import { GameDateTime } from "./GameDateTime";
import { PredictionButton } from "./PredictionButton";
import { PredictionDialog } from "../predictions/PredictionDialog";
import { useState } from "react";

interface GameCardProps {
  game: {
    id: string;
    game_date: string;
    home_team: {
      id: string;
      name: string;
      logo_url: string;
    };
    away_team: {
      id: string;
      name: string;
      logo_url: string;
    };
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
  const [showPredictionDialog, setShowPredictionDialog] = useState(false);

  return (
    <Card className="w-full h-full flex flex-col">
      <CardContent className="pt-6 px-6 flex-1 flex flex-col">
        <div className="flex flex-col h-full">
          <GameDateTime date={game.game_date} />
          
          <div className="grid grid-cols-3 gap-4 items-center flex-1">
            <TeamDisplay
              align="right"
              team={game.home_team}
            />
            <div className="text-center text-2xl font-bold">vs</div>
            <TeamDisplay
              align="left"
              team={game.away_team}
            />
          </div>

          <div className="mt-6">
            <PredictionButton
              isAuthenticated={isAuthenticated}
              gameDate={game.game_date}
              onPrediction={() => setShowPredictionDialog(true)}
              gameId={game.id}
              userId={userId}
              prediction={prediction}
            />
          </div>
        </div>
      </CardContent>

      <PredictionDialog
        isOpen={showPredictionDialog}
        onOpenChange={setShowPredictionDialog}
        gameId={game.id}
        userId={userId}
        gameDate={game.game_date}
        homeTeam={game.home_team}
        awayTeam={game.away_team}
      />
    </Card>
  );
}