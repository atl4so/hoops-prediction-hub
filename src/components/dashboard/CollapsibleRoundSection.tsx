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
  onRefresh?: () => Promise<void>;
}

export function CollapsibleRoundSection({ 
  roundId, 
  roundName, 
  predictions, 
  userId,
  onRefresh 
}: CollapsibleRoundSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshStartY, setRefreshStartY] = useState(0);
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  
  const defaultVisibleCount = isMobile ? 1 : 3;
  const visiblePredictions = isExpanded 
    ? predictions 
    : predictions.slice(0, defaultVisibleCount);

  const hasMoreGames = predictions.length > defaultVisibleCount;
  const remainingGamesCount = predictions.length - defaultVisibleCount;

  // Handle pull to refresh
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const scrollTop = document.documentElement.scrollTop;
      if (scrollTop <= 0) {
        setRefreshStartY(e.touches[0].clientY);
      }
    };

    const handleTouchMove = async (e: TouchEvent) => {
      if (refreshStartY === 0 || isRefreshing) return;
      
      const scrollTop = document.documentElement.scrollTop;
      const touchY = e.touches[0].clientY;
      const pullDistance = touchY - refreshStartY;
      
      if (scrollTop <= 0 && pullDistance > 100) {
        setIsRefreshing(true);
        if (onRefresh) {
          await onRefresh();
        }
        setIsRefreshing(false);
        setRefreshStartY(0);
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [refreshStartY, isRefreshing, onRefresh]);

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
    <section className="space-y-6 rounded-xl bg-background/50 p-4 sm:p-6 border border-border/50 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-border/80">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-display font-semibold tracking-tight">
            Round {roundName}
          </h2>
          <p className="text-sm text-muted-foreground">
            {predictions.length} {predictions.length === 1 ? 'game' : 'games'} in this round
          </p>
        </div>
        {hasMoreGames && isExpanded && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(false)}
            className="hidden sm:flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors group"
          >
            Show Less 
            <ChevronUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
          </Button>
        )}
      </div>
      
      {isRefreshing && (
        <div className="text-center text-sm text-muted-foreground animate-pulse">
          Refreshing...
        </div>
      )}
      
      <div className={cn(
        "grid gap-4 sm:gap-6",
        "sm:grid-cols-2 lg:grid-cols-3",
        "transition-all duration-300",
        isExpanded ? "animate-fade-in" : ""
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
          className="w-full py-3 mt-2 rounded-lg border border-border/50 bg-accent/50 text-sm text-center text-muted-foreground hover:text-primary hover:bg-accent transition-colors group flex items-center justify-center gap-2"
        >
          {remainingGamesCount} more {remainingGamesCount === 1 ? 'game' : 'games'} in this round
          <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
        </button>
      )}
    </section>
  );
}