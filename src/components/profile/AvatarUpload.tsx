import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  onAvatarChange: (file: File | null) => void;
  isUploading: boolean;
  displayName?: string;
}

export function AvatarUpload({
  currentAvatarUrl,
  onAvatarChange,
  isUploading,
  displayName,
}: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset input value to allow re-uploading the same file
    event.target.value = '';

    // Only validate file size
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    onAvatarChange(file);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={currentAvatarUrl} />
          <AvatarFallback>
            {displayName?.slice(0, 2).toUpperCase() || "??"}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-2">
          <Label htmlFor="avatar" className="text-sm font-medium">
            Profile Picture
          </Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
            {currentAvatarUrl && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onAvatarChange(null)}
                disabled={isUploading}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            )}
          </div>
          <input
            ref={fileInputRef}
            id="avatar"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <p className="text-xs text-muted-foreground">
            Recommended: Square image, max 5MB
          </p>
        </div>
      </div>
    </div>
  );
}