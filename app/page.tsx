import CinematicHero from "@/components/CinematicHero"
import MovieCard from "@/components/MovieCard"
import { getTrendingMovies, getNowPlayingMovies, getUpcomingMovies } from "@/lib/tmdb"
import Link from "next/link"
import Image from "next/image"

export default async function Home() {
  const [trending, nowPlaying, upcoming] = await Promise.all([
    getTrendingMovies(),
    getNowPlayingMovies(),
    getUpcomingMovies()
  ])

  const heroMovie = trending?.results?.[0] || null
  const trendingList = trending?.results?.slice(1, 9) || []
  const discoveryList = nowPlaying?.results?.slice(0, 6) || []

  return (
    <main className="min-h-screen bg-[#050507] pb-40 relative overflow-hidden">
      
      {/* ── BACKGROUND DECOR ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 cinematic-grid" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600 floating-glow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600 floating-glow" style={{ animationDelay: '-5s' }} />
      </div>

      <div className="relative z-10">
        <CinematicHero movie={heroMovie} />

        {/* ── SECTION 2: TRENDING INTELLIGENCE ── */}
        <section className="mt-32 px-8 lg:px-20 space-y-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-12 gap-8">
             <div className="space-y-6">
                <div className="flex items-center gap-4">
                   <span className="w-12 h-px bg-purple-500" />
                   <span className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-500">Intelligence Stream : LIVE</span>
                </div>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">Global<br/><span className="text-gray-700">Trending</span></h2>
             </div>
             <Link href="/trending" className="group flex flex-col items-end gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white transition-all">Access Archive</span>
                <div className="flex items-center gap-4">
                   <div className="w-16 h-px bg-white/10 group-hover:bg-purple-500 group-hover:w-24 transition-all" />
                   <span className="text-xs font-bold text-gray-700">REF: 2026_INTEL</span>
                </div>
             </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {trendingList?.map((movie: any) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        {/* ── SECTION 3: IMMERSIVE DIVIDER ── */}
        <section className="my-60 h-[70vh] relative overflow-hidden flex items-center justify-center">
           <div className="absolute inset-0 bg-purple-600/10 blur-[150px] animate-pulse" />
           <div className="relative z-10 text-center space-y-12 max-w-4xl px-8">
              <span className="text-[10px] font-black uppercase tracking-[0.8em] text-gray-500">The Oracle Network</span>
              <h2 className="text-6xl md:text-[9rem] font-black tracking-tighter uppercase leading-[0.8] premium-gradient-text">Beyond<br/>Cinema</h2>
              <p className="text-gray-400 text-xl font-bold leading-relaxed">نحن لا نعرض المحتوى، نحن نمنحك المفاتيح لفهم العبقرية السينمائية خلف كل مشهد.</p>
              <div className="pt-8">
                 <button className="bg-white text-black px-16 py-8 rounded-full font-black uppercase tracking-[0.4em] text-[10px] hover:bg-purple-600 hover:text-white transition-all shadow-2xl transform hover:scale-105 active:scale-95">Initialize Oracle</button>
              </div>
           </div>
        </section>

        {/* ── SECTION 4: DISCOVERY WALL ── */}
        <section className="px-8 lg:px-20 space-y-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-12 gap-8">
             <div className="space-y-6">
                <div className="flex items-center gap-4">
                   <span className="w-12 h-px bg-amber-500" />
                   <span className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500">Deep Discovery Wall</span>
                </div>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">Global<br/><span className="text-gray-700">Archive</span></h2>
             </div>
             <div className="flex gap-12">
                <div className="space-y-1 text-right">
                   <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Archive Size</p>
                   <p className="text-sm font-black uppercase tracking-widest">482K Files</p>
                </div>
                <div className="space-y-1 text-right">
                   <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Verification</p>
                   <p className="text-sm font-black uppercase tracking-widest text-green-500">Passed</p>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
             {discoveryList?.map((movie: any) => (
               <Link key={movie.id} href={`/movies/${movie.id}`} className="group relative aspect-video rounded-[2.5rem] overflow-hidden border border-white/5 glass-card-hover transform transition-all duration-700 hover:scale-[1.02]">
                  <Image 
                    src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
                    alt={movie.title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-10 flex flex-col justify-end">
                     <div className="space-y-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <h3 className="text-3xl font-black uppercase tracking-tight leading-none group-hover:text-purple-400 transition-colors">{movie.title}</h3>
                        <div className="flex items-center gap-4">
                           <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Intel Verified</span>
                           <div className="w-1.5 h-px bg-purple-500" />
                           <span className="text-[9px] font-black uppercase tracking-widest text-gray-700">ID: {movie.id}</span>
                        </div>
                     </div>
                  </div>
               </Link>
             ))}
          </div>
        </section>

      </div>
    </main>
  )
}
