import { Check, X } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { PredictionData } from "./types";

interface ThresholdTabsContentProps {
  threshold: number;
  predictions: PredictionData[];
}

export function ThresholdTabsContent({ threshold, predictions }: ThresholdTabsContentProps) {
  const stats = getPredictionStats(threshold, predictions);

  return (
    <TabsContent key={threshold} value={threshold.toString()}>
      <div className="mb-4 p-4 bg-muted rounded-lg">
        <p className="text-lg font-semibold">
          Threshold: {threshold} points
        </p>
        <p className="text-sm text-muted-foreground">
          Accuracy: {stats.percentage}% ({stats.correct} correct out of {stats.total} predictions)
        </p>
      </div>
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {stats.predictions.map((prediction) => (
          <div 
            key={prediction.id} 
            className={`flex items-center justify-between p-3 rounded-lg border ${
              prediction.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}
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
                  {prediction.isOver ? 'Predicted Over' : 'Predicted Under'} • 
                  {prediction.wasOver ? ' Was Over' : ' Was Under'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </TabsContent>
  );
}

function getPredictionStats(threshold: number, predictions: PredictionData[]) {
  const thresholdPredictions = predictions.map(prediction => {
    const predictedTotal = prediction.prediction.prediction_home_score + prediction.prediction.prediction_away_score;
    const actualTotal = prediction.game.game_results[0].home_score + prediction.game.game_results[0].away_score;

    return {
      ...prediction,
      predictedTotal,
      actualTotal,
      isOver: predictedTotal > threshold,
      wasOver: actualTotal > threshold,
      isCorrect: (predictedTotal > threshold && actualTotal > threshold) || 
                (predictedTotal < threshold && actualTotal < threshold)
    };
  });

  const correct = thresholdPredictions.filter(p => p.isCorrect).length;
  
  return {
    correct,
    total: thresholdPredictions.length,
    percentage: Math.round((correct / thresholdPredictions.length) * 100),
    predictions: thresholdPredictions
  };
}