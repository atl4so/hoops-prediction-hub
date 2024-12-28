import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { TeamDisplay } from "../games/TeamDisplay";
import { GameDateTime } from "../games/GameDateTime";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";

interface AdminGameCardProps {
  game: {
    id: string;
    game_date: string;
    home_team: {
      id: string;
      name: string;
      logo_url: string;
    };
    away_team: {
      id: string;
      name: string;
      logo_url: string;
    };
  };
  onEdit: (game: any) => void;
  onDelete: (gameId: string) => void;
  isSelected: boolean;
}

export function AdminGameCard({ game, onEdit, onDelete, isSelected }: AdminGameCardProps) {
  return (
    <Card className="w-full relative">
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => onEdit(game)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant={isSelected ? "default" : "secondary"}
          size="icon"
          onClick={() => onDelete(game.id)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <CardContent className="pt-6 px-6">
        <div className="space-y-4">
          <GameDateTime date={game.game_date} />
          
          <div className="grid grid-cols-3 gap-4 items-center">
            <TeamDisplay
              align="right"
              team={game.home_team}
            />
            <div className="text-center text-2xl font-bold">vs</div>
            <TeamDisplay
              align="left"
              team={game.away_team}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}