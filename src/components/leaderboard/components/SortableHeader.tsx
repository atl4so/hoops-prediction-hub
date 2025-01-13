import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export type SortField = 'points' | 'winner' | 'games' | 'ppg' | 'efficiency' | 'underdog';
export type SortDirection = 'asc' | 'desc';

interface SortHeaderProps {
  field: SortField;
  children: React.ReactNode;
  currentSort: SortField;
  direction: SortDirection;
  onSort: (field: SortField) => void;
}

export function SortHeader({ field, children, currentSort, direction, onSort }: SortHeaderProps) {
  const isActive = currentSort === field;
  
  return (
    <div 
      className="flex items-center gap-1 cursor-pointer group justify-end"
      onClick={() => onSort(field)}
    >
      {children}
      <span className={cn(
        "transition-opacity",
        isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50"
      )}>
        {isActive && direction === 'desc' ? (
          <ArrowDown className="h-4 w-4" />
        ) : (
          <ArrowUp className="h-4 w-4" />
        )}
      </span>
    </div>
  );
}