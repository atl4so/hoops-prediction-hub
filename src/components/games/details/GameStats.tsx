import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface GameStatsProps {
  game: any; // We'll type this properly later
}

export function GameStats({ game }: GameStatsProps) {
  if (!game?.localclub?.playerstats || !game?.roadclub?.playerstats) {
    return <div>No player statistics available</div>;
  }

  const renderPlayerStats = (players: any[], teamName: string) => (
    <div className="space-y-4">
      <h4 className="font-semibold text-lg">{teamName}</h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Player</TableHead>
            <TableHead className="text-right">MIN</TableHead>
            <TableHead className="text-right">PTS</TableHead>
            <TableHead className="text-right">2FG</TableHead>
            <TableHead className="text-right">3FG</TableHead>
            <TableHead className="text-right">FT</TableHead>
            <TableHead className="text-right">REB</TableHead>
            <TableHead className="text-right">AST</TableHead>
            <TableHead className="text-right">STL</TableHead>
            <TableHead className="text-right">BLK</TableHead>
            <TableHead className="text-right">TO</TableHead>
            <TableHead className="text-right">PIR</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player: any) => (
            player.PlayerName !== "Team" && (
              <TableRow key={player.PlayerCode}>
                <TableCell className="font-medium">{player.PlayerName}</TableCell>
                <TableCell className="text-right">{player.TimePlayed}</TableCell>
                <TableCell className="text-right">{player.Score}</TableCell>
                <TableCell className="text-right">{player.FieldGoals2}</TableCell>
                <TableCell className="text-right">{player.FieldGoals3}</TableCell>
                <TableCell className="text-right">{player.FreeThrows}</TableCell>
                <TableCell className="text-right">{player.TotalRebounds}</TableCell>
                <TableCell className="text-right">{player.Assistances}</TableCell>
                <TableCell className="text-right">{player.Steals}</TableCell>
                <TableCell className="text-right">{player.BlocksFavour}</TableCell>
                <TableCell className="text-right">{player.Turnovers}</TableCell>
                <TableCell className="text-right">{player.Valuation}</TableCell>
              </TableRow>
            )
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <Card>
      <CardContent className="p-6 space-y-8">
        <div className="grid gap-8">
          {/* Team Totals */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-left">{game.localclub.name}</div>
            <div className="text-center font-semibold">Team Totals</div>
            <div className="text-right">{game.roadclub.name}</div>
            
            <div className="text-left">
              {game.localclub.totals.total.FieldGoalsPercent}%
            </div>
            <div className="text-center text-muted-foreground">Field Goals</div>
            <div className="text-right">
              {game.roadclub.totals.total.FieldGoalsPercent}%
            </div>
            
            <div className="text-left">
              {game.localclub.totals.total.TotalRebounds}
            </div>
            <div className="text-center text-muted-foreground">Rebounds</div>
            <div className="text-right">
              {game.roadclub.totals.total.TotalRebounds}
            </div>
            
            <div className="text-left">
              {game.localclub.totals.total.Assistances}
            </div>
            <div className="text-center text-muted-foreground">Assists</div>
            <div className="text-right">
              {game.roadclub.totals.total.Assistances}
            </div>
          </div>

          {/* Player Stats */}
          <div className="space-y-8">
            {/* Home Team Players */}
            {renderPlayerStats(game.localclub.playerstats.stat, game.localclub.name)}
            
            {/* Away Team Players */}
            {renderPlayerStats(game.roadclub.playerstats.stat, game.roadclub.name)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}