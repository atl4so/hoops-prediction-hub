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
  
  return (
    <div className="bg-gray-50/80 rounded-lg p-4">
      <div className="text-sm font-medium mb-2 text-gray-700 truncate">{gameTitle}</div>
      <div className="flex flex-col gap-1">
        {finalResult && (
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 font-medium">F</span>
            <span className="font-medium text-gray-900">{finalResult.home_score}-{finalResult.away_score}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-blue-600 font-medium">P</span>
          <span className="text-gray-600">{prediction.prediction.prediction_home_score}-{prediction.prediction.prediction_away_score}</span>
        </div>
      </div>
      {prediction.prediction.points_earned !== undefined && (
        <div className="absolute top-3 right-3">
          <span className="text-orange-500 font-bold">{prediction.prediction.points_earned}p</span>
        </div>
      )}
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
    ? `${format(new Date(firstGame.game_date), 'MMM d')}-${format(new Date(lastGame.game_date), 'MMM d, yyyy')}`
    : '';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="p-6 flex-1">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">
            euroleague.bet
          </h1>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold">Round {roundName}</span>
            <span className="text-blue-600">by @{userName}</span>
          </div>
          <p className="text-gray-500 text-sm">{dateRange}</p>
        </div>

        {/* Total Score */}
        <div className="flex items-center justify-between mb-6">
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