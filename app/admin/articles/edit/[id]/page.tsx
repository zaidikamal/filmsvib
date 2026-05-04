import { createClient } from "@/utils/supabase/server"
import { notFound, redirect } from "next/navigation"
import dynamic from "next/dynamic"
const EditArticleForm = dynamic(() => import("./EditArticleForm"), {
  ssr: false,
  loading: () => <div className="animate-pulse h-[600px] w-full bg-white/5 rounded-3xl border border-white/10"></div>
})

export default async function EditArticlePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") redirect("/")

  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("id", params.id)
    .single()

  if (!article) notFound()

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-white mb-2">تعديل المقال ✏️</h1>
        <p className="text-gray-500">قم بتحديث محتوى المقال أو تغيير تصنيفه.</p>
      </div>

      <EditArticleForm article={article} userId={user.id} />
    </div>
  )
}
