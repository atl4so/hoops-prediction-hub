import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface InsightsButtonProps {
  onClick: () => void;
  gameResult?: {
    home_score: number;
    away_score: number;
    is_final: boolean;
  };
  className?: string;
}

export function InsightsButton({ onClick, gameResult, className }: InsightsButtonProps) {
  return (
    <Button 
      variant="outline" 
      className={cn("w-full", className)} 
      onClick={onClick}
    >
      <Eye className="w-4 h-4 mr-2" />
      {gameResult ? "How Others Predicted" : "How Others Predict"}
    </Button>
  );
}