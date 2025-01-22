import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface GameStatsProps {
  game: any; // We'll type this properly later
}

export function GameStats({ game }: GameStatsProps) {
  const renderPlayerStats = (players: any[], teamName: string) => (
    <Card className="bg-gradient-to-br from-background to-muted/20">
      <CardContent className="p-6">
        <h3 className="text-xl font-display font-semibold tracking-tight mb-6">{teamName} Box Score</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="min-w-[160px]">Player</TableHead>
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
              {players.map((player: any, index: number) => (
                player.PlayerName !== "Team" && (
                  <TableRow key={index} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{player.PlayerName}</span>
                        {player.StartFive && (
                          <Badge variant="secondary" className="w-fit mt-1">
                            Starter
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">{player.TimePlayed}</TableCell>
                    <TableCell className="text-right font-bold text-primary">{player.Score}</TableCell>
                    <TableCell className="text-right">{player.FieldGoals2}</TableCell>
                    <TableCell className="text-right">{player.FieldGoals3}</TableCell>
                    <TableCell className="text-right">{player.FreeThrows}</TableCell>
                    <TableCell className="text-right">{player.TotalRebounds}</TableCell>
                    <TableCell className="text-right">{player.Assistances}</TableCell>
                    <TableCell className="text-right">{player.Steals}</TableCell>
                    <TableCell className="text-right">{player.BlocksFavour}</TableCell>
                    <TableCell className="text-right">{player.Turnovers}</TableCell>
                    <TableCell className="text-right font-medium">{player.Valuation}</TableCell>
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
        <TabsTrigger value="home">{game.localclub.name}</TabsTrigger>
        <TabsTrigger value="away">{game.roadclub.name}</TabsTrigger>
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