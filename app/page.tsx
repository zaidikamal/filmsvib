import { getTrendingMovies, getNowPlayingMovies } from "@/lib/tmdb"
import MovieCard from "@/components/MovieCard"
import CinematicHero from "@/components/CinematicHero"

export default async function Home() {
  const trendingMovies = await getTrendingMovies()
  const nowPlayingMovies = await getNowPlayingMovies()

  return (
    <main className="min-h-screen pb-20">
      
      {/* ── HERO ── */}
      <CinematicHero movie={trendingMovies?.[0]} />

      {/* ── CONTENT GRID ── */}
      <div className="container mx-auto px-6 mt-12">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-10 w-2 bg-[#d4af37]" />
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">أحدث الأخبار السينمائية</h2>
            <p className="text-[#d4af37] text-xs font-bold uppercase tracking-[5px]">The Daily Cinema Feed</p>
          </div>
        </div>

        {/* 3-COLUMN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {nowPlayingMovies?.slice(0, 9).map((movie: any) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* LOAD MORE */}
        <div className="mt-20 flex justify-center">
          <button className="gold-button px-12 py-4 text-sm font-black tracking-widest hover:scale-105 transition-transform">
            عرض المزيد من الأخبار
          </button>
        </div>

      </div>

    </main>
  )
}
