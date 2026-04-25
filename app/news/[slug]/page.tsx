import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import ArticleBookmarkButton from "@/components/ArticleBookmarkButton"
import ArticleViewTracker from "@/components/ArticleViewTracker"

export const revalidate = 60; // 1-minute caching for fresh news

// SEO Optimization
export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const supabase = await createClient()
  const { data: article } = await supabase
    .from("articles")
    .select("title, content, cover_image")
    .eq("slug", params.slug)
    .single()

  if (!article) return { title: "مقال غير موجود - Cinema News" }

  return {
    title: `${article.title} - Cinema News`,
    description: article.content.substring(0, 160), // First 160 characters for SEO
    openGraph: {
      title: article.title,
      description: article.content.substring(0, 160),
      images: article.cover_image ? [{ url: article.cover_image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
    }
  }
}

export default async function ArticlePage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const supabase = await createClient()
  
  // Fetch current article
  const { data: article } = await supabase
    .from("articles")
    .select(`
      *,
      users:author_id(email)
    `)
    .eq("slug", params.slug)
    .single()

  if (!article || !article.is_published) {
    return notFound()
  }

  // Fetch 3 related random or most recent articles excluding the current one
  const { data: relatedArticles } = await supabase
    .from("articles")
    .select("id, title, slug, cover_image, created_at, view_count")
    .eq("is_published", true)
    .neq("id", article.id)
    .order("created_at", { ascending: false })
    .limit(3)

  return (
    <main className="min-h-screen pt-24 pb-16">
      <ArticleViewTracker slug={params.slug} />
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <Link href="/news" className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors text-sm font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            العودة للمقالات
          </Link>
          <ArticleBookmarkButton articleId={article.id} />
        </div>
        
        <article className="bg-[#12121a] rounded-3xl overflow-hidden border border-white/5 shadow-2xl mb-16">
          {article.cover_image && (
            <div className="relative h-[50vh] min-h-[400px] w-full bg-black">
              <Image 
                src={article.cover_image}
                alt={article.title}
                fill
                priority
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12121a] via-[#12121a]/20 to-transparent" />
            </div>
          )}
          
          <div className="p-8 md:p-12 relative z-10 -mt-20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-red-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <span className="text-white text-sm font-bold">
                  {article.users?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <p className="text-white font-bold">{article.users?.email?.split('@')[0] || 'كاتب غير معروف'}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>{new Date(article.created_at).toLocaleDateString("ar-SA", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <span>•</span>
                  <span>{Math.ceil(article.content.length / 500)} دقيقة للقراءة</span>
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
              {article.title}
            </h1>
            
            <div className="prose prose-invert prose-purple max-w-none prose-lg leading-relaxed text-gray-300">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {article.content}
              </ReactMarkdown>
            </div>

            {article.movie_id && (
              <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                 <div>
                    <h3 className="text-xl font-bold text-white mb-2">فيلم مرتبط</h3>
                    <p className="text-gray-400">يوجد فيلم مرتبط بهذا المقال، يمكنك الإطلاع على تفاصيله وتقييمه.</p>
                 </div>
                 <Link href={`/movie/${article.movie_id}`} className="bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white font-bold py-3 px-8 rounded-full transition-all shrink-0">
                    عرض تفاصيل الفيلم
                 </Link>
              </div>
            )}
          </div>
        </article>

        {/* Related Articles Section */}
        {relatedArticles && relatedArticles.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">مقالات ذات صلة 🔥</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel: any) => (
                <Link href={`/news/${rel.slug}`} key={rel.id} className="group bg-[#12121a] rounded-2xl overflow-hidden border border-white/5 hover:border-purple-500/50 transition-all flex flex-col shadow-lg">
                  <div className="relative h-40 w-full bg-black/50">
                    <Image 
                      src={rel.cover_image || "/placeholder-hero.jpg"}
                      alt={rel.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 flex-1">
                    <h3 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                      {rel.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {new Date(rel.created_at).toLocaleDateString("ar-SA")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
