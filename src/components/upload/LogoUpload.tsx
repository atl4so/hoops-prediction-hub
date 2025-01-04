import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface LogoUploadProps {
  currentLogoUrl?: string;
  onLogoChange: (url: string | null) => void;
  isUploading?: boolean;
}

export function LogoUpload({
  currentLogoUrl,
  onLogoChange,
  isUploading: externalIsUploading,
}: LogoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      // Delete existing logo if it exists
      if (currentLogoUrl) {
        const oldPath = currentLogoUrl.split('/').pop();
        if (oldPath) {
          await supabase.storage.from('logos').remove([oldPath]);
        }
      }

      // Upload new logo
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('logos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);

      onLogoChange(publicUrl);
      toast.success('Logo uploaded successfully');
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!currentLogoUrl) return;

    setIsUploading(true);
    try {
      const fileName = currentLogoUrl.split('/').pop();
      if (fileName) {
        await supabase.storage.from('logos').remove([fileName]);
      }
      onLogoChange(null);
      toast.success('Logo removed successfully');
    } catch (error) {
      console.error('Error removing logo:', error);
      toast.error('Failed to remove logo');
    } finally {
      setIsUploading(false);
    }
  };

  const isLoading = isUploading || externalIsUploading;

  return (
    <div className="grid gap-2">
      <Label htmlFor="logo">Logo</Label>
      <div className="flex items-center gap-4">
        {currentLogoUrl && (
          <img 
            src={currentLogoUrl} 
            alt="Logo" 
            className="h-16 w-16 object-contain"
          />
        )}
        <input
          ref={fileInputRef}
          type="file"
          id="logo"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload Logo'
            )}
          </Button>
          {currentLogoUrl && (
            <Button
              variant="destructive"
              onClick={handleRemove}
              disabled={isLoading}
            >
              Remove
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}