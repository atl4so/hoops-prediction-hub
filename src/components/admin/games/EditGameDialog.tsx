import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface EditGameDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  gameDate: Date | undefined;
  onGameDateChange: (date: Date | undefined) => void;
  gameTime: string;
  onGameTimeChange: (time: string) => void;
  onUpdate: () => void;
}

export function EditGameDialog({
  isOpen,
  onOpenChange,
  gameDate,
  onGameDateChange,
  gameTime,
  onGameTimeChange,
  onUpdate
}: EditGameDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Game Date/Time</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !gameDate && "text-muted-foreground"
                )}
              >
                {gameDate ? format(gameDate, "PPP") : "Game Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={gameDate}
                onSelect={onGameDateChange}
              />
            </PopoverContent>
          </Popover>
          <Input
            type="time"
            value={gameTime}
            onChange={(e) => onGameTimeChange(e.target.value)}
          />
          <Button onClick={onUpdate}>Update Game</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}