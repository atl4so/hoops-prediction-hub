import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { fetchDatabaseContext } from "./useAnalystData";
import { DatabaseContext } from "./types";

export function BasketballAnalyst() {
  const [query, setQuery] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleAnalyze = async () => {
    if (!query.trim()) {
      toast.error("Please enter a query");
      return;
    }

    setIsLoading(true);
    try {
      const context = await fetchDatabaseContext();
      const { data, error } = await supabase.functions.invoke('basketball-analyst', {
        body: { query, context }
      });

      if (error) throw error;
      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Error analyzing:', error);
      toast.error("Failed to analyze. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const exampleQueries = [
    "analyze upcoming games and their prediction patterns",
    "compare prediction accuracy between home and away games",
    "identify trends in completed games from the last round",
    "analyze the most successful predictors' strategies",
    "show prediction distribution for next week's games"
  ];

  return (
    <div className="space-y-6 p-4">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Ask your basketball analyst:</label>
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                if (!query && !isTyping) {
                  setIsTyping(true);
                }
              }}
              onBlur={() => setIsTyping(false)}
              placeholder="Ask about games, predictions, trends, or request specific analysis..."
              className="min-h-[100px]"
            />
          </div>
          <Button 
            onClick={handleAnalyze} 
            disabled={isLoading || !query.trim()}
            className="w-full sm:w-auto"
          >
            <Send className="w-4 h-4 mr-2" />
            Analyze
          </Button>
        </div>

        {!isTyping && !query && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">Example queries:</p>
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((q, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className="text-xs whitespace-normal h-auto text-left"
                  onClick={() => setQuery(q)}
                >
                  {q}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {analysis && (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
          <h3 className="font-semibold mb-2">Analysis:</h3>
          <div className="whitespace-pre-wrap">{analysis}</div>
        </div>
      )}
    </div>
  );
}