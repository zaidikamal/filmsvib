"use client"
import { createClient } from "@/utils/supabase/client"
import { useState, useEffect } from "react"

export default function WatchlistButton({ movie }: { movie: any }) {
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    async function checkStatus() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const { data } = await supabase
          .from('watchlists')
          .select('id')
          .eq('user_id', user.id)
          .eq('movie_id', movie.id)
          .single()
        
        if (data) setIsSaved(true)
      }
    }
    checkStatus()
  }, [movie.id, supabase])

  const toggleWatchlist = async () => {
    if (!user) {
      alert("الرجاء تسجيل الدخول أولاً لإضافة الفيلم للمفضلة")
      return;
    }

    setIsLoading(true)

    if (isSaved) {
      const { error } = await supabase
        .from('watchlists')
        .delete()
        .eq('user_id', user.id)
        .eq('movie_id', movie.id)
      
      if (!error) setIsSaved(false)
    } else {
      const { error } = await supabase
        .from('watchlists')
        .insert([{
          user_id: user.id,
          movie_id: movie.id,
          movie_title: movie.title || movie.name,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average
        }])
      
      if (!error) setIsSaved(true)
    }

    setIsLoading(false)
  }

  return (
    <button 
      onClick={toggleWatchlist}
      disabled={isLoading}
      className={`px-8 py-3 rounded-full font-bold transition-all shadow-lg flex items-center gap-2 ${isSaved ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20' : 'bg-white text-black hover:bg-gray-200'}`}
    >
      {isLoading ? (
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
      ) : isSaved ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
          تمت الإضافة للمفضلة
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          أضف للمفضلة
        </>
      )}
    </button>
  )
}
