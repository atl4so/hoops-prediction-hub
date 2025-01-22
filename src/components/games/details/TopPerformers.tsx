import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface PlayerPerformance {
  PlayerName: string;
  TimePlayed: string;
  Valuation: number;
  StartFive: boolean;
}

interface TopPerformersProps {
  players: PlayerPerformance[];
  teamName: string;
}

export function TopPerformers({ players, teamName }: TopPerformersProps) {
  // Sort players by PIR per minute and filter out those with minimal playing time
  const topPerformers = [...players]
    .filter(player => 
      player.PlayerName !== "Team" && 
      player.TimePlayed !== "00:00"
    )
    .sort((a, b) => {
      // Convert time played to minutes for comparison
      const getMinutes = (time: string) => {
        const [minutes] = time.split(':').map(Number);
        return minutes;
      };
      
      // Calculate PIR per minute for each player
      const minutesA = getMinutes(a.TimePlayed);
      const minutesB = getMinutes(b.TimePlayed);
      const pirPerMinuteA = a.Valuation / minutesA;
      const pirPerMinuteB = b.Valuation / minutesB;
      
      return pirPerMinuteB - pirPerMinuteA;
    })
    .slice(0, 3);

  return (
    <Card className="bg-gradient-to-br from-background to-muted/5 border border-border/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-semibold">{teamName} Top Performers</h3>
          </div>
          <span className="text-xs text-muted-foreground">PIR per minute</span>
        </div>
        <div className="grid gap-4">
          {topPerformers.map((player, index) => {
            // Calculate PIR per minute for display
            const minutes = parseInt(player.TimePlayed.split(':')[0]);
            const pirPerMinute = (player.Valuation / minutes).toFixed(2);
            
            return (
              <div 
                key={player.PlayerName}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-primary">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold">{player.PlayerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {player.TimePlayed} MIN
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-secondary-foreground">
                    {pirPerMinute}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PIR/min ({player.Valuation} total)
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}