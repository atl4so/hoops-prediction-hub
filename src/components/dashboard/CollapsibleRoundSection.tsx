import { UserPredictionCard } from "./UserPredictionCard";

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
  defaultExpanded?: boolean;
}

export function CollapsibleRoundSection({
  predictions,
}: CollapsibleRoundSectionProps) {
  if (!predictions?.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {predictions.map((prediction) => (
          <UserPredictionCard
            key={prediction.id}
            game={prediction.game}
            prediction={prediction.prediction}
            isOwnPrediction={true}
          />
        ))}
      </div>
    </div>
  );
}