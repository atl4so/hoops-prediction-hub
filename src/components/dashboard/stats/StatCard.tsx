import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  description?: string;
  delay?: number;
  highlight?: boolean;
}

export function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  description,
  delay = 0,
  highlight = false
}: StatCardProps) {
  return (
    <Card 
      className={cn(
        "group transition-all duration-300 hover:shadow-lg border-2",
        "hover:scale-[1.02] hover:-translate-y-0.5",
        highlight 
          ? "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20"
          : "hover:bg-accent/5",
        "opacity-0" // Start invisible for animation
      )}
      style={{
        animationDelay: `${delay * 0.1}s`,
        animation: 'fade-in 0.5s ease-out forwards'
      }}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className={cn(
            "rounded-xl p-3 sm:p-4 transition-colors duration-300",
            highlight 
              ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground group-hover:from-primary/90 group-hover:to-primary/70"
              : "bg-muted group-hover:bg-muted/80"
          )}>
            <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight">
              {value}
            </p>
            {description && (
              <p className="text-xs sm:text-sm text-muted-foreground max-w-[200px] mx-auto leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}