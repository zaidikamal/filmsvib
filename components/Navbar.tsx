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
    <nav className="fixed top-12 left-0 right-0 z-40 bg-[#0a0a0a]/95 border-b border-[#d4af37]/30 py-4 px-12 flex items-center justify-between" dir="rtl">
      
      {/* ── LOGO ── */}
      <Link href="/" className="flex items-center gap-4">
         <div className="w-10 h-10 border-2 border-[#d4af37] flex items-center justify-center text-[#d4af37] font-black text-xl shadow-[0_0_10px_rgba(212,175,55,0.3)]">
           F
         </div>
         <span className="font-bold text-2xl tracking-tighter gold-text uppercase">Filmsvib</span>
      </Link>

      {/* ── NAV ── */}
      <div className="hidden lg:flex items-center gap-10">
         <Link href="/" className="text-sm font-bold text-white hover:text-[#d4af37] transition-colors">الرئيسية</Link>
         <Link href="/trending" className="text-sm font-bold text-white hover:text-[#d4af37] transition-colors">الرائج</Link>
         <Link href="/news" className="text-sm font-bold text-white hover:text-[#d4af37] transition-colors">الأخبار</Link>
         <Link href="/admin" className="text-sm font-bold text-[#d4af37] hover:underline">لوحة المدير</Link>
      </div>

      {/* ── SEARCH & AUTH ── */}
      <div className="flex items-center gap-6">
        <SearchBar />
        {user ? (
          <button onClick={handleLogout} className="text-xs font-bold text-white/50 hover:text-white transition-colors">خروج</button>
        ) : (
          <Link href="/login" className="gold-button px-6 py-2 rounded text-xs">دخول</Link>
        )}
      </div>
    </nav>
  )
}
