import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface PlayerStats {
  PlayerName: string;
  StartFive: boolean;
  TimePlayed: string;
  Score: number;
  FieldGoalsMade2: number;
  FieldGoalsAttempted2: number;
  FieldGoalsMade3: number;
  FieldGoalsAttempted3: number;
  FreeThrowsMade: number;
  FreeThrowsAttempted: number;
  OffensiveRebounds: number;
  DefensiveRebounds: number;
  TotalRebounds: number;
  Assistances: number;
  Steals: number;
  BlocksFavour: number;
  Turnovers: number;
  FoulsCommited: number;
  Valuation: number;
}

interface PlayerStatsTableProps {
  players: PlayerStats | PlayerStats[];
  teamName: string;
  teamScore: number;
}

export function PlayerStatsTable({ players, teamName, teamScore }: PlayerStatsTableProps) {
  // Ensure players is always an array
  const playersArray = Array.isArray(players) ? players : [players];

  const calculatePercentage = (made: number, attempted: number): string => {
    if (attempted === 0) return "0.0";
    return ((made / attempted) * 100).toFixed(1);
  };

  return (
    <Card className="bg-gradient-to-br from-background to-muted/5 border border-border/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{teamName}</h3>
          <div className="text-xl font-bold">{teamScore}</div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="min-w-[180px]">Player</TableHead>
                <TableHead className="text-right font-bold text-primary">PTS</TableHead>
                <TableHead className="text-right font-bold text-secondary-foreground">PIR</TableHead>
                <TableHead className="text-right">2FG</TableHead>
                <TableHead className="text-right">%</TableHead>
                <TableHead className="text-right">3FG</TableHead>
                <TableHead className="text-right">%</TableHead>
                <TableHead className="text-right">FT</TableHead>
                <TableHead className="text-right">%</TableHead>
                <TableHead className="text-right">OREB</TableHead>
                <TableHead className="text-right">DREB</TableHead>
                <TableHead className="text-right font-bold text-orange-500">REB</TableHead>
                <TableHead className="text-right font-bold text-blue-500">AST</TableHead>
                <TableHead className="text-right text-green-500">STL</TableHead>
                <TableHead className="text-right text-yellow-500">BLK</TableHead>
                <TableHead className="text-right text-red-500">TO</TableHead>
                <TableHead className="text-right">PF</TableHead>
                <TableHead className="text-right">MIN</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {playersArray.map((player: PlayerStats, index: number) => (
                player.PlayerName !== "Team" && (
                  <TableRow key={index} className="hover:bg-muted/50 border-border/50">
                    <TableCell className="font-medium">
                      <div className="flex flex-col gap-1.5">
                        <span>{player.PlayerName}</span>
                        {player.StartFive && (
                          <Badge variant="default" className="w-fit text-xs bg-green-500 hover:bg-green-600">
                            Starter
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold text-primary tabular-nums">{player.Score}</TableCell>
                    <TableCell className="text-right font-bold text-secondary-foreground tabular-nums">{player.Valuation}</TableCell>
                    <TableCell className="text-right tabular-nums">{player.FieldGoalsMade2}-{player.FieldGoalsAttempted2}</TableCell>
                    <TableCell className="text-right tabular-nums">{calculatePercentage(player.FieldGoalsMade2, player.FieldGoalsAttempted2)}%</TableCell>
                    <TableCell className="text-right tabular-nums">{player.FieldGoalsMade3}-{player.FieldGoalsAttempted3}</TableCell>
                    <TableCell className="text-right tabular-nums">{calculatePercentage(player.FieldGoalsMade3, player.FieldGoalsAttempted3)}%</TableCell>
                    <TableCell className="text-right tabular-nums">{player.FreeThrowsMade}-{player.FreeThrowsAttempted}</TableCell>
                    <TableCell className="text-right tabular-nums">{calculatePercentage(player.FreeThrowsMade, player.FreeThrowsAttempted)}%</TableCell>
                    <TableCell className="text-right tabular-nums">{player.OffensiveRebounds}</TableCell>
                    <TableCell className="text-right tabular-nums">{player.DefensiveRebounds}</TableCell>
                    <TableCell className="text-right font-bold text-orange-500 tabular-nums">{player.TotalRebounds}</TableCell>
                    <TableCell className="text-right font-bold text-blue-500 tabular-nums">{player.Assistances}</TableCell>
                    <TableCell className="text-right text-green-500 tabular-nums">{player.Steals}</TableCell>
                    <TableCell className="text-right text-yellow-500 tabular-nums">{player.BlocksFavour}</TableCell>
                    <TableCell className="text-right text-red-500 tabular-nums">{player.Turnovers}</TableCell>
                    <TableCell className="text-right tabular-nums">{player.FoulsCommited}</TableCell>
                    <TableCell className="text-right font-medium tabular-nums">{player.TimePlayed}</TableCell>
                  </TableRow>
                )
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}