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
    <div className="bg-blue-50/50 rounded-xl p-4">
      <div className="text-sm font-medium mb-3 text-gray-700 truncate">{gameTitle}</div>
      <div className="space-y-2">
        {finalResult && (
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 font-medium">F</span>
            <span className="font-bold text-gray-900">{finalScore}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-blue-600 font-medium">P</span>
          <span className="text-gray-600">{predictionScore}</span>
        </div>
        {prediction.prediction.points_earned !== undefined && (
          <div className="absolute top-3 right-3 text-orange-600 font-bold">
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
    ? `${format(new Date(firstGame.game_date), 'MMM d')} - ${format(new Date(lastGame.game_date), 'MMM d, yyyy')}`
    : '';

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <div className="space-y-0">
            <h1 className="text-2xl font-bold text-gray-900">
              euroleague.bet
            </h1>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">Round {roundName}</span>
              <span className="text-blue-600">by @{userName}</span>
            </div>
          </div>
          <p className="text-gray-500">{dateRange}</p>
        </div>

        {/* Total Score */}
        <div className="flex items-baseline gap-3">
          <span className="text-xl text-gray-600">Total Score:</span>
          <span className="text-4xl font-bold text-orange-500">{totalPoints}</span>
        </div>
        
        {/* Game Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {predictions.map((prediction, index) => (
            <div key={index} className="relative">
              <GameCard prediction={prediction} />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto border-t border-gray-100 p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">euroleague.bet</span>
          <div className="flex gap-4">
            <span className="text-sm text-gray-500">F = Final</span>
            <span className="text-sm text-gray-500">P = Prediction</span>
          </div>
        </div>
      </div>
    </div>
  );
};