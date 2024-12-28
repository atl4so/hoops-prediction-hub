import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { GamesList } from "@/components/games/GamesList";

export default function Predictions() {
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
        <h1 className="text-4xl font-bold tracking-tight">Make Predictions</h1>
        <p className="text-muted-foreground">
          Predict the outcomes of upcoming Euroleague games
        </p>
      </section>

      <GamesList />
    </div>
  );
}