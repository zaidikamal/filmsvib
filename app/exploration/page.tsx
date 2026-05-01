import { getTrendingMovies, getNowPlayingMovies, getUpcomingMovies } from "@/lib/tmdb"
import Image from "next/image"
import Link from "next/link"

export default async function ExplorationPage() {
  const [trending, nowPlaying, upcoming] = await Promise.all([
    getTrendingMovies(),
    getNowPlayingMovies(),
    getUpcomingMovies()
  ])

  const allMovies = [
    ...(trending?.results || []),
    ...(nowPlaying?.results || []),
    ...(upcoming?.results || [])
  ]

  // Remove duplicates based on ID
  const uniqueMovies = Array.from(new Map(allMovies.map(m => [m.id, m])).values())

  return (
    <main className="min-h-screen bg-[#050507] text-white pt-32 pb-20 mesh-bg overflow-hidden">
      
      {/* ── HEADER: THE VISION ── */}
      <div className="container mx-auto px-6 mb-20 text-center relative z-10">
        <div className="inline-block px-6 py-2 bg-purple-600/10 border border-purple-500/20 rounded-full mb-8">
          <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.5em]">Cinematic Exploration</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 premium-gradient-text">The Cinema Wall</h1>
        <p className="text-gray-500 text-xl font-bold max-w-2xl mx-auto leading-relaxed">
          استكشف عالم السينما من خلال جدار تفاعلي يضم أحدث الإنتاجات والأسرار الاستخباراتية. كل فيلم هو بداية لقصة جديدة.
        </p>
      </div>

      {/* ── EXPLORATION GRID ── */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
          {uniqueMovies.map((movie: any, idx) => (
            <Link 
              key={movie.id} 
              href={`/movies/${movie.id}`}
              className="group relative aspect-[2/3] rounded-3xl overflow-hidden border border-white/5 cinematic-glow transition-all duration-700 hover:-translate-y-4 hover:scale-[1.02]"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {/* IMAGE GATEWAY */}
              <Image 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                fill
                className="object-cover transition-transform duration-[3000ms] group-hover:scale-110"
              />
              
              {/* OVERLAY PORTAL */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                 <div className="space-y-3 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black text-yellow-500 bg-black/60 px-2 py-1 rounded">⭐ {movie.vote_average.toFixed(1)}</span>
                       <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">{new Date(movie.release_date).getFullYear()}</span>
                    </div>
                    <h3 className="font-black text-sm text-white line-clamp-2 leading-tight uppercase tracking-tighter">{movie.title}</h3>
                    <div className="h-px w-full bg-white/20" />
                    <button className="w-full py-3 bg-white text-black text-[9px] font-black rounded-xl uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-colors">
                      Enter Portal
                    </button>
                 </div>
              </div>

              {/* STEALTH INDICATOR */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="w-8 h-8 rounded-full bg-purple-600/80 backdrop-blur-md flex items-center justify-center">
                    <span className="text-white text-[10px]">↗</span>
                 </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── BACKGROUND AMBIENCE ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[150px] animate-pulse" style={{ animationDelay: '1000ms' }} />
      </div>
      
    </main>
  )
}
