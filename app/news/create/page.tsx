"use client"
import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export default function CreateArticlePage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [movieId, setMovieId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [category, setCategory] = useState("general")
  const [subcategory, setSubcategory] = useState("")
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkRole() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAdmin(false);
        return;
      }
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
        
      if (profile?.role === 'admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    }
    
    checkRole();
  }, [supabase]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !isAdmin) throw new Error("غير مصرح لك بنشر المقالات")

      // Simple slug generation
      const slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '') + '-' + Date.now();

      const { error: insertError } = await supabase.from("articles").insert([{
        title,
        slug,
        content,
        cover_image: coverImage || null,
        movie_id: movieId ? parseInt(movieId) : null,
        author_id: user.id,
        category,
        subcategory,
      }])

      if (insertError) throw insertError

      router.push("/news")
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء نشر المقال")
    } finally {
      setLoading(false)
    }
  }

  if (isAdmin === null) {
     return <div className="min-h-screen flex items-center justify-center pt-20"><div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div></div>
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <span className="text-6xl mb-4">🚫</span>
        <h1 className="text-2xl font-bold text-white mb-4">غير مصرح لك بالوصول</h1>
        <p className="text-gray-400 text-center max-w-md">عذراً، صفحة كتابة المقالات مخصصة للإدارة أو الكتاب الموثقين فقط.</p>
        <button onClick={() => router.push('/')} className="mt-8 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-bold transition-all">
          العودة للرئيسية
        </button>
      </div>
    )
  }

  return (
    <main className="min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-4 w-full">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">✍️ لوحة الكاتب (Editor)</h1>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl mb-6 max-w-3xl mx-auto">
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/2 bg-[#12121a] p-6 rounded-3xl border border-white/5 shadow-2xl">
            <h2 className="mb-6 font-bold text-xl border-b border-white/10 pb-4">محتوى المقال</h2>
            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="عنوان المقال..."
                  className="w-full bg-black/60 border border-white/20 text-white text-lg font-bold rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-all duration-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="url" 
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="رابط صورة الغلاف"
                  className="w-full bg-black/60 border border-white/20 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-all duration-300"
                />
                <input 
                  type="number" 
                  value={movieId}
                  onChange={(e) => setMovieId(e.target.value)}
                  placeholder="TMDB Film ID (اختياري)"
                  className="w-full bg-black/60 border border-white/20 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-all duration-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-black/60 border border-white/20 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-all duration-300"
                >
                  <option value="general">عام</option>
                  <option value="breaking">خبر عاجل 🔥</option>
                  <option value="global">السينما العالمية 🌍</option>
                  <option value="indian">السينما الهندية 🇮🇳</option>
                  <option value="arab">السينما العربية 🇸🇦</option>
                  <option value="analysis">التحليل والنقد 🧠</option>
                  <option value="reports">التقارير الخاصة 🎥</option>
                  <option value="stars">النجوم والمشاهير 🧑🎤</option>
                  <option value="behind">كواليس السينما 🎬</option>
                </select>
                <input 
                  type="text" 
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  placeholder="القسم الفرعي (مثال: أخبار هوليوود)"
                  className="w-full bg-black/60 border border-white/20 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-bold mb-2 flex justify-between">
                  المحتوى (يدعم Markdown)
                  <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" className="text-purple-400 hover:text-purple-300 text-xs">شرح Markdown</a>
                </label>
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={15}
                  placeholder="# عنوان جانبي\n\nاكتب مقالك التفصيلي هنا بأسلوب Markdown..."
                  className="w-full bg-black/60 border border-white/20 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-all duration-300 resize-y font-mono text-sm leading-relaxed"
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white font-bold py-4 px-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : "نشر المقال وحفظه 🚀"}
              </button>
            </form>
          </div>

          <div className="w-full lg:w-1/2 bg-black/40 p-6 rounded-3xl border border-white/5 h-[800px] overflow-y-auto">
             <div className="sticky top-0 bg-[#0a0a0f] z-10 pb-4 mb-4 border-b border-white/10 flex justify-between items-center">
               <h2 className="font-bold text-xl text-gray-300">مُعاينة حية (Live Preview)</h2>
               <span className="flex items-center gap-2 text-xs text-green-400 bg-green-400/10 px-3 py-1 rounded-full"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> يعمل</span>
             </div>
             <div className="prose prose-invert prose-purple max-w-none">
                <h1 className="text-4xl font-bold mb-6">{title || "عنوان المقال سيظهر هنا"}</h1>
                {content ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                  </ReactMarkdown>
                ) : (
                  <p className="text-gray-500 italic">ابدأ بكتابة محتوى المقال لرؤية المعاينة الحية...</p>
                )}
             </div>
          </div>
        </div>
      </div>
    </main>
  )
}
