import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";

interface StatsButtonProps {
  onClick: () => void;
}

export function StatsButton({ onClick }: StatsButtonProps) {
  return (
    <Button 
      variant="outline" 
      className="w-full" 
      onClick={onClick}
    >
      <BarChart3 className="w-4 h-4 mr-2" />
      View Game Stats
    </Button>
  );
}