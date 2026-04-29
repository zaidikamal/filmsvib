"use client"
import { useState, useEffect, useRef } from "react"
import { createClient } from "@/utils/supabase/client"

interface Comment {
  id: string
  content: string
  created_at: string
  profiles: { email: string | null } | null
}

interface Props {
  articleId: string
}

export default function CommentSection({ articleId }: Props) {
  const supabase = createClient()
  const [comments, setComments] = useState<Comment[]>([])
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserEmail(user.email ?? null)

      // Fetch approved comments
      const { data } = await supabase
        .from("article_comments")
        .select(`id, content, created_at, profiles:user_id(email)`)
        .eq("article_id", articleId)
        .eq("is_approved", true)
        .order("created_at", { ascending: false })

      if (data) setComments(data as any)
      setLoading(false)
    }
    init()
  }, [articleId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    if (!userEmail) {
      setError("يجب تسجيل الدخول أولاً لإضافة تعليق.")
      return
    }

    setSubmitting(true)
    setError("")

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError("يجب تسجيل الدخول أولاً.")
      setSubmitting(false)
      return
    }

    const { error: insertError } = await supabase.from("article_comments").insert({
      article_id: articleId,
      user_id: user.id,
      content: content.trim(),
      is_approved: false,
    })

    if (insertError) {
      setError("حدث خطأ أثناء إرسال التعليق. حاول مجدداً.")
    } else {
      setSuccess(true)
      setContent("")
      setTimeout(() => setSuccess(false), 5000)
    }
    setSubmitting(false)
  }

  const getInitial = (email: string | null | undefined) => {
    return (email ?? "U")[0].toUpperCase()
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <section className="mt-20 space-y-10" id="comments">
      {/* Header */}
      <div className="flex items-center gap-4">
        <span className="w-1.5 h-12 bg-gradient-to-b from-purple-500 to-red-500 rounded-full" />
        <div>
          <h2 className="text-2xl font-black text-white">التعليقات</h2>
          <p className="text-sm text-gray-500">
            {comments.length > 0 ? `${comments.length} تعليق مقبول` : "كن أول من يعلق!"}
          </p>
        </div>
      </div>

      {/* Add Comment Form */}
      <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-8 shadow-xl backdrop-blur-xl">
        {userEmail ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-red-500 flex items-center justify-center font-black text-white text-sm shadow-lg">
                {getInitial(userEmail)}
              </div>
              <p className="text-sm text-gray-400">
                تعليق بصفتك <span className="text-white font-bold">{userEmail.split("@")[0]}</span>
              </p>
            </div>

            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              placeholder="شاركنا رأيك في هذا المقال..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 resize-none transition-all text-sm leading-relaxed font-cairo"
              maxLength={1000}
              disabled={submitting}
            />

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">{content.length}/1000</span>
              <button
                type="submit"
                disabled={submitting || !content.trim()}
                className="bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black py-3 px-8 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 text-sm flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    جارٍ الإرسال...
                  </>
                ) : (
                  <>💬 أرسل التعليق</>
                )}
              </button>
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                ⚠️ {error}
              </p>
            )}
            {success && (
              <p className="text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
                ✅ تم إرسال تعليقك بنجاح! سيظهر بعد مراجعة المشرف.
              </p>
            )}
          </form>
        ) : (
          <div className="text-center py-8 space-y-4">
            <div className="text-4xl">💬</div>
            <p className="text-gray-400 font-cairo">سجّل دخولك للمشاركة في النقاش</p>
            <a
              href="/auth"
              className="inline-block bg-gradient-to-r from-purple-600 to-red-600 text-white font-bold px-8 py-3 rounded-2xl shadow-lg hover:scale-105 transition-all"
            >
              تسجيل الدخول
            </a>
          </div>
        )}
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 animate-pulse">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10" />
                <div className="flex-1 space-y-3">
                  <div className="h-3 bg-white/10 rounded-full w-1/4" />
                  <div className="h-3 bg-white/10 rounded-full w-full" />
                  <div className="h-3 bg-white/10 rounded-full w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-5">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="group bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-[2rem] p-6 transition-all shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 border border-white/10 flex items-center justify-center font-black text-white text-sm flex-shrink-0">
                  {getInitial(comment.profiles?.email)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="font-bold text-white text-sm">
                      {comment.profiles?.email?.split("@")[0] ?? "مستخدم"}
                    </span>
                    <span className="w-1 h-1 bg-gray-700 rounded-full" />
                    <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed font-cairo whitespace-pre-line">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-600">
          <div className="text-5xl mb-4 opacity-30">💭</div>
          <p className="font-cairo italic">لا توجد تعليقات معتمدة بعد. كن أول من يشارك رأيه!</p>
        </div>
      )}
    </section>
  )
}
