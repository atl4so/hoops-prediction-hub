import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BasicNumbers } from "./insights/BasicNumbers";
import { PredictionPatterns } from "./insights/PredictionPatterns";
import { useGameInsights } from "./insights/useGameInsights";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PredictionInsightsHeader } from "./insights/PredictionInsightsHeader";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PredictionInsightsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  gameId: string;
}

export function PredictionInsightsDialog({
  isOpen,
  onOpenChange,
  gameId
}: PredictionInsightsDialogProps) {
  const { data: insights, isLoading: insightsLoading, error: insightsError } = useGameInsights(gameId);
  
  const { data: game, isLoading: gameLoading } = useQuery({
    queryKey: ['game', gameId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('games')
        .select(`
          id,
          home_team:teams!games_home_team_id_fkey (
            name,
            logo_url
          ),
          away_team:teams!games_away_team_id_fkey (
            name,
            logo_url
          )
        `)
        .eq('id', gameId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!gameId
  });

  const isLoading = insightsLoading || gameLoading;

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary/80" />
            <p className="mt-2 text-sm text-muted-foreground">Loading insights...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (insightsError || !game) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="text-center text-muted-foreground">
            There was an error loading the prediction insights. Please try again later.
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!insights) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="text-center text-muted-foreground">
            Be the first to make a prediction for this game!
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh]">
        <PredictionInsightsHeader
          homeTeam={game.home_team}
          awayTeam={game.away_team}
        />

        <ScrollArea className="h-full max-h-[calc(85vh-120px)] pr-4">
          <div className="space-y-6">
            <BasicNumbers
              totalPredictions={insights.totalPredictions}
              homeWinPredictions={insights.homeWinPredictions}
              awayWinPredictions={insights.awayWinPredictions}
              avgHomeScore={insights.avgHomeScore}
              avgAwayScore={insights.avgAwayScore}
              commonMargin={insights.commonMarginRange}
              avgHomeWinMargin={insights.avgHomeWinMargin}
              avgAwayWinMargin={insights.avgAwayWinMargin}
            />

            <PredictionPatterns
              marginRange={insights.commonMarginRange}
              totalPointsRange={insights.totalPointsRange}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}