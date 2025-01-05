import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Check, X } from "lucide-react";

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
  const { data: recentPredictions } = useQuery({
    queryKey: ['recent-winner-predictions', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('predictions')
        .select(`
          id,
          prediction_home_score,
          prediction_away_score,
          game:games (
            id,
            game_date,
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
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
    enabled: isOpen,
  });

  const getPredictionResult = (prediction: any) => {
    // Ensure game_results exists and has data
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
          <DialogTitle>Recent Winner Predictions</DialogTitle>
          <DialogDescription>
            Your last 5 game predictions and their outcomes
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {recentPredictions?.map((prediction) => {
            const result = getPredictionResult(prediction);
            return (
              <div 
                key={prediction.id} 
                className="flex items-center justify-between p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {prediction.game.home_team.name} vs {prediction.game.away_team.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {prediction.prediction_home_score} - {prediction.prediction_away_score}
                  </p>
                </div>
                {result !== null && (
                  <div className="ml-4">
                    {result ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}