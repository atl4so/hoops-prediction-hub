import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogoUpload } from "@/components/upload/LogoUpload";

interface TeamDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  title: string;
  teamName: string;
  logoUrl: string;
  onTeamNameChange: (value: string) => void;
  onLogoUrlChange: (url: string | null) => void;
}

export function TeamDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  title,
  teamName,
  logoUrl,
  onTeamNameChange,
  onLogoUrlChange,
}: TeamDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Team Name"
            value={teamName}
            onChange={(e) => onTeamNameChange(e.target.value)}
          />
          <LogoUpload
            currentLogoUrl={logoUrl}
            onLogoChange={onLogoUrlChange}
          />
          <Button onClick={onSubmit}>{title}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}