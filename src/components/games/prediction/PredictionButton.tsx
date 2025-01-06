import { Button } from "@/components/ui/button";
import { PredictionDialog } from "@/components/predictions/PredictionDialog";
import { FinishedGameInsightsDialog } from "./insights/FinishedGameInsightsDialog";
import { UpcomingGameInsightsDialog } from "./insights/UpcomingGameInsightsDialog";
import { useState } from "react";
import { Eye } from "lucide-react";

interface PredictionButtonProps {
  gameId: string;
  gameDate: string;
  hasResult?: boolean;
  hasPrediction?: boolean;
  isAuthenticated: boolean;
}

export function PredictionButton({
  gameId,
  gameDate,
  hasResult,
  hasPrediction,
  isAuthenticated
}: PredictionButtonProps) {
  const [showPredictionDialog, setShowPredictionDialog] = useState(false);
  const [showInsightsDialog, setShowInsightsDialog] = useState(false);

  const handleViewInsights = () => {
    setShowInsightsDialog(true);
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleViewInsights}
        className="flex items-center gap-2"
      >
        <Eye className="w-4 h-4" />
        <span>View Predictions</span>
      </Button>

      {hasResult ? (
        <FinishedGameInsightsDialog
          isOpen={showInsightsDialog}
          onOpenChange={setShowInsightsDialog}
          gameId={gameId}
        />
      ) : (
        <UpcomingGameInsightsDialog
          isOpen={showInsightsDialog}
          onOpenChange={setShowInsightsDialog}
          gameId={gameId}
        />
      )}

      <PredictionDialog
        isOpen={showPredictionDialog}
        onOpenChange={setShowPredictionDialog}
        gameId={gameId}
        gameDate={gameDate}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
}