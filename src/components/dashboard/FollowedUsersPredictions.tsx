import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { useEffect } from "react";

interface Prediction {
  prediction_home_score: number;
  prediction_away_score: number;
  points_earned: number | null;
  user: {
    id: string;
    display_name: string;
  };
  game: {
    id: string;
    game_date: string;
    home_team: {
      name: string;
    };
    away_team: {
      name: string;
    };
    game_results: Array<{
      home_score: number;
      away_score: number;
      is_final: boolean;
    }>;
  };
}

export function FollowedUsersPredictions() {
  const { data: predictions, isLoading, refetch } = useQuery({
    queryKey: ["followed-users-predictions"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // First get user permissions
      const { data: permissions } = await supabase
        .from("user_permissions")
        .select("can_view_future_predictions")
        .eq("user_id", user.id)
        .maybeSingle();

      // Get followed users
      const { data: follows } = await supabase
        .from("user_follows")
        .select("following_id")
        .eq("follower_id", user.id);

      if (!follows?.length) return [];

      const followedIds = follows.map(f => f.following_id);

      // Get predictions based on permissions
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("predictions")
        .select(`
          prediction_home_score,
          prediction_away_score,
          points_earned,
          user:profiles!predictions_user_id_fkey (
            id,
            display_name
          ),
          game:games (
            id,
            game_date,
            home_team:teams!games_home_team_id_fkey (
              name
            ),
            away_team:teams!games_away_team_id_fkey (
              name
            ),
            game_results (
              home_score,
              away_score,
              is_final
            )
          )
        `)
        .in("user_id", followedIds)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;

      // Filter predictions based on permissions and game results
      return data.filter(pred => {
        const gameResult = pred.game.game_results?.[0];
        return (
          // Show if admin enabled future predictions viewing
          permissions?.can_view_future_predictions ||
          // Or if the game has a final result
          (gameResult?.is_final && pred.points_earned !== null)
        );
      });
    },
  });

  // Subscribe to real-time updates for follows and predictions
  useEffect(() => {
    const channel = supabase
      .channel('dashboard-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_follows'
        },
        () => {
          refetch();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'predictions'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!predictions?.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            No predictions to show. Follow other users to see their predictions here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {predictions.map((prediction: Prediction) => (
        <Card key={`${prediction.user.id}-${prediction.game.id}`}>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{prediction.user.display_name}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(prediction.game.game_date), "PPp")}
                </p>
              </div>
              <div className="text-sm">
                <p>
                  {prediction.game.home_team.name} vs {prediction.game.away_team.name}
                </p>
                <p className="font-medium">
                  Prediction: {prediction.prediction_home_score} - {prediction.prediction_away_score}
                </p>
                {prediction.points_earned !== null && (
                  <p className="text-primary">
                    Points earned: {prediction.points_earned}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}