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
    <div className="fixed top-8 left-0 right-0 z-50 px-6 lg:px-20 flex justify-center" dir="rtl">
      <nav className="glass-island px-8 py-4 rounded-[2rem] flex items-center gap-12 max-w-7xl w-full justify-between overflow-hidden relative">
        
        {/* ── LOGO ── */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
           <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-rose-500 flex items-center justify-center text-white font-black text-xl shadow-lg">
             F
           </div>
           <span className="font-bold text-2xl tracking-tighter text-white hidden sm:block">Filmsvib</span>
        </Link>

        {/* ── NAV LINKS ── */}
        <div className="hidden lg:flex items-center gap-12">
           <Link href="/" className="text-sm font-bold text-white/50 hover:text-white transition-colors uppercase tracking-widest relative group">
             الرئيسية
             <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-rose-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-right" />
           </Link>
           <Link href="/cinema" className="text-sm font-bold text-white/50 hover:text-white transition-colors uppercase tracking-widest">السينما</Link>
           <Link href="/ai" className="text-sm font-bold text-white/50 hover:text-white transition-colors uppercase tracking-widest">الذكاء الاصطناعي</Link>
           <Link href="/admin" className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:bg-white/10 transition-all group">
             <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest">لوحة المدير</span>
           </Link>
        </div>

        {/* ── SEARCH & USER ── */}
        <div className="flex items-center gap-6">
           <div className="hidden md:block">
              <SearchBar />
           </div>
           {user ? (
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-[10px] font-black uppercase">
                   {user.email?.[0]}
                </div>
                <button onClick={handleLogout} className="text-[10px] font-black uppercase text-rose-500/80 hover:text-rose-500 transition-colors">خروج</button>
             </div>
           ) : (
             <Link href="/login" className="bg-white text-black px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform">دخول</Link>
           )}
        </div>

        {/* DECORATIVE LIGHTS */}
        <div className="absolute top-0 left-1/4 w-20 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
      </nav>
    </div>
  )
}
