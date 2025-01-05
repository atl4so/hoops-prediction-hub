import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

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
      <Card>
        <CardContent className="p-6">
          <h3 className="font-display text-lg font-semibold mb-4">
            Best Predictors
          </h3>
          <div className="space-y-4">
            {predictors.map((predictor, index) => (
              <div
                key={predictor.user_id}
                className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <span className="font-display text-lg font-semibold text-muted-foreground">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="font-medium">{predictor.display_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {predictor.correct_predictions}/{predictor.total_predictions} predictions
                    </p>
                  </div>
                </div>
                <p className="text-xl font-semibold">{predictor.success_rate}%</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}