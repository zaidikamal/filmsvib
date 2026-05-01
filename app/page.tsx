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
    <main className="min-h-screen bg-[#050507] pb-40">
      
      {/* ── SECTION 1: HERO EXPERIENCE ── */}
      <CinematicHero movie={heroMovie} />

      {/* ── SECTION 2: TRENDING INTELLIGENCE ── */}
      <section className="mt-32 px-8 lg:px-20 space-y-16">
        <div className="flex justify-between items-end border-b border-white/5 pb-10">
           <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-500">Intelligence Stream</span>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">Trending<br/>Operations</h2>
           </div>
           <Link href="/trending" className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all pb-2">
             Access All Archive
             <div className="w-10 h-px bg-white/10 group-hover:bg-purple-500 group-hover:w-16 transition-all" />
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
               <button className="bg-white text-black px-16 py-8 rounded-full font-black uppercase tracking-[0.4em] text-[10px] hover:bg-purple-600 hover:text-white transition-all shadow-2xl">Initialize Oracle</button>
            </div>
         </div>
      </section>

      {/* ── SECTION 4: DISCOVERY WALL ── */}
      <section className="px-8 lg:px-20 space-y-16">
        <div className="flex justify-between items-end border-b border-white/5 pb-10">
           <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-500">New Files</span>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">Global<br/>Archive</h2>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
           {discoveryList?.map((movie: any) => (
             <Link key={movie.id} href={`/movies/${movie.id}`} className="group relative aspect-video rounded-3xl overflow-hidden border border-white/5 glass-card-hover">
                <Image 
                  src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
                  alt={movie.title}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
                   <h3 className="text-2xl font-black uppercase tracking-tight leading-none mb-2 group-hover:text-purple-400 transition-colors">{movie.title}</h3>
                   <div className="flex items-center gap-4">
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Intel Verified</span>
                      <div className="w-1 h-1 bg-purple-500 rounded-full" />
                   </div>
                </div>
             </Link>
           ))}
        </div>
      </section>

    </main>
  )
}
