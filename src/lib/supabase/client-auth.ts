import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Client-side Supabase client for authentication
 * This client should be used in React components for user authentication
 * 
 * Returns null if environment variables are not configured (graceful degradation)
 */
let supabaseAuthInstance: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabaseAuthInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
} else {
  if (typeof window !== 'undefined') {
    console.warn(
      'Supabase auth is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
    );
  }
}

export const supabaseAuth = supabaseAuthInstance;

