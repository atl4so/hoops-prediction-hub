import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
    <div className="min-h-screen flex flex-col items-center justify-start w-full max-w-[100vw] overflow-hidden">
      <div className="w-full px-4 sm:px-6 flex flex-col items-center justify-center min-h-[80vh] max-w-3xl mx-auto">
        <div className="text-center space-y-6 md:space-y-8 w-full">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-relaxed font-display text-foreground">
            euroleague.bet
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            Join the ultimate Euroleague basketball prediction community. Test your knowledge, compete with friends, and climb the leaderboard!
          </p>
          
          {!session && (
            <div className="flex flex-col gap-4 items-center justify-center mt-6 w-full max-w-sm mx-auto px-4">
              <Button
                onClick={() => navigate("/predict")}
                size="lg"
                className="w-full h-auto px-4 py-4 sm:py-6 bg-gradient-to-r from-[#0EA5E9] via-[#2563EB] to-[#4F46E5] hover:from-[#0284C7] hover:to-[#4338CA] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl animate-bounce-slow group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors duration-300" />
                <span className="relative text-base sm:text-lg font-bold tracking-wide whitespace-normal px-2 flex items-center justify-center gap-2">
                  <img 
                    src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+PHJlY3Qgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiIGZpbGw9Im5vbmUiLz48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2Utd2lkdGg9IjMyIiBkPSJNNDQ4IDI1NmMwLTEwNi04Ni0xOTItMTkyLTE5MlM2NCAxNTAgNjQgMjU2czg2IDE5MiAxOTIgMTkyczE5Mi04NiAxOTItMTkyWiIvPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMzIiIGQ9Ik0zNjggMTkyTDI1Ni4xMyAzMjBsLTQ3Ljk1LTQ4bS0xNi4yMyA0OEwxNDQgMjcybTE2MS43MS04MGwtNTEuNTUgNTkiLz48L3N2Zz4=" 
                    alt="Target" 
                    className="w-6 h-6 inline-block filter invert"
                  />
                  Start Your Prediction Journey
                  <img 
                    src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ4IDQ4Ij48cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIGZpbGw9Im5vbmUiLz48ZyBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iNCI+PHBhdGggZD0iTTE4IDhIMTFDMTAuNDQ3NyA4IDEwIDguNDQ3NzIgMTAgOVY0M0MxMCA0My41NTIzIDEwLjQ0NzcgNDQgMTEgNDRIMzlDMzkuNTUyMyA0NCA0MCA0My41NTIzIDQwIDQzVjlDNDAgOC40NDc3MiAzOS41NTIzIDggMzkgOEgzMiIvPjxwYXRoIGZpbGw9IiMyZjg4ZmYiIGQ9Ik0xOCAxM1Y4SDIxLjk1MDVDMjEuOTc3OCA4IDIyIDcuOTc3ODQgMjIgNy45NTA1VjZDMjIgNC4zNDMxNSAyMy4zNDMxIDMgMjUgM0MyNi42NTY5IDMgMjggNC4zNDMxNSAyOCA2VjcuOTUwNUMyOCA3Ljk3Nzg0IDI4LjAyMjIgOCAyOC4wNDk1IDhIMzJWMTNDMzIgMTMuNTUyMyAzMS41NTIzIDE0IDMxIDE0SDE5QzE4LjQ0NzcgMTQgMTggMTMuNTUyMyAxOCAxM1oiLz48L2c+PC9zdmc+" 
                    alt="Clipboard" 
                    className="w-8 h-8 inline-block filter invert"
                  />
                </span>
              </Button>

              <div className="flex flex-col w-full gap-3 mt-4">
                <Button
                  onClick={() => navigate("/login")}
                  variant="default"
                  size="lg"
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 font-medium tracking-wide shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate("/register")}
                  variant="outline"
                  size="lg"
                  className="w-full border-2 border-primary/20 hover:border-primary/30 hover:bg-primary/5 font-medium tracking-wide shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Register
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="w-full max-w-3xl mt-16 px-4 text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-8 text-foreground">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="card space-y-3 p-6 rounded-2xl bg-card hover:shadow-xl transition-all duration-200 border border-primary/10 hover:border-primary/20">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-xl font-bold text-white">1</span>
              </div>
              <h3 className="font-semibold text-foreground">Make Predictions</h3>
              <p className="text-sm text-muted-foreground">Predict scores for upcoming Euroleague games</p>
            </div>
            
            <div className="card space-y-3 p-6 rounded-2xl bg-card hover:shadow-xl transition-all duration-200 border border-primary/10 hover:border-primary/20">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-xl font-bold text-white">2</span>
              </div>
              <h3 className="font-semibold text-foreground">Earn Points</h3>
              <p className="text-sm text-muted-foreground">Get points based on prediction accuracy</p>
            </div>
            
            <div className="card space-y-3 p-6 rounded-2xl bg-card hover:shadow-xl transition-all duration-200 border border-primary/10 hover:border-primary/20">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-xl font-bold text-white">3</span>
              </div>
              <h3 className="font-semibold text-foreground">Compete & Win</h3>
              <p className="text-sm text-muted-foreground">Rise through the rankings and compete with friends</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;