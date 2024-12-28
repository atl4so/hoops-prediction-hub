import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface GameDateTimeProps {
  date: string;
  className?: string;
}

export function GameDateTime({ date, className }: GameDateTimeProps) {
  return (
    <div className={cn("text-sm text-muted-foreground text-center", className)}>
      {format(new Date(date), "PPP")} at{" "}
      {format(new Date(date), "p")}
    </div>
  );
}