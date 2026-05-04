import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import CreateArticleClient from "./CreateArticleClient"

export default async function CreateArticleAdminPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth?redirect=/admin/articles/create")
  }

  return (
    <main className="min-h-screen pt-8 pb-20 bg-[#0a0a0f]">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-black text-white mb-8 font-royal">إضافة مقال جديد (لوحة الإدارة)</h1>
        <CreateArticleClient userId={user.id} />
      </div>
    </main>
  )
}
