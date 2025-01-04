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
  const { data: predictions = [], isLoading, isError, refetch } = usePredictions(followedIds);

  useEffect(() => {
    console.log('Setting up subscriptions with followed IDs:', followedIds);
    
    const channel = supabase
      .channel('dashboard-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'predictions'
        },
        (payload) => {
          console.log('Predictions changed:', payload);
          refetch();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_results'
        },
        (payload) => {
          console.log('Game results changed:', payload);
          refetch();
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Cleaning up predictions channel...');
      supabase.removeChannel(channel);
    };
  }, [refetch, followedIds]);

  if (isError || followError) {
    console.error('Error loading predictions:', isError);
    console.error('Error loading followed users:', followError);
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
    console.log('No predictions found for followed users:', followedIds);
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

  // Sort predictions to show most recent first, including both finished and upcoming games
  const sortedPredictions = predictions
    .sort((a, b) => b.game.parsedDate.getTime() - a.game.parsedDate.getTime());

  console.log('Sorted predictions:', sortedPredictions.map(p => ({
    user: p.user.display_name,
    gameDate: p.game.game_date,
    round: p.game.round.name,
    hasResult: p.game.game_results?.length > 0
  })));

  return (
    <div className="space-y-4">
      {sortedPredictions.map((prediction) => (
        <PredictionCard 
          key={`${prediction.user.id}-${prediction.game.id}`}
          prediction={prediction}
        />
      ))}
    </div>
  );
}