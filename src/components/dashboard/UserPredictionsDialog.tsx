import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GameCard } from "@/components/games/GameCard";
import { Skeleton } from "@/components/ui/skeleton";

interface UserPredictionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

export function UserPredictionsDialog({
  isOpen,
  onClose,
  userId,
  userName,
}: UserPredictionsDialogProps) {
  const [selectedRound, setSelectedRound] = useState<string>("all");

  const { data: rounds, isLoading: isLoadingRounds } = useQuery({
    queryKey: ["rounds"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rounds")
        .select("*")
        .order("start_date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: predictions, isLoading: isLoadingPredictions } = useQuery({
    queryKey: ["user-predictions", userId, selectedRound],
    queryFn: async () => {
      let query = supabase
        .from("predictions")
        .select(`
          id,
          prediction_home_score,
          prediction_away_score,
          points_earned,
          game:games (
            id,
            game_date,
            home_team:teams!games_home_team_id_fkey (
              id,
              name,
              logo_url
            ),
            away_team:teams!games_away_team_id_fkey (
              id,
              name,
              logo_url
            ),
            round:rounds (
              id,
              name
            ),
            game_results!game_results_game_id_fkey (
              home_score,
              away_score,
              is_final
            )
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (selectedRound !== "all") {
        query = query.eq("game.round_id", selectedRound);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.map(prediction => ({
        ...prediction,
        game: {
          ...prediction.game,
          game_results: Array.isArray(prediction.game.game_results) 
            ? prediction.game.game_results 
            : [prediction.game.game_results].filter(Boolean)
        }
      }));
    },
    enabled: isOpen,
  });

  if (isLoadingRounds) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{userName}'s Predictions</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Select
            value={selectedRound}
            onValueChange={setSelectedRound}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by round" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rounds</SelectItem>
              {rounds?.map((round) => (
                <SelectItem key={round.id} value={round.id}>
                  Round {round.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {isLoadingPredictions ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-[200px]" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {predictions?.map((prediction) => (
                <GameCard
                  key={prediction.game.id}
                  game={prediction.game}
                  isAuthenticated={true}
                  prediction={{
                    prediction_home_score: prediction.prediction_home_score,
                    prediction_away_score: prediction.prediction_away_score,
                    points_earned: prediction.points_earned
                  }}
                />
              ))}
              {predictions?.length === 0 && (
                <p className="text-muted-foreground col-span-2 text-center py-8">
                  No predictions found for the selected round.
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}