import { createClient } from "@/utils/supabase/server"

export default async function UsersManagement() {
  const supabase = createClient()
  
  // Fetch profiles correctly formatted
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-white">إدارة الأعضاء</h1>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="p-4 text-gray-400 font-normal">البريد الإلكتروني</th>
              <th className="p-4 text-gray-400 font-normal">تاريخ التسجيل</th>
              <th className="p-4 text-gray-400 font-normal">الصلاحية</th>
              <th className="p-4 text-gray-400 font-normal">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 relative">
            {error && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-red-400">
                  يرجى التأكد من تشغيل ملف supabase_roles_setup.sql في Supabase قبل استخدام هذه الصفحة
                </td>
              </tr>
            )}
            {profiles?.map((profile: any) => (
              <tr key={profile.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-mono text-sm">{profile.email || "غير مدرج (سجل قبل التحديث)"}</td>
                <td className="p-4 text-sm text-gray-300">
                  {new Date(profile.created_at).toLocaleDateString('ar-SA')}
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    profile.role === "admin" 
                      ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                      : "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                  }`}>
                    {profile.role === "admin" ? "مدير" : "عضو"}
                  </span>
                </td>
                <td className="p-4">
                  {/* Actions can be interactive using a client component for changing roles */}
                  <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                    تعديل الصلاحية
                  </button>
                </td>
              </tr>
            ))}
            {profiles?.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-400">
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
