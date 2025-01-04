import React from 'react';
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Trophy, CheckCircle2, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

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
  isDownload?: boolean;
}

export const PredictionsPreview: React.FC<PredictionsPreviewProps> = ({
  userName,
  roundName,
  predictions,
  isDownload = false
}) => {
  const totalPoints = predictions.reduce((sum, pred) => sum + (pred.prediction.points_earned || 0), 0);

  return (
    <Card className="w-full min-h-full bg-[#f8f9fa] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 bg-white border-b">
        <div className="flex items-center gap-3">
          <span className={cn(
            "font-bold",
            isDownload ? "text-3xl" : "text-2xl"
          )}>euroleague.bet</span>
          <span className={cn(
            "text-gray-500",
            isDownload ? "text-2xl" : "text-xl"
          )}>•</span>
          <span className={cn(
            "text-gray-600",
            isDownload ? "text-2xl" : "text-xl"
          )}>@{userName}</span>
        </div>
        <div className="flex items-center gap-6">
          <span className={cn(
            "font-medium text-gray-600",
            isDownload ? "text-2xl" : "text-xl"
          )}>Round {roundName}</span>
          <div className="flex items-center gap-2">
            <Trophy className={cn(
              "text-orange-500",
              isDownload ? "w-8 h-8" : "w-6 h-6"
            )} />
            <span className={cn(
              "text-orange-500 font-bold",
              isDownload ? "text-2xl" : "text-xl"
            )}>{totalPoints} pts</span>
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
              className={cn(
                "bg-white rounded-lg p-5 space-y-4 shadow-sm",
                isDownload && "p-6"
              )}
            >
              <div className="flex justify-between items-center">
                <span className={cn(
                  "font-semibold",
                  isDownload ? "text-2xl" : "text-xl"
                )}>
                  {pred.game.home_team.name} vs {pred.game.away_team.name}
                </span>
                <span className={cn(
                  "text-gray-500",
                  isDownload ? "text-xl" : "text-lg"
                )}>{formattedDate}</span>
              </div>

              <div className="flex gap-6">
                {/* Final Result */}
                {finalResult && (
                  <div className="flex-1 bg-red-50/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className={cn(
                        "text-green-500",
                        isDownload ? "w-6 h-6" : "w-5 h-5"
                      )} />
                      <span className={cn(
                        "text-gray-600",
                        isDownload ? "text-xl" : "text-lg"
                      )}>Final</span>
                    </div>
                    <span className={cn(
                      "font-bold",
                      isDownload ? "text-3xl" : "text-2xl"
                    )}>
                      {finalResult.home_score} - {finalResult.away_score}
                    </span>
                  </div>
                )}

                {/* Prediction */}
                <div className="flex-1 bg-blue-50/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Timer className={cn(
                      "text-blue-500",
                      isDownload ? "w-6 h-6" : "w-5 h-5"
                    )} />
                    <span className={cn(
                      "text-gray-600",
                      isDownload ? "text-xl" : "text-lg"
                    )}>Prediction</span>
                  </div>
                  <span className={cn(
                    "font-bold",
                    isDownload ? "text-3xl" : "text-2xl"
                  )}>
                    {pred.prediction.prediction_home_score} - {pred.prediction.prediction_away_score}
                  </span>
                </div>
              </div>

              {/* Points earned */}
              {pred.prediction.points_earned !== undefined && (
                <div className="flex justify-end">
                  <div className="flex items-center gap-2">
                    <Trophy className={cn(
                      "text-orange-500",
                      isDownload ? "w-6 h-6" : "w-5 h-5"
                    )} />
                    <span className={cn(
                      "text-orange-500 font-bold",
                      isDownload ? "text-2xl" : "text-xl"
                    )}>
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
        <div className={cn(
          "flex items-center justify-center text-gray-500",
          isDownload ? "text-xl" : "text-lg"
        )}>
          Join us at euroleague.bet
        </div>
      </div>
    </Card>
  );
};