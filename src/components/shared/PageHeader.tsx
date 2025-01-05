import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  className?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, className, children }: PageHeaderProps) {
  return (
    <section className={cn(
      "text-center space-y-3 sm:space-y-4 mb-6 sm:mb-8 relative",
      "before:fixed before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:via-primary/10 before:to-primary/5 before:-z-20",
      "after:fixed after:inset-0 after:bg-gradient-to-b after:from-transparent after:to-background/80 after:-z-20",
      className
    )}>
      {/* Animated background elements - now fixed position */}
      <div className="fixed inset-0 -z-10">
        {/* Larger orbs with wider spread */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-xl animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-xl animate-pulse delay-700" />
        <div className="absolute top-1/3 -left-20 w-80 h-80 bg-accent rounded-full blur-2xl animate-pulse delay-300" />
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-accent rounded-full blur-2xl animate-pulse delay-500" />
      </div>

      {/* Animated lines - now full width */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-0 right-0 top-1/4 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-[slide-right_4s_linear_infinite]" />
        <div className="absolute left-0 right-0 top-2/4 h-[1px] bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-[slide-left_5s_linear_infinite]" />
        <div className="absolute left-0 right-0 top-3/4 h-[1px] bg-gradient-to-r from-transparent via-primary/15 to-transparent animate-[slide-right_6s_linear_infinite]" />
      </div>

      {/* Content with padding adjustments */}
      <div className="relative py-12 sm:py-16">
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