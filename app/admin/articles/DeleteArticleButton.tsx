"use client"
import { useState } from "react"
import { deleteArticle } from "../actions"

export default function DeleteArticleButton({ id, title }: { id: string, title: string }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`هل أنت متأكد من حذف المقال: "${title}"؟ لا يمكن التراجع عن هذا الإجراء.`)) return

    setLoading(true)
    try {
      await deleteArticle(id)
      alert("تم حذف المقال بنجاح")
    } catch (err: any) {
      alert("فشل الحذف: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className={`text-gray-400 hover:text-red-500 p-2 hover:bg-white/10 rounded-lg transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title="حذف"
    >
      {loading ? "⌛" : "🗑️"}
    </button>
  )
}
