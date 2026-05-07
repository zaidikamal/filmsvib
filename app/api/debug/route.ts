import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseKey: !!(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
    hasTmdbKey: !!process.env.TMDB_API_KEY,
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    supabaseUrlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) || "MISSING",
    nodeVersion: process.version,
  })
}
