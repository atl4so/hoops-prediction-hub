import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '');
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const { query, context } = await req.json();

    console.log('Received query:', query);
    console.log('Context:', context);

    const prompt = `You are an expert basketball data analyst specializing in Euroleague basketball statistics and user predictions. 
    You have access to the following database structure:
    
    Key Tables and Relationships:
    1. games
       - Contains all games (upcoming and completed)
       - Fields: id, game_date, home_team_id, away_team_id, round_id
       - Links to: teams (home and away), rounds
    
    2. game_results
       - Only exists for completed games
       - Fields: id, game_id, home_score, away_score, is_final
       - A game without a result in this table is upcoming
    
    3. predictions
       - User predictions for games
       - Fields: id, user_id, game_id, prediction_home_score, prediction_away_score, points_earned
       - points_earned is only set after game is completed
    
    4. profiles
       - User profiles and statistics
       - Fields: id, display_name, total_points, points_per_game, total_predictions
    
    Current Statistics Summary:
    ${context.summary}
    
    Based on this data structure, please ${query}
    
    Important Analysis Rules:
    1. To identify upcoming games: Look for games WITHOUT entries in game_results table
    2. To identify completed games: Look for games WITH entries in game_results where is_final = true
    3. For predictions analysis:
       - Upcoming games: Look at prediction counts and trends
       - Completed games: Analyze points_earned and accuracy
    4. When discussing users, only reference actual data from the profiles table
    5. For game statistics, verify if a game is completed by checking game_results
    
    Provide your analysis in a clear, professional manner. Include specific numbers and statistics when relevant.
    Always verify game status (upcoming vs completed) before making statements about results.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('AI Response:', text);

    return new Response(
      JSON.stringify({ analysis: text }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error in basketball-analyst function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});