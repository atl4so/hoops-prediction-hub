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
      "group transition-all duration-300 hover:shadow-lg border-2",
      "hover:scale-[1.02] hover:-translate-y-0.5",
      highlight ? "bg-white/90 border-primary/20" : "bg-white/80 hover:bg-white/90",
      "backdrop-blur-md"
    )}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className={cn(
            "rounded-xl p-3 sm:p-4 transition-colors duration-300",
            highlight 
              ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground group-hover:from-primary/90 group-hover:to-primary/70" 
              : "bg-white/50 group-hover:bg-white/60"
          )}>
            <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-black/70">{label}</p>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-black/90 animate-fade-in">
              {value}
            </p>
            {description && (
              <p className="text-xs sm:text-sm text-black/60 max-w-[200px] mx-auto leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}