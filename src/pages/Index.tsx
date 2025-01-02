import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { Lock, User } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const session = useSession();
  const titleText = "euroleague.bet";

  // Redirect authenticated users to predictions page
  useEffect(() => {
    if (session) {
      navigate('/predict');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-8 animate-fade-in relative overflow-hidden px-4 sm:px-6 -mt-12">
      <div className="text-center space-y-6 max-w-3xl mx-auto z-10">
        <h1 className="inline-block text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-relaxed mb-4 font-display">
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

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto opacity-0 animate-[fade-in_0.5s_ease-out_1.5s_forwards]">
          Join the ultimate Euroleague basketball prediction community. Test your knowledge, compete with friends, and climb the leaderboard!
        </p>
        
        {!session && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 opacity-0 animate-[fade-in_0.5s_ease-out_2.5s_forwards]">
            <Button
              onClick={() => navigate("/login")}
              variant="default"
              size="lg"
              className="min-w-[120px] bg-primary hover:bg-primary/90 font-medium tracking-wide"
            >
              <User className="w-4 h-4 mr-2" />
              Login
            </Button>
            <Button
              onClick={() => navigate("/register")}
              variant="outline"
              size="lg"
              className="min-w-[120px] border-primary/20 hover:bg-primary/10 font-medium tracking-wide"
            >
              <Lock className="w-4 h-4 mr-2" />
              Register
            </Button>
          </div>
        )}
      </div>

      <div className="w-full max-w-3xl px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-6">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
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