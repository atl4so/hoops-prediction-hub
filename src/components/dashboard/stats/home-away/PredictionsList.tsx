import { Check, X } from "lucide-react";
import type { PredictionData } from "../types";

interface PredictionsListProps {
  predictions: PredictionData[];
  type: 'home' | 'away';
}

export function PredictionsList({ predictions, type }: PredictionsListProps) {
  return (
    <div className="space-y-2">
      {predictions.map((prediction) => {
        const isPredictedHomeWin = prediction.prediction_home_score > prediction.prediction_away_score;
        const isRelevantPrediction = type === 'home' ? isPredictedHomeWin : !isPredictedHomeWin;
        
        if (!isRelevantPrediction) return null;

        const result = getPredictionResult(prediction);

        return (
          <div 
            key={prediction.id} 
            className={`flex items-center justify-between p-2 rounded-lg border ${
              result.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">
                  {prediction.game.home_team.name} vs {prediction.game.away_team.name}
                </span>
                {result.isCorrect ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <X className="h-3 w-3 text-red-600" />
                )}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                <p>Your prediction: {result.prediction}</p>
                <p>Final result: {result.actual}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function getPredictionResult(prediction: PredictionData) {
  const isPredictedHomeWin = prediction.prediction_home_score > prediction.prediction_away_score;
  const isActualHomeWin = prediction.game.game_results[0].home_score > prediction.game.game_results[0].away_score;
  const isDraw = prediction.game.game_results[0].home_score === prediction.game.game_results[0].away_score;

  return {
    prediction: isPredictedHomeWin ? "Home Win" : "Away Win",
    actual: isDraw ? "Draw" : (isActualHomeWin ? "Home Win" : "Away Win"),
    isCorrect: isDraw 
      ? prediction.prediction_home_score === prediction.prediction_away_score
      : isPredictedHomeWin === isActualHomeWin
  };
}