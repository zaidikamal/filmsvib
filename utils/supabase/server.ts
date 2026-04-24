import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
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
