import { Card, CardContent } from "@/components/ui/card";
import { Target, TrendingUp, Trophy } from "lucide-react";
import { BasicNumbers } from "./BasicNumbers";
import { PredictionPatterns } from "./PredictionPatterns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface FinishedGameStatsProps {
  predictions: Array<{
    prediction_home_score: number;
    prediction_away_score: number;
    points_earned: number | null;
    profiles: {
      display_name: string;
      avatar_url: string | null;
    };
  }>;
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
  };
  topPredictors: Array<{
    points_earned: number | null;
    profiles: {
      display_name: string;
      avatar_url: string | null;
    };
  }>;
}

export function FinishedGameStats({ predictions, finalScore, basicStats, topPredictors }: FinishedGameStatsProps) {
  return (
    <div className="space-y-6">
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

      {topPredictors.length > 0 && (
        <Card className="bg-card border-2 border-primary/20">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary/80" />
              <h3 className="font-semibold text-lg text-primary/80">Top Predictors</h3>
            </div>
            <div className="space-y-3">
              {topPredictors.map((prediction, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      {prediction.profiles.avatar_url ? (
                        <AvatarImage src={prediction.profiles.avatar_url} alt={prediction.profiles.display_name} />
                      ) : null}
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-muted-foreground">
                      {prediction.profiles.display_name}
                    </span>
                  </div>
                  <span className="font-semibold">{prediction.points_earned} pts</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}