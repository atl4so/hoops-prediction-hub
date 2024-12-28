import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { GamesList } from "@/components/games/GamesList";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Users, CheckSquare } from "lucide-react";
import { Card } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | undefined>();
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const isMobile = useIsMobile();
  const titleText = "euroleague.bet";

  // Fetch statistics
  const { data: stats } = useQuery({
    queryKey: ['websiteStats'],
    queryFn: async () => {
      const [{ count: usersCount }, { count: predictionsCount }] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('predictions').select('*', { count: 'exact', head: true })
          .not('points_earned', 'is', null)
      ]);
      return { usersCount, predictionsCount };
    },
  });

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      setUserId(session?.user?.id);
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
                className="inline-block text-primary animate-[scale-in_0.3s_ease-out] font-display tracking-tight"
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

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto opacity-0 animate-[fade-in_0.5s_ease-out_1.5s_forwards]">
          Join the ultimate Euroleague basketball prediction community. Test your knowledge, compete with friends, and climb the leaderboard!
        </p>
        
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 opacity-0 animate-[fade-in_0.5s_ease-out_2s_forwards]">
          <Card className="p-6 text-center bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <Users className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h3 className="text-2xl font-bold">{stats?.usersCount || '...'}</h3>
            <p className="text-sm text-muted-foreground">Active Users</p>
          </Card>
          
          <Card className="p-6 text-center bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CheckSquare className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h3 className="text-2xl font-bold">{stats?.predictionsCount || '...'}</h3>
            <p className="text-sm text-muted-foreground">Predictions Made</p>
          </Card>
          
          <Card className="p-6 text-center bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <Trophy className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h3 className="text-2xl font-bold">50</h3>
            <p className="text-sm text-muted-foreground">Max Points Per Game</p>
          </Card>
        </div>
      </div>

      <div className="w-full max-w-7xl px-4 mt-8">
        <h2 className="text-2xl font-bold mb-6">Upcoming Games</h2>
        <GamesList isAuthenticated={isAuthenticated} userId={userId} />
      </div>

      <div className="w-full max-w-3xl px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold">1</span>
            </div>
            <h3 className="font-semibold">Make Predictions</h3>
            <p className="text-sm text-muted-foreground">Predict scores for upcoming Euroleague games</p>
          </div>
          
          <div className="space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold">2</span>
            </div>
            <h3 className="font-semibold">Earn Points</h3>
            <p className="text-sm text-muted-foreground">Get points based on prediction accuracy</p>
          </div>
          
          <div className="space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold">3</span>
            </div>
            <h3 className="font-semibold">Compete & Win</h3>
            <p className="text-sm text-muted-foreground">Rise through the rankings and compete with friends</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;