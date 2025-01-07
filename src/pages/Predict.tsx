import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { GamesList } from "@/components/games/GamesList";
import { PageHeader } from "@/components/shared/PageHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

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
      <PageHeader title="Predict Euroleague Games">
        <p className="text-muted-foreground">Make your predictions for upcoming Euroleague basketball games</p>
      </PageHeader>

      <Alert variant="destructive" className="border-red-500">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="font-medium">
          Important: Predictions must be submitted at least 1 hour before the game starts. Late predictions will not be accepted.
        </AlertDescription>
      </Alert>

      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/teams" className="text-primary hover:underline">
              View All Teams
            </Link>
            <Link to="/rules" className="text-primary hover:underline">
              Prediction Rules
            </Link>
            {session && (
              <>
                <Link to="/my-predictions" className="text-primary hover:underline">
                  My Predictions
                </Link>
                <Link to="/following" className="text-primary hover:underline">
                  Following Feed
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Available Games</h2>
        <GamesList userId={userId} isAuthenticated={!!session} />
      </section>
    </div>
  );
}