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

  const { data: games, isLoading } = useGamesData(userId);

  if (isLoading) {
    return <SkeletonList />;
  }

  if (!games?.length) {
    return <EmptyState />;
  }

  return (
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
  );
}