import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { XMLParser } from "fast-xml-parser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { PlayerStats } from "@/types/euroleague-api";

export default function Player() {
  const { playerCode } = useParams();

  const { data: player, isLoading } = useQuery({
    queryKey: ["player", playerCode],
    queryFn: async () => {
      const response = await fetch(
        `https://api-live.euroleague.net/v1/players?playerCode=${playerCode}&seasonCode=E2024`
      );
      const xmlText = await response.text();
      const parser = new XMLParser();
      const result = parser.parse(xmlText);
      return result.player as PlayerStats;
    },
    enabled: !!playerCode,
  });

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  if (!player) {
    return <div>Player not found</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{player.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold">Personal Info</h3>
              <p>Height: {player.height}m</p>
              <p>Position: {player.position}</p>
              <p>Country: {player.country}</p>
              <p>Birth Date: {player.birthdate}</p>
            </div>
            <div>
              <h3 className="font-semibold">Team Info</h3>
              <p>Club: {player.clubname}</p>
              <p>Number: {player.dorsal}</p>
            </div>
            <div>
              <h3 className="font-semibold">Season Averages</h3>
              <p>Points: {player.score}</p>
              <p>Assists: {player.assistances}</p>
              <p>Rebounds: {player.totalrebounds}</p>
              <p>PIR: {player.valuation}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shooting Splits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="font-semibold">2PT%</p>
              <p>{player.fieldgoals2percent}</p>
            </div>
            <div>
              <p className="font-semibold">3PT%</p>
              <p>{player.fieldgoals3percent}</p>
            </div>
            <div>
              <p className="font-semibold">FT%</p>
              <p>{player.freethrowspercent}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="font-semibold">Steals</p>
              <p>{player.steals}</p>
            </div>
            <div>
              <p className="font-semibold">Blocks</p>
              <p>{player.blocksfavour}</p>
            </div>
            <div>
              <p className="font-semibold">Turnovers</p>
              <p>{player.turnovers}</p>
            </div>
            <div>
              <p className="font-semibold">Minutes</p>
              <p>{player.timeplayed}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}