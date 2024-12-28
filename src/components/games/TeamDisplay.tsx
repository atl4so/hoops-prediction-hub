import { cn } from "@/lib/utils";

interface TeamDisplayProps {
  team: {
    name: string;
    logo_url: string;
  };
  align?: "left" | "right";
  className?: string;
}

export function TeamDisplay({ team, align, className }: TeamDisplayProps) {
  return (
    <div className={cn(
      "flex flex-col items-center gap-2 flex-1",
      align === "left" && "items-start",
      align === "right" && "items-end",
      className
    )}>
      <div className="relative w-16 h-16 rounded-full bg-background/80 p-2 shadow-sm">
        <img 
          src={team.logo_url} 
          alt={`${team.name} logo`}
          className="w-full h-full object-contain"
        />
      </div>
      <span className="font-display text-sm font-semibold text-center leading-tight w-full">
        {team.name}
      </span>
    </div>
  );
}