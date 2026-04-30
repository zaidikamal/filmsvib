import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export default async function MyArticlesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth?redirect=/news/my-articles")
  }

  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false })

  const STATUS_CONFIG: Record<string, any> = {
    pending: { label: "قيد المراجعة", color: "bg-amber-500/10 text-amber-500 border-amber-500/20", icon: "⏳" },
    published: { label: "منشور", color: "bg-green-500/10 text-green-500 border-green-500/20", icon: "✅" },
    rejected: { label: "مرفوض", color: "bg-red-500/10 text-red-400 border-red-500/20", icon: "❌" },
    draft: { label: "مسودة", color: "bg-gray-500/10 text-gray-400 border-gray-500/20", icon: "📝" },
  }

  return (
    <main className="min-h-screen pt-40 pb-20 bg-[#0a0a0f]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl font-black text-white mb-2 font-cairo">مقالاتي ✍️</h1>
            <p className="text-gray-500 text-lg">تتبع حالة مقالاتك، عدل المسودات، واطلع على ملاحظات التحرير.</p>
          </div>
          <Link href="/news/create" className="bg-gradient-to-r from-purple-600 to-red-600 hover:scale-105 active:scale-95 text-white font-black py-4 px-10 rounded-2xl transition-all shadow-xl shadow-purple-500/20 flex items-center gap-2">
            <span>➕</span> اكتب مقالاً جديداً
          </Link>
        </div>

        {!articles || articles.length === 0 ? (
          <div className="text-center py-32 bg-white/[0.02] rounded-[3rem] border border-white/5">
            <div className="text-6xl mb-6 opacity-20">📝</div>
            <h2 className="text-2xl font-bold text-white/50 mb-4 font-cairo">لم تقم بكتابة أي مقالات بعد</h2>
            <Link href="/news/create" className="text-purple-400 hover:text-purple-300 font-bold underline transition-colors">ابدأ كتابة مقالك الأول الآن</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => {
              const status = article.status || (article.is_published ? "published" : "pending")
              const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending

              return (
                <div key={article.id} className="group bg-[#12121a]/50 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-purple-500/30 transition-all flex flex-col h-full shadow-2xl relative">
                  
                  {/* Status Badge */}
                  <div className={`absolute top-6 left-6 z-20 px-4 py-2 rounded-2xl text-[10px] font-bold border backdrop-blur-xl flex items-center gap-2 ${config.color}`}>
                    <span>{config.icon}</span>
                    {config.label}
                  </div>

                  <div className="relative h-56 w-full overflow-hidden">
                    <Image 
                      src={article.image_url || "/placeholder-hero.jpg"}
                      alt={article.title}
                      fill
                      className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#12121a] via-transparent to-transparent"></div>
                  </div>

                  <div className="p-8 flex-1 flex flex-col">
                    <h2 className="text-xl font-bold text-white mb-4 line-clamp-2 leading-snug font-cairo">
                      {article.title}
                    </h2>
                    
                    {article.rejection_reason && status === 'rejected' && (
                      <div className="mb-6 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
                        <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">سبب الرفض:</p>
                        <p className="text-xs text-gray-400 italic leading-relaxed">{article.rejection_reason}</p>
                      </div>
                    )}

                    <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                      <span className="text-gray-500 text-[10px] font-bold">
                        {new Date(article.created_at).toLocaleDateString("ar-SA", { day: 'numeric', month: 'long' })}
                      </span>
                      
                      <div className="flex gap-2">
                        {status === 'published' && (
                          <Link href={`/news/${article.slug}`} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5">
                            👁️
                          </Link>
                        )}
                        {(status === 'draft' || status === 'rejected') && (
                          <Link href={`/news/edit/${article.id}`} className="p-3 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-xl transition-all border border-purple-500/20">
                            ✏️ تعديل
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
