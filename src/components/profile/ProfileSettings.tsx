import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AvatarUpload } from "./AvatarUpload";
import { DeleteAccountDialog } from "./DeleteAccountDialog";
import { supabase } from "@/integrations/supabase/client";

interface ProfileSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: any;
}

export function ProfileSettings({ open, onOpenChange, profile }: ProfileSettingsProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleAvatarChange = async (file: File | null) => {
    if (!profile?.id) {
      toast.error('Profile not found');
      return;
    }

    setIsUploading(true);
    try {
      // Handle existing avatar removal
      if (profile.avatar_url) {
        const urlPath = new URL(profile.avatar_url).pathname;
        const filePath = urlPath.split('/avatars/')[1];
        if (filePath) {
          await supabase.storage.from('avatars').remove([filePath]);
        }
      }

      if (!file) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar_url: null })
          .eq('id', profile.id);

        if (updateError) throw updateError;
        
        toast.success('Profile picture removed successfully');
        return;
      }

      const fileExt = file.name.split('.').pop();
      const filePath = `${profile.id}-${Date.now()}.${fileExt}`;
      
      // Upload file with correct content type
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      toast.success('Profile picture updated successfully');
    } catch (error: any) {
      console.error('Error updating avatar:', error);
      toast.error('Failed to update profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Profile Settings</DialogTitle>
            <DialogDescription>
              Manage your profile settings and account preferences
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <AvatarUpload
              currentAvatarUrl={profile?.avatar_url}
              onAvatarChange={handleAvatarChange}
              isUploading={isUploading}
              displayName={profile?.display_name}
            />
            <div className="pt-4">
              <Button 
                variant="destructive" 
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full"
              >
                Delete Account
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DeleteAccountDialog 
        open={showDeleteConfirm} 
        onOpenChange={setShowDeleteConfirm}
        profile={profile}
      />
    </>
  );
}