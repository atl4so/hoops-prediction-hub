import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { supabase, createClient } from "@/integrations/supabase/client";
import { AvatarUpload } from "./AvatarUpload";
import { Loader2 } from "lucide-react";

interface ProfileSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: any;
}

export function ProfileSettings({ open, onOpenChange, profile }: ProfileSettingsProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleAvatarChange = async (file: File | null) => {
    if (!profile?.id) {
      toast.error('Profile not found');
      return;
    }

    setIsUploading(true);

    try {
      // If file is null, we're removing the avatar
      if (!file) {
        // Only attempt to remove if there's an existing avatar
        if (profile.avatar_url) {
          const urlPath = new URL(profile.avatar_url).pathname;
          const filePath = urlPath.split('/public/avatars/')[1];
          if (filePath) {
            try {
              await supabase.storage.from('avatars').remove([filePath]);
            } catch (storageError) {
              console.error('Error deleting avatar:', storageError);
            }
          }

          // Also try to delete any files in the user's folder
          try {
            const { data: files } = await supabase.storage
              .from('avatars')
              .list(`user_${profile.id}`);
            
            if (files?.length) {
              await supabase.storage
                .from('avatars')
                .remove(files.map(f => `user_${profile.id}/${f.name}`));
            }
          } catch (folderError) {
            console.error('Error cleaning up user folder:', folderError);
          }
        }

        // Update profile to remove avatar_url
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar_url: null })
          .eq('id', profile.id);

        if (updateError) throw updateError;

        queryClient.invalidateQueries({ queryKey: ['profile'] });
        toast.success('Avatar removed successfully');
        return;
      }

      // Upload new avatar
      const fileExt = file.name.split('.').pop();
      const filePath = `user_${profile.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicUrl } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (!publicUrl?.publicUrl) throw new Error('Failed to get public URL');

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl.publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Avatar updated successfully');
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast.error('Failed to update avatar');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!profile?.id) {
      toast.error('Profile not found');
      return;
    }

    setIsDeleting(true);

    try {
      // Create a service role client for deletion
      const serviceClient = createClient(
        'https://nuswsfxmaqyzfmpmbuky.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51c3dzZnhtYXF5emZtcG1idWt5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTM0MDMxMiwiZXhwIjoyMDUwOTE2MzEyfQ.h2yMiELXxyVSol0nWTprEk9qMPMnoS9X_ElHyM4z5Ks'
      );

      // Delete avatar from storage if it exists
      if (profile.avatar_url) {
        try {
          const urlPath = new URL(profile.avatar_url).pathname;
          const filePath = urlPath.split('/public/avatars/')[1];
          if (filePath) {
            await serviceClient.storage
              .from('avatars')
              .remove([filePath]);
          }

          // Also try to delete the user's folder
          const { data: files } = await serviceClient.storage
            .from('avatars')
            .list(`user_${profile.id}`);
          
          if (files?.length) {
            await serviceClient.storage
              .from('avatars')
              .remove(files.map(f => `user_${profile.id}/${f.name}`));
          }
        } catch (storageError) {
          console.error('Error deleting avatar storage:', storageError);
        }
      }

      // Delete user data in correct order to maintain referential integrity
      // First, delete predictions as they reference the profile
      await serviceClient
        .from('predictions')
        .delete()
        .eq('user_id', profile.id);

      // Then delete the profile
      await serviceClient
        .from('profiles')
        .delete()
        .eq('id', profile.id);

      // Finally, delete the auth user using the admin API
      const { error: deleteUserError } = await serviceClient.auth.admin.deleteUser(
        profile.id
      );

      if (deleteUserError) {
        console.error('Error deleting auth user:', deleteUserError);
        throw new Error('Failed to delete authentication user');
      }

      // Sign out the user to invalidate their session
      await supabase.auth.signOut();

      // Clear local data and redirect
      queryClient.clear();
      localStorage.clear();
      sessionStorage.clear();
      navigate('/login');
      toast.success('Account deleted successfully');
    } catch (error) {
      console.error('Delete account error:', error);
      toast.error('Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Profile Settings</DialogTitle>
            <DialogDescription>
              Update your profile picture or manage your account
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <AvatarUpload
              currentAvatarUrl={profile?.avatar_url}
              onAvatarChange={handleAvatarChange}
              isUploading={isUploading}
              displayName={profile?.display_name}
            />

            <div className="flex flex-col gap-2 mt-4">
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting Account...
                  </>
                ) : (
                  'Delete Account'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}