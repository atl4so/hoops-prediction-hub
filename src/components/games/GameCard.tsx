import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { TeamDisplay } from "./TeamDisplay";
import { GameDateTime } from "./GameDateTime";
import { PredictionButton } from "./PredictionButton";
import { PredictionDialog } from "../predictions/PredictionDialog";
import { useState } from "react";
import { useLocation } from "react-router-dom";

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
}

export function GameCard({ game, isAuthenticated, userId }: GameCardProps) {
  const [showPredictionDialog, setShowPredictionDialog] = useState(false);
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';

  return (
    <Card className="w-full">
      <CardContent className="pt-6 px-6">
        <div className="space-y-4">
          <GameDateTime date={game.game_date} />
          
          <div className="grid grid-cols-3 gap-4 items-center">
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

          {!isAdminPage && (
            <div className="mt-4">
              <PredictionButton
                isAuthenticated={isAuthenticated}
                gameDate={game.game_date}
                onPrediction={() => setShowPredictionDialog(true)}
                gameId={game.id}
                userId={userId}
              />
            </div>
          )}
        </div>
      </CardContent>

      {!isAdminPage && (
        <PredictionDialog
          isOpen={showPredictionDialog}
          onClose={() => setShowPredictionDialog(false)}
          gameId={game.id}
          userId={userId}
          gameDate={game.game_date}
          homeTeam={game.home_team}
          awayTeam={game.away_team}
        />
      )}
    </Card>
  );
}