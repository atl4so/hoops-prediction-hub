import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GameCard } from "./GameCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

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

  return (
    <div className="space-y-12">
      {Object.entries(gamesByRound).map(([roundId, { name, games }]) => (
        <section key={roundId} className="space-y-6">
          <h2 className="text-2xl font-display font-semibold tracking-tight">
            Round {name}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => (
              <GameCard 
                key={game.id} 
                game={game} 
                isAuthenticated={isAuthenticated}
                userId={userId}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}