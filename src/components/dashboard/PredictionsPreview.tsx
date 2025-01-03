import { format } from 'date-fns';
import { Trophy, Medal, Star, Award, CheckCircle } from 'lucide-react';

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
    <div className="font-sans bg-gradient-to-br from-[#F6F6F7] to-[#F1F1F1] p-4 relative w-full max-w-[400px] mx-auto">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] text-[#8E9196] rotate-[-45deg] text-[60px] font-bold pointer-events-none select-none">
        euroleague.bet
      </div>

      {/* Header */}
      <div className="text-center mb-4 relative z-10">
        <div className="inline-flex items-center justify-center gap-2 mb-2">
          <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 text-transparent bg-clip-text">
            euroleague.bet
          </h1>
        </div>
        
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy className="h-4 w-4 text-orange-500" strokeWidth={1.5} />
          <p className="text-lg font-semibold text-[#8E9196]">
            {totalPoints} pts
          </p>
        </div>
        
        <div className="text-sm text-[#aaadb0] space-y-0.5">
          <p className="flex items-center justify-center gap-1">
            <Star className="h-3 w-3" strokeWidth={1.5} />
            {userName}
          </p>
          <p>{roundName}</p>
          <p className="text-xs">{format(new Date(), 'PP')}</p>
        </div>
      </div>

      {/* Predictions */}
      <div className="space-y-3 relative z-10">
        {predictions.map((pred, index) => (
          <div
            key={index}
            className="border border-[#F1F0FB] rounded-lg p-3 bg-[#F1F1F1] shadow-sm"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-sm text-[#8E9196]">
                {pred.game.home_team.name} vs {pred.game.away_team.name}
              </span>
              <span className="text-xs text-[#aaadb0]">
                {format(new Date(pred.game.game_date), 'PP')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {pred.game.game_results?.[0] && (
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-md p-2 border border-orange-200">
                  <p className="text-xs font-medium text-orange-700 mb-1 flex items-center gap-1">
                    ✅ Final
                  </p>
                  <p className="text-base font-bold text-[#8E9196]">
                    {pred.game.game_results[0].home_score} - {pred.game.game_results[0].away_score}
                  </p>
                </div>
              )}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-md p-2 border border-blue-200">
                <p className="text-xs font-medium text-blue-700 mb-1 flex items-center gap-1">
                  🏀 Prediction
                </p>
                <p className="text-base font-bold text-[#8E9196]">
                  {pred.prediction.prediction_home_score} - {pred.prediction.prediction_away_score}
                </p>
              </div>
            </div>

            {pred.prediction.points_earned !== undefined && (
              <div className="flex items-center justify-end gap-1 mt-1.5">
                <Trophy className="h-3 w-3 text-orange-500" strokeWidth={1.5} />
                <span className="text-sm font-medium text-orange-600">
                  {pred.prediction.points_earned} pts
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};