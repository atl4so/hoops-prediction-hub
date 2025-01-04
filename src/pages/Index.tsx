import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-4xl font-bold mb-6 font-display">
        euroleague.bet
      </h1>
      <p className="text-xl mb-8 max-w-2xl">
        Join euroleague.bet for expert Euroleague basketball predictions, compete with friends, and climb the leaderboard.
      </p>
      <div className="space-x-4">
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
  );
};

export default Index;