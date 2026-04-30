import { createClient } from "@/utils/supabase/server"
import { getProfile } from "@/utils/supabase/queries"
import Link from "next/link"

export default async function AdminDashboard() {
  const supabase = await createClient()
  const profile = await getProfile()

  // 🚀 Single source of truth from our optimized database view
  const dbStart = Date.now()
  const { data: globalStats, error: statsError } = await supabase
    .from("global_cms_stats")
    .select("*")
    .single()
  const dbLatency = Date.now() - dbStart

  // Fetch contextual lists
  const [
    { data: recentArticles },
    { data: topArticles },
    { data: categoryStats },
    { count: aiQueriesCount }
  ] = await Promise.all([
    supabase
      .from("articles")
      .select("title, created_at, views, category, slug, status")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("articles")
      .select("title, views, slug")
      .order("views", { ascending: false })
      .limit(4),
    supabase
      .from("category_performance")
      .select("*"),
    supabase
      .from("ai_usage_logs")
      .select("*", { count: "exact", head: true })
  ])

  const isHealthy = !statsError

  // Mapping stats for the luxury grid
  const stats = [
    { 
      label: "إجمالي الأعضاء", 
      value: globalStats?.total_users || 0, 
      icon: "💎", 
      trend: "نمو مستمر", 
      color: "from-blue-600/20 to-indigo-600/20",
      accent: "bg-blue-500"
    },
    { 
      label: "المقالات المنشورة", 
      value: globalStats?.published_articles || 0, 
      icon: "📜", 
      trend: `${globalStats?.total_articles} إجمالي`, 
      color: "from-purple-600/20 to-pink-600/20",
      accent: "bg-purple-500"
    },
    { 
      label: "التفاعل العام", 
      value: globalStats?.total_comments || 0, 
      icon: "✨", 
      trend: `${globalStats?.pending_comments} معلق`, 
      color: "from-emerald-600/20 to-teal-600/20",
      accent: "bg-emerald-500"
    },
    { 
      label: "إجمالي المشاهدات", 
      value: (globalStats?.total_views || 0).toLocaleString(), 
      icon: "👁️", 
      trend: "تغطية عالمية", 
      color: "from-orange-600/20 to-red-600/20",
      accent: "bg-orange-500"
    },
  ]

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-1000">
      {/* 👑 Header Section */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-red-600/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-70 transition-opacity" />
        <div className="relative bg-[#0d0d12] border border-white/5 rounded-[2.5rem] p-10 flex flex-col md:flex-row justify-between items-center gap-8 backdrop-blur-3xl">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-purple-500/10 text-purple-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-purple-500/20">
                مركز العمليات الرئيسي
              </span>
              <div className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-3 font-cairo tracking-tight">
              لوحة التحكم <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-red-400">الاستراتيجية</span>
            </h1>
            <p className="text-gray-500 text-lg max-w-xl leading-relaxed">
              مرحباً بك في قلب Filmsvib. هنا حيث تتحول البيانات إلى رؤى سينمائية وتُدار الإمبراطورية الرقمية.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link href="/admin/analytics" className="px-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all font-bold text-center flex items-center justify-center gap-2">
              📊 تحليلات العمق
            </Link>
            <Link href="/admin/articles/create" className="px-8 py-4 bg-gradient-to-r from-purple-600 to-red-600 text-white rounded-2xl font-black shadow-2xl shadow-purple-500/30 hover:scale-105 active:scale-95 transition-all text-center flex items-center justify-center gap-2">
              ✍️ إنتاج محتوى جديد
            </Link>
          </div>
        </div>
      </div>

      {/* 💎 Luxury Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="relative group overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-50 transition-transform duration-700 group-hover:scale-110`} />
            <div className="relative bg-[#0d0d12]/60 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl hover:border-white/20 transition-all h-full flex flex-col justify-between">
              <div className="flex justify-between items-start mb-8">
                <div className={`w-14 h-14 rounded-2xl ${stat.accent}/10 border border-${stat.accent}/20 flex items-center justify-center text-3xl shadow-inner`}>
                  {stat.icon}
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
                   <span className="text-[9px] bg-white/5 text-white/40 px-2 py-0.5 rounded-full border border-white/5">{stat.trend}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-5xl font-black font-orbitron text-white leading-none tracking-tighter">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🧩 Intelligence Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Console: Content Performance */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-[#0d0d12] border border-white/5 rounded-[3rem] p-10 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 blur-[100px] pointer-events-none" />
            
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <span className="p-2 bg-white/5 rounded-xl text-lg">📈</span> أداء الأقسام السينمائية
              </h2>
              <span className="text-[10px] text-gray-600 font-mono">LIVE ENGINE v2.0</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {categoryStats?.map((cat: any) => (
                <div key={cat.category} className="space-y-3 group">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors capitalize">
                        {cat.category === 'global' ? 'السينما العالمية' : 
                         cat.category === 'indian' ? 'السينما الهندية' : 
                         cat.category === 'arab' ? 'السينما العربية' : cat.category}
                      </span>
                      <p className="text-[10px] text-gray-600">{cat.total_articles} مقال تم نشره</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-white">{cat.total_views}</span>
                      <p className="text-[9px] text-purple-400 font-bold uppercase tracking-tighter">View Reach</p>
                    </div>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden flex">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-600 to-red-600 rounded-full shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                      style={{ width: `${Math.min((cat.total_views / (globalStats?.total_views || 1)) * 100 * 5, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-[#0d0d12] border border-white/5 rounded-[3rem] p-10 shadow-2xl">
             <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  <span className="p-2 bg-white/5 rounded-xl text-lg">🎬</span> شريط النشاط الأخير
                </h2>
                <Link href="/admin/articles" className="text-xs font-bold text-gray-500 hover:text-white transition-all underline underline-offset-8 decoration-purple-500/30">إدارة الأرشيف</Link>
             </div>
             
             <div className="space-y-4">
               {recentArticles?.map((art: any) => (
                 <div key={art.slug} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.04] transition-all group cursor-pointer">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl group-hover:rotate-12 transition-transform">
                        {art.status === 'published' ? '✅' : '⏳'}
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">{art.title}</h4>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">{art.category}</span>
                          <span className="w-1 h-1 bg-white/10 rounded-full" />
                          <span className="text-[10px] text-gray-600">منذ {new Date(art.created_at).toLocaleTimeString("ar-SA", { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:flex flex-col items-end">
                      <span className="text-lg font-black text-white">{art.views || 0}</span>
                      <span className="text-[9px] text-gray-600 uppercase font-bold tracking-tighter">Realtime Views</span>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Sidebar: Performance & Health */}
        <div className="lg:col-span-4 space-y-8">
           {/* Hall of Fame */}
           <div className="bg-gradient-to-b from-[#1a1a2e] to-[#0d0d12] border border-white/10 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
              <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                <span className="text-2xl">🏆</span> الأكثر تأثيراً
              </h2>
              <div className="space-y-5">
                {topArticles?.map((art, i) => (
                  <div key={art.slug} className="flex items-center gap-4 p-4 bg-black/40 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all">
                    <span className="text-2xl font-black text-white/10 italic">0{i+1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-200 truncate">{art.title}</p>
                      <p className="text-[10px] text-purple-400 font-bold mt-1 uppercase tracking-tighter">{art.views} نقطة تأثير</p>
                    </div>
                  </div>
                ))}
              </div>
           </div>

           {/* Core Vitals */}
           <div className="bg-[#0d0d12] border border-white/5 rounded-[3rem] p-10 shadow-2xl">
              <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                <span className="text-2xl">🛡️</span> المؤشرات الحيوية
              </h2>
              <div className="space-y-4">
                 {[
                   { label: "زمن استجابة البيانات", value: `${dbLatency}ms`, status: dbLatency < 200 ? "OPTIMAL" : "SLOW" },
                   { label: "محرك الذكاء الاصطناعي", value: "READY", status: "ACTIVE" },
                   { label: "بث التعليقات اللحظي", value: "STREAMING", status: "ONLINE" }
                 ].map((vital, i) => (
                   <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                      <div>
                        <p className="text-xs text-gray-500 font-bold mb-1">{vital.label}</p>
                        <p className="text-sm font-black text-white font-orbitron">{vital.value}</p>
                      </div>
                      <div className="text-right">
                         <span className={`text-[8px] font-black px-2 py-1 rounded-md border ${vital.status === 'OPTIMAL' || vital.status === 'ACTIVE' || vital.status === 'ONLINE' ? 'text-green-500 border-green-500/20 bg-green-500/5' : 'text-yellow-500 border-yellow-500/20'}`}>
                           {vital.status}
                         </span>
                      </div>
                   </div>
                 ))}
              </div>

              {/* AI Recommendation Box */}
              <div className="mt-10 p-6 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-500/20 rounded-[2rem] relative group">
                <div className="absolute top-3 right-3 text-lg opacity-40 group-hover:rotate-12 transition-transform">🤖</div>
                <p className="text-[10px] text-indigo-400 font-black mb-3 uppercase tracking-widest">توصية المحلل الذكي</p>
                <p className="text-sm text-gray-300 leading-relaxed font-cairo">
                  "تحركات السوق تشير إلى زيادة الاهتمام بـ <strong>السينما الهندية</strong> هذا الأسبوع. ننصح بجدولة مقالين إضافيين لزيادة النمو."
                </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
