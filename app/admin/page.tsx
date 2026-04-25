import { createClient } from "@/utils/supabase/server"

export default async function AdminDashboard() {
  const supabase = await createClient()
  
  // Fetch stats
  const { count: usersCount } = await supabase.from("profiles").select("*", { count: 'exact', head: true })
  const { count: articlesCount } = await supabase.from("articles").select("*", { count: 'exact', head: true })
  const { data: articles } = await supabase.from("articles").select("view_count")
  const { data: recentArticles } = await supabase.from("articles").select("title, created_at, view_count, category").order('created_at', { ascending: false }).limit(5)
  
  const totalViews = articles?.reduce((acc, curr) => acc + (curr.view_count || 0), 0) || 0

  const stats = [
    { label: "إجمالي الأعضاء", value: usersCount || 0, icon: "👥", trend: "+12%", color: "from-blue-600 to-cyan-500" },
    { label: "المقالات المنشورة", value: articlesCount || 0, icon: "📰", trend: "+5%", color: "from-purple-600 to-pink-500" },
    { label: "إجمالي المشاهدات", value: totalViews.toLocaleString(), icon: "👁️", trend: "+24%", color: "from-orange-600 to-red-500" },
    { label: "نشاط النظام", value: "مستقر", icon: "⚡", trend: "100%", color: "from-green-600 to-emerald-500" },
  ]

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">لوحة التحكم</h1>
          <p className="text-gray-500">مرحباً بك مجدداً، إليك ملخص لأداء المنصة اليوم.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white/5 hover:bg-white/10 px-6 py-2 rounded-xl text-sm font-bold border border-white/10 transition-all">تحميل التقارير</button>
          <button className="bg-gradient-to-r from-purple-600 to-red-600 px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-purple-500/20 transition-all">تحديث البيانات</button>
        </div>
      </div>
      
      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="group relative bg-[#12121a] border border-white/5 p-8 rounded-[2rem] overflow-hidden hover:border-white/20 transition-all">
             <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />
             <div className="flex justify-between items-start mb-6">
               <span className="text-3xl">{stat.icon}</span>
               <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-lg">{stat.trend}</span>
             </div>
             <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.label}</h3>
             <p className="text-4xl font-black font-orbitron text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Recent Articles ── */}
        <div className="lg:col-span-2 bg-[#12121a] border border-white/5 rounded-[2rem] p-8">
           <div className="flex justify-between items-center mb-8">
             <h2 className="text-xl font-bold">آخر المقالات المنشورة</h2>
             <a href="/admin/articles" className="text-purple-400 text-sm hover:underline">عرض الكل</a>
           </div>
           <div className="space-y-4">
             {recentArticles?.map((art: any) => (
               <div key={art.title} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/8 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">📄</div>
                    <div>
                      <h4 className="font-bold text-sm line-clamp-1">{art.title}</h4>
                      <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{art.category || 'عام'}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white">👁️ {art.view_count || 0}</p>
                    <p className="text-[10px] text-gray-500">{new Date(art.created_at).toLocaleDateString("ar-SA")}</p>
                  </div>
               </div>
             ))}
           </div>
        </div>

        {/* ── System Health ── */}
        <div className="bg-[#12121a] border border-white/5 rounded-[2rem] p-8 flex flex-col">
           <h2 className="text-xl font-bold mb-8">سلامة النظام</h2>
           <div className="space-y-6 flex-1">
             {[
               { name: "قاعدة البيانات", status: "نشط", color: "bg-green-500" },
               { name: "تخزين الصور", status: "نشط", color: "bg-green-500" },
               { name: "محرك البحث", status: "نشط", color: "bg-green-500" },
               { name: "أداء السيرفر", status: "98%", color: "bg-purple-500" },
             ].map((svc) => (
               <div key={svc.name} className="flex justify-between items-center">
                 <span className="text-gray-400 text-sm">{svc.name}</span>
                 <div className="flex items-center gap-2">
                   <span className="text-xs font-bold">{svc.status}</span>
                   <div className={`w-2 h-2 rounded-full ${svc.color}`} />
                 </div>
               </div>
             ))}
           </div>
           <div className="mt-8 p-4 bg-purple-600/10 border border-purple-500/20 rounded-2xl">
              <p className="text-xs text-purple-300 font-medium">نصيحة المدير: جرب تحديث قسم المقالات الهندية اليوم لزيادة التفاعل!</p>
           </div>
        </div>
      </div>
    </div>
  )
}
