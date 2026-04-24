"use client"
import { createClient } from "@/utils/supabase/client"
import { useState, useEffect } from "react"

export default function ArticleBookmarkButton({ articleId }: { articleId: number }) {
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
          .from('article_bookmarks')
          .select('id')
          .eq('user_id', user.id)
          .eq('article_id', articleId)
          .single()
        
        if (data) setIsSaved(true)
      }
    }
    checkStatus()
  }, [articleId, supabase])

  const toggleBookmark = async () => {
    if (!user) {
      alert("الرجاء تسجيل الدخول أولاً لحفظ المقال")
      return;
    }

    setIsLoading(true)

    if (isSaved) {
      const { error } = await supabase
        .from('article_bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('article_id', articleId)
      
      if (!error) setIsSaved(false)
    } else {
      const { error } = await supabase
        .from('article_bookmarks')
        .insert([{
          user_id: user.id,
          article_id: articleId,
        }])
      
      if (!error) setIsSaved(true)
    }

    setIsLoading(false)
  }

  return (
    <button 
      onClick={toggleBookmark}
      disabled={isLoading}
      title={isSaved ? "إلغاء الحفظ" : "حفظ المقال"}
      className={`p-3 rounded-full transition-all shadow-lg flex items-center justify-center ${isSaved ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}
    >
      {isLoading ? (
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
      ) : isSaved ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      )}
    </button>
  )
}
