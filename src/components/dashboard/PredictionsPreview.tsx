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
}

const GameCard = ({ prediction }: { prediction: PredictionData }) => {
  const finalResult = prediction.game.game_results?.[0];
  
  return (
    <div className="bg-gray-50/80 rounded-lg p-1.5 relative min-h-[60px]">
      <div className="flex items-center justify-center gap-1 mb-1.5">
        <img 
          src={prediction.game.home_team.logo_url} 
          alt={prediction.game.home_team.name}
          className="w-4 h-4 object-contain"
        />
        <span className="text-[10px] leading-[14px] font-medium text-gray-700">vs</span>
        <img 
          src={prediction.game.away_team.logo_url} 
          alt={prediction.game.away_team.name}
          className="w-4 h-4 object-contain"
        />
      </div>
      <div className="flex flex-col gap-1">
        {finalResult && (
          <div className="flex items-center gap-1">
            <span className="text-emerald-600 font-medium text-[10px] leading-[14px]">F</span>
            <span className="font-medium text-gray-900 text-[10px] leading-[14px]">
              {finalResult.home_score}-{finalResult.away_score}
            </span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <span className="text-blue-600 font-medium text-[10px] leading-[14px]">P</span>
          <span className="text-gray-600 text-[10px] leading-[14px]">
            {prediction.prediction.prediction_home_score}-{prediction.prediction.prediction_away_score}
          </span>
        </div>
      </div>
      {prediction.prediction.points_earned !== undefined && (
        <div className="absolute top-1.5 right-1.5">
          <span className="text-orange-500 font-bold text-[10px] leading-[14px]">
            {prediction.prediction.points_earned}p
          </span>
        </div>
      )}
    </div>
  );
};

export const PredictionsPreview: React.FC<PredictionsPreviewProps> = ({
  userName,
  roundName,
  predictions,
}) => {
  const totalPoints = predictions.reduce((sum, pred) => sum + (pred.prediction.points_earned || 0), 0);
  const firstGame = predictions[0]?.game;
  const lastGame = predictions[predictions.length - 1]?.game;
  const dateRange = firstGame && lastGame 
    ? `${format(new Date(firstGame.game_date), 'MMM d')}-${format(new Date(lastGame.game_date), 'MMM d, yyyy')}`
    : '';

  return (
    <div className="bg-white w-full">
      <div className="p-2">
        {/* Header */}
        <div className="mb-1.5">
          <h1 className="text-xs font-bold mb-0.5">
            euroleague.bet
          </h1>
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className="text-xs font-bold">Round {roundName}</span>
            <span className="text-blue-600 text-[10px]">by @{userName}</span>
          </div>
          <p className="text-[10px] text-gray-500">{dateRange}</p>
        </div>

        {/* Total Score */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-gray-600">Total Score:</span>
          <span className="text-base font-bold text-orange-500">{totalPoints}</span>
        </div>
        
        {/* Game Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1">
          {predictions.map((prediction, index) => (
            <div key={index}>
              <GameCard prediction={prediction} />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 p-1 bg-gray-50">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-gray-500">euroleague.bet</span>
          <div className="flex gap-2">
            <span className="text-gray-500">F = Final</span>
            <span className="text-gray-500">P = Prediction</span>
          </div>
        </div>
      </div>
    </div>
  );
};