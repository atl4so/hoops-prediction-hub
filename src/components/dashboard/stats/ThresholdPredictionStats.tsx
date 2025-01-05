import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface ThresholdPredictionStatsProps {
  predictions: Array<{
    id: string;
    game: {
      home_team: { name: string };
      away_team: { name: string };
      game_results: Array<{
        home_score: number;
        away_score: number;
      }>;
    };
    prediction: {
      prediction_home_score: number;
      prediction_away_score: number;
    };
  }>;
  threshold: number;
}

export function ThresholdPredictionStats({ predictions, threshold }: ThresholdPredictionStatsProps) {
  const analyzedPredictions = predictions.map(prediction => {
    const predictedTotal = prediction.prediction.prediction_home_score + prediction.prediction.prediction_away_score;
    const actualTotal = prediction.game.game_results[0].home_score + prediction.game.game_results[0].away_score;
    
    const predictedOver = predictedTotal > threshold;
    const actualOver = actualTotal > threshold;
    
    // Prediction is correct if both predicted and actual are over OR both are under
    const isCorrect = (predictedOver && actualOver) || (!predictedOver && !actualOver);

    return {
      ...prediction,
      predictedTotal,
      actualTotal,
      predictedOver,
      actualOver,
      isCorrect
    };
  });

  const correctCount = analyzedPredictions.filter(p => p.isCorrect).length;
  const accuracy = analyzedPredictions.length > 0 
    ? Math.round((correctCount / analyzedPredictions.length) * 100) 
    : 0;

  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted rounded-lg">
        <p className="text-lg font-semibold">
          Threshold: {threshold} points
        </p>
        <p className="text-sm text-muted-foreground">
          Accuracy: {accuracy}% ({correctCount} correct out of {analyzedPredictions.length} predictions)
        </p>
      </div>
      
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {analyzedPredictions.map((prediction) => (
          <div 
            key={prediction.id} 
            className={cn(
              "flex items-center justify-between p-3 rounded-lg border",
              prediction.isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
            )}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {prediction.game.home_team.name} vs {prediction.game.away_team.name}
                </span>
                {prediction.isCorrect ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                <p>Your prediction: {prediction.prediction.prediction_home_score} - {prediction.prediction.prediction_away_score} (Total: {prediction.predictedTotal})</p>
                <p>Final score: {prediction.game.game_results[0].home_score} - {prediction.game.game_results[0].away_score} (Total: {prediction.actualTotal})</p>
                <p className="font-medium">
                  {prediction.predictedOver ? 'Predicted Over' : 'Predicted Under'} • 
                  {prediction.actualOver ? ' Was Over' : ' Was Under'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}