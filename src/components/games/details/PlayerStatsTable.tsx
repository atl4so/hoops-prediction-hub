import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { User } from "lucide-react";

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
  PlayerCode?: string;
}

interface PlayerStatsTableProps {
  players: PlayerStats | PlayerStats[];
  teamName: string;
  teamScore: number;
}

export function PlayerStatsTable({ players, teamName, teamScore }: PlayerStatsTableProps) {
  // Ensure players is always an array
  const playersArray = Array.isArray(players) ? players : [players];

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
              {playersArray.map((player: PlayerStats, index: number) => (
                player.PlayerName !== "Team" && (
                  <TableRow key={index} className="hover:bg-muted/50 border-border/50">
                    <TableCell className="font-medium">
                      {player.PlayerCode ? (
                        <Link 
                          to={`/player/${player.PlayerCode}`}
                          className="flex flex-col gap-1.5 hover:text-primary transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{player.PlayerName}</span>
                          </div>
                          {player.StartFive && (
                            <Badge variant="secondary" className="w-fit text-xs">
                              Starter
                            </Badge>
                          )}
                        </Link>
                      ) : (
                        <div className="flex flex-col gap-1.5">
                          <span>{player.PlayerName}</span>
                          {player.StartFive && (
                            <Badge variant="secondary" className="w-fit text-xs">
                              Starter
                            </Badge>
                          )}
                        </div>
                      )}
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
}