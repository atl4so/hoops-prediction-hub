import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";

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
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-relaxed mb-4 font-display text-foreground">
          euroleague.bet
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Join the ultimate Euroleague basketball prediction community. Test your knowledge, compete with friends, and climb the leaderboard!
        </p>
      </div>

      <div className="w-full max-w-3xl px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-6 text-foreground">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {['Make Predictions', 'Earn Points', 'Compete & Win'].map((title, index) => (
            <div 
              key={title} 
              className="space-y-2 p-6 rounded-2xl bg-gradient-to-br from-orange-100/90 to-orange-200/70 dark:from-green-800/30 dark:to-green-900/20 border border-white/20 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <div className="w-12 h-12 bg-[#F97316] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-xl font-bold text-white">{index + 1}</span>
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">
                {index === 0 && "Predict scores for upcoming Euroleague games"}
                {index === 1 && "Get points based on prediction accuracy"}
                {index === 2 && "Rise through the rankings and compete with friends"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;