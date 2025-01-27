import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Check, X } from "lucide-react";
import { RoundSelector } from "../predictions/RoundSelector";
import { useState } from "react";

interface WinnerPredictionsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export function WinnerPredictionsDialog({
  isOpen,
  onOpenChange,
  userId,
}: WinnerPredictionsDialogProps) {
  const [selectedRound, setSelectedRound] = useState("");

  const { data: predictions, isLoading } = useQuery({
    queryKey: ['round-winner-predictions', userId, selectedRound],
    queryFn: async () => {
      if (!selectedRound) return [];
      
      console.log('Fetching predictions for round:', selectedRound);
      
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

      console.log('Raw predictions data:', data);
      return data.filter(pred => pred.game.game_results.is_final);
    },
    enabled: isOpen && !!selectedRound,
  });

  const getPredictionResult = (prediction: any) => {
    const gameResult = prediction.game.game_results;
    if (!gameResult) return null;

    const predictedWinner = prediction.prediction_home_score > prediction.prediction_away_score 
      ? 'home' 
      : prediction.prediction_home_score < prediction.prediction_away_score 
        ? 'away' 
        : 'draw';

    const actualWinner = gameResult.home_score > gameResult.away_score 
      ? 'home' 
      : gameResult.home_score < gameResult.away_score 
        ? 'away' 
        : 'draw';

    return {
      isCorrect: predictedWinner === actualWinner,
      predicted: {
        home: prediction.prediction_home_score,
        away: prediction.prediction_away_score
      },
      actual: {
        home: gameResult.home_score,
        away: gameResult.away_score
      }
    };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Winner Predictions by Round</DialogTitle>
          <DialogDescription>
            View your completed predictions and their results
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
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      result.isCorrect 
                        ? 'dark:bg-green-950/50 dark:border-green-800/50 bg-green-50 border-green-200' 
                        : 'dark:bg-red-950/50 dark:border-red-800/50 bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium dark:text-foreground">
                          {prediction.game.home_team.name} vs {prediction.game.away_team.name}
                        </span>
                        {result.isCorrect ? (
                          <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                        <p>Your prediction: {result.predicted.home} - {result.predicted.away}</p>
                        <p>Final score: {result.actual.home} - {result.actual.away}</p>
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