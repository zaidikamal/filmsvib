import { createClient } from "@/utils/supabase/server"
import Link from "next/link"

export const revalidate = 60;

export default async function BreakingNewsTicker() {
  const supabase = await createClient()
  
  // Try fetching breaking news first (using is_breaking flag)
  let { data: articles } = await supabase
    .from("articles")
    .select("title, slug, category, created_at, image_url")
    .eq("is_breaking", true)
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(8)

  // Fallback to latest news if no explicit breaking news exists
  const isFallback = !articles || articles.length === 0
  if (isFallback) {
    const { data: latest } = await supabase
      .from("articles")
      .select("title, slug, category, created_at, image_url")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(5)
    articles = latest
  }

  // If still no articles, provide a default "Welcome" message for UI completeness
  if (!articles || articles.length === 0) {
    articles = [
      {
        title: "مرحباً بكم في Filmsvib - وجهتكم الأولى لأخبار السينما العالمية",
        slug: "",
        category: "welcome",
        created_at: new Date().toISOString()
      },
      {
        title: "تابعونا للحصول على أحدث المراجعات والأخبار الحصرية قريباً",
        slug: "",
        category: "info",
        created_at: new Date().toISOString()
      }
    ]
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-[#0a0a0f]/80 backdrop-blur-2xl border-b border-white/10 h-11 flex items-center overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      {/* Moving Spotlight Effect */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-red-600/10 to-transparent -translate-x-full animate-spotlight pointer-events-none"></div>
      
      <div className="container mx-auto px-4 flex items-center gap-6 h-full relative">
        {/* Label Container */}
        <div className="flex items-center gap-3 flex-shrink-0 relative z-10">
           <div className={`${isFallback ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gradient-to-r from-red-600 to-orange-600 animate-pulse'} text-white text-[10px] md:text-xs font-black px-4 py-1.5 rounded-xl flex items-center gap-2 shadow-lg shadow-red-500/20`}>
             <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
             </span>
             {isFallback ? 'أحدث الأخبار' : 'خبر عاجل'}
           </div>
        </div>

        {/* Ticker Content */}
        <div className="flex-1 overflow-hidden relative h-full flex items-center">
          <div className="whitespace-nowrap animate-marquee-rtl flex items-center gap-16 w-max py-2">
            {articles.map((article) => (
              <Link 
                key={article.slug || Math.random()} 
                href={article.slug ? `/news/${article.slug}` : "/"}
                className="text-gray-100 hover:text-white text-[13px] md:text-sm font-bold transition-all flex items-center gap-4 group"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 group-hover:scale-150 transition-transform"></div>
                <span className="group-hover:text-red-500 transition-colors font-cairo tracking-wide">
                  {article.title}
                </span>
                <span className="text-[10px] text-gray-500 font-orbitron bg-white/5 px-2 py-0.5 rounded-lg border border-white/5 group-hover:bg-white/10 transition-all">
                  {new Date(article.created_at).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: false })}
                </span>
              </Link>
            ))}
            {/* Duplicate for seamless loop */}
            {articles.map((article) => (
              <Link 
                key={`${article.slug || Math.random()}-dup`} 
                href={article.slug ? `/news/${article.slug}` : "/"}
                className="text-gray-100 hover:text-white text-[13px] md:text-sm font-bold transition-all flex items-center gap-4 group"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 group-hover:scale-150 transition-transform"></div>
                <span className="group-hover:text-red-500 transition-colors font-cairo tracking-wide">
                  {article.title}
                </span>
                <span className="text-[10px] text-gray-500 font-orbitron bg-white/5 px-2 py-0.5 rounded-lg border border-white/5 group-hover:bg-white/10 transition-all">
                  {new Date(article.created_at).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: false })}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Live Indicator */}
        <div className="hidden lg:flex items-center gap-2 flex-shrink-0 bg-white/5 px-4 py-1.5 rounded-xl border border-white/10 backdrop-blur-md">
           <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
           <span className="text-[10px] font-black text-gray-400 font-orbitron tracking-tighter">LIVE FEED</span>
        </div>
      </div>
    </div>
  )
}
