import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function MyAnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth?redirect=/news/my-analytics")
  }

  // Fetch author's articles stats
  const { data: articles } = await supabase
    .from("articles")
    .select("id, title, views, created_at, status")
    .eq("author_id", user.id)
    .order("views", { ascending: false })

  if (!articles) return null

  const totalViews = articles.reduce((acc, art) => acc + (art.views || 0), 0)
  const publishedCount = articles.filter(a => a.status === 'published').length
  const bestArticle = articles[0]
  
  // Last 30 days growth (simplified logic: just sum of views of articles created in last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const recentArticles = articles.filter(a => new Date(a.created_at) > thirtyDaysAgo)
  const recentViews = recentArticles.reduce((acc, art) => acc + (art.views || 0), 0)

  return (
    <main className="min-h-screen pt-6 pb-20 bg-[#0a0a0f] text-white">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-black mb-2 font-cairo">تحليلاتي 📊</h1>
          <p className="text-gray-500">تتبع أداء مقالاتك وتفاعل الجمهور مع محتواك.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "إجمالي المشاهدات", value: totalViews.toLocaleString(), icon: "👁️", color: "from-blue-600/20 to-indigo-600/20" },
            { label: "المقالات المنشورة", value: publishedCount, icon: "📝", color: "from-green-600/20 to-emerald-600/20" },
            { label: "مشاهدات (آخر 30 يوم)", value: recentViews.toLocaleString(), icon: "📈", color: "from-purple-600/20 to-pink-600/20" },
            { label: "متوسط المشاهدات/مقال", value: articles.length > 0 ? Math.round(totalViews / articles.length).toLocaleString() : 0, icon: "🎯", color: "from-amber-600/20 to-orange-600/20" },
          ].map((stat, i) => (
            <div key={i} className={`bg-gradient-to-br ${stat.color} border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-md`}>
              <div className="text-3xl mb-4">{stat.icon}</div>
              <p className="text-gray-400 text-sm font-bold mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Best Performing */}
        {bestArticle && (
          <div className="mb-12 bg-[#12121a] border border-white/5 rounded-[3rem] p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/5 blur-[120px] -z-10"></div>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="shrink-0 w-24 h-24 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-5xl border border-[#d4af37]/20">
                👑
              </div>
              <div className="flex-1 text-center md:text-right">
                <p className="text-[#d4af37] text-xs font-black uppercase tracking-widest mb-2">أفضل مقال أداءً</p>
                <h2 className="text-2xl font-black mb-4 font-cairo">{bestArticle.title}</h2>
                <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-gray-500 font-bold">
                  <span>المشاهدات: <span className="text-white">{bestArticle.views?.toLocaleString()}</span></span>
                  <span>تاريخ النشر: <span className="text-white">{new Date(bestArticle.created_at).toLocaleDateString("ar-SA")}</span></span>
                </div>
              </div>
              <Link href={`/news/${bestArticle.id}`} className="btn-royal-gold py-4 px-10">
                عرض المقال
              </Link>
            </div>
          </div>
        )}

        {/* Detailed Table */}
        <div className="bg-[#12121a] border border-white/5 rounded-[2.5rem] overflow-hidden">
          <div className="p-8 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-xl font-black font-cairo">أداء المقالات التفصيلي</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-white/[0.02] text-gray-500 text-xs font-black uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-6">المقال</th>
                  <th className="px-8 py-6">الحالة</th>
                  <th className="px-8 py-6">المشاهدات</th>
                  <th className="px-8 py-6">تفاعل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {articles.map((art) => (
                  <tr key={art.id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="px-8 py-6">
                      <p className="font-bold text-white group-hover:text-[#d4af37] transition-colors">{art.title}</p>
                      <p className="text-[10px] text-gray-500 mt-1">{new Date(art.created_at).toLocaleDateString("ar-SA")}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                        art.status === 'published' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                        art.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                        'bg-gray-500/10 text-gray-500 border-gray-500/20'
                      }`}>
                        {art.status === 'published' ? 'منشور' : art.status === 'pending' ? 'مراجعة' : 'مسودة'}
                      </span>
                    </td>
                    <td className="px-8 py-6 font-black text-lg">{art.views?.toLocaleString() || 0}</td>
                    <td className="px-8 py-6">
                      <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                          style={{ width: `${Math.min((art.views || 0) / (bestArticle.views || 1) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}
