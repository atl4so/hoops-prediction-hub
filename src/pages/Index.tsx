import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Trophy } from "lucide-react";

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
    <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-8 animate-fade-in">
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <Trophy className="h-16 w-16 text-primary animate-bounce" />
        </div>
        <h1 className="text-6xl font-bold tracking-tight animate-pulse bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent transition-all duration-500">
          euroleague.bet
        </h1>
        <p className="text-xl text-muted-foreground max-w-[600px] mx-auto text-balance leading-relaxed">
          Welcome to the ultimate basketball prediction platform. Join our community,
          make predictions, and compete with others to become the top predictor!
        </p>
        {!isAuthenticated && (
          <div className="flex gap-4 justify-center mt-8">
            <Button
              onClick={() => navigate("/login")}
              variant="default"
              size="lg"
              className="min-w-[120px] bg-primary hover:bg-primary/90"
            >
              Login
            </Button>
            <Button
              onClick={() => navigate("/register")}
              variant="outline"
              size="lg"
              className="min-w-[120px] border-primary/20 hover:bg-primary/10"
            >
              Register
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;