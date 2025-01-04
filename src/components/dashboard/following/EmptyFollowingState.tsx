import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export function EmptyFollowingState() {
  return (
    <Card className="border-dashed bg-background/50 backdrop-blur-sm">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center space-y-4 py-8">
          <div className="rounded-full bg-primary/10 p-4">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2 max-w-sm">
            <p className="text-lg font-semibold text-foreground">
              No Users Found
            </p>
            <p className="text-sm text-muted-foreground">
              Start following other users to see their predictions and compare your results. Use the search bar above to find users.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}