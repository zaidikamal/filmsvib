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
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#050507]/60 backdrop-blur-3xl border-b border-gold-dark/20 py-5 px-8 lg:px-20 flex items-center justify-between">
      
      {/* ── LOGO ── */}
      <Link href="/" className="flex items-center gap-3 group shrink-0">
         <div className="w-9 h-9 rounded-md bg-gradient-to-br from-gold-light to-gold-dark flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)] group-hover:scale-110 transition-all duration-500">
           <span className="text-black font-black text-lg italic">F</span>
         </div>
         <span className="font-black text-2xl tracking-tighter uppercase gold-gradient-text">Films<span className="text-white group-hover:text-gold-light transition-colors">vib</span></span>
      </Link>
      
      {/* ── NAVIGATION ── */}
      <div className="hidden lg:flex items-center gap-12 absolute left-1/2 -translate-x-1/2">
        <Link href="/" className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 hover:text-gold-light transition-colors">الرئيسية</Link>
        <Link href="/exploration" className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 hover:text-gold-light transition-colors">الأفلام</Link>
        <Link href="/trending" className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 hover:text-gold-light transition-colors">التريند</Link>
        <Link href="/ai" className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 hover:text-gold-light transition-colors">المستشار الذكي</Link>
      </div>

      {/* ── SYSTEM ACTIONS ── */}
      <div className="flex items-center gap-8">
        <div className="hidden md:block">
           <SearchBar />
        </div>
        
        <div className="flex items-center gap-5">
          {user && <NotificationBell />}
          
          <div className="flex items-center gap-4 border-l border-white/10 pl-6">
             <AuthButton user={user} />
             {user && (
               <Link href="/profile" className="w-8 h-8 rounded-full bg-gold-dark/10 border border-gold-dark/20 flex items-center justify-center hover:border-gold-light transition-colors">
                 <div className="w-4 h-4 bg-gold-dark rounded-full" />
               </Link>
             )}
          </div>
        </div>
      </div>
    </nav>
  )
}
