import { Check, X } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";

interface Prediction {
  id: string;
  prediction_home_score: number;
  prediction_away_score: number;
  game: {
    home_team: { name: string };
    away_team: { name: string };
    game_results: {
      home_score: number;
      away_score: number;
    };
  };
}

interface PredictionsListProps {
  predictions: Prediction[];
  type: 'home' | 'away';
}

export function PredictionsList({ predictions, type }: PredictionsListProps) {
  return (
    <TabsContent value={type} className="space-y-4">
      <div className="space-y-2">
        {predictions.map((prediction) => {
          const isPredictedHomeWin = prediction.prediction_home_score > prediction.prediction_away_score;
          const isActualHomeWin = prediction.game.game_results.home_score > prediction.game.game_results.away_score;
          const isRelevantPrediction = type === 'home' ? isPredictedHomeWin : !isPredictedHomeWin;
          
          if (!isRelevantPrediction) return null;

          const isCorrect = type === 'home' 
            ? (isPredictedHomeWin && isActualHomeWin)
            : (!isPredictedHomeWin && !isActualHomeWin);

          return (
            <div 
              key={prediction.id} 
              className={`flex items-center justify-between p-3 rounded-lg border ${
                isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {prediction.game.home_team.name} vs {prediction.game.away_team.name}
                  </span>
                  {isCorrect ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div className="text-xs text-[#7E69AB] mt-1">
                  {prediction.prediction_home_score} - {prediction.prediction_away_score}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </TabsContent>
  );
}