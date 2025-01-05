import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Home, Plane } from "lucide-react";
import { RoundSelector } from "../predictions/RoundSelector";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PredictionsList } from "./home-away/PredictionsList";
import { StatsOverview } from "./home-away/StatsOverview";
import { DialogLayout, DialogContent as ScrollContent } from "@/components/shared/DialogLayout";
import { PredictionData } from "./types";

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

      // Transform and filter the data
      const transformedData = data
        .filter(pred => pred.game.game_results[0].is_final)
        .map(pred => ({
          ...pred,
          game: {
            ...pred.game,
            game_results: Array.isArray(pred.game.game_results) 
              ? pred.game.game_results 
              : [pred.game.game_results]
          }
        }));

      console.log('Transformed predictions:', transformedData);
      return transformedData as PredictionData[];
    },
    enabled: isOpen && !!selectedRound,
  });

  const getStats = (type: 'home' | 'away') => {
    if (!predictions || predictions.length === 0) return { total: 0, correct: 0, percentage: 0 };

    const results = predictions.reduce((acc, pred) => {
      const isPredictedHomeWin = pred.prediction_home_score > pred.prediction_away_score;
      const isActualHomeWin = pred.game.game_results[0].home_score > pred.game.game_results[0].away_score;
      
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0 gap-0">
        <DialogLayout>
          <div className="p-6 pb-0">
            <DialogHeader className="space-y-2">
              <DialogTitle>Home/Away Winner Predictions</DialogTitle>
              <DialogDescription>
                View your home and away winner predictions by round
              </DialogDescription>
            </DialogHeader>
          </div>

          <ScrollContent className="px-6">
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
              <Tabs defaultValue="home" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-9">
                  <TabsTrigger value="home" className="px-2 py-1.5">
                    <span className="flex items-center gap-1.5">
                      <Home className="h-3 w-3" />
                      <span className="text-xs">Home</span>
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="away" className="px-2 py-1.5">
                    <span className="flex items-center gap-1.5">
                      <Plane className="h-3 w-3" />
                      <span className="text-xs">Away</span>
                    </span>
                  </TabsTrigger>
                </TabsList>

                {['home', 'away'].map((type) => (
                  <TabsContent key={type} value={type} className="space-y-3 mt-3">
                    <StatsOverview 
                      stats={getStats(type as 'home' | 'away')}
                      type={type as 'home' | 'away'}
                    />
                    <PredictionsList 
                      predictions={predictions}
                      type={type as 'home' | 'away'}
                    />
                  </TabsContent>
                ))}
              </Tabs>
            ) : selectedRound ? (
              <div className="text-center py-6 text-muted-foreground">
                <p className="text-sm">No completed predictions found for this round</p>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p className="text-sm">Select a round to view predictions</p>
              </div>
            )}
          </ScrollContent>
        </DialogLayout>
      </DialogContent>
    </Dialog>
  );
}