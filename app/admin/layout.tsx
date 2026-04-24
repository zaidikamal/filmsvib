import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
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
    <div className="flex min-h-screen pt-20 bg-[#0a0a0f]">
      {/* Sidebar الإدارة */}
      <aside className="w-64 bg-white/5 border-l border-white/10 p-6 hidden md:block">
         <h2 className="text-xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
           لوحة التحكم
         </h2>
         <ul className="space-y-2">
           <li>
             <a href="/admin" className="text-gray-300 hover:text-white hover:bg-white/10 block p-3 rounded-xl transition-all">
               📊 إحصائيات عامة
             </a>
           </li>
           <li>
             <a href="/admin/articles" className="text-gray-300 hover:text-white hover:bg-white/10 block p-3 rounded-xl transition-all">
               📰 إدارة المقالات
             </a>
           </li>
           <li>
             <a href="/admin/users" className="text-gray-300 hover:text-white hover:bg-white/10 block p-3 rounded-xl transition-all">
               👥 إدارة الأعضاء
             </a>
           </li>
           <li className="pt-4 border-t border-white/10">
             <a href="/" className="text-gray-500 hover:text-white hover:bg-white/5 block p-3 rounded-xl transition-all text-sm">
               ← العودة للموقع
             </a>
           </li>
         </ul>
      </aside>

      {/* محتوى لوحة التحكم */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
