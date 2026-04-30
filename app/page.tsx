import { createClient } from "@/utils/supabase/server"
import { getTrendingMovies } from "@/lib/tmdb"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import MovieCard from "@/components/MovieCard"

// ملاحظة: بما أن الصفحة هي Server Component، سنستخدم مكونات client صغيرة للأجزاء المتحركة إذا لزم الأمر
// أو سنعتمد على الـ CSS والـ Animate.css للتأثيرات المباشرة.

export default async function Home() {
  const supabase = await createClient()
  const tmdbData = await getTrendingMovies()
  
  // جلب المقالات من قاعدة البيانات
  const { data: articles } = await supabase
    .from('articles')
    .select('*, profiles(email)')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(10)

  const trendingMovies = tmdbData?.results || []
  const mainFeature = articles?.[0]
  const sideArticles = articles?.slice(1, 5) || []
  const bottomArticles = articles?.slice(5) || []

  return (
    <main className="min-h-screen bg-[#050507] text-white overflow-hidden">
      
      {/* 1. Breaking News Ticker */}
      <div className="bg-gradient-to-r from-purple-900/20 via-red-900/20 to-purple-900/20 border-b border-white/5 py-3 overflow-hidden whitespace-nowrap mt-16 relative">
        <div className="flex gap-12 animate-marquee inline-block">
          {articles?.map((art) => (
            <div key={art.id} className="flex items-center gap-3">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-400">حصري:</span>
              <Link href={`/news/${art.slug}`} className="text-xs font-bold hover:text-red-500 transition-colors">
                {art.title}
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        
        {/* 2. Top Tier: Main Feature & Side Buzz */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          
          {/* Main Cinematic Feature */}
          <div className="lg:col-span-8 relative group cursor-pointer overflow-hidden rounded-[2.5rem] border border-white/10 aspect-[16/10] md:aspect-auto md:h-[600px]">
            {mainFeature?.image_url && (
              <Image 
                src={mainFeature.image_url} 
                alt={mainFeature.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-90" />
            <div className="absolute bottom-0 p-10 w-full">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">تغطية خاصة</span>
                <span className="text-gray-400 text-xs font-bold">{new Date(mainFeature?.created_at).toLocaleDateString("ar-EG")}</span>
              </div>
              <Link href={`/news/${mainFeature?.slug}`}>
                <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight hover:text-purple-400 transition-colors">
                  {mainFeature?.title}
                </h2>
              </Link>
              <p className="text-gray-400 line-clamp-2 max-w-2xl mb-8 leading-relaxed">
                {mainFeature?.excerpt || mainFeature?.content?.substring(0, 150) + "..."}
              </p>
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xs font-bold">
                    {mainFeature?.profiles?.email?.[0].toUpperCase()}
                 </div>
                 <span className="text-sm font-bold text-gray-300">بقلم: {mainFeature?.profiles?.email?.split('@')[0]}</span>
              </div>
            </div>
          </div>

          {/* Side Buzz (Quick Info) */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-xl font-black mb-6 flex items-center gap-3">
              <span className="w-1 h-6 bg-red-600 rounded-full" />
              أسرار الكواليس
            </h3>
            {sideArticles.map((art) => (
              <Link href={`/news/${art.slug}`} key={art.id} className="block group">
                <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl group-hover:bg-white/[0.04] transition-all group-hover:border-purple-500/30">
                  <span className="text-[10px] text-purple-500 font-black uppercase tracking-widest block mb-2">{art.category || 'أخبار'}</span>
                  <h4 className="text-lg font-bold leading-snug group-hover:text-purple-300 transition-colors">{art.title}</h4>
                  <div className="mt-4 flex items-center justify-between text-[10px] text-gray-600 font-bold">
                    <span>{new Date(art.created_at).toLocaleDateString("ar-EG")}</span>
                    <span>{art.views || 0} مشاهدة</span>
                  </div>
                </div>
              </Link>
            ))}
            <Link href="/news" className="block w-full py-4 text-center border border-dashed border-white/10 rounded-3xl text-sm font-bold text-gray-500 hover:text-white hover:border-white/30 transition-all">
              عرض جميع المقالات والأسرار 📂
            </Link>
          </div>
        </div>

        {/* 3. The Cinematic Posters Section (TMDB) */}
        <section className="mb-20">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-4xl font-black text-white font-cairo">شباك التذاكر العالمي 🍿</h2>
              <p className="text-gray-500 mt-2">الأفلام الأكثر طلباً وتداولاً في السينما حالياً</p>
            </div>
            <Link href="/movies" className="text-purple-400 font-bold hover:underline">مشاهدة الكل</Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {trendingMovies.slice(0, 5).map((movie: any) => (
              <div key={movie.id} className="group relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                <Image 
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  width={500}
                  height={750}
                  className="group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-0 p-6">
                   <div className="bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded-md mb-2 inline-block">⭐ {movie.vote_average.toFixed(1)}</div>
                   <h4 className="font-bold text-sm leading-tight text-white">{movie.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Deep Intelligence Section (More Articles) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {bottomArticles.map((art) => (
            <Link href={`/news/${art.slug}`} key={art.id} className="group">
              <div className="relative aspect-video rounded-[2rem] overflow-hidden border border-white/10 mb-6">
                {art.image_url && (
                  <Image src={art.image_url} alt={art.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                )}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-[9px] font-black px-3 py-1 rounded-full border border-white/10">
                   {art.category?.toUpperCase()}
                </div>
              </div>
              <h3 className="text-xl font-bold leading-tight group-hover:text-purple-400 transition-colors mb-3">
                {art.title}
              </h3>
              <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                {art.excerpt || art.content?.substring(0, 100)}
              </p>
            </Link>
          ))}
        </div>

        {/* 5. Footer Buzz / Join the Crew */}
        <div className="relative rounded-[3rem] p-12 overflow-hidden border border-purple-500/20 bg-gradient-to-br from-purple-900/10 to-transparent">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 blur-[100px] rounded-full" />
           <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h2 className="text-4xl font-black mb-6">كن جزءاً من كواليس Filmsvib 🎬</h2>
              <p className="text-gray-400 mb-10 leading-relaxed">
                احصل على تنبيهات لحظية للأسرار التي لا يعرفها أحد في عالم السينما. انضم لمجتمعنا الفاخر الآن.
              </p>
              <div className="flex gap-4 justify-center">
                 <button className="px-10 py-4 bg-white text-black font-black rounded-2xl hover:bg-purple-500 hover:text-white transition-all">اشترك الآن</button>
                 <button className="px-10 py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all">اقرأ المزيد</button>
              </div>
           </div>
        </div>

      </div>
    </main>
  )
}
