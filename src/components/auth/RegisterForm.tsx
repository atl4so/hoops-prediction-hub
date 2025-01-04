import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Mail, Lock, User } from "lucide-react";
import { normalizeEmail } from "@/utils/validation";

export function RegisterForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    displayName: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // First, check if display name is taken
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("id")
        .eq("display_name", formData.displayName.trim())
        .single();

      if (existingUser) {
        setError("This display name is already taken");
        setIsLoading(false);
        return;
      }

      // Proceed with registration
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: normalizeEmail(formData.email),
        password: formData.password,
        options: {
          data: {
            display_name: formData.displayName.trim(),
          },
        },
      });

      if (signUpError) {
        console.error("Registration error:", signUpError);
        setError(signUpError.message);
        return;
      }

      if (signUpData?.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: signUpData.user.id,
            email: normalizeEmail(formData.email),
            display_name: formData.displayName.trim(),
          });

        if (profileError) {
          console.error("Profile creation error:", profileError);
          setError("Failed to create user profile. Please try again.");
          return;
        }

        toast.success("Account created successfully!", {
          description: "Please check your email to confirm your account.",
        });
        
        navigate("/login");
      }
    } catch (error: any) {
      console.error("Unexpected error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
            <CardDescription className="text-center">
              Enter your details to register
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
                <Label htmlFor="displayName">Display Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Choose a display name"
                    value={formData.displayName}
                    onChange={(e) => {
                      setError(null);
                      setFormData({ ...formData, displayName: e.target.value });
                    }}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
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
                    className="pl-10"
                    required
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
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => {
                      setError(null);
                      setFormData({ ...formData, password: e.target.value });
                    }}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-[#F97316] hover:bg-[#F97316]/90" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Register"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Button 
                variant="link" 
                className="p-0 text-[#F97316] hover:text-[#F97316]/90"
                onClick={() => navigate("/login")}
              >
                Sign in here
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}