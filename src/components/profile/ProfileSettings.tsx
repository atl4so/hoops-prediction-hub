import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AvatarUpload } from "./AvatarUpload";
import { supabase } from "@/integrations/supabase/client";

interface ProfileSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: any;
}

export function ProfileSettings({ open, onOpenChange, profile }: ProfileSettingsProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const handleAvatarChange = async (file: File | null) => {
    if (!profile?.id) return;

    setIsUploading(true);
    try {
      // Delete existing avatar if it exists and we're either removing or replacing it
      if (profile.avatar_url) {
        const oldPath = profile.avatar_url.split('/').pop();
        if (oldPath) {
          await supabase.storage.from('avatars').remove([oldPath]);
        }
      }

      // If file is null, we're just removing the avatar
      if (!file) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar_url: null })
          .eq('id', profile.id);

        if (updateError) throw updateError;
        
        queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        toast.success('Profile picture removed successfully');
        return;
      }

      // Upload new avatar
      const fileExt = file.name.split('.').pop();
      const filePath = `${profile.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast.success('Profile picture updated successfully');
    } catch (error: any) {
      console.error('Error updating avatar:', error);
      toast.error('Failed to update profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!profile?.id) return;

    setIsDeleting(true);
    try {
      console.log('Starting account deletion process...');
      
      // Call the delete-user function
      const { data, error } = await supabase.functions.invoke('delete-user', {
        body: { user_id: profile.id }
      });

      console.log('Delete function response:', { data, error });

      if (error) {
        console.error('Error from delete-user function:', error);
        throw new Error(error.message || 'Failed to delete account');
      }

      if (!data?.success) {
        throw new Error('Failed to delete account');
      }

      toast.success('Your account has been deleted');
      
      // Sign out and redirect
      await supabase.auth.signOut();
      window.location.href = '/login';
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast.error(error.message || 'Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
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
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="mt-4">
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove all your data from our servers, including all your predictions
                  and statistics.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Account'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DialogContent>
    </Dialog>
  );
}