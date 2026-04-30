import { createClient } from "@/utils/supabase/server"
import { getProfile } from "@/utils/supabase/queries"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function AdminDashboard() {
  const supabase = await createClient()
  const profile = await getProfile()

  // 1. حماية المسار: التأكد من أن المستخدم مدير عام
  if (!profile || profile.role !== 'admin') {
    redirect('/')
  }

  // 2. جلب الإحصائيات الشاملة بطلب واحد (Optimized View)
  const { data: stats } = await supabase
    .from('global_cms_stats')
    .select('*')
    .single()

  // 3. جلب آخر النشاطات (Articles & Users)
  const [
    { data: recentArticles },
    { data: recentUsers }
  ] = await Promise.all([
    supabase.from('articles').select('title, status, created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('profiles').select('email, role, created_at').order('created_at', { ascending: false }).limit(5)
  ])

  return (
    <div className="min-h-screen pb-20 space-y-12 animate-in fade-in duration-1000">
      
      {/* Header: The General Manager Greeting */}
      <div className="relative overflow-hidden rounded-[3rem] p-12 bg-gradient-to-br from-[#12121a] to-transparent border border-white/5 shadow-2xl">
         <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full" />
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-right">
               <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter">
                  مرحباً، <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">القائد</span> 🏛️
               </h1>
               <p className="text-gray-500 text-lg font-bold">مركز القيادة والسيطرة الشاملة لمنصة Filmsvib.</p>
            </div>
            <div className="flex gap-4">
               <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 text-center min-w-[150px]">
                  <p className="text-[10px] text-gray-500 uppercase font-black mb-1">حالة النظام</p>
                  <p className="text-green-400 font-black flex items-center justify-center gap-2">
                     <span className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
                     مستقر جداً
                  </p>
               </div>
            </div>
         </div>
      </div>

      {/* Grid 1: Strategic Intelligence (Stats) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "إجمالي المقالات", value: stats?.total_articles || 0, icon: "📄", color: "from-blue-600 to-cyan-500", link: "/admin/articles" },
          { label: "المقالات المنشورة", value: stats?.published_articles || 0, icon: "🌍", color: "from-green-600 to-emerald-500", link: "/admin/articles" },
          { label: "مراجعات معلقة", value: stats?.pending_articles || 0, icon: "⏳", color: "from-orange-600 to-red-500", link: "/admin/articles" },
          { label: "إجمالي المشاهدات", value: (stats?.total_views || 0).toLocaleString(), icon: "👁️", color: "from-purple-600 to-pink-500", link: "/admin/analytics" }
        ].map((item) => (
          <Link href={item.link} key={item.label} className="group relative bg-[#0a0a0f] border border-white/5 p-8 rounded-[2.5rem] overflow-hidden hover:border-purple-500/30 transition-all shadow-2xl">
            <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${item.color} opacity-5 blur-3xl`} />
            <div className="text-3xl mb-4">{item.icon}</div>
            <h3 className="text-gray-500 text-sm font-bold mb-1">{item.label}</h3>
            <p className="text-4xl font-black text-white group-hover:scale-105 transition-transform origin-right">{item.value}</p>
            <div className="mt-4 text-[10px] text-gray-700 font-bold uppercase tracking-widest flex items-center gap-2">
               إدارة الآن <span className="group-hover:translate-x-[-4px] transition-transform">←</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Grid 2: Core Management Modules */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Module: Content Nexus */}
        <div className="xl:col-span-2 space-y-6 bg-[#0a0a0f] border border-white/5 p-10 rounded-[3rem] shadow-2xl">
           <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                 <span className="w-2 h-8 bg-purple-600 rounded-full" />
                 آخر المقالات في الانتظار
              </h2>
              <Link href="/admin/articles" className="text-xs font-bold text-purple-400 hover:underline">عرض الكل</Link>
           </div>
           <div className="space-y-4">
              {recentArticles?.map((art) => (
                <div key={art.title} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.04] transition-all">
                   <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${art.status === 'published' ? 'bg-green-500' : art.status === 'pending' ? 'bg-orange-500' : 'bg-gray-500'}`} />
                      <h4 className="font-bold text-white max-w-md truncate">{art.title}</h4>
                   </div>
                   <div className="flex items-center gap-6">
                      <span className="text-[10px] text-gray-600 font-bold">{new Date(art.created_at).toLocaleDateString("ar-EG")}</span>
                      <button className="text-xs bg-white/5 px-4 py-2 rounded-xl hover:bg-white/10 transition-all font-bold">مراجعة</button>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Module: User Base */}
        <div className="space-y-6 bg-[#0a0a0f] border border-white/5 p-10 rounded-[3rem] shadow-2xl">
           <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                 <span className="w-2 h-8 bg-indigo-600 rounded-full" />
                 الأعضاء الجدد
              </h2>
              <Link href="/admin/users" className="text-xs font-bold text-indigo-400 hover:underline">الإدارة</Link>
           </div>
           <div className="space-y-6">
              {recentUsers?.map((user) => (
                <div key={user.email} className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-transparent border border-indigo-500/20 flex items-center justify-center text-xl">
                      👤
                   </div>
                   <div>
                      <h4 className="text-white font-bold text-sm truncate max-w-[150px]">{user.email.split('@')[0]}</h4>
                      <p className="text-[9px] text-indigo-400 font-black uppercase tracking-widest">{user.role}</p>
                   </div>
                   <div className="mr-auto text-[9px] text-gray-700 font-bold uppercase">
                      منذ {Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))} يوم
                   </div>
                </div>
              ))}
           </div>
           <div className="mt-8 pt-8 border-t border-white/5 text-center">
              <p className="text-[10px] text-gray-600 font-bold uppercase mb-4 tracking-tighter">إجمالي المجتمع</p>
              <p className="text-5xl font-black text-white">{stats?.total_users || 0}</p>
           </div>
        </div>

      </div>

      {/* Quick Access Grid: The General Manager's Toolkit */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[
          { label: "كتابة مقال", icon: "✍️", link: "/admin/articles/new" },
          { label: "التعليقات", icon: "💬", link: "/admin/comments" },
          { label: "التحليلات", icon: "📈", link: "/admin/analytics" },
          { label: "الإشعارات", icon: "🔔", link: "/admin/notifications" },
          { label: "الإعدادات", icon: "⚙️", link: "/admin/settings" },
          { label: "الأرشيف", icon: "🗄️", link: "/admin/archive" }
        ].map((tool) => (
          <Link href={tool.link} key={tool.label} className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] text-center hover:bg-white/5 hover:border-purple-500/20 transition-all group">
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{tool.icon}</div>
            <p className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">{tool.label}</p>
          </Link>
        ))}
      </div>

    </div>
  )
}
