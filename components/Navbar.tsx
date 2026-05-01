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
      <Link href="/" className="flex items-center gap-4 group">
         <div className="w-10 h-10 bg-[#4c1d95] border border-[#d4af37]/30 rounded-xl flex items-center justify-center text-[#d4af37] font-black text-xl shadow-lg shadow-[#4c1d95]/40 transition-transform group-hover:rotate-12 group-hover:border-[#d4af37]">
           F
         </div>
         <span className="font-bold text-2xl tracking-tighter gold-text-glow uppercase">Filmsvib</span>
      </Link>

      {/* ── NAV ── */}
      <div className="hidden lg:flex items-center gap-10">
         <Link href="/" className="text-sm font-semibold text-white/60 hover:text-[#d4af37] transition-colors">الرئيسية</Link>
         <Link href="/trending" className="text-sm font-semibold text-white/60 hover:text-[#d4af37] transition-colors">الرائج</Link>
         <Link href="/news" className="text-sm font-semibold text-white/60 hover:text-[#d4af37] transition-colors">الأخبار</Link>
         <Link href="/admin" className="text-sm font-bold text-[#d4af37] hover:brightness-125">لوحة المدير</Link>
      </div>

      {/* ── SEARCH & AUTH ── */}
      <div className="flex items-center gap-6">
        <SearchBar />
        {user ? (
          <button onClick={handleLogout} className="text-[11px] font-bold text-white/40 hover:text-white">خروج</button>
        ) : (
          <Link href="/auth" className="btn-royal-gold text-[10px] py-2 px-8">دخول</Link>
        )}
      </div>
    </nav>
  )
}
