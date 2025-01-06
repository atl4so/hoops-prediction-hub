import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  className?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, className, children }: PageHeaderProps) {
  return (
    <section className={cn("text-center space-y-3 sm:space-y-4 mb-6 sm:mb-8", className)}>
      <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-black drop-shadow-[0_4px_4px_rgba(0,0,0,0.1)]">
        {title}
      </h1>
      <div className="text-base sm:text-lg text-black/80 drop-shadow-sm">
        {children}
      </div>
    </section>
  );
}