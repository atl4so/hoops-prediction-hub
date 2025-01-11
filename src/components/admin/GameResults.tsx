import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";

export function GameResults() {
  const session = useSession();
  const navigate = useNavigate();

  // Check if user is admin
  if (!session?.user?.email || session.user.email !== 'likasvy@gmail.com') {
    navigate('/login');
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Game Results</h2>
      <p className="text-muted-foreground">
        Game results functionality is being rebuilt. Please check back soon.
      </p>
    </div>
  );
}