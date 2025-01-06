import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  description?: string;
  highlight?: boolean;
  onClick?: () => void;
  descriptionHighlight?: string;
}

export function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  description,
  highlight = false,
  onClick,
  descriptionHighlight
}: StatCardProps) {
  return (
    <Card 
      className={cn(
        "group transition-all duration-300",
        "hover:scale-[1.02] hover:-translate-y-0.5",
        "bg-[#FFF8F0]/95 backdrop-blur-sm border-neutral-200/30",
        "shadow-[0_2px_10px_rgba(0,0,0,0.06)]",
        onClick && "cursor-pointer hover:shadow-lg"
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className={cn(
            "rounded-xl p-3 transition-colors duration-300",
            highlight ? "bg-primary text-primary-foreground" : "bg-orange-500 text-white"
          )}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-base text-black/60 font-medium">{label}</p>
            <p className="text-3xl font-bold tracking-tight text-black">
              {value}
            </p>
            {description && (
              <p className="text-sm text-black/50 max-w-[200px] mx-auto leading-relaxed">
                {description}
                {descriptionHighlight && (
                  <span className="block text-orange-500 text-xs mt-1 font-medium">
                    {descriptionHighlight}
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}