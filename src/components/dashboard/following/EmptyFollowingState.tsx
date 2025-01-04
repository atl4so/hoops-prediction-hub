import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export function EmptyFollowingState() {
  return (
    <Card className="border-dashed bg-background/50 backdrop-blur-sm animate-fade-in">
      <CardContent className="pt-4 sm:pt-6">
        <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4 py-6 sm:py-8 px-4">
          <div className="rounded-full bg-primary/10 p-3 sm:p-4">
            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          </div>
          <div className="space-y-1 sm:space-y-2 max-w-sm">
            <p className="text-base sm:text-lg font-semibold text-foreground">
              No Users Found
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Start following other users to see their predictions and compare your results. Use the search bar above to find users.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}