import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRegistrationValidation } from "@/hooks/useRegistrationValidation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="displayName">Display Name</Label>
        <Input
          id="displayName"
          placeholder="Enter your display name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          minLength={3}
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          disabled={isLoading}
        />
      </div>
      <Button type="submit" disabled={isLoading || isValidating} className="w-full">
        {isLoading ? "Registering..." : "Register"}
      </Button>
    </form>
  );
};