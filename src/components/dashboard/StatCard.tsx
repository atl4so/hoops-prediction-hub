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
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "rounded-lg p-2",
              highlight ? "bg-primary text-primary-foreground" : "bg-muted"
            )}>
              <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
              <p className="text-xl sm:text-2xl font-bold tracking-tight">{value}</p>
            </div>
          </div>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}