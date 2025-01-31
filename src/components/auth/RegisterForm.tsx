import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { normalizeEmail } from "@/utils/validation";
import { useRegistrationValidation } from "@/hooks/useRegistrationValidation";

export function RegisterForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    displayName: "",
  });

  const { validateDisplayName, validateRegistrationEmail } = useRegistrationValidation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // First, try to sign out any existing session
      await supabase.auth.signOut();

      // Run both validations concurrently
      const [displayNameError, emailError] = await Promise.all([
        validateDisplayName(formData.displayName),
        validateRegistrationEmail(formData.email)
      ]);

      // Check for validation errors
      if (displayNameError) {
        setError(displayNameError);
        setIsLoading(false);
        return;
      }

      if (emailError) {
        setError(emailError);
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
        try {
          const normalizedDisplayName = formData.displayName.trim();
          // Create profile with display name and its lowercase version
          const { error: profileError } = await supabase
            .from("profiles")
            .insert({
              id: signUpData.user.id,
              email: normalizeEmail(formData.email),
              display_name: normalizedDisplayName,
              display_name_lower: normalizedDisplayName.toLowerCase(),
            });

          if (profileError) {
            console.error("Profile creation error:", profileError);
            
            // If it's a duplicate display name error
            if (profileError.code === '23505') {
              setError("This display name is already taken. Please choose another one.");
              // Sign out the user since profile creation failed
              await supabase.auth.signOut();
              return;
            }
            
            setError("Failed to create user profile. Please try again.");
            // Sign out the user since profile creation failed
            await supabase.auth.signOut();
            return;
          }

          toast({
            title: "Registration successful!",
            description: "Please check your email to confirm your account.",
          });
          navigate("/");
        } catch (error: any) {
          console.error("Profile creation error:", error);
          // Sign out the user since profile creation failed
          await supabase.auth.signOut();
          setError("An unexpected error occurred. Please try again.");
        }
      }
    } catch (error: any) {
      console.error("Unexpected error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
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
              <Input
                id="displayName"
                type="text"
                placeholder="Choose a display name"
                value={formData.displayName}
                onChange={(e) => {
                  setError(null);
                  setFormData({ ...formData, displayName: e.target.value });
                }}
                required
              />
            </div>
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
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => {
                  setError(null);
                  setFormData({ ...formData, password: e.target.value });
                }}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Register"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Button variant="link" className="p-0" onClick={() => navigate("/login")}>
              Sign in here
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
}