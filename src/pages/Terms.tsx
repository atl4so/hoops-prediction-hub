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
      // First, delete the auth user using the Edge Function
      const { error: deleteAuthError } = await supabase.functions.invoke('delete-user', {
        body: { user_id: session.user.id }
      });

      if (deleteAuthError) {
        console.error('Error deleting auth user:', deleteAuthError);
        throw deleteAuthError;
      }

      // Then delete all user data using the database function
      const { error: dbError } = await supabase.rpc('delete_user', {
        user_id: session.user.id
      });

      if (dbError) {
        console.error('Error deleting user data:', dbError);
        throw dbError;
      }

      toast.success("Your account has been deleted successfully");
      navigate("/");
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error("Failed to delete account. Please try again.");
      
      // If deletion partially succeeded, sign out anyway
      if (error.message?.includes('auth user')) {
        await supabase.auth.signOut();
        navigate("/");
      }
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