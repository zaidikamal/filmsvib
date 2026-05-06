import { createClient } from "@/utils/supabase/server"
import { notFound, redirect } from "next/navigation"
import EditArticleClient from "./EditArticleClient"

export default async function EditArticlePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.getUser()
  const user = data?.user
  if (!user) {
    redirect("/auth")
  }

  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("id", params.id)
    .single()

  if (!article) return notFound()

  return (
    <main className="min-h-screen pt-8 pb-20 bg-[#0a0a0f]">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-black text-white mb-8 font-royal">تعديل المقال: {article.title}</h1>
        <EditArticleClient article={article} userId={user.id} />
      </div>
    </main>
  )
}
