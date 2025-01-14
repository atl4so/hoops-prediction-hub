import { format } from "date-fns";

interface PredictionsPreviewProps {
  userName: string;
  roundName: string;
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

export function PredictionsPreview({ userName, roundName, predictions }: PredictionsPreviewProps) {
  const totalPoints = predictions.reduce((sum, pred) => sum + (pred.prediction.points_earned || 0), 0);
  const firstGameDate = new Date(predictions[0]?.game.game_date || new Date());
  const lastGameDate = new Date(predictions[predictions.length - 1]?.game.game_date || new Date());

  return (
    <div className="p-6 space-y-6 text-gray-900 dark:text-gray-100">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">euroleague.bet</h1>
        <div className="flex items-baseline gap-2">
          <h2 className="text-xl font-semibold">Round {roundName}</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">by {userName}</span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {format(firstGameDate, "MMM d")}–{format(lastGameDate, "MMM d, yyyy")}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-lg font-medium">Total Score:</span>
        <span className="text-2xl font-bold text-orange-500">{totalPoints}</span>
      </div>

      <div className="grid gap-4">
        {predictions.map((prediction) => (
          <div key={`${prediction.game.home_team.name}-${prediction.game.away_team.name}`} className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span>{prediction.game.home_team.name} vs {prediction.game.away_team.name}</span>
                <span className="text-orange-500 font-medium">{prediction.prediction.points_earned || 0}p</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="text-emerald-600 dark:text-emerald-400 font-medium">
                    F {prediction.game.game_results?.[0]?.home_score || '-'}–
                    {prediction.game.game_results?.[0]?.away_score || '-'}
                  </div>
                  <div className="text-blue-600 dark:text-blue-400">
                    P {prediction.prediction.prediction_home_score}–
                    {prediction.prediction.prediction_away_score}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        <p>euroleague.bet</p>
        <p>F = Final P = Prediction</p>
      </div>
    </div>
  );
}