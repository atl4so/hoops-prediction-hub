import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface StatDetail {
  label: string;
  value: string;
  tooltip: string;
}

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  subValue: string;
  predictions?: number;
  tooltip: string;
  className?: string;
  details?: StatDetail[];
}

export function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  subValue, 
  predictions,
  tooltip,
  className = "",
  details = []
}: StatCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-3 cursor-help">
                <Icon className="h-5 w-5" />
                <h3 className="font-display text-lg font-semibold">{label}</h3>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" align="start" className="max-w-[250px] text-sm">
              {tooltip}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="mt-4 space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold">{value}</span>
            <span className="text-sm text-muted-foreground">{subValue}</span>
          </div>

          {details.map((detail, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex justify-between items-center text-sm cursor-help border-t pt-2">
                    <span className="text-muted-foreground">{detail.label}</span>
                    <span className="font-medium">{detail.value}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" align="start" className="max-w-[250px] text-sm">
                  {detail.tooltip}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}