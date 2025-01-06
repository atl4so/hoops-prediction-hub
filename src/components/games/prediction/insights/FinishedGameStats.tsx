import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BasicNumbers } from "./BasicNumbers";
import { PredictionPatterns } from "./PredictionPatterns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Medal, Award, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface FinishedGameStatsProps {
  predictions: any[];
  finalScore: {
    home: number;
    away: number;
  };
  basicStats: {
    totalPredictions: number;
    homeWinPredictions: number;
    awayWinPredictions: number;
    avgHomeScore: number;
    avgAwayScore: number;
    commonMargin: string;
    totalPointsRange: string;
    avgHomeWinMargin: number;
    avgAwayWinMargin: number;
  };
  topPredictors: any[];
}

const rankIcons = {
  0: { icon: Trophy, color: "text-yellow-500" },
  1: { icon: Medal, color: "text-gray-400" },
  2: { icon: Award, color: "text-amber-700" }
};

export function FinishedGameStats({
  predictions,
  finalScore,
  basicStats,
  topPredictors
}: FinishedGameStatsProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <BasicNumbers
          totalPredictions={basicStats.totalPredictions}
          homeWinPredictions={basicStats.homeWinPredictions}
          awayWinPredictions={basicStats.awayWinPredictions}
          avgHomeScore={basicStats.avgHomeScore}
          avgAwayScore={basicStats.avgAwayScore}
        />
        <PredictionPatterns
          marginRange={basicStats.commonMargin}
          totalPointsRange={basicStats.totalPointsRange}
        />
      </div>

      {topPredictors.length > 0 && (
        <Card className="border-2 border-primary/10">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-primary/80 flex items-center gap-2 mb-4">
              <Trophy className="h-5 w-5" />
              Top Predictors
            </h3>
            <div className="space-y-2">
              {topPredictors.map((predictor, index) => {
                const RankIcon = rankIcons[index]?.icon || Trophy;
                return (
                  <div 
                    key={index} 
                    className={cn(
                      "flex items-center justify-between p-2.5 rounded-lg transition-colors",
                      "bg-accent/50 hover:bg-accent border border-primary/5",
                      "animate-fade-in [--delay:200ms]"
                    )}
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                      opacity: 0 
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <RankIcon className={cn("h-4 w-4", rankIcons[index]?.color)} />
                      <Avatar className="h-6 w-6 border border-primary/20">
                        <AvatarImage src={predictor.profiles.avatar_url} />
                        <AvatarFallback>
                          <User className="h-3 w-3" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium leading-none">
                          {predictor.profiles.display_name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {predictor.prediction_home_score} - {predictor.prediction_away_score}
                        </span>
                      </div>
                    </div>
                    <Badge 
                      variant="secondary"
                      className="bg-primary/5 hover:bg-primary/10 text-primary/80 text-xs"
                    >
                      {predictor.points_earned} pts
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}