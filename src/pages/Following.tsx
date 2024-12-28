import { useEffect } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { FollowingSection } from "@/components/dashboard/FollowingSection";
import { toast } from "sonner";

export default function Following() {
  const session = useSession();
  const navigate = useNavigate();
  const supabase = useSupabaseClient();

  useEffect(() => {
    const checkSession = async () => {
      if (!session) {
        navigate('/login');
        return;
      }

      try {
        // Verify the session is still valid
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          console.error('Session error:', error);
          await supabase.auth.signOut();
          toast.error("Your session has expired. Please sign in again.");
          navigate('/login');
        }
      } catch (error) {
        console.error('Session check error:', error);
        await supabase.auth.signOut();
        toast.error("Your session has expired. Please sign in again.");
        navigate('/login');
      }
    };

    checkSession();
  }, [session, navigate, supabase.auth]);

  if (!session) return null;

  return (
    <div className="space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Following</h1>
        <p className="text-muted-foreground">
          Keep track of users you follow and their predictions
        </p>
      </section>

      <FollowingSection />
    </div>
  );
}