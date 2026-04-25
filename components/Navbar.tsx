import Link from "next/link"
import SearchBar from "./SearchBar"
import AuthButton from "./AuthButton"
import { createClient } from "@/utils/supabase/server"

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

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
            <div className="absolute top-full left-0 mt-2 w-48 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <Link href="/news?cat=global" className="block px-4 py-2 hover:bg-white/10 text-sm">العالمية 🌍</Link>
              <Link href="/news?cat=indian" className="block px-4 py-2 hover:bg-white/10 text-sm">الهندية 🇮🇳</Link>
              <Link href="/news?cat=arab" className="block px-4 py-2 hover:bg-white/10 text-sm">العربية 🇸🇦</Link>
            </div>
          </div>
          <Link href="/ai" className="text-white hover:text-red-400 font-bold transition-colors flex items-center gap-1"><span>✨</span> اقتراح ذكي</Link>
          <Link href="/news?cat=analysis" className="text-white hover:text-purple-400 transition-colors">تحليل ونقد 🧠</Link>
          <Link href="/watchlist" className="text-white hover:text-purple-400 transition-colors">المفضلة</Link>
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

