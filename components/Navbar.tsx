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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050507]/60 backdrop-blur-3xl border-b border-white/5 py-3 px-8 flex items-center justify-between">
      
      {/* ── LOGO (MINIMALIST) ── */}
      <Link href="/" className="flex items-center gap-3 group shrink-0">
         <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center group-hover:bg-purple-500 transition-colors duration-500">
           <span className="text-black font-black text-sm">V</span>
         </div>
         <span className="font-black text-lg tracking-tighter uppercase font-orbitron">Films<span className="text-purple-500">vib</span></span>
      </Link>
      
      {/* ── CENTER NAVIGATION (REFINED) ── */}
      <div className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
        <Link href="/" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-colors">Intelligence</Link>
        <Link href="/exploration" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-colors relative group">
          Exploration
          <span className="absolute -top-1 -right-4 w-1 h-1 bg-purple-500 rounded-full scale-0 group-hover:scale-100 transition-transform" />
        </Link>
        <div className="relative group cursor-pointer">
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-colors">Archives</span>
           <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-48 bg-[#050507] border border-white/10 rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-2 shadow-2xl">
              <Link href="/news?cat=global" className="block px-4 py-3 text-[9px] font-bold uppercase tracking-widest hover:bg-white/5 rounded-xl">World Files</Link>
              <Link href="/news?cat=bts" className="block px-4 py-3 text-[9px] font-bold uppercase tracking-widest hover:bg-white/5 rounded-xl">The Vault</Link>
           </div>
        </div>
      </div>

      {/* ── RIGHT ACTIONS (INTEGRATED) ── */}
      <div className="flex items-center gap-6">
        <div className="hidden md:block w-48 relative group">
           <SearchBar />
           <div className="absolute bottom-0 left-0 w-0 h-px bg-purple-500 group-focus-within:w-full transition-all duration-700" />
        </div>
        
        <div className="flex items-center gap-4">
          {user && <NotificationBell />}
          
          {/* COMMANDER STATUS (DISCRETE) */}
          {(profile?.role?.toLowerCase() === 'admin' || user?.email === 'fr.capsules20@gmail.com') && (
            <Link href="/admin" className="w-8 h-8 rounded-full border border-red-500/20 flex items-center justify-center hover:bg-red-500/10 transition-colors">
              <span className="text-[8px] font-black text-red-500">A</span>
            </Link>
          )}
          
          <div className="h-4 w-px bg-white/10" />
          <AuthButton user={user} />
        </div>
      </div>
    </nav>
  )
}
