import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Home, Plane } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HomeAwayStatsDisplay } from "./HomeAwayStatsDisplay";
import { PredictionsList } from "./PredictionsList";

interface HomeAwayPredictionsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  roundId: string;
}

export function HomeAwayPredictionsDialog({
  isOpen,
  onOpenChange,
  userId,
  roundId,
}: HomeAwayPredictionsDialogProps) {
  const { data: roundInfo } = useQuery({
    queryKey: ['round-info', roundId],
    queryFn: async () => {
      if (!roundId) return null;
      const { data } = await supabase
        .from('rounds')
        .select('name')
        .eq('id', roundId)
        .single();
      return data;
    },
    enabled: !!roundId,
  });

  const { data: predictions, isLoading } = useQuery({
    queryKey: ['round-home-away-predictions', userId, roundId],
    queryFn: async () => {
      if (!roundId) return [];
      
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
        .eq('game.round_id', roundId);

      if (error) {
        console.error('Error fetching predictions:', error);
        throw error;
      }

      return data.filter(pred => pred.game.game_results.is_final);
    },
    enabled: isOpen && !!roundId,
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

  const homeStats = getStats('home');
  const awayStats = getStats('away');

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] flex flex-col bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#1A1F2C]">
            Round {roundInfo?.name} Winner Predictions
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 flex-1 overflow-y-auto">
          <HomeAwayStatsDisplay homeStats={homeStats} awayStats={awayStats} />

          {isLoading ? (
            <div className="text-center py-4 text-[#7E69AB]">
              Loading predictions...
            </div>
          ) : predictions && predictions.length > 0 ? (
            <Tabs defaultValue="home" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-[#1A1F2C]/5">
                <TabsTrigger value="home" className="gap-2 data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white">
                  <Home className="h-4 w-4" />
                  Home
                </TabsTrigger>
                <TabsTrigger value="away" className="gap-2 data-[state=active]:bg-[#7E69AB] data-[state=active]:text-white">
                  <Plane className="h-4 w-4" />
                  Away
                </TabsTrigger>
              </TabsList>

              <PredictionsList predictions={predictions} type="home" />
              <PredictionsList predictions={predictions} type="away" />
            </Tabs>
          ) : (
            <div className="text-center py-6 text-[#7E69AB]">
              No completed predictions found for this round
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}