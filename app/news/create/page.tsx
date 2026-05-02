import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import UserArticleForm from "./UserArticleForm"
import Link from "next/link"

export default async function CreateArticlePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth?redirect=/news/create")
  }

  return (
    <main className="min-h-screen pt-8 pb-20 bg-[#0a0a0f]">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 animate-fade-in">
          <Link href="/news" className="hover:text-white transition-colors">الأخبار والمقالات</Link>
          <span>/</span>
          <span className="text-gray-300">مقال جديد</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 font-royal">أضف لمستك الإبداعية ✨</h1>
          <p className="text-gray-400 text-lg">أخبرنا بشيء لم نعرفه بعد عن عالم السينما.</p>
        </div>

        {/* The Form */}
        <UserArticleForm userId={user.id} />
      </div>
    </main>
  )
}
