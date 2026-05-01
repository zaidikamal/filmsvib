"use client"
import Link from "next/link"
import SearchBar from "./SearchBar"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export default function Navbar({ user }: { user: any }) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push("/")
  }

  return (
    <nav className="fixed top-10 left-0 right-0 z-40 bg-black/40 backdrop-blur-xl border-b border-white/5 py-5 px-8 lg:px-16 flex items-center justify-between" dir="rtl">
      
      {/* ── LOGO ── */}
      <Link href="/" className="flex items-center gap-3 group">
         <div className="w-11 h-11 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-transform group-hover:rotate-12">
           F
         </div>
         <span className="font-bold text-2xl tracking-tighter purple-glow-text uppercase">Filmsvib</span>
      </Link>

      {/* ── NAV ── */}
      <div className="hidden lg:flex items-center gap-12">
         <Link href="/" className="text-sm font-semibold text-white/70 hover:text-white transition-all">الرئيسية</Link>
         <Link href="/trending" className="text-sm font-semibold text-white/70 hover:text-white transition-all">الرائج</Link>
         <Link href="/news" className="text-sm font-semibold text-white/70 hover:text-white transition-all">الأخبار</Link>
         <Link href="/admin" className="text-sm font-bold text-indigo-400 hover:text-indigo-300">لوحة المدير</Link>
      </div>

      {/* ── SEARCH & AUTH ── */}
      <div className="flex items-center gap-8">
        <SearchBar />
        {user ? (
          <button onClick={handleLogout} className="text-xs font-bold text-white/40 hover:text-white transition-colors">خروج</button>
        ) : (
          <Link href="/login" className="royal-button px-8 py-2.5 rounded-full text-xs tracking-widest uppercase">دخول</Link>
        )}
      </div>
    </nav>
  )
}
