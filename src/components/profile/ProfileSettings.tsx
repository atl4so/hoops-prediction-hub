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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AvatarUpload } from "./AvatarUpload";
import { supabase } from "@/integrations/supabase/client";
import { createClient } from "@supabase/supabase-js";

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
      // Delete existing avatar if it exists and we're either removing or replacing it
      if (profile.avatar_url) {
        const urlPath = new URL(profile.avatar_url).pathname;
        const filePath = urlPath.split('/public/avatars/')[1];
        if (filePath) {
          await supabase.storage.from('avatars').remove([filePath]);
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
    if (!profile?.id) {
      toast.error('Profile not found');
      return;
    }

    setIsDeleting(true);

    try {
      // Use service role client for secure deletion
      const serviceClient = createClient(
        'https://nuswsfxmaqyzfmpmbuky.supabase.co',
        process.env.SUPABASE_SERVICE_KEY || ''
      );

      // Delete avatar from storage if it exists
      if (profile.avatar_url) {
        const urlPath = new URL(profile.avatar_url).pathname;
        const filePath = urlPath.split('/public/avatars/')[1];
        if (filePath) {
          await serviceClient.storage.from('avatars').remove([filePath]);
        }
      }

      // Delete user data in correct order to maintain referential integrity
      await serviceClient
        .from('predictions')
        .delete()
        .eq('user_id', profile.id);

      await serviceClient
        .from('profiles')
        .delete()
        .eq('id', profile.id);

      await serviceClient.auth.admin.deleteUser(profile.id);

      // Clear local storage and redirect
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
                disabled={isDeleting}
                className="w-full"
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
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove all your data from our servers.
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