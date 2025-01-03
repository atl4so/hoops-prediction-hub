import { format } from 'date-fns';
import { Trophy, Medal } from 'lucide-react';

interface PredictionsPreviewProps {
  userName: string;
  roundName: string;
  predictions: Array<{
    game: {
      game_date: string;
      home_team: {
        name: string;
      };
      away_team: {
        name: string;
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

export const PredictionsPreview = ({
  userName,
  roundName,
  predictions,
}: PredictionsPreviewProps) => {
  const totalPoints = predictions.reduce((sum, p) => sum + (p.prediction.points_earned || 0), 0);

  return (
    <div className="font-sans bg-white p-8 relative min-h-[600px]">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] text-black rotate-[-45deg] text-[120px] font-bold pointer-events-none select-none">
        euroleague.bet
      </div>

      {/* Header */}
      <div className="text-center mb-8 relative z-10">
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-orange-600 text-transparent bg-clip-text">
          euroleague.bet
        </h1>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy className="h-5 w-5 text-orange-500" />
          <p className="text-xl font-semibold">
            Total Points: <span className="text-orange-500">{totalPoints}</span>
          </p>
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <p>User: {userName}</p>
          <p>Round: {roundName}</p>
          <p>{format(new Date(), 'PP')}</p>
        </div>
      </div>

      {/* Predictions */}
      <div className="space-y-4 relative z-10">
        {predictions.map((pred, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Medal className="h-4 w-4 text-orange-500" />
                <span className="font-medium">
                  {pred.game.home_team.name} vs {pred.game.away_team.name}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {format(new Date(pred.game.game_date), 'PP')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {pred.game.game_results?.[0] && (
                <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                  <p className="text-sm font-medium text-orange-600 mb-1">Final Result</p>
                  <p className="text-lg font-bold text-gray-900">
                    {pred.game.game_results[0].home_score} - {pred.game.game_results[0].away_score}
                  </p>
                </div>
              )}
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                <p className="text-sm font-medium text-blue-600 mb-1">Your Prediction</p>
                <p className="text-lg font-bold text-gray-900">
                  {pred.prediction.prediction_home_score} - {pred.prediction.prediction_away_score}
                </p>
              </div>
            </div>

            {pred.prediction.points_earned !== undefined && (
              <div className="flex items-center justify-end gap-1 mt-2">
                <span className="text-sm font-medium text-orange-600">
                  Points earned: {pred.prediction.points_earned}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};