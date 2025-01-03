import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useCallback, useMemo } from 'react';
import { useQueryClient } from "@tanstack/react-query";
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

  // Query to get user's existing predictions with increased cache time
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
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep unused data for 10 minutes
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
      
      console.log('Raw data:', data.map(g => ({ 
        date: g.game_date, 
        teams: `${g.home_team.name} vs ${g.away_team.name}`,
        results: g.game_results 
      })));
      
      // Process games and parse dates
      const processedGames = data.map(game => ({
        ...game,
        parsedDate: new Date(game.game_date),
        game_results: Array.isArray(game.game_results) 
          ? game.game_results 
          : game.game_results 
            ? [game.game_results] 
            : []
      }));

      console.log('Processed games:', processedGames.map(g => ({
        original: g.game_date,
        parsed: g.parsedDate,
        teams: `${g.home_team.name} vs ${g.away_team.name}`
      })));

      // Split into finished and unfinished games
      const unfinishedGames = processedGames
        .filter(game => !game.game_results?.some(result => result.is_final))
        .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime());

      console.log('Unfinished games after sort:', unfinishedGames.map(g => ({
        date: g.game_date,
        parsed: g.parsedDate,
        teams: `${g.home_team.name} vs ${g.away_team.name}`
      })));

      const finishedGames = processedGames
        .filter(game => game.game_results?.some(result => result.is_final))
        .sort((a, b) => b.parsedDate.getTime() - a.parsedDate.getTime());

      // Combine with unfinished games first
      return [...unfinishedGames, ...finishedGames];
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep unused data for 10 minutes
  });

  // Memoize the filtered games to prevent unnecessary recalculations
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
}