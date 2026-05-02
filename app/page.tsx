import { getTrendingMovies, getNowPlayingMovies } from "@/lib/tmdb"
import MovieCard from "@/components/MovieCard"
import CinematicHero from "@/components/CinematicHero"
import Link from "next/link"

export default async function Home() {
  const trendingData = await getTrendingMovies()
  const nowPlayingData = await getNowPlayingMovies()

  const trendingMovies = trendingData?.results || []
  const nowPlayingMovies = nowPlayingData?.results || []

  return (
    <main className="min-h-screen pb-32">
      
      {/* ── HERO ── */}
      <CinematicHero movie={trendingMovies?.[0]} />

      {/* ── CONTENT ── */}
      <div className="container mx-auto px-6 lg:px-12 mt-20">
        
        {/* HEADER */}
        <div className="flex flex-col gap-2 mb-16">
          <span className="text-indigo-500 font-bold text-xs uppercase tracking-[6px]">Premium Selection</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">أحدث الإضافات <span className="purple-text-glow">الملكية</span></h2>
        </div>

        {/* RESPONSIVE GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {nowPlayingMovies?.slice(0, 10).map((movie: any) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-24 flex justify-center relative">
          <div className="absolute inset-0 bg-[#d4af37]/5 blur-3xl rounded-full scale-150 z-0"></div>
          <Link href="/exploration" className="btn-royal-gold px-16 py-5 rounded-full text-sm font-bold tracking-widest uppercase relative z-10 flex items-center gap-3">
            استكشاف الأرشيف الكامل
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
        </div>

      </div>

    </main>
  )
}
