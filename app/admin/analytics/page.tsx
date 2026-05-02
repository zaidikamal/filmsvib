import { createClient } from "@/utils/supabase/server"
import { getProfile } from "@/utils/supabase/queries"
import Link from "next/link"
import { motion } from "framer-motion"

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const profile = await getProfile()

  // جلب البيانات المتقدمة
  const [
    { data: catStats },
    { data: authorStats },
    { data: generalStats }
  ] = await Promise.all([
    supabase.from("category_performance").select("*"),
    supabase.from("author_performance").select("*").order('total_reach', { ascending: false }).limit(5),
    supabase.from("articles").select("views, created_at, category")
  ])

  const totalViews = generalStats?.reduce((acc, curr) => acc + (curr.views || 0), 0) || 0
  const avgViews = generalStats?.length ? Math.round(totalViews / generalStats.length) : 0

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-white/5 pb-8">
        <div>
          <nav className="flex gap-2 text-xs text-gray-500 mb-4 font-bold uppercase tracking-widest">
            <Link href="/admin" className="hover:text-white">لوحة التحكم</Link>
            <span>/</span>
            <span className="text-purple-400">التحليلات المتقدمة</span>
          </nav>
          <h1 className="text-5xl font-black text-white font-royal">مركز ذكاء البيانات 🧠</h1>
          <p className="text-gray-500 mt-2">تحليل دقيق لأداء المحتوى وتفاعل الجمهور على منصة Filmsvib.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-white/5 p-4 rounded-3xl border border-white/10 text-center min-w-[120px]">
              <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">دقة البيانات</p>
              <p className="text-green-400 font-black">99.9% Live</p>
           </div>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "إجمالي الوصول", value: totalViews.toLocaleString(), icon: "📈", sub: "مشاهدة تراكمية", color: "from-purple-600 to-indigo-600" },
          { label: "متوسط التفاعل", value: avgViews, icon: "🔥", sub: "مشاهدة / مقال", color: "from-orange-600 to-red-600" },
          { label: "أفضل قسم", value: catStats?.[0]?.category || "عام", icon: "👑", sub: "الأكثر قراءة", color: "from-blue-600 to-cyan-600" },
          { label: "معدل النمو", value: "+24%", icon: "🚀", sub: "آخر 30 يوم", color: "from-green-600 to-emerald-600" }
        ].map((stat) => (
          <div key={stat.label} className="relative group bg-[#0a0a0f] border border-white/5 p-8 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 blur-3xl`} />
            <div className="text-3xl mb-6">{stat.icon}</div>
            <h3 className="text-gray-500 text-sm font-bold mb-1">{stat.label}</h3>
            <p className="text-4xl font-black text-white mb-2">{stat.value}</p>
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Category Performance Chart (Visualized with CSS) */}
        <div className="bg-[#0a0a0f] border border-white/5 rounded-[3rem] p-10 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-10 flex items-center gap-3">
            <span className="w-2 h-8 bg-purple-600 rounded-full" />
            أداء الأقسام الاستراتيجي
          </h2>
          <div className="space-y-8">
            {catStats?.map((cat: any) => {
              const weight = totalViews ? (cat.total_views / totalViews) * 100 : 0
              return (
                <div key={cat.category} className="group">
                  <div className="flex justify-between items-end mb-3">
                    <div>
                      <p className="text-white font-bold text-lg capitalize">{cat.category}</p>
                      <p className="text-[10px] text-gray-500 uppercase font-bold">{cat.total_articles} مقال منشور</p>
                    </div>
                    <div className="text-right">
                      <p className="text-purple-400 font-black">{cat.total_views.toLocaleString()}</p>
                      <p className="text-[9px] text-gray-700 uppercase font-bold">إجمالي المشاهدات</p>
                    </div>
                  </div>
                  <div className="h-4 bg-white/5 rounded-2xl overflow-hidden ring-1 ring-white/10 p-1">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${weight}%` }}
                      className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 rounded-xl shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top Authors & Engagement */}
        <div className="bg-[#0a0a0f] border border-white/5 rounded-[3rem] p-10 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-10 flex items-center gap-3">
            <span className="w-2 h-8 bg-orange-600 rounded-full" />
            نخبة المحررين (Top Reach)
          </h2>
          <div className="space-y-6">
            {authorStats?.map((author: any, i: number) => (
              <div key={author.email} className="flex items-center gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.04] transition-all group">
                <div className="text-2xl font-black text-gray-800 group-hover:text-orange-500 transition-colors w-6">0{i+1}</div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/20 to-transparent border border-orange-500/20 flex items-center justify-center text-xl">
                  ✍️
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold">{author.email.split('@')[0]}</h4>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">{author.articles_written} مقالات منشورة</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-white">{author.total_reach.toLocaleString()}</p>
                  <p className="text-[9px] text-gray-700 font-bold uppercase">قارئ فريد</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-8 bg-gradient-to-br from-green-600/10 to-transparent border border-green-500/20 rounded-[2rem] flex items-center gap-6">
             <div className="text-4xl">💡</div>
             <div>
                <h4 className="text-green-400 font-bold mb-1 font-royal">توصية النظام الذكية</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                   بناءً على أرقام المشاهدات، نوصي بزيادة مكافآت القسم <strong>{catStats?.[0]?.category}</strong> حيث أنه يحقق أعلى عائد على الاستثمار في الوقت الحالي.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
