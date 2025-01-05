import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Check, X } from "lucide-react";
import { RoundSelector } from "../predictions/RoundSelector";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface OverUnderPredictionsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export function OverUnderPredictionsDialog({
  isOpen,
  onOpenChange,
  userId,
}: OverUnderPredictionsDialogProps) {
  const [selectedRound, setSelectedRound] = useState("");

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

      console.log('Raw over/under predictions data:', data);
      return data.filter(pred => pred.game.game_results.is_final);
    },
    enabled: isOpen && !!selectedRound,
  });

  const getPredictionResult = (prediction: any) => {
    const gameResult = prediction.game.game_results;
    if (!gameResult) return null;

    const predictedTotal = prediction.prediction_home_score + prediction.prediction_away_score;
    const actualTotal = gameResult.home_score + gameResult.away_score;

    const predictedOverUnder = predictedTotal > actualTotal ? 'over' : 'under';
    const actualOverUnder = 'actual'; // This is just a placeholder since we compare directly

    return {
      isCorrect: (predictedTotal > actualTotal && actualTotal < predictedTotal) || 
                 (predictedTotal < actualTotal && actualTotal > predictedTotal),
      predicted: {
        total: predictedTotal,
        home: prediction.prediction_home_score,
        away: prediction.prediction_away_score
      },
      actual: {
        total: actualTotal,
        home: gameResult.home_score,
        away: gameResult.away_score
      }
    };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Over/Under Predictions by Round</DialogTitle>
          <DialogDescription className="space-y-2">
            <p>
              For each game, predict whether the total combined score will be higher or lower than the actual final total score.
            </p>
            <Alert className="mt-2">
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>
                Important: If you predict exactly the same total score as the final result, 
                it will be marked as incorrect. Your prediction must be clearly over or under 
                the actual final score.
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
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {predictions.map((prediction) => {
                const result = getPredictionResult(prediction);
                if (!result) return null;

                return (
                  <div 
                    key={prediction.id} 
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      result.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {prediction.game.home_team.name} vs {prediction.game.away_team.name}
                        </span>
                        {result.isCorrect ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <X className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                        <p>Your prediction: {result.predicted.home} - {result.predicted.away} (Total: {result.predicted.total})</p>
                        <p>Final score: {result.actual.home} - {result.actual.away} (Total: {result.actual.total})</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
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