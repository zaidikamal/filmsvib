import { createClient } from "@/utils/supabase/server"
import { getTrendingMovies } from "@/lib/tmdb"
import Link from "next/link"
import Image from "next/image"

export default async function Home() {
  const supabase = await createClient()
  const tmdbData = await getTrendingMovies()
  
  const { data: articles } = await supabase
    .from('articles')
    .select('*, profiles(email)')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(12)

  const trendingMovies = tmdbData?.results || []
  const mainFeature = articles?.[0]
  const intelligenceGrid = articles?.slice(1, 7) || []
  const theRest = articles?.slice(7) || []

  return (
    <main className="min-h-screen bg-[#050507] text-white mesh-bg selection:bg-purple-500 selection:text-white overflow-hidden">
      
      {/* ── 1. THE PULSE TICKER (TOP) ── */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-black/40 backdrop-blur-3xl border-b border-white/5 py-3">
        <div className="flex gap-16 animate-marquee whitespace-nowrap px-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-16 items-center">
              {articles?.map((art) => (
                <div key={art.id} className="flex items-center gap-4 group cursor-pointer">
                  <span className="w-1 h-1 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,1)] group-hover:scale-150 transition-transform" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-purple-400/50">Pulse Log:</span>
                  <Link href={`/news/${art.slug}`} className="text-[11px] font-bold hover:text-purple-400 transition-colors uppercase tracking-tight">
                    {art.title}
                  </Link>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 pt-40 pb-24">
        
        {/* ── 2. HERO: THE ORACLE SPOTLIGHT (DAZZLE UPGRADE) ── */}
        <section className="relative mb-32 group">
          {/* INTERACTIVE BACKGLOW */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-purple-600/10 blur-[150px] opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="relative h-[750px] rounded-[4rem] overflow-hidden border border-white/10 glass-card">
            {mainFeature?.image_url && (
              <Image 
                src={mainFeature.image_url} 
                alt={mainFeature.title}
                fill
                priority
                className="object-cover transition-transform duration-[4000ms] ease-out group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/20 to-transparent reveal-mask" />
            
            <div className="absolute bottom-0 p-20 w-full lg:w-4/5">
               <div className="flex items-center gap-6 mb-10 animate-fade-in-up">
                  <span className="h-px w-16 bg-purple-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-400">Cinematic Masterpiece</span>
                  <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{new Date(mainFeature?.created_at).toLocaleDateString("en-US", { month: 'long', day: 'numeric' })}</span>
               </div>
               
               <Link href={`/news/${mainFeature?.slug}`}>
                 <h1 className="text-7xl md:text-[9rem] font-black mb-10 leading-[0.85] tracking-tighter premium-gradient-text hover:scale-[1.01] transition-transform duration-700">
                   {mainFeature?.title}
                 </h1>
               </Link>

               <div className="flex flex-wrap items-center gap-12 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                  <p className="text-gray-400 text-2xl font-medium leading-relaxed max-w-2xl drop-cap">
                    {mainFeature?.excerpt || "اكتشف أعمق أسرار السينما في هذا التحليل الحصري والمبهر من قلب الصناعة."}
                  </p>
                  <Link href={`/news/${mainFeature?.slug}`} className="px-12 py-6 bg-white text-black rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all shadow-2xl hover:shadow-purple-500/20 active:scale-95">
                    Open Intelligence File
                  </Link>
               </div>
            </div>
          </div>
        </section>

        {/* ── 3. THE INTELLIGENCE HUB (BENTO 2.0) ── */}
        <section className="mb-40">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl space-y-4">
              <div className="inline-block px-4 py-1 bg-white/5 border border-white/10 rounded-full">
                 <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Global Coverage</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter">The Intelligence Hub</h2>
              <p className="text-gray-500 text-xl font-bold leading-relaxed">تحليلات معمقة ورؤى استباقية لما يحدث خلف الكواليس في هوليوود والعالم.</p>
            </div>
            <div className="h-px flex-1 bg-white/5 mx-12 hidden lg:block" />
            <button className="text-[10px] font-black uppercase tracking-widest px-8 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">Filter Intelligence</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {intelligenceGrid.map((art, idx) => (
              <Link href={`/news/${art.slug}`} key={art.id} className="group flex flex-col">
                <div className={`relative flex-1 rounded-[3.5rem] overflow-hidden border border-white/5 glass-card glass-card-hover ${idx === 0 ? 'lg:row-span-2' : ''}`}>
                  <div className="aspect-[4/3] relative overflow-hidden">
                    {art.image_url && (
                      <Image src={art.image_url} alt={art.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-transparent opacity-80" />
                    <div className="absolute top-8 right-8">
                       <span className="bg-black/60 backdrop-blur-3xl border border-white/10 text-[9px] font-black px-5 py-2.5 rounded-full tracking-[0.3em] uppercase">
                          {art.category || "Intel"}
                       </span>
                    </div>
                  </div>
                  <div className="p-12 space-y-6">
                    <h3 className="text-3xl font-black leading-[1.1] group-hover:text-purple-400 transition-colors">
                      {art.title}
                    </h3>
                    <p className="text-gray-500 text-base line-clamp-2 font-bold leading-relaxed">
                      {art.excerpt || art.content?.substring(0, 100)}
                    </p>
                    <div className="flex justify-between items-center pt-8 border-t border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-1 bg-purple-500 rounded-full" />
                        <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">{new Date(art.created_at).toLocaleDateString()}</span>
                      </div>
                      <span className="text-purple-500 text-[10px] font-black uppercase tracking-widest group-hover:translate-x-[-10px] transition-transform">Access Data →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 4. BOX OFFICE ELITE (DAZZLE WALL) ── */}
        <section className="mb-40 p-20 rounded-[5rem] bg-gradient-to-b from-white/[0.02] to-transparent border border-white/5 relative overflow-hidden group/wall">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-600/5 blur-[200px] -translate-y-1/2 translate-x-1/2 group-hover/wall:bg-purple-600/10 transition-colors duration-1000" />
          
          <div className="flex flex-col lg:flex-row justify-between items-center mb-24 gap-12 relative z-10">
            <div className="space-y-4">
               <h2 className="text-6xl font-black tracking-tighter premium-gradient-text">Box Office Elite 🏆</h2>
               <p className="text-gray-500 font-bold tracking-widest uppercase text-[10px]">Real-time Global Rankings</p>
            </div>
            <Link href="/movies" className="text-[10px] font-black uppercase tracking-[0.3em] px-10 py-5 bg-white text-black rounded-2xl hover:bg-purple-600 hover:text-white transition-all shadow-xl">View Full Archive</Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 relative z-10">
            {trendingMovies.slice(0, 6).map((movie: any) => (
              <div key={movie.id} className="group/movie flex flex-col gap-6">
                <div className="relative aspect-[2/3] rounded-[2.5rem] overflow-hidden border border-white/10 cinematic-glow shadow-2xl group-hover/movie:-translate-y-4 transition-transform duration-700">
                  <Image 
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    className="object-cover group-hover/movie:scale-110 transition-transform duration-[2000ms]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover/movie:opacity-100 transition-opacity duration-700" />
                  <div className="absolute bottom-6 left-6 right-6 translate-y-8 opacity-0 group-hover/movie:translate-y-0 group-hover/movie:opacity-100 transition-all duration-700">
                    <button className="w-full py-4 bg-white text-black font-black text-[9px] rounded-xl uppercase tracking-widest shadow-2xl">Quick View</button>
                  </div>
                </div>
                <div className="px-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-yellow-500">⭐ {movie.vote_average.toFixed(1)}</span>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>
                  <h4 className="font-black text-xs text-gray-400 line-clamp-1 group-hover/movie:text-white transition-colors">{movie.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 5. THE MASTER'S VISION ── */}
        <section className="relative rounded-[5rem] p-32 text-center overflow-hidden border border-white/5 glass-card mb-40">
           <div className="absolute top-0 left-0 w-full h-full opacity-20">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-purple-600 rounded-full blur-[250px] animate-pulse" />
           </div>
           
           <div className="relative z-10 max-w-4xl mx-auto space-y-16">
              <div className="inline-block px-8 py-3 bg-white/5 border border-white/10 rounded-full">
                 <span className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-400">Join the Elite</span>
              </div>
              <h2 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.8] text-white">كن جزءاً من النخبة السينمائية.</h2>
              <p className="text-gray-400 text-2xl font-medium leading-relaxed">انضم إلى مجتمعنا الحصري لتصلك أسرار الصناعة والتحليلات الاستخباراتية قبل الجميع. نحن لا ننقل الخبر، نحن نصنع الرؤية.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-8 pt-8">
                 <button className="px-16 py-8 bg-white text-black font-black rounded-[2.5rem] text-xs uppercase tracking-[0.3em] hover:bg-purple-600 hover:text-white transition-all transform hover:scale-105 shadow-[0_20px_50px_rgba(255,255,255,0.1)]">Subscribe to Intel</button>
                 <button className="px-16 py-8 bg-white/5 border border-white/10 text-white font-black rounded-[2.5rem] text-xs uppercase tracking-[0.3em] hover:bg-white/10 transition-all">The Directory</button>
              </div>
           </div>
        </section>

      </div>
    </main>
  )
}
