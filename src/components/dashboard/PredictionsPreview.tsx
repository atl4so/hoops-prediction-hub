import React from 'react';
import { Card } from "@/components/ui/card";

interface PredictionData {
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
}

interface PredictionsPreviewProps {
  userName: string;
  roundName: string;
  predictions: PredictionData[];
}

export const PredictionsPreview: React.FC<PredictionsPreviewProps> = ({
  userName,
  roundName,
  predictions
}) => {
  return (
    <Card className="w-[95%] h-[85vh] max-h-[650px] mx-auto bg-[#f8f9fa] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#e6e9f0] to-[#eef1f5] border-b border-gray-200">
        <div className="flex items-center gap-3">
          <span className="text-gray-800 font-semibold text-lg">euroleague.bet</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-600">@{userName}</span>
        </div>
        <span className="text-gray-700 font-semibold">Round {roundName}</span>
      </div>

      {/* Predictions list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {predictions.map((pred, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
          >
            <div className="space-y-4">
              {/* Teams and Predictions */}
              <div className="grid grid-cols-3 gap-4">
                {/* Home Team */}
                <div className="flex items-center gap-3">
                  <img 
                    src={pred.game.home_team.logo_url} 
                    alt={pred.game.home_team.name}
                    className="w-8 h-8 object-contain"
                  />
                  <span className="text-gray-800 font-medium">{pred.game.home_team.name}</span>
                </div>
                
                {/* Prediction */}
                <div className="flex items-center justify-center">
                  <div className="px-4 py-1 bg-blue-50 rounded-lg">
                    <span className="text-blue-600 font-semibold">
                      {pred.prediction.prediction_home_score} - {pred.prediction.prediction_away_score}
                    </span>
                  </div>
                </div>

                {/* Away Team */}
                <div className="flex items-center justify-end gap-3">
                  <span className="text-gray-800 font-medium">{pred.game.away_team.name}</span>
                  <img 
                    src={pred.game.away_team.logo_url} 
                    alt={pred.game.away_team.name}
                    className="w-8 h-8 object-contain"
                  />
                </div>
              </div>

              {/* Final Result if available */}
              {pred.game.game_results?.[0] && (
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-sm text-gray-500">Final Result:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      {pred.game.game_results[0].home_score} - {pred.game.game_results[0].away_score}
                    </span>
                    {pred.prediction.points_earned !== undefined && (
                      <div className="px-2 py-1 bg-green-50 rounded-md">
                        <span className="text-sm text-green-600 font-medium">
                          +{pred.prediction.points_earned} pts
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-gray-200 bg-gradient-to-r from-[#e6e9f0] to-[#eef1f5]">
        <div className="flex items-center justify-center gap-2">
          <span className="text-gray-600">🏀</span>
          <span className="text-gray-700">Join us at euroleague.bet</span>
        </div>
      </div>
    </Card>
  );
};