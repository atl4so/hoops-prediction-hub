import React from 'react';
import { format } from "date-fns";
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

const GameCard = ({ prediction }: { prediction: PredictionData }) => {
  const gameTitle = `${prediction.game.home_team.name} vs ${prediction.game.away_team.name}`;
  const finalResult = prediction.game.game_results?.[0];
  const predictionScore = `${prediction.prediction.prediction_home_score}-${prediction.prediction.prediction_away_score}`;
  const finalScore = finalResult ? `${finalResult.home_score}-${finalResult.away_score}` : '';
  
  return (
    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 w-full">
      <div className="text-sm font-medium mb-2 text-gray-700">{gameTitle}</div>
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          {finalResult && (
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 text-sm font-medium">F</span>
              <span className="font-bold text-gray-900 text-base">{finalScore}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-blue-600 text-sm font-medium">P</span>
            <span className="text-gray-600 text-base">{predictionScore}</span>
          </div>
        </div>
        {prediction.prediction.points_earned !== undefined && (
          <div className="text-orange-600 text-sm font-bold">
            {prediction.prediction.points_earned}p
          </div>
        )}
      </div>
    </div>
  );
};

export const PredictionsPreview: React.FC<PredictionsPreviewProps> = ({
  userName,
  roundName,
  predictions,
  isDownload = false
}) => {
  const totalPoints = predictions.reduce((sum, pred) => sum + (pred.prediction.points_earned || 0), 0);
  const firstGame = predictions[0]?.game;
  const lastGame = predictions[predictions.length - 1]?.game;
  const dateRange = firstGame && lastGame 
    ? `${format(new Date(firstGame.game_date), 'MMM d')} - ${format(new Date(lastGame.game_date), 'MMM d')}`
    : '';

  const containerClasses = cn(
    "min-h-screen w-full bg-gray-50",
    isDownload ? "h-[1200px] w-[600px]" : "max-w-[600px] mx-auto"
  );

  const contentClasses = cn(
    "flex flex-col h-full w-full",
    !isDownload && "min-h-screen"
  );

  return (
    <div className={containerClasses}>
      <div className={contentClasses}>
        <div className="p-4 flex-1">
          {/* Header */}
          <div className="space-y-4 mb-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">
                euroleague.bet Round {roundName}
              </h1>
              <div className="flex flex-col gap-1">
                <span className="text-blue-600 font-medium text-lg">by {userName}</span>
                <p className="text-gray-500 text-sm">{dateRange}</p>
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-baseline gap-2">
                <span className="text-gray-700 text-sm">Total Score:</span>
                <span className="text-3xl font-bold text-orange-500">{totalPoints}</span>
              </div>
            </div>
          </div>
          
          {/* Game Cards - Vertical Stack */}
          <div className="space-y-4">
            {predictions.map((prediction, index) => (
              <GameCard key={index} prediction={prediction} />
            ))}
          </div>
        </div>
        
        {/* Footer - Always at the bottom */}
        <div className="mt-auto border-t border-gray-100 p-4">
          <div className="flex flex-col gap-3">
            <span className="font-medium text-gray-700">euroleague.bet</span>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">F = Final</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">P = Prediction</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};