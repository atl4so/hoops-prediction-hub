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
              away_score
            )
          )
        `)
        .eq('user_id', userId)
        .eq('game:games.round_id', selectedRound)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: isOpen && !!selectedRound,
  });

  const getPredictionResult = (prediction: any) => {
    if (!prediction.game?.game_results?.length) return null;

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
            View your winner predictions for each round
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <RoundSelector 
            selectedRound={selectedRound} 
            onRoundChange={setSelectedRound}
            className="w-full"
          />

          {predictions?.map((prediction) => {
            const result = getPredictionResult(prediction);
            const isCorrect = result === true;
            const isPending = result === null;

            return (
              <div 
                key={prediction.id} 
                className={`flex items-center justify-between p-3 rounded-lg border 
                  ${isCorrect ? 'bg-green-50 border-green-200' : 
                    isPending ? 'bg-gray-50 border-gray-200' : 
                    'bg-red-50 border-red-200'}`}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium flex items-center gap-2">
                    {prediction.game.home_team.name} vs {prediction.game.away_team.name}
                    {!isPending && (
                      result ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-red-600" />
                      )
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Your prediction: {prediction.prediction_home_score} - {prediction.prediction_away_score}
                  </p>
                  {!isPending && prediction.game.game_results[0] && (
                    <p className="text-xs text-muted-foreground">
                      Final score: {prediction.game.game_results[0].home_score} - {prediction.game.game_results[0].away_score}
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {predictions?.length === 0 && selectedRound && (
            <div className="text-center py-6 text-muted-foreground">
              No predictions found for this round
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}