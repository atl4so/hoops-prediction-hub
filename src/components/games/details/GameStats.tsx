import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface GameStatsProps {
  game: any;
}

export function GameStats({ game }: GameStatsProps) {
  const renderPlayerStats = (players: any[], teamName: string) => {
    // Ensure players is always an array
    const playersArray = Array.isArray(players) ? players : [players];
    
    return (
      <Card className="bg-gradient-to-br from-background to-muted/5 border border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{teamName}</h3>
            <div className="text-xl font-bold">
              {teamName === game.localclub.name ? game.localclub.score : game.roadclub.score}
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead className="min-w-[180px]">Player</TableHead>
                  <TableHead className="text-right">MIN</TableHead>
                  <TableHead className="text-right">PTS</TableHead>
                  <TableHead className="text-right">2FG</TableHead>
                  <TableHead className="text-right">3FG</TableHead>
                  <TableHead className="text-right">FT</TableHead>
                  <TableHead className="text-right">OREB</TableHead>
                  <TableHead className="text-right">DREB</TableHead>
                  <TableHead className="text-right">REB</TableHead>
                  <TableHead className="text-right">AST</TableHead>
                  <TableHead className="text-right">STL</TableHead>
                  <TableHead className="text-right">BLK</TableHead>
                  <TableHead className="text-right">TO</TableHead>
                  <TableHead className="text-right">PF</TableHead>
                  <TableHead className="text-right">PIR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {playersArray.map((player: any, index: number) => (
                  player.PlayerName !== "Team" && (
                    <TableRow key={index} className="hover:bg-muted/50 border-border/50">
                      <TableCell className="font-medium">
                        <div className="flex flex-col gap-1.5">
                          <span>{player.PlayerName}</span>
                          {player.StartFive && (
                            <Badge variant="secondary" className="w-fit text-xs">
                              Starter
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium tabular-nums">{player.TimePlayed}</TableCell>
                      <TableCell className="text-right font-bold text-primary tabular-nums">{player.Score}</TableCell>
                      <TableCell className="text-right tabular-nums">{player.FieldGoalsMade2}-{player.FieldGoalsAttempted2}</TableCell>
                      <TableCell className="text-right tabular-nums">{player.FieldGoalsMade3}-{player.FieldGoalsAttempted3}</TableCell>
                      <TableCell className="text-right tabular-nums">{player.FreeThrowsMade}-{player.FreeThrowsAttempted}</TableCell>
                      <TableCell className="text-right tabular-nums">{player.OffensiveRebounds}</TableCell>
                      <TableCell className="text-right tabular-nums">{player.DefensiveRebounds}</TableCell>
                      <TableCell className="text-right tabular-nums">{player.TotalRebounds}</TableCell>
                      <TableCell className="text-right tabular-nums">{player.Assistances}</TableCell>
                      <TableCell className="text-right tabular-nums">{player.Steals}</TableCell>
                      <TableCell className="text-right tabular-nums">{player.BlocksFavour}</TableCell>
                      <TableCell className="text-right tabular-nums">{player.Turnovers}</TableCell>
                      <TableCell className="text-right tabular-nums">{player.FoulsCommited}</TableCell>
                      <TableCell className="text-right font-medium tabular-nums">{player.Valuation}</TableCell>
                    </TableRow>
                  )
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {renderPlayerStats(game.localclub.playerstats.stat, game.localclub.name)}
      {renderPlayerStats(game.roadclub.playerstats.stat, game.roadclub.name)}
    </div>
  );
}