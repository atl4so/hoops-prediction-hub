import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { Lock, User, TrendingUp } from "lucide-react";

const Index = () => {
  console.log('Index page rendering'); // Debug log
  const navigate = useNavigate();
  const session = useSession();

  useEffect(() => {
    console.log('Index useEffect, session:', session?.user?.id); // Debug log
    if (session) {
      navigate('/predict');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-6 md:space-y-8 relative overflow-hidden px-4 sm:px-6 animate-fade-in py-8 md:py-12">
      <div className="text-center space-y-4 md:space-y-6 max-w-3xl mx-auto z-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-relaxed mb-2 md:mb-4 font-display text-foreground">
          euroleague.bet
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
          Join the ultimate Euroleague basketball prediction community. Test your knowledge, compete with friends, and climb the leaderboard!
        </p>
        
        {!session && (
          <div className="flex flex-col gap-4 md:gap-6 items-center justify-center mt-6 md:mt-8 px-4">
            {/* New Predict Button with Animation */}
            <Button
              onClick={() => navigate("/predict")}
              size="lg"
              className="w-full sm:w-auto group relative overflow-hidden px-6 py-6 sm:px-8 bg-gradient-to-r from-primary via-primary/90 to-primary hover:from-primary/90 hover:to-primary transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl animate-bounce-slow"
            >
              <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors duration-300" />
              <span className="relative flex items-center justify-center gap-2 text-base sm:text-lg font-semibold tracking-wide whitespace-nowrap">
                <TrendingUp className="w-5 h-5" />
                Make Your Predictions Now!
              </span>
            </Button>

            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 sm:gap-4 mt-2 sm:mt-4">
              <Button
                onClick={() => navigate("/login")}
                variant="default"
                size="lg"
                className="w-full sm:w-auto min-w-[120px] bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 font-medium tracking-wide shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
              <Button
                onClick={() => navigate("/register")}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto min-w-[120px] border-2 border-primary/20 hover:border-primary/30 hover:bg-primary/5 font-medium tracking-wide shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Lock className="w-4 h-4 mr-2" />
                Register
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="w-full max-w-3xl px-4 py-8 md:py-12 text-center">
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-foreground">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8">
          <div className="card space-y-2 p-4 md:p-6 rounded-2xl bg-card hover:shadow-xl transition-all duration-200 border border-primary/10 hover:border-primary/20">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg">
              <span className="text-lg md:text-xl font-bold text-white">1</span>
            </div>
            <h3 className="font-semibold text-foreground text-sm md:text-base">Make Predictions</h3>
            <p className="text-xs md:text-sm text-muted-foreground">Predict scores for upcoming Euroleague games</p>
          </div>
          
          <div className="card space-y-2 p-4 md:p-6 rounded-2xl bg-card hover:shadow-xl transition-all duration-200 border border-primary/10 hover:border-primary/20">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg">
              <span className="text-lg md:text-xl font-bold text-white">2</span>
            </div>
            <h3 className="font-semibold text-foreground text-sm md:text-base">Earn Points</h3>
            <p className="text-xs md:text-sm text-muted-foreground">Get points based on prediction accuracy</p>
          </div>
          
          <div className="card space-y-2 p-4 md:p-6 rounded-2xl bg-card hover:shadow-xl transition-all duration-200 border border-primary/10 hover:border-primary/20">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg">
              <span className="text-lg md:text-xl font-bold text-white">3</span>
            </div>
            <h3 className="font-semibold text-foreground text-sm md:text-base">Compete & Win</h3>
            <p className="text-xs md:text-sm text-muted-foreground">Rise through the rankings and compete with friends</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;