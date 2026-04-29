import { createClient } from "@/utils/supabase/server"
import CommentActions from "./CommentActions"

export default async function AdminCommentsPage() {
  const supabase = await createClient()

  // Fetch all article comments along with the user email and article title
  const { data: comments, error } = await supabase
    .from("article_comments")
    .select(`
      id,
      content,
      is_approved,
      created_at,
      user_id,
      users:user_id(email),
      articles:article_id(title, slug)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching comments:", error)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white">إدارة التعليقات</h1>
          <p className="text-gray-500">مراقبة، مراجعة، ومسح التعليقات على المقالات.</p>
        </div>
      </div>

      <div className="bg-[#12121a] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-widest border-b border-white/5">
                <th className="px-6 py-5 font-bold">التعليق</th>
                <th className="px-6 py-5 font-bold">المقال</th>
                <th className="px-6 py-5 font-bold">المستخدم</th>
                <th className="px-6 py-5 font-bold">الحالة</th>
                <th className="px-6 py-5 font-bold">التاريخ</th>
                <th className="px-6 py-5 font-bold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {comments?.map((comment: any) => (
                <tr key={comment.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-5">
                    <p className="text-sm text-gray-300 line-clamp-2 max-w-xs" title={comment.content}>
                      {comment.content}
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <a href={`/news/${comment.articles?.slug}`} target="_blank" className="text-sm font-bold text-white hover:text-purple-400 transition-colors line-clamp-1 max-w-[200px]" title={comment.articles?.title}>
                      {comment.articles?.title || "مقال محذوف"}
                    </a>
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-400">
                    {comment.users?.email || "مستخدم غير معروف"}
                  </td>
                  <td className="px-6 py-5">
                    {comment.is_approved ? (
                      <span className="flex items-center gap-2 text-xs text-green-400 bg-green-500/10 px-3 py-1 rounded-full w-fit">
                        <span className="w-2 h-2 bg-green-400 rounded-full" /> مقبول
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-xs text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full w-fit">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full" /> مخفي
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-xs text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString("ar-SA", { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-5">
                    <CommentActions 
                      commentId={comment.id} 
                      isApproved={comment.is_approved} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {(!comments || comments.length === 0) && (
          <div className="p-20 text-center text-gray-500 italic font-cairo">
            لا توجد أي تعليقات في النظام حالياً.
          </div>
        )}
      </div>
    </div>
  )
}
