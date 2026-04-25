import { createClient } from "@/utils/supabase/server"
import RoleChanger from "@/components/RoleChanger"

export default async function UsersManagement() {
  const supabase = await createClient()

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .order("role", { ascending: false }) // admins first

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">إدارة الأعضاء</h1>
        <span className="text-gray-400 text-sm">{profiles?.length || 0} عضو مسجل</span>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="p-4 text-gray-400 font-normal text-sm">الاسم / البريد</th>
              <th className="p-4 text-gray-400 font-normal text-sm hidden md:table-cell">تاريخ الانضمام</th>
              <th className="p-4 text-gray-400 font-normal text-sm">الدور</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {error && (
              <tr>
                <td colSpan={3} className="p-6 text-center text-red-400 text-sm">
                  خطأ: {error.message}
                </td>
              </tr>
            )}
            {profiles?.map((profile: any) => (
              <tr key={profile.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-white text-sm">{profile.name || "بدون اسم"}</p>
                  <p className="text-xs text-gray-500 mt-0.5 font-mono">{profile.id?.substring(0, 12)}...</p>
                </td>
                <td className="p-4 text-sm text-gray-400 hidden md:table-cell">
                  {profile.updated_at
                    ? new Date(profile.updated_at).toLocaleDateString("ar-SA")
                    : "—"}
                </td>
                <td className="p-4">
                  <RoleChanger userId={profile.id} currentRole={profile.role || "user"} />
                </td>
              </tr>
            ))}
            {profiles?.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-400">
                  لا يوجد أعضاء حالياً.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
