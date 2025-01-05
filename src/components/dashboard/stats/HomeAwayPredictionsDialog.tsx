import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Check, X } from "lucide-react";
import { RoundSelector } from "../predictions/RoundSelector";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HomeAwayPredictionsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export function HomeAwayPredictionsDialog({
  isOpen,
  onOpenChange,
  userId,
}: HomeAwayPredictionsDialogProps) {
  const [selectedRound, setSelectedRound] = useState("");

  const { data: predictions, isLoading } = useQuery({
    queryKey: ['round-home-away-predictions', userId, selectedRound],
    queryFn: async () => {
      if (!selectedRound) return [];
      
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

  const getStats = (type: 'home' | 'away') => {
    if (!predictions) return { total: 0, correct: 0, percentage: 0 };

    const results = predictions.reduce((acc, pred) => {
      const isPredictedHomeWin = pred.prediction_home_score > pred.prediction_away_score;
      const isActualHomeWin = pred.game.game_results.home_score > pred.game.game_results.away_score;
      
      if (type === 'home' && isPredictedHomeWin) {
        acc.total++;
        if (isActualHomeWin) acc.correct++;
      } else if (type === 'away' && !isPredictedHomeWin) {
        acc.total++;
        if (!isActualHomeWin) acc.correct++;
      }
      
      return acc;
    }, { total: 0, correct: 0 });

    return {
      ...results,
      percentage: results.total > 0 ? Math.round((results.correct / results.total) * 100) : 0
    };
  };

  const getPredictionResult = (prediction: any) => {
    const isPredictedHomeWin = prediction.prediction_home_score > prediction.prediction_away_score;
    const isActualHomeWin = prediction.game.game_results.home_score > prediction.game.game_results.away_score;
    const isDraw = prediction.game.game_results.home_score === prediction.game.game_results.away_score;

    return {
      prediction: isPredictedHomeWin ? "Home Win" : "Away Win",
      actual: isDraw ? "Draw" : (isActualHomeWin ? "Home Win" : "Away Win"),
      isCorrect: isDraw 
        ? prediction.prediction_home_score === prediction.prediction_away_score
        : isPredictedHomeWin === isActualHomeWin
    };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Home/Away Winner Predictions</DialogTitle>
          <DialogDescription>
            View your home and away winner predictions by round
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 flex-1 overflow-y-auto">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <RoundSelector 
              selectedRound={selectedRound} 
              onRoundChange={setSelectedRound}
              className="w-full"
            />
          </div>

          {isLoading ? (
            <div className="text-center py-4 text-muted-foreground">
              Loading predictions...
            </div>
          ) : predictions && predictions.length > 0 ? (
            <Tabs defaultValue="home" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="home">Home Winners</TabsTrigger>
                <TabsTrigger value="away">Away Winners</TabsTrigger>
              </TabsList>

              {['home', 'away'].map((type) => {
                const stats = getStats(type as 'home' | 'away');
                return (
                  <TabsContent key={type} value={type} className="space-y-4">
                    <div className="text-center space-y-2">
                      <p className="text-2xl font-bold">{stats.percentage}%</p>
                      <p className="text-sm text-muted-foreground">
                        Correctly predicted {stats.correct} {type} wins out of {stats.total}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {predictions.map((prediction) => {
                        const isPredictedHomeWin = prediction.prediction_home_score > prediction.prediction_away_score;
                        const isRelevantPrediction = type === 'home' ? isPredictedHomeWin : !isPredictedHomeWin;
                        
                        if (!isRelevantPrediction) return null;

                        const result = getPredictionResult(prediction);

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
                              <div className="text-xs text-muted-foreground mt-1">
                                <p>Your prediction: {result.prediction}</p>
                                <p>Final result: {result.actual}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
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