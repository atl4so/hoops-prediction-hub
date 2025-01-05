import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { CollapsibleRoundSection } from "@/components/dashboard/CollapsibleRoundSection";

export default function MyPredictions() {
  const session = useSession();
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState<any[]>([]);
  const [groupedPredictions, setGroupedPredictions] = useState<{ [key: string]: any[] }>({});

  useEffect(() => {
    const fetchPredictions = async () => {
      if (!session) {
        navigate('/login');
        return;
      }

      try {
        const { data, error } = await supabase
          .from("predictions")
          .select("*")
          .eq("user_id", session.user.id);

        if (error) throw error;

        setPredictions(data);
        groupPredictions(data);
      } catch (error) {
        console.error('Error fetching predictions:', error);
        toast.error("Failed to load predictions. Please try again.");
      }
    };

    fetchPredictions();
  }, [session, navigate]);

  const groupPredictions = (predictions: any[]) => {
    const grouped: { [key: string]: any[] } = {};
    predictions.forEach(prediction => {
      const roundName = prediction.round; // Assuming there's a round field
      if (!grouped[roundName]) {
        grouped[roundName] = [];
      }
      grouped[roundName].push(prediction);
    });
    setGroupedPredictions(grouped);
  };

  if (!predictions || predictions.length === 0) {
    return (
      <div className="container max-w-5xl mx-auto py-8 animate-fade-in">
        <PageHeader title="My Predictions">
          <p className="text-muted-foreground">Track your predictions and their outcomes</p>
        </PageHeader>
        <Card className="p-6">
          <p className="text-muted-foreground">No predictions found</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-8 animate-fade-in">
      <PageHeader title="My Predictions">
        <p className="text-muted-foreground">Track your predictions and their outcomes</p>
      </PageHeader>

      <div className="space-y-6">
        {Object.entries(groupedPredictions).map(([roundName, roundPredictions]) => (
          <CollapsibleRoundSection
            key={roundName}
            roundName={roundName}
            predictions={roundPredictions}
          />
        ))}
      </div>
    </div>
  );
}
