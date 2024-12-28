import { useSession } from "@supabase/auth-helpers-react";
import { GamesList } from "@/components/games/GamesList";
import { Navigate } from "react-router-dom";

const Predictions = () => {
  const session = useSession();
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Make Predictions</h1>
      </div>
      
      <GamesList 
        isAuthenticated={!!session} 
        userId={session.user.id} 
      />
    </div>
  );
};

export default Predictions;