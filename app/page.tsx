import { getTrendingMovies, getNowPlayingMovies, getTopRatedMovies, getPopularMovies } from "@/lib/tmdb"
import MovieRow from "@/components/MovieRow"
import CinematicHero from "@/components/CinematicHero"
import NewsTicker from "@/components/NewsTicker"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/utils/supabase/server"

export default async function Home() {
  const supabase = await createClient()
  
  // Fetch movie data and articles in parallel with safe error handling
  const [trendingData, nowPlayingData, topRatedData, popularData, articlesResponse] = await Promise.all([
    getTrendingMovies().catch(() => null),
    getNowPlayingMovies().catch(() => null),
    getTopRatedMovies().catch(() => null),
    getPopularMovies().catch(() => null),
    supabase.from("articles").select("*").eq("status", "published").order("created_at", { ascending: false }).limit(6)
  ])

  const trendingMovies = trendingData?.results || []
  const nowPlayingMovies = nowPlayingData?.results || []
  const topRatedMovies = topRatedData?.results || []
  const popularMovies = popularData?.results || []
  const articles = articlesResponse?.data || []

  return (
    <main className="min-h-screen pb-32 bg-[#050507]">
      
      {/* ── NEWS TICKER ── */}
      <NewsTicker articles={articles || []} />
      
      {/* ── HERO ── */}
      <CinematicHero movie={trendingMovies?.[0]} />

      <div className="container mx-auto mt-20 px-4 lg:px-8">
        
        {/* ── TRENDING NOW (Row) ── */}
        <MovieRow title="الرائج الآن 🔥" movies={trendingMovies.slice(1)} />

        {/* ── FEATURED NEWS (Articles) ── */}
        {articles && articles.length > 0 && (
          <div className="mb-24" dir="rtl">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-10 w-1.5 bg-[#4c1d95] rounded-full shadow-[0_0_15px_#4c1d95]"></div>
              <h2 className="text-4xl font-black text-white font-royal tracking-tight">أحدث المقالات والتحليلات 🗞️</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {articles.map((article) => (
                <Link key={article.id} href={`/news/${article.slug}`} className="group relative aspect-[16/10] rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-[#d4af37]/40 transition-all shadow-2xl">
                  <Image 
                    src={article.image_url || "/placeholder-hero.jpg"} 
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-1000 opacity-70 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute bottom-0 p-8 w-full">
                    <span className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest mb-3 block">{article.category || "أخبار"}</span>
                    <h3 className="text-lg font-bold text-white line-clamp-2 leading-tight group-hover:text-[#d4af37] transition-colors">{article.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Link href="/news" className="text-gray-500 hover:text-[#d4af37] font-bold text-sm underline underline-offset-8 transition-colors">
                تصفح جميع المقالات والتقارير &rarr;
              </Link>
            </div>
          </div>
        )}

        {/* ── NOW PLAYING ── */}
        <MovieRow title="يُعرض حالياً 🎥" movies={nowPlayingMovies} />

        {/* ── TOP RATED ── */}
        <MovieRow title="الأعلى تقييماً 🏆" movies={topRatedMovies} />

        {/* ── POPULAR ── */}
        <MovieRow title="الأكثر شعبية 👥" movies={popularMovies} />

        {/* ── ROYAL CTA ── */}
        <div className="mt-40 relative rounded-[4rem] overflow-hidden p-20 text-center border border-white/5 bg-[#0a0a0f]">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-transparent to-purple-900/20" />
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 blur-[150px]" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/10 blur-[150px]" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-[#d4af37] font-black text-xs uppercase tracking-[0.6em] mb-6 block">عالم الأفلام بين يديك</span>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-10 leading-tight">انضم إلى مجتمع<br/><span className="gold-text-glow">Filmsvib</span></h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/auth" className="btn-royal-gold px-12 py-5 rounded-3xl font-black text-lg shadow-2xl hover:scale-105 transition-all">
                ابدأ رحلتك الآن
              </Link>
              <Link href="/exploration" className="bg-white/5 hover:bg-white/10 border border-white/10 px-12 py-5 rounded-3xl font-black text-lg text-white transition-all">
                استكشف الأرشيف
              </Link>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}

