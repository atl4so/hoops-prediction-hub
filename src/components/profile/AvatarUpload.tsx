import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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
    const file = event.target.files?.[0] || null;
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size must be less than 5MB');
        return;
      }
      onAvatarChange(file);
    }
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor="avatar">Profile Picture</Label>
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={currentAvatarUrl || undefined} alt={displayName || "Profile"} />
          <AvatarFallback>{displayName?.[0]?.toUpperCase() || "U"}</AvatarFallback>
        </Avatar>
        <input
          ref={fileInputRef}
          type="file"
          id="avatar"
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
            {isUploading ? "Uploading..." : "Change"}
          </Button>
          {currentAvatarUrl && (
            <Button
              variant="destructive"
              onClick={() => onAvatarChange(null)}
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