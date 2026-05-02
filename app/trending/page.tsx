import { getTrendingMovies } from "@/lib/tmdb"
import MovieCard from "@/components/MovieCard"

export default async function TrendingPage() {
  const trending = await getTrendingMovies()
  const movies = trending?.results || []

  return (
    <main className="min-h-screen bg-[#050507] pt-40 px-8 lg:px-20 pb-40">
      <div className="max-w-4xl mb-24 space-y-6">
         <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#d4af37]">Live Stream</span>
         <h1 className="text-7xl md:text-[8rem] font-black tracking-tighter leading-tight gold-text-glow royal-title uppercase">Trending<br/>Intelligence</h1>
         <p className="text-gray-400 text-xl font-bold max-w-xl leading-relaxed">الأفلام والتحليلات الأكثر تداولاً في الشبكة الآن. بيانات محدثة لحظياً بناءً على تفاعلات النخبة.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {movies.map((movie: any) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </main>
  )
}
