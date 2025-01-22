import { Button } from "@/components/ui/button";
import { Eye, Share2, BarChart3 } from "lucide-react";

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
      
      {gameCode && (
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={onStatsClick}
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          View Game Stats
        </Button>
      )}
    </div>
  );
}