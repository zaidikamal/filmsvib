import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth")
  }
  
  // التحقق من صلاحيات المدير (Admin)
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()
    
  if (profile?.role !== "admin") {
    redirect("/") // طرد المستخدم العادي
  }

  return (
    <div className="flex min-h-screen bg-[#07070a] text-white overflow-hidden">
      {/* ── Sidebar ── */}
      <aside className="w-72 bg-black/40 backdrop-blur-3xl border-l border-white/5 p-8 flex flex-col hidden xl:flex">
         <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-red-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="text-white font-black text-lg">F</span>
            </div>
            <span className="font-orbitron font-bold text-xl tracking-tighter">
              FILMS<span className="text-purple-500">VIB</span> <span className="text-[10px] bg-white/10 px-1 rounded text-gray-400">ADMIN</span>
            </span>
         </div>

         <nav className="flex-1">
           <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-6">القائمة الرئيسية</p>
           <ul className="space-y-3">
             <li>
               <a href="/admin" className="flex items-center gap-3 text-white bg-white/10 p-4 rounded-2xl border border-white/10 shadow-xl transition-all">
                 <span className="text-xl">📊</span>
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
                <p className="text-xs text-gray-500">متصل كـ</p>
                <p className="text-sm font-bold text-purple-400">المدير العام</p>
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
