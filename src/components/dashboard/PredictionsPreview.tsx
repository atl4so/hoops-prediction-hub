import { format } from 'date-fns';

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
    <div className="font-sans bg-white p-8 relative">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] text-black rotate-[-45deg] text-[120px] font-bold pointer-events-none">
        euroleague.bet
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">euroleague.bet</h1>
        <p className="text-lg mb-1">User: {userName}</p>
        <p className="text-lg mb-1">Round: {roundName}</p>
        <p className="text-sm text-gray-600 mb-3">
          Generated: {format(new Date(), 'PP')}
        </p>
        <p className="text-xl font-bold text-blue-600">
          Total Points: {totalPoints}
        </p>
      </div>

      {/* Predictions */}
      <div className="space-y-4">
        {predictions.map((pred, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 bg-gray-50"
          >
            <div className="flex justify-between mb-2">
              <div className="font-semibold">
                {pred.game.home_team.name} vs {pred.game.away_team.name}
              </div>
              <div className="text-sm text-gray-600">
                {format(new Date(pred.game.game_date), 'PP')}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {pred.game.game_results?.[0] && (
                <div>
                  <p className="text-sm font-medium mb-1">Final Result</p>
                  <p className="text-lg font-bold">
                    {pred.game.game_results[0].home_score} - {pred.game.game_results[0].away_score}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium mb-1">Your Prediction</p>
                <p className="text-lg font-bold">
                  {pred.prediction.prediction_home_score} - {pred.prediction.prediction_away_score}
                </p>
              </div>
            </div>

            {pred.prediction.points_earned !== undefined && (
              <div className="text-right mt-2 text-orange-600 font-medium">
                Points earned: {pred.prediction.points_earned}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};