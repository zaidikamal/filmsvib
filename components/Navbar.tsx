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
    <nav className="nav-container" dir="rtl">
      
      {/* ── LOGO ── */}
      <Link href="/" className="flex items-center gap-3 group">
         <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-600/30 transition-transform group-hover:rotate-12">
           F
         </div>
         <span className="font-bold text-2xl tracking-tighter purple-text-glow uppercase">Filmsvib</span>
      </Link>

      {/* ── NAV ── */}
      <div className="hidden lg:flex items-center gap-10">
         <Link href="/" className="text-sm font-semibold text-white/70 hover:text-white">الرئيسية</Link>
         <Link href="/trending" className="text-sm font-semibold text-white/70 hover:text-white">الرائج</Link>
         <Link href="/news" className="text-sm font-semibold text-white/70 hover:text-white">الأخبار</Link>
         <Link href="/admin" className="text-sm font-bold text-indigo-400 hover:text-indigo-300">لوحة المدير</Link>
      </div>

      {/* ── SEARCH & AUTH ── */}
      <div className="flex items-center gap-6">
        <SearchBar />
        {user ? (
          <button onClick={handleLogout} className="text-[11px] font-bold text-white/40 hover:text-white">خروج</button>
        ) : (
          <Link href="/login" className="btn-royal text-xs py-2 px-8">دخول</Link>
        )}
      </div>
    </nav>
  )
}
