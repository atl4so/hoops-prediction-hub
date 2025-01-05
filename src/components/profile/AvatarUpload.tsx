import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRef } from "react";

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  onAvatarChange: (file: File | null) => void;
  isUploading: boolean;
  displayName?: string;
}

export function AvatarUpload({ 
  currentAvatarUrl, 
  onAvatarChange, 
  isUploading,
  displayName 
}: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onAvatarChange(file);
    }
  };

  const handleRemove = () => {
    onAvatarChange(null);
  };

  return (
    <div className="space-y-2">
      <Label>Profile Picture</Label>
      <div className="flex items-center gap-4">
        {currentAvatarUrl && (
          <img 
            src={currentAvatarUrl} 
            alt={`${displayName}'s avatar`}
            className="h-16 w-16 rounded-full object-cover"
          />
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload Picture'
            )}
          </Button>
          {currentAvatarUrl && (
            <Button
              variant="destructive"
              onClick={handleRemove}
              disabled={isUploading}
            >
              Remove
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}