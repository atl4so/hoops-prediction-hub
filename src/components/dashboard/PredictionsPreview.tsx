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
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#e6e9f0] to-[#eef1f5] border-b border-gray-200">
        <span className="text-gray-800 font-medium">euroleague.bet</span>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">@{userName}</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-600">Round {roundName}</span>
        </div>
      </div>

      {/* Predictions list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {predictions.map((pred, index) => (
          <div 
            key={index} 
            className="bg-[#ffffff] rounded-lg p-3 shadow-sm border border-gray-100 hover:border-gray-200 transition-colors"
          >
            <div className="flex justify-between items-center">
              <div className="flex-1 space-y-3">
                {/* Team predictions */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <img 
                        src={pred.game.home_team.logo_url} 
                        alt={pred.game.home_team.name}
                        className="w-7 h-7 object-contain"
                      />
                      <span className="text-gray-800 font-medium">{pred.game.home_team.name}</span>
                    </div>
                    <span className="text-gray-900 font-semibold ml-2">
                      {pred.prediction.prediction_home_score}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <img 
                        src={pred.game.away_team.logo_url} 
                        alt={pred.game.away_team.name}
                        className="w-7 h-7 object-contain"
                      />
                      <span className="text-gray-800 font-medium">{pred.game.away_team.name}</span>
                    </div>
                    <span className="text-gray-900 font-semibold ml-2">
                      {pred.prediction.prediction_away_score}
                    </span>
                  </div>
                </div>

                {/* Final result if available */}
                {pred.game.game_results?.[0] && (
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Final Result:</span>
                      <span className="text-sm font-medium text-gray-800">
                        {pred.game.game_results[0].home_score} - {pred.game.game_results[0].away_score}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              {pred.prediction.points_earned !== undefined && (
                <div className="ml-3 px-2 py-1 bg-[#f0f9ff] rounded-md">
                  <span className="text-sm text-gray-700">
                    ✅ {pred.prediction.points_earned}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-gray-200 bg-gradient-to-r from-[#e6e9f0] to-[#eef1f5]">
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-gray-600">🏀</span>
          <span className="text-sm text-gray-700">Join us at euroleague.bet</span>
        </div>
      </div>
    </Card>
  );
};