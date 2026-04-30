"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/utils/supabase/client"
import { motion, AnimatePresence } from "framer-motion"

interface Comment {
  id: string
  content: string
  user_id: string
  created_at: string
  is_approved: boolean
  profiles: {
    email: string | null
    role: string | null
  } | null
}

export default function CommentSection({ articleId }: { articleId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      // 1. جلب التعليقات المعتمدة (وتعليقات المستخدم الحالي حتى لو لم تُعتمد)
      const { data } = await supabase
        .from('article_comments')
        .select('*, profiles:user_id(email, role)')
        .eq('article_id', articleId)
        .or(`is_approved.eq.true,user_id.eq.${user?.id || '00000000-0000-0000-0000-000000000000'}`)
        .order('created_at', { ascending: true })
      
      if (data) setComments(data as any)
    }
    init()

    // 2. الاشتراك اللحظي
    const channel = supabase
      .channel(`realtime-comments-${articleId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'article_comments',
          filter: `article_id=eq.${articleId}`
        },
        async (payload) => {
          // فقط نظهر التعليق الجديد لحظياً إذا كان معتمداً أو لصاحبه
          if (payload.new.is_approved || payload.new.user_id === user?.id) {
             const { data: profile } = await supabase
              .from('profiles')
              .select('email, role')
              .eq('id', payload.new.user_id)
              .single()

            const fullComment = { ...payload.new, profiles: profile } as any
            setComments(prev => [...prev, fullComment])
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [articleId, supabase, user?.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || !user) return

    setIsSubmitting(true)
    const { error } = await supabase
      .from('article_comments')
      .insert({
        article_id: articleId,
        user_id: user.id,
        content: content.trim(),
        is_approved: user.email === 'fr.capsules20@gmail.com' // الموافقة التلقائية للأدمن
      })

    if (!error) {
      setContent("")
      // التمرير للأسفل لرؤية التعليق الجديد
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
    setIsSubmitting(false)
  }

  return (
    <section className="mt-24 space-y-12" id="comments">
      <div className="flex items-center gap-4 border-b border-white/5 pb-6">
        <div className="w-2 h-10 bg-gradient-to-b from-purple-600 to-red-600 rounded-full" />
        <div>
          <h3 className="text-3xl font-black text-white font-cairo">النقاش</h3>
          <p className="text-sm text-gray-500">شاركنا رأيك وتفاعل مع المجتمع</p>
        </div>
        <span className="mr-auto px-4 py-2 bg-white/5 border border-white/10 rounded-2xl text-purple-400 font-bold text-sm">
          {comments.length} تعليق
        </span>
      </div>

      {/* نموذج التعليق */}
      <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {user ? (
          <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-red-500 flex items-center justify-center font-bold text-white shadow-lg">
                {user.email?.[0].toUpperCase()}
              </div>
              <p className="text-sm text-gray-400">
                تكتب الآن بصفتك <span className="text-white font-bold">{user.email?.split('@')[0]}</span>
              </p>
            </div>
            
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="اكتب تعليقك هنا..."
              className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all min-h-[150px] resize-none font-cairo leading-relaxed"
            />
            
            <div className="flex justify-between items-center">
              <p className="text-[10px] text-gray-600">سيتم مراجعة التعليق من قبل المشرفين قبل الظهور للجميع.</p>
              <button
                type="submit"
                disabled={isSubmitting || !content.trim()}
                className="px-10 py-4 bg-white text-black font-black rounded-2xl hover:bg-purple-500 hover:text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-xl"
              >
                {isSubmitting ? "جاري النشر..." : "نشر التعليق ✨"}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-10 space-y-6 relative z-10">
            <div className="text-5xl opacity-20">💬</div>
            <p className="text-gray-400 font-bold">يجب تسجيل الدخول لتتمكن من المشاركة في النقاش</p>
            <Link href="/login" className="inline-block px-10 py-4 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-700 transition-all">
              تسجيل الدخول الآن
            </Link>
          </div>
        )}
      </div>

      {/* قائمة التعليقات */}
      <div className="space-y-8">
        <AnimatePresence initial={false}>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-6 p-8 rounded-[2rem] border transition-all ${
                !comment.is_approved ? 'bg-orange-500/[0.02] border-orange-500/10' : 'bg-white/[0.01] border-white/5 hover:border-white/10'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 flex items-center justify-center text-2xl shadow-inner shrink-0">
                {comment.profiles?.role === 'admin' ? '🛡️' : '👤'}
              </div>
              
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <h4 className="font-bold text-white font-cairo">
                    {comment.profiles?.email?.split('@')[0] || 'مستخدم'}
                  </h4>
                  {comment.profiles?.role === 'admin' && (
                    <span className="text-[9px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">مدير</span>
                  )}
                  {!comment.is_approved && (
                    <span className="text-[9px] bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded-full font-black">قيد المراجعة</span>
                  )}
                  <span className="text-[10px] text-gray-700 mr-auto">
                    {new Date(comment.created_at).toLocaleDateString("ar-SA")}
                  </span>
                </div>
                
                <p className="text-gray-300 text-sm leading-relaxed font-cairo">
                  {comment.content}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={scrollRef} />
      </div>
    </section>
  )
}

import Link from "next/link"
