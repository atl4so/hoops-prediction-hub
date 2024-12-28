import { GameResultForm } from "./GameResultForm";
import { GameResultsList } from "./GameResultsList";

export function GameResults() {
  return (
    <div className="space-y-6">
      <GameResultForm />
      <GameResultsList />
    </div>
  );
}