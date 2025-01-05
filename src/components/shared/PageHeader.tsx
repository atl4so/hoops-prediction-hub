import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  className?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, className, children }: PageHeaderProps) {
  return (
    <section className={cn(
      "text-center space-y-3 sm:space-y-4 mb-6 sm:mb-8 relative overflow-hidden py-8",
      "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:via-primary/10 before:to-primary/5",
      "after:absolute after:inset-0 after:bg-gradient-to-b after:from-transparent after:to-background/80",
      className
    )}>
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-24 h-24 bg-primary/5 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-accent rounded-full blur-2xl animate-pulse delay-300" />
      </div>

      {/* Animated lines */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-[slide-right_4s_linear_infinite]" />
        <div className="absolute left-0 right-0 top-1/3 h-[1px] bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-[slide-left_5s_linear_infinite]" />
      </div>

      <div className="relative">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight animate-fade-in">
          {title}
        </h1>
        {children && (
          <div className="animate-fade-in [animation-delay:200ms]">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}