import { Card, CardContent } from "@/components/ui/card";

interface GameHistoryProps {
  game: any; // We'll type this properly later
}

export function GameHistory({ game }: GameHistoryProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid gap-4">
          <h3 className="text-lg font-semibold">Head to Head History</h3>
          
          {game.history?.games?.map((historyGame: any, index: number) => (
            <div key={index} className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-left">{historyGame.local}</div>
              <div className="text-center">
                {historyGame.localscore} - {historyGame.roadscore}
              </div>
              <div className="text-right">{historyGame.road}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}