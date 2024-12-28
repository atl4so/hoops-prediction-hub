import { useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { FollowingSection } from "@/components/dashboard/FollowingSection";

export default function Following() {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate('/login');
    }
  }, [session, navigate]);

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