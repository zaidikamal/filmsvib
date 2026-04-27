import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function CreateArticlePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // If admin, redirect to the premium admin dashboard creation page
  if (profile?.role === 'admin') {
    redirect("/admin/articles/create")
  }

  // If not admin, show unauthorized message (can be expanded later for verified authors)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#0a0a0f]">
      <div className="text-center space-y-6 max-w-md animate-fade-in">
        <span className="text-8xl block mb-6 animate-bounce">🚫</span>
        <h1 className="text-4xl font-black text-white font-cairo">غير مصرح لك بالوصول</h1>
        <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-[2rem]">
          <p className="text-gray-400 leading-relaxed font-medium">
            عذراً، صفحة كتابة المقالات والتقييمات مخصصة للإدارة أو الكتاب الموثقين فقط في هذه المرحلة.
          </p>
        </div>
        <div className="pt-8">
          <Link 
            href="/" 
            className="inline-block bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white px-12 py-4 rounded-2xl font-black transition-all shadow-xl shadow-purple-500/20 hover:scale-105 active:scale-95"
          >
            العودة للرئيسية
          </Link>
        </div>
        <p className="text-[10px] text-gray-600 uppercase tracking-widest pt-12">Security Protocol Active</p>
      </div>
    </div>
  )
}
