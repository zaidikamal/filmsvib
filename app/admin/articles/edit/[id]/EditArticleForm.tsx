"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export default function EditArticleForm({ article, userId }: { article: any, userId: string }) {
  const [title, setTitle] = useState(article.title)
  const [content, setContent] = useState(article.content)
  const [imageUrl, setImageUrl] = useState(article.image_url || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [category, setCategory] = useState(article.category || "global")
  const [isBreaking, setIsBreaking] = useState(article.is_breaking || false)
  const [isPublished, setIsPublished] = useState(article.is_published ?? true)
  const [slug, setSlug] = useState(article.slug)
  const router = useRouter()
  const supabase = createClient()

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { error: updateError } = await supabase
        .from("articles")
        .update({
          title,
          slug,
          content,
          image_url: imageUrl || null,
          category,
          is_breaking: isBreaking,
          is_published: isPublished,
        })
        .eq("id", article.id)

      if (updateError) throw updateError
      router.push("/admin/articles")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء تحديث المقال")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col xl:flex-row gap-8">
      {/* Editor Side */}
      <div className="flex-1 bg-[#12121a] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <form onSubmit={handleUpdate} className="space-y-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm animate-shake">
              ⚠️ {error}
            </div>
          )}

          <div className="space-y-4">
            <label className="text-gray-400 text-sm font-bold block">عنوان المقال</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 text-white text-xl font-bold rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-4">
              <label className="text-gray-400 text-sm font-bold block">الرابط الدائم (Slug)</label>
              <input 
                type="text" 
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 text-gray-400 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all font-mono text-sm"
              />
            </div>
            <div className="space-y-4">
              <label className="text-gray-400 text-sm font-bold block">التصنيف</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
              >
                <option value="global">السينما العالمية 🌍</option>
                <option value="indian">السينما الهندية 🇮🇳</option>
                <option value="arab">السينما العربية 🇸🇦</option>
                <option value="bts">كواليس الأفلام 🎞️</option>
                <option value="ratings">التقييمات والجوائز ⭐</option>
                <option value="exclusive">أخبار حصرية 📰</option>
                <option value="analysis">التحليل والنقد 🧠</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
              <label className="text-gray-400 text-sm font-bold block">رابط صورة الغلاف</label>
              <input 
                type="url" 
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
              />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Breaking News Toggle */}
            <div className="p-6 bg-red-600/5 border border-red-600/10 rounded-3xl flex items-center justify-between group">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-600/10 flex items-center justify-center text-2xl">🔥</div>
                  <div>
                     <h4 className="text-white font-bold">خبر عاجل؟</h4>
                     <p className="text-gray-500 text-[10px]">سيظهر في الشريط العلوي.</p>
                  </div>
               </div>
               <button 
                  type="button"
                  onClick={() => setIsBreaking(!isBreaking)}
                  className={`w-14 h-8 rounded-full transition-all relative ${isBreaking ? 'bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'bg-white/10'}`}
               >
                  <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${isBreaking ? 'left-7' : 'left-1'}`} />
               </button>
            </div>

            {/* Published Toggle */}
            <div className="p-6 bg-green-600/5 border border-green-600/10 rounded-3xl flex items-center justify-between group">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-green-600/10 flex items-center justify-center text-2xl">🌐</div>
                  <div>
                     <h4 className="text-white font-bold">الحالة</h4>
                     <p className="text-gray-500 text-[10px]">{isPublished ? 'منشور للعامة' : 'مسودة خاصة'}</p>
                  </div>
               </div>
               <button 
                  type="button"
                  onClick={() => setIsPublished(!isPublished)}
                  className={`w-14 h-8 rounded-full transition-all relative ${isPublished ? 'bg-green-600 shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'bg-white/10'}`}
               >
                  <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${isPublished ? 'left-7' : 'left-1'}`} />
               </button>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-gray-400 text-sm font-bold block">محتوى المقال (Markdown)</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={20}
              className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-6 px-6 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all resize-y font-mono text-sm leading-relaxed"
            />
          </div>

          <div className="flex gap-4">
            <button 
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-5 rounded-3xl transition-all"
            >
              إلغاء
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-[2] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-black py-5 rounded-3xl shadow-xl shadow-blue-500/20 transition-all flex justify-center items-center gap-3 text-lg"
            >
              {loading ? (
                <span className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <><span>💾</span> حفظ التعديلات</>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Preview Side */}
      <div className="w-full xl:w-[450px] space-y-8">
        <div className="sticky top-24">
          <div className="bg-[#12121a] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl h-[calc(100vh-160px)] flex flex-col">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-400">
              <span>👁️</span> معاينة حية
            </h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 prose prose-invert prose-purple max-w-none">
              {imageUrl && (
                <img src={imageUrl} alt="Preview" className="w-full h-40 object-cover rounded-2xl mb-6 border border-white/10" />
              )}
              <h1 className="text-2xl font-black mb-4 leading-tight">{title || "العنوان"}</h1>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
