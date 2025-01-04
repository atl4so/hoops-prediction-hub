import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  description?: string;
  delay?: number;
}

export function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  description,
  delay = 0
}: StatCardProps) {
  return (
    <Card 
      className={cn(
        "bg-gradient-to-br from-white/80 to-white/40 dark:from-green-950/40 dark:to-green-900/20",
        "border border-white/20 dark:border-white/10",
        "backdrop-blur-md shadow-lg hover:shadow-xl",
        "group transition-all duration-300",
        "hover:scale-[1.02] hover:-translate-y-0.5"
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
            "bg-[#F97316] text-primary-foreground"
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