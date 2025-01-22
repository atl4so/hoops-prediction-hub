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
          prediction={game.predictions?.find(p => p.user_id === userId)}
          isAuthenticated={isAuthenticated}
          userId={userId}
        />
      ))}
    </div>
  );
}