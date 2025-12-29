import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Server-side Supabase client with service role key for admin operations
 * This client bypasses RLS and should only be used in API routes
 * 
 * Returns null if environment variables are not configured
 */
let supabaseInstance: SupabaseClient | null = null;

if (supabaseUrl && supabaseServiceKey) {
  supabaseInstance = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
} else {
  // Only warn in development/build time, not in API routes at runtime
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      'Supabase service client is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.'
    );
  }
}

export const supabase = supabaseInstance;

