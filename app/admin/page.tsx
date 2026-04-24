import { createClient } from "@/utils/supabase/server"

export default async function AdminDashboard() {
  const supabase = createClient()
  
  // جلب إحصائيات سريعة
  const { count: usersCount } = await supabase
    .from("profiles")
    .select("*", { count: 'exact', head: true })

  const { count: adminsCount } = await supabase
    .from("profiles")
    .select("*", { count: 'exact', head: true })
    .eq("role", "admin")

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-white">نظرة عامة</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg relative overflow-hidden">
           <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-600/20 rounded-full blur-2xl -z-10" />
           <h3 className="text-gray-400 text-sm mb-2">إجمالي الأعضاء</h3>
           <p className="text-4xl font-bold font-orbitron">{usersCount || 0}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg relative overflow-hidden">
           <div className="absolute top-0 right-0 w-24 h-24 bg-purple-600/20 rounded-full blur-2xl -z-10" />
           <h3 className="text-gray-400 text-sm mb-2">إجمالي المدراء</h3>
           <p className="text-4xl font-bold font-orbitron">{adminsCount || 0}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg relative overflow-hidden">
           <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/20 rounded-full blur-2xl -z-10" />
           <h3 className="text-gray-400 text-sm mb-2">حالة النظام</h3>
           <p className="text-2xl font-bold text-green-400 flex items-center gap-2 mt-2">
             <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
             مستقر (Active)
           </p>
        </div>
      </div>
    </div>
  )
}
