import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const clearSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          navigate("/predict");
        }
      } catch (error) {
        console.error('Session check error:', error);
      }
    };

    clearSession();
  }, [navigate]);

  const handleCreateAccount = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8 sm:px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-relaxed pb-2 font-display">
            euroleague.bet
          </h1>
        </div>

        <Card className="w-full shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Create an account to start predicting
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button 
              className="w-full bg-[#F97316] hover:bg-[#F97316]/90" 
              onClick={handleCreateAccount}
            >
              Create account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;