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
  const trendingList = trending?.results?.slice(1, 10) || []
  const newsList = nowPlaying?.results?.slice(0, 9) || []

  return (
    <main className="min-h-screen bg-[#050507] pb-40 relative overflow-hidden marble-bg" dir="rtl">
      
      {/* ── BREAKING NEWS TICKER ── */}
      <div className="w-full h-12 news-ticker-gold relative z-50 flex items-center overflow-hidden border-y border-yellow-500/20">
         <div className="bg-red-700 h-full px-8 flex items-center gap-3 relative z-10 shadow-[5px_0_15px_rgba(0,0,0,0.5)]">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-white font-black text-xs uppercase tracking-widest whitespace-nowrap">عاجل استخباراتي</span>
         </div>
         <div className="flex-1 overflow-hidden whitespace-nowrap flex items-center">
            <div className="flex gap-20 animate-infinite-scroll py-2">
               {trending?.results?.map((m: any) => (
                 <span key={m.id} className="text-[11px] font-bold text-white/90 hover:text-white transition-colors cursor-pointer tracking-wide italic">
                    {m.title} — {m.vote_average.toFixed(1)} INTEL SCORE
                 </span>
               ))}
            </div>
         </div>
      </div>

      <div className="relative z-10">
        <CinematicHero movie={heroMovie} />

        {/* ── MAIN CONTENT GRID ── */}
        <div className="max-w-[1800px] mx-auto px-8 lg:px-12 mt-20 flex flex-col xl:flex-row gap-12">
           
           {/* ── LEFT: NEWS GRID (3 COLUMNS) ── */}
           <div className="flex-1 space-y-16">
              <div className="flex justify-between items-end border-b border-gold-dark/20 pb-8">
                 <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gold-light">Global Intelligence</span>
                    <h2 className="text-5xl font-black tracking-tighter uppercase gold-gradient-text">الأرشيف العالمي</h2>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {newsList?.map((movie: any) => (
                  <div key={movie.id} className="group relative bg-[#0a0a0c] gold-border gold-border-hover rounded-sm overflow-hidden flex flex-col h-full">
                     <div className="aspect-[4/5] relative overflow-hidden">
                        <Image 
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1 border border-gold-dark/30 rounded-sm">
                           <span className="text-[10px] font-black text-gold-light">{movie.vote_average.toFixed(1)}</span>
                        </div>
                     </div>
                     <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                        <h3 className="text-lg font-bold leading-tight group-hover:text-gold-light transition-colors line-clamp-2">{movie.title}</h3>
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                           <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Cinema Intel</span>
                           <Link href={`/movies/${movie.id}`} className="text-[9px] font-black text-gold-dark hover:text-gold-light uppercase tracking-widest transition-all">التفاصيل الكاملة</Link>
                        </div>
                     </div>
                  </div>
                ))}
              </div>
           </div>

           {/* ── RIGHT: SIDEBAR ── */}
           <aside className="w-full xl:w-96 space-y-12">
              {/* TRENDING WIDGET */}
              <div className="bg-[#08080a] gold-border p-8 rounded-sm space-y-8">
                 <h3 className="text-xl font-black uppercase tracking-widest gold-gradient-text border-b border-gold-dark/20 pb-4">الأكثر تداولاً</h3>
                 <div className="space-y-6">
                    {trendingList.slice(0, 5).map((m: any, idx: number) => (
                       <div key={m.id} className="flex gap-4 group cursor-pointer">
                          <span className="text-4xl font-black text-white/5 group-hover:text-gold-dark/20 transition-colors">{idx + 1}</span>
                          <div className="space-y-1">
                             <h4 className="text-sm font-bold leading-tight group-hover:text-gold-light transition-colors">{m.title}</h4>
                             <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{m.release_date?.split('-')[0]}</p>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              {/* POINTS WIDGET */}
              <div className="relative overflow-hidden group rounded-sm p-8 bg-gradient-to-br from-red-950/40 to-[#050507] border border-red-900/30">
                 <div className="absolute inset-0 shimmer-gold opacity-10" />
                 <div className="relative z-10 space-y-4">
                    <span className="text-[9px] font-black text-red-500 uppercase tracking-[0.4em]">Oracle Active</span>
                    <h4 className="text-xl font-black text-white">نظام التقييم الذكي</h4>
                    <p className="text-xs text-gray-400 leading-relaxed font-bold">يتم تحليل الأفلام بناءً على 48 معياراً استخباراتياً لضمان دقة التقييم.</p>
                    <button className="w-full py-4 border border-gold-dark/30 text-gold-light text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gold-dark hover:text-black transition-all">ابدأ التحليل</button>
                 </div>
              </div>

              {/* AD SPACE / PREMIUM */}
              <div className="aspect-[4/5] relative gold-border rounded-sm overflow-hidden group">
                 <Image 
                    src={`https://image.tmdb.org/t/p/w500${upcoming?.results?.[0]?.poster_path}`}
                    alt="Premium Ad"
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                 />
                 <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center p-8">
                    <span className="text-[10px] font-black text-gold-light uppercase tracking-[0.5em] mb-4">Coming Soon</span>
                    <h4 className="text-2xl font-black text-white uppercase leading-none mb-6">قريباً في<br/>الأرشيف</h4>
                    <div className="w-12 h-px bg-gold-dark" />
                 </div>
              </div>
           </aside>
        </div>

      </div>
    </main>
  )
}
