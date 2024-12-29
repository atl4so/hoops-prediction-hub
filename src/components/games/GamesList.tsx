import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from 'react';
import { useQueryClient } from "@tanstack/react-query";
import { CollapsibleRoundSection } from "../dashboard/CollapsibleRoundSection";
import { subHours } from "date-fns";
import { useSession } from "@supabase/auth-helpers-react";
import { GameCard } from "./GameCard";

interface GamesListProps {
  isAuthenticated: boolean;
  userId?: string;
}

export function GamesList({ isAuthenticated, userId }: GamesListProps) {
  const session = useSession();
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log('Setting up real-time subscriptions for games and results...');
    
    const channel = supabase
      .channel('games-and-results-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_results'
        },
        (payload) => {
          console.log('Game result changed:', payload);
          // Invalidate both games and predictions queries
          queryClient.invalidateQueries({ queryKey: ['games'] });
          queryClient.invalidateQueries({ queryKey: ['predictions'] });
          queryClient.invalidateQueries({ queryKey: ['profiles'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'predictions'
        },
        (payload) => {
          console.log('Prediction changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['predictions'] });
          queryClient.invalidateQueries({ queryKey: ['profiles'] });
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Cleaning up subscriptions...');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: games, isLoading } = useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      console.log("Fetching games...");
      const { data, error } = await supabase
        .from("games")
        .select(`
          id,
          game_date,
          home_team:teams!games_home_team_id_fkey(id, name, logo_url),
          away_team:teams!games_away_team_id_fkey(id, name, logo_url),
          round:rounds(id, name),
          game_results(
            home_score,
            away_score,
            is_final
          )
        `)
        .order("game_date", { ascending: true });

      if (error) {
        console.error("Error fetching games:", error);
        throw error;
      }
      
      console.log("Raw games data:", data);
      
      return data.map(game => ({
        ...game,
        game_results: Array.isArray(game.game_results) 
          ? game.game_results 
          : game.game_results 
            ? [game.game_results] 
            : []
      }));
    },
  });

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

  // Filter games to show only those that are available for predictions
  const now = new Date();
  const availableGames = games?.filter(game => {
    const gameDate = new Date(game.game_date);
    const predictionDeadline = subHours(gameDate, 1);
    
    // Show games that:
    // 1. Have no final results
    // 2. Current time is before prediction deadline
    const hasNoFinalResult = !game.game_results?.some(result => result.is_final);
    const isBeforeDeadline = now < predictionDeadline;
    
    console.log(`Game ${game.id}:`, {
      hasNoFinalResult,
      isBeforeDeadline,
      gameResults: game.game_results,
      predictionDeadline: predictionDeadline.toISOString(),
      now: now.toISOString()
    });
    
    return hasNoFinalResult && isBeforeDeadline;
  }) || [];

  console.log("Available games:", availableGames);

  if (!availableGames?.length) {
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

  // Display games directly in a grid instead of grouping by rounds
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {availableGames.map((game) => (
        <GameCard
          key={game.id}
          game={game}
          isAuthenticated={isAuthenticated}
          userId={userId}
        />
      ))}
    </div>
  );
}