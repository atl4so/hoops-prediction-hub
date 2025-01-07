import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface InsightsButtonProps {
  onClick: () => void;
  gameResult?: {
    home_score: number;
    away_score: number;
    is_final: boolean;
  };
}

export function InsightsButton({ onClick, gameResult }: InsightsButtonProps) {
  return (
    <Button 
      variant="outline" 
      className="w-full" 
      onClick={onClick}
    >
      <Eye className="w-4 h-4 mr-2" />
      {gameResult ? "How Others Predicted" : "How Others Predict"}
    </Button>
  );
}