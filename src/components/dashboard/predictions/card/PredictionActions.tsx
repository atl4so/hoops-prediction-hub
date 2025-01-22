import { Button } from "@/components/ui/button";
import { Eye, Share2, BarChart3 } from "lucide-react";
import { toast } from "sonner";

interface PredictionActionsProps {
  onShare: () => void;
  onInsightsClick: () => void;
  onStatsClick: () => void;
  gameResult?: {
    home_score: number;
    away_score: number;
    is_final: boolean;
  };
  gameCode?: string;
}

export function PredictionActions({
  onShare,
  onInsightsClick,
  onStatsClick,
  gameResult,
  gameCode
}: PredictionActionsProps) {
  console.log('PredictionActions - gameCode:', gameCode, 'gameResult:', gameResult); 

  const handleStatsClick = () => {
    if (!gameResult?.is_final) {
      toast.error("Stats are only available for finished games");
      return;
    }
    if (!gameCode) {
      toast.error("Stats are not available for this game");
      return;
    }
    onStatsClick();
  };

  const showStats = gameResult?.is_final;

  return (
    <div className="mt-6 space-y-3">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8"
        onClick={onShare}
        title="Share Prediction"
      >
        <Share2 className="h-4 w-4" />
      </Button>

      {gameResult && (
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={onInsightsClick}
          data-insights-button
        >
          <Eye className="w-4 h-4 mr-2" />
          How Others Predicted
        </Button>
      )}
      
      {showStats && (
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleStatsClick}
          data-game-code={gameCode}
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          View Game Stats
        </Button>
      )}
    </div>
  );
}