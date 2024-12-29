import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trophy, Users, Target } from "lucide-react";
import { normalizeEmail } from "@/utils/validation";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Clear invalid session on component mount
  useEffect(() => {
    const clearSession = async () => {
      try {
        localStorage.clear();
        sessionStorage.clear();
        try {
          await supabase.auth.signOut({ scope: 'global' });
        } catch (signOutError) {
          console.log("Sign out error (expected if no session):", signOutError);
        }
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await supabase.auth.signOut();
        }
      } catch (error) {
        console.error('Session cleanup error:', error);
      }
    };

    clearSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: normalizeEmail(formData.email),
        password: formData.password,
      });

      if (signInError) {
        let errorMessage = "Invalid email or password. Please check your credentials and try again.";
        
        if (signInError.message.includes("Email not confirmed")) {
          errorMessage = "Please confirm your email address before logging in.";
        }
        
        setError(errorMessage);
        return;
      }

      if (data.user) {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[80vh] items-center justify-center px-4 py-8 bg-gradient-to-b from-background to-background/95">
      <div className="w-full max-w-4xl mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent animate-gradient">
          euroleague.bet
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join the ultimate Euroleague basketball prediction community. Test your knowledge, compete with friends, and climb the leaderboard!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-8 w-full max-w-6xl px-4 mb-8">
        <div className="flex flex-col items-center p-6 space-y-2 text-center">
          <Trophy className="h-8 w-8 mb-2 text-primary" />
          <h3 className="font-semibold">Earn Points</h3>
          <p className="text-sm text-muted-foreground">Make predictions and earn points based on accuracy</p>
        </div>

        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials or create a new account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => {
                    setError(null);
                    setFormData({ ...formData, email: e.target.value });
                  }}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => {
                    setError(null);
                    setFormData({ ...formData, password: e.target.value });
                  }}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <Button variant="link" className="p-0" onClick={() => navigate("/register")}>
                Register here
              </Button>
            </div>
          </CardFooter>
        </Card>

        <div className="flex flex-col items-center p-6 space-y-2 text-center">
          <Users className="h-8 w-8 mb-2 text-primary" />
          <h3 className="font-semibold">Follow Friends</h3>
          <p className="text-sm text-muted-foreground">Connect with other predictors and see their picks</p>
        </div>
      </div>
    </div>
  );
};

export default Login;