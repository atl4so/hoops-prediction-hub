import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { GamesList } from "@/components/games/GamesList";
import { PageHeader } from "@/components/shared/PageHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function Predict() {
  const session = useSession();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      setUserId(session.user.id);
    }
  }, [session]);

  return (
    <div className="container max-w-5xl mx-auto py-8 animate-fade-in space-y-6">
      <PageHeader title="Predict">
        <p className="text-muted-foreground">Make your predictions for upcoming games</p>
      </PageHeader>

      <Alert variant="destructive" className="border-red-500">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="font-medium">
          Important: Predictions must be submitted at least 1 hour before the game starts. Late predictions will not be accepted.
        </AlertDescription>
      </Alert>

      <GamesList userId={userId} isAuthenticated={!!session} />
    </div>
  );
}