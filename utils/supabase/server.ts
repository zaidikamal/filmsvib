import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase environment variables are missing! Please check your .env or Vercel settings.");
  }

  return createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        get(name: string) {
          // @ts-expect-error Async cookies next 15+
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            // @ts-expect-error Async cookies next 15+
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Ignore for Client Components
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            // @ts-expect-error Async cookies next 15+
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Ignore for Client Components
          }
        },
      },
    }
  )
}
