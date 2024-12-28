import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

interface PredictionDisplayProps {
  homeScore: number;
  awayScore: number;
  pointsEarned?: number;
  onClick?: () => void;
  showBreakdownHint?: boolean;
  label?: string;
}

export function PredictionDisplay({ 
  homeScore, 
  awayScore, 
  pointsEarned,
  onClick,
  showBreakdownHint = false,
  label = "Your Prediction"
}: PredictionDisplayProps) {
  return (
    <div 
      className={cn(
        "text-sm text-center space-y-1",
        showBreakdownHint && "cursor-pointer hover:bg-accent/50 rounded-md p-2 transition-colors group",
      )}
      onClick={onClick}
    >
      <p className="font-medium">{label}</p>
      <p>
        {homeScore} - {awayScore}
      </p>
      {pointsEarned !== undefined && (
        <div className="space-y-0.5">
          <div className="flex items-center justify-center gap-1 text-primary">
            <span>Points: {pointsEarned}</span>
            {showBreakdownHint && (
              <Info className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
          {showBreakdownHint && (
            <p className="text-[10px] text-muted-foreground group-hover:text-primary transition-colors">
              Click for breakdown
            </p>
          )}
        </div>
      )}
    </div>
  );
}