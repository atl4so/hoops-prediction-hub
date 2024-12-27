import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { validateEmail, normalizeEmail } from "@/utils/validation";
import { useToast } from "@/components/ui/use-toast";

export function RegisterForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    displayName: "",
  });
  const [isChecking, setIsChecking] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEmailChange = async (email: string) => {
    setFormData(prev => ({ ...prev, email }));
    const validationError = validateEmail(email);
    if (validationError) {
      setEmailError(validationError);
      return;
    }

    setIsChecking(true);
    // TODO: Add API call to check email availability
    // For now, simulating API call
    setTimeout(() => {
      setIsChecking(false);
      setEmailError(null);
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailError) return;

    try {
      // TODO: Add actual registration API call
      toast({
        title: "Registration successful!",
        description: "Welcome to Basketball Predictions!",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className={emailError ? "border-red-500" : ""}
            />
            {emailError && (
              <p className="text-sm text-red-500">{emailError}</p>
            )}
            {isChecking && (
              <p className="text-sm text-muted-foreground">Checking availability...</p>
            )}
          </div>
          <Input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
          />
          <Input
            placeholder="Display Name"
            value={formData.displayName}
            onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
          />
          <Button type="submit" className="w-full" disabled={!!emailError || isChecking}>
            Register
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}