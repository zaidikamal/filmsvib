import { getTrendingMovies, getNowPlayingMovies } from "@/lib/tmdb"
import MovieCard from "@/components/MovieCard"
import CinematicHero from "@/components/CinematicHero"

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
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">أحدث الإضافات <span className="purple-glow-text">الملكية</span></h2>
        </div>

        {/* RESPONSIVE GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {nowPlayingMovies?.slice(0, 10).map((movie: any) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-24 flex justify-center">
          <button className="royal-button px-16 py-5 rounded-full text-sm font-bold tracking-widest uppercase">
            استكشاف الأرشيف الكامل
          </button>
        </div>

      </div>

    </main>
  )
}
