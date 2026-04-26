"use client"
import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export default function CreateArticleForm({ userId }: { userId: string }) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [category, setCategory] = useState("general")
  const [slug, setSlug] = useState("")
  const router = useRouter()
  const supabase = createClient()

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const finalSlug = slug || title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '') + '-' + Date.now();

      const { error: insertError } = await supabase.from("articles").insert([{
        title,
        slug: finalSlug,
        content,
        cover_image: coverImage || null,
        author_id: userId,
        category,
        is_published: true,
      }])

      if (insertError) throw insertError
      router.push("/admin/articles")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء نشر المقال")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col xl:flex-row gap-8">
      {/* Editor Side */}
      <div className="flex-1 bg-[#12121a] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <form onSubmit={handleCreate} className="space-y-8">
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
              placeholder="مثال: مراجعة فيلم الجوكر الجديد..."
              className="w-full bg-white/5 border border-white/10 text-white text-xl font-bold rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="text-gray-400 text-sm font-bold block">رابط صورة الغلاف</label>
              <input 
                type="url" 
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
              />
            </div>
            <div className="space-y-4">
              <label className="text-gray-400 text-sm font-bold block">التصنيف</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
              >
                <option value="general">عام</option>
                <option value="breaking">خبر عاجل 🔥</option>
                <option value="global">السينما العالمية 🌍</option>
                <option value="indian">السينما الهندية 🇮🇳</option>
                <option value="arab">السينما العربية 🇸🇦</option>
                <option value="analysis">التحليل والنقد 🧠</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-gray-400 text-sm font-bold">محتوى المقال (Markdown)</label>
              <span className="text-[10px] text-gray-500 font-mono">UTF-8 Supported</span>
            </div>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={20}
              placeholder="# ابدأ بعنوان مثير...\n\nاكتب تفاصيل الفيلم هنا..."
              className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-6 px-6 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all resize-y font-mono text-sm leading-relaxed"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white font-black py-5 rounded-3xl shadow-xl shadow-purple-500/20 transition-all flex justify-center items-center gap-3 text-lg hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? (
              <span className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <><span>🚀</span> نشر المقال الآن</>
            )}
          </button>
        </form>
      </div>

      {/* Preview Side */}
      <div className="w-full xl:w-[450px] space-y-8">
        <div className="sticky top-24">
          <div className="bg-[#12121a] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl h-[calc(100vh-160px)] flex flex-col">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span>👁️</span> معاينة حية
            </h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 prose prose-invert prose-purple max-w-none">
              {coverImage && (
                <img src={coverImage} alt="Preview" className="w-full h-40 object-cover rounded-2xl mb-6 border border-white/10" />
              )}
              <h1 className="text-2xl font-black mb-4 leading-tight">{title || "العنوان سيظهر هنا"}</h1>
              {content ? (
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  disallowedElements={['script', 'iframe', 'object', 'embed']}
                >
                  {content}
                </ReactMarkdown>
              ) : (
                <div className="h-40 flex items-center justify-center border-2 border-dashed border-white/5 rounded-3xl text-gray-600 text-sm italic">
                  نص المعاينة سيظهر بمجرد البدء في الكتابة...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
