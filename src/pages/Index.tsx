import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

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
    <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-8 animate-fade-in relative overflow-hidden">
      <div className="text-center space-y-6 max-w-3xl mx-auto px-4 z-10">
        <h1 className="inline-block text-4xl md:text-6xl font-bold tracking-tight leading-relaxed mb-4">
          <div className="py-4">
            {titleText.split('').map((char, index) => (
              <span
                key={index}
                className={`
                  inline-block
                  ${isAnimationComplete ? 'bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent' : ''}
                  animate-[scale-in_0.3s_ease-out]
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