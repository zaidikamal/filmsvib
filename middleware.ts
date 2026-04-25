import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  // This will refresh session if expired - essential for Server Components to work
  const { data: { user } } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // 1. Basic Protected Routes (Auth required)
  const isProtectedRoute = 
    path.startsWith("/watchlist") || 
    path.startsWith("/profile") || 
    path.startsWith("/admin") || 
    path.startsWith("/news/create");

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  // NOTE: We used to do a Role Check database query here.
  // Database queries in Middleware can cause "MIDDLEWARE_INVOCATION_FAILED" on Vercel Edge 
  // due to connection overhead/timeouts. 
  // SECURITY: The Role Check is now handled in the Layout/Page level (Server Components) 
  // which is much more stable and performant. 
  // Middleware now only handles the initial Auth redirect.

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (svg, png, etc)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
