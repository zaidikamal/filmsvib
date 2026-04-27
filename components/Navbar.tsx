import Link from "next/link"
import SearchBar from "./SearchBar"
import { getProfile } from "@/utils/supabase/queries"
import AuthButton from "./AuthButton"
import { createClient } from "@/utils/supabase/server"

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const profile = await getProfile()

  return (
    <nav className="fixed w-full top-10 z-50 transition-all duration-300 bg-black/80 backdrop-blur-md border-b border-white/5 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
           <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-600 to-red-600 flex items-center justify-center">
             <span className="text-white font-bold text-sm">F</span>
           </div>
           <span className="font-orbitron font-bold text-lg md:text-xl tracking-wider hidden sm:block">
             FILMS<span className="text-purple-500">VIB</span>
           </span>
        </Link>
        
        <div className="hidden xl:flex items-center gap-6">
          <Link href="/" className="text-white hover:text-purple-400 transition-colors">الرئيسية</Link>
          <div className="relative group">
            <button className="text-white hover:text-purple-400 transition-colors flex items-center gap-1">
              السينما 🎬
            </button>
            <div className="absolute top-full left-0 mt-2 w-56 bg-black/95 backdrop-blur-2xl border border-white/10 rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 shadow-2xl">
              <Link href="/news?cat=global" className="block px-4 py-3 hover:bg-white/10 text-sm border-b border-white/5 flex items-center justify-between group/item">
                <span>السينما العالمية 🌍</span>
                <span className="opacity-0 group-hover/item:opacity-100 transition-opacity">←</span>
              </Link>
              <Link href="/news?cat=indian" className="block px-4 py-3 hover:bg-white/10 text-sm border-b border-white/5 flex items-center justify-between group/item">
                <span>السينما الهندية 🇮🇳</span>
                <span className="opacity-0 group-hover/item:opacity-100 transition-opacity">←</span>
              </Link>
              <Link href="/news?cat=bts" className="block px-4 py-3 hover:bg-white/10 text-sm border-b border-white/5 flex items-center justify-between group/item">
                <span>كواليس الأفلام 🎞️</span>
                <span className="opacity-0 group-hover/item:opacity-100 transition-opacity">←</span>
              </Link>
              <Link href="/news?cat=ratings" className="block px-4 py-3 hover:bg-white/10 text-sm border-b border-white/5 flex items-center justify-between group/item">
                <span>قسم التقييمات ⭐</span>
                <span className="opacity-0 group-hover/item:opacity-100 transition-opacity">←</span>
              </Link>
              <Link href="/news?cat=exclusive" className="block px-4 py-3 hover:bg-white/10 text-sm flex items-center justify-between group/item">
                <span>أخبار حصرية 📰</span>
                <span className="opacity-0 group-hover/item:opacity-100 transition-opacity">←</span>
              </Link>
            </div>
          </div>
          <Link href="/ai" className="text-white hover:text-red-400 font-bold transition-colors flex items-center gap-1"><span>✨</span> اقتراح ذكي</Link>
          <Link href="/watchlist" className="text-white hover:text-purple-400 transition-colors">المفضلة</Link>
          
          {/* Admin Dashboard Link - Enhanced Visibility & Check */}
          {(profile?.role?.toLowerCase() === 'admin' || user?.email === 'fr.capsules20@gmail.com') && (
            <Link 
              href="/admin" 
              className="group relative flex items-center gap-2 px-6 py-2 bg-red-500/10 border border-red-500/30 rounded-xl transition-all hover:bg-red-500/20 hover:scale-105 active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-spotlight"></div>
              <span className="text-red-500 font-black text-sm relative z-10 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
                لوحة المدير 🛠️
              </span>
            </Link>
          )}
        </div>

        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <SearchBar />
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <AuthButton user={user} />
        </div>
      </div>
    </nav>
  )
}

