import { createClient } from "@/utils/supabase/server"
import { notFound, redirect } from "next/navigation"
import EditArticleClient from "./EditArticleClient"

export default async function EditArticlePage(props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const supabase = await createClient()
    
    const { data: authData } = await supabase.auth.getUser()
    const user = authData?.user

    if (!user) {
      redirect(`/auth?redirect=/admin/articles/edit/${params.id}`)
    }

    // Check for admin role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle()

    if (profile?.role !== "admin" && profile?.role !== "super_admin") {
      redirect("/")
    }

    const { data: article, error } = await supabase
      .from("articles")
      .select("*")
      .eq("id", params.id)
      .maybeSingle()

    if (error || !article) {
      return notFound()
    }

    return (
      <main className="min-h-screen pt-8 pb-20 bg-[#0a0a0f]">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-black text-white mb-8 font-royal">تعديل المقال: {article.title}</h1>
          <EditArticleClient article={article} userId={user.id} />
        </div>
      </main>
    )
  } catch (error) {
    console.error("EditArticlePage Error:", error)
    return (
      <div className="p-20 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">حدث خطأ أثناء تحميل المقال</h1>
        <p className="text-gray-400">يرجى المحاولة مرة أخرى لاحقاً.</p>
        <a 
          href={`/admin/articles/edit/${params.id}`}
          className="mt-8 inline-block text-purple-400 hover:underline"
        >
          إعادة تحميل الصفحة
        </a>
      </div>
    )
  }
}
