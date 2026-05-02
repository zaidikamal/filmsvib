"use client"
import Link from "next/link"
import SearchBar from "./SearchBar"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import NotificationBell from "./NotificationBell"

export default function Navbar({ user }: { user: any }) {
  const router = useRouter()
  const supabase = createClient()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push("/")
  }

  return (
    <nav className={`nav-container transition-all duration-500 ${isScrolled ? 'py-3 bg-black/90 shadow-[0_4px_30px_rgba(0,0,0,0.8)] border-b-gold-dark/30' : 'py-6 bg-transparent border-transparent'}`} dir="rtl">
      
      {/* ── LOGO ── */}
      <Link href="/" className="flex items-center gap-4 group">
         <div className="w-10 h-10 bg-[#4c1d95] border border-[#d4af37]/30 rounded-xl flex items-center justify-center text-[#d4af37] font-black text-xl shadow-lg shadow-[#4c1d95]/40 transition-transform group-hover:rotate-12 group-hover:border-[#d4af37]">
           F
         </div>
         <span className="font-bold text-2xl tracking-tighter gold-text-glow uppercase">Filmsvib</span>
      </Link>

      {/* ── NAV ── */}
      <div className="hidden lg:flex items-center gap-8">
         <Link href="/news?cat=global" className="text-[13px] font-bold text-white/70 hover:text-[#d4af37] transition-all flex items-center gap-2">
           <span className="text-lg">🌍</span> السينما العالمية
         </Link>
         <Link href="/news?cat=indian" className="text-[13px] font-bold text-white/70 hover:text-[#d4af37] transition-all flex items-center gap-2">
           <span className="text-lg">🇮🇳</span> السينما الهندية
         </Link>
         <Link href="/news?cat=arabic" className="text-[13px] font-bold text-white/70 hover:text-[#d4af37] transition-all flex items-center gap-2">
           <span className="text-lg">🎬</span> السينما العربية
         </Link>
         <Link href="/news?cat=exclusives" className="text-[13px] font-bold text-white/70 hover:text-[#d4af37] transition-all flex items-center gap-2">
           <span className="text-lg">🤫</span> الأسرار والكواليس
         </Link>
         <Link href="/admin" className="text-[12px] font-black text-[#d4af37] border-r border-white/10 pr-6 mr-2 hover:brightness-125">المدير</Link>
      </div>

      {/* ── SEARCH & AUTH ── */}
      <div className="flex items-center gap-6">
        <SearchBar />
        {user ? (
          <div className="flex items-center gap-4">
            <NotificationBell />
            <Link href="/news/create" className="btn-royal-gold text-[11px] py-2 px-6">إضافة مقال ✍️</Link>
            <button onClick={handleLogout} className="text-[12px] font-bold text-white/40 hover:text-white transition-colors">خروج</button>
          </div>
        ) : (
          <Link href="/auth" className="btn-royal-gold text-[11px] py-2 px-8">دخول</Link>
        )}
      </div>
    </nav>
  )
}
