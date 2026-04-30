"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/utils/supabase/client"
import { motion, AnimatePresence } from "framer-motion"

interface Comment {
  id: string
  content: string
  user_id: string
  created_at: string
  profiles: {
    email: string
    role: string
  }
}

export default function CommentsSection({ articleId }: { articleId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()

    // 1. جلب التعليقات الحالية
    const fetchComments = async () => {
      const { data } = await supabase
        .from('comments')
        .select('*, profiles(email, role)')
        .eq('article_id', articleId)
        .order('created_at', { ascending: true })
      
      if (data) setComments(data as any)
    }
    fetchComments()

    // 2. الاشتراك اللحظي في التعليقات الجديدة
    const channel = supabase
      .channel(`article-comments-${articleId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `article_id=eq.${articleId}`
        },
        async (payload) => {
          // جلب بيانات البروفايل للملعق الجديد
          const { data: profile } = await supabase
            .from('profiles')
            .select('email, role')
            .eq('id', payload.new.user_id)
            .single()

          const fullComment = { ...payload.new, profiles: profile } as any
          setComments(prev => [...prev, fullComment])
          
          // سكرول تلقائي لأسفل عند وصول تعليق جديد
          setTimeout(() => {
            scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
          }, 100)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [articleId, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !user) return

    setIsSubmitting(true)
    const { error } = await supabase
      .from('comments')
      .insert({
        article_id: articleId,
        user_id: user.id,
        content: newComment.trim()
      })

    if (!error) {
      setNewComment("")
    }
    setIsSubmitting(false)
  }

  return (
    <div className="mt-16 space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 border-b border-white/5 pb-4">
        <h3 className="text-2xl font-bold text-white font-cairo">التعليقات</h3>
        <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm">
          {comments.length}
        </span>
      </div>

      {/* قائمة التعليقات */}
      <div className="space-y-6">
        <AnimatePresence initial={false}>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 flex items-center justify-center text-xl shrink-0">
                👤
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-white font-cairo">
                    {comment.profiles?.email?.split('@')[0]}
                  </span>
                  {comment.profiles?.role === 'admin' && (
                    <span className="text-[10px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full font-bold">مدير</span>
                  )}
                  <span className="text-[10px] text-gray-600">
                    {new Date(comment.created_at).toLocaleDateString("ar-SA")}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-gray-300 text-sm leading-relaxed group-hover:border-purple-500/20 transition-colors">
                  {comment.content}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={scrollRef} />
      </div>

      {/* نموذج إضافة تعليق */}
      {user ? (
        <form onSubmit={handleSubmit} className="relative group">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="شاركنا رأيك..."
            className="w-full bg-[#12121a] border border-white/10 rounded-[2rem] p-6 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all min-h-[120px] resize-none"
          />
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="absolute bottom-4 left-4 px-8 py-3 bg-gradient-to-r from-purple-600 to-red-600 text-white rounded-full text-xs font-bold hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
          >
            {isSubmitting ? "جاري النشر..." : "نشر التعليق 🚀"}
          </button>
        </form>
      ) : (
        <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-dashed border-white/10 text-center">
          <p className="text-gray-500 text-sm">
            يرجى <a href="/login" className="text-purple-400 font-bold hover:underline">تسجيل الدخول</a> لتتمكن من إضافة تعليق
          </p>
        </div>
      )}
    </div>
  )
}
