import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BasicNumbers } from "./BasicNumbers";
import { PredictionPatterns } from "./PredictionPatterns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Medal, Award } from "lucide-react";

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
  0: <Trophy className="h-5 w-5 text-yellow-500" />,
  1: <Medal className="h-5 w-5 text-gray-400" />,
  2: <Award className="h-5 w-5 text-amber-700" />
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
          commonMargin={basicStats.commonMargin}
          avgHomeWinMargin={basicStats.avgHomeWinMargin}
          avgAwayWinMargin={basicStats.avgAwayWinMargin}
        />
        <PredictionPatterns
          marginRange={basicStats.commonMargin}
          totalPointsRange={basicStats.totalPointsRange}
        />
      </div>

      {topPredictors.length > 0 && (
        <Card className="border-2 border-primary/10">
          <CardContent className="p-4 space-y-4">
            <h3 className="text-lg font-semibold text-primary/80 flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Top Predictors
            </h3>
            <div className="space-y-3">
              {topPredictors.map((predictor, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 bg-accent rounded-lg border border-primary/5 hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {rankIcons[index]}
                    <Avatar className="h-8 w-8 border-2 border-primary/20">
                      <AvatarImage src={predictor.profiles.avatar_url} />
                      <AvatarFallback>{predictor.profiles.display_name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{predictor.profiles.display_name}</span>
                      <span className="text-sm text-muted-foreground">
                        Predicted: {predictor.prediction_home_score} - {predictor.prediction_away_score}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="secondary"
                      className="bg-primary/5 hover:bg-primary/10 text-primary/80"
                    >
                      {predictor.points_earned} pts
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}