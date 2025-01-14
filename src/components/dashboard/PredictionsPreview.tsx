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

const GameRow = ({ prediction }: { prediction: PredictionData }) => {
  const finalResult = prediction.game.game_results?.[0];
  const gameDate = new Date(prediction.game.game_date);
  
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-32 text-xs text-gray-600">
        {format(gameDate, 'MM-dd • HH:mm')}
      </div>
      
      <div className="flex items-center gap-1">
        <img 
          src={prediction.game.home_team.logo_url} 
          alt={prediction.game.home_team.name}
          className="w-6 h-6 object-contain"
        />
        
        <span className={cn(
          "text-sm font-medium",
          finalResult && finalResult.home_score > finalResult.away_score ? "text-emerald-600" : "text-gray-900"
        )}>
          {finalResult ? finalResult.home_score : prediction.prediction.prediction_home_score}
        </span>
        
        <span className="text-sm text-gray-600">-</span>
        
        <span className={cn(
          "text-sm font-medium",
          finalResult && finalResult.away_score > finalResult.home_score ? "text-emerald-600" : "text-gray-900"
        )}>
          {finalResult ? finalResult.away_score : prediction.prediction.prediction_away_score}
        </span>
        
        <img 
          src={prediction.game.away_team.logo_url} 
          alt={prediction.game.away_team.name}
          className="w-6 h-6 object-contain"
        />
      </div>
      
      {prediction.prediction.points_earned !== undefined && (
        <div className="ml-auto">
          <span className="text-orange-500 font-bold text-sm">
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

  return (
    <div className="bg-white w-full">
      <div className="p-4">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-lg font-bold mb-1">
            Round {roundName}
          </h1>
          <div className="flex items-center justify-between">
            <span className="text-blue-600 text-sm">@{userName}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Total Score:</span>
              <span className="text-lg font-bold text-orange-500">{totalPoints}</span>
            </div>
          </div>
        </div>

        {/* Games List */}
        <div className="space-y-1">
          {predictions.map((prediction, index) => (
            <GameRow key={index} prediction={prediction} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 p-2 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>euroleague.bet</span>
          <div className="flex gap-2">
            <span>F = Final</span>
            <span>P = Prediction</span>
          </div>
        </div>
      </div>
    </div>
  );
};