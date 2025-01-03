import React from 'react';
import { Card } from "@/components/ui/card";

interface PredictionsPreviewProps {
  username: string;
  predictions: Array<{
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    points?: number;
  }>;
}

export const PredictionsPreview: React.FC<PredictionsPreviewProps> = ({
  username,
  predictions
}) => {
  return (
    <Card className="w-[95%] h-[80vh] max-h-[600px] mx-auto bg-[#f8f9fa] p-4 shadow-lg">
      <div className="flex flex-col h-full">
        {/* Header with website and user info */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
          <span className="text-black text-sm">euroleague.bet</span>
          <span className="text-gray-600 text-sm">@{username}</span>
        </div>

        {/* Predictions list */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {predictions.map((prediction, index) => (
            <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{prediction.homeTeam}</span>
                    <span className="text-sm font-bold mx-2">{prediction.homeScore}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm font-medium">{prediction.awayTeam}</span>
                    <span className="text-sm font-bold mx-2">{prediction.awayScore}</span>
                  </div>
                </div>
                {prediction.points !== undefined && (
                  <div className="ml-3 flex items-center">
                    <span className="text-sm">✅ {prediction.points}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-3 pt-2 border-t border-gray-200 text-center">
          <span className="text-xs text-gray-500">🏀 Join us at euroleague.bet</span>
        </div>
      </div>
    </Card>
  );
};