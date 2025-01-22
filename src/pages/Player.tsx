import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { XMLParser } from "fast-xml-parser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import type { PlayerStats } from "@/types/euroleague-api";

export default function Player() {
  const { playerCode } = useParams();
  
  const { data: player, isLoading } = useQuery({
    queryKey: ["player", playerCode],
    queryFn: async () => {
      const response = await fetch(
        `https://api-live.euroleague.net/v1/players?playerCode=${playerCode}&seasonCode=E2024`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch player data");
      }

      const xmlText = await response.text();
      const parser = new XMLParser();
      const result = parser.parse(xmlText);
      return result.player as PlayerStats;
    },
    enabled: !!playerCode,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-8">
        <Skeleton className="h-12 w-3/4" />
        <Card>
          <Skeleton className="h-48" />
        </Card>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold text-destructive">Player not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <PageHeader title={player.name} />
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Player Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Team</p>
                <p className="font-medium">{player.clubname}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Position</p>
                <p className="font-medium">{player.position}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Height</p>
                <p className="font-medium">{player.height}m</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Country</p>
                <p className="font-medium">{player.country}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Jersey</p>
                <p className="font-medium">#{player.dorsal}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Birth Date</p>
                <p className="font-medium">{player.birthdate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Season Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Points per Game</p>
                <p className="font-medium">{player.score}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Minutes per Game</p>
                <p className="font-medium">{player.timeplayed}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rebounds per Game</p>
                <p className="font-medium">{player.totalrebounds}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Assists per Game</p>
                <p className="font-medium">{player.assistances}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">PIR per Game</p>
                <p className="font-medium">{player.valuation}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Steals per Game</p>
                <p className="font-medium">{player.steals}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">2PT%</p>
                <p className="font-medium">{player.fieldgoals2percent}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">3PT%</p>
                <p className="font-medium">{player.fieldgoals3percent}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">FT%</p>
                <p className="font-medium">{player.freethrowspercent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}