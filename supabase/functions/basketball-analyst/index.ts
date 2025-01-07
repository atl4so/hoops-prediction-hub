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

    // Create a comprehensive prompt that includes database context
    const prompt = `You are an expert basketball data analyst and sports journalist specializing in Euroleague basketball. 
    You have access to the following database tables and their relationships:
    
    ${context.schema}
    
    Current data summary:
    ${context.summary}
    
    Based on this data, please ${query}
    
    Provide your analysis in a clear, professional manner. Include specific numbers and statistics when relevant.
    If you're making predictions or identifying patterns, explain your reasoning.`;

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