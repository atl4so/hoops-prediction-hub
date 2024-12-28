import { cn } from "@/lib/utils";

interface TeamDisplayProps {
  name: string;
  logoUrl: string;
  className?: string;
}

export function TeamDisplay({ name, logoUrl, className }: TeamDisplayProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2 flex-1", className)}>
      <div className="relative w-16 h-16 rounded-full bg-background/80 p-2 shadow-sm">
        <img 
          src={logoUrl} 
          alt={`${name} logo`}
          className="w-full h-full object-contain"
        />
      </div>
      <span className="font-display text-sm font-semibold text-center leading-tight">
        {name}
      </span>
    </div>
  );
}