import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GameCard } from "./GameCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CollapsibleRoundSection } from "../dashboard/CollapsibleRoundSection";

interface GamesListProps {
  isAuthenticated: boolean;
  userId?: string;
}

export function GamesList({ isAuthenticated, userId }: GamesListProps) {
  const queryClient = useQueryClient();

  const { data: games, isLoading } = useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("games")
        .select(`
          id,
          game_date,
          home_team:teams!games_home_team_id_fkey(id, name, logo_url),
          away_team:teams!games_away_team_id_fkey(id, name, logo_url),
          round:rounds(id, name),
          game_results!game_results_game_id_fkey(
            home_score,
            away_score,
            is_final
          )
        `)
        .order("game_date", { ascending: true });

      if (error) throw error;
      
      return data.map(game => ({
        ...game,
        game_results: Array.isArray(game.game_results) ? game.game_results : [game.game_results].filter(Boolean)
      }));
    },
  });

  // Subscribe to real-time updates for both game_results and predictions
  useEffect(() => {
    const channel = supabase
      .channel('games-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_results'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['games'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'predictions'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['predictions'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        {[1, 2].map((roundIndex) => (
          <div key={roundIndex} className="space-y-4">
            <Skeleton className="h-8 w-32" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[200px]" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Group games by round
  const gamesByRound = games?.reduce((acc, game) => {
    const roundId = game.round.id;
    if (!acc[roundId]) {
      acc[roundId] = {
        name: game.round.name,
        games: []
      };
    }
    acc[roundId].games.push(game);
    return acc;
  }, {} as Record<string, { name: string; games: typeof games }>) || {};

  // Convert to array and sort by round name in descending order
  const sortedRounds = Object.entries(gamesByRound)
    .map(([roundId, data]) => ({
      id: roundId,
      ...data
    }))
    .sort((a, b) => parseInt(b.name) - parseInt(a.name));

  // Get the latest round number
  const latestRoundNumber = sortedRounds.length > 0 ? parseInt(sortedRounds[0].name) : 0;

  return (
    <div className="space-y-12">
      {sortedRounds.map((round) => {
        const roundNumber = parseInt(round.name);
        const isLatestRound = roundNumber === latestRoundNumber;
        
        return (
          <CollapsibleRoundSection
            key={round.id}
            roundId={round.id}
            roundName={round.name}
            predictions={round.games.map(game => ({
              game,
              prediction: null // We don't have predictions in this context
            }))}
            userId={userId}
            defaultExpanded={isLatestRound}
          />
        );
      })}
    </div>
  );
}