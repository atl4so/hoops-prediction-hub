import { format } from "date-fns";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface GameResultCardProps {
  game: any;
  editingGame: string | null;
  scores: { home: string; away: string };
  gameCode: string;
  onScoreChange: (type: 'home' | 'away', value: string) => void;
  onGameCodeChange: (value: string) => void;
  onSave: (gameId: string) => void;
  onEdit: (game: any) => void;
  onCancel: () => void;
}

export function GameResultCard({
  game,
  editingGame,
  scores,
  gameCode,
  onScoreChange,
  onGameCodeChange,
  onSave,
  onEdit,
  onCancel,
}: GameResultCardProps) {
  const isEditing = editingGame === game.id;
  const hasResult = game.game_results?.[0];
  const isFinal = hasResult?.is_final;

  return (
    <Card key={game.id}>
      <CardHeader>
        <CardTitle className="text-lg">
          {format(new Date(game.game_date), "MMM d, yyyy HH:mm")}
        </CardTitle>
        <CardDescription>
          {game.home_team.name} vs {game.away_team.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          {isEditing ? (
            <>
              <Input
                type="number"
                value={scores.home}
                onChange={(e) => onScoreChange('home', e.target.value)}
                className="w-20"
                placeholder="Home"
              />
              <span>-</span>
              <Input
                type="number"
                value={scores.away}
                onChange={(e) => onScoreChange('away', e.target.value)}
                className="w-20"
                placeholder="Away"
              />
              <Input
                type="text"
                value={gameCode}
                onChange={(e) => onGameCodeChange(e.target.value)}
                className="w-32"
                placeholder="Game Code"
              />
              <div className="flex gap-2">
                <Button
                  size="icon"
                  onClick={() => onSave(game.id)}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={onCancel}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex-1">
                {hasResult ? (
                  <div className="space-y-2">
                    <span className="text-lg block">
                      {hasResult.home_score} - {hasResult.away_score}
                    </span>
                    {isFinal && (
                      <span className="text-sm text-muted-foreground block">
                        Game Code: {game.game_code || "Not set"}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-muted-foreground">No result</span>
                )}
              </div>
              <Button
                variant="outline"
                onClick={() => onEdit(game)}
              >
                {hasResult ? "Edit Result" : "Set Result"}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}