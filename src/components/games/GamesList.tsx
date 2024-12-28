import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GameCard } from "./GameCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CollapsibleRoundSection } from "../dashboard/CollapsibleRoundSection";
import { subHours } from "date-fns";

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

  // Subscribe to real-time updates
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

  // Filter games to only show upcoming games where predictions are still allowed
  const now = new Date();
  const availableGames = games?.filter(game => {
    const gameDate = new Date(game.game_date);
    const predictionDeadline = subHours(gameDate, 1);
    const hasNoResult = !game.game_results?.length;
    
    return hasNoResult && now < predictionDeadline;
  }) || [];

  // Group available games by round
  const gamesByRound = availableGames.reduce((acc, game) => {
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

  if (sortedRounds.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">
          No games available for predictions at the moment.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Check back later for upcoming games.
        </p>
      </div>
    );
  }

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
              prediction: null
            }))}
            userId={userId}
            defaultExpanded={isLatestRound}
          />
        );
      })}
    </div>
  );
}