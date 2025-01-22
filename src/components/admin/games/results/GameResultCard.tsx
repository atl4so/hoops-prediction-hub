import { format } from "date-fns";
import { Check, X, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { GameStatsModal } from "@/components/games/stats/GameStatsModal";

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
  const [showStats, setShowStats] = useState(false);
  const isEditing = editingGame === game.id;
  const hasResult = game.game_results?.[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {format(new Date(game.game_date), "MMM d, yyyy HH:mm")}
        </CardTitle>
        <CardDescription>
          {game.home_team.name} vs {game.away_team.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {isEditing ? (
            <>
              <div className="flex items-center gap-4">
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
              </div>
              
              <div className="flex items-center gap-4">
                <Input
                  type="text"
                  value={gameCode}
                  onChange={(e) => onGameCodeChange(e.target.value)}
                  className="flex-1"
                  placeholder="Enter game code for stats (e.g. 198)"
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
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  {hasResult ? (
                    <>
                      <span className="text-lg block">
                        {hasResult.home_score} - {hasResult.away_score}
                      </span>
                      <span className="text-sm text-muted-foreground block">
                        Game Code: {game.game_code || "Not set"}
                      </span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">No result</span>
                  )}
                </div>
                <div className="flex gap-2">
                  {hasResult && game.game_code && (
                    <Button
                      variant="outline"
                      onClick={() => setShowStats(true)}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Stats
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => onEdit(game)}
                  >
                    {hasResult ? "Edit Result" : "Set Result"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
      {game.game_code && (
        <GameStatsModal
          isOpen={showStats}
          onOpenChange={setShowStats}
          gameId={game.id}
        />
      )}
    </Card>
  );
}