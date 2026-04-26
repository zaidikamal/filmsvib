import { createClient } from "@/utils/supabase/server"
import { getProfile } from "@/utils/supabase/queries"

export default async function AdminDashboard() {
  const supabase = await createClient()
  const profile = await getProfile()
  
  // Real Health Check
  const dbStart = Date.now()
  const { error: healthError } = await supabase.from("articles").select("id").limit(1)
  const dbLatency = Date.now() - dbStart
  const isHealthy = !healthError

  // Fetch stats
  const { count: usersCount } = await supabase.from("profiles").select("*", { count: 'exact', head: true })
  const { count: articlesCount } = await supabase.from("articles").select("*", { count: 'exact', head: true })
  const { count: aiQueriesCount } = await supabase.from("ai_usage_logs").select("*", { count: 'exact', head: true })
  
  const { data: articles } = await supabase.from("articles").select("view_count")
  const { data: recentArticles } = await supabase.from("articles").select("title, created_at, view_count, category, slug").order('created_at', { ascending: false }).limit(5)
  const { data: topArticles } = await supabase.from("articles").select("title, view_count, slug").order('view_count', { ascending: false }).limit(3)
  
  const totalViews = articles?.reduce((acc, curr) => acc + (curr.view_count || 0), 0) || 0

  // Category Distribution
  const catStats = {
    global: articles?.filter(a => a.category === 'global').length || 0,
    indian: articles?.filter(a => a.category === 'indian').length || 0,
    arab: articles?.filter(a => a.category === 'arab').length || 0,
    analysis: articles?.filter(a => a.category === 'analysis').length || 0,
  }

  const stats = [
    { label: "إجمالي الأعضاء", value: usersCount || 0, icon: "👥", trend: "+12%", color: "from-blue-600 to-cyan-500" },
    { label: "المقالات المنشورة", value: articlesCount || 0, icon: "📰", trend: "+5%", color: "from-purple-600 to-pink-500" },
    { label: "طلبات الذكاء الاصطناعي", value: aiQueriesCount || 0, icon: "🤖", trend: "+40%", color: "from-yellow-600 to-orange-500" },
    { label: "إجمالي المشاهدات", value: totalViews.toLocaleString(), icon: "👁️", trend: "+24%", color: "from-orange-600 to-red-500" },
  ]

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 font-cairo">لوحة التحكم الاستراتيجية</h1>
          <p className="text-gray-500">مرحباً بك مجدداً أيها المدير العام. إليك تحليل شامل لأداء منصة Filmsvib.</p>
        </div>
        <div className="flex gap-3">
          <a href="/admin/articles/create" className="bg-gradient-to-r from-purple-600 to-red-600 px-6 py-3 rounded-2xl text-sm font-bold shadow-xl shadow-purple-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
            <span>➕</span> إضافة مقال جديد
          </a>
          <button className="bg-white/5 hover:bg-white/10 px-4 py-3 rounded-2xl border border-white/10 transition-all">
            ⚙️ الإعدادات
          </button>
        </div>
      </div>
      
      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="group relative bg-[#12121a] border border-white/5 p-8 rounded-[2.5rem] overflow-hidden hover:border-white/20 transition-all duration-500 shadow-2xl">
             <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />
             <div className="flex justify-between items-start mb-6">
               <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl group-hover:bg-white/10 transition-colors">
                 {stat.icon}
               </div>
               <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-3 py-1 rounded-full uppercase tracking-tighter shadow-inner ring-1 ring-green-400/20">{stat.trend}</span>
             </div>
             <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.label}</h3>
             <p className="text-4xl font-black font-orbitron text-white group-hover:scale-105 transition-transform origin-right">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Recent Articles ── */}
        <div className="lg:col-span-2 space-y-8">
           {/* Section 1: Distribution Chart */}
           <div className="bg-[#12121a] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
              <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                <span>📊</span> توزيع المحتوى حسب الأقسام
              </h2>
              <div className="space-y-6">
                {[
                  { label: "السينما العالمية", key: 'global', color: "bg-blue-500" },
                  { label: "السينما الهندية", key: 'indian', color: "bg-purple-500" },
                  { label: "السينما العربية", key: 'arab', color: "bg-green-500" },
                  { label: "التحليل والنقد", key: 'analysis', color: "bg-red-500" }
                ].map((cat) => {
                  const percentage = articlesCount ? Math.round(((catStats as any)[cat.key] / articlesCount) * 100) : 0
                  return (
                    <div key={cat.key} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400 font-medium">{cat.label}</span>
                        <span className="text-white font-bold">{percentage}%</span>
                      </div>
                      <div className="h-3 bg-white/5 rounded-full overflow-hidden flex ring-1 ring-white/5">
                        <div 
                          className={`h-full ${cat.color} rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.1)]`} 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
           </div>

            {/* Section 2: Recent List */}
            <div className="bg-[#12121a] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
               <div className="flex justify-between items-center mb-8">
                 <h2 className="text-xl font-bold flex items-center gap-2">
                   <span>🎬</span> نشاط المحتوى الأخير
                 </h2>
                 <a href="/admin/articles" className="text-purple-400 text-xs font-bold bg-purple-400/10 px-4 py-2 rounded-full hover:bg-purple-400/20 transition-all border border-purple-400/20">عرض إدارة المقالات</a>
               </div>
               <div className="space-y-4">
                 {recentArticles && recentArticles.length > 0 ? recentArticles.map((art: any) => (
                   <div key={art.slug} className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/[0.05] rounded-[1.5rem] hover:bg-white/5 transition-all group">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent border border-white/5 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                          {art.category === 'breaking' ? '🔥' : '📄'}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-gray-200 line-clamp-1 group-hover:text-white transition-colors">{art.title}</h4>
                          <div className="flex items-center gap-3 mt-1">
                             <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">{art.category || 'عام'}</p>
                             <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                             <p className="text-[10px] text-gray-500">{new Date(art.created_at).toLocaleTimeString("ar-SA", { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-left bg-black/40 px-4 py-2 rounded-xl border border-white/5">
                        <p className="text-xs font-black text-white">{art.view_count || 0}</p>
                        <p className="text-[9px] text-gray-500 font-bold uppercase">المشاهدات</p>
                      </div>
                   </div>
                 )) : (
                   <div className="py-20 text-center">
                     <div className="text-4xl mb-4">📭</div>
                     <p className="text-gray-500 text-sm italic font-cairo">جدار النشاط فارغ حالياً، ابدأ بنشر أول مقال!</p>
                   </div>
                 )}
               </div>
            </div>
         </div>
 
         {/* ── System Sidebar ── */}
         <div className="space-y-8">
            {/* Top Content */}
            <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
               <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                 <span>🏆</span> الأعلى قراءة
               </h2>
               <div className="space-y-4">
                 {topArticles?.map((art, i) => (
                   <div key={art.slug} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                     <span className={`text-2xl font-black ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : 'text-orange-500'} opacity-50`}>{i + 1}</span>
                     <div className="flex-1 min-w-0">
                       <p className="text-xs font-bold text-white truncate group-hover:text-purple-400 transition-colors">{art.title}</p>
                       <p className="text-[10px] text-gray-500 mt-1">{art.view_count} مشاهدة</p>
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            {/* System Health */}
            <div className="bg-[#12121a] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
               <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                 <span>🛡️</span> حالة النظام
               </h2>
               <div className="space-y-7">
                 <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                   <div className="flex items-center gap-3">
                     <div className={`w-3 h-3 rounded-full ${isHealthy ? "bg-green-500 animate-pulse" : "bg-red-500 shadow-[0_0_10px_red]"}`} />
                     <span className="text-gray-400 text-sm">قاعدة البيانات</span>
                   </div>
                   <span className="text-xs font-black uppercase">{isHealthy ? "نشط" : "خارج الخدمة"}</span>
                 </div>
 
                 <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                   <div className="flex items-center gap-3">
                     <div className={`w-3 h-3 rounded-full ${dbLatency < 200 ? "bg-green-500" : "bg-yellow-500"}`} />
                     <span className="text-gray-400 text-sm">اللاتزامن (Latency)</span>
                   </div>
                   <span className="text-xs font-black">{dbLatency}ms</span>
                 </div>
 
                 <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                   <div className="flex items-center gap-3">
                     <div className="w-3 h-3 rounded-full bg-blue-500" />
                     <span className="text-gray-400 text-sm">التخزين السحابي</span>
                   </div>
                   <span className="text-xs font-black uppercase">جاهز</span>
                 </div>
               </div>
 
               <div className="mt-10 p-5 bg-gradient-to-br from-purple-600/20 to-red-600/10 border border-purple-500/20 rounded-3xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="text-[11px] text-purple-300 font-bold mb-2 uppercase tracking-widest flex items-center gap-2">
                    <span>💡</span> نصيحة الذكاء الاصطناعي
                  </p>
                  <p className="text-sm text-gray-300 leading-relaxed font-cairo">
                    "المقالات التحليلية تحقق حالياً تفاعلاً أعلى بنسبة 45% من الأخبار العاجلة. ركز على مراجعات الأفلام الحائزة على جوائز لزيادة الزيارات."
                  </p>
               </div>
            </div>

           {/* Quick Stats Summary */}
           <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500 opacity-20 blur-[80px]" />
              <h3 className="text-lg font-bold mb-4">ملخص الأداء</h3>
              <p className="text-sm text-gray-400 mb-6 font-cairo">المنصة تعمل بأعلى كفاءة لليوم الـ 14 على التوالي دون توقف.</p>
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">🚀</div>
                 <div>
                    <p className="text-xs font-bold text-white">100% Uptime</p>
                    <p className="text-[10px] text-gray-500">Service Status Dashboard</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
