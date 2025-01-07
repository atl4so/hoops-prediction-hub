import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { FinishedGameStats } from "./FinishedGameStats";
import { TeamDisplay } from "@/components/games/TeamDisplay";
import { useIsMobile } from "@/hooks/use-mobile";

interface FinishedGameInsightsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  gameId: string;
  finalScore: {
    home: number;
    away: number;
  };
}

export function FinishedGameInsightsDialog({
  isOpen,
  onOpenChange,
  gameId,
  finalScore,
}: FinishedGameInsightsDialogProps) {
  const isMobile = useIsMobile();

  const { data: gameDetails } = useQuery({
    queryKey: ["game-details", gameId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("games")
        .select(`
          home_team:teams!games_home_team_id_fkey (
            name,
            logo_url
          ),
          away_team:teams!games_away_team_id_fkey (
            name,
            logo_url
          )
        `)
        .eq("id", gameId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: isOpen,
  });

  const { data: predictions, isLoading } = useQuery({
    queryKey: ["finished-game-predictions", gameId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("predictions")
        .select(`
          prediction_home_score,
          prediction_away_score,
          points_earned,
          profiles (
            display_name,
            avatar_url
          )
        `)
        .eq("game_id", gameId)
        .order("points_earned", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: isOpen,
  });

  if (isLoading || !gameDetails) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Loading predictions...</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  if (!predictions?.length) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>No predictions found</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-2 sm:mb-4">
            <TeamDisplay 
              team={gameDetails.home_team} 
              className={isMobile ? "w-12" : "w-16"}
              imageClassName="w-8 h-8 sm:w-12 sm:h-12"
            />
            <div className="text-lg sm:text-2xl font-bold">
              {finalScore.home} - {finalScore.away}
            </div>
            <TeamDisplay 
              team={gameDetails.away_team} 
              className={isMobile ? "w-12" : "w-16"}
              imageClassName="w-8 h-8 sm:w-12 sm:h-12"
            />
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-center">
            Game Insights
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          <FinishedGameStats
            predictions={predictions}
            finalScore={finalScore}
            basicStats={{
              totalPredictions: predictions.length,
              homeWinPredictions: predictions.filter(p => p.prediction_home_score > p.prediction_away_score).length,
              awayWinPredictions: predictions.filter(p => p.prediction_home_score < p.prediction_away_score).length,
              avgHomeScore: Math.round(predictions.reduce((sum, p) => sum + p.prediction_home_score, 0) / predictions.length * 10) / 10,
              avgAwayScore: Math.round(predictions.reduce((sum, p) => sum + p.prediction_away_score, 0) / predictions.length * 10) / 10,
              commonMargin: predictions.length > 0 ? Math.round(predictions.reduce((sum, p) => sum + Math.abs(p.prediction_home_score - p.prediction_away_score), 0) / predictions.length).toString() : "N/A",
              totalPointsRange: predictions.length > 0 ? `${Math.min(...predictions.map(p => p.prediction_home_score + p.prediction_away_score))}-${Math.max(...predictions.map(p => p.prediction_home_score + p.prediction_away_score))}` : "N/A",
              avgHomeWinMargin: predictions.filter(p => p.prediction_home_score > p.prediction_away_score).length > 0
                ? Math.round(predictions.filter(p => p.prediction_home_score > p.prediction_away_score)
                    .reduce((sum, p) => sum + (p.prediction_home_score - p.prediction_away_score), 0) / 
                    predictions.filter(p => p.prediction_home_score > p.prediction_away_score).length * 10) / 10
                : 0,
              avgAwayWinMargin: predictions.filter(p => p.prediction_home_score < p.prediction_away_score).length > 0
                ? Math.round(predictions.filter(p => p.prediction_home_score < p.prediction_away_score)
                    .reduce((sum, p) => sum + (p.prediction_away_score - p.prediction_home_score), 0) / 
                    predictions.filter(p => p.prediction_home_score < p.prediction_away_score).length * 10) / 10
                : 0
            }}
            topPredictors={predictions
              .filter(p => p.points_earned !== null)
              .sort((a, b) => (b.points_earned || 0) - (a.points_earned || 0))
              .slice(0, 3)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}