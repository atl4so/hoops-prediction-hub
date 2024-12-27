import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { validateUsername, normalizeUsername } from "@/utils/validation";
import { useToast } from "@/components/ui/use-toast";

export function RegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    displayName: "",
  });
  const [isChecking, setIsChecking] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleUsernameChange = async (username: string) => {
    setFormData(prev => ({ ...prev, username }));
    const validationError = validateUsername(username);
    if (validationError) {
      setUsernameError(validationError);
      return;
    }

    setIsChecking(true);
    // TODO: Add API call to check username availability
    // For now, simulating API call
    setTimeout(() => {
      setIsChecking(false);
      setUsernameError(null);
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameError) return;

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
              placeholder="Username"
              value={formData.username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              className={usernameError ? "border-red-500" : ""}
            />
            {usernameError && (
              <p className="text-sm text-red-500">{usernameError}</p>
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
          <Button type="submit" className="w-full" disabled={!!usernameError || isChecking}>
            Register
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}