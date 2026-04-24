"use client"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

export default function AIFilmRecommender() {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [movies, setMovies] = useState<any[]>([])
  const [error, setError] = useState("")
  const [showThinking, setShowThinking] = useState(false)

  const handleRecommend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setLoading(true)
    setError("")
    setMovies([])
    setShowThinking(true)

    try {
      const response = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "حدث خطأ غير متوقع")
      }

      setMovies(data.movies || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
      setTimeout(() => setShowThinking(false), 500)
    }
  }

  return (
    <main className="min-h-screen pt-32 pb-16 bg-[#0a0a0f] relative overflow-hidden">
      {/* Premium Background FX */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-purple-900/30 via-red-900/10 to-transparent blur-3xl rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        
        {/* Header Setup */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm font-bold text-purple-300 mb-6 mx-auto">
             <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
             Powered by Gemini AI Studio
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight flex flex-col md:flex-row items-center justify-center gap-4">
            الذكاء السينمائي <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-red-500">الاحترافي</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            توقف عن البحث العشوائي. صِف لي مزاجك، شعورك، أو نوع الفيلم الذي تبحث عنه، وسأقترح لك 3 تحف سينمائية تناسبك الآن.
          </p>
        </div>

        {/* Input UI */}
        <div className="max-w-3xl mx-auto mb-20 relative group">
           <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-red-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
           <form onSubmit={handleRecommend} className="relative bg-[#12121a] rounded-3xl p-2 flex flex-col md:flex-row items-center gap-2 border border-white/10 shadow-2xl">
              <input
                 type="text"
                 value={prompt}
                 onChange={(e) => setPrompt(e.target.value)}
                 disabled={loading}
                 placeholder="مثال: أنا أشعر بالملل، أريد فيلماً يشبه Inception ولكن بنهاية سعيدة..."
                 className="w-full bg-transparent text-white text-lg px-6 py-4 focus:outline-none placeholder-gray-500 disabled:opacity-50"
              />
              <button 
                 type="submit"
                 disabled={loading || !prompt.trim()}
                 className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-lg shrink-0 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                 {loading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>جاري التحليل...</span>
                    </>
                 ) : (
                    <>
                      <span>🎬</span> اقترح لي
                    </>
                 )}
              </button>
           </form>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl mb-12 text-center font-bold max-w-lg mx-auto">
            {error}
          </div>
        )}

        {/* AI Loading State (Premium UX) */}
        {showThinking && loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-6 animate-fade-in-up">
             <div className="w-24 h-24 relative flex items-center justify-center">
               <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
               <span className="text-3xl animate-pulse">🧠</span>
             </div>
             <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">أقوم بتحليل مكتبة الأفلام (TMDB)...</h3>
                <p className="text-gray-400 text-sm">أطابق حالتك المزاجية مع ملايين الأفلام لأختار لك الأفضل.</p>
             </div>
          </div>
        )}

        {/* AI Results */}
        {!loading && movies.length > 0 && (
          <div className="space-y-12 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-white text-center mb-10 border-b border-white/10 pb-6 inline-block w-full">
              ✨ التوصيات الذكية خصيصاً لك
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {movies.map((movie, idx) => (
                 <div key={idx} className="flex flex-col bg-[#12121a] rounded-3xl overflow-hidden border border-white/10 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 group">
                    {/* Poster section */}
                    <Link href={movie.tmdb_id ? `/movie/${movie.tmdb_id}` : '#'} className="relative aspect-[2/3] w-full overflow-hidden block">
                      <Image 
                         src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-image.jpg'}
                         alt={movie.arabic_title || movie.title}
                         fill
                         sizes="(max-width: 768px) 100vw, 33vw"
                         className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#12121a] via-[#12121a]/20 to-transparent"></div>
                      
                      <div className="absolute bottom-4 left-4 right-4 text-center">
                         <h3 className="text-2xl font-black text-white leading-tight drop-shadow-lg">
                           {movie.arabic_title || movie.title}
                         </h3>
                         <p className="text-purple-300 font-bold text-sm">{movie.year}</p>
                      </div>
                    </Link>

                    {/* AI Explanation / Netflix advisor section */}
                    <div className="p-6 flex-1 flex flex-col items-center text-center relative bg-gradient-to-b from-[#12121a] to-[#0a0a0f]">
                       <div className="absolute -top-6 bg-[#0a0a0f] p-3 rounded-full border border-white/10 shadow-xl group-hover:bg-purple-900/30 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                       </div>
                       
                       <div className="mt-4 flex-1">
                          <p className="text-gray-300 text-sm leading-relaxed italic relative">
                            <span className="text-purple-500 font-serif text-3xl absolute -left-2 -top-2 opacity-50">"</span>
                            {movie.reason}
                            <span className="text-purple-500 font-serif text-3xl absolute -right-2 bottom-0 opacity-50">"</span>
                          </p>
                       </div>

                       {movie.tmdb_id && (
                          <Link href={`/movie/${movie.tmdb_id}`} className="mt-8 w-full bg-white/5 hover:bg-purple-600 text-white font-bold py-3 rounded-xl transition-colors border border-white/10 hover:border-purple-500">
                             عرض التفاصيل
                          </Link>
                       )}
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
