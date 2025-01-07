import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function BasketballAnalyst() {
  const [query, setQuery] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const fetchDatabaseContext = async () => {
    // Get database statistics
    const [
      { count: gamesCount },
      { count: predictionsCount },
      { count: resultsCount },
      { count: roundsCount }
    ] = await Promise.all([
      supabase.from('games').select('*', { count: 'exact', head: true }),
      supabase.from('predictions').select('*', { count: 'exact', head: true }),
      supabase.from('game_results').select('*', { count: 'exact', head: true }),
      supabase.from('rounds').select('*', { count: 'exact', head: true })
    ]);

    // Get upcoming games
    const { data: upcomingGames } = await supabase
      .from('games')
      .select(`
        id,
        game_date,
        home_team:teams!games_home_team_id_fkey (name),
        away_team:teams!games_away_team_id_fkey (name)
      `)
      .not('game_results', 'is', null)
      .order('game_date', { ascending: true })
      .limit(5);

    // Get recent completed games with results and prediction stats
    const { data: recentResults } = await supabase
      .from('game_results')
      .select(`
        home_score,
        away_score,
        game:games (
          home_team:teams!games_home_team_id_fkey (name),
          away_team:teams!games_away_team_id_fkey (name)
        ),
        predictions:predictions (
          points_earned
        )
      `)
      .eq('is_final', true)
      .order('created_at', { ascending: false })
      .limit(5);

    // Get top predictors
    const { data: topPredictors } = await supabase
      .from('profiles')
      .select('display_name, total_points, points_per_game')
      .order('total_points', { ascending: false })
      .limit(5);

    return {
      schema: `
        Database Overview:
        - ${gamesCount} total games
        - ${resultsCount} completed games with results
        - ${gamesCount - resultsCount} upcoming games
        - ${predictionsCount} total predictions
        - ${roundsCount} rounds
      `,
      summary: `
        Upcoming Games:
        ${upcomingGames?.map(g => 
          `${g.home_team.name} vs ${g.away_team.name} (${new Date(g.game_date).toLocaleDateString()})`
        ).join('\n')}

        Recent Completed Games:
        ${recentResults?.map(r => {
          const predictionCount = r.predictions?.length || 0;
          const avgPoints = r.predictions?.reduce((sum, p) => sum + (p.points_earned || 0), 0) / predictionCount || 0;
          return `${r.game.home_team.name} ${r.home_score} - ${r.away_score} ${r.game.away_team.name} (${predictionCount} predictions, avg ${avgPoints.toFixed(1)} points)`;
        }).join('\n')}

        Top Predictors:
        ${topPredictors?.map(p => 
          `${p.display_name}: ${p.total_points} points (${p.points_per_game.toFixed(1)} PPG)`
        ).join('\n')}
      `
    };
  };

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