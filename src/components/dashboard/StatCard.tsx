import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  description?: string;
  highlight?: boolean;
}

export function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  description,
  highlight = false 
}: StatCardProps) {
  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      highlight && "border-primary/50 bg-primary/5"
    )}>
      <CardContent className="p-3 sm:p-6">
        <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
          <div className={cn(
            "rounded-lg p-2 sm:p-3",
            highlight ? "bg-primary text-primary-foreground" : "bg-muted"
          )}>
            <Icon className="h-5 w-5 sm:h-7 sm:w-7" />
          </div>
          <div className="space-y-1 sm:space-y-2">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-lg sm:text-3xl font-bold tracking-tight">{value}</p>
            {description && (
              <p className="text-[10px] sm:text-sm text-muted-foreground max-w-[200px] mx-auto leading-tight">
                {description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}