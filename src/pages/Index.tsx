import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { Lock, User } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const session = useSession();

  useEffect(() => {
    if (session) {
      navigate('/predict');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-8 relative overflow-hidden px-4 sm:px-6 animate-fade-in">
      <div className="text-center space-y-6 max-w-3xl mx-auto z-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-relaxed mb-4 font-display mt-8">
          <div className="py-4 bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
            euroleague.bet
          </div>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Join the ultimate Euroleague basketball prediction community. Test your knowledge, compete with friends, and climb the leaderboard!
        </p>
        
        {!session && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button
              onClick={() => navigate("/login")}
              variant="default"
              size="lg"
              className="min-w-[120px] bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 dark:from-primary dark:to-primary/80 dark:hover:from-primary/90 dark:hover:to-primary/70 font-medium tracking-wide shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <User className="w-4 h-4 mr-2" />
              Login
            </Button>
            <Button
              onClick={() => navigate("/register")}
              variant="outline"
              size="lg"
              className="min-w-[120px] border-2 border-primary/20 hover:border-primary/30 hover:bg-primary/5 dark:hover:bg-primary/10 font-medium tracking-wide shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Lock className="w-4 h-4 mr-2" />
              Register
            </Button>
          </div>
        )}
      </div>

      <div className="w-full max-w-3xl px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="space-y-2 p-6 rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 border border-primary/10 hover:border-primary/20">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 dark:from-primary dark:to-primary/90 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-xl font-bold text-white dark:text-white">1</span>
            </div>
            <h3 className="font-semibold">Make Predictions</h3>
            <p className="text-sm text-muted-foreground">Predict scores for upcoming Euroleague games</p>
          </div>
          
          <div className="space-y-2 p-6 rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 border border-primary/10 hover:border-primary/20">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 dark:from-primary dark:to-primary/90 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-xl font-bold text-white dark:text-white">2</span>
            </div>
            <h3 className="font-semibold">Earn Points</h3>
            <p className="text-sm text-muted-foreground">Get points based on prediction accuracy</p>
          </div>
          
          <div className="space-y-2 p-6 rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 border border-primary/10 hover:border-primary/20">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 dark:from-primary dark:to-primary/90 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-xl font-bold text-white dark:text-white">3</span>
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