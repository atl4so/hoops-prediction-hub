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
                  Become The Next Prediction Legend!
                  <img 
                    src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDY0IDY0Ij48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9Im5vbmUiLz48cGF0aCBmaWxsPSIjZDZhNTdjIiBkPSJtMjkuOSAyNS42bC01LjYtMi4zbC0yLjUtNi4xbC0zLjUgMS41bDIuOCA2LjljLjIuNC40LjcuNy45Yy4yLjEuMy4yLjUuMmw2IDIuNWMuOS40IDItLjEgMi40LTEuMWMuNi0xIC4yLTIuMS0uOC0yLjUiLz48ZWxsaXBzZSBjeD0iMTYuNyIgY3k9IjEwLjgiIGZpbGw9IiNmZjg3MzYiIHJ4PSI4LjciIHJ5PSI4LjgiLz48ZyBmaWxsPSIjMjMxZjIwIj48cGF0aCBkPSJNMTAuNSA0LjZjLjIuOC41IDEuNC44IDIuMVMxMiA4IDEyLjQgOC42Yy44IDEuMyAxLjcgMi41IDIuNiAzLjZxMS4zNSAxLjggMyAzLjNjLjUuNSAxLjEgMSAxLjcgMS40czEuMy44IDIgMWMtLjgtLjEtMS41LS40LTIuMi0uN2MtLjctLjQtMS4zLS44LTEuOS0xLjNjLTEuMi0xLTIuMi0yLjEtMy4yLTMuMmMtMS0xLjItMS44LTIuNC0yLjYtMy44Yy0uNC0uNy0uNy0xLjQtMS0yLjFjMC0uNy0uMy0xLjQtLjMtMi4ybS0yLjUgNmMuNSAxLjEgMS4yIDIuMSAyIDNjLjguOCAxLjggMS41IDIuOSAyczIuMi45IDMuMyAxLjNjLjYuMiAxLjEuNSAxLjYuOXMuOCAxIC45IDEuNmMtLjItLjYtLjYtMS0xLjEtMS4zcy0xLS41LTEuNi0uN2MtMS4xLS40LTIuMy0uNy0zLjQtMS4ycy0yLjItMS4yLTMtMi4yYy0uOC0xLjEtMS4zLTIuMy0xLjYtMy40TTIzLjcgMTZjLS43LjMtMS41LjQtMi4zLjFjLS44LS40LTEuMi0xLjEtMS41LTEuOWMtLjYtMS41LS44LTMtMS4xLTQuNXMtLjctMy0xLjMtNC4zcy0xLjctMi41LTMuMi0zLjFjLjguMiAxLjUuNSAyLjEgMXEuOS43NSAxLjUgMS44Yy44IDEuNCAxLjIgMi45IDEuNSA0LjRsLjQgMi4zYy4xLjguMyAxLjUuNSAyLjJzLjYgMS40IDEuMiAxLjhzMS40LjQgMi4yLjIiLz48cGF0aCBkPSJNMjEuNyAzLjZjLjQuMy43LjcuOSAxLjFzLjQuOS42IDEuM2MuMyAxIC41IDIgLjUgM2MuMSAyLS40IDQtMS41IDUuN2MtLjYuOC0xLjMgMS42LTIuMSAyLjFxLTEuMi45LTIuNyAxLjJjLTEuOS41LTMuOC40LTUuNy4xYzEuOS4xIDMuOC0uMSA1LjYtLjZjMS44LS42IDMuNC0xLjYgNC40LTMuMmMxLTEuNSAxLjUtMy40IDEuNS01LjNjMC0uOS0uMS0xLjktLjMtMi44Yy0uMi0xLS41LTEuOS0xLjItMi42Ii8+PC9nPjxwYXRoIGZpbGw9IiMzZTQzNDciIGQ9Im01MCA1OC42bC0uOS00LjJjLjktLjggMS4yLS44IDEuMi0uOGMuNi0uMyAxLjQgMCAxLjcuNmwzLjcgNy42Yy0xLjQuNy00LjItLjMtNS43LTMuMm0tMTMuNC0zLjhsLTEuNC0zLjljLjktLjcgMi41LTEuNSAyLjUtMS41Yy42LS4yIDEuNC4xIDEuNi44bDIuOSA4Yy0xLjQuNS00LjItLjUtNS42LTMuNCIvPjxwYXRoIGZpbGw9IiNkNmE1N2MiIGQ9Im0zNy43IDE2LjVsMS44LjRMMzcuMyAyN0wzNCAyNC41eiIvPjxwYXRoIGZpbGw9IiM0N2I4OTIiIGQ9Ik0zOS4xIDQwLjNIMjUuOXMuMy04IDMuNC0xMy42YzIuNC00LjQgOC43LTMuMSA4LjctMy4xeiIvPjxnIGZpbGw9IiNkNmE1N2MiPjxwYXRoIGQ9Ik01NSAyNy40Yy0yLjEtMS43LTIuNi0yLjEtMy41LTEuMmwtNS43LTMuOGMtLjMtLjItLjctLjMtMS4xLS4zYy0uMiAwLS40LjEtLjUuMWwtNi40IDEuNGMtMSAuMi0xLjYgMS4yLTEuNCAyLjNjLjIgMSAxLjIgMS43IDIuMiAxLjVsNS45LTEuM2w0LjcgMy4xYy0uMS41IDAgMSAuNCAxLjNsLjcuNmMuNC4zLjkuMyAxLjIuMWMxIC43IDIuNSAxLjMgMy44LS41Yy4zLS4yIDEuNS0xLjgtLjMtMy4zIi8+PHBhdGggZD0iTTM3LjUgMjMuNGMtMi45LjEtNC4xIDUuNC01LjQgNS44Yy0yLjEuNi0yLjUtMi4xLS44LTQuM2MyLjEtMi44IDYuMi0xLjUgNi4yLTEuNW0xMS42IDMxbC45IDQuMnMtNS41LTItOC41LTIuM2MtMS0uMS0xLjEtMS4yLTEuNi0xLjRjLTIuNy0xLjUtMy45LTYtMy45LTZsNS42LTEuMnMuMiAxLjcgMSA0LjFjLjEuMy4zLjcgMS4yLjZjMS44LS4xIDMuOCAyLjMgNS4zIDJtLTEyLjUuNGwtMS40LTMuOWMtMS40LjQtMi0uMy0zLjQuNGMtLjYuMy0uOS0uMS0uOC0uM2MuNC0xLjMuNC0yIC40LTJsLTUuOS0uOHMtLjMgNC40IDIuMiA3LjljLjYuOCAyLjkgMSAzLjQuN2MyLjktMS43IDUuNS0yIDUuNS0yIi8+PC9nPjxwYXRoIGZpbGw9IiMzZTQzNDciIGQ9Ik0yNS45IDQwLjNoMTMuMmwzLjUgNy4xbC02LjkgMS41Yy0uNC0uNy0uNy0xLjUtMS0yLjFjLS4yLS40LS42LS44LTEuMS0uOGMtLjYgMC0xIC41LTEuMiAxLjFzLS40IDEuMy0uNiAxLjlsLTYuNi0uOXoiLz48cGF0aCBmaWxsPSIjYjU4MzYwIiBkPSJNMzIuMiAyMS45Yy41IDEuNy0uOSAzLjUtLjkgMy41YzMuNi43IDQuOS0yLjcgNS45LTcuN2MwIDAtNS45IDEuMi01IDQuMiIvPjxwYXRoIGZpbGw9IiNkNmE1N2MiIGQ9Ik0zOS45IDUuNUwyOC41IDcuOGMtMS43IDIuMy0xIDMuOC0xLjIgNC45Yy0uMS41LTEuMiAxLjItMS44IDEuNmMtMS4zLjkuNSAyIDEuMyAxLjljLjMgMS4xLTEuMSAxLjYgMi4yIDEuNGMwIDAtMy41LjktMS4zIDEuOWMtLjQgMS4zLTEgMy43IDYuMSAyLjFjMi4xLS41IDMuNC0zLjkgMy40LTMuOWwzLjUtLjF6Ii8+PHBhdGggZmlsbD0iIzU5NDY0MCIgZD0iTTMyLjMgMy41YzcuNS0xLjQgMTAuOSAyLjkgMTEuMyA0LjdjMS4yIDQuNi0xLjEgOS4zLTUgMTIuNWMwIDAtMS41LS45LTEuNS0yLjljMCAwIDEuNyAxLjEgMy0yLjZjMS4xLTMuMS0yLTUuMi00LjMtMS4xbC0uNC0uMWMtLjYtMi4zIDEuNS00LjgtLjktNmMtMi4xLTEuMS02LjQuMy02LjQuM2MtLjUtMS41IDEuMi00LjIgNC4yLTQuOCIvPjxwYXRoIGZpbGw9IiM2NjRlMjciIGQ9Ik0zMCAxM2MtLjEuNy0uNiAxLjItMSAxLjFjLS41LS4xLS41LS42LS40LTEuM3MuMy0xLjIuOC0xLjFjLjQuMS43LjcuNiAxLjMiLz48cGF0aCBmaWxsPSIjYjU4MzYwIiBkPSJNMzYuNyAxNC45Yy4yLTEuMyAxLjUtMi4zIDIuNi0yLjJjMCAwLTIuMSAxLjMtMiAzLjVjMCAwLS43LS40LS42LTEuMyIvPjxwYXRoIGZpbGw9IiM2NjRlMjciIGQ9Ik0zMC4xIDE3LjVzLTEuNS44LTIgMWMtMSAuMy0xLjIgMC0uNS0uM2MuNS0uMyAxLjQtLjUgMS40LS41eiIvPjwvc3ZnPg==" 
                    alt="Trophy" 
                    className="w-8 h-8 inline-block"
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
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
                <Button
                  onClick={() => navigate("/register")}
                  variant="outline"
                  size="lg"
                  className="w-full border-2 border-primary/20 hover:border-primary/30 hover:bg-primary/5 font-medium tracking-wide shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Lock className="w-4 h-4 mr-2" />
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