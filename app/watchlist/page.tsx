"use client"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

export default function WatchlistPage() {
  const [movies, setMovies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    async function loadWatchlist() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setLoading(false)
        return
      }

      setUser(user)

      const { data, error } = await supabase
        .from('watchlists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (data) {
        setMovies(data)
      }
      setLoading(false)
    }

    loadWatchlist()
  }, [supabase])

  const removeFromWatchlist = async (movieId: number) => {
    if (!user) return

    setMovies(prev => prev.filter(m => m.movie_id !== movieId))

    await supabase
      .from('watchlists')
      .delete()
      .eq('user_id', user.id)
      .eq('movie_id', movieId)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 px-4">
        <div className="bg-[#12121a] p-8 rounded-2xl border border-white/10 text-center max-w-md w-full">
          <span className="text-6xl mb-4 block">🔒</span>
          <h1 className="text-2xl font-bold text-white mb-4">يجب تسجيل الدخول</h1>
          <p className="text-gray-400 mb-8">الرجاء تسجيل الدخول أولاً لتتمكن من الوصول إلى قائمة المفضلة الخاصة بك.</p>
          <Link href="/auth" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-bold transition-all w-full block">
            تسجيل الدخول / إنشاء حساب
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen pt-8 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-12 border-b border-white/10 pb-6">
          <h1 className="text-4xl font-bold text-white">قائمة المفضلة</h1>
          <span className="bg-purple-600/20 text-purple-400 px-4 py-1 rounded-full text-sm font-bold border border-purple-500/30">
            {movies.length} فيلم
          </span>
        </div>

        {movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-white/5">
            <span className="text-7xl mb-6">🍿</span>
            <h2 className="text-2xl font-bold text-white mb-2">قائمتك فارغة تماماً</h2>
            <p className="text-gray-400 mb-8 text-center max-w-md">أوه! لم تقم بإضافة أي أفلام إلى مفضلتك بعد. ابدأ باستكشاف الأفلام وأضف ما يعجبك.</p>
            <Link href="/" className="bg-gradient-to-r from-purple-600 to-red-600 px-8 py-3 rounded-full font-bold text-white hover:scale-105 transition-all">
              استكشف الأفلام
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((item) => (
              <div key={item.id} className="relative group">
                <Link href={`/movie/${item.movie_id}`} className="block bg-[#12121a] rounded-2xl overflow-hidden shadow-lg border border-white/5 hover:border-purple-500/50 transition-all">
                  <div className="relative aspect-[2/3] w-full">
                    <Image 
                      src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/placeholder-image.jpg'} 
                      alt={item.movie_title || 'صورة الفيلم'}
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1 z-10">
                      <span className="text-yellow-400 text-xs">★</span>
                      <span className="text-white text-xs font-bold">{Number(item.vote_average)?.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-white line-clamp-1">{item.movie_title}</h3>
                  </div>
                </Link>
                
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeFromWatchlist(item.movie_id);
                  }}
                  className="absolute top-2 right-2 bg-red-600/90 text-white p-2 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all hover:bg-red-700 z-10 shadow-lg"
                  title="إزالة من المفضلة"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
