import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { validateEmail, normalizeEmail } from "@/utils/validation";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function RegisterForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    displayName: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [displayNameError, setDisplayNameError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEmailChange = async (email: string) => {
    setFormData(prev => ({ ...prev, email }));
    const validationError = validateEmail(email);
    if (validationError) {
      setEmailError(validationError);
      return;
    }
    setEmailError(null);
  };

  const checkDisplayNameAvailability = async (displayName: string) => {
    if (!displayName) {
      setDisplayNameError("Display name is required");
      return false;
    }
    if (displayName.length < 3) {
      setDisplayNameError("Display name must be at least 3 characters long");
      return false;
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('display_name', displayName)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking display name:', error);
      return false;
    }

    if (data) {
      setDisplayNameError("This display name is already taken");
      return false;
    }

    setDisplayNameError(null);
    return true;
  };

  const handleDisplayNameChange = async (displayName: string) => {
    setFormData(prev => ({ ...prev, displayName }));
    await checkDisplayNameAvailability(displayName);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailError || displayNameError || isLoading) return;

    // Validate display name before proceeding
    const isDisplayNameValid = await checkDisplayNameAvailability(formData.displayName);
    if (!isDisplayNameValid) return;

    setIsLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: normalizeEmail(formData.email),
        password: formData.password,
        options: {
          data: {
            display_name: formData.displayName,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: normalizeEmail(formData.email),
            display_name: formData.displayName,
          });

        if (profileError) throw profileError;

        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: normalizeEmail(formData.email),
          password: formData.password,
        });

        if (signInError) throw signInError;

        toast({
          title: "Registration successful!",
          description: "You have been automatically signed in.",
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Enter your details to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Display Name"
                value={formData.displayName}
                onChange={(e) => handleDisplayNameChange(e.target.value)}
                disabled={isLoading}
                className={displayNameError ? "border-red-500" : ""}
                required
              />
              {displayNameError && (
                <p className="text-sm text-red-500">{displayNameError}</p>
              )}
            </div>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleEmailChange(e.target.value)}
                className={emailError ? "border-red-500" : ""}
                disabled={isLoading}
                required
              />
              {emailError && (
                <p className="text-sm text-red-500">{emailError}</p>
              )}
            </div>
            <Input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              disabled={isLoading}
              minLength={6}
              required
            />
            <Button 
              type="submit" 
              className="w-full" 
              disabled={!!emailError || !!displayNameError || isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
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