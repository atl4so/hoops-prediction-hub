import { GameCreateForm } from "./GameCreateForm";
import { GamesList } from "./GamesList";

export function GameManager() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <GameCreateForm />
      </div>
      <GamesList />
    </div>
  );
}