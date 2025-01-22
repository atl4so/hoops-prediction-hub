import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface GameStatsProps {
  game: any; // We'll type this properly later
}

export function GameStats({ game }: GameStatsProps) {
  const renderPlayerStats = (players: any[], teamName: string) => (
    <Card className="bg-gradient-to-br from-background to-muted/5 border border-border/50">
      <CardContent className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="min-w-[180px]">Player</TableHead>
                <TableHead className="text-right">MIN</TableHead>
                <TableHead className="text-right">PTS</TableHead>
                <TableHead className="text-right">REB</TableHead>
                <TableHead className="text-right">AST</TableHead>
                <TableHead className="text-right">PIR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {players.map((player: any, index: number) => (
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
                    <TableCell className="text-right tabular-nums">{player.TotalRebounds}</TableCell>
                    <TableCell className="text-right tabular-nums">{player.Assistances}</TableCell>
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

  return (
    <Tabs defaultValue="home" className="space-y-6 animate-fade-in">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="home">Home</TabsTrigger>
        <TabsTrigger value="away">Away</TabsTrigger>
      </TabsList>
      <TabsContent value="home" className="space-y-4">
        {renderPlayerStats(game.localclub.playerstats.stat, game.localclub.name)}
      </TabsContent>
      <TabsContent value="away" className="space-y-4">
        {renderPlayerStats(game.roadclub.playerstats.stat, game.roadclub.name)}
      </TabsContent>
    </Tabs>
  );
}