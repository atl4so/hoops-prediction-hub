import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { AppHeader } from "@/components/layout/AppHeader";

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
      <AppHeader />
      <div className="w-full px-4 sm:px-6 flex flex-col items-center justify-center min-h-[80vh] max-w-3xl mx-auto">
        <div className="text-center space-y-6 md:space-y-8 w-full">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-relaxed font-display text-foreground flex items-center justify-center gap-2">
            <img 
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMTI4IDEyOCI+PHJlY3Qgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiIGZpbGw9Im5vbmUiLz48ZyBmaWxsPSIjNzhhM2FkIj48cGF0aCBkPSJNODYuMjYgNzguNWMuODEuMTcgMS4zMS43Ni43OSAyLjA5Yy0uMTkuNS0uNTEgMS4wNS0uNTggMS41OGMuMzQtLjA1LjQ5LS4yNS43MS0uNDljLjMxLS4zMy42Ny0uNjEuOTgtLjk0Yy42OC0uNyAxLjQ0LTEuNiAxLjgyLTIuNWMuMTQtLjMyLjIzLS42NC40LS45NWMuMjUtLjQ0LjYxLS45LjQ0LTEuNDRjLS4yMi0uNy0xLjM1LS41My0yLS41M3MtMS4zOC0uMS0yIC4xM2MtLjc3LjI4LTEuNTguNzItMi4yOSAxLjE2Yy0uNTguMzgtMS4zNS42NC0xLjc4IDEuMjJjLS4xNi4yMy0uMTUuNDQtLjA1LjY5Yy4xLjI0LjA1LjQ3LjEuNzVjLjMzLjAyLjY0LS4zNi45NS0uNDdjLjc1LS4yOCAxLjc2LS40NiAyLjUxLS4zIi8+PHBhdGggZD0iTTk3LjI4IDY3LjM0YTEuNiAxLjYgMCAwIDAtMi4yNC4yNWMtLjM5LjQ5LTYuMDIgNy43My0xMS4yOSAyMC4zN2MtLjktMS45OS0xLjg4LTMuOTQtMi45My01Ljg4YzQtNS4wOSA2Ljc1LTcuODEgNi44My03Ljg4Yy42My0uNjEuNjUtMS42Mi4wMy0yLjI2Yy0uNjEtLjY0LTEuNjItLjY1LTIuMjUtLjA0Yy0uMDcuMDctMi42MSAyLjU4LTYuMzEgNy4yYy0uODgtMS40OC0xLjgyLTIuOTYtMi44My00LjQ2Yy0uNDItLjYyLTEuMjctLjc5LTEuODktLjM2Yy0uNjMuNDItLjc5IDEuMjctLjM3IDEuODlhODggODggMCAwIDEgMy4yOCA1LjI2YTE0NiAxNDYgMCAwIDAtOC43NiAxMi44M2MtMi44NC01LjQtNS40OS05LjQzLTcuNTQtMTIuMjFjMS40MS0xLjY2IDIuMjctMi41MSAyLjMxLTIuNTRjLjYzLS42MS42NC0xLjYyLjAzLTIuMjZjLS42MS0uNjMtMS42My0uNjQtMi4yNi0uMDNjLS4xMS4xMi0uODguODgtMi4wNyAyLjI0Yy0xLjEyLTEuMzUtMS44NC0yLjExLTEuOTUtMi4yMmMtLjYyLS42Mi0xLjYzLS42My0yLjI1LS4wMXMtLjYzIDEuNjMtLjAxIDIuMjZjLjAzLjAzLjgyLjg1IDIuMTIgMi40OWMtMS45NCAyLjQ0LTQuNDMgNS44MS03LjE1IDEwLjJjLTMuMjktNi4yMi02LjI5LTEwLjkxLTguMzctMTMuOWMuNDUtLjcuODctMS40IDEuMzUtMi4xMWMuNDItLjYyLjI1LTEuNDctLjM3LTEuODlzLTEuNDctLjI2LTEuODkuMzZjLS4yOC40Mi0uNTMuODQtLjggMS4yNWMtLjY0LS44Ni0xLjA2LTEuMzktMS4xNi0xLjVjLS41Ny0uNjgtMS41Ny0uNzgtMi4yNC0uMjJhMS41OSAxLjU5IDAgMCAwLS4yMyAyLjI0Yy4wMy4wNC42OS44NyAxLjc3IDIuMzhjLTEuOCAyLjk3LTMuMzQgNS45My00Ljc0IDguOTljLTUuMjMtMTIuNTMtMTAuODItMTkuNy0xMS4yMS0yMC4xOWExLjU5IDEuNTkgMCAwIDAtMi4yNC0uMjVjLS42OS41NS0uOCAxLjU1LS4yNSAyLjI0Yy4xNi4yIDE1Ljg0IDIwLjI2IDE5LjE2IDUyLjU3Yy4wNC40NC4yNi44LjU3IDEuMDZjMS4wMSAxLjQ0IDMuMzYgMi40NSA2LjIxIDMuMTVjLjIyLjExLjQ1LjE5LjcxLjE5Yy4wMSAwIC4wNC0uMDEuMDYtLjAxYzIuODMuNjIgNi4wNy45NiA5IDEuMWMuMTUuMDQuMjkuMDcuNDQuMDdjLjA5IDAgLjE3LS4wMy4yNi0uMDRhNjcgNjcgMCAwIDAgNS40Mi0uMDFjLjA5LjAyLjE3LjA0LjI3LjA0Yy4xNCAwIC4yOS0uMDIuNDMtLjA2Yy4wMSAwIC4wMi0uMDIuMDQtLjAyYzIuODktLjE1IDYuMDctLjQ4IDguODctMS4wOWMuMDEgMCAuMDMuMDEuMDUuMDFjLjI2IDAgLjQ5LS4wOC43Mi0uMTljMi44Ni0uNyA1LjItMS43MSA2LjIxLTMuMTVjLjMyLS4yNi41NC0uNjIuNTgtMS4wNmMzLjMzLTMyLjMxIDE5LTUyLjM3IDE5LjE3LTUyLjU3Yy41MS0uNjcuNC0xLjY4LS4yOS0yLjIzTTc5LjAxIDg0LjQ1YzEuMjMgMi4zMSAyLjMzIDQuNjYgMy4zMyA3LjA4Yy0xLjE2IDMuMDctMi4yNyA2LjQzLTMuMjcgMTAuMDNjLTEuMzQgMi41Ni0yLjU5IDUuMTctMy43OCA3LjgxYy0xLjY2LTQuNC0zLjM2LTguMjktNS4wNC0xMS43NGMzLjA5LTUuMjIgNi4xMi05LjY1IDguNzYtMTMuMThtLTE2LjM1IDQwLjA2Yy0uNy0yLjQ1LTEuNDQtNC44LTIuMi03LjA5YTE1MSAxNTEgMCAwIDEgNy44NC0xNi40YzEuNzMgMy42OSAzLjQ2IDcuODkgNS4xMiAxMi42Yy0xLjM3IDMuMy0yLjY0IDYuNjUtMy43OCAxMC4wMmMtMS44OC40LTQuMjMuNzEtNi45OC44N20tMy43NS0zOS44N2MyLjExIDIuOTUgNC44MyA3LjIyIDcuNyAxMi45Yy0yLjYyIDQuNTctNS4yNSA5LjY5LTcuNzIgMTUuMzVjLTIuMzgtNi41Ni00LjkzLTEyLjM4LTcuNC0xNy4zNGMyLjgtNC42NSA1LjM4LTguMyA3LjQyLTEwLjkxbS0xMS42IDM5LjAyYy0xLjE3LTQuMS0yLjUyLTguMTQtNC4wMS0xMi4xNWMyLjA3LTQuNzMgNC4xOC04LjkyIDYuMjMtMTIuNThjMi41NiA1LjMgNS4xNiAxMS40NiA3LjU0IDE4LjQxYy0uOTIgMi4zMi0xLjgxIDQuNzEtMi42NSA3LjE5Yy0yLjgxLS4xNy01LjE5LS40OC03LjExLS44N20tNy43Ni00Mi4zN2MyLjE1IDMuMjIgNS4wOSA3Ljk5IDguMjYgMTQuMTVjLTIgMy40NC00LjA3IDcuMzgtNi4xMyAxMS44NGMtMS45LTQuNzQtNC4wMy05LjQ1LTYuNDUtMTQuMmMtLjA0LS4wNy0uMS0uMTItLjE1LS4xOWMtLjE5LS41Mi0uMzgtMS4wNC0uNTYtMS41NWE4MiA4MiAwIDAgMSA1LjAzLTEwLjA1bTIuMTIgNDAuMjJjLS4xNy0xLjU5LS4zOS0zLjEzLS42LTQuNjZjLjE0LS4zNC4yNy0uNjYuNDEtLjk5Yy43OSAyLjI2IDEuNTEgNC41MyAyLjE5IDYuODJjLTEuMTEtLjQxLTEuODEtLjgzLTItMS4xN20xNi4wOCAzLjEyYy4zLS44My41OS0xLjY2Ljg4LTIuNDdjLjI1LjgxLjQ5IDEuNjQuNzMgMi40N2MtLjMgMC0uNi4wMS0uOTEuMDFjLS4yMyAwLS40Ni0uMDEtLjctLjAxbTE1LjY0LTIuMDFjLjUxLTEuNDQgMS4wNC0yLjg4IDEuNTktNC4zMWMuMTYuNS4zMi45OC40OCAxLjQ5Yy0uMDcuNTctLjE1IDEuMTEtLjIxIDEuNjljLS4xOC4zNC0uODEuNzMtMS44NiAxLjEzIi8+PC9nPjxwYXRoIGZpbGw9IiNmNzkzMjkiIGQ9Ik01OC40NiA0NC44Yy0yMi44NSAwLTQxLjM3IDguNDgtNDEuMzcgMTguOTVjMCAxMC40NiAxOC41MyAxOC45NSA0MS4zNyAxOC45NWMyMi44NiAwIDQxLjM3LTguNDkgNDEuMzctMTguOTVjMC0xMC40Ny0xOC41Mi0xOC45NS00MS4zNy0xOC45NW0wIDMwLjI1Yy0xNy41NSAwLTMxLjc5LTUuMzMtMzEuNzktMTEuOXMxNC4yMy0xMS45IDMxLjc5LTExLjlzMzEuNzkgNS4zMyAzMS43OSAxMS45cy0xNC4yMyAxMS45LTMxLjc5IDExLjkiLz48ZGVmcz48ZWxsaXBzZSBpZD0ibm90b1YxQmFza2V0YmFsbDAiIGN4PSI3OS42NiIgY3k9IjM2LjQ1IiByeD0iMzcuMjUiIHJ5PSIzNi4xOCIvPjwvZGVmcz48dXNlIGZpbGw9IiNlZDZjMzAiIGhyZWY9IiNub3RvVjFCYXNrZXRiYWxsMCIvPjxjbGlwUGF0aCBpZD0ibm90b1YxQmFza2V0YmFsbDEiPjx1c2UgaHJlZj0iI25vdG9WMUJhc2tldGJhbGwwIi8+PC9jbGlwUGF0aD48ZyBmaWxsPSIjZjc5MzI5IiBjbGlwLXBhdGg9InVybCgjbm90b1YxQmFza2V0YmFsbDEpIj48cGF0aCBkPSJNNzEuODkgNzQuNjRTNTAuMTYgNTEuMzMgNTguNyAxNy42MmMzLjU1LTE0IDE0Ljk5LTE4LjEgMTQuOTktMTguMWg3Ljg5cy0xNS42NSAyLjk5LTE4LjkgMjAuMzdjLTUuOTcgMzEuODYgMjAuOTMgNTUuNjQgMjAuOTMgNTUuNjR6Ii8+PHBhdGggZD0iTTU1LjEgNy40MnMtLjc5IDYuMTkgNy40NiA2LjE5YzE3LjM0IDAgMjcuMDItMTEuMjggNDAuOS03LjczbC03LjIzLTMuNjJzLTQuMTYtLjc5LTcuNzguMzdzLTE2LjQxIDcuNzYtMjQuNDMgNy44OWMtOC41NC4xMy01LjEyLTUuODItNS4xMi01LjgyeiIvPjxwYXRoIGQ9Ik00MS4xMyA0Ny42OXMzLjIxLTE5LjI2IDE3LjkyLTIwLjg0YzEyLjM5LTEuMzMgMjEuMTcgNC41IDI5LjU5IDEwLjU5YzE1LjE3IDEwLjk4IDIyLjMxIDI0LjkzIDIyLjMxIDI0LjkzbC01LjIgNy43NnMtMy45OS0xMi41MS0yMS41NC0yOC44NmMtNi42MS02LjE1LTE1LjcyLTEwLjk5LTI1LjE1LTEwLjA4Yy0xNC44MyAxLjQ0LTEyLjg1IDI2LjUtMTIuODUgMjYuNXoiLz48cGF0aCBkPSJNMzkuODIgMjUuOHM1LjYtNy4zNSAyMC44LTguNjdjMzUuNTEtMy4wNiA1OS45OCAyMi4xOCA1OS45OCAyMi4xOGwxLjkgMTIuMDJTOTQuNiAxOC4zOCA2MC4zNSAyMS4wMUM0My44IDIyLjI4IDM5LjgxIDMyLjQyIDM5LjgxIDMyLjQyVjI1Ljh6Ii8+PC9nPjxlbGxpcHNlIGN4PSI3OS42NiIgY3k9IjM2LjQ1IiBmaWxsPSJub25lIiByeD0iMzcuMjUiIHJ5PSIzNi4xOCIvPjwvc3ZnPg==" 
              alt="Basketball icon"
              className="w-12 h-12 inline-block"
            />
            Euroleague.bet
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            Track your Euroleague basketball predictions, analyze game insights, and see how others are predicting. Join our thriving community to test your knowledge, compete with friends, and climb the leaderboard!
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
                    src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+PHJlY3Qgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiIGZpbGw9Im5vbmUiLz48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2Utd2lkdGg9IjMyIiBkPSJNNDQ4IDI1NmMwLTEwNi04Ni0xOTItMTkyLTE5MlM2NCAxNTAgNjQgMjU2czg2IDE5MiAxOTIgMTkyczE5Mi04NiAxOTItMTkyWiIvPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMzIiIGQ9Ik0zNjggMTkyTDI1Ni4xMyAzMjBsLTQ3Ljk1LTQ4bS0xNi4yMyA0OEwxNDQgMjcybTE2MS43MS04MGwtNTEuNTUgNTkiLz48L3N2Zz4=" 
                    alt="Target" 
                    className="w-6 h-6 inline-block filter invert"
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
              <h3 className="font-semibold text-foreground">Track & Analyze</h3>
              <p className="text-sm text-muted-foreground">Get insights and track your prediction accuracy</p>
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