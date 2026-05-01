import Image from "next/image"
import Link from "next/link"
import { getTrendingMovies, getLatestNews } from "@/lib/tmdb"

export default async function Home() {
  const trendingMovies = await getTrendingMovies()
  const heroMovie = trendingMovies?.results[0]
  const latestMovies = trendingMovies?.results.slice(1, 7)

  return (
    <main className="min-h-screen bg-[#050507] text-white overflow-hidden">
      
      {/* ── PULSE TICKER ── */}
      <div className="fixed top-24 left-0 right-0 z-40 px-8 lg:px-20 pointer-events-none">
         <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-2 flex items-center gap-4 max-w-max animate-fade-in-up">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Operational Intel: {heroMovie?.title} High Priority</span>
         </div>
      </div>

      {/* ── HERO SECTION ── */}
      <section className="relative h-screen flex flex-col justify-end pb-32 px-8 lg:px-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src={`https://image.tmdb.org/t/p/original${heroMovie?.backdrop_path}`}
            alt="Hero Backdrop"
            fill
            className="object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050507] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 space-y-8 max-w-6xl">
           <span className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-500 animate-fade-in-up">Global Cinema Intelligence</span>
           <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter leading-[0.8] premium-gradient-text uppercase animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
             {heroMovie?.title}
           </h1>
           <div className="flex flex-col md:flex-row gap-12 items-start md:items-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Link href={`/movies/${heroMovie?.id}`} className="bg-white text-black px-12 py-6 rounded-full font-black uppercase tracking-widest text-xs hover:bg-purple-600 hover:text-white transition-all transform hover:scale-110 active:scale-95 shadow-2xl">
                Analyze Intel
              </Link>
              <div className="flex gap-10">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Rating</p>
                    <p className="text-xl font-black">{heroMovie?.vote_average.toFixed(1)} <span className="text-purple-500">/ 10</span></p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Priority</p>
                    <p className="text-xl font-black text-red-500 uppercase">Critical</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* ── BENTO FEED ── */}
      <section className="py-40 px-8 lg:px-20 space-y-24">
         <div className="flex justify-between items-end border-b border-white/5 pb-12">
            <h2 className="text-5xl font-black tracking-tighter uppercase">Latest Operations</h2>
            <Link href="/exploration" className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-500 hover:text-white transition-colors">View All Archive</Link>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {latestMovies?.map((movie: any, idx: number) => (
              <Link 
                key={movie.id} 
                href={`/movies/${movie.id}`}
                className="group relative aspect-[16/10] overflow-hidden rounded-3xl border border-white/5 glass-card-hover"
              >
                <Image 
                  src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
                  alt={movie.title}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
                   <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2">Operation 0{idx+1}</span>
                   <h3 className="text-2xl font-black tracking-tight uppercase leading-none group-hover:text-purple-400 transition-colors">{movie.title}</h3>
                </div>
              </Link>
            ))}
         </div>
      </section>

      {/* ── THE ORACLE CTA ── */}
      <section className="py-60 relative overflow-hidden">
         <div className="absolute inset-0 bg-purple-600/10 backdrop-blur-3xl rounded-full blur-[120px] -translate-y-1/2 scale-150" />
         <div className="relative z-10 text-center space-y-12">
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-none">The Future of<br/>Cinema Intelligence</h2>
            <p className="text-gray-400 text-xl font-bold max-w-2xl mx-auto">انضم إلى النخبة. كن أول من يعرف، وأول من يفهم.</p>
            <button className="bg-white text-black px-16 py-8 rounded-full font-black uppercase tracking-[0.3em] text-[10px] hover:bg-purple-600 hover:text-white transition-all shadow-2xl">Initialize Access</button>
         </div>
      </section>

    </main>
  )
}
