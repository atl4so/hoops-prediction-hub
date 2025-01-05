import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  description?: string;
  delay?: number;
  onClick?: () => void;
  descriptionIcons?: {
    firstIcon: LucideIcon;
    secondIcon: LucideIcon;
  };
}

export function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  description,
  delay = 0,
  onClick,
  descriptionIcons
}: StatCardProps) {
  const isClickable = !!onClick;

  return (
    <Card 
      className={cn(
        "group transition-all duration-300 hover:shadow-lg border-2",
        "hover:scale-[1.02] hover:-translate-y-0.5",
        "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20",
        "opacity-0", // Start invisible for animation
        isClickable && "cursor-pointer hover:border-primary/40 relative"
      )}
      style={{
        animationDelay: `${delay * 0.1}s`,
        animation: 'fade-in 0.5s ease-out forwards'
      }}
      onClick={onClick}
    >
      <CardContent className="p-2 sm:p-6">
        <div className="flex flex-col items-center text-center space-y-2 sm:space-y-4">
          <div className={cn(
            "rounded-xl p-2 sm:p-4 transition-colors duration-300",
            "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground",
            "group-hover:from-primary/90 group-hover:to-primary/70"
          )}>
            <Icon className="h-4 w-4 sm:h-8 sm:w-8" />
          </div>
          <div className="space-y-1 sm:space-y-2">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-lg sm:text-3xl font-bold tracking-tight">
              {value}
            </p>
            {description && (
              <p className="text-xs sm:text-sm text-muted-foreground max-w-[200px] mx-auto leading-relaxed">
                {descriptionIcons ? (
                  <span className="flex items-center justify-center gap-1">
                    <span className="flex items-center gap-0.5">
                      <descriptionIcons.firstIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                      {description.split('|')[0].trim()}
                    </span>
                    <span className="text-muted-foreground mx-1">|</span>
                    <span className="flex items-center gap-0.5">
                      <descriptionIcons.secondIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                      {description.split('|')[1].trim()}
                    </span>
                  </span>
                ) : (
                  description
                )}
              </p>
            )}
            {isClickable && (
              <p className="text-xs text-primary animate-pulse mt-1 sm:mt-2">
                Click to view details
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}