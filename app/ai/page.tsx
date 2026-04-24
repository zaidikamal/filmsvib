"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/utils/supabase/client"

const EXAMPLE_PROMPTS = [
  "أنا زهقان، أريد فيلم مثير يشبه Inception",
  "أريد فيلم رومانسي بنهاية سعيدة",
  "شيء مخيف لكن ليس عنيفاً",
  "فيلم عائلي ممتع للأطفال والكبار",
  "أكشن بطل واحد ضد الجميع مثل John Wick",
]

export default function AIFilmRecommender() {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [movies, setMovies] = useState<any[]>([])
  const [error, setError] = useState("")
  const [showThinking, setShowThinking] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const [showSignupBanner, setShowSignupBanner] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setIsLoggedIn(!!data.user)
    })
  }, [])

  const handleRecommend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    // Funnel: if not logged in after first try, show signup nudge
    if (isLoggedIn === false) {
      setShowSignupBanner(true)
      return
    }

    setLoading(true)
    setError("")
    setMovies([])
    setShowThinking(true)
    setShowSignupBanner(false)

    try {
      const response = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "حدث خطأ غير متوقع")
      setMovies(data.movies || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
      setTimeout(() => setShowThinking(false), 500)
    }
  }

  return (
    <main className="min-h-screen pt-28 pb-20 bg-[#0a0a0f] relative overflow-hidden">
      {/* Cinematic BG */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-radial from-purple-900/25 via-transparent to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-red-900/15 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 max-w-5xl relative z-10">

        {/* ── Header ── */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 px-4 py-1.5 rounded-full text-xs font-bold text-purple-300 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            Powered by Google Gemini 2.5 Flash
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-5 leading-tight">
            مستشارك السينمائي<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-500">
              الشخصي
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            صِف مزاجك أو الفيلم الذي تريده، وسأختار لك 3 تحف سينمائية تناسبك الليلة تماماً.
          </p>
        </div>

        {/* ── Input Box ── */}
        <div className="max-w-3xl mx-auto mb-6 relative group">
          <div className="absolute -inset-px bg-gradient-to-r from-purple-600 to-red-500 rounded-3xl blur-sm opacity-30 group-hover:opacity-60 transition-all duration-500" />
          <form onSubmit={handleRecommend} className="relative bg-[#0e0e18] rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
              rows={2}
              placeholder="مثال: أنا زهقان، أريد فيلم مثير يشبه Inception لكن بنهاية سعيدة..."
              className="w-full bg-transparent text-white text-base md:text-lg px-6 pt-5 pb-3 focus:outline-none placeholder-gray-600 resize-none disabled:opacity-50"
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleRecommend(e as any) } }}
            />
            <div className="flex items-center justify-between px-4 pb-3">
              <span className="text-xs text-gray-600">Enter للإرسال · Shift+Enter لسطر جديد</span>
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-500 hover:to-red-500 text-white font-bold py-2.5 px-8 rounded-2xl transition-all shadow-lg disabled:opacity-40 flex items-center gap-2 text-sm"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : "🎬"}
                {loading ? "جاري التحليل..." : "اقترح لي"}
              </button>
            </div>
          </form>
        </div>

        {/* ── Example Prompts ── */}
        {movies.length === 0 && !loading && (
          <div className="flex flex-wrap justify-center gap-2 mb-14">
            {EXAMPLE_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => setPrompt(p)}
                className="text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* ── Signup Conversion Banner (Funnel!) ── */}
        {showSignupBanner && (
          <div className="max-w-2xl mx-auto mb-12 animate-fade-in-up">
            <div className="relative bg-gradient-to-br from-purple-900/60 to-red-900/40 border border-purple-500/40 rounded-3xl p-8 text-center overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
              <div className="relative z-10">
                <div className="text-5xl mb-4">🎬</div>
                <h2 className="text-2xl font-black text-white mb-3">
                  مرحباً! أنت على بعد خطوة واحدة
                </h2>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  سجّل مجاناً في 10 ثوانٍ للوصول إلى المستشار الذكي، حفظ أفلامك المفضلة، والحصول على توصيات مخصصة بناءً على ذوقك.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/auth"
                    className="bg-gradient-to-r from-purple-600 to-red-600 text-white font-black py-3 px-8 rounded-2xl hover:scale-105 transition-transform shadow-lg"
                  >
                    ✨ سجّل مجاناً الآن
                  </Link>
                  <button
                    onClick={() => setShowSignupBanner(false)}
                    className="text-gray-400 hover:text-white py-3 px-6 rounded-2xl border border-white/10 hover:border-white/30 transition-all text-sm"
                  >
                    ربما لاحقاً
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-2xl mb-10 text-center max-w-lg mx-auto text-sm font-bold">
            ⚠️ {error}
          </div>
        )}

        {/* ── Loading Brain ── */}
        {showThinking && loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-6">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-purple-500/20" />
              <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
              <span className="text-3xl">🧠</span>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-lg mb-1">يحلل مكتبة الأفلام...</p>
              <p className="text-gray-500 text-sm">يطابق مزاجك مع ملايين الأفلام</p>
            </div>
          </div>
        )}

        {/* ── Results ── */}
        {!loading && movies.length > 0 && (
          <div>
            <div className="text-center mb-10">
              <p className="text-gray-500 text-sm mb-2">بناءً على طلبك:</p>
              <p className="text-white font-bold text-lg italic">"{prompt}"</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {movies.map((movie, idx) => (
                <div
                  key={idx}
                  className="group flex flex-col bg-[#0e0e18] rounded-3xl overflow-hidden border border-white/8 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-900/30 transition-all duration-500"
                >
                  {/* Poster */}
                  <Link href={movie.tmdb_id ? `/movie/${movie.tmdb_id}` : "#"} className="relative aspect-[2/3] block overflow-hidden">
                    <Image
                      src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/placeholder.jpg"}
                      alt={movie.arabic_title || movie.title}
                      fill
                      sizes="(max-width:768px) 100vw,33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e18] via-[#0e0e18]/30 to-transparent" />
                    {/* Rating badge */}
                    {movie.vote_average && (
                      <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 text-yellow-400 text-xs font-bold">
                        ⭐ {movie.vote_average.toFixed(1)}
                      </div>
                    )}
                    <div className="absolute bottom-4 inset-x-4 text-center">
                      <h3 className="text-xl font-black text-white drop-shadow-lg leading-tight">
                        {movie.arabic_title || movie.title}
                      </h3>
                      {movie.year && <p className="text-purple-300 text-xs font-bold mt-1">{movie.year}</p>}
                    </div>
                  </Link>

                  {/* AI reason */}
                  <div className="flex-1 flex flex-col p-5">
                    <div className="flex-1">
                      <p className="text-gray-400 text-sm leading-relaxed italic border-r-2 border-purple-500/50 pr-3">
                        {movie.reason}
                      </p>
                    </div>
                    {movie.tmdb_id && (
                      <Link
                        href={`/movie/${movie.tmdb_id}`}
                        className="mt-5 w-full text-center py-2.5 rounded-xl border border-white/10 hover:border-purple-500 hover:bg-purple-600/20 text-white text-sm font-bold transition-all"
                      >
                        عرض التفاصيل ←
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Post-results signup nudge */}
            {isLoggedIn === false && (
              <div className="mt-12 text-center bg-white/3 border border-white/8 rounded-3xl p-8">
                <p className="text-gray-300 mb-4 text-lg font-bold">💾 أعجبتك التوصية؟ احفظ هذه الأفلام في مفضلتك</p>
                <Link
                  href="/auth"
                  className="inline-block bg-gradient-to-r from-purple-600 to-red-600 text-white font-black py-3 px-10 rounded-2xl hover:scale-105 transition-transform"
                >
                  إنشاء حساب مجاني
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
