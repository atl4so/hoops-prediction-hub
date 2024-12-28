import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { PointsBreakdown } from "./PointsBreakdown";

interface PointsBreakdownDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  prediction: {
    prediction_home_score: number;
    prediction_away_score: number;
  };
  result: {
    home_score: number;
    away_score: number;
  };
  points: number;
  isOwnPrediction?: boolean;
}

export function PointsBreakdownDialog({
  isOpen,
  onOpenChange,
  prediction,
  result,
  points,
  isOwnPrediction = false
}: PointsBreakdownDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Points Breakdown</AlertDialogTitle>
          <AlertDialogDescription>
            <PointsBreakdown
              prediction={prediction}
              result={result}
              points={points}
              isOwnPrediction={isOwnPrediction}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}