import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import Image from "next/image"

export const revalidate = 60;

const CATEGORY_META: Record<string, any> = {
  global: {
    title: "السينما العالمية",
    subtitle: "أحدث روائع هوليوود والسينما الدولية",
    image: "/sections/global.png",
    color: "from-blue-600/40 to-purple-600/40",
    icon: "🎬"
  },
  indian: {
    title: "السينما الهندية",
    subtitle: "سحر بوليوود وتوليوود بلمسة عصرية",
    image: "/sections/indian.png",
    color: "from-orange-600/40 to-red-600/40",
    icon: "🎥"
  },
  bts: {
    title: "كواليس الأفلام",
    subtitle: "ما وراء الكاميرا.. أسرار وصناعة الفن",
    image: "/sections/bts.png",
    color: "from-gray-600/40 to-black/40",
    icon: "🎞️"
  },
  ratings: {
    title: "تقييمات الأفلام",
    subtitle: "نقد موضوعي وتقييمات دقيقة لأحدث الإصدارات",
    image: "/sections/ratings.png",
    color: "from-yellow-600/40 to-amber-600/40",
    icon: "⭐"
  },
  exclusive: {
    title: "أخبار حصرية",
    subtitle: "انفرادات ومتابعات لحظية لأهم أحداث الوسط الفني",
    image: "/sections/exclusive.png",
    color: "from-red-600/40 to-black/40",
    icon: "📰"
  },
  arab: {
    title: "السينما العربية",
    subtitle: "إبداعات الشرق وصناع السينما في العالم العربي",
    image: "/sections/indian.png", // Fallback
    color: "from-green-600/40 to-emerald-900/40",
    icon: "🇸🇦"
  },
  analysis: {
    title: "تحليل ونقد",
    subtitle: "قراءات متعمقة في البنية الدرامية والجمالية للأفلام",
    image: "/sections/bts.png", // Fallback
    color: "from-purple-900/40 to-indigo-900/40",
    icon: "🧠"
  }
}

export default async function NewsList(props: { searchParams: Promise<{ cat?: string }> }) {
  const searchParams = await props.searchParams
  const category = searchParams.cat
  const meta = category ? CATEGORY_META[category] : null
  
  const supabase = await createClient()
  
  // Base query
  let query = supabase
    .from("articles")
    .select(`
      id, title, slug, image_url, created_at, content, view_count, category,
      users:author_id(email)
    `)
    .eq("is_published", true)

  if (category) {
    query = query.eq("category", category)
  }

  const { data: articles } = await query.order("created_at", { ascending: false })

  // Trending articles
  const { data: trendingArticles } = await supabase
    .from("articles")
    .select(`
      id, title, slug, image_url, created_at, view_count, category,
      users:author_id(email)
    `)
    .eq("is_published", true)
    .order("view_count", { ascending: false })
    .limit(3)

  return (
    <main className="min-h-screen pb-24">
      {/* ── Premium Hero Header ── */}
      {meta ? (
        <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
          <Image 
            src={meta.image}
            alt={meta.title}
            fill
            className="object-cover scale-110 animate-slow-zoom"
            priority
          />
          <div className={`absolute inset-0 bg-gradient-to-b ${meta.color} via-[#0a0a0f]/80 to-[#0a0a0f]`}></div>
          
          <div className="relative z-10 text-center space-y-6 px-4 max-w-4xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-sm font-bold text-white mb-4">
              <span className="text-xl">{meta.icon}</span>
              {category?.toUpperCase()}
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl font-cairo">
              {meta.title}
            </h1>
            <p className="text-xl text-gray-300 font-medium max-w-2xl mx-auto leading-relaxed">
              {meta.subtitle}
            </p>
          </div>
        </div>
      ) : (
        <div className="pt-40 pb-20 container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-12">
            <div>
              <h1 className="text-5xl font-black text-white mb-4 font-cairo">بوابة الأفلام والمقالات 🗞️</h1>
              <p className="text-gray-400 text-lg">اكتشف أحدث التحليلات، الأخبار، والمراجعات السينمائية الحصرية.</p>
            </div>
            <Link href="/news/create" className="bg-gradient-to-r from-purple-600 to-red-600 hover:scale-105 active:scale-95 text-white font-black py-4 px-10 rounded-2xl transition-all shadow-xl shadow-purple-500/20 flex items-center gap-2">
              <span>✍️</span> شاركنا مقالك
            </Link>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 mt-12">
        {/* Trending Section (Only on all news or relevant cats) */}
        {!category && trendingArticles && trendingArticles.length > 0 && (
           <div className="mb-20">
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-red-600 rounded-full"></span>
                الأكثر تفاعلاً وقراءة هذا الأسبوع
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {trendingArticles.map((article: any, index: number) => (
                    <Link href={`/news/${article.slug}`} key={article.id} className="relative group bg-[#12121a] rounded-[2rem] overflow-hidden border border-white/5 hover:border-red-500/50 shadow-2xl transition-all">
                       <div className="absolute top-4 right-4 bg-red-600 text-white font-black w-10 h-10 rounded-2xl flex items-center justify-center z-20 shadow-xl rotate-3 group-hover:rotate-0 transition-transform">
                         {index + 1}
                       </div>
                       <div className="relative h-60 w-full">
                          <Image 
                             src={article.image_url || "/placeholder-hero.jpg"}
                             alt={article.title}
                             fill
                             className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#12121a] via-transparent to-transparent"></div>
                       </div>
                       <div className="p-6 relative z-10 -mt-16">
                          <span className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 mb-3 inline-block">
                             {article.category || 'عام'}
                          </span>
                          <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2 leading-tight group-hover:text-red-400 transition-colors">
                            {article.title}
                          </h3>
                       </div>
                    </Link>
                 ))}
              </div>
           </div>
        )}

        {/* Latest Articles */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-black text-white font-cairo">
            {category ? `مقالات ${meta?.title}` : "آخر المنشورات"}
          </h2>
          {category && (
            <Link href="/news" className="text-gray-500 hover:text-white text-sm transition-colors">
              عرض الكل ←
            </Link>
          )}
        </div>

        {!articles || articles.length === 0 ? (
          <div className="text-center py-32 bg-white/[0.02] rounded-[3rem] border border-white/5 backdrop-blur-sm">
            <div className="text-6xl mb-6 opacity-20">📭</div>
            <h2 className="text-2xl font-bold text-white/50 mb-2 font-cairo">لا توجد مقالات في هذا القسم حالياً</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">كن أنت صاحب المقال الأول في هذا القسم وأبهر مجتمعنا برؤيتك السينمائية!</p>
            <Link href="/news/create" className="inline-block bg-white/5 hover:bg-white/10 text-white font-bold py-4 px-10 rounded-2xl transition-all border border-white/10">
              أضف مقالاً الآن
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {articles.map((article: any) => (
              <Link href={`/news/${article.slug}`} key={article.id} className="group bg-[#12121a]/50 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-purple-500/30 transition-all flex flex-col h-full shadow-2xl hover:-translate-y-2">
                <div className="relative h-72 w-full overflow-hidden">
                  <Image 
                    src={article.image_url || "/placeholder-hero.jpg"}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-2xl text-[10px] font-bold text-gray-200 border border-white/10 shadow-lg">
                    {new Date(article.created_at).toLocaleDateString("ar-SA", { day: 'numeric', month: 'long' })}
                  </div>
                  <div className="absolute bottom-4 left-6">
                     <span className="bg-purple-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                       {article.category || 'عام'}
                     </span>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h2 className="text-2xl font-bold text-white mb-4 line-clamp-2 leading-snug group-hover:text-purple-400 transition-colors font-cairo">
                    {article.title}
                  </h2>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-8 flex-1 leading-relaxed italic">
                    {article.content}
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-red-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <span className="text-white text-sm font-black">
                          {article.users?.email?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <span className="text-gray-400 text-xs font-bold truncate">
                        {article.users?.email?.split('@')[0] || 'Filmsvib Writer'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="text-[10px] font-black">{article.view_count || 0}</span>
                      <span className="text-xs text-gray-700">👁️</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
