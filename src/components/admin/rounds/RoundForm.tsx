import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface RoundFormProps {
  name: string;
  startDate?: Date;
  endDate?: Date;
  onNameChange: (value: string) => void;
  onStartDateChange: (date?: Date) => void;
  onEndDateChange: (date?: Date) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel: string;
}

export function RoundForm({
  name,
  startDate,
  endDate,
  onNameChange,
  onStartDateChange,
  onEndDateChange,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel
}: RoundFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          placeholder="Round name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "PPP") : <span>Start date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={onStartDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "PPP") : <span>End date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={onEndDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </div>
  );
}