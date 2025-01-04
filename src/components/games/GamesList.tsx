import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCallback, useMemo } from 'react';
import { subHours } from "date-fns";
import { useSession } from "@supabase/auth-helpers-react";
import { GameCard } from "./GameCard";
import { SkeletonList } from "./list/SkeletonList";
import { EmptyState } from "./list/EmptyState";
import { useGamesSubscription } from "./list/useGamesSubscription";
import { useGamesData } from "./list/useGamesData";

interface GamesListProps {
  isAuthenticated: boolean;
  userId?: string;
}

export function GamesList({ isAuthenticated, userId }: GamesListProps) {
  const session = useSession();
  useGamesSubscription();

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

  const { data: games, isLoading } = useGamesData(userId);

  const availableGames = useMemo(() => {
    if (!games) return [];
    
    const now = new Date();
    console.log('Filtering games:', games.length, 'total games');
    
    return games.filter(game => {
      const gameDate = new Date(game.game_date);
      const predictionDeadline = subHours(gameDate, 1);
      const notPredictedByUser = !userPredictions?.includes(game.id);
      const isBeforeDeadline = now < predictionDeadline;
      const gameResults = Array.isArray(game.game_results) 
        ? game.game_results 
        : game.game_results 
          ? [game.game_results] 
          : [];
      const hasNoFinalResult = !gameResults.some(result => result.is_final);
      
      console.log('Game:', game.id, {
        notPredictedByUser,
        isBeforeDeadline,
        hasNoFinalResult,
        deadline: predictionDeadline,
        gameDate: game.game_date,
        results: gameResults,
        userPredictions
      });
      
      return isBeforeDeadline && notPredictedByUser && hasNoFinalResult;
    });
  }, [games, userPredictions]);

  if (isLoading) {
    return <SkeletonList />;
  }

  if (!availableGames?.length) {
    return <EmptyState />;
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