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
  const discoveryList = nowPlaying?.results?.slice(0, 12) || []

  return (
    <main className="min-h-screen bg-[#050507] pb-40 relative overflow-hidden" dir="rtl">
      
      {/* ── AMBIENT DECOR ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-purple-900/10 blur-[180px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-indigo-900/10 blur-[180px] rounded-full opacity-50" />
      </div>

      <div className="relative z-10">
        <CinematicHero movie={heroMovie} />

        {/* ── SECTION: TRENDING (THE ROYAL GRID) ── */}
        <section className="mt-20 px-8 lg:px-24 space-y-12">
          <div className="flex flex-col gap-4 border-r-4 border-purple-600 pr-8">
             <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-purple-500/80">أرشيف الاستخبارات</span>
             <h2 className="text-4xl md:text-5xl font-bold tracking-tight premium-gradient-text">العمليات الأكثر رواجاً</h2>
             <p className="text-gray-500 text-sm max-w-xl font-medium">تحليل يومي لأكثر الملفات السينمائية تداولاً حول العالم بنظام الذكاء الاصطناعي الخاص بنا.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pt-8">
            {trendingList?.map((movie: any) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          
          <div className="flex justify-center pt-12">
             <Link href="/trending" className="group flex items-center gap-6 px-12 py-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 group-hover:text-white transition-colors">عرض السجل الكامل</span>
                <div className="w-8 h-px bg-purple-500/50 group-hover:w-16 transition-all duration-500" />
             </Link>
          </div>
        </section>

        {/* ── SECTION: DEEP DISCOVERY (MODERN ARCHIVE) ── */}
        <section className="mt-48 px-8 lg:px-24 space-y-16">
          <div className="text-center space-y-4">
             <span className="text-[10px] font-bold uppercase tracking-[0.8em] text-purple-500/60">اكتشاف الأعماق</span>
             <h2 className="text-4xl md:text-5xl font-bold tracking-tight">ملفات قيد المعالجة</h2>
             <div className="w-24 h-1 bg-purple-600 mx-auto rounded-full shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
             {discoveryList?.map((movie: any) => (
               <Link key={movie.id} href={`/movies/${movie.id}`} className="group relative h-72 rounded-3xl overflow-hidden border border-white/5 bg-white/5 hover:border-purple-500/30 transition-all duration-700">
                  <Image 
                    src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
                    alt={movie.title}
                    fill
                    className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/40 to-transparent p-8 flex flex-col justify-end gap-2">
                     <span className="text-[8px] font-bold text-purple-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">مشاهدة التقرير</span>
                     <h3 className="text-xl font-bold tracking-tight group-hover:text-purple-400 transition-colors">{movie.title}</h3>
                     <div className="h-0 group-hover:h-1 w-0 group-hover:w-12 bg-purple-600 transition-all duration-500 rounded-full" />
                  </div>
               </Link>
             ))}
          </div>
        </section>

        {/* ── LUXURY FOOTER DIVIDER ── */}
        <div className="mt-40 px-24">
           <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>

      </div>
    </main>
  )
}
