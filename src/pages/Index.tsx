import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Basketball Predictions</h1>
        <p className="text-muted-foreground max-w-[600px] mx-auto text-balance">
          Welcome to the ultimate basketball prediction platform. Compete with others,
          make predictions, and climb the leaderboard!
        </p>
        {!isAuthenticated && (
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate("/login")} variant="default" size="lg">
              Login
            </Button>
            <Button onClick={() => navigate("/register")} variant="outline" size="lg">
              Register
            </Button>
          </div>
        )}
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover-scale">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              View the top predictors and compete for the highest score.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;