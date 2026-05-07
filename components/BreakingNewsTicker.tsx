"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function BreakingNewsTicker() {
  const [news, setNews] = useState<{title: string, slug: string}[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Lazy import supabase client only on the client
    const init = async () => {
      try {
        const { createClient } = await import("@/utils/supabase/client")
        const supabase = createClient()

        const fetchNews = async () => {
          const { data } = await supabase
            .from('articles')
            .select('title, slug')
            .eq('is_breaking', true)
            .eq('status', 'published')
            .order('published_at', { ascending: false })
            .limit(10)

          if (data && data.length > 0) {
            setNews(data)
          } else {
            setNews([{ title: "🔥 اكتشف أحدث أخبار السينما العالمية", slug: "" }])
          }
        }

        await fetchNews()

        const channel = supabase
          .channel('breaking_news_ticker')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'articles' }, fetchNews)
          .subscribe()

        return () => {
          supabase.removeChannel(channel)
        }
      } catch (err) {
        console.error("BreakingNewsTicker init error:", err)
        setNews([{ title: "🎬 مرحباً بك في Filmsvib", slug: "" }])
      }
    }

    const cleanup = init()
    return () => {
      cleanup.then(fn => fn?.())
    }
  }, [])

  // Don't render on server at all - prevents hydration mismatch
  if (!mounted) return null

  if (news.length === 0) return null

  return (
    <div className="ticker-container" dir="rtl">
      <div className="bg-[#d4af37] text-black px-6 h-full flex items-center font-black text-[10px] tracking-widest uppercase z-10 shadow-[5px_0_15px_rgba(212,175,55,0.3)] shrink-0">
        عاجل
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div className="animate-ticker whitespace-nowrap flex items-center gap-16 py-2">
          {[...news, ...news, ...news, ...news].map((item, i) => (
            item.slug ? (
              <Link href={`/news/${item.slug}`} key={i} className="text-white/80 hover:text-[#d4af37] text-[13px] font-medium flex items-center gap-3 transition-colors">
                <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full shadow-[0_0_8px_#d4af37] shrink-0"></span>
                {item.title}
              </Link>
            ) : (
              <span key={i} className="text-white/80 text-[13px] font-medium flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full shadow-[0_0_8px_#d4af37] shrink-0"></span>
                {item.title}
              </span>
            )
          ))}
        </div>
      </div>
    </div>
  )
}
