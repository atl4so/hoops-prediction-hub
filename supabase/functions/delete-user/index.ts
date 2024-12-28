import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the user ID from the request
    const { user_id } = await req.json()
    
    if (!user_id) {
      throw new Error('User ID is required')
    }

    console.log('Starting user deletion process for:', user_id)

    // Initialize Supabase admin client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // First, delete all user data using database function
    console.log('Deleting user data...')
    const { error: dbError } = await supabaseAdmin.rpc('delete_user', {
      user_id: user_id
    })

    if (dbError) {
      console.error('Error deleting user data:', dbError)
      throw dbError
    }

    // Then, delete the auth user using admin API
    console.log('Deleting auth user...')
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
      user_id
    )

    if (authError) {
      console.error('Error deleting auth user:', authError)
      throw authError
    }

    console.log('User deletion completed successfully')

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in delete-user function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})