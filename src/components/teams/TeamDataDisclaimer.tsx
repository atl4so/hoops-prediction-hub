import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function TeamDataDisclaimer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        className="w-full text-red-500 flex items-center gap-2 hover:text-red-600 hover:bg-red-50 py-6"
        onClick={() => setIsOpen(true)}
      >
        <AlertTriangle className="h-5 w-5" />
        <span className="font-semibold">Important Information About Team Statistics - Click to Read</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Important Notice About Team Statistics
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Please note that euroleague.bet started operating from Round 19 of the season.
            </p>
            <p>
              As a result, the team statistics and user predictions shown here only reflect games and predictions made from Round 19 onwards.
            </p>
            <p>
              For complete team statistics including all rounds of the season, please refer to official Euroleague sources or other statistical platforms.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}