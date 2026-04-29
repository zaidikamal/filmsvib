import { createClient } from "@/utils/supabase/server"
import RoleChanger from "@/components/RoleChanger"

export default async function UsersManagement() {
  const supabase = await createClient()

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .order("role", { ascending: false }) // admins first

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white">إدارة الأعضاء</h1>
          <p className="text-gray-500">تحكم بصلاحيات الأعضاء ومراقبة نشاطاتهم.</p>
        </div>
        <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3">
          <span className="text-xl">👥</span>
          <span className="text-white font-bold">{profiles?.length || 0} عضو</span>
        </div>
      </div>

      <div className="bg-[#12121a] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-widest border-b border-white/5">
                <th className="px-6 py-5 font-bold">المستخدم</th>
                <th className="px-6 py-5 font-bold">تاريخ الانضمام</th>
                <th className="px-6 py-5 font-bold">الدور والصلاحيات</th>
                <th className="px-6 py-5 font-bold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {error && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-red-400 text-sm">
                    خطأ: {error.message}
                  </td>
                </tr>
              )}
              {profiles?.map((profile: any) => (
                <tr key={profile.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-white font-bold border border-white/10">
                        {(profile.email || "U")[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm group-hover:text-purple-400 transition-colors">{profile.email || profile.name || "بدون اسم"}</p>
                        <p className="text-[10px] text-gray-500 font-mono mt-1">{profile.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      {profile.created_at
                        ? new Date(profile.created_at).toLocaleDateString("ar-SA")
                        : "—"}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="w-48">
                      <RoleChanger userId={profile.id} currentRole={profile.role || "user"} />
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <button className="text-gray-400 hover:text-red-400 p-2 hover:bg-white/10 rounded-lg transition-all" title="حذف العضو (قريباً)">
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
              {profiles?.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-gray-500 italic">
                    لا يوجد أعضاء حالياً.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
