import { cn } from "@/lib/utils";

interface TeamDisplayProps {
  team: {
    name: string;
    logo_url: string;
  };
  score?: number;
  align?: "left" | "right";
  className?: string;
  imageClassName?: string;
}

export function TeamDisplay({ team, score, align, className, imageClassName }: TeamDisplayProps) {
  if (!team || !team.logo_url) {
    console.error('Missing team data:', team);
    return null;
  }

  return (
    <div className={cn(
      "flex flex-col items-center gap-1 sm:gap-2",
      align === "left" && "items-start",
      align === "right" && "items-end",
      className
    )}>
      <div className={cn(
        "relative flex items-center justify-center",
        "dark:bg-card dark:rounded-full dark:p-2",
        "transition-colors duration-200"
      )}>
        <img 
          src={team.logo_url} 
          alt={`${team.name} logo`}
          className={cn(
            "w-16 h-16 object-contain",
            "dark:w-14 dark:h-14", // Slightly smaller in dark mode to account for padding
            imageClassName
          )}
        />
      </div>
      <span className="font-display text-xs sm:text-sm font-semibold text-center leading-tight w-full">
        {team.name}
      </span>
      {typeof score === 'number' && (
        <span className="text-lg font-bold">{score}</span>
      )}
    </div>
  );
}