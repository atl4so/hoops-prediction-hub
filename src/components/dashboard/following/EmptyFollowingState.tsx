import { Users } from "lucide-react";

export function EmptyFollowingState() {
  return (
    <div className="text-center py-12 space-y-4 animate-fade-in">
      <div className="bg-white/50 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border border-neutral-200/50">
        <Users className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-display font-semibold tracking-tight">No Users Found</h3>
      <p className="text-muted-foreground max-w-sm mx-auto">
        Start following other users to see their predictions and compare your results with theirs.
      </p>
    </div>
  );
}