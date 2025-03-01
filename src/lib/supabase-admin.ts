import { createClient } from '@supabase/supabase-js';

// Create a safe version of the admin client that works in both environments
// This will only be properly initialized on the server

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Only create the client if both URL and service key are available
// This prevents client-side errors when trying to access server-only env vars

let supabaseAdmin: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseServiceKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
}

export { supabaseAdmin }; 