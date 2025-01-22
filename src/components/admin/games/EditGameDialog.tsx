import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { PopoverContent, PopoverTrigger, Popover } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

interface EditGameDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  gameDate?: Date;
  onGameDateChange: (date: Date | undefined) => void;
  gameTime: string;
  onGameTimeChange: (time: string) => void;
  gameCode: string;
  onGameCodeChange: (code: string) => void;
  onUpdate: () => void;
}

export function EditGameDialog({
  isOpen,
  onOpenChange,
  gameDate,
  onGameDateChange,
  gameTime,
  onGameTimeChange,
  gameCode,
  onGameCodeChange,
  onUpdate,
}: EditGameDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Game</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex flex-col space-y-2">
            <span className="text-sm font-medium">Date</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "justify-start text-left font-normal",
                    !gameDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {gameDate ? format(gameDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={gameDate}
                  onSelect={onGameDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="text-sm font-medium">Time</span>
            <Input
              type="time"
              value={gameTime}
              onChange={(e) => onGameTimeChange(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <span className="text-sm font-medium">Game Code</span>
            <Input
              type="text"
              value={gameCode}
              onChange={(e) => onGameCodeChange(e.target.value)}
              placeholder="Enter game code (e.g. 198)"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onUpdate}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}