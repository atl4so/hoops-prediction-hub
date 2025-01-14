import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { RoundSummaryDialog } from "./predictions/RoundSummaryDialog";

interface CollapsibleRoundSectionProps {
  roundId: string;
  roundName: string;
  userName: string;
  predictions: Array<{
    game: {
      game_date: string;
      home_team: {
        name: string;
        logo_url: string;
      };
      away_team: {
        name: string;
        logo_url: string;
      };
      game_results?: Array<{
        home_score: number;
        away_score: number;
        is_final: boolean;
      }>;
    };
    prediction: {
      prediction_home_score: number;
      prediction_away_score: number;
      points_earned?: number;
    };
  }>;
}

export function CollapsibleRoundSection({
  roundId,
  roundName,
  predictions,
  userName,
}: CollapsibleRoundSectionProps) {
  // Check if all games in the round are finished
  const allGamesFinished = predictions.every(
    (pred) => pred.game.game_results?.[0]?.is_final
  );

  const totalPoints = predictions.reduce(
    (sum, pred) => sum + (pred.prediction.points_earned || 0),
    0
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Round {roundName}</h2>
          <span className="text-orange-500 font-bold">{totalPoints} points</span>
        </div>
        {allGamesFinished && (
          <RoundSummaryDialog
            roundName={roundName}
            userName={userName}
            predictions={predictions}
          />
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {predictions.map((prediction) => (
          <div
            key={`${prediction.game.home_team.name}-${prediction.game.away_team.name}`}
            className="bg-card rounded-lg p-4 space-y-4"
          >
            <div className="text-sm text-muted-foreground">
              {new Date(prediction.game.game_date).toLocaleDateString()}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={prediction.game.home_team.logo_url}
                  alt={prediction.game.home_team.name}
                  className="w-8 h-8 object-contain"
                />
                <span className="text-sm font-medium">
                  {prediction.game.home_team.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {prediction.game.game_results?.[0]?.is_final ? (
                  <span className="font-bold">
                    {prediction.game.game_results[0].home_score} -{" "}
                    {prediction.game.game_results[0].away_score}
                  </span>
                ) : (
                  <span className="font-bold">
                    {prediction.prediction.prediction_home_score} -{" "}
                    {prediction.prediction.prediction_away_score}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {prediction.game.away_team.name}
                </span>
                <img
                  src={prediction.game.away_team.logo_url}
                  alt={prediction.game.away_team.name}
                  className="w-8 h-8 object-contain"
                />
              </div>
            </div>
            {prediction.prediction.points_earned !== undefined && (
              <div className="text-right text-sm font-bold text-orange-500">
                {prediction.prediction.points_earned} points
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}