import { Skeleton } from "@/components/ui/skeleton";

export function GameListSkeleton() {
  return (
    <div className="space-y-8">
      {[1, 2].map((roundIndex) => (
        <div key={roundIndex} className="space-y-4">
          <Skeleton className="h-8 w-32" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[200px]" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}