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
      
      {/* ── ROYAL DECORATIONS ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-20" 
             style={{ backgroundImage: 'linear-gradient(rgba(212, 175, 55, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 175, 55, 0.05) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-gold-dark/5 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-red-900/5 blur-[120px] rounded-full" style={{ animationDelay: '-5s' }} />
      </div>

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
                    <div className="flex items-center gap-4">
                       <div className="w-2 h-2 bg-gold-light rounded-full shadow-[0_0_8px_rgba(212,175,55,1)]" />
                       <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gold-light">Global Intelligence</span>
                    </div>
                    <h2 className="text-6xl font-black tracking-tighter uppercase gold-gradient-text">الأرشيف <span className="text-white">العالمي</span></h2>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {newsList?.map((movie: any) => (
                  <div key={movie.id} className="group relative bg-[#0a0a0c] gold-border gold-border-hover rounded-sm overflow-hidden flex flex-col h-full transform transition-all duration-500 hover:-translate-y-2">
                     <div className="aspect-[4/5] relative overflow-hidden">
                        <Image 
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[0.5] group-hover:grayscale-0"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1 border border-gold-dark/30 rounded-sm">
                           <span className="text-[10px] font-black text-gold-light">{movie.vote_average.toFixed(1)}</span>
                        </div>
                     </div>
                     <div className="p-8 space-y-4 flex-1 flex flex-col justify-between relative">
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-dark/20 to-transparent" />
                        <h3 className="text-xl font-bold leading-tight group-hover:text-gold-light transition-colors line-clamp-2">{movie.title}</h3>
                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                           <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest italic">Cinema Intel</span>
                           <Link href={`/movies/${movie.id}`} className="flex items-center gap-2 group/btn">
                              <span className="text-[9px] font-black text-gold-dark group-hover/btn:text-gold-light uppercase tracking-widest transition-all">التفاصيل</span>
                              <div className="w-4 h-px bg-gold-dark group-hover/btn:w-8 transition-all" />
                           </Link>
                        </div>
                     </div>
                  </div>
                ))}
              </div>
           </div>

           {/* ── RIGHT: SIDEBAR ── */}
           <aside className="w-full xl:w-96 space-y-12">
              {/* TRENDING WIDGET */}
              <div className="bg-[#08080a] gold-border p-10 rounded-sm space-y-10 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-gold-dark/5 blur-3xl rounded-full" />
                 <h3 className="text-2xl font-black uppercase tracking-widest gold-gradient-text border-b border-gold-dark/20 pb-6">الأكثر تداولاً</h3>
                 <div className="space-y-8">
                    {trendingList.slice(0, 5).map((m: any, idx: number) => (
                       <div key={m.id} className="flex gap-6 group cursor-pointer items-center">
                          <span className="text-5xl font-black text-white/5 group-hover:text-gold-dark/20 transition-colors italic">0{idx + 1}</span>
                          <div className="space-y-2">
                             <h4 className="text-sm font-bold leading-tight group-hover:text-gold-light transition-colors">{m.title}</h4>
                             <div className="flex items-center gap-3">
                                <div className="w-1 h-1 bg-gold-dark/40 rounded-full" />
                                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{m.release_date?.split('-')[0]}</p>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              {/* POINTS WIDGET */}
              <div className="relative overflow-hidden group rounded-sm p-10 bg-gradient-to-br from-red-950/40 to-[#050507] border border-red-900/30">
                 <div className="absolute inset-0 shimmer-gold opacity-10" />
                 <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                       <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                       </span>
                       <span className="text-[9px] font-black text-red-500 uppercase tracking-[0.4em]">Oracle Active</span>
                    </div>
                    <h4 className="text-2xl font-black text-white">نظام التقييم الذكي</h4>
                    <p className="text-xs text-gray-400 leading-relaxed font-bold">يتم تحليل الأفلام بناءً على 48 معياراً استخباراتياً لضمان دقة التقييم الملكي.</p>
                    <button className="w-full py-5 border border-gold-dark/30 text-gold-light text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gold-dark hover:text-black transition-all shadow-xl">ابدأ التحليل الملكي</button>
                 </div>
              </div>

              {/* AD SPACE / PREMIUM */}
              <div className="aspect-[4/5] relative gold-border rounded-sm overflow-hidden group">
                 <Image 
                    src={`https://image.tmdb.org/t/p/w500${upcoming?.results?.[0]?.poster_path}`}
                    alt="Premium Ad"
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                 />
                 <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center p-10">
                    <span className="text-[10px] font-black text-gold-light uppercase tracking-[0.5em] mb-6 shimmer-gold">COMING SOON</span>
                    <h4 className="text-3xl font-black text-white uppercase leading-none mb-8">قريباً في<br/><span className="gold-gradient-text">الأرشيف الملكي</span></h4>
                    <div className="w-16 h-px bg-gold-dark shadow-[0_0_10px_rgba(212,175,55,1)]" />
                 </div>
              </div>
           </aside>
        </div>

        {/* ── NEW DECORATIVE SECTION: THE ORACLE BANNER ── */}
        <section className="mt-40 mb-20 px-8 lg:px-12">
           <div className="relative h-96 rounded-sm overflow-hidden gold-border bg-[#0a0a0c]">
              <div className="absolute inset-0 shimmer-gold opacity-5" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-8 px-8">
                 <span className="text-[10px] font-black uppercase tracking-[0.8em] text-gold-dark">The Royal Oracle Network</span>
                 <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase gold-gradient-text">Beyond Cinema Intelligence</h2>
                 <p className="text-gray-500 text-lg font-bold max-w-3xl leading-relaxed italic">نحن نعيد صياغة مفهوم النقد السينمائي عبر عدسة ملكية استخباراتية متفردة.</p>
                 <div className="flex gap-8">
                    <div className="w-20 h-px bg-gold-dark/20" />
                    <div className="w-4 h-4 rounded-full border border-gold-dark/40 animate-ping" />
                    <div className="w-20 h-px bg-gold-dark/20" />
                 </div>
              </div>
           </div>
        </section>

      </div>
    </main>
  )
}
