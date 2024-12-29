import { AdminGameCard } from "../AdminGameCard";

interface GamesByRoundProps {
  roundId: string;
  roundName: string;
  games: any[];
  onEdit: (game: any) => void;
  onDelete: (gameId: string) => void;
  selectedGames: string[];
}

export function GamesByRound({
  roundId,
  roundName,
  games,
  onEdit,
  onDelete,
  selectedGames,
}: GamesByRoundProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {games.map((game) => (
        <AdminGameCard
          key={game.id}
          game={game}
          onEdit={onEdit}
          onDelete={onDelete}
          isSelected={selectedGames.includes(game.id)}
        />
      ))}
    </div>
  );
}