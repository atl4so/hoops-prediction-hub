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
  if (!team || !team.logo_url) {
    console.error('Missing team data:', team);
    return null;
  }

  return (
    <div className={cn(
      "flex flex-col items-center gap-3",
      align === "left" && "items-start",
      align === "right" && "items-end",
      className
    )}>
      <img 
        src={team.logo_url} 
        alt={`${team.name} logo`}
        className="w-16 h-16 object-contain"
      />
      <span className="font-display text-sm font-semibold text-center leading-tight w-full">
        {team.name}
      </span>
    </div>
  );
}