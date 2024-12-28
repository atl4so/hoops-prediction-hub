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
        showBreakdownHint && "cursor-pointer hover:bg-accent/50 rounded-md p-2 transition-all duration-200 group border border-transparent hover:border-border/50",
      )}
      onClick={onClick}
    >
      <p className="font-medium">{label}</p>
      <p>
        {homeScore} - {awayScore}
      </p>
      {pointsEarned !== undefined && (
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-primary">
            <span className="font-medium">Points: {pointsEarned}</span>
            {showBreakdownHint && (
              <Info className="h-3.5 w-3.5 opacity-80 group-hover:opacity-100 transition-all animate-pulse group-hover:animate-none" />
            )}
          </div>
          {showBreakdownHint && (
            <p className="text-[10px] text-muted-foreground group-hover:text-primary transition-colors font-medium">
              Click to see breakdown
            </p>
          )}
        </div>
      )}
    </div>
  );
}