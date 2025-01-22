import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { PredictionDialog } from "../predictions/PredictionDialog";
import { useState } from "react";
import { Trophy, Clock } from "lucide-react";
import { PredictionInsightsDialog } from "./prediction/PredictionInsightsDialog";

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
    round: {
      name: string;
    };
    arena?: {
      name: string;
      capacity: number;
    };
    game_results?: Array<{
      home_score: number;
      away_score: number;
      is_final: boolean;
    }>;
  };
  isAuthenticated: boolean;
  prediction?: {
    prediction_home_score: number;
    prediction_away_score: number;
    points_earned?: number;
  } | null;
  userId?: string;
}

export function GameCard({ game, isAuthenticated, prediction, userId }: GameCardProps) {
  const navigate = useNavigate();
  const [isPredictionOpen, setIsPredictionOpen] = useState(false);
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);
  const gameDate = new Date(game.game_date);
  const isFuture = gameDate > new Date();
  const finalResult = game.game_results?.find(result => result.is_final);

  const handlePredictClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsPredictionOpen(true);
  };

  return (
    <>
      <Card className={cn(
        "relative overflow-hidden transition-all duration-200",
        "hover:shadow-lg",
        "bg-gradient-to-br from-background to-accent/5"
      )}>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            {/* Game Status */}
            <div className="flex justify-between items-center">
              <Badge variant="outline" className="flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                Round {game.round.name}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {format(gameDate, "MMM d, HH:mm")}
              </Badge>
            </div>

            {/* Teams and Score */}
            <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
              <div className="flex flex-col items-center text-center">
                <img
                  src={game.home_team.logo_url}
                  alt={game.home_team.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-2"
                />
                <div className="space-y-1">
                  <h3 className="font-bold text-lg sm:text-xl">{game.home_team.name}</h3>
                  {finalResult && (
                    <p className="text-2xl sm:text-3xl font-bold text-primary tabular-nums">
                      {finalResult.home_score}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-xl sm:text-2xl font-semibold text-muted-foreground">
                vs
              </div>

              <div className="flex flex-col items-center text-center">
                <img
                  src={game.away_team.logo_url}
                  alt={game.away_team.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-2"
                />
                <div className="space-y-1">
                  <h3 className="font-bold text-lg sm:text-xl">{game.away_team.name}</h3>
                  {finalResult && (
                    <p className="text-2xl sm:text-3xl font-bold text-primary tabular-nums">
                      {finalResult.away_score}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Prediction or CTA */}
            {prediction ? (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <div className="text-sm text-center mb-2">Your Prediction</div>
                <div className="flex justify-center items-center gap-4">
                  <span className="text-xl font-semibold tabular-nums">
                    {prediction.prediction_home_score}
                  </span>
                  <span className="text-sm text-muted-foreground">vs</span>
                  <span className="text-xl font-semibold tabular-nums">
                    {prediction.prediction_away_score}
                  </span>
                </div>
                {prediction.points_earned !== undefined && (
                  <div className="text-center mt-2">
                    <Badge variant="secondary">
                      {prediction.points_earned} points earned
                    </Badge>
                  </div>
                )}
              </div>
            ) : (
              isFuture && (
                <div className="space-y-2 mt-4">
                  <Button 
                    className="w-full" 
                    onClick={handlePredictClick}
                  >
                    Make Prediction
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsInsightsOpen(true)}
                  >
                    How Others Predict
                  </Button>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      <PredictionDialog
        isOpen={isPredictionOpen}
        onOpenChange={setIsPredictionOpen}
        gameId={game.id}
        userId={userId}
        gameDate={game.game_date}
        homeTeam={game.home_team}
        awayTeam={game.away_team}
      />

      <PredictionInsightsDialog
        isOpen={isInsightsOpen}
        onOpenChange={setIsInsightsOpen}
        gameId={game.id}
      />
    </>
  );
}