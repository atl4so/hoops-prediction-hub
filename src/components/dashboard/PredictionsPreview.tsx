import React from 'react';
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Trophy, CheckCircle2, Timer } from "lucide-react";

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
  const totalPoints = predictions.reduce((sum, pred) => sum + (pred.prediction.points_earned || 0), 0);

  return (
    <Card className="w-[95%] h-[85vh] max-h-[800px] mx-auto bg-[#f8f9fa] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">euroleague.bet</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-600">@{userName}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Round {roundName}</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Total:</span>
            <span className="text-orange-500 font-semibold">{totalPoints} pts</span>
          </div>
        </div>
      </div>

      {/* Predictions list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {predictions.map((pred, index) => {
          const gameDate = new Date(pred.game.game_date);
          const formattedDate = format(gameDate, 'MMM d');
          const finalResult = pred.game.game_results?.[0];

          return (
            <div 
              key={index} 
              className="bg-white rounded-lg p-4 space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-base font-medium">
                  {pred.game.home_team.name} vs {pred.game.away_team.name}
                </span>
                <span className="text-sm text-gray-500">{formattedDate}</span>
              </div>

              <div className="flex gap-4">
                {/* Final Result */}
                {finalResult && (
                  <div className="flex-1 bg-red-50/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">Final</span>
                    </div>
                    <span className="text-lg font-semibold">
                      {finalResult.home_score} - {finalResult.away_score}
                    </span>
                  </div>
                )}

                {/* Prediction */}
                <div className="flex-1 bg-blue-50/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Timer className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Prediction</span>
                  </div>
                  <span className="text-lg font-semibold">
                    {pred.prediction.prediction_home_score} - {pred.prediction.prediction_away_score}
                  </span>
                </div>
              </div>

              {/* Points earned */}
              {pred.prediction.points_earned !== undefined && (
                <div className="flex justify-end">
                  <div className="flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-orange-500" />
                    <span className="text-orange-500 font-medium">
                      {pred.prediction.points_earned} pts
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-white border-t">
        <div className="flex items-center justify-center text-sm text-gray-500">
          Join us at euroleague.bet
        </div>
      </div>
    </Card>
  );
};