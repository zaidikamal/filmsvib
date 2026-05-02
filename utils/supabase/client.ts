import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    if (typeof window !== 'undefined') {
      console.warn("Supabase environment variables are missing! Using placeholders.");
    }
  }

  return createBrowserClient(
    supabaseUrl || "https://placeholder.supabase.co", 
    supabaseKey || "placeholder-key"
  );
}
