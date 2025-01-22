import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TeamDisplay } from "./TeamDisplay";
import { GameDateTime } from "./GameDateTime";
import { PredictionDisplay } from "./PredictionDisplay";
import { PredictionButton } from "./PredictionButton";
import { BarChart2 } from "lucide-react";
import { useState } from "react";
import { GameStatsModal } from "./GameStatsModal";

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
    game_results?: Array<{
      home_score: number;
      away_score: number;
      is_final: boolean;
    }>;
  };
  prediction?: {
    prediction_home_score: number;
    prediction_away_score: number;
    points_earned?: number;
  } | null;
  showPredictionButton?: boolean;
}

export function GameCard({ game, prediction, showPredictionButton = true }: GameCardProps) {
  const [showStats, setShowStats] = useState(false);
  const gameResult = game.game_results?.[0];
  const isFinished = gameResult?.is_final;

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <GameDateTime date={game.game_date} />
            
            <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
              <TeamDisplay 
                name={game.home_team.name}
                logo={game.home_team.logo_url}
                score={gameResult?.home_score}
                align="right"
              />
              <span className="text-xl font-bold">vs</span>
              <TeamDisplay
                name={game.away_team.name}
                logo={game.away_team.logo_url}
                score={gameResult?.away_score}
                align="left"
              />
            </div>

            {prediction && (
              <PredictionDisplay prediction={prediction} />
            )}

            <div className="flex justify-between items-center">
              {showPredictionButton && (
                <PredictionButton 
                  gameId={game.id} 
                  gameDate={game.game_date}
                  hasPrediction={!!prediction}
                />
              )}
              
              {isFinished && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowStats(true)}
                  className="ml-auto"
                >
                  <BarChart2 className="h-4 w-4 mr-2" />
                  Stats
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <GameStatsModal 
        isOpen={showStats}
        onOpenChange={setShowStats}
        gameId={game.id}
        homeTeam={game.home_team.name}
        awayTeam={game.away_team.name}
      />
    </>
  );
}