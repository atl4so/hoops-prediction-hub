import { Card, CardContent } from "@/components/ui/card";

interface GameOverviewProps {
  game: any; // We'll type this properly later
}

export function GameOverview({ game }: GameOverviewProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid gap-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">{game.localclub.name}</h3>
              <p className="text-3xl font-bold">{game.localclub.score}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">vs</p>
            </div>
            <div className="text-right">
              <h3 className="text-lg font-semibold">{game.roadclub.name}</h3>
              <p className="text-3xl font-bold">{game.roadclub.score}</p>
            </div>
          </div>
          
          <div className="grid gap-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Venue:</span> {game.stadiumname}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Attendance:</span> {game.audience}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Date:</span> {new Date(game.cetdate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}