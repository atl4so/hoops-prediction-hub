import { format } from "date-fns";

interface GameDateTimeProps {
  date: string;
}

export function GameDateTime({ date }: GameDateTimeProps) {
  return (
    <div className="text-sm text-muted-foreground text-center">
      {format(new Date(date), "PPP")} at{" "}
      {format(new Date(date), "p")}
    </div>
  );
}