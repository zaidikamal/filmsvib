"use client"
import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export default function CreateArticlePage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [movieId, setMovieId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const supabase = createClient()

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("يجب تسجيل الدخول لنشر مقال")

      // Simple slug generation
      const slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '') + '-' + Date.now();

      const { error: insertError } = await supabase.from("articles").insert([{
        title,
        slug,
        content,
        cover_image: coverImage || null,
        movie_id: movieId ? parseInt(movieId) : null,
        author_id: user.id,
      }])

      if (insertError) throw insertError

      router.push("/news")
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء نشر المقال")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold text-white mb-8">✍️ كتابة مقال جديد</h1>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleCreate} className="space-y-6">
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">عنوان المقال</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="مثال: مراجعة فيلم Inception..."
              className="w-full bg-black/60 border border-white/20 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">رابط صورة الغلاف (اختياري)</label>
            <input 
              type="url" 
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full bg-black/60 border border-white/20 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">رقم الفيلم المرتبط - TMDB ID (اختياري)</label>
            <input 
              type="number" 
              value={movieId}
              onChange={(e) => setMovieId(e.target.value)}
              placeholder="مثال: 550"
              className="w-full bg-black/60 border border-white/20 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">محتوى المقال</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={10}
              placeholder="اكتب مقالك هنا..."
              className="w-full bg-black/60 border border-white/20 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-all duration-300 resize-y"
            ></textarea>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : "نشر المقال 🚀"}
          </button>
        </form>
      </div>
    </main>
  )
}
