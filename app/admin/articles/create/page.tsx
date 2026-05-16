import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import CreateArticleClient from "./CreateArticleClient"

export default async function CreateArticleAdminPage() {
  const supabase = await createClient()
  
  try {
    const { data: authData } = await supabase.auth.getUser()
    const user = authData?.user

    if (!user) {
      redirect("/auth?redirect=/admin/articles/create")
    }

    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">إضافة مقال جديد</h1>
        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl">
          <CreateArticleClient userId={user.id} />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Admin Create Page render error:", error)
    return (
      <div className="p-20 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">حدث خطأ في تحميل الصفحة</h1>
        <p className="text-gray-400">يرجى محاولة تسجيل الدخول مرة أخرى أو التحقق من اتصالك.</p>
      </div>
    )
  }
}
