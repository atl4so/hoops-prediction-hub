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
    <Card className="w-full min-h-full bg-[#f8f9fa] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 bg-white border-b">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold">euroleague.bet</span>
          <span className="text-gray-500 text-xl">•</span>
          <span className="text-gray-600 text-xl">@{userName}</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-xl font-medium text-gray-600">Round {roundName}</span>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-orange-500" />
            <span className="text-xl text-orange-500 font-bold">{totalPoints} pts</span>
          </div>
        </div>
      </div>

      {/* Predictions list */}
      <div className="p-6 space-y-4">
        {predictions.map((pred, index) => {
          const gameDate = new Date(pred.game.game_date);
          const formattedDate = format(gameDate, 'MMM d');
          const finalResult = pred.game.game_results?.[0];

          return (
            <div 
              key={index} 
              className="bg-white rounded-lg p-5 space-y-4 shadow-sm"
            >
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold">
                  {pred.game.home_team.name} vs {pred.game.away_team.name}
                </span>
                <span className="text-lg text-gray-500">{formattedDate}</span>
              </div>

              <div className="flex gap-6">
                {/* Final Result */}
                {finalResult && (
                  <div className="flex-1 bg-red-50/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span className="text-lg text-gray-600">Final</span>
                    </div>
                    <span className="text-2xl font-bold">
                      {finalResult.home_score} - {finalResult.away_score}
                    </span>
                  </div>
                )}

                {/* Prediction */}
                <div className="flex-1 bg-blue-50/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Timer className="w-5 h-5 text-blue-500" />
                    <span className="text-lg text-gray-600">Prediction</span>
                  </div>
                  <span className="text-2xl font-bold">
                    {pred.prediction.prediction_home_score} - {pred.prediction.prediction_away_score}
                  </span>
                </div>
              </div>

              {/* Points earned */}
              {pred.prediction.points_earned !== undefined && (
                <div className="flex justify-end">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-orange-500" />
                    <span className="text-xl text-orange-500 font-bold">
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
      <div className="px-8 py-4 bg-white border-t">
        <div className="flex items-center justify-center text-lg text-gray-500">
          Join us at euroleague.bet
        </div>
      </div>
    </Card>
  );
};