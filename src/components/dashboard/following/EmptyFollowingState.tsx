import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export function EmptyFollowingState() {
  return (
    <Card className="border-dashed">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <Users className="h-12 w-12 text-muted-foreground/50" />
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              You are not following anyone yet.
            </p>
            <p className="text-xs text-muted-foreground/75">
              Follow other users to see their predictions and compare your results.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}