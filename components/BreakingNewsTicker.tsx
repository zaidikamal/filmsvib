import { createClient } from "@/utils/supabase/server"
import Link from "next/link"

export const revalidate = 60;

export default async function BreakingNewsTicker() {
  const supabase = await createClient()
  
  // Try fetching breaking news first
  let { data: articles } = await supabase
    .from("articles")
    .select("title, slug, category, created_at")
    .eq("category", "breaking")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(5)

  // Fallback to latest news if no breaking news exists
  const isFallback = !articles || articles.length === 0
  if (isFallback) {
    const { data: latest } = await supabase
      .from("articles")
      .select("title, slug, category, created_at")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(5)
    articles = latest
  }

  if (!articles || articles.length === 0) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-[#8B0000]/95 backdrop-blur-md border-b border-white/10 h-10 flex items-center overflow-hidden shadow-2xl">
      <div className="container mx-auto px-4 flex items-center gap-4 h-full">
        {/* Label Container */}
        <div className="flex items-center gap-2 flex-shrink-0">
           <div className={`${isFallback ? 'bg-purple-600' : 'bg-red-600 animate-pulse'} text-white text-[9px] md:text-xs font-bold px-3 py-1 rounded-full flex items-center gap-2 whitespace-nowrap`}>
             <span className="w-1 h-1 bg-white rounded-full"></span>
             {isFallback ? 'أحدث الأخبار' : 'خبر عاجل'}
           </div>
           <div className="hidden sm:flex items-center gap-1 border border-yellow-500/30 px-3 py-1 rounded-full bg-yellow-500/5">
             <span className="text-yellow-500 text-[10px] font-bold">TOP</span>
             <span className="text-yellow-500">⭐</span>
           </div>
        </div>

        {/* Ticker Content */}
        <div className="flex-1 overflow-hidden relative h-full flex items-center">
          <div className="whitespace-nowrap animate-marquee flex items-center gap-12">
            {articles.map((article) => (
              <Link 
                key={article.slug} 
                href={`/news/${article.slug}`}
                className="text-white hover:text-red-400 text-sm font-medium transition-colors flex items-center gap-4 group"
              >
                <span className="opacity-40 font-black">✦</span>
                <span className="group-hover:translate-x-1 transition-transform inline-block">
                  {article.title}
                </span>
                <span className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                  {new Date(article.created_at).toLocaleTimeString("ar-SA", { hour: '2-digit', minute: '2-digit' })}
                </span>
              </Link>
            ))}
            {/* Duplicate for seamless loop */}
            {articles.map((article) => (
              <Link 
                key={`${article.slug}-dup`} 
                href={`/news/${article.slug}`}
                className="text-white hover:text-red-400 text-sm font-medium transition-colors flex items-center gap-4 group"
              >
                <span className="opacity-40 font-black">✦</span>
                <span className="group-hover:translate-x-1 transition-transform inline-block">
                  {article.title}
                </span>
                <span className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                  {new Date(article.created_at).toLocaleTimeString("ar-SA", { hour: '2-digit', minute: '2-digit' })}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
