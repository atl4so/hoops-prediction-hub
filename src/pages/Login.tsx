import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Mail } from "lucide-react";
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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8 sm:px-6">
      <div className="w-full max-w-md">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Sign In</h1>
            <p className="text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
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
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
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
                  className="pl-10"
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="text-sm text-center text-muted-foreground">
            New to euroleague.bet?{" "}
            <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/register")}>
              Create account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;