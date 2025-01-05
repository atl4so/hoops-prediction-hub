import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { RankDisplay } from "@/components/leaderboard/components/RankDisplay";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TeamPredictor } from "./types";

interface TeamTopPredictorsProps {
  teamId: string;
}

export function TeamTopPredictors({ teamId }: TeamTopPredictorsProps) {
  const { data: predictors, isLoading } = useQuery({
    queryKey: ["team-predictors", teamId],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_team_top_predictors', { 
          team_id_param: teamId,
          min_games: 1
        });
      
      if (error) {
        console.error('Error fetching team predictors:', error);
        throw error;
      }
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="py-4">
        <Card>
          <CardContent className="p-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-200 rounded" />
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-3 w-32 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="h-6 w-12 bg-gray-200 rounded" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!predictors?.length) {
    return (
      <div className="py-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              No predictions data available yet
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-4">
      <Card className="w-full overflow-hidden border-2 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4 sm:p-6">
          <h3 className="font-display text-lg font-semibold mb-4">
            Best Predictors
          </h3>
          <div className="space-y-4">
            {predictors.map((predictor: TeamPredictor, index: number) => (
              <div
                key={predictor.user_id}
                className={cn(
                  "flex items-center justify-between py-3 px-2 sm:px-4 rounded-lg",
                  "border-b border-border/50 last:border-0",
                  index <= 2 ? "bg-accent/20" : "",
                  index === 0 ? "bg-yellow-500/10" : "",
                  index === 1 ? "bg-gray-400/10" : "",
                  index === 2 ? "bg-amber-600/10" : ""
                )}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <RankDisplay rank={index + 1} />
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                    <AvatarImage src={predictor.avatar_url} />
                    <AvatarFallback>
                      <User className="h-4 w-4 sm:h-5 sm:w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm sm:text-base">{predictor.display_name}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {predictor.correct_predictions}/{predictor.total_predictions} predictions
                    </p>
                  </div>
                </div>
                <p className="text-base sm:text-xl font-semibold whitespace-nowrap">
                  {predictor.correct_predictions}/{predictor.total_predictions}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}