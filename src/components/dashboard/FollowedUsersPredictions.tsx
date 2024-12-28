import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { PredictionCard } from "./predictions/PredictionCard";
import { usePredictions } from "./predictions/usePredictions";
import { useFollowedUsers } from "./predictions/useFollowedUsers";
import { useUserPermissions } from "./predictions/useUserPermissions";

export function FollowedUsersPredictions() {
  const { data: userPermission } = useUserPermissions();
  const { data: followedIds = [] } = useFollowedUsers();
  
  const { 
    data: predictions, 
    isLoading, 
    refetch 
  } = usePredictions(
    followedIds,
    !!userPermission?.can_view_future_predictions
  );

  // Subscribe to real-time updates
  useEffect(() => {
    console.log('Setting up real-time subscriptions');
    
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
          console.log('User follows updated');
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
          console.log('Predictions updated');
          refetch();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_permissions'
        },
        () => {
          console.log('User permissions updated');
          refetch();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up subscriptions');
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
      {predictions.map((prediction) => (
        <PredictionCard 
          key={`${prediction.user.id}-${prediction.game.id}`}
          prediction={prediction}
        />
      ))}
    </div>
  );
}