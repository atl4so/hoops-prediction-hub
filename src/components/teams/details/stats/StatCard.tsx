import { cn } from "@/lib/utils";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  subValue?: string;
  predictions?: number;
  tooltip: string;
  className?: string;
}

export function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  subValue, 
  predictions, 
  tooltip, 
  className = "" 
}: StatCardProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(
            "flex items-center gap-3 p-4 rounded-lg border-2 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20",
            "transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5",
            className
          )}>
            <div className="rounded-xl p-3 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-xl font-bold">{value}</p>
              {subValue && (
                <p className="text-xs text-muted-foreground mt-0.5">{subValue}</p>
              )}
              {predictions && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  Based on {predictions} total predictions
                </p>
              )}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[300px] text-sm">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}