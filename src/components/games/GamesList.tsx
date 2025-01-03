import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useCallback, useMemo } from 'react';
import { useQueryClient } from "@tanstack/react-query";
import { subHours } from "date-fns";
import { useSession } from "@supabase/auth-helpers-react";
import { GameCard } from "./GameCard";
import type { Game } from "@/types/supabase";

interface GamesListProps {
  isAuthenticated: boolean;
  userId?: string;
}

export function GamesList({ isAuthenticated, userId }: GamesListProps) {
  const session = useSession();
  const queryClient = useQueryClient();

  const setupSubscriptions = useCallback(() => {
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
        () => {
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
        () => {
          queryClient.invalidateQueries({ queryKey: ['predictions'] });
          queryClient.invalidateQueries({ queryKey: ['profiles'] });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up subscriptions...');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  useEffect(() => {
    return setupSubscriptions();
  }, [setupSubscriptions]);

  const { data: userPredictions } = useQuery({
    queryKey: ["user-predictions", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("predictions")
        .select("game_id")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching user predictions:", error);
        throw error;
      }

      return data.map(p => p.game_id);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

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
          game_results(
            home_score,
            away_score,
            is_final
          )
        `);

      if (error) {
        console.error("Error fetching games:", error);
        throw error;
      }
      
      // Process games and parse dates
      const processedGames = data.map((game): Game => ({
        id: game.id,
        game_date: game.game_date,
        parsedDate: new Date(game.game_date),
        home_team: {
          id: game.home_team.id,
          name: game.home_team.name,
          logo_url: game.home_team.logo_url
        },
        away_team: {
          id: game.away_team.id,
          name: game.away_team.name,
          logo_url: game.away_team.logo_url
        },
        round: {
          id: game.round.id,
          name: game.round.name
        },
        game_results: Array.isArray(game.game_results)
          ? game.game_results.map(result => ({
              home_score: result.home_score,
              away_score: result.away_score,
              is_final: result.is_final
            }))
          : game.game_results
            ? [{
                home_score: game.game_results.home_score,
                away_score: game.game_results.away_score,
                is_final: game.game_results.is_final
              }]
            : []
      }));

      // Split into finished and unfinished games
      const unfinishedGames = processedGames
        .filter(game => !game.game_results?.some(result => result.is_final))
        .sort((a, b) => new Date(a.game_date).getTime() - new Date(b.game_date).getTime());

      const finishedGames = processedGames
        .filter(game => game.game_results?.some(result => result.is_final))
        .sort((a, b) => new Date(b.game_date).getTime() - new Date(a.game_date).getTime());

      // Combine with unfinished games first
      return [...unfinishedGames, ...finishedGames];
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const availableGames = useMemo(() => {
    if (!games) return [];
    
    const now = new Date();
    return games.filter(game => {
      const predictionDeadline = subHours(game.parsedDate, 1);
      
      const hasNoFinalResult = !game.game_results?.some(result => result.is_final);
      const isBeforeDeadline = now < predictionDeadline;
      const notPredictedByUser = !userPredictions?.includes(game.id);
      
      return hasNoFinalResult && isBeforeDeadline && notPredictedByUser;
    });
  }, [games, userPredictions]);

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[200px]" />
        ))}
      </div>
    );
  }

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
