import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    // Start shake animation after typing is done
    const typingTimer = setTimeout(() => {
      setIsTypingDone(true);
      setIsShaking(true);
      
      // Remove shake class after animation is done
      setTimeout(() => {
        setIsShaking(false);
      }, 500);
    }, 3500);

    return () => {
      authListener.subscription.unsubscribe();
      clearTimeout(typingTimer);
    };
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-8 animate-fade-in relative overflow-hidden">
      <div className="text-center space-y-6 max-w-3xl mx-auto px-4 z-10">
        <h1 
          className={`
            inline-block text-4xl md:text-6xl font-bold tracking-tight 
            bg-gradient-to-br from-[#ff8036] via-[#ff6b3d] to-[#ff4545] 
            bg-clip-text text-transparent
            ${!isTypingDone ? 'typing-effect' : 'animate-title-gradient'}
            ${isShaking ? 'shake-animation' : ''}
          `}
        >
          euroleague.bet
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-[600px] mx-auto 
          text-balance leading-relaxed opacity-0 animate-[fade-in_0.5s_ease-out_3.5s_forwards]">
          Welcome to the ultimate basketball prediction platform. Join our community,
          make predictions, and compete with others to become the top predictor!
        </p>
        
        {!isAuthenticated && (
          <div className="flex gap-4 justify-center mt-8 opacity-0 animate-[fade-in_0.5s_ease-out_4s_forwards]">
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