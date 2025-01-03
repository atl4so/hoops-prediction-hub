import { GamesList } from "@/components/games/GamesList";

interface DashboardGamesProps {
  isAuthenticated: boolean;
  userId?: string;
}

export function DashboardGames({ isAuthenticated, userId }: DashboardGamesProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">Available Games</h2>
      <GamesList isAuthenticated={isAuthenticated} userId={userId} />
    </div>
  );
}