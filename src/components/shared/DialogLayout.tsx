import { cn } from "@/lib/utils";

interface DialogLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogLayout({ children, className }: DialogLayoutProps) {
  return (
    <div className={cn(
      "space-y-4 flex-1 overflow-hidden flex flex-col h-[80vh] sm:h-[600px]",
      className
    )}>
      {children}
    </div>
  );
}

export function DialogContent({ children, className }: DialogLayoutProps) {
  return (
    <div className={cn(
      "flex-1 overflow-y-auto space-y-3 min-h-0",
      className
    )}>
      {children}
    </div>
  );
}