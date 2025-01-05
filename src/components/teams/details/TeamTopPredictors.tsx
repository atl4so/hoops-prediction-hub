import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

interface TeamTopPredictorsProps {
  teamId: string;
}

export function TeamTopPredictors({ teamId }: TeamTopPredictorsProps) {
  const { data: predictors } = useQuery({
    queryKey: ["team-predictors", teamId],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_team_top_predictors', { 
          team_id_param: teamId,
          min_games: 3
        });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="py-4">
      <Card>
        <CardContent className="p-6">
          <h3 className="font-display text-lg font-semibold mb-4">
            Best Predictors (min. 3 games)
          </h3>
          <div className="space-y-4">
            {predictors?.map((predictor, index) => (
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