import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FinishedGameStats } from "./FinishedGameStats";

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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            How Others Predicted
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">
            Loading predictions...
          </div>
        ) : !predictions?.length ? (
          <div className="py-8 text-center text-muted-foreground">
            No predictions found for this game
          </div>
        ) : (
          <div className="space-y-6">
            <FinishedGameStats
              predictions={predictions}
              finalScore={finalScore}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}