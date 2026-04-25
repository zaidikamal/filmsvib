import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import Image from "next/image"

export const revalidate = 60; // Revalidate every minute

export default async function NewsList(props: { searchParams: Promise<{ cat?: string }> }) {
  const searchParams = await props.searchParams
  const category = searchParams.cat
  
  const supabase = await createClient()
  
  // Base query
  let query = supabase
    .from("articles")
    .select(`
      id, title, slug, cover_image, created_at, content, view_count,
      users:author_id(email)
    `)
    .eq("is_published", true)

  // Filter by category if provided
  if (category) {
    query = query.eq("category", category)
  }

  const { data: articles } = await query.order("created_at", { ascending: false })

  // Trending articles (sorted by views)
  const { data: trendingArticles } = await supabase
    .from("articles")
    .select(`
      id, title, slug, cover_image, created_at, view_count,
      users:author_id(email)
    `)
    .eq("is_published", true)
    .order("view_count", { ascending: false })
    .limit(3)

  return (
    <main className="min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">الأخبار والمقالات 📰</h1>
            <p className="text-gray-400">آخر التحديثات، المراجعات، والمقالات الحصرية في عالم السينما</p>
          </div>
          <Link href="/news/create" className="hidden md:flex bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-6 rounded-full transition-all border border-white/20 items-center gap-2">
            <span>✍️</span> اكتب مقالاً
          </Link>
        </div>

        {/* Trending Section */}
        {trendingArticles && trendingArticles.length > 0 && (
           <div className="mb-16">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-red-500 animate-pulse">🔥</span> 
                الأكثر تفاعلاً وقراءة
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {trendingArticles.map((article: any, index: number) => (
                    <Link href={`/news/${article.slug}`} key={article.id} className="relative group bg-[#12121a] rounded-3xl overflow-hidden border border-white/5 hover:border-red-500/50 shadow-lg">
                       <div className="absolute top-4 right-4 bg-red-600 text-white font-black w-8 h-8 rounded-full flex items-center justify-center z-20 shadow-lg">
                         {index + 1}
                       </div>
                       <div className="relative h-48 w-full bg-black/50">
                          <Image 
                             src={article.cover_image || "/placeholder-hero.jpg"}
                             alt={article.title}
                             fill
                             className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#12121a] to-transparent"></div>
                       </div>
                       <div className="p-5 relative z-10 -mt-10">
                          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 leading-snug group-hover:text-red-400 transition-colors">
                            {article.title}
                          </h3>
                          <div className="flex items-center justify-between text-xs text-gray-400 mt-4">
                             <span>👀 {article.view_count || 0} مشاهدة</span>
                             <span>{new Date(article.created_at).toLocaleDateString("ar-SA")}</span>
                          </div>
                       </div>
                    </Link>
                 ))}
              </div>
           </div>
        )}

        {/* Latest Articles */}
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">أحدث المقالات المضافة</h2>
        {!articles || articles.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5">
            <h2 className="text-2xl font-bold text-white mb-2">لا توجد مقالات بعد</h2>
            <p className="text-gray-400 mb-6">كن أول من ينشر مقالاً في مجتمعنا!</p>
            <Link href="/news/create" className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all">
              اكتب مقالاً الآن
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article: any) => (
              <Link href={`/news/${article.slug}`} key={article.id} className="group bg-[#12121a] rounded-3xl overflow-hidden border border-white/5 hover:border-purple-500/50 transition-all flex flex-col h-full shadow-lg hover:shadow-purple-500/20">
                <div className="relative h-64 w-full bg-black/50">
                  <Image 
                    src={article.cover_image || "/placeholder-hero.jpg"}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-gray-300 border border-white/10">
                    {new Date(article.created_at).toLocaleDateString("ar-SA")}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-2xl font-bold text-white mb-3 line-clamp-2 leading-tight group-hover:text-purple-400 transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                    {article.content}
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-red-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">
                        {article.users?.email?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="text-gray-400 text-sm truncate">
                      {article.users?.email?.split('@')[0] || 'كاتب غير معروف'}
                    </span>
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
