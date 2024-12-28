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
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div className={cn(
            "rounded-lg p-2.5",
            highlight ? "bg-primary text-primary-foreground" : "bg-muted"
          )}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}