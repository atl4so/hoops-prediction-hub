import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsButtonProps {
  onClick: () => void;
  className?: string;
}

export function StatsButton({ onClick, className }: StatsButtonProps) {
  return (
    <Button 
      variant="outline" 
      className={cn("w-full", className)} 
      onClick={onClick}
    >
      <BarChart3 className="w-4 h-4 mr-2" />
      View Game Stats
    </Button>
  );
}