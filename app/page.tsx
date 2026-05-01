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
  const newsList = nowPlaying?.results?.slice(0, 12) || []

  return (
    <main className="min-h-screen relative overflow-hidden" dir="rtl">
      
      {/* ── THE MESH BACKGROUND ── */}
      <div className="mesh-bg" />

      <div className="relative z-10">
        <CinematicHero movie={heroMovie} />

        {/* ── TRENDING: THE GLASS GRID ── */}
        <section className="mt-40 px-6 lg:px-24 space-y-20">
          <div className="text-center space-y-6">
             <span className="text-[10px] font-black uppercase tracking-[1em] text-indigo-400">البيانات الرائجة</span>
             <h2 className="text-6xl md:text-8xl font-black tracking-tight leading-none text-white/90">أحدث<br/>العمليات</h2>
             <div className="w-40 h-1 bg-gradient-to-r from-indigo-500 to-rose-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {trendingList?.map((movie: any) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        {/* ── NEWS: THE CRYSTAL HUB ── */}
        <section className="mt-60 px-6 lg:px-24 pb-60">
           <div className="glass-island p-12 lg:p-24 rounded-[4rem] space-y-24 relative overflow-hidden">
              {/* DECOR */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 blur-[120px] -translate-y-1/2 translate-x-1/2" />
              
              <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/5 pb-16">
                 <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400">مركز الاستكشاف</span>
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-white/90">ملفات قيد<br/>المعالجة</h2>
                 </div>
                 <Link href="/news" className="btn-primary">فتح المركز بالكامل</Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12 pt-12">
                 {newsList?.map((movie: any) => (
                   <Link key={movie.id} href={`/movies/${movie.id}`} className="group relative h-96 glass-card rounded-[3rem] overflow-hidden">
                      <Image 
                        src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
                        alt={movie.title}
                        fill
                        className="object-cover opacity-20 grayscale group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent p-12 flex flex-col justify-end gap-4">
                         <div className="w-12 h-px bg-indigo-500 transition-all duration-500 group-hover:w-full" />
                         <h3 className="text-3xl font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors">{movie.title}</h3>
                      </div>
                   </Link>
                 ))}
              </div>
           </div>
        </section>

      </div>
    </main>
  )
}
