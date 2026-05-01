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
    <nav className="fixed top-12 left-0 right-0 z-40 bg-[#050507]/60 backdrop-blur-3xl border-b border-white/5 py-3 px-6 flex items-center justify-between" dir="rtl">
      
      {/* ── LEFT: USER & ACTIONS ── */}
      <div className="flex items-center gap-6">
        <button 
          onClick={handleLogout}
          className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-red-500/10 hover:text-red-500 transition-all"
        >
          خروج
        </button>
        
        <div className="hidden md:flex items-center gap-2 text-[11px] text-gray-500 font-bold">
           <span>متصل كـ</span>
           <span className="text-gray-300">{user?.email?.split('@')[0] || 'fr.capsules20'}</span>
        </div>

        <button className="relative p-2 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-yellow-500">
             <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
           </svg>
           <div className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-yellow-500 rounded-full border-2 border-[#050507]" />
        </button>

        <div className="hidden lg:block">
           <SearchBar />
        </div>
      </div>

      {/* ── CENTER: NAVIGATION ── */}
      <div className="hidden xl:flex items-center gap-8">
        <Link href="/admin" className="admin-button group">
           <div className="red-dot" />
           <span className="text-[10px] font-black uppercase">لوحة المدير</span>
           <span className="text-lg">🛠️</span>
        </Link>
        
        <Link href="/favorites" className="nav-link">
           <span className="text-lg">💟</span>
           <span className="text-[10px] font-black uppercase">المفضلة</span>
        </Link>

        <Link href="/ai" className="nav-link">
           <span className="text-lg">✨</span>
           <span className="text-[10px] font-black uppercase">اقتراح ذكي</span>
        </Link>

        <Link href="/cinema" className="nav-link">
           <span className="text-lg">🎬</span>
           <span className="text-[10px] font-black uppercase">السينما</span>
        </Link>

        <Link href="/" className="nav-link text-white border-b-2 border-purple-500 pb-1">
           <span className="text-[10px] font-black uppercase">الرئيسية</span>
        </Link>
      </div>

      {/* ── RIGHT: LOGO ── */}
      <Link href="/" className="flex items-center gap-3 group">
         <span className="font-black text-2xl tracking-tighter uppercase text-white">Films<span className="text-white/60 group-hover:text-purple-500 transition-colors">vib</span></span>
         <div className="w-9 h-9 rounded-md bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/20">
           <span className="text-white font-black text-xl">F</span>
         </div>
      </Link>
    </nav>
  )
}
