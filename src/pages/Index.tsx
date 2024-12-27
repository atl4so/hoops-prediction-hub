import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Trophy } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-8 animate-fade-in relative overflow-hidden">
      {/* Basketball Animation Container */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated Basketball */}
        <div 
          className="absolute w-16 h-16 md:w-24 md:h-24"
          style={{
            left: isMobile ? '60%' : '70%',
            top: '10%'
          }}
        >
          <div className="basketball-container animate-basketball">
            <div className="basketball">
              <div className="lines"></div>
            </div>
            <div className="shadow"></div>
          </div>
        </div>
        
        {/* Basketball Net */}
        <div className="absolute right-8 md:right-16 top-[30%]">
          <div className="basketball-net">
            <div className="hoop"></div>
            <div className="net"></div>
          </div>
        </div>
      </div>

      <div className="text-center space-y-6 max-w-3xl mx-auto px-4 z-10">
        <div className="flex items-center justify-center mb-8">
          <Trophy className="h-12 w-12 md:h-16 md:w-16 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight 
          bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 
          bg-clip-text text-transparent animate-title-gradient">
          euroleague.bet
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-[600px] mx-auto 
          text-balance leading-relaxed">
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