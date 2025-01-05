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

  const { data: predictions } = useQuery({
    queryKey: ['round-winner-predictions', userId, selectedRound],
    queryFn: async () => {
      if (!selectedRound) return [];
      
      const { data, error } = await supabase
        .from('predictions')
        .select(`
          id,
          prediction_home_score,
          prediction_away_score,
          game:games (
            id,
            game_date,
            round_id,
            home_team:teams!games_home_team_id_fkey (
              name
            ),
            away_team:teams!games_away_team_id_fkey (
              name
            ),
            game_results (
              home_score,
              away_score,
              is_final
            )
          )
        `)
        .eq('user_id', userId)
        .eq('game.round_id', selectedRound)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter to only include predictions with final results
      return data.filter(prediction => 
        prediction.game?.game_results && 
        Array.isArray(prediction.game.game_results) &&
        prediction.game.game_results.length > 0 && 
        prediction.game.game_results[0].is_final
      );
    },
    enabled: isOpen && !!selectedRound,
  });

  const getPredictionResult = (prediction: any) => {
    if (!prediction.game?.game_results?.[0]) return null;

    const predictionWinner = prediction.prediction_home_score > prediction.prediction_away_score 
      ? 'home' 
      : prediction.prediction_home_score < prediction.prediction_away_score 
        ? 'away' 
        : 'draw';

    const gameResult = prediction.game.game_results[0];
    const actualWinner = gameResult.home_score > gameResult.away_score 
      ? 'home' 
      : gameResult.home_score < gameResult.away_score 
        ? 'away' 
        : 'draw';

    return predictionWinner === actualWinner;
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

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {predictions?.map((prediction) => {
              const result = getPredictionResult(prediction);
              const isCorrect = result === true;

              return (
                <div 
                  key={prediction.id} 
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">
                        {prediction.game.home_team.name} vs {prediction.game.away_team.name}
                      </p>
                      {isCorrect ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      <p>Your prediction: {prediction.prediction_home_score} - {prediction.prediction_away_score}</p>
                      {prediction.game.game_results[0] && (
                        <p>Final score: {prediction.game.game_results[0].home_score} - {prediction.game.game_results[0].away_score}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {predictions?.length === 0 && selectedRound && (
              <div className="text-center py-6 text-muted-foreground">
                No completed predictions found for this round
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}