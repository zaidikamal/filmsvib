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
  const newsList = nowPlaying?.results?.slice(0, 8) || []

  return (
    <main className="min-h-screen bg-[#050507] pb-40 relative overflow-hidden" dir="rtl">
      
      {/* ── BACKGROUND DECOR ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03] grayscale invert" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10">
        <CinematicHero movie={heroMovie} />

        {/* ── SECTION: TRENDING ── */}
        <section className="mt-32 px-8 lg:px-20 space-y-16">
          <div className="flex justify-between items-end border-b border-white/5 pb-10">
             <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-500">مجرى الاستخبارات</span>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">العمليات<br/>الرائجة</h2>
             </div>
             <Link href="/trending" className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all pb-2">
               فتح الأرشيف الكامل
               <div className="w-10 h-px bg-white/10 group-hover:bg-purple-500 group-hover:w-16 transition-all" />
             </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {trendingList?.map((movie: any) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        {/* ── SECTION: DEEP DISCOVERY ── */}
        <section className="mt-40 px-8 lg:px-20 space-y-16">
          <div className="flex justify-between items-end border-b border-white/5 pb-10">
             <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-500">حائط الاكتشاف</span>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">أحدث<br/>الملفات</h2>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
             {newsList?.map((movie: any) => (
               <Link key={movie.id} href={`/movies/${movie.id}`} className="group relative aspect-video rounded-2xl overflow-hidden border border-white/5 bg-white/5 transition-all">
                  <Image 
                    src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
                    alt={movie.title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-6 flex flex-col justify-end">
                     <h3 className="text-xl font-black uppercase tracking-tight leading-none group-hover:text-purple-400 transition-colors">{movie.title}</h3>
                  </div>
               </Link>
             ))}
          </div>
        </section>

      </div>
    </main>
  )
}
