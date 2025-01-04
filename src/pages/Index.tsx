import { useSession } from "@supabase/auth-helpers-react";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const session = useSession();
  const navigate = useNavigate();

  // If user is logged in, redirect to predict page
  if (session) {
    return <Navigate to="/predict" replace />;
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="text-center space-y-8 max-w-2xl mx-auto px-4">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight pb-4 font-display">
          euroleague.bet
        </h1>
        <p className="text-xl text-muted-foreground">
          Predict Euroleague basketball games and compete with friends
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Button 
            onClick={() => navigate("/register")}
            className="bg-[#F97316] hover:bg-[#F97316]/90"
          >
            Get Started
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate("/login")}
          >
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;