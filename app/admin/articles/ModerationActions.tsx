"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { moderateArticle } from "@/app/actions/articles"

export default function ModerationActions({ articleId, currentStatus }: { articleId: string, currentStatus: string }) {
  const [loading, setLoading] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [reason, setReason] = useState("")
  const router = useRouter()

  const handleAction = async (action: 'publish' | 'reject', rejectionReason?: string) => {
    setLoading(true)
    try {
      await moderateArticle(articleId, action, rejectionReason)
      setShowRejectModal(false)
      router.refresh()
    } catch (err: any) {
      console.error(err)
      alert(err.message || "حدث خطأ أثناء تحديث الحالة")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {currentStatus !== 'published' && (
        <button 
          onClick={() => handleAction('publish')}
          disabled={loading}
          className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-lg transition-all border border-green-500/20"
          title="نشر"
        >
          ✅
        </button>
      )}

      {currentStatus !== 'rejected' && (
        <button 
          onClick={() => setShowRejectModal(true)}
          disabled={loading}
          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-all border border-red-500/20"
          title="رفض"
        >
          ❌
        </button>
      )}

      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#12121a] border border-white/10 p-8 rounded-[2rem] w-full max-w-md shadow-2xl animate-fade-in-up">
            <h3 className="text-xl font-bold text-white mb-4">سبب رفض المقال</h3>
            <textarea 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm mb-6 focus:ring-2 focus:ring-red-500/40 outline-none h-32"
              placeholder="اكتب سبب الرفض لتعريف الكاتب..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className="flex gap-3">
              <button 
                onClick={() => handleAction('reject', reason)}
                disabled={loading || !reason}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
              >
                تأكيد الرفض
              </button>
              <button 
                onClick={() => setShowRejectModal(false)}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-all"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
