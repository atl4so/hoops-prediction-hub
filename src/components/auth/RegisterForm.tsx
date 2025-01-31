import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRegistrationValidation } from "@/hooks/useRegistrationValidation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Lock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { validateDisplayName, validateEmail, isValidating } = useRegistrationValidation();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading || isValidating) return;

    try {
      setIsLoading(true);

      // Validate display name and email first
      const [isDisplayNameValid, isEmailValid] = await Promise.all([
        validateDisplayName(displayName),
        validateEmail(email),
      ]);

      if (!isDisplayNameValid) {
        toast({
          title: "Error",
          description: "Display name is already taken or invalid",
          variant: "destructive",
        });
        return;
      }

      if (!isEmailValid) {
        toast({
          title: "Error",
          description: "Email is already registered or invalid",
          variant: "destructive",
        });
        return;
      }

      // Register the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error("No user data returned after registration");
      }

      // Create profile with lowercase display name
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: authData.user.id,
          email: email.toLowerCase(),
          display_name: displayName,
          display_name_lower: displayName.toLowerCase(),
        },
      ]);

      if (profileError) {
        // If profile creation fails, sign out the user
        await supabase.auth.signOut();
        
        if (profileError.code === "23505") {
          toast({
            title: "Error",
            description: "This display name is already taken. Please choose another one.",
            variant: "destructive",
          });
        } else {
          throw profileError;
        }
        return;
      }

      toast({
        title: "Success",
        description: "Registration successful! Please verify your email.",
      });

      navigate("/");
    } catch (error: any) {
      console.error("Registration error:", error);
      
      toast({
        title: "Error",
        description: error.message || "Failed to register. Please try again.",
        variant: "destructive",
      });

      // Clean up if needed
      await supabase.auth.signOut();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Register</CardTitle>
          <CardDescription className="text-center">
            Create an account to start predicting
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="displayName"
                  placeholder="Enter your display name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  minLength={3}
                  disabled={isLoading}
                  className="pl-10"
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={isLoading}
                  className="pl-10"
                />
              </div>
            </div>
            <Button type="submit" disabled={isLoading || isValidating} className="w-full">
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </CardContent>
        </form>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/login")}>
              Sign in
            </Button>
          </div>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};