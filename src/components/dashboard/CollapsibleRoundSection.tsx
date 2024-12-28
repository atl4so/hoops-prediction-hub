import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { GameCard } from "@/components/games/GameCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

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
  
  const visiblePredictions = isMobile && !isExpanded 
    ? predictions.slice(0, 2) 
    : predictions;

  const hasMoreGames = isMobile && predictions.length > 2;
  const remainingGamesCount = predictions.length - 2;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-semibold tracking-tight">
          Round {roundName}
        </h2>
        {hasMoreGames && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-muted-foreground hover:text-primary"
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Show More <ChevronDown className="h-4 w-4" />
              </>
            )}
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
            game={prediction.game}
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