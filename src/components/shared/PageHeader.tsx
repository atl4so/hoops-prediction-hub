import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  className?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, className, children }: PageHeaderProps) {
  return (
    <section className={cn("text-center space-y-2 sm:space-y-4 mb-4 sm:mb-8", className)}>
      <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">{title}</h1>
      {children}
    </section>
  );
}