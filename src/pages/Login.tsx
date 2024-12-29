import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 px-4 py-8">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent animate-gradient">
          euroleague.bet
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Join the ultimate Euroleague basketball prediction community. Test your knowledge, compete with friends, and climb the leaderboard!
        </p>
      </div>

      {/* Auth Section */}
      <div className="max-w-md mx-auto">
        <Card className="w-full shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">Email</Label>
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
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm">Password</Label>
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
                  className="h-9"
                />
              </div>
              <Button type="submit" className="w-full h-9" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 pt-0">
            <div className="text-sm text-center text-muted-foreground">
              New to euroleague.bet?{" "}
              <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/register")}>
                Create account
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
