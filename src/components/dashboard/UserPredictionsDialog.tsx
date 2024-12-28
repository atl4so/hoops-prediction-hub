import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { UserPredictionCard } from "./UserPredictionCard";
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
  const queryClient = useQueryClient();

  // Subscribe to real-time updates
  useEffect(() => {
    if (!isOpen) return;

    const channel = supabase
      .channel('game-results-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_results'
        },
        () => {
          console.log('Game results changed, invalidating queries...');
          queryClient.invalidateQueries({ queryKey: ['user-predictions', userId, selectedRound] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isOpen, userId, selectedRound, queryClient]);

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
            round_id,
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
            game_results (
              home_score,
              away_score,
              is_final
            )
          )
        `)
        .eq("user_id", userId);

      if (selectedRound !== "all") {
        // Join with games table and filter by round_id
        query = query.eq("game.round_id", selectedRound);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching predictions:", error);
        throw error;
      }

      // Filter out any null games (in case of data inconsistencies)
      return data
        .filter(prediction => prediction.game)
        .map(prediction => ({
          ...prediction,
          game: {
            ...prediction.game,
            game_results: prediction.game.game_results || []
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
                <UserPredictionCard
                  key={prediction.game.id}
                  game={prediction.game}
                  prediction={{
                    prediction_home_score: prediction.prediction_home_score,
                    prediction_away_score: prediction.prediction_away_score,
                    points_earned: prediction.points_earned
                  }}
                  gameResult={prediction.game.game_results?.[0]}
                />
              ))}
              {(!predictions || predictions.length === 0) && (
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