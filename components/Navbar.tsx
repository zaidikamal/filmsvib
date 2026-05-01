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
    <nav className="fixed top-12 left-0 right-0 z-40 bg-[#050507]/80 backdrop-blur-3xl border-b border-white/5 py-3 px-8 lg:px-24 flex items-center justify-between" dir="rtl">
      
      {/* ── LEFT: USER & ACTIONS ── */}
      <div className="flex items-center gap-6">
        <button 
          onClick={handleLogout}
          className="text-[10px] font-bold text-gray-500 hover:text-red-500 transition-colors uppercase tracking-widest"
        >
          خروج
        </button>
        
        <div className="hidden md:flex items-center gap-2 text-[10px] text-gray-600 font-medium">
           <span>متصل كـ</span>
           <span className="text-gray-300 font-bold">{user?.email?.split('@')[0] || 'Admin'}</span>
        </div>

        <button className="relative p-2 bg-white/5 rounded-xl border border-white/10 hover:border-purple-500/30 transition-all">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-yellow-500/80">
             <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
           </svg>
           <div className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-yellow-500 rounded-full border border-[#050507]" />
        </button>

        <div className="hidden lg:block">
           <SearchBar />
        </div>
      </div>

      {/* ── CENTER: NAVIGATION ── */}
      <div className="hidden xl:flex items-center gap-10">
        <Link href="/admin" className="admin-button group">
           <div className="red-dot" />
           <span className="text-[10px] font-bold uppercase tracking-widest">لوحة المدير</span>
           <span className="text-base grayscale group-hover:grayscale-0 transition-all">🛠️</span>
        </Link>
        
        <Link href="/favorites" className="nav-link group">
           <span className="text-base group-hover:scale-110 transition-transform">💟</span>
           <span className="text-[9px] font-bold uppercase tracking-[0.2em]">المفضلة</span>
        </Link>

        <Link href="/ai" className="nav-link group">
           <span className="text-base group-hover:scale-110 transition-transform">✨</span>
           <span className="text-[9px] font-bold uppercase tracking-[0.2em]">اقتراح ذكي</span>
        </Link>

        <Link href="/cinema" className="nav-link group">
           <span className="text-base group-hover:scale-110 transition-transform">🎬</span>
           <span className="text-[9px] font-bold uppercase tracking-[0.2em]">السينما</span>
        </Link>

        <Link href="/" className="nav-link text-white border-b-2 border-purple-600 pb-2">
           <span className="text-[9px] font-bold uppercase tracking-[0.2em]">الرئيسية</span>
        </Link>
      </div>

      {/* ── RIGHT: LOGO ── */}
      <Link href="/" className="flex items-center gap-4 group">
         <span className="font-bold text-xl tracking-tighter uppercase text-white">Films<span className="text-purple-500 transition-colors">vib</span></span>
         <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-800 flex items-center justify-center shadow-lg shadow-purple-900/20">
           <span className="text-white font-black text-lg">F</span>
         </div>
      </Link>
    </nav>
  )
}
