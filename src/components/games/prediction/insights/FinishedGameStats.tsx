import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BasicNumbers } from "./BasicNumbers";
import { PredictionPatterns } from "./PredictionPatterns";

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

export function FinishedGameStats({
  predictions,
  finalScore,
  basicStats,
  topPredictors
}: FinishedGameStatsProps) {
  return (
    <div className="space-y-6">
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

      {topPredictors.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Top Predictors</h3>
          <div className="space-y-2">
            {topPredictors.map((predictor, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded-lg">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={predictor.profiles.avatar_url} />
                    <AvatarFallback>{predictor.profiles.display_name[0]}</AvatarFallback>
                  </Avatar>
                  <span>{predictor.profiles.display_name}</span>
                </div>
                <span className="font-semibold">{predictor.points_earned} pts</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}