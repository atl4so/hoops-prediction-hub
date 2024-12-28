import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";

export default function Terms() {
  const [isDeleting, setIsDeleting] = useState(false);
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    if (!session?.user) return;
    
    setIsDeleting(true);
    try {
      // Delete user predictions
      const { error: predictionsError } = await supabase
        .from('predictions')
        .delete()
        .eq('user_id', session.user.id);

      if (predictionsError) {
        console.error('Error deleting predictions:', predictionsError);
        throw predictionsError;
      }

      // Delete user follows
      const { error: followsError } = await supabase
        .from('user_follows')
        .delete()
        .or(`follower_id.eq.${session.user.id},following_id.eq.${session.user.id}`);

      if (followsError) {
        console.error('Error deleting follows:', followsError);
        throw followsError;
      }

      // Delete user permissions
      const { error: permissionsError } = await supabase
        .from('user_permissions')
        .delete()
        .eq('user_id', session.user.id);

      if (permissionsError) {
        console.error('Error deleting permissions:', permissionsError);
        throw permissionsError;
      }

      // Delete user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', session.user.id);

      if (profileError) {
        console.error('Error deleting profile:', profileError);
        throw profileError;
      }

      // Delete the auth user
      const { error: deleteError } = await supabase.auth.admin.deleteUser(
        session.user.id
      );

      if (deleteError) {
        // If we can't delete the user, at least sign them out
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) {
          console.error('Error signing out:', signOutError);
          throw signOutError;
        }
      }

      toast.success("Your account has been deleted successfully");
      navigate("/");
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error("Failed to delete account. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto space-y-8 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Terms & Conditions</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Disclaimer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            euroleague.bet is a free prediction game website and is not associated with gambling 
            or betting of any kind. No money is involved in any aspect of the website's operation.
          </p>
          <p>
            This website is not affiliated with, endorsed by, or connected to EuroLeague Basketball 
            or any of its associated entities. All team names, logos, and related marks are 
            trademarks of their respective owners.
          </p>
          <p>
            By using this website, you acknowledge and agree that:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>This is not a gambling website and no real money is involved</li>
            <li>We are not affiliated with EuroLeague Basketball</li>
            <li>Team logos and names are property of their respective owners</li>
            <li>We provide this service for entertainment purposes only</li>
            <li>You are responsible for keeping your account credentials secure</li>
            <li>We may update these terms at any time without notice</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You have the right to delete your account and all associated data at any time.
              This action cannot be undone.
            </p>
            
            {session && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete Account</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your
                      account and remove all of your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete Account"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}