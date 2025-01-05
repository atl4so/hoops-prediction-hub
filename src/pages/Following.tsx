import { useEffect, useState } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { FollowingSection } from "@/components/dashboard/FollowingSection";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search } from "lucide-react";

export default function Following() {
  const [searchQuery, setSearchQuery] = useState("");
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
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-10 space-y-8 sm:space-y-10 animate-fade-in">
      <section className="text-center space-y-4 sm:space-y-5">
        <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-foreground">
          Following
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto">
          Keep track of users you follow and compare your predictions
        </p>
      </section>

      <div className="relative max-w-sm mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search users by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 w-full bg-background/50 backdrop-blur-sm"
        />
      </div>

      <FollowingSection searchQuery={searchQuery} />
    </div>
  );
}