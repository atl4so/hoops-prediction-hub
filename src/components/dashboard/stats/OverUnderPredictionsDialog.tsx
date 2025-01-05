import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Check, X } from "lucide-react";
import { RoundSelector } from "../predictions/RoundSelector";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface OverUnderPredictionsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

const THRESHOLDS = [145, 155, 165, 175, 185, 195];

export function OverUnderPredictionsDialog({
  isOpen,
  onOpenChange,
  userId,
}: OverUnderPredictionsDialogProps) {
  const [selectedRound, setSelectedRound] = useState("");
  const [selectedThreshold, setSelectedThreshold] = useState(THRESHOLDS[0].toString());

  const { data: predictions, isLoading } = useQuery({
    queryKey: ['round-over-under-predictions', userId, selectedRound],
    queryFn: async () => {
      if (!selectedRound) return [];
      
      console.log('Fetching over/under predictions for round:', selectedRound);
      
      const { data, error } = await supabase
        .from('predictions')
        .select(`
          id,
          prediction_home_score,
          prediction_away_score,
          game:games!inner (
            id,
            game_date,
            home_team:teams!games_home_team_id_fkey (
              name
            ),
            away_team:teams!games_away_team_id_fkey (
              name
            ),
            game_results!inner (
              home_score,
              away_score,
              is_final
            )
          )
        `)
        .eq('user_id', userId)
        .eq('game.round_id', selectedRound);

      if (error) {
        console.error('Error fetching predictions:', error);
        throw error;
      }

      return data.filter(pred => pred.game.game_results.is_final);
    },
    enabled: isOpen && !!selectedRound,
  });

  const getPredictionStats = (threshold: number) => {
    if (!predictions) return { correct: 0, total: 0, predictions: [] };

    const thresholdPredictions = predictions.map(prediction => {
      const predictedTotal = prediction.prediction_home_score + prediction.prediction_away_score;
      const actualTotal = prediction.game.game_results.home_score + prediction.game.game_results.away_score;

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
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Over/Under Predictions by Threshold</DialogTitle>
          <DialogDescription className="space-y-2">
            <p>
              Select different thresholds to see your prediction accuracy for games above or below that total score.
            </p>
            <Alert variant="destructive" className="mt-2">
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>
                Important: For each threshold, your prediction must be clearly over or under. 
                Predicting exactly the threshold value will be marked as incorrect.
              </AlertDescription>
            </Alert>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <RoundSelector 
            selectedRound={selectedRound} 
            onRoundChange={setSelectedRound}
            className="w-full"
          />

          {isLoading ? (
            <div className="text-center py-4 text-muted-foreground">
              Loading predictions...
            </div>
          ) : predictions && predictions.length > 0 ? (
            <Tabs value={selectedThreshold} onValueChange={setSelectedThreshold}>
              <TabsList className="grid grid-cols-6 w-full">
                {THRESHOLDS.map((threshold) => (
                  <TabsTrigger 
                    key={threshold} 
                    value={threshold.toString()}
                    className="text-xs sm:text-sm"
                  >
                    {threshold}
                  </TabsTrigger>
                ))}
              </TabsList>

              {THRESHOLDS.map((threshold) => {
                const stats = getPredictionStats(threshold);
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
                              <p>Your prediction: {prediction.prediction_home_score} - {prediction.prediction_away_score} (Total: {prediction.predictedTotal})</p>
                              <p>Final score: {prediction.game.game_results.home_score} - {prediction.game.game_results.away_score} (Total: {prediction.actualTotal})</p>
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
              })}
            </Tabs>
          ) : selectedRound ? (
            <div className="text-center py-6 text-muted-foreground">
              No completed predictions found for this round
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              Select a round to view predictions
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}