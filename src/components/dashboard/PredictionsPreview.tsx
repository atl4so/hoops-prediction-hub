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
  const gameDate = new Date(prediction.game.game_date);
  const formattedDate = format(gameDate, 'MMM d');
  const finalResult = prediction.game.game_results?.[0];
  const gameTitle = `${prediction.game.home_team.name} vs ${prediction.game.away_team.name}`;
  
  return (
    <div className="bg-blue-50 rounded p-2 border border-blue-100">
      <div className="text-sm font-medium mb-1 truncate text-gray-700">{gameTitle}</div>
      <div className="flex justify-between items-center text-sm">
        <div className="space-y-0.5">
          {finalResult && (
            <div className="flex items-center gap-1">
              <span className="text-emerald-600 text-xs font-medium">F</span>
              <span className="font-bold text-gray-900">
                {finalResult.home_score}-{finalResult.away_score}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <span className="text-blue-600 text-xs font-medium">P</span>
            <span className="text-gray-600">
              {prediction.prediction.prediction_home_score}-{prediction.prediction.prediction_away_score}
            </span>
          </div>
        </div>
        {prediction.prediction.points_earned !== undefined && (
          <div className="text-orange-600 text-sm font-medium">
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

  return (
    <div className="h-[630px] w-[1200px] bg-gray-50">
      <div className="flex flex-col h-full bg-gray-50">
        <div className="p-6 flex-1">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                euroleague.bet Round {roundName}
                <span className="text-blue-600 font-medium ml-2 text-xl">by {userName}</span>
              </h1>
              <p className="text-gray-500 text-sm">{dateRange}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-700">Total Score:</span>
              <span className="text-3xl font-bold text-orange-500">{totalPoints}</span>
            </div>
          </div>
          
          {/* Game Grid */}
          <div className="grid grid-cols-3 gap-3">
            {predictions.map((prediction, index) => (
              <GameCard key={index} prediction={prediction} />
            ))}
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 p-6 pt-0">
          <div className="flex justify-between items-center text-gray-500 text-sm">
            <span className="font-medium">euroleague.bet</span>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">F = Final</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">P = Prediction</span>
            </div>
          </div>
        </div>

        {/* Extra space to ensure background extends fully */}
        <div className="bg-gray-50 h-24"></div>
      </div>
    </div>
  );
};