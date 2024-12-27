import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

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
    </div>
  );
};

export default Index;