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
        className="w-full text-red-500 flex items-center gap-2 hover:text-red-600 hover:bg-red-50 p-4 sm:p-6 text-left"
        onClick={() => setIsOpen(true)}
      >
        <AlertTriangle className="h-5 w-5 flex-shrink-0" />
        <span className="font-semibold text-sm sm:text-base">
          Important Information About Team Statistics
          <span className="block text-xs sm:text-sm font-normal mt-1 text-red-400">
            Click to read about data availability and limitations
          </span>
        </span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto mx-2 w-[calc(100%-1rem)] p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
              Important Notice About Team Statistics
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-muted-foreground text-sm sm:text-base">
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