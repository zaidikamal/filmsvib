import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // During build time, env vars might be missing. 
  // We provide placeholders to prevent the build from failing, 
  // but we also avoid calling cookies() which triggers dynamic rendering errors.
  if (!supabaseUrl || !supabaseKey) {
    return createServerClient(
      "https://placeholder.supabase.co", 
      "placeholder-key",
      {
        cookies: {
          getAll() { return [] },
          setAll() { },
        },
      }
    )
  }

  const cookieStore = await cookies()

  return createServerClient(
    supabaseUrl, 
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch (error) {
            // Silence storage errors in SSR
          }
        },
      },
    }
  )
}
