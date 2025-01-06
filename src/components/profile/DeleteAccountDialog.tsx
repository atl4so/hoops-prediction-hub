import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
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

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: any;
}

export function DeleteAccountDialog({ open, onOpenChange, profile }: DeleteAccountDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    if (!profile?.id) {
      toast.error('Profile not found');
      return;
    }

    setIsDeleting(true);

    try {
      const serviceClient = createClient(
        'https://nuswsfxmaqyzfmpmbuky.supabase.co',
        process.env.SUPABASE_SERVICE_KEY || ''
      );

      if (profile.avatar_url) {
        const urlPath = new URL(profile.avatar_url).pathname;
        const filePath = urlPath.split('/public/avatars/')[1];
        if (filePath) {
          await serviceClient.storage.from('avatars').remove([filePath]);
        }
      }

      await serviceClient
        .from('predictions')
        .delete()
        .eq('user_id', profile.id);

      await serviceClient
        .from('profiles')
        .delete()
        .eq('id', profile.id);

      await serviceClient.auth.admin.deleteUser(profile.id);

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
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
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
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Account'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}