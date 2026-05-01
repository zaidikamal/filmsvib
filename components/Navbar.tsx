import Link from "next/link"
import SearchBar from "./SearchBar"
import { getProfile } from "@/utils/supabase/queries"
import AuthButton from "./AuthButton"
import NotificationBell from "./NotificationBell"
import { createClient } from "@/utils/supabase/server"

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const profile = await getProfile()

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl transition-all duration-500">
      <div className="glass-card border border-white/10 rounded-[2rem] px-8 py-4 flex justify-between items-center gap-8 shadow-2xl">
        
        {/* LOGO: THE MARK OF EXCELLENCE */}
        <Link href="/" className="flex items-center gap-4 shrink-0 group">
           <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-500">
             <span className="text-white font-black text-lg italic">V</span>
           </div>
           <div className="flex flex-col -space-y-1">
             <span className="font-black text-xl tracking-tighter leading-none">FILMS<span className="text-purple-500">VIB</span></span>
             <span className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-500 font-orbitron">Intelligence Hub</span>
           </div>
        </Link>
        
        {/* NAVIGATION: THE CORE RADIUS */}
        <div className="hidden lg:flex items-center gap-8">
          <Link href="/" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Home</Link>
          <Link href="/exploration" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors flex items-center gap-2">
            Exploration
            <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-[8px] rounded-full border border-purple-500/20">NEW</span>
          </Link>
          <div className="relative group">
            <button className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors flex items-center gap-2">
              Cinema <span className="text-[10px] opacity-40">▼</span>
            </button>
            <div className="absolute top-full -left-4 mt-4 w-64 bg-[#0a0a0f]/95 backdrop-blur-3xl border border-white/10 rounded-3xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 z-50 shadow-2xl p-2">
              <Link href="/news?cat=global" className="flex items-center justify-between px-6 py-4 hover:bg-white/5 rounded-2xl transition-all group/item">
                <span className="text-xs font-bold">World Archives 🌍</span>
                <span className="text-purple-500 opacity-0 group-hover/item:opacity-100 translate-x-4 group-hover/item:translate-x-0 transition-all">→</span>
              </Link>
              <Link href="/news?cat=bts" className="flex items-center justify-between px-6 py-4 hover:bg-white/5 rounded-2xl transition-all group/item">
                <span className="text-xs font-bold">The Vault (BTS) 🎞️</span>
                <span className="text-purple-500 opacity-0 group-hover/item:opacity-100 translate-x-4 group-hover/item:translate-x-0 transition-all">→</span>
              </Link>
              <Link href="/news?cat=exclusive" className="flex items-center justify-between px-6 py-4 hover:bg-white/5 rounded-2xl transition-all group/item">
                <span className="text-xs font-bold">Exclusive Intel 📰</span>
                <span className="text-purple-500 opacity-0 group-hover/item:opacity-100 translate-x-4 group-hover/item:translate-x-0 transition-all">→</span>
              </Link>
            </div>
          </div>
          <Link href="/ai" className="text-xs font-black uppercase tracking-widest text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>
            </span>
            Oracle AI
          </Link>
          
          {/* ADMIN BYPASS LINK */}
          {(profile?.role?.toLowerCase() === 'admin' || user?.email === 'fr.capsules20@gmail.com') && (
            <Link 
              href="/admin" 
              className="px-5 py-2 bg-red-600/10 border border-red-500/20 rounded-full hover:bg-red-600 hover:border-red-600 group transition-all"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-red-500 group-hover:text-white">Commander</span>
            </Link>
          )}
        </div>

        {/* SEARCH & ACTIONS */}
        <div className="flex-1 max-w-xs hidden md:block group">
          <div className="relative">
             <SearchBar />
             <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
          </div>
        </div>

        <div className="flex items-center gap-6 shrink-0">
          {user && <NotificationBell />}
          <div className="h-8 w-px bg-white/5 hidden sm:block" />
          <AuthButton user={user} />
        </div>
      </div>
    </nav>
  )
}

