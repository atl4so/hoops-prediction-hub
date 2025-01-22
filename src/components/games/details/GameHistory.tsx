import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface GameHistoryProps {
  game: any; // We'll type this properly later
}

export function GameHistory({ game }: GameHistoryProps) {
  // The history data is in game.headtoheadgames array
  const historyGames = game.headtoheadgames?.game || [];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Head to Head History</h3>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Home Team</TableHead>
                <TableHead className="text-center">Score</TableHead>
                <TableHead>Away Team</TableHead>
                <TableHead className="text-center">Competition</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(historyGames) ? (
                historyGames.map((historyGame: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {new Date(historyGame.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{historyGame.localclub.name}</TableCell>
                    <TableCell className="text-center">
                      {historyGame.localclub.score} - {historyGame.roadclub.score}
                    </TableCell>
                    <TableCell>{historyGame.roadclub.name}</TableCell>
                    <TableCell className="text-center">{historyGame.competition}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No previous matches found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}