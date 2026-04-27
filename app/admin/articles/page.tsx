import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import Image from "next/image"
import DeleteArticleButton from "./DeleteArticleButton"

export default async function AdminArticlesPage() {
  const supabase = await createClient()
  
  const { data: articles } = await supabase
    .from("articles")
    .select(`
      id, title, slug, created_at, image_url, view_count, is_published, category, is_breaking,
      users:author_id(email)
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white">إدارة المقالات</h1>
          <p className="text-gray-500">تحكم بجميع المحتوى المنشور والمقالات المسودة.</p>
        </div>
        <Link 
          href="/admin/articles/create" 
          className="bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white font-bold py-3 px-8 rounded-2xl shadow-lg transition-all"
        >
          + مقال جديد
        </Link>
      </div>

      <div className="bg-[#12121a] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-widest">
                <th className="px-6 py-4 font-bold border-b border-white/5">المقال</th>
                <th className="px-6 py-4 font-bold border-b border-white/5">القسم</th>
                <th className="px-6 py-4 font-bold border-b border-white/5">عاجل؟</th>
                <th className="px-6 py-4 font-bold border-b border-white/5">المشاهدات</th>
                <th className="px-6 py-4 font-bold border-b border-white/5">الحالة</th>
                <th className="px-6 py-4 font-bold border-b border-white/5">التاريخ</th>
                <th className="px-6 py-4 font-bold border-b border-white/5">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {articles?.map((article: any) => (
                <tr key={article.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-black/50 flex-shrink-0 border border-white/10">
                        <Image 
                          src={article.image_url || "/placeholder-hero.jpg"} 
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-purple-400 transition-colors">{article.title}</h4>
                        <p className="text-[10px] text-gray-500">{article.users?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs bg-white/5 px-3 py-1 rounded-full border border-white/10 text-gray-300">
                      {article.category || "عام"}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    {article.is_breaking ? (
                      <span className="text-red-500 font-bold flex items-center gap-1">
                        <span className="animate-pulse">🔥</span> عاجل
                      </span>
                    ) : (
                      <span className="text-gray-600 text-xs">-</span>
                    )}
                  </td>
                  <td className="px-6 py-5 font-orbitron text-sm text-gray-300">
                    {article.view_count || 0}
                  </td>
                  <td className="px-6 py-5">
                    {article.is_published ? (
                      <span className="flex items-center gap-2 text-xs text-green-400">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> منشور
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-xs text-yellow-500">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full" /> مسودة
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-xs text-gray-500">
                    {new Date(article.created_at).toLocaleDateString("ar-SA")}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <Link 
                        href={`/news/${article.slug}`} 
                        target="_blank"
                        className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-all"
                        title="معاينة"
                      >
                        👁️
                      </Link>
                      <Link 
                        href={`/admin/articles/edit/${article.id}`} 
                        className="text-gray-400 hover:text-blue-400 p-2 hover:bg-white/10 rounded-lg transition-all"
                        title="تعديل"
                      >
                        ✏️
                      </Link>
                      <DeleteArticleButton id={article.id} title={article.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {!articles || articles.length === 0 && (
          <div className="p-20 text-center text-gray-500 italic">
            لا توجد مقالات مسجلة في قاعدة البيانات.
          </div>
        )}
      </div>
    </div>
  )
}
