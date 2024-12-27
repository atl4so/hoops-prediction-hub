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
        <div className="basketball absolute w-16 h-16 md:w-24 md:h-24 rounded-full bg-orange-500 
          animate-basketball-bounce border-4 border-orange-600 
          shadow-lg transform -translate-x-1/2"
          style={{
            left: '70%',
            top: isMobile ? '15%' : '20%'
          }}
        >
          {/* Basketball lines */}
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="w-full h-2 bg-orange-700 rotate-45"></div>
            <div className="w-full h-2 bg-orange-700 -rotate-45"></div>
          </div>
        </div>
        
        {/* Hoop Animation */}
        <div className="absolute right-4 md:right-8 top-1/3 transform -translate-y-1/2">
          <div className="w-20 md:w-32 h-16 md:h-24 border-t-8 border-red-500 
            rounded-tr-full rounded-tl-full rotate-[-15deg] animate-hoop-sway">
            <div className="w-2 h-12 md:h-16 bg-red-500 absolute left-0"></div>
            <div className="w-2 h-12 md:h-16 bg-red-500 absolute right-0"></div>
          </div>
        </div>
      </div>

      <div className="text-center space-y-6 max-w-3xl mx-auto px-4 z-10">
        <div className="flex items-center justify-center mb-8">
          <Trophy className="h-12 w-12 md:h-16 md:w-16 text-primary animate-bounce" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight animate-pulse 
          bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 
          bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent 
          transition-all duration-500">
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