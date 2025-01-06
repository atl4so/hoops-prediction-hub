import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface CustomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  className?: string;
}

export function CustomDialog({
  open,
  onOpenChange,
  title,
  children,
  showCloseButton = true,
  className,
}: CustomDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={cn(
          "sm:max-w-[425px] gap-0",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
          className
        )}
      >
        <DialogHeader className="space-y-4 pb-4">
          <DialogTitle className="text-xl font-semibold tracking-tight text-center">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="px-1">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
