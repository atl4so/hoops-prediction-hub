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
    <section key={roundId} className="space-y-6">
      <h2 className="text-2xl font-display font-semibold tracking-tight">
        Round {roundName}
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
    </section>
  );
}