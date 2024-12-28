import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { GamesList } from "@/components/games/GamesList";

const Index = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const isMobile = useIsMobile();
  const titleText = "euroleague.bet";

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    const timer = setTimeout(() => {
      setIsAnimationComplete(true);
    }, 2000);

    return () => {
      authListener.subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center space-y-8 animate-fade-in relative overflow-hidden">
      <div className="text-center space-y-6 max-w-3xl mx-auto px-4 z-10">
        <h1 className="inline-block text-4xl md:text-6xl font-bold tracking-tight leading-relaxed mb-4 font-display">
          <div className="py-4">
            {titleText.split('').map((char, index) => (
              <span
                key={index}
                className={`
                  inline-block
                  text-primary
                  animate-[scale-in_0.3s_ease-out]
                  font-display
                  tracking-tight
                `}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  display: 'inline-block',
                  lineHeight: '1.4'
                }}
              >
                {char}
              </span>
            ))}
          </div>
        </h1>
        
        {!isAuthenticated && (
          <div className="flex gap-4 justify-center mt-8 opacity-0 animate-[fade-in_0.5s_ease-out_2.5s_forwards]">
            <Button
              onClick={() => navigate("/login")}
              variant="default"
              size="lg"
              className="min-w-[120px] bg-primary hover:bg-primary/90 font-medium tracking-wide"
            >
              Login
            </Button>
            <Button
              onClick={() => navigate("/register")}
              variant="outline"
              size="lg"
              className="min-w-[120px] border-primary/20 hover:bg-primary/10 font-medium tracking-wide"
            >
              Register
            </Button>
          </div>
        )}
      </div>

      <div className="w-full max-w-7xl px-4 mt-8">
        <h2 className="text-2xl font-bold mb-6">Upcoming Games</h2>
        <GamesList isAuthenticated={isAuthenticated} />
      </div>
    </div>
  );
};

export default Index;