import Link from "next/link"
import SearchBar from "./SearchBar"
import AuthButton from "./AuthButton"
import { createClient } from "@/utils/supabase/server"

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav className="fixed w-full z-50 transition-all duration-300 bg-black/80 backdrop-blur-md border-b border-white/5 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
           <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-600 to-red-600 flex items-center justify-center">
             <span className="text-white font-bold text-sm">F</span>
           </div>
           <span className="font-orbitron font-bold text-lg md:text-xl tracking-wider hidden sm:block">
             FILMS<span className="text-purple-500">VIB</span>
           </span>
        </Link>
        
        <div className="hidden lg:flex items-center gap-8">
          <Link href="/" className="text-white hover:text-purple-400 transition-colors">الرئيسية</Link>
          <Link href="/ai" className="text-white hover:text-red-400 font-bold transition-colors flex items-center gap-1"><span>✨</span> اقتراح ذكي</Link>
          <Link href="/news" className="text-white hover:text-purple-400 transition-colors">المقالات</Link>
          <Link href="/watchlist" className="text-white hover:text-purple-400 transition-colors">المفضلة</Link>
          <Link href="/profile" className="text-white hover:text-purple-400 transition-colors">حسابي</Link>
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

