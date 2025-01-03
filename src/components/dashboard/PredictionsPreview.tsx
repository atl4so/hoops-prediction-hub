import { format } from 'date-fns';

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

export const PredictionsPreview = ({
  userName,
  roundName,
  predictions,
}: PredictionsPreviewProps) => {
  const totalPoints = predictions.reduce((sum, p) => sum + (p.prediction.points_earned || 0), 0);

  return (
    <div className="font-sans bg-[#F1F0FB] p-3 relative w-full max-w-[400px] mx-auto rounded-lg">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] text-[#8E9196] rotate-[-45deg] text-[60px] font-bold pointer-events-none select-none">
        euroleague.bet
      </div>

      {/* Header - Horizontal Layout */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="text-black font-bold">euroleague.bet</div>
        <div className="flex items-center gap-2">
          <span className="text-[#8E9196] text-sm">{userName}</span>
          <span className="text-orange-500 font-semibold">{totalPoints} pts</span>
        </div>
      </div>

      {/* Predictions */}
      <div className="space-y-2 relative z-10">
        {predictions.map((pred, index) => (
          <div
            key={index}
            className="bg-[#F6F6F7] rounded-lg p-2.5 shadow-sm"
          >
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-medium text-sm text-[#8E9196]">
                {pred.game.home_team.name} vs {pred.game.away_team.name}
              </span>
              <span className="text-xs text-[#aaadb0]">
                {format(new Date(pred.game.game_date), 'MMM d')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {pred.game.game_results?.[0] && (
                <div className="bg-[#FDE1D3] rounded-md p-2">
                  <p className="text-xs font-medium text-[#8E9196] mb-1 flex items-center gap-1">
                    ✅ Final
                  </p>
                  <p className="text-base font-bold text-[#8E9196]">
                    {pred.game.game_results[0].home_score} - {pred.game.game_results[0].away_score}
                  </p>
                </div>
              )}
              <div className="bg-[#D3E4FD] rounded-md p-2">
                <p className="text-xs font-medium text-[#8E9196] mb-1 flex items-center gap-1">
                  🏀 Prediction
                </p>
                <p className="text-base font-bold text-[#8E9196]">
                  {pred.prediction.prediction_home_score} - {pred.prediction.prediction_away_score}
                </p>
              </div>
            </div>

            {pred.prediction.points_earned !== undefined && (
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-sm font-medium text-orange-500">
                  🏆 {pred.prediction.points_earned} pts
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};