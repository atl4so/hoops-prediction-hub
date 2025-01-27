import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { PlayerEfficiencyMetrics } from "./stats/PlayerEfficiencyMetrics";

interface PlayerPerformance {
  PlayerName: string;
  TimePlayed: string;
  StartFive: boolean;
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
  Valuation: number;
}

interface TopPerformersProps {
  players: PlayerPerformance[];
  teamName: string;
  teamTotals: {
    Score: number;
    Assistances: number;
    TotalRebounds: number;
  };
}

export function TopPerformers({ players, teamName, teamTotals }: TopPerformersProps) {
  // Sort players by PIR per minute and filter out those with minimal playing time
  const topPerformers = [...players]
    .filter(player => 
      player.PlayerName !== "Team" && 
      player.TimePlayed !== "00:00"
    )
    .sort((a, b) => {
      // Convert time played to minutes for comparison
      const getMinutes = (time: string) => {
        const [minutes, seconds] = time.split(':').map(Number);
        return minutes + (seconds / 60);
      };
      
      const minutesA = getMinutes(a.TimePlayed);
      const minutesB = getMinutes(b.TimePlayed);
      
      // Only calculate PIR per minute if player has played at least 30 seconds
      const pirPerMinuteA = minutesA >= 0.5 ? a.Valuation / minutesA : 0;
      const pirPerMinuteB = minutesB >= 0.5 ? b.Valuation / minutesB : 0;
      
      return pirPerMinuteB - pirPerMinuteA;
    })
    .slice(0, 3);

  return (
    <Card className="bg-gradient-to-br from-background to-muted/5 border border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <h3 className="text-base font-semibold">{teamName} Top Performers</h3>
          </div>
        </div>
        <div className="grid gap-2">
          {topPerformers.map((player, index) => {
            // Calculate PIR per minute for display
            const [minutes, seconds] = player.TimePlayed.split(':').map(Number);
            const totalMinutes = minutes + (seconds / 60);
            // Only calculate PIR/min if player has played at least 30 seconds
            const pirPerMinute = totalMinutes >= 0.5 
              ? (player.Valuation / totalMinutes).toFixed(2)
              : "0.00";
            
            return (
              <div 
                key={player.PlayerName}
                className="flex flex-col p-2 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-primary">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-sm">{player.PlayerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {player.TimePlayed} • PIR/m: {pirPerMinute} ({player.Valuation})
                      </p>
                    </div>
                  </div>
                </div>
                <PlayerEfficiencyMetrics 
                  stats={player}
                  teamTotals={teamTotals}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}