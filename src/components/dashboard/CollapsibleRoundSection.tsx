import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { GameCard } from "@/components/games/GameCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CollapsibleRoundSectionProps {
  roundId: string;
  roundName: string;
  predictions: any[];
  userId: string | null;
}

export function CollapsibleRoundSection({ 
  roundId, 
  roundName, 
  predictions, 
  userId 
}: CollapsibleRoundSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  
  const defaultVisibleCount = isMobile ? 2 : 3;
  const visiblePredictions = isExpanded 
    ? predictions 
    : predictions.slice(0, defaultVisibleCount);

  const hasMoreGames = predictions.length > defaultVisibleCount;
  const remainingGamesCount = predictions.length - defaultVisibleCount;

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('game-results-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_results'
        },
        () => {
          console.log('Game results changed, invalidating queries...');
          queryClient.invalidateQueries({ queryKey: ['userPredictions'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-semibold tracking-tight">
          Round {roundName}
        </h2>
        {hasMoreGames && isExpanded && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(false)}
            className="flex items-center gap-1 text-muted-foreground hover:text-primary"
          >
            Show Less <ChevronUp className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className={cn(
        "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
        "transition-all duration-300"
      )}>
        {visiblePredictions.map((prediction) => (
          <GameCard
            key={prediction.game.id}
            game={{
              ...prediction.game,
              game_results: Array.isArray(prediction.game.game_results) 
                ? prediction.game.game_results 
                : [prediction.game.game_results].filter(Boolean)
            }}
            isAuthenticated={true}
            userId={userId}
            prediction={{
              prediction_home_score: prediction.prediction_home_score,
              prediction_away_score: prediction.prediction_away_score,
              points_earned: prediction.points_earned
            }}
          />
        ))}
      </div>
      
      {hasMoreGames && !isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full text-sm text-center text-muted-foreground hover:text-primary transition-colors"
        >
          {remainingGamesCount} more {remainingGamesCount === 1 ? 'game' : 'games'} in this round
        </button>
      )}
    </section>
  );
}