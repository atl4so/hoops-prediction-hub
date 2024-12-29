import { UserPredictionCard } from "./UserPredictionCard";
import { DownloadPredictionsButton } from "./DownloadPredictionsButton";
import { GameCard } from "../games/GameCard";

interface CollapsibleRoundSectionProps {
  roundId: string;
  roundName: string;
  predictions: Array<{
    id: string;
    game: {
      id: string;
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
      }>;
    };
    prediction: {
      prediction_home_score: number;
      prediction_away_score: number;
      points_earned?: number;
    } | null;
  }>;
  userName: string;
  showGames?: boolean;
}

export function CollapsibleRoundSection({
  predictions,
  roundName,
  userName,
  showGames = false
}: CollapsibleRoundSectionProps) {
  if (!predictions?.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      {!showGames && (
        <div className="flex justify-end mb-4">
          <DownloadPredictionsButton
            userName={userName}
            roundName={roundName}
            predictions={predictions.filter(p => p.prediction !== null).map(p => ({
              game: p.game,
              prediction: p.prediction!
            }))}
          />
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {predictions.map((prediction) => (
          showGames ? (
            <GameCard
              key={prediction.id}
              game={prediction.game}
              isAuthenticated={true}
              prediction={prediction.prediction}
            />
          ) : (
            <UserPredictionCard
              key={prediction.id}
              game={prediction.game}
              prediction={prediction.prediction}
              isOwnPrediction={true}
            />
          )
        ))}
      </div>
    </div>
  );
}