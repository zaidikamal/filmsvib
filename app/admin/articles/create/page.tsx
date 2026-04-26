import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import CreateArticleForm from "./CreateArticleForm"

export default async function CreateArticleAdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
  }

  // Double check admin role (redundant but safe)
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="animate-fade-in pb-20">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white mb-2">إنشاء مقال إبداعي</h1>
        <p className="text-gray-500 text-lg">أضف محتوى جديداً لمنصة Filmsvib وأبهر جمهورك.</p>
      </div>

      <CreateArticleForm userId={user.id} />
    </div>
  )
}
