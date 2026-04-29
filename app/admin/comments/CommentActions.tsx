"use client"
import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export default function CommentActions({ commentId, isApproved }: { commentId: string, isApproved: boolean }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const toggleApproval = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from("article_comments")
        .update({ is_approved: !isApproved })
        .eq("id", commentId)

      if (error) throw error
      router.refresh()
    } catch (err: any) {
      alert("حدث خطأ أثناء تحديث حالة التعليق")
    } finally {
      setLoading(false)
    }
  }

  const deleteComment = async () => {
    if (!window.confirm("هل أنت متأكد من حذف هذا التعليق نهائياً؟")) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from("article_comments")
        .delete()
        .eq("id", commentId)

      if (error) throw error
      router.refresh()
    } catch (err: any) {
      alert("حدث خطأ أثناء مسح التعليق")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button 
        onClick={toggleApproval}
        disabled={loading}
        className={`p-2 rounded-lg transition-all ${isApproved ? 'text-yellow-500 hover:bg-yellow-500/10' : 'text-green-500 hover:bg-green-500/10'}`}
        title={isApproved ? "إخفاء التعليق" : "الموافقة على التعليق"}
      >
        {isApproved ? '👁️‍🗨️' : '✅'}
      </button>
      <button 
        onClick={deleteComment}
        disabled={loading}
        className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded-lg transition-all"
        title="مسح التعليق"
      >
        🗑️
      </button>
    </div>
  )
}
