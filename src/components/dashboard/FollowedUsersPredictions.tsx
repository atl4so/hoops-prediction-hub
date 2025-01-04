import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { PredictionCard } from "./predictions/PredictionCard";
import { usePredictions } from "./predictions/usePredictions";
import { useFollowedUsers } from "./predictions/useFollowedUsers";
import { toast } from "sonner";

export function FollowedUsersPredictions() {
  const { data: followedIds = [], isError: followError } = useFollowedUsers();
  const { data: predictions, isLoading, isError, refetch } = usePredictions(followedIds);

  useEffect(() => {
    const channel = supabase
      .channel('dashboard-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'predictions'
        },
        () => {
          console.log('Predictions changed, refetching...');
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  if (isError || followError) {
    toast.error("Failed to load predictions");
    return null;
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!followedIds.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Follow other users to see their predictions here.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!predictions?.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            No predictions from followed users yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Sort predictions to show most recent first and only show predictions for finished games
  const finishedPredictions = predictions
    .filter(prediction => 
      prediction.game.game_results?.some(result => result.is_final)
    )
    .sort((a, b) => b.game.parsedDate.getTime() - a.game.parsedDate.getTime());

  return (
    <div className="space-y-4">
      {finishedPredictions.map((prediction) => (
        <PredictionCard 
          key={`${prediction.user.id}-${prediction.game.id}`}
          prediction={prediction}
        />
      ))}
    </div>
  );
}