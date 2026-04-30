"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { submitArticle } from "@/app/actions/articles"

export default function UserArticleForm({ userId }: { userId: string }) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [category, setCategory] = useState("global")
  const router = useRouter()

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await submitArticle({
        title,
        content,
        category,
        imageUrl
      })
      
      router.push("/news/submitted")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء إرسال المقال")
      setLoading(false)
    }
  }


  return (
    <div className="flex flex-col xl:flex-row gap-8 pb-20">
      {/* Editor Side */}
      <div className="flex-1 bg-white/[0.03] backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
        <form onSubmit={handleCreate} className="space-y-8">
          <div className="border-b border-white/5 pb-6">
            <h2 className="text-2xl font-black text-white font-cairo">اكتب مقالك السينمائي ✍️</h2>
            <p className="text-gray-500 text-sm mt-2">شارك رؤيتك مع آلاف القراء والمحبين للسينما.</p>
          </div>

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
              placeholder="مثال: لماذا يعتبر فيلم 'العراب' أعظم فيلم في التاريخ؟"
              className="w-full bg-white/5 border border-white/10 text-white text-xl font-bold rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all font-cairo"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <div className="space-y-4">
              <label className="text-gray-400 text-sm font-bold block">التصنيف</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
              >
                <option value="global">السينما العالمية 🌍</option>
                <option value="indian">السينما الهندية 🇮🇳</option>
                <option value="arab">السينما العربية 🎬</option>
                <option value="bts">كواليس الأفلام 🎞️</option>
                <option value="ratings">التقييمات والجوائز ⭐</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-gray-400 text-sm font-bold block">رابط صورة الغلاف (اختياري)</label>
            <input 
              type="url" 
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-gray-400 text-sm font-bold">محتوى المقال</label>
              <span className="text-[10px] text-gray-500 font-mono">يدعم تنسيق Markdown</span>
            </div>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={15}
              placeholder="ابدأ بالكتابة هنا... استخدم العناوين، القوائم، والفقرات لجعل مقالك جذاباً."
              className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-6 px-6 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all resize-y font-cairo text-sm leading-relaxed"
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
              <><span>🚀</span> إرسال للمراجعة والنشر</>
            )}
          </button>
        </form>
      </div>

      {/* Preview Side */}
      <div className="w-full xl:w-[450px] space-y-8">
        <div className="sticky top-24">
          <div className="bg-black/20 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl h-[calc(100vh-160px)] flex flex-col">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span>👁️</span> معاينة حية
            </h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 prose prose-invert prose-purple max-w-none">
              {imageUrl && (
                <img src={imageUrl} alt="Preview" className="w-full h-40 object-cover rounded-2xl mb-6 border border-white/10" />
              )}
              <h1 className="text-2xl font-black mb-4 leading-tight font-cairo">{title || "عنوان مقالك سيظهر هنا"}</h1>
              {content ? (
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  className="font-cairo text-gray-300"
                >
                  {content}
                </ReactMarkdown>
              ) : (
                <div className="h-40 flex items-center justify-center border-2 border-dashed border-white/5 rounded-3xl text-gray-600 text-sm italic">
                  المعاينة تظهر هنا تلقائياً...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
