import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonList() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-[200px]" />
      ))}
    </div>
  );
}