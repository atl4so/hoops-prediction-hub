import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RoundForm } from "./RoundForm";

interface RoundDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  name: string;
  startDate?: Date;
  endDate?: Date;
  onNameChange: (value: string) => void;
  onStartDateChange: (date?: Date) => void;
  onEndDateChange: (date?: Date) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitLabel: string;
}

export function RoundDialog({
  isOpen,
  onOpenChange,
  title,
  name,
  startDate,
  endDate,
  onNameChange,
  onStartDateChange,
  onEndDateChange,
  onSubmit,
  isSubmitting,
  submitLabel,
}: RoundDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <RoundForm
          name={name}
          startDate={startDate}
          endDate={endDate}
          onNameChange={onNameChange}
          onStartDateChange={onStartDateChange}
          onEndDateChange={onEndDateChange}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
          submitLabel={submitLabel}
        />
      </DialogContent>
    </Dialog>
  );
}