import { createClient } from "@/utils/supabase/server"
import { getProfile } from "@/utils/supabase/queries"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const profile = await getProfile()
  
  const superAdminEmail = "fr.capsules20@gmail.com"
  const isAdmin = profile?.role === "admin" || user?.email === superAdminEmail
  
  if (!user || !isAdmin) {
    if (!user) redirect("/auth")
    
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4c1d95]/10 blur-[120px] rounded-full" />
        <div className="w-24 h-24 bg-[#d4af37]/10 rounded-full flex items-center justify-center text-5xl mb-8 animate-bounce border border-[#d4af37]/30 shadow-[0_0_30px_rgba(212,175,55,0.2)]">🚫</div>
        <h1 className="text-3xl font-black text-white mb-4 font-royal">منطقة محظورة</h1>
        <p className="text-gray-500 text-center max-w-md mb-10 leading-relaxed font-bold">
          عذراً، هذه المنطقة مخصصة حصرياً للإدارة العليا لمنصة Filmsvib. يرجى العودة للرئيسية إذا كنت تعتقد أن هناك خطأ.
        </p>
        <a href="/" className="btn-royal-gold">
          العودة للرئيسية
        </a>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#07070a] text-white overflow-hidden">
      {/* ── Sidebar ── */}
      <aside className="w-72 bg-black/40 backdrop-blur-3xl border-l border-white/5 p-8 flex flex-col hidden xl:flex">
         <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-[#4c1d95] flex items-center justify-center border border-[#d4af37]/30 shadow-lg shadow-[#4c1d95]/40">
              <span className="text-[#d4af37] font-black text-lg">F</span>
            </div>
            <span className="font-orbitron font-bold text-xl tracking-tighter">
              FILMS<span className="text-[#d4af37]">VIB</span> <span className="text-[10px] bg-[#d4af37]/10 border border-[#d4af37]/20 px-1 rounded text-[#d4af37]">ADMIN</span>
            </span>
         </div>

         <nav className="flex-1">
           <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-6">القائمة الرئيسية</p>
           <ul className="space-y-3">
             <li>
               <a href="/admin" className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-white/5 p-4 rounded-2xl transition-all group">
                 <span className="text-xl group-hover:scale-110 transition-transform">📊</span>
                 <span className="font-bold">نظرة عامة</span>
               </a>
             </li>
             <li>
               <a href="/admin/articles" className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-white/5 p-4 rounded-2xl transition-all group">
                 <span className="text-xl group-hover:scale-110 transition-transform">📰</span>
                 <span>إدارة المقالات</span>
               </a>
             </li>
             <li>
               <a href="/admin/users" className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-white/5 p-4 rounded-2xl transition-all group">
                 <span className="text-xl group-hover:scale-110 transition-transform">👥</span>
                 <span>إدارة الأعضاء</span>
               </a>
             </li>
             <li>
               <a href="/admin/comments" className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-white/5 p-4 rounded-2xl transition-all group">
                 <span className="text-xl group-hover:scale-110 transition-transform">💬</span>
                 <span>إدارة التعليقات</span>
               </a>
             </li>
           </ul>
         </nav>

         <div className="mt-auto pt-8 border-t border-white/5">
            <a href="/" className="flex items-center gap-3 text-gray-500 hover:text-white transition-colors text-sm">
              <span>🏠</span> العودة للموقع
            </a>
         </div>
      </aside>

      {/* ── Main Workspace ── */}
      <div className="flex-1 flex flex-col pt-16 xl:pt-0">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md sticky top-0 z-40">
           <h2 className="text-lg font-bold text-gray-300">نظام الإدارة المركزي</h2>
           <div className="flex items-center gap-4">
              <div className="text-left">
                <p className="text-sm font-black text-[#d4af37]">المدير العام</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xl">👤</div>
           </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  )
}
