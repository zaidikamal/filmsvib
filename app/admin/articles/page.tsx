import { createClient } from "@/utils/supabase/server"
import Link from "next/link"

export default async function AdminArticles() {
  const supabase = createClient()

  const { data: articles, error } = await supabase
    .from("articles")
    .select(`
      id, title, slug, created_at, is_published, view_count,
      users:author_id(email)
    `)
    .order("created_at", { ascending: false })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">إدارة المقالات</h1>
        <Link
          href="/news/create"
          className="bg-gradient-to-r from-purple-600 to-red-600 text-white font-bold py-2 px-6 rounded-xl transition-all hover:shadow-lg hover:shadow-purple-500/20"
        >
          ✍️ مقال جديد
        </Link>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="p-4 text-gray-400 font-normal">العنوان</th>
              <th className="p-4 text-gray-400 font-normal hidden md:table-cell">المشاهدات</th>
              <th className="p-4 text-gray-400 font-normal hidden md:table-cell">التاريخ</th>
              <th className="p-4 text-gray-400 font-normal">الحالة</th>
              <th className="p-4 text-gray-400 font-normal">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {error && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-red-400">
                  خطأ في جلب البيانات: {error.message}
                </td>
              </tr>
            )}
            {articles?.map((article: any) => (
              <tr key={article.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-white line-clamp-1">{article.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{article.users?.email}</p>
                </td>
                <td className="p-4 hidden md:table-cell">
                  <span className="text-gray-300 text-sm">👀 {article.view_count || 0}</span>
                </td>
                <td className="p-4 text-sm text-gray-400 hidden md:table-cell">
                  {new Date(article.created_at).toLocaleDateString("ar-SA")}
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    article.is_published
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                  }`}>
                    {article.is_published ? "منشور" : "مسودة"}
                  </span>
                </td>
                <td className="p-4">
                  <Link
                    href={`/news/${article.slug}`}
                    className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                    target="_blank"
                  >
                    عرض ↗
                  </Link>
                </td>
              </tr>
            ))}
            {articles?.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-400">
                  لا توجد مقالات بعد.{" "}
                  <Link href="/news/create" className="text-purple-400 hover:underline">
                    أنشئ أول مقال
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
