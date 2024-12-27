import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { RegisterForm } from "@/components/auth/RegisterForm";

const Index = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Basketball Predictions</h1>
        <p className="text-muted-foreground max-w-[600px] mx-auto text-balance">
          Welcome to the ultimate basketball prediction platform. Compete with others,
          make predictions, and climb the leaderboard!
        </p>
      </section>

      <RegisterForm />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover-scale">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              View the top predictors and compete for the highest score.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;