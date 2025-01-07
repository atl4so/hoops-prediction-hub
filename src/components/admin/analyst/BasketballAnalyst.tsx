import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

export function BasketballAnalyst() {
  const [query, setQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const getDatabaseContext = async () => {
    // Get relevant database statistics
    const [gamesCount, predictionsCount, usersCount, roundsCount] = await Promise.all([
      supabase.from('games').select('*', { count: 'exact', head: true }),
      supabase.from('predictions').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('rounds').select('*', { count: 'exact', head: true })
    ]);

    // Get recent game results
    const { data: recentResults } = await supabase
      .from('game_results')
      .select(`
        game:games (
          game_date,
          home_team:teams!games_home_team_id_fkey (name),
          away_team:teams!games_away_team_id_fkey (name)
        ),
        home_score,
        away_score
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    return {
      schema: `
        - Games table tracks matches with home and away teams
        - Predictions table stores predictions for games
        - Game results table stores final scores
        - Rounds table organizes games into competition rounds
        - Teams table stores team information
      `,
      summary: `
        Database statistics:
        - ${gamesCount.count} total games
        - ${predictionsCount.count} predictions made
        - ${usersCount.count} registered users
        - ${roundsCount.count} competition rounds
        
        Recent game results:
        ${recentResults?.map(r => 
          `${r.game.home_team.name} ${r.home_score} - ${r.away_score} ${r.game.away_team.name}`
        ).join('\n')}
      `
    };
  };

  const analyzeData = useMutation({
    mutationFn: async (query: string) => {
      const context = await getDatabaseContext();
      
      const response = await supabase.functions.invoke('basketball-analyst', {
        body: { query, context }
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: (data) => {
      setResponse(data.analysis);
    },
    onError: (error) => {
      console.error('Analysis error:', error);
      toast.error("Failed to analyze data. Please try again.");
    }
  });

  const [response, setResponse] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    analyzeData.mutate(query);
  };

  const exampleQueries = [
    "analyze scoring patterns in recent games",
    "identify trends in home team vs away team performance",
    "analyze the most common winning margins",
    "generate insights about high-scoring vs low-scoring games",
    "analyze which game factors correlate with close matches"
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Ask your basketball analyst:</label>
            <Textarea
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsTyping(true);
              }}
              onBlur={() => setIsTyping(false)}
              placeholder="Ask about game patterns, statistics, or request specific analysis..."
              className="min-h-[100px]"
            />
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={analyzeData.isPending || !query.trim()}
              className="flex items-center gap-2"
            >
              {analyzeData.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Analyze
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>

      {!isTyping && !response && (
        <Card className="p-6">
          <h3 className="text-sm font-medium mb-3">Example queries:</h3>
          <div className="space-y-2">
            {exampleQueries.map((example, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start text-left whitespace-normal h-auto py-3 px-4 text-sm leading-tight"
                onClick={() => setQuery(example)}
              >
                {example}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {response && (
        <Card className="p-6">
          <h3 className="text-sm font-medium mb-3">Analysis:</h3>
          <div className="prose prose-sm max-w-none">
            {response.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}